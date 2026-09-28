// Construcción de la disponibilidad que ve la clienta en el checkout,
// cruzando la grilla de horarios ofrecidos con lo que ya está tomado en
// Google Calendar.
import type { AvailabilitySlot } from './types'
import {
  collidesWith,
  isCalendarConfigured,
  listBusyIntervals,
  toSantiagoDate,
} from './google-calendar'

// Horarios en que se ofrece show. Debe coincidir con la grilla que espera el
// calendario del checkout.
export const SHOW_TIMES = ['10:00', '14:00', '18:00', '20:00']

// Ventana de reserva: cuántos días hacia adelante se muestran.
export const HORIZON_DAYS = 60

/** Suma días a una fecha YYYY-MM-DD sin depender de la zona horaria local. */
function addDays(date: string, days: number): string {
  const ms = Date.parse(`${date}T00:00:00Z`) + days * 86_400_000
  return new Date(ms).toISOString().slice(0, 10)
}

/** Domingo (0) no se opera. */
function isOpenDay(date: string): boolean {
  return new Date(`${date}T00:00:00Z`).getUTCDay() !== 0
}

/**
 * Disponibilidad real de un artista leída del calendario.
 *
 * Importante: los horarios ocupados NO se omiten, se devuelven en
 * `bookedTimes`. La clienta debe poder verlos marcados en rojo — que un bloque
 * desaparezca sin explicación se lee como un error de la página.
 */
export async function getAvailability(vedetoSlug: string): Promise<AvailabilitySlot[]> {
  // "Hoy" según Santiago, no según el reloj del servidor (Netlify corre en UTC).
  const today = toSantiagoDate(Date.now())
  const lastDay = addDays(today, HORIZON_DAYS - 1)

  const intervals = await listBusyIntervals(vedetoSlug, today, lastDay)

  const slots: AvailabilitySlot[] = []

  for (let i = 0; i < HORIZON_DAYS; i++) {
    const date = addDays(today, i)
    const open = isOpenDay(date)

    const bookedTimes = open
      ? SHOW_TIMES.filter((time) => collidesWith(intervals, date, time))
      : []

    slots.push({
      date,
      // El día queda seleccionable mientras le quede al menos un bloque libre.
      available: open && bookedTimes.length < SHOW_TIMES.length,
      times: open ? SHOW_TIMES : [],
      bookedTimes,
    })
  }

  return slots
}

/**
 * Igual que getAvailability, pero nunca lanza: ante un fallo de Google
 * devuelve la disponibilidad de respaldo que trae el perfil.
 *
 * El criterio es deliberado: si el calendario no responde, es preferible
 * mostrar la grilla de respaldo y que la reserva se revalide al confirmar,
 * antes que dejar el checkout inutilizable. La revalidación previa al pago
 * sigue siendo la que garantiza que no haya dos reservas en el mismo bloque.
 */
export async function getAvailabilitySafe(
  vedetoSlug: string,
  fallback: AvailabilitySlot[],
): Promise<{ slots: AvailabilitySlot[]; source: 'calendar' | 'fallback' }> {
  if (!isCalendarConfigured()) {
    return { slots: fallback, source: 'fallback' }
  }

  try {
    return { slots: await getAvailability(vedetoSlug), source: 'calendar' }
  } catch {
    return { slots: fallback, source: 'fallback' }
  }
}
