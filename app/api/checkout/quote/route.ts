import { computeQuote } from '@/lib/pricing'
import { ok, apiError } from '@/lib/api-response'

// Cotización autoritativa del servidor: el precio total y la validez del cupón
// se calculan SIEMPRE aquí, nunca en el cliente. El cliente envía su selección
// (identificadores) y muestra los montos que devuelve el servidor.
// /api/checkout/pay usa el mismo cálculo (lib/pricing.ts) para el monto que se
// envía a Transbank — nunca un monto calculado en el navegador.
export const runtime = 'nodejs'

export async function POST(req: Request) {
  const len = Number(req.headers.get('content-length') ?? 0)
  if (len > 10_000) return apiError('Cuerpo demasiado grande', 413, 'PAYLOAD_TOO_LARGE')

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return apiError('Cuerpo de la solicitud inválido', 400, 'INVALID_BODY')
  }

  const coupon = typeof body.coupon === 'string' ? body.coupon : undefined

  const quote = computeQuote({
    slug: typeof body.slug === 'string' ? body.slug : '',
    tierId: typeof body.tierId === 'string' ? body.tierId : '',
    regionId: typeof body.regionId === 'string' ? body.regionId : 'metropolitana',
    communeName: typeof body.communeName === 'string' ? body.communeName : 'Santiago',
    extras: Array.isArray(body.extras) ? body.extras : [],
    coupon,
  })
  if (!quote.ok) return apiError(quote.message, quote.status, quote.code)

  return ok({
    subtotal: quote.subtotal,
    discount: quote.discount,
    total: quote.total,
    coupon: quote.coupon,
    couponError: coupon != null && coupon !== '' && !quote.coupon,
  })
}
