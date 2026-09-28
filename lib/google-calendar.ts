// Capa de acceso a Google Calendar: leer bloques ocupados y crear el evento de
// una reserva. Se habla con la API REST v3 directamente (fetch), sin el
// paquete `googleapis`, para no inflar el bundle de las funciones de Netlify.
import { getAccessToken } from './google-auth'

const API = 'https://www.googleapis.com/calendar/v3'

// Lectura y escritura de eventos.
const SCOPE = 'https://www.googleapis.com/auth/calendar'

export const TIME_ZONE = 'America/Santiago'

// Minutos que se bloquean por cada show: ~50 de espectáculo más traslado,
// montaje y desmontaje. Es el margen en que un artista no puede tomar otro
// evento, y lo que define si dos reservas colisionan.
export const SHOW_BLOCK_MINUTES = 120

/**
 * Los eventos se guardan todos en un mismo calendario y se etiquetan con el
 * slug del artista en extendedProperties.private. Así una sola cuenta de
 * servicio y un solo calendario sirven para todo el elenco, y se puede
 * consultar la agenda de un artista concreto filtrando por esta propiedad.
 */
const SLUG_PROPERTY = 'vedetoSlug'

export interface BusyInterval {
  start: number // epoch ms
  end: number
}

export interface BookingEventInput {
  vedetoSlug: string
  vedetoName: string
  date: string // YYYY-MM-DD
  time: string // HH:MM
  eventName: string
  address: string
  contactName: string
  contactEmail: string
  contactPhone: string
  tierName: string
  bookingId: string
  specialRequests?: string
}

/**
 * La integración es opcional: si faltan credenciales el sitio sigue
 * funcionando con la disponibilidad de respaldo, en vez de caerse. Esto
 * permite levantar el proyecto en local sin configurar Google.
 */
export function isCalendarConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_SA_EMAIL &&
      process.env.GOOGLE_SA_PRIVATE_KEY &&
      process.env.GOOGLE_CALENDAR_ID,
  )
}

function calendarId(): string {
  const id = process.env.GOOGLE_CALENDAR_ID
  if (!id) throw new Error('Falta GOOGLE_CALENDAR_ID')
  return id
}

// ─── Conversión de horas ─────────────────────────────────────────────────────
// Chile cambia de horario dos veces al año (UTC-4 / UTC-3), así que no se puede
// asumir un desfase fijo. Para ESCRIBIR se evita el problema: Google acepta un
// dateTime sin desfase acompañado de `timeZone`, y resuelve él la conversión.
// Para LEER hay que traducir el instante que devuelve la API a fecha y hora
// locales de Santiago, que es lo que hacen estos formateadores.

// 'en-CA' produce exactamente YYYY-MM-DD.
const DATE_FMT = new Intl.DateTimeFormat('en-CA', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

const TIME_FMT = new Intl.DateTimeFormat('en-GB', {
  timeZone: TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

export function toSantiagoDate(ms: number): string {
  return DATE_FMT.format(new Date(ms))
}

export function toSantiagoTime(ms: number): string {
  return TIME_FMT.format(new Date(ms))
}

/**
 * Instante (epoch ms) en que ocurre una fecha y hora locales de Santiago.
 *
 * Se consulta a Intl el desfase vigente para ese día concreto en vez de
 * asumir -04:00, de modo que el cálculo sigue siendo correcto después de un
 * cambio de horario. El sondeo se hace en UTC, así que en la madrugada exacta
 * del cambio el resultado puede desviarse una hora; los horarios de show van
 * de 10:00 a 20:00, muy lejos de esa ventana.
 */
export function santiagoInstant(date: string, time: string): number {
  const probe = new Date(`${date}T${time}:00Z`)
  const offset =
    new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, timeZoneName: 'longOffset' })
      .formatToParts(probe)
      .find((p) => p.type === 'timeZoneName')?.value ?? 'GMT-04:00'

  // "GMT-04:00" → "-04:00". Si Intl devolviera solo "GMT" (desfase cero) se
  // asume +00:00.
  const normalized = offset.replace('GMT', '') || '+00:00'
  return new Date(`${date}T${time}:00${normalized}`).getTime()
}

// ─── Lectura ─────────────────────────────────────────────────────────────────

/**
 * Intervalos ocupados de un artista entre dos fechas. Incluye tanto los
 * eventos creados por el sitio como los que se agreguen a mano en Google
 * Calendar, siempre que lleven la etiqueta del artista.
 */
export async function listBusyIntervals(
  vedetoSlug: string,
  fromDate: string,
  toDate: string,
): Promise<BusyInterval[]> {
  const token = await getAccessToken(SCOPE)

  const url = new URL(`${API}/calendars/${encodeURIComponent(calendarId())}/events`)
  url.searchParams.set('timeMin', new Date(`${fromDate}T00:00:00Z`).toISOString())
  url.searchParams.set('timeMax', new Date(`${toDate}T23:59:59Z`).toISOString())
  // Expande los eventos recurrentes en sus ocurrencias individuales.
  url.searchParams.set('singleEvents', 'true')
  url.searchParams.set('maxResults', '2500')
  url.searchParams.set('privateExtendedProperty', `${SLUG_PROPERTY}=${vedetoSlug}`)

  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) {
    throw new Error(`Calendar events.list respondió ${res.status}: ${await res.text()}`)
  }

  const data = (await res.json()) as {
    items?: Array<{
      status?: string
      start?: { dateTime?: string; date?: string }
      end?: { dateTime?: string; date?: string }
    }>
  }

  const intervals: BusyInterval[] = []

  for (const item of data.items ?? []) {
    if (item.status === 'cancelled') continue

    // Un evento de día completo trae `date` en vez de `dateTime`: se toma la
    // jornada entera como ocupada.
    const startRaw = item.start?.dateTime ?? (item.start?.date ? `${item.start.date}T00:00` : null)
    const endRaw = item.end?.dateTime ?? (item.end?.date ? `${item.end.date}T00:00` : null)
    if (!startRaw || !endRaw) continue

    const start = item.start?.dateTime
      ? new Date(startRaw).getTime()
      : santiagoInstant(item.start!.date!, '00:00')
    const end = item.end?.dateTime
      ? new Date(endRaw).getTime()
      : santiagoInstant(item.end!.date!, '00:00')

    if (Number.isFinite(start) && Number.isFinite(end) && end > start) {
      intervals.push({ start, end })
    }
  }

  return intervals
}

/**
 * ¿El bloque que ocuparía un show que empieza en (date, time) choca con algo
 * ya agendado? Dos bloques colisionan si se solapan aunque sea parcialmente.
 */
export function collidesWith(
  intervals: BusyInterval[],
  date: string,
  time: string,
): boolean {
  const start = santiagoInstant(date, time)
  const end = start + SHOW_BLOCK_MINUTES * 60_000
  return intervals.some((i) => start < i.end && end > i.start)
}

/**
 * Comprobación puntual contra el calendario, para revalidar justo antes de
 * confirmar una reserva.
 */
export async function isSlotFree(
  vedetoSlug: string,
  date: string,
  time: string,
): Promise<boolean> {
  const intervals = await listBusyIntervals(vedetoSlug, date, date)
  return !collidesWith(intervals, date, time)
}

// ─── Escritura ───────────────────────────────────────────────────────────────

/**
 * Crea el evento de la reserva. Se llama una vez confirmado el pago: a partir
 * de ese momento el bloque queda ocupado y deja de ofrecerse en el sitio.
 */
export async function createBookingEvent(
  input: BookingEventInput,
): Promise<{ id: string; htmlLink: string }> {
  const token = await getAccessToken(SCOPE)

  const startMs = santiagoInstant(input.date, input.time)
  const endMs = startMs + SHOW_BLOCK_MINUTES * 60_000
  const endTime = toSantiagoTime(endMs)
  const endDate = toSantiagoDate(endMs)

  const body = {
    summary: `${input.vedetoName} — ${input.eventName}`,
    location: input.address,
    description: [
      `Reserva: ${input.bookingId}`,
      `Artista: ${input.vedetoName}`,
      `Servicio: ${input.tierName}`,
      `Contacto: ${input.contactName}`,
      `Email: ${input.contactEmail}`,
      `Teléfono: ${input.contactPhone}`,
      input.specialRequests ? `Solicitudes: ${input.specialRequests}` : null,
    ]
      .filter(Boolean)
      .join('\n'),
    // Sin desfase horario: lo resuelve Google a partir de `timeZone`, con lo
    // que el cambio de hora chileno deja de ser un problema al escribir.
    start: { dateTime: `${input.date}T${input.time}:00`, timeZone: TIME_ZONE },
    end: { dateTime: `${endDate}T${endTime}:00`, timeZone: TIME_ZONE },
    extendedProperties: {
      private: {
        [SLUG_PROPERTY]: input.vedetoSlug,
        bookingId: input.bookingId,
      },
    },
  }

  const res = await fetch(`${API}/calendars/${encodeURIComponent(calendarId())}/events`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw new Error(`Calendar events.insert respondió ${res.status}: ${await res.text()}`)
  }

  const created = (await res.json()) as { id: string; htmlLink: string }
  return { id: created.id, htmlLink: created.htmlLink }
}
