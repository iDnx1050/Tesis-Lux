import { vedetos } from '@/lib/mock-data'
import { locationPricing } from '@/lib/regions'
import { validateCoupon } from '@/lib/coupons'
import { ok, apiError } from '@/lib/api-response'

// Cotización autoritativa del servidor: el precio total y la validez del cupón
// se calculan SIEMPRE aquí, nunca en el cliente. El cliente envía su selección
// (identificadores) y muestra los montos que devuelve el servidor.
// En Fase 2, esta ruta evolucionará a /create-session enviando este `total` a
// Transbank — nunca un monto calculado en el navegador.
export const runtime = 'nodejs'

const EXTRA_PER_ARTIST = 60000

export async function POST(req: Request) {
  const len = Number(req.headers.get('content-length') ?? 0)
  if (len > 10_000) return apiError('Cuerpo demasiado grande', 413, 'PAYLOAD_TOO_LARGE')

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return apiError('Cuerpo de la solicitud inválido', 400, 'INVALID_BODY')
  }

  const slug = typeof body.slug === 'string' ? body.slug : ''
  const tierId = typeof body.tierId === 'string' ? body.tierId : ''
  const regionId = typeof body.regionId === 'string' ? body.regionId : 'metropolitana'
  const communeName = typeof body.communeName === 'string' ? body.communeName : 'Santiago'
  const coupon = typeof body.coupon === 'string' ? body.coupon : undefined

  const vedeto = vedetos.find((v) => v.slug === slug)
  if (!vedeto) return apiError('Vedeto no encontrado', 404, 'NOT_FOUND')

  // Validar que el tier pertenece al vedeto (evita IDOR de precios entre artistas)
  const tier = vedeto.pricing.find((t) => t.id === tierId)
  if (!tier) return apiError('Tier de servicio no encontrado', 404, 'TIER_NOT_FOUND')

  // Solo se cuentan como extras los slugs que existen realmente
  const rawExtras = Array.isArray(body.extras) ? body.extras : []
  const validExtras = rawExtras.filter(
    (s): s is string => typeof s === 'string' && vedetos.some((v) => v.slug === s),
  )
  const extrasTotal = validExtras.length * EXTRA_PER_ARTIST

  const pricing = locationPricing(tier.price, regionId, communeName)
  const subtotal = pricing.effective + extrasTotal

  const couponResult = validateCoupon(coupon)
  const discount = couponResult.valid ? Math.round(subtotal * couponResult.rate) : 0
  const total = subtotal - discount

  return ok({
    subtotal,
    discount,
    total,
    coupon: couponResult.valid
      ? { code: couponResult.code, rate: couponResult.rate }
      : null,
    couponError: coupon != null && coupon !== '' && !couponResult.valid,
  })
}
