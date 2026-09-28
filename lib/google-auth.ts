// Autenticación con Google mediante cuenta de servicio, sin dependencias
// externas: se arma y firma un JWT con el módulo `crypto` de Node y se canjea
// por un access token OAuth 2.0 (flujo "JWT bearer", el que Google documenta
// para server-to-server sin intervención de un usuario).
import { createSign } from 'crypto'

const TOKEN_URI = 'https://oauth2.googleapis.com/token'
const GRANT_TYPE = 'urn:ietf:params:oauth:grant-type:jwt-bearer'

// Los tokens de Google duran 1 hora. Se renueva un minuto antes de que expire
// para no arriesgar que caduque a mitad de una petición en curso.
const EXPIRY_MARGIN_MS = 60_000

// Caché en memoria del proceso. En Netlify cada función tiene su propia
// instancia, así que esto ahorra llamadas dentro de una misma instancia
// caliente; no es un caché compartido entre invocaciones frías.
let cached: { token: string; scope: string; expiresAt: number } | null = null

function base64url(input: string | Buffer): string {
  return Buffer.from(input).toString('base64url')
}

function readCredentials(): { clientEmail: string; privateKey: string } {
  const clientEmail = process.env.GOOGLE_SA_EMAIL
  const rawKey = process.env.GOOGLE_SA_PRIVATE_KEY

  if (!clientEmail || !rawKey) {
    throw new Error(
      'Faltan GOOGLE_SA_EMAIL o GOOGLE_SA_PRIVATE_KEY. ' +
        'Defínelas en .env.local y en las variables de entorno de Netlify.',
    )
  }

  // En un archivo .env la clave viaja en una sola línea con los saltos
  // escapados como \n; hay que devolverlos a saltos reales o el PEM no parsea.
  return { clientEmail, privateKey: rawKey.replace(/\\n/g, '\n') }
}

/**
 * Devuelve un access token válido para el scope pedido, reutilizando el
 * anterior mientras siga vigente.
 */
export async function getAccessToken(scope: string): Promise<string> {
  if (cached && cached.scope === scope && Date.now() < cached.expiresAt - EXPIRY_MARGIN_MS) {
    return cached.token
  }

  const { clientEmail, privateKey } = readCredentials()
  const issuedAt = Math.floor(Date.now() / 1000)

  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const payload = base64url(
    JSON.stringify({
      iss: clientEmail,
      scope,
      aud: TOKEN_URI,
      iat: issuedAt,
      exp: issuedAt + 3600,
    }),
  )

  const signer = createSign('RSA-SHA256')
  signer.update(`${header}.${payload}`)
  const assertion = `${header}.${payload}.${base64url(signer.sign(privateKey))}`

  const res = await fetch(TOKEN_URI, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: GRANT_TYPE, assertion }),
  })

  if (!res.ok) {
    // El cuerpo del error de Google no contiene la clave privada, solo el
    // motivo del rechazo (p. ej. "invalid_grant"), así que es seguro propagarlo.
    throw new Error(`Google OAuth respondió ${res.status}: ${await res.text()}`)
  }

  const data = (await res.json()) as { access_token: string; expires_in: number }
  cached = {
    token: data.access_token,
    scope,
    expiresAt: Date.now() + data.expires_in * 1000,
  }

  return data.access_token
}
