import { vedetos } from '@/lib/mock-data'
import { getAvailabilitySafe } from '@/lib/availability'
import { ok, apiError } from '@/lib/api-response'
import { logRequest, logWarn } from '@/lib/logger'

// `crypto` (firma del JWT de Google) exige el runtime Node, no Edge.
export const runtime = 'nodejs'

// Se consulta el calendario en cada request: una disponibilidad cacheada es
// justamente lo que produce reservas dobles.
export const dynamic = 'force-dynamic'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const start = Date.now()
  const { slug } = await params

  const vedeto = vedetos.find((v) => v.slug === slug)
  if (!vedeto) {
    logRequest('GET', `/api/availability/${slug}`, 404, Date.now() - start)
    return apiError('Vedeto no encontrado', 404, 'NOT_FOUND')
  }

  const { slots, source } = await getAvailabilitySafe(slug, vedeto.availability)

  if (source === 'fallback') {
    logWarn('Disponibilidad servida desde respaldo, no desde Google Calendar', { slug })
  }

  logRequest('GET', `/api/availability/${slug}`, 200, Date.now() - start)

  // `source` viaja al cliente para que el checkout pueda avisar que los
  // horarios mostrados podrían no estar al día.
  return ok({ slug, source, availability: slots })
}
