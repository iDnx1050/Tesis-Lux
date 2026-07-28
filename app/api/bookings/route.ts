import { rateLimit } from '@/lib/rate-limiter'
import { rateLimitedResponse, apiError, created, addRateLimitHeaders } from '@/lib/api-response'
import { validateBooking } from '@/lib/validations'
import { vedetos } from '@/lib/mock-data'
import { getClientIp, hashIp } from '@/lib/get-client-ip'
import { logSecurityEvent, logRequest, logWarn, logInfo } from '@/lib/logger'

export const runtime = 'nodejs'

// 3 intentos de reserva por IP por hora
const RATE_LIMIT = 3
const RATE_WINDOW_MS = 60 * 60 * 1000
const MAX_BODY_BYTES = 10_000

export async function POST(req: Request) {
  const start = Date.now()
  // IP desde fuente confiable de la plataforma; hash para los logs (no se
  // registra la IP en claro — es dato personal bajo la Ley 21.719).
  const ip = getClientIp(req)
  const ipHash = hashIp(ip)

  const rl = rateLimit(`booking:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)
  if (!rl.success) {
    logWarn('Rate limit exceeded on bookings', { ipHash })
    logSecurityEvent('RATE_LIMIT_EXCEEDED', { ipHash, endpoint: '/api/bookings' })
    return rateLimitedResponse(rl)
  }

  // Rechazar cuerpos grandes antes de leer/parsear (defensa en profundidad)
  const len = Number(req.headers.get('content-length') ?? 0)
  if (len > MAX_BODY_BYTES) {
    return apiError('Cuerpo demasiado grande', 413, 'PAYLOAD_TOO_LARGE')
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return apiError('Cuerpo de la solicitud inválido', 400, 'INVALID_BODY')
  }

  const validation = validateBooking(body)
  if (!validation.valid) {
    logSecurityEvent('VALIDATION_FAILED', {
      ipHash,
      endpoint: '/api/bookings',
      errors: validation.errors.join('; '),
    })
    return apiError(validation.errors.join(', '), 422, 'VALIDATION_ERROR')
  }

  const { vededoSlug, tierId, date } = validation.data!

  // Verificar que el vedeto existe
  const vedeto = vedetos.find((v) => v.slug === vededoSlug)
  if (!vedeto) {
    return apiError('Vedeto no encontrado', 404, 'NOT_FOUND')
  }

  // Verificar que el tier de servicio existe
  const tier = vedeto.pricing.find((p) => p.id === tierId)
  if (!tier) {
    return apiError('Tier de servicio no encontrado', 404, 'TIER_NOT_FOUND')
  }

  // Verificar disponibilidad de la fecha seleccionada
  const slot = vedeto.availability.find((a) => a.date === date)
  if (slot && !slot.available) {
    return apiError('La fecha seleccionada no está disponible', 409, 'DATE_UNAVAILABLE')
  }

  // Fase 2: persistir en BD (PostgreSQL + Prisma), enviar email de confirmación,
  // iniciar flujo de pago con Transbank, notificar al admin por webhook

  const bookingId = `BK-${Date.now().toString(36).toUpperCase()}`

  logSecurityEvent('BOOKING_CREATED', {
    ipHash,
    bookingId,
    vededoSlug,
    tierId,
    date,
  })
  logInfo('Booking created successfully', { bookingId, vededoSlug, tierId })
  logRequest('POST', '/api/bookings', 201, Date.now() - start, { ipHash, bookingId })

  const response = created({
    bookingId,
    message: 'Reserva recibida. Te confirmaremos por email y WhatsApp.',
    vedeto: { name: vedeto.name, slug: vedeto.slug },
    tier: { name: tier.name, price: tier.price, duration: tier.duration },
    date,
    time: validation.data!.time,
  })

  return addRateLimitHeaders(response, rl)
}
