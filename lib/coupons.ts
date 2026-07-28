// Fuente de verdad de los cupones — vive SOLO en el servidor.
// Nunca importar este módulo desde un componente cliente: expondría los códigos
// en el bundle y permitiría forzar descuentos desde las DevTools.

const COUPONS: Record<string, number> = {
  LUXX10: 0.1,
}

export type CouponResult =
  | { valid: true; code: string; rate: number }
  | { valid: false }

export function validateCoupon(code: string | undefined | null): CouponResult {
  if (!code) return { valid: false }
  const normalized = code.trim().toUpperCase()
  const rate = COUPONS[normalized]
  if (rate == null) return { valid: false }
  return { valid: true, code: normalized, rate }
}
