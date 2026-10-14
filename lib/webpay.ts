// Cliente de Webpay Plus (API REST v1.2 de Transbank).
//
// Se consume la API REST con fetch en vez del SDK oficial (transbank-sdk): son
// cuatro operaciones y el SDK arrastra axios como dependencia. Transbank
// documenta este camino como alternativa oficial ("Usando el API REST") y lo
// valida igual que una integración con SDK.
//
// Importar SOLO desde código de servidor: lee las credenciales del entorno.

const HOSTS = {
  integration: 'https://webpay3gint.transbank.cl',
  production: 'https://webpay3g.transbank.cl',
} as const

export type WebpayEnvironment = keyof typeof HOSTS

const API_PATH = '/rswebpaytransaction/api/webpay/v1.2/transactions'

// Credenciales del ambiente de integración, publicadas por Transbank en su
// documentación para Webpay Plus. Solo operan contra el host de pruebas.
const INTEGRATION_COMMERCE_CODE = '597055555532'
const INTEGRATION_API_KEY = '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C'

const REQUEST_TIMEOUT_MS = 15_000

// Largos máximos que acepta la API al crear una transacción.
const MAX_BUY_ORDER = 26
const MAX_SESSION_ID = 61
const MAX_RETURN_URL = 256

export class WebpayError extends Error {
  /** Código HTTP de Webpay, o null si no hubo respuesta (red, timeout). */
  readonly status: number | null

  constructor(message: string, status: number | null) {
    super(message)
    this.name = 'WebpayError'
    this.status = status
  }
}

/** Ambiente vigente según TRANSBANK_ENV; por defecto, integración. */
export function webpayEnvironment(): WebpayEnvironment {
  return process.env.TRANSBANK_ENV === 'production' ? 'production' : 'integration'
}

/**
 * En integración siempre hay credenciales (las públicas de Transbank). En
 * producción se exigen las propias del comercio.
 */
export function isWebpayConfigured(env: WebpayEnvironment = webpayEnvironment()): boolean {
  if (env === 'integration') return true
  return Boolean(process.env.TRANSBANK_COMMERCE_CODE && process.env.TRANSBANK_API_KEY)
}

function credentials(env: WebpayEnvironment) {
  if (env === 'integration') {
    return {
      host: HOSTS.integration,
      commerceCode: INTEGRATION_COMMERCE_CODE,
      apiKey: INTEGRATION_API_KEY,
    }
  }

  // En producción nunca se cae a las credenciales de prueba: el pago se
  // "aprobaría" en el ambiente de integración sin cobrar nada.
  const commerceCode = process.env.TRANSBANK_COMMERCE_CODE
  const apiKey = process.env.TRANSBANK_API_KEY
  if (!commerceCode || !apiKey) {
    throw new WebpayError('Faltan TRANSBANK_COMMERCE_CODE o TRANSBANK_API_KEY', null)
  }
  return { host: HOSTS.production, commerceCode, apiKey }
}

async function request<T>(
  env: WebpayEnvironment,
  method: 'GET' | 'POST' | 'PUT',
  path: string,
  body?: unknown,
): Promise<T> {
  const { host, commerceCode, apiKey } = credentials(env)

  let res: Response
  try {
    res = await fetch(`${host}${API_PATH}${path}`, {
      method,
      headers: {
        'Tbk-Api-Key-Id': commerceCode,
        'Tbk-Api-Key-Secret': apiKey,
        'Content-Type': 'application/json',
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cache: 'no-store',
    })
  } catch (err) {
    throw new WebpayError(
      `Sin respuesta de Webpay: ${err instanceof Error ? err.message : String(err)}`,
      null,
    )
  }

  const text = await res.text()
  let data: unknown = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    // Cuerpo no JSON (p. ej. una página de error del balanceador).
  }

  if (!res.ok) {
    const message =
      (data as { error_message?: string } | null)?.error_message ?? text.slice(0, 200)
    throw new WebpayError(`Webpay respondió ${res.status}: ${message}`, res.status)
  }

  return data as T
}

// El token llega en la URL de retorno (dato controlado por el usuario) y se
// usa como segmento de ruta: se valida antes de enviarlo a Transbank.
const TOKEN_RE = /^[A-Za-z0-9]{1,128}$/

export function isValidToken(token: string): boolean {
  return TOKEN_RE.test(token)
}

function tokenPath(token: string): string {
  if (!isValidToken(token)) throw new WebpayError('Token con formato inválido', null)
  return `/${encodeURIComponent(token)}`
}

// ─── Operaciones ─────────────────────────────────────────────────────────────

export interface CreatedTransaction {
  token: string
  /** URL del formulario de pago; se le envía token_ws por POST. */
  url: string
}

export async function createTransaction(
  input: { buyOrder: string; sessionId: string; amount: number; returnUrl: string },
  env: WebpayEnvironment = webpayEnvironment(),
): Promise<CreatedTransaction> {
  if (input.buyOrder.length > MAX_BUY_ORDER) throw new WebpayError('buy_order demasiado largo', null)
  if (input.sessionId.length > MAX_SESSION_ID) throw new WebpayError('session_id demasiado largo', null)
  if (input.returnUrl.length > MAX_RETURN_URL) throw new WebpayError('return_url demasiado larga', null)
  // En CLP el monto es un entero positivo.
  if (!Number.isInteger(input.amount) || input.amount <= 0) {
    throw new WebpayError('Monto inválido', null)
  }

  return request<CreatedTransaction>(env, 'POST', '', {
    buy_order: input.buyOrder,
    session_id: input.sessionId,
    amount: input.amount,
    return_url: input.returnUrl,
  })
}

/** Respuesta de commit y de status (tienen los mismos campos). */
export interface TransactionResult {
  vci?: string
  amount: number
  status: string
  buy_order: string
  session_id: string
  card_detail?: { card_number?: string }
  accounting_date?: string
  transaction_date?: string
  authorization_code?: string
  payment_type_code?: string
  response_code?: number
  installments_amount?: number
  installments_number?: number
  balance?: number
}

/** Confirma la transacción. Sin este paso Transbank no la da por cerrada. */
export async function commitTransaction(
  token: string,
  env: WebpayEnvironment = webpayEnvironment(),
): Promise<TransactionResult> {
  return request<TransactionResult>(env, 'PUT', tokenPath(token))
}

/** Consulta el estado sin modificarlo (sirve si el commit no respondió). */
export async function getTransactionStatus(
  token: string,
  env: WebpayEnvironment = webpayEnvironment(),
): Promise<TransactionResult> {
  return request<TransactionResult>(env, 'GET', tokenPath(token))
}

export interface RefundResult {
  /** REVERSED: se deshizo sin cargo. NULLIFIED: anulación con comprobante. */
  type: 'REVERSED' | 'NULLIFIED'
  authorization_code?: string
  nullified_amount?: number
  balance?: number
  response_code?: number
}

export async function refundTransaction(
  token: string,
  amount: number,
  env: WebpayEnvironment = webpayEnvironment(),
): Promise<RefundResult> {
  return request<RefundResult>(env, 'POST', `${tokenPath(token)}/refunds`, { amount })
}

/** Criterio de aprobación de Transbank: ambas condiciones a la vez. */
export function isApproved(result: TransactionResult): boolean {
  return result.response_code === 0 && result.status === 'AUTHORIZED'
}

const PAYMENT_TYPES: Record<string, string> = {
  VD: 'Débito',
  VP: 'Prepago',
  VN: 'Crédito',
  VC: 'Crédito en cuotas',
  SI: 'Crédito, 3 cuotas sin interés',
  S2: 'Crédito, 2 cuotas sin interés',
  NC: 'Crédito, cuotas sin interés',
}

export function paymentTypeLabel(code: string | null | undefined): string {
  return (code && PAYMENT_TYPES[code]) || 'No informado'
}
