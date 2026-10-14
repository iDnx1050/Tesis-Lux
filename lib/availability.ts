// Construcción de la disponibilidad que ve la clienta en el checkout,
// cruzando la grilla de horarios ofrecidos con lo que ya está tomado en
// Google Calendar y en las órdenes de pago de la base de datos.
import type { AvailabilitySlot, Vedeto } from './types'
import {
  collidesWith,
  isCalendarConfigured,
  isSlotFree,
  listBusyIntervals,
  toSantiagoDate,
  type BusyInterval,
} from './google-calendar'
import { isDatabaseConfigured } from './db'
import { busyIntervalsFromOrders } from './orders'
import { logWarn } from './logger'

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

/** Marca como tomados los horarios de cada día que chocan con `intervals`. */
function applyBusy(slots: AvailabilitySlot[], intervals: BusyInterval[]): AvailabilitySlot[] {
  if (intervals.length === 0) return slots

  return slots.map((slot) => {
    const times = slot.times ?? []
    const booked = new Set(slot.bookedTimes ?? [])
    for (const time of times) {
      if (collidesWith(intervals, slot.date, time)) booked.add(time)
    }
    const bookedTimes = times.filter((t) => booked.has(t))
    return {
      ...slot,
      available: slot.available && bookedTimes.length < times.length,
      bookedTimes,
    }
  })
}

/**
 * Igual que getAvailability, pero nunca lanza: ante un fallo de Google
 * devuelve la disponibilidad de respaldo que trae el perfil.
 *
 * El criterio es deliberado: si el calendario no responde, es preferible
 * mostrar la grilla de respaldo y que la reserva se revalide al confirmar,
 * antes que dejar el checkout inutilizable. La revalidación previa al pago
 * sigue siendo la que garantiza que no haya dos reservas en el mismo bloque.
 *
 * Sobre cualquiera de las dos grillas se marcan además los horarios tomados
 * por órdenes de pago (pagadas o en curso).
 */
export async function getAvailabilitySafe(
  vedetoSlug: string,
  fallback: AvailabilitySlot[],
): Promise<{ slots: AvailabilitySlot[]; source: 'calendar' | 'fallback' }> {
  let slots = fallback
  let source: 'calendar' | 'fallback' = 'fallback'

  if (isCalendarConfigured()) {
    try {
      slots = await getAvailability(vedetoSlug)
      source = 'calendar'
    } catch {
      // Se sigue con la grilla de respaldo.
    }
  }

  if (isDatabaseConfigured() && slots.length > 0) {
    try {
      const intervals = await busyIntervalsFromOrders(
        vedetoSlug,
        slots[0].date,
        slots[slots.length - 1].date,
      )
      slots = applyBusy(slots, intervals)
    } catch (err) {
      logWarn('No se pudieron leer las órdenes para la disponibilidad', {
        vedetoSlug,
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  return { slots, source }
}

/**
 * ¿Se puede reservar este horario para el artista principal y sus adicionales?
 * Es la revalidación previa al pago: la grilla que vio la clienta pudo cambiar
 * mientras completaba el formulario. Lanza si la base de datos o el calendario
 * no responden (quien llama decide cómo informarlo).
 */
export async function isBookable(input: {
  vedeto: Vedeto
  extras: Vedeto[]
  date: string
  time: string
}): Promise<boolean> {
  const { vedeto, extras, date, time } = input
  const today = toSantiagoDate(Date.now())

  // 1) El horario debe estar en la grilla que se ofrece.
  if (date < today || date > addDays(today, HORIZON_DAYS - 1)) return false

  if (isCalendarConfigured()) {
    if (!isOpenDay(date) || !SHOW_TIMES.includes(time)) return false
  } else {
    const slot = vedeto.availability.find((a) => a.date === date)
    if (!slot?.available || !(slot.times ?? []).includes(time)) return false
  }

  // 2) Ningún artista involucrado puede tener otra orden en ese bloque.
  for (const artist of [vedeto, ...extras]) {
    const intervals = await busyIntervalsFromOrders(artist.slug, date, date)
    if (collidesWith(intervals, date, time)) return false
  }

  // 3) Ni un evento en Google Calendar (p. ej. un bloqueo cargado a mano).
  if (isCalendarConfigured()) {
    for (const artist of [vedeto, ...extras]) {
      if (!(await isSlotFree(artist.slug, date, time))) return false
    }
  }

  return true
}
