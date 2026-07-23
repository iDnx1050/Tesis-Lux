import { vedetos } from '@/lib/mock-data'
import { ok, apiError } from '@/lib/api-response'
import { logRequest } from '@/lib/logger'

export const revalidate = 3600

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const start = Date.now()
  const { slug } = await params

  const vedeto = vedetos.find((v) => v.slug === slug)

  if (!vedeto) {
    logRequest('GET', `/api/vedetos/${slug}`, 404, Date.now() - start)
    return apiError('Vedeto no encontrado', 404, 'NOT_FOUND')
  }

  logRequest('GET', `/api/vedetos/${slug}`, 200, Date.now() - start)
  return ok(vedeto)
}
