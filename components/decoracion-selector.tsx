'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperClass } from 'swiper'
import { Check, ChevronLeft, ChevronRight, Truck } from 'lucide-react'
import 'swiper/css'

const WHATSAPP_NUMBER = '56945501752'

const clp = (n: number) => `$${n.toLocaleString('es-CL')}`

const OPCIONES = [
  {
    id: 'deco-1',
    label: 'Opción 1',
    price: 45_000,
    image: '/decoracion/opcion-1.jpg',
    includes: [
      'Globos 2 tonos lisos',
      '1 estructura',
      'Tela unicolor',
      'Frase personalizada',
      'Adornos en globos',
    ],
  },
  {
    id: 'deco-3',
    label: 'Opción 3',
    price: 50_000,
    image: '/decoracion/opcion-3.jpg',
    includes: [
      '1 estructura',
      '1 letrero LED',
      'Globos 2 tonos lisos',
      '1 globo metálico',
    ],
  },
  {
    id: 'deco-5',
    label: 'Opción 5',
    price: 55_000,
    image: '/decoracion/opcion-5.jpg',
    includes: [
      '1 porta shimmer',
      'Shimmer color a elección',
      'Globos 1 tono liso',
      'Letrero LED',
      'Alfombra',
      '1 cilindro o mesa',
      'Decoración (flores o mariposas)',
    ],
  },
  {
    id: 'deco-2',
    label: 'Opción 2',
    price: 65_000,
    image: '/decoracion/opcion-2.jpg',
    includes: [
      'Panel rectangular shimmer',
      'Color de shimmer a elección',
      'Globos 2 tonos metálico',
      'Decoración en globos (flores o mariposas)',
      '1 cilindro o mesa',
    ],
  },
  {
    id: 'deco-4',
    label: 'Opción 4',
    price: 80_000,
    image: '/decoracion/opcion-4.jpg',
    includes: [
      '1 estructura de 2×2',
      '1 letrero LED',
      'Shimmer color a elección',
      'Globos 2 tonos lisos + 1 metálico',
      'Flores o mariposas en globos',
    ],
  },
] as const

type Opcion = (typeof OPCIONES)[number]

export function DecoracionSelector() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [swiper, setSwiper] = useState<SwiperClass | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(false)
  const quoterRef = useRef<HTMLDivElement>(null)

  const selected = OPCIONES.find(o => o.id === selectedId) ?? null

  useEffect(() => {
    if (!selectedId) return
    quoterRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [selectedId])

  const toggle = (id: string) => setSelectedId(prev => (prev === id ? null : id))

  const whatsappHref = selected
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        `Hola, me interesa la ${selected.label} de decoración (${clp(selected.price)} + traslado). ¿Podrían orientarme? 🎉`
      )}`
    : ''

  return (
    <div>
      {/* Info banner */}
      <div className="mb-5 flex items-center justify-center gap-2.5 rounded-xl border border-[#D4AF37]/25 bg-[#D4AF37]/[0.06] px-4 py-3">
        <Truck className="h-4 w-4 shrink-0 text-[#D4AF37]" />
        <p className="font-sans text-xs sm:text-sm text-white/70">
          Todos los valores incluyen{' '}
          <span className="font-semibold text-[#D4AF37]">traslado dentro de Santiago</span>
        </p>
      </div>

      {/* Carousel */}
      <div className="relative">
        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
            Nuestras opciones
          </p>
          <div className="flex items-center gap-2">
            <span className="font-sans text-[11px] tabular-nums text-white/35">
              {activeIndex + 1} / {OPCIONES.length}
            </span>
            <button
              type="button"
              onClick={() => swiper?.slidePrev()}
              disabled={isBeginning}
              aria-label="Opción anterior"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/12 text-white/60 transition-colors hover:border-[#D4AF37]/50 hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-25"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => swiper?.slideNext()}
              disabled={isEnd}
              aria-label="Opción siguiente"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/12 text-white/60 transition-colors hover:border-[#D4AF37]/50 hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-25"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div role="radiogroup" aria-label="Selecciona una opción de decoración">
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
            threshold={8}
            breakpoints={{
              0: { slidesPerView: 1.25, spaceBetween: 12 },
              640: { slidesPerView: 2.2, spaceBetween: 14 },
              1024: { slidesPerView: 3.2, spaceBetween: 16 },
            }}
            className="!pb-1"
          >
            {OPCIONES.map(opcion => (
              <SwiperSlide key={opcion.id} className="!h-auto">
                <OpcionCard
                  opcion={opcion}
                  isSelected={opcion.id === selectedId}
                  onSelect={() => toggle(opcion.id)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Quoter */}
      {selected ? (
        <div
          ref={quoterRef}
          className="mt-4 scroll-mt-24 rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/[0.05] p-5"
        >
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
            Resumen
          </p>
          <p className="mt-1 font-serif text-lg font-bold text-white">
            {selected.label}{' '}
            <span className="font-sans text-sm font-normal text-white/45">
              · {clp(selected.price)} + traslado
            </span>
          </p>

          <ul className="mt-4 space-y-2">
            {selected.includes.map(item => (
              <li key={item} className="flex items-start gap-2 font-sans text-xs leading-relaxed text-white/60">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#D4AF37]" />
                {item}
              </li>
            ))}
          </ul>

          <p className="mt-3 font-sans text-[10px] leading-relaxed text-white/35">
            Valores referenciales. El traslado se coordina según ubicación y disponibilidad.
          </p>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold-pulse mt-4 inline-flex w-full items-center justify-center gap-2.5 rounded-xl px-6 py-3.5 font-sans text-sm font-bold uppercase tracking-widest text-[#0e0a18] transition-all duration-300"
            style={{ background: 'linear-gradient(135deg, #ffe599 0%, #D4AF37 45%, #b8922e 100%)' }}
          >
            Reservar por WhatsApp →
          </a>
        </div>
      ) : (
        <p className="mt-4 text-center font-sans text-xs text-white/35">
          Selecciona una opción para ver el detalle y cotizar.
        </p>
      )}
    </div>
  )
}

function OpcionCard({
  opcion,
  isSelected,
  onSelect,
}: {
  opcion: Opcion
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
      {/* Foto */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0e0a18]">
        <Image
          src={opcion.image}
          alt={`${opcion.label} decoración Luxx`}
          fill
          sizes="(max-width: 640px) 78vw, (max-width: 1024px) 44vw, 30vw"
          className="object-cover transition-transform duration-500 group-hover/card:scale-105"
        />
        {isSelected && (
          <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#D4AF37] shadow-lg">
            <Check className="h-4 w-4 text-[#0e0a18]" strokeWidth={3} />
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <p className="font-sans text-xl font-bold text-[#D4AF37]">
          {clp(opcion.price)}
          <span className="ml-1.5 font-sans text-[11px] font-normal text-white/40">+ traslado</span>
        </p>

        <ul className="mt-3 space-y-1.5">
          {opcion.includes.map(item => (
            <li key={item} className="flex items-start gap-1.5 font-sans text-[11px] leading-relaxed text-white/55">
              <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-[#D4AF37]/60" />
              {item}
            </li>
          ))}
        </ul>

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
