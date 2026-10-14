import { rateLimit } from '@/lib/rate-limiter'
import { rateLimitedResponse, apiError, ok, addRateLimitHeaders } from '@/lib/api-response'
import { validateCheckout } from '@/lib/validations'
import { computeQuote } from '@/lib/pricing'
import { isBookable } from '@/lib/availability'
import { isDatabaseConfigured } from '@/lib/db'
import {
  closeOrder,
  countActivePendingByIp,
  insertOrder,
  newBuyOrder,
  newSessionId,
  setOrderToken,
} from '@/lib/orders'
import { createTransaction, isWebpayConfigured, webpayEnvironment } from '@/lib/webpay'
import { getClientIp, hashIp } from '@/lib/get-client-ip'
import { logError, logRequest, logSecurityEvent, logWarn } from '@/lib/logger'

// Inicia un pago con Webpay Plus: valida la reserva, recalcula el monto en el
// servidor, deja la orden PENDING (retiene el horario) y crea la transacción.
// El cliente recibe la URL y el token del formulario de pago de Transbank.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// 10 intentos de pago por IP cada 10 minutos
const RATE_LIMIT = 10
const RATE_WINDOW_MS = 10 * 60 * 1000
// Órdenes pendientes simultáneas por IP: cada una retiene un horario, así que
// sin este tope se podría bloquear la agenda completa de un artista.
const MAX_PENDING_PER_IP = 3
const MAX_BODY_BYTES = 10_000

export async function POST(req: Request) {
  const start = Date.now()
  const ip = getClientIp(req)
  const ipHash = hashIp(ip)

  const rl = rateLimit(`pay:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)
  if (!rl.success) {
    logSecurityEvent('RATE_LIMIT_EXCEEDED', { ipHash, endpoint: '/api/checkout/pay' })
    return rateLimitedResponse(rl)
  }

  // Solo JSON: un formulario de otro sitio no puede enviar este Content-Type
  // sin preflight de CORS (cierra el CSRF con enctype="text/plain").
  const contentType = req.headers.get('content-type') ?? ''
  if (!contentType.toLowerCase().startsWith('application/json')) {
    return apiError('Se esperaba un cuerpo JSON', 415, 'UNSUPPORTED_MEDIA_TYPE')
  }

  const len = Number(req.headers.get('content-length') ?? 0)
  if (len > MAX_BODY_BYTES) {
    return apiError('Cuerpo demasiado grande', 413, 'PAYLOAD_TOO_LARGE')
  }

  const env = webpayEnvironment()
  if (!isDatabaseConfigured() || !isWebpayConfigured(env)) {
    logError('Pagos deshabilitados: falta configuración', {
      database: isDatabaseConfigured(),
      webpay: isWebpayConfigured(env),
      environment: env,
    })
    return apiError('Los pagos no están disponibles en este momento.', 503, 'PAYMENTS_UNAVAILABLE')
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return apiError('Cuerpo de la solicitud inválido', 400, 'INVALID_BODY')
  }

  const validation = validateCheckout(body)
  if (!validation.valid) {
    logSecurityEvent('VALIDATION_FAILED', {
      ipHash,
      endpoint: '/api/checkout/pay',
      errors: validation.errors.join('; '),
    })
    return apiError(validation.errors.join(', '), 422, 'VALIDATION_ERROR')
  }
  const data = validation.data!

  // ─── Monto autoritativo ────────────────────────────────────────────────────
  const quote = computeQuote({
    slug: data.slug,
    tierId: data.tierId,
    regionId: data.regionId,
    communeName: data.communeName,
    extras: data.extras,
    coupon: data.coupon,
  })
  if (!quote.ok) return apiError(quote.message, quote.status, quote.code)

  if (data.coupon && !quote.coupon) {
    return apiError('Cupón no válido o expirado', 422, 'INVALID_COUPON')
  }
  // Se cobra el total del servidor, pero si no coincide con el que vio la
  // clienta se detiene: nunca debe ver en Webpay un monto distinto al resumen.
  if (quote.total !== data.expectedAmount) {
    logWarn('Total del cliente distinto al del servidor', {
      ipHash,
      expected: data.expectedAmount,
      total: quote.total,
    })
    return apiError(
      'El total de tu reserva cambió. Revisa el resumen antes de pagar.',
      409,
      'PRICE_CHANGED',
    )
  }

  // ─── Agenda y anti-abuso ───────────────────────────────────────────────────
  try {
    if ((await countActivePendingByIp(ipHash)) >= MAX_PENDING_PER_IP) {
      logSecurityEvent('RATE_LIMIT_EXCEEDED', { ipHash, endpoint: '/api/checkout/pay', reason: 'pending-orders' })
      return apiError(
        'Tienes pagos en curso. Termínalos o espera unos minutos antes de intentar otro.',
        429,
        'TOO_MANY_PENDING',
      )
    }

    const free = await isBookable({
      vedeto: quote.vedeto,
      extras: quote.extras,
      date: data.date,
      time: data.time,
    })
    if (!free) {
      logWarn('Intento de pago sobre un bloque no disponible', {
        ipHash,
        vedetoSlug: quote.vedeto.slug,
        date: data.date,
        time: data.time,
      })
      return apiError(
        'Ese horario ya no está disponible. Elige otro bloque.',
        409,
        'SLOT_TAKEN',
      )
    }
  } catch (err) {
    logError('No se pudo verificar la agenda antes del pago', {
      error: err instanceof Error ? err.message : String(err),
    })
    return apiError(
      'No pudimos verificar la agenda en este momento. Intenta nuevamente en unos minutos.',
      503,
      'AVAILABILITY_UNAVAILABLE',
    )
  }

  // ─── Orden + transacción ───────────────────────────────────────────────────
  const buyOrder = newBuyOrder()
  const sessionId = newSessionId()

  try {
    await insertOrder({
      buyOrder,
      sessionId,
      environment: env,
      amount: quote.total,
      vedetoSlug: quote.vedeto.slug,
      tierId: quote.tier.id,
      extras: quote.extras.map((e) => e.slug),
      regionId: data.regionId,
      communeName: data.communeName,
      couponCode: quote.coupon?.code ?? null,
      eventDate: data.date,
      eventTime: data.time,
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      address: data.address,
      ipHash,
    })
  } catch (err) {
    logError('No se pudo guardar la orden', {
      buyOrder,
      error: err instanceof Error ? err.message : String(err),
    })
    return apiError('No pudimos iniciar el pago. Intenta nuevamente.', 503, 'ORDER_NOT_SAVED')
  }

  let transaction: { token: string; url: string }
  try {
    transaction = await createTransaction(
      {
        buyOrder,
        sessionId,
        amount: quote.total,
        // Mismo origen por el que llegó la clienta (producción, deploy preview o local).
        returnUrl: new URL('/api/checkout/return', req.url).toString(),
      },
      env,
    )
    await setOrderToken(buyOrder, transaction.token)
  } catch (err) {
    logError('No se pudo crear la transacción en Webpay', {
      buyOrder,
      error: err instanceof Error ? err.message : String(err),
    })
    // Se libera el horario: la orden no llegó a Webpay.
    await closeOrder(buyOrder, 'FAILED').catch(() => {})
    return apiError(
      'No pudimos conectar con Transbank. Intenta nuevamente en unos minutos.',
      502,
      'WEBPAY_UNAVAILABLE',
    )
  }

  logSecurityEvent('PAYMENT_INITIATED', {
    ipHash,
    buyOrder,
    amount: quote.total,
    environment: env,
  })
  logRequest('POST', '/api/checkout/pay', 200, Date.now() - start, { ipHash, buyOrder })

  return addRateLimitHeaders(ok({ url: transaction.url, token: transaction.token }), rl)
}
