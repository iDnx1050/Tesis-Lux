import { ok } from '@/lib/api-response'

export const runtime = 'nodejs'
// Sin caché — los health checks deben reflejar el estado en tiempo real
export const dynamic = 'force-dynamic'

export async function GET() {
  const start = Date.now()

  return ok({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? '0.1.0',
    environment: process.env.NODE_ENV ?? 'development',
    uptime: Math.floor(process.uptime()),
    latencyMs: Date.now() - start,
    services: {
      // Fase 2: agregar verificaciones reales para BD, caché y pasarela de pago
      api: 'ok',
    },
  })
}
