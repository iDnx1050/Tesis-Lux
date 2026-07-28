import { rateLimit } from '@/lib/rate-limiter'
import { ok, apiError, rateLimitedResponse } from '@/lib/api-response'
import { getClientIp } from '@/lib/get-client-ip'

// Proxy de geocodificación: el servidor consulta a Nominatim (con User-Agent
// identificado, según su política de uso) en lugar de que el navegador del
// usuario envíe su dirección + su IP directamente a un tercero. Permite además
// mantener el CSP con connect-src 'self'.
export const runtime = 'nodejs'

const RATE_LIMIT = 30
const RATE_WINDOW_MS = 60 * 1000 // 30 consultas por minuto por IP

interface NominatimResult {
  display_name?: string
  lat?: string
  lon?: string
}

export async function GET(req: Request) {
  const ip = getClientIp(req)
  const rl = rateLimit(`geocode:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)
  if (!rl.success) return rateLimitedResponse(rl)

  const q = new URL(req.url).searchParams.get('q')?.trim() ?? ''
  if (q.length < 4 || q.length > 200) {
    return apiError('Consulta inválida (4-200 caracteres)', 422, 'INVALID_QUERY')
  }

  const url =
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}` +
    `&format=json&limit=5&countrycodes=cl&addressdetails=1`

  try {
    const res = await fetch(url, {
      headers: {
        'Accept-Language': 'es',
        'User-Agent': 'LuxxProducciones/1.0 (contacto@luxxproducciones.cl)',
      },
      // Cachear resultados de geocodificación 24h reduce llamadas al tercero
      next: { revalidate: 86400 },
    })

    if (!res.ok) {
      return apiError('Servicio de geocodificación no disponible', 502, 'UPSTREAM_ERROR')
    }

    const data: unknown = await res.json()
    // Devolver solo los campos que necesita la UI — no propagar el payload completo
    const slim = Array.isArray(data)
      ? (data as NominatimResult[]).slice(0, 5).map((d) => ({
          display_name: d.display_name ?? '',
          lat: d.lat ?? '',
          lon: d.lon ?? '',
        }))
      : []

    return ok(slim)
  } catch {
    return apiError('Error al geocodificar la dirección', 502, 'GEOCODE_ERROR')
  }
}
