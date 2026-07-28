// Extracción de la IP del cliente desde una fuente confiable, y hash para logs.
import { createHash } from 'crypto'

/**
 * Obtiene la IP del cliente. NO usa el primer valor de X-Forwarded-For (el
 * cliente puede falsificarlo para evadir rate limiting). Prioriza el header que
 * agrega la plataforma (Netlify: x-nf-client-connection-ip) y, como fallback,
 * el ÚLTIMO valor de X-Forwarded-For, que es el que añade el proxy de confianza.
 */
export function getClientIp(req: Request): string {
  const netlifyIp = req.headers.get('x-nf-client-connection-ip')
  if (netlifyIp) return netlifyIp.trim()

  const xff = req.headers.get('x-forwarded-for')
  if (xff) {
    const parts = xff.split(',').map((s) => s.trim()).filter(Boolean)
    if (parts.length > 0) return parts[parts.length - 1]
  }

  return req.headers.get('x-real-ip')?.trim() ?? 'unknown'
}

/**
 * Hash truncado y con sal de la IP, para trazabilidad en logs sin almacenar el
 * dato personal en claro (Ley 21.719). Misma IP → mismo hash (permite correlación).
 * La sal debe ser secreta para que el hash no sea reversible (el espacio IPv4 es
 * pequeño); definir IP_HASH_SALT en producción.
 */
export function hashIp(ip: string): string {
  const salt =
    process.env.IP_HASH_SALT ?? process.env.AGE_GATE_SECRET ?? 'luxx-log-salt'
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 12)
}
