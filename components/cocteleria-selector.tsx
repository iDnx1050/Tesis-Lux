'use client'

import { useState, useRef, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperClass } from 'swiper'
import {
  Check, ChevronLeft, ChevronRight, Wine, Utensils, UtensilsCrossed, Users,
} from 'lucide-react'
import 'swiper/css'

const WHATSAPP_NUMBER = '56945501752'

const clp = (n: number) => `$${n.toLocaleString('es-CL')}`

const PAQUETES = [
  {
    id: 'coctel-basico',
    label: 'Básico',
    price: 35_000,
    forPeople: '4–6 personas',
    Icon: Wine,
    accent: 'from-[#2c0d5e]/50 to-[#1a0836]',
    includes: [
      'Mini cupcakes (6 un.)',
      'Limonada artesanal (1 L)',
      'Brochetas dulces (6 un.)',
      'Presentación con elegancia',
    ],
  },
  {
    id: 'coctel-intermedio',
    label: 'Intermedio',
    price: 55_000,
    forPeople: '6–10 personas',
    Icon: Utensils,
    accent: 'from-[#1e0842]/60 to-[#0e0a18]',
    includes: [
      'Tabla de charcutería',
      'Brochetas mixtas (8 un.)',
      'Limonada artesanal (1.5 L)',
      'Presentación con elegancia',
    ],
  },
  {
    id: 'coctel-completo',
    label: 'Completo',
    price: 80_000,
    forPeople: '10–15 personas',
    Icon: UtensilsCrossed,
    accent: 'from-[#3d1280]/50 to-[#1a0836]',
    includes: [
      'Tabla de charcutería grande',
      'Brochetas mixtas (12 un.)',
      'Mini cupcakes (12 un.)',
      'Limonadas artesanales (2 L)',
      'Presentación con elegancia',
    ],
  },
] as const

type Paquete = (typeof PAQUETES)[number]

export function CocteleriaSelector() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [swiper, setSwiper] = useState<SwiperClass | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(false)
  const quoterRef = useRef<HTMLDivElement>(null)

  const selected = PAQUETES.find(p => p.id === selectedId) ?? null

  useEffect(() => {
    if (!selectedId) return
    quoterRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [selectedId])

  const toggle = (id: string) => setSelectedId(prev => (prev === id ? null : id))

  const whatsappHref = selected
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        `Hola, me interesa el paquete de coctelería ${selected.label} (${clp(selected.price)}) para mi evento. ¿Podrían orientarme? 🥂`
      )}`
    : ''

  return (
    <div>
      {/* Info banner */}
      <div className="mb-5 flex items-center justify-center gap-2.5 rounded-xl border border-[#D4AF37]/25 bg-[#D4AF37]/[0.06] px-4 py-3">
        <Wine className="h-4 w-4 shrink-0 text-[#D4AF37]" />
        <p className="font-sans text-xs sm:text-sm text-white/70">
          Presentados con elegancia para{' '}
          <span className="font-semibold text-[#D4AF37]">que disfrutes sin preocuparte de nada</span>
        </p>
      </div>

      {/* Carousel */}
      <div className="relative">
        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
            Nuestros paquetes
          </p>
          <div className="flex items-center gap-2">
            <span className="font-sans text-[11px] tabular-nums text-white/35">
              {Math.min(activeIndex + 1, PAQUETES.length)} / {PAQUETES.length}
            </span>
            <button
              type="button"
              onClick={() => swiper?.slidePrev()}
              disabled={isBeginning}
              aria-label="Paquete anterior"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/12 text-white/60 transition-colors hover:border-[#D4AF37]/50 hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-25"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => swiper?.slideNext()}
              disabled={isEnd}
              aria-label="Paquete siguiente"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/12 text-white/60 transition-colors hover:border-[#D4AF37]/50 hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-25"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div role="radiogroup" aria-label="Selecciona un paquete de coctelería">
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
            {PAQUETES.map(paquete => (
              <SwiperSlide key={paquete.id} className="!h-auto">
                <PaqueteCard
                  paquete={paquete}
                  isSelected={paquete.id === selectedId}
                  onSelect={() => toggle(paquete.id)}
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
            Paquete {selected.label}{' '}
            <span className="font-sans text-sm font-normal text-white/45">
              · {clp(selected.price)}
            </span>
          </p>
          <p className="mt-1 flex items-center gap-1.5 font-sans text-[11px] text-white/40">
            <Users className="h-3 w-3 shrink-0" />
            {selected.forPeople}
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
            Valores referenciales. Se coordina según disponibilidad y tipo de evento.
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
          Selecciona un paquete para ver el detalle y cotizar.
        </p>
      )}
    </div>
  )
}

function PaqueteCard({
  paquete,
  isSelected,
  onSelect,
}: {
  paquete: Paquete
  isSelected: boolean
  onSelect: () => void
}) {
  const { Icon } = paquete
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
      {/* Visual top */}
      <div className={`relative flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-br ${paquete.accent}`}>
        <Icon className="h-14 w-14 text-[#D4AF37]/30 transition-all duration-500 group-hover/card:scale-110 group-hover/card:text-[#D4AF37]/50" />
        <span className="absolute left-3 top-3 rounded-md bg-[#0e0a18]/70 px-2 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
          {paquete.label}
        </span>
        {isSelected && (
          <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#D4AF37] shadow-lg">
            <Check className="h-4 w-4 text-[#0e0a18]" strokeWidth={3} />
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <p className="font-sans text-xl font-bold text-[#D4AF37]">
          {clp(paquete.price)}
        </p>
        <p className="mt-0.5 flex items-center gap-1 font-sans text-[11px] text-white/40">
          <Users className="h-3 w-3 shrink-0" />
          {paquete.forPeople}
        </p>

        <ul className="mt-3 space-y-1.5">
          {paquete.includes.map(item => (
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
          {isSelected ? 'Seleccionado' : 'Seleccionar'}
        </span>
      </div>
    </button>
  )
}
