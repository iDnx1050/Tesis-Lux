// Cálculo autoritativo del precio de una reserva. Lo usan la cotización
// (/api/checkout/quote) y el inicio del pago (/api/checkout/pay), de modo que
// el monto que se cobra en Webpay es exactamente el que se mostró.
//
// Importar SOLO desde código de servidor: valida cupones (lib/coupons.ts).
import { vedetos } from './mock-data'
import { locationPricing } from './regions'
import { validateCoupon } from './coupons'
import type { PricingTier, Vedeto } from './types'

export const EXTRA_PER_ARTIST = 60000

export const MAX_EXTRAS = 10

export interface QuoteInput {
  slug: string
  tierId: string
  regionId: string
  communeName: string
  extras: unknown[]
  coupon?: string
}

export type Quote =
  | {
      ok: true
      vedeto: Vedeto
      tier: PricingTier
      /** Artistas adicionales válidos, sin repetidos ni el artista principal. */
      extras: Vedeto[]
      subtotal: number
      discount: number
      total: number
      coupon: { code: string; rate: number } | null
    }
  | { ok: false; status: 404; code: string; message: string }

export function computeQuote(input: QuoteInput): Quote {
  const vedeto = vedetos.find((v) => v.slug === input.slug)
  if (!vedeto) return { ok: false, status: 404, code: 'NOT_FOUND', message: 'Vedeto no encontrado' }

  // Validar que el tier pertenece al vedeto (evita IDOR de precios entre artistas)
  const tier = vedeto.pricing.find((t) => t.id === input.tierId)
  if (!tier) {
    return { ok: false, status: 404, code: 'TIER_NOT_FOUND', message: 'Tier de servicio no encontrado' }
  }

  // Solo se cuentan como extras los slugs que existen realmente, una vez cada
  // uno y sin repetir al artista principal.
  const extras: Vedeto[] = []
  for (const s of input.extras) {
    if (typeof s !== 'string' || s === vedeto.slug) continue
    const extra = vedetos.find((v) => v.slug === s)
    if (extra && !extras.includes(extra)) extras.push(extra)
    if (extras.length === MAX_EXTRAS) break
  }

  const pricing = locationPricing(tier.price, input.regionId, input.communeName)
  const subtotal = pricing.effective + extras.length * EXTRA_PER_ARTIST

  const couponResult = validateCoupon(input.coupon)
  const discount = couponResult.valid ? Math.round(subtotal * couponResult.rate) : 0

  return {
    ok: true,
    vedeto,
    tier,
    extras,
    subtotal,
    discount,
    total: subtotal - discount,
    coupon: couponResult.valid ? { code: couponResult.code, rate: couponResult.rate } : null,
  }
}
