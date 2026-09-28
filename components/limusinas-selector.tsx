'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperClass } from 'swiper'
import {
  Clock, Minus, Plus, Check, Car, ChevronLeft, ChevronRight,
  Crown, Wine, Music, PartyPopper, Camera, MapPin, Users,
} from 'lucide-react'

import 'swiper/css'

const WHATSAPP_NUMBER = '56945501752'

// Porcentaje que se abona para confirmar la fecha; el resto se paga el día
// del evento.
const DEPOSIT_RATE = 0.5

const clp = (n: number) => `$${n.toLocaleString('es-CL')}`

interface Limusina {
  id: string
  model: string
  capacity: number
  price: number
  /**
   * Foto del vehículo en `public/limusinas/`. Es opcional a propósito:
   * mientras no existan los recortes la tarjeta muestra un marcador y todo lo
   * demás (selección y cotizador) funciona igual.
   */
  image?: string
}

// Flota ordenada de mayor a menor capacidad. Hay dos Hummer y dos Chrysler:
// se distinguen por color, así que el id lo incluye — el modelo solo no basta.
const LIMUSINAS: Limusina[] = [
  { id: 'hummer-blanca-15', model: 'Hummer blanca', capacity: 15, price: 472_990, image: '/limusinas/hummer-blanca.jpg' },
  { id: 'party-truck-12', model: 'Party Truck', capacity: 12, price: 472_990, image: '/limusinas/party-truck.jpg' },
  { id: 'hummer-azul-10', model: 'Hummer azul', capacity: 10, price: 422_990, image: '/limusinas/hummer-azul.jpg' },
  { id: 'chrysler-blanca-10', model: 'Chrysler blanca', capacity: 10, price: 422_990, image: '/limusinas/chrysler-blanca.jpg' },
  { id: 'chrysler-dorado-6', model: 'Chrysler blanca con dorado', capacity: 6, price: 372_990, image: '/limusinas/chrysler-dorada.jpg' },
]

const INCLUDED = [
  { icon: Crown, text: 'Gorros rosados para todas y uno especial para la festejada' },
  { icon: Wine, text: 'Champaña y brindis' },
  { icon: Music, text: 'Música y ambiente privado' },
  { icon: PartyPopper, text: 'Anfitrión Luxx con traje a elección, baile y mucha diversión' },
  { icon: Camera, text: 'Fotografías grupales' },
  {
    icon: MapPin,
    text: 'Las buscamos en el punto de Santiago que elijan y, al finalizar, las dejamos en su destino preferido',
  },
]

export function LimusinasSelector() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [people, setPeople] = useState(1)
  // Instancia del carrusel, para manejar las flechas desde nuestros botones.
  const [swiper, setSwiper] = useState<SwiperClass | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(false)

  const selected = LIMUSINAS.find((l) => l.id === selectedId) ?? null

  const quoterRef = useRef<HTMLDivElement>(null)

  // El cotizador se despliega debajo del listado de lo que incluye, casi
  // siempre fuera de pantalla: sin este scroll, seleccionar una limusina
  // parece no hacer nada.
  useEffect(() => {
    if (!selectedId) return
    quoterRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [selectedId])

  const select = (limusina: Limusina) => {
    if (limusina.id === selectedId) {
      // Volver a tocar la misma tarjeta cierra el cotizador.
      setSelectedId(null)
      return
    }
    setSelectedId(limusina.id)
    // Se parte con el vehículo lleno: es el escenario que deja el valor por
    // persona más bajo, que es lo que la clienta quiere ver primero.
    setPeople(limusina.capacity)
  }

  const clampPeople = (value: number) => {
    if (!selected) return 1
    return Math.min(Math.max(value, 1), selected.capacity)
  }

  // Se redondea hacia arriba para que la suma de los aportes nunca quede por
  // debajo del total a pagar.
  const perPerson = selected ? Math.ceil(selected.price / people) : 0
  const deposit = selected ? Math.round(selected.price * DEPOSIT_RATE) : 0
  const depositPerPerson = selected ? Math.ceil(deposit / people) : 0

  const whatsappHref = selected
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        `Hola, me interesa la ${selected.model} (hasta ${selected.capacity} pasajeros) ` +
          `por ${clp(selected.price)}. Somos ${people} ${people === 1 ? 'persona' : 'personas'}. ` +
          `¿Está disponible? 🚗`,
      )}`
    : ''

  return (
    <div>
      {/* Duración: dato que venía en la imagen y no debe perderse */}
      <div className="mb-5 flex items-center justify-center gap-2.5 rounded-xl border border-[#D4AF37]/25 bg-[#D4AF37]/[0.06] px-4 py-3">
        <Clock className="h-4 w-4 shrink-0 text-[#D4AF37]" />
        <p className="font-sans text-xs sm:text-sm text-white/70">
          Todos los valores incluyen{' '}
          <span className="font-semibold text-[#D4AF37]">1 hora de experiencia</span>
        </p>
      </div>

      {/* ── Carrusel de la flota ── */}
      <div className="relative">
        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
            Nuestra flota
          </p>

          <div className="flex items-center gap-2">
            <span className="font-sans text-[11px] tabular-nums text-white/35">
              {Math.min(activeIndex + 1, LIMUSINAS.length)} / {LIMUSINAS.length}
            </span>
            <button
              type="button"
              onClick={() => swiper?.slidePrev()}
              disabled={isBeginning}
              aria-label="Limusina anterior"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/12 text-white/60 transition-colors hover:border-[#D4AF37]/50 hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-25"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => swiper?.slideNext()}
              disabled={isEnd}
              aria-label="Limusina siguiente"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/12 text-white/60 transition-colors hover:border-[#D4AF37]/50 hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-25"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div role="radiogroup" aria-label="Selecciona una limusina">
          <Swiper
            onSwiper={setSwiper}
            onSlideChange={(s) => {
              setActiveIndex(s.activeIndex)
              setIsBeginning(s.isBeginning)
              setIsEnd(s.isEnd)
            }}
            onReachBeginning={() => setIsBeginning(true)}
            onReachEnd={() => setIsEnd(true)}
            grabCursor
            // Sin esto las tarjetas no se pueden seleccionar: Swiper usa
            // threshold 0 por defecto, así que basta que el mouse se mueva un
            // píxel mientras se hace clic para que lo tome como swipe y anule
            // el clic. Con 8px los micro-movimientos ya no cancelan la
            // selección, y un arrastre real sigue desplazando el carrusel.
            threshold={8}
            // Fracciones a propósito: dejar media tarjeta asomada es lo que
            // comunica que el carrusel sigue hacia el lado.
            // Ahora las tarjetas son verticales y más altas, así que caben más
            // por pantalla sin que la foto pierda tamaño.
            breakpoints={{
              0: { slidesPerView: 1.25, spaceBetween: 12 },
              640: { slidesPerView: 2.2, spaceBetween: 14 },
              1024: { slidesPerView: 3.2, spaceBetween: 16 },
            }}
            className="!pb-1"
          >
            {LIMUSINAS.map((limusina) => (
              <SwiperSlide key={limusina.id} className="!h-auto">
                <LimusinaCard
                  limusina={limusina}
                  isSelected={limusina.id === selectedId}
                  onSelect={() => select(limusina)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Qué incluye */}
      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
        <p className="mb-2.5 font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
          La experiencia incluye
        </p>
        <ul className="space-y-2">
          {INCLUDED.map(({ icon: Icon, text }) => (
            // items-start, no items-center: los textos largos ocupan dos
            // líneas y el ícono debe quedar alineado con la primera.
            <li key={text} className="flex items-start gap-2 font-sans text-xs leading-relaxed text-white/55">
              <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#D4AF37]/70" />
              {text}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Cotizador — aparece al elegir un vehículo ── */}
      {selected ? (
        <div
          ref={quoterRef}
          className="mt-4 scroll-mt-24 rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/[0.05] p-5"
        >
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
            Cuánto pone cada una
          </p>
          <p className="mt-1 font-serif text-lg font-bold text-white">
            {selected.model}{' '}
            <span className="font-sans text-sm font-normal text-white/45">
              · {clp(selected.price)}
            </span>
          </p>

          {/* Cantidad de personas */}
          <div className="mt-5">
            <label htmlFor="limusina-personas" className="font-sans text-xs text-white/55">
              ¿Cuántas van?{' '}
              <span className="text-white/30">(máximo {selected.capacity})</span>
            </label>

            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPeople((p) => clampPeople(p - 1))}
                disabled={people <= 1}
                aria-label="Quitar una persona"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/15 text-white/70 transition-colors hover:border-[#D4AF37]/50 hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Minus className="h-4 w-4" />
              </button>

              <input
                id="limusina-personas"
                type="number"
                inputMode="numeric"
                min={1}
                max={selected.capacity}
                value={people}
                onChange={(e) => setPeople(clampPeople(Number(e.target.value)))}
                className="h-10 w-20 rounded-lg border border-white/15 bg-[#0e0a18] text-center font-sans text-base font-bold text-white outline-none transition-colors focus:border-[#D4AF37]"
              />

              <button
                type="button"
                onClick={() => setPeople((p) => clampPeople(p + 1))}
                disabled={people >= selected.capacity}
                aria-label="Agregar una persona"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/15 text-white/70 transition-colors hover:border-[#D4AF37]/50 hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Resultado */}
          <div className="mt-5 rounded-xl border border-[#D4AF37]/25 bg-[#0e0a18]/60 p-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-sans text-xs text-white/50">Cada una paga</span>
              <span className="font-serif text-2xl font-bold text-[#D4AF37]">
                {clp(perPerson)}
              </span>
            </div>

            <div className="mt-3 space-y-1.5 border-t border-white/8 pt-3">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-sans text-[11px] text-white/40">Total del recorrido</span>
                <span className="font-sans text-xs text-white/60">{clp(selected.price)}</span>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-sans text-[11px] text-white/40">
                  Abono para reservar (50%)
                </span>
                <span className="font-sans text-xs text-white/60">
                  {clp(deposit)} · {clp(depositPerPerson)} c/u
                </span>
              </div>
            </div>
          </div>

          <p className="mt-3 font-sans text-[10px] leading-relaxed text-white/35">
            Valores referenciales, válidos dentro de Santiago. Reserva tu fecha con el
            50% de abono, sujeta a disponibilidad.
          </p>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold-pulse mt-4 inline-flex w-full items-center justify-center gap-2.5 rounded-xl px-6 py-3.5 font-sans text-sm font-bold uppercase tracking-widest text-[#0e0a18] transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #ffe599 0%, #D4AF37 45%, #b8922e 100%)',
            }}
          >
            Reservar por WhatsApp →
          </a>
        </div>
      ) : (
        <p className="mt-4 text-center font-sans text-xs text-white/35">
          Selecciona una limusina para calcular cuánto pone cada una.
        </p>
      )}
    </div>
  )
}

function LimusinaCard({
  limusina,
  isSelected,
  onSelect,
}: {
  limusina: Limusina
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      onClick={onSelect}
      className={`group/card flex h-full w-full flex-col overflow-hidden rounded-2xl border text-left transition-all duration-300 ${
        isSelected
          ? 'border-[#D4AF37] bg-[#D4AF37]/[0.10] shadow-[0_0_28px_rgba(212,175,55,0.22)]'
          : 'border-white/10 bg-white/[0.03] hover:border-[#D4AF37]/45 hover:bg-white/[0.05]'
      }`}
    >
      {/* Foto vertical completa — es el protagonista de la tarjeta. La relación
          3/4 es casi la nativa de los archivos, así que no se recorta nada. */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-br from-[#1a1030] to-[#0e0a18]">
        {limusina.image ? (
          <Image
            src={limusina.image}
            alt={`${limusina.model}, limusina para hasta ${limusina.capacity} pasajeros`}
            fill
            sizes="(max-width: 640px) 78vw, (max-width: 1024px) 44vw, 30vw"
            className="object-cover transition-transform duration-500 group-hover/card:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Car className="h-12 w-12 text-[#D4AF37]/25" />
          </div>
        )}

        {isSelected && (
          <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#D4AF37] shadow-lg">
            <Check className="h-4 w-4 text-[#0e0a18]" strokeWidth={3} />
          </span>
        )}
      </div>

      {/* Datos en texto real: aunque la foto ya los trae impresos, el texto de
          una imagen no lo puede leer ni un lector de pantalla ni Google. */}
      <div className="flex flex-1 flex-col p-4">
        <p className="font-serif text-base font-bold leading-tight text-white">
          {limusina.model}
        </p>

        <p className="mt-1 flex items-center gap-1.5 font-sans text-[11px] text-white/45">
          <Users className="h-3 w-3 shrink-0" />
          Hasta {limusina.capacity} personas
        </p>

        <p className="mt-2 font-sans text-xl font-bold text-[#D4AF37]">
          {clp(limusina.price)}
        </p>

        {/* mt-auto deja el botón pegado abajo, para que todas las tarjetas
            queden parejas aunque el nombre ocupe una o dos líneas. */}
        <span
          className={`mt-4 inline-flex items-center justify-center rounded-lg px-4 py-2.5 font-sans text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
            isSelected
              ? 'bg-[#D4AF37] text-[#0e0a18]'
              : 'border border-[#D4AF37]/35 text-[#D4AF37] group-hover/card:border-[#D4AF37]/70'
          }`}
          style={{ marginTop: 'auto' }}
        >
          {isSelected ? 'Seleccionada' : 'Seleccionar'}
        </span>
      </div>
    </button>
  )
}
