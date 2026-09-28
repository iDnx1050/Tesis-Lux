import { rateLimit } from '@/lib/rate-limiter'
import { rateLimitedResponse, apiError, created, addRateLimitHeaders } from '@/lib/api-response'
import { validateBooking } from '@/lib/validations'
import { vedetos } from '@/lib/mock-data'
import { getClientIp, hashIp } from '@/lib/get-client-ip'
import { logSecurityEvent, logRequest, logWarn, logInfo, logError } from '@/lib/logger'
import { createBookingEvent, isCalendarConfigured, isSlotFree } from '@/lib/google-calendar'

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

  const { time } = validation.data!
  const bookingId = `BK-${Date.now().toString(36).toUpperCase()}`

  // ─── Confirmación en Google Calendar ───────────────────────────────────────
  // Esta es la sección que debe moverse al callback de Transbank cuando el pago
  // esté implementado: el evento tiene que crearse SOLO con el pago aprobado.
  // Hoy, sin pasarela, se confirma aquí al recibir la reserva.
  let calendarEventId: string | null = null

  if (isCalendarConfigured()) {
    // Se revalida contra el calendario aunque el front ya haya mostrado el
    // bloque como libre: entre que la clienta vio la grilla y envió el
    // formulario pudieron pasar minutos, y otra persona pudo tomar el horario.
    try {
      if (!(await isSlotFree(vededoSlug, date, time))) {
        logWarn('Intento de reserva sobre un bloque ya ocupado', {
          ipHash,
          vededoSlug,
          date,
          time,
        })
        return apiError(
          'Ese horario acaba de ser reservado. Elige otro bloque disponible.',
          409,
          'SLOT_TAKEN',
        )
      }

      const event = await createBookingEvent({
        vedetoSlug: vededoSlug,
        vedetoName: vedeto.name,
        date,
        time,
        eventName: validation.data!.eventName,
        address: validation.data!.address,
        contactName: validation.data!.contactName,
        contactEmail: validation.data!.contactEmail,
        contactPhone: validation.data!.contactPhone,
        tierName: tier.name,
        bookingId,
        specialRequests: validation.data!.specialRequests,
      })
      calendarEventId = event.id
    } catch (err) {
      // Si Google falla no se puede garantizar que el bloque quede reservado.
      // Se responde con error en vez de confirmar una reserva que nadie anotó.
      logError('Fallo al agendar en Google Calendar', {
        bookingId,
        vededoSlug,
        date,
        time,
        error: err instanceof Error ? err.message : String(err),
      })
      return apiError(
        'No pudimos confirmar la agenda en este momento. Intenta nuevamente en unos minutos.',
        503,
        'CALENDAR_UNAVAILABLE',
      )
    }
  } else {
    // Sin credenciales (entorno local o demo) se cae a la disponibilidad de
    // respaldo del perfil, para que el flujo siga siendo probable.
    const slot = vedeto.availability.find((a) => a.date === date)
    if (slot && !slot.available) {
      return apiError('La fecha seleccionada no está disponible', 409, 'DATE_UNAVAILABLE')
    }
    logWarn('Reserva confirmada sin Google Calendar (credenciales ausentes)', { bookingId })
  }

  // Fase 2: persistir en BD (PostgreSQL + Prisma), enviar email de confirmación,
  // iniciar flujo de pago con Transbank, notificar al admin por webhook

  logSecurityEvent('BOOKING_CREATED', {
    ipHash,
    bookingId,
    vededoSlug,
    tierId,
    date,
  })
  logInfo('Booking created successfully', {
    bookingId,
    vededoSlug,
    tierId,
    // El logger no acepta null en los metadatos.
    calendarEventId: calendarEventId ?? undefined,
  })
  logRequest('POST', '/api/bookings', 201, Date.now() - start, { ipHash, bookingId })

  const response = created({
    bookingId,
    message: 'Reserva recibida. Te confirmaremos por email y WhatsApp.',
    vedeto: { name: vedeto.name, slug: vedeto.slug },
    tier: { name: tier.name, price: tier.price, duration: tier.duration },
    date,
    time,
  })

  return addRateLimitHeaders(response, rl)
}
