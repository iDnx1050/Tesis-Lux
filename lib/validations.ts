export interface ContactFormData {
  name: string
  email: string
  phone?: string
  message: string
}

export interface CheckoutData {
  slug: string
  tierId: string
  regionId: string
  communeName: string
  extras: string[]
  coupon?: string
  date: string
  time: string
  contactName: string
  contactEmail: string
  contactPhone: string
  /** Dirección completa: calle y número/depto, ya unidos. */
  address: string
  /** Total que vio la clienta; el servidor lo compara con el suyo. */
  expectedAmount: number
}

interface ValidationResult<T> {
  valid: boolean
  errors: string[]
  data?: T
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[\d\s+\-().]{7,20}$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/
// Identificadores internos (slugs de artistas, tiers, regiones).
const ID_RE = /^[a-z0-9-]{1,60}$/
const COUPON_RE = /^[A-Za-z0-9]{1,32}$/

/** Fecha YYYY-MM-DD que existe en el calendario (rechaza 2026-02-31). */
function isRealDate(value: string): boolean {
  if (!DATE_RE.test(value)) return false
  const ms = Date.parse(`${value}T00:00:00Z`)
  return Number.isFinite(ms) && new Date(ms).toISOString().slice(0, 10) === value
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function str(value: unknown, min: number, max: number, field: string): string | null {
  if (typeof value !== 'string' || value.trim().length < min || value.trim().length > max) {
    return `${field} debe tener entre ${min} y ${max} caracteres`
  }
  return null
}

export function validateContactForm(body: unknown): ValidationResult<ContactFormData> {
  if (!isObject(body)) return { valid: false, errors: ['Datos inválidos'] }

  const errors: string[] = []

  const nameErr = str(body.name, 2, 80, 'Nombre')
  if (nameErr) errors.push(nameErr)

  if (!EMAIL_RE.test(String(body.email ?? ''))) errors.push('Email inválido')

  if (body.phone !== undefined && !PHONE_RE.test(String(body.phone))) {
    errors.push('Teléfono inválido')
  }

  const msgErr = str(body.message, 10, 1000, 'Mensaje')
  if (msgErr) errors.push(msgErr)

  if (errors.length > 0) return { valid: false, errors }

  return {
    valid: true,
    errors: [],
    data: {
      name: String(body.name).trim(),
      email: String(body.email).toLowerCase().trim(),
      phone: body.phone ? String(body.phone).trim() : undefined,
      message: String(body.message).trim(),
    },
  }
}

/**
 * Datos con que se inicia un pago. Solo valida forma y largo: que el artista,
 * el tier y el horario existan y estén libres lo comprueba la ruta de pago.
 */
export function validateCheckout(body: unknown): ValidationResult<CheckoutData> {
  if (!isObject(body)) return { valid: false, errors: ['Datos inválidos'] }

  const errors: string[] = []

  if (!ID_RE.test(String(body.slug ?? ''))) errors.push('Artista inválido')
  if (!ID_RE.test(String(body.tierId ?? ''))) errors.push('Tier de servicio inválido')
  if (!ID_RE.test(String(body.regionId ?? ''))) errors.push('Región inválida')

  const communeErr = str(body.communeName, 1, 60, 'Comuna')
  if (communeErr) errors.push(communeErr)

  const extras = body.extras ?? []
  if (!Array.isArray(extras) || extras.length > 10 || !extras.every((e) => ID_RE.test(String(e)))) {
    errors.push('Artistas adicionales inválidos (máximo 10)')
  }

  if (body.coupon != null && body.coupon !== '' && !COUPON_RE.test(String(body.coupon))) {
    errors.push('Cupón inválido')
  }

  if (!isRealDate(String(body.date ?? ''))) errors.push('Fecha inválida (formato YYYY-MM-DD)')
  if (!TIME_RE.test(String(body.time ?? ''))) errors.push('Hora inválida (formato HH:MM)')

  const contactNameErr = str(body.contactName, 3, 80, 'Nombre')
  if (contactNameErr) errors.push(contactNameErr)

  const email = String(body.contactEmail ?? '').trim()
  if (email.length > 120 || !EMAIL_RE.test(email)) errors.push('Email inválido')
  if (!PHONE_RE.test(String(body.contactPhone ?? '').trim())) errors.push('Teléfono inválido')

  const addressErr = str(body.address, 3, 200, 'Dirección')
  if (addressErr) errors.push(addressErr)
  const detailErr = str(body.addressDetail, 1, 60, 'N° / Depto / Casa')
  if (detailErr) errors.push(detailErr)

  const expectedAmount = Number(body.expectedAmount)
  if (!Number.isInteger(expectedAmount) || expectedAmount <= 0) errors.push('Monto inválido')

  if (errors.length > 0) return { valid: false, errors }

  return {
    valid: true,
    errors: [],
    data: {
      slug: String(body.slug),
      tierId: String(body.tierId),
      regionId: String(body.regionId),
      communeName: String(body.communeName).trim(),
      extras: (extras as unknown[]).map(String),
      coupon: body.coupon ? String(body.coupon).trim().toUpperCase() : undefined,
      date: String(body.date),
      time: String(body.time),
      contactName: String(body.contactName).trim(),
      contactEmail: email.toLowerCase(),
      contactPhone: String(body.contactPhone).trim(),
      address: `${String(body.address).trim()}, ${String(body.addressDetail).trim()}`,
      expectedAmount,
    },
  }
}
