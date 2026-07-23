export interface ContactFormData {
  name: string
  email: string
  phone?: string
  message: string
}

export interface BookingData {
  vededoSlug: string
  tierId: string
  date: string
  time: string
  eventName: string
  address: string
  extras: number
  specialRequests?: string
  contactName: string
  contactEmail: string
  contactPhone: string
}

interface ValidationResult<T> {
  valid: boolean
  errors: string[]
  data?: T
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[\d\s+\-().]{7,20}$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const TIME_RE = /^\d{2}:\d{2}$/

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

export function validateBooking(body: unknown): ValidationResult<BookingData> {
  if (!isObject(body)) return { valid: false, errors: ['Datos inválidos'] }

  const errors: string[] = []

  if (typeof body.vededoSlug !== 'string' || body.vededoSlug.trim().length === 0) {
    errors.push('Vedeto requerido')
  }
  if (typeof body.tierId !== 'string' || body.tierId.trim().length === 0) {
    errors.push('Tier de servicio requerido')
  }
  if (!DATE_RE.test(String(body.date ?? ''))) errors.push('Fecha inválida (formato YYYY-MM-DD)')
  if (!TIME_RE.test(String(body.time ?? ''))) errors.push('Hora inválida (formato HH:MM)')

  const eventErr = str(body.eventName, 2, 120, 'Nombre del evento')
  if (eventErr) errors.push(eventErr)

  const addrErr = str(body.address, 5, 200, 'Dirección')
  if (addrErr) errors.push(addrErr)

  const extras = Number(body.extras ?? 0)
  if (!Number.isInteger(extras) || extras < 0 || extras > 10) {
    errors.push('Número de extras inválido (0-10)')
  }

  const contactNameErr = str(body.contactName, 2, 80, 'Nombre de contacto')
  if (contactNameErr) errors.push(contactNameErr)

  if (!EMAIL_RE.test(String(body.contactEmail ?? ''))) errors.push('Email de contacto inválido')
  if (!PHONE_RE.test(String(body.contactPhone ?? ''))) errors.push('Teléfono de contacto inválido')

  if (errors.length > 0) return { valid: false, errors }

  return {
    valid: true,
    errors: [],
    data: {
      vededoSlug: String(body.vededoSlug).trim(),
      tierId: String(body.tierId).trim(),
      date: String(body.date),
      time: String(body.time),
      eventName: String(body.eventName).trim(),
      address: String(body.address).trim(),
      extras,
      specialRequests: body.specialRequests ? String(body.specialRequests).trim() : undefined,
      contactName: String(body.contactName).trim(),
      contactEmail: String(body.contactEmail).toLowerCase().trim(),
      contactPhone: String(body.contactPhone).trim(),
    },
  }
}
