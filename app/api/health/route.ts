import { ok } from '@/lib/api-response'

export const runtime = 'nodejs'
// Sin caché — los health checks deben reflejar el estado en tiempo real
export const dynamic = 'force-dynamic'

// Respuesta pública mínima: solo disponibilidad. No se expone versión, entorno
// ni uptime para no facilitar el perfilado del stack (divulgación de información).
export async function GET() {
  return ok({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
}
