// Órdenes de pago persistidas en PostgreSQL. Cada transición de estado se hace
// con un UPDATE condicionado a status = 'PENDING': si dos solicitudes procesan
// la misma orden a la vez (recarga, doble envío), solo una la cierra.
//
// Importar SOLO desde código de servidor.
import { randomBytes, randomUUID } from 'crypto'
import { query } from './db'
import { santiagoInstant, SHOW_BLOCK_MINUTES, type BusyInterval } from './google-calendar'
import { webpayEnvironment, type TransactionResult, type WebpayEnvironment } from './webpay'

export type OrderStatus =
  | 'PENDING'
  | 'AUTHORIZED'
  | 'REJECTED'
  | 'ABORTED'
  | 'TIMEOUT'
  | 'FAILED'
  | 'REVERSED'

/**
 * Minutos que una orden pendiente retiene el horario mientras la clienta
 * paga. Cubre la vida del token (5 min) más el formulario de pago (4 min en
 * producción, 10 en integración), con margen.
 */
export const HOLD_MINUTES = 20

export interface NewOrder {
  buyOrder: string
  sessionId: string
  environment: WebpayEnvironment
  amount: number
  vedetoSlug: string
  tierId: string
  extras: string[]
  regionId: string
  communeName: string
  couponCode: string | null
  eventDate: string // YYYY-MM-DD
  eventTime: string // HH:MM
  contactName: string
  contactEmail: string
  contactPhone: string
  address: string
  ipHash: string | null
}

export interface Order extends NewOrder {
  token: string | null
  status: OrderStatus
  responseCode: number | null
  authorizationCode: string | null
  paymentTypeCode: string | null
  installmentsNumber: number | null
  installmentsAmount: number | null
  cardLast4: string | null
  vci: string | null
  transactionDate: Date | null
  calendarEventId: string | null
  createdAt: Date
}

// ─── Identificadores ─────────────────────────────────────────────────────────

const BASE32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

/**
 * Orden de compra: "LX" + 20 caracteres aleatorios (100 bits). Es la
 * referencia que ve la clienta y la llave para consultar su comprobante, por
 * eso no puede ser correlativa ni adivinable. 22 caracteres (Webpay admite 26).
 */
export function newBuyOrder(): string {
  const bytes = randomBytes(20)
  let out = 'LX'
  for (const b of bytes) out += BASE32[b & 31]
  return out
}

export const BUY_ORDER_RE = /^LX[A-Z2-7]{20}$/

export function newSessionId(): string {
  return randomUUID()
}

// ─── Lectura ─────────────────────────────────────────────────────────────────

// Las fechas se piden como texto: así no dependen de cómo el driver convierte
// el tipo `date` a la zona horaria del servidor.
const COLUMNS = `
  buy_order, session_id, token, environment, status, amount,
  vedeto_slug, tier_id, extras, region_id, commune_name, coupon_code,
  to_char(event_date, 'YYYY-MM-DD') AS event_date, event_time,
  contact_name, contact_email, contact_phone, address, ip_hash,
  response_code, authorization_code, payment_type_code,
  installments_number, installments_amount, card_last4, vci,
  transaction_date, calendar_event_id, created_at
`

interface OrderRow {
  buy_order: string
  session_id: string
  token: string | null
  environment: WebpayEnvironment
  status: OrderStatus
  amount: number
  vedeto_slug: string
  tier_id: string
  extras: string[] | null
  region_id: string
  commune_name: string
  coupon_code: string | null
  event_date: string
  event_time: string
  contact_name: string
  contact_email: string
  contact_phone: string
  address: string
  ip_hash: string | null
  response_code: number | null
  authorization_code: string | null
  payment_type_code: string | null
  installments_number: number | null
  installments_amount: number | null
  card_last4: string | null
  vci: string | null
  transaction_date: Date | string | null
  calendar_event_id: string | null
  created_at: Date | string
}

function toOrder(row: OrderRow): Order {
  return {
    buyOrder: row.buy_order,
    sessionId: row.session_id,
    token: row.token,
    environment: row.environment,
    status: row.status,
    amount: Number(row.amount),
    vedetoSlug: row.vedeto_slug,
    tierId: row.tier_id,
    extras: row.extras ?? [],
    regionId: row.region_id,
    communeName: row.commune_name,
    couponCode: row.coupon_code,
    eventDate: row.event_date,
    eventTime: row.event_time,
    contactName: row.contact_name,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    address: row.address,
    ipHash: row.ip_hash,
    responseCode: row.response_code,
    authorizationCode: row.authorization_code,
    paymentTypeCode: row.payment_type_code,
    installmentsNumber: row.installments_number,
    installmentsAmount: row.installments_amount,
    cardLast4: row.card_last4,
    vci: row.vci,
    transactionDate: row.transaction_date ? new Date(row.transaction_date) : null,
    calendarEventId: row.calendar_event_id,
    createdAt: new Date(row.created_at),
  }
}

export async function findOrderByBuyOrder(buyOrder: string): Promise<Order | null> {
  const rows = await query<OrderRow>(`SELECT ${COLUMNS} FROM orders WHERE buy_order = $1`, [buyOrder])
  return rows[0] ? toOrder(rows[0]) : null
}

export async function findOrderByToken(token: string): Promise<Order | null> {
  const rows = await query<OrderRow>(`SELECT ${COLUMNS} FROM orders WHERE token = $1`, [token])
  return rows[0] ? toOrder(rows[0]) : null
}

/** Instante desde el cual una orden pendiente sigue reteniendo su horario. */
function holdCutoff(): string {
  return new Date(Date.now() - HOLD_MINUTES * 60_000).toISOString()
}

/**
 * Bloques que ocupan las órdenes de un artista entre dos fechas: las pagadas
 * y las pendientes que siguen dentro de su retención. Incluye las órdenes en
 * que el artista participa como adicional. Solo cuentan las del ambiente
 * vigente, para que las pruebas de integración no bloqueen la agenda real.
 */
export async function busyIntervalsFromOrders(
  vedetoSlug: string,
  fromDate: string,
  toDate: string,
): Promise<BusyInterval[]> {
  const rows = await query<{ event_date: string; event_time: string }>(
    `SELECT to_char(event_date, 'YYYY-MM-DD') AS event_date, event_time
       FROM orders
      WHERE environment = $1
        AND event_date BETWEEN $2::date AND $3::date
        AND (vedeto_slug = $4 OR $4 = ANY (extras))
        AND (status = 'AUTHORIZED' OR (status = 'PENDING' AND created_at > $5::timestamptz))`,
    [webpayEnvironment(), fromDate, toDate, vedetoSlug, holdCutoff()],
  )

  return rows.map((r) => {
    const start = santiagoInstant(r.event_date, r.event_time)
    return { start, end: start + SHOW_BLOCK_MINUTES * 60_000 }
  })
}

/** Órdenes pendientes vigentes creadas desde una misma IP (anti-abuso). */
export async function countActivePendingByIp(ipHash: string): Promise<number> {
  const rows = await query<{ count: string | number }>(
    `SELECT count(*) AS count
       FROM orders
      WHERE ip_hash = $1 AND status = 'PENDING' AND created_at > $2::timestamptz`,
    [ipHash, holdCutoff()],
  )
  return Number(rows[0]?.count ?? 0)
}

// ─── Escritura ───────────────────────────────────────────────────────────────

export async function insertOrder(order: NewOrder): Promise<void> {
  await query(
    `INSERT INTO orders (
       buy_order, session_id, environment, amount,
       vedeto_slug, tier_id, extras, region_id, commune_name, coupon_code,
       event_date, event_time, contact_name, contact_email, contact_phone, address, ip_hash
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::date, $12, $13, $14, $15, $16, $17)`,
    [
      order.buyOrder,
      order.sessionId,
      order.environment,
      order.amount,
      order.vedetoSlug,
      order.tierId,
      order.extras,
      order.regionId,
      order.communeName,
      order.couponCode,
      order.eventDate,
      order.eventTime,
      order.contactName,
      order.contactEmail,
      order.contactPhone,
      order.address,
      order.ipHash,
    ],
  )
}

export async function setOrderToken(buyOrder: string, token: string): Promise<void> {
  await query(`UPDATE orders SET token = $2, updated_at = now() WHERE buy_order = $1`, [
    buyOrder,
    token,
  ])
}

/** Datos del resultado de Webpay que se guardan con la orden. */
function resultParams(result: Partial<TransactionResult> | undefined) {
  const last4 = result?.card_detail?.card_number?.slice(-4) ?? null
  return [
    result?.response_code ?? null,
    result?.authorization_code ?? null,
    result?.payment_type_code ?? null,
    result?.installments_number ?? null,
    result?.installments_amount ?? null,
    last4,
    result?.vci ?? null,
    result?.transaction_date ?? null,
  ]
}

/**
 * Cierra una orden pendiente con el estado indicado. Devuelve la orden
 * actualizada, o null si ya estaba cerrada (otra solicitud llegó primero).
 */
export async function closeOrder(
  buyOrder: string,
  status: Exclude<OrderStatus, 'PENDING'>,
  result?: Partial<TransactionResult>,
): Promise<Order | null> {
  const rows = await query<OrderRow>(
    `UPDATE orders
        SET status = $2,
            response_code = $3,
            authorization_code = $4,
            payment_type_code = $5,
            installments_number = $6,
            installments_amount = $7,
            card_last4 = $8,
            vci = $9,
            transaction_date = $10::timestamptz,
            updated_at = now()
      WHERE buy_order = $1 AND status = 'PENDING'
      RETURNING ${COLUMNS}`,
    [buyOrder, status, ...resultParams(result)],
  )
  return rows[0] ? toOrder(rows[0]) : null
}

export async function setCalendarEventId(buyOrder: string, eventId: string): Promise<void> {
  await query(
    `UPDATE orders SET calendar_event_id = $2, updated_at = now() WHERE buy_order = $1`,
    [buyOrder, eventId],
  )
}
