'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import { GoldParticles } from '@/components/gold-particles'
import { GlassWater, Cake, Building2, Flower2, UtensilsCrossed, Car } from 'lucide-react'

import 'swiper/css'
import 'swiper/css/pagination'

const OCCASIONS = [
  {
    icon: GlassWater,
    category: 'Show Privado',
    title: 'Despedidas',
    description: 'El plan estelar para despedidas de soltera. Vedettos profesionales, show a tu medida y una noche inolvidable con tus amigas.',
    features: ['Vedetos profesionales', 'Show personalizado', 'Música y luces propias'],
    href: '/cotizador',
    cta: 'COTIZAR',
    photo: '/Galeria/IMG_9099.PNG',
  },
  {
    icon: Cake,
    category: 'Celebración',
    title: 'Cumpleaños',
    description: 'Sorprende en el cumpleaños perfecto. Un show personalizado que convierte la celebración en el mejor recuerdo del año.',
    features: ['Sorpresa a domicilio', 'Show a medida', 'Experiencia única'],
    href: '/cotizador',
    cta: 'COTIZAR',
    photo: '/Galeria/0b6b176f-3659-4521-8127-4a0260d8a4e6.jpg',
  },
  {
    icon: Building2,
    category: 'Corporativo',
    title: 'Eventos Corporativos',
    description: 'Cierres de año, aniversarios y celebraciones de empresa. Producción profesional y discreta al nivel que tu organización merece.',
    features: ['Producción discreta', 'Artistas de élite', 'Coordinación completa'],
    href: '/vedetos',
    cta: 'RESERVAR',
    photo: '/Galeria/IMG_9103.PNG',
  },
  {
    icon: Car,
    category: 'Transporte VIP',
    title: 'Limusina',
    description: 'Llega en grande. Servicio de limusina para que tú y tus amigas vivan la experiencia VIP desde el primer momento.',
    features: ['Hasta 15 personas', 'Champaña y gorros', 'Traslado de lujo'],
    href: '/extras',
    cta: 'VER MÁS',
    photo: '/Limu Lux.jpeg',
  },
  {
    icon: Flower2,
    category: 'Ambientación',
    title: 'Decoración',
    description: 'Arcos de globos, paneles shimmer y ambientación completa. Transformamos tu espacio en algo que no se olvida.',
    features: ['Arcos y shimmer', 'Letrero LED incluido', 'Montaje y desmontaje'],
    href: '/extras',
    cta: 'VER MÁS',
    photo: '/Deco Lux.jpeg',
  },
  {
    icon: UtensilsCrossed,
    category: 'Gastronomía',
    title: 'Coctelería',
    description: 'Tablas de charcutería, brochetas, cupcakes y limonadas artesanales. La experiencia gastronómica perfecta para tu evento.',
    features: ['Tabla de charcutería', 'Mini cupcakes', 'Limonada artesanal'],
    href: '/extras',
    cta: 'VER MÁS',
    photo: '/Cocteleria lux.jpeg',
  },
]

export function EditorialShowcase() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="relative py-10 md:py-24 overflow-hidden">
      {/* Background orbs */}
      <div className="absolute left-[-5%] top-[10%] h-64 w-64 rounded-full bg-[#D4AF37]/5 blur-3xl pointer-events-none" />
      <div className="absolute right-[-6%] bottom-[10%] h-80 w-80 rounded-full bg-[#3d1c85]/15 blur-3xl pointer-events-none" />
      <GoldParticles count={18} className="z-0" opacityClassName="opacity-50" />

      <div className="relative mx-auto max-w-7xl z-10">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-14 px-6"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
            <span className="text-white/60 font-sans text-[10px] font-semibold tracking-[0.35em] uppercase">
              Lo que ofrecemos
            </span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
          </div>
          <h2
            className="font-serif text-[clamp(2rem,5vw,3rem)] font-bold gold-text-glow"
            style={{
              background: 'linear-gradient(135deg, #ffe599 0%, #D4AF37 30%, #FFD700 55%, #B8962E 75%, #e8c84a 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Nuestros Servicios
          </h2>
        </motion.div>

        {/* ── Móvil: Swiper (sin cambios) ── */}
        <div className="md:hidden px-5">
          <Swiper
            modules={[Pagination]}
            slidesPerView={1.15}
            spaceBetween={14}
            centeredSlides={false}
            pagination={{ clickable: true }}
            className="occasions-swiper !pb-10"
          >
            {OCCASIONS.map((item) => (
              <SwiperSlide key={item.title}>
                <MobileCard item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* ── Desktop: grid editorial 2 columnas ── */}
        <div className="hidden md:grid md:grid-cols-2 gap-3 px-6">
          {OCCASIONS.map((item, index) => (
            <motion.div
              key={item.title}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <DesktopCard item={item} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

/* ── Desktop card — estilo editorial ── */
function DesktopCard({ item }: { item: typeof OCCASIONS[0] }) {
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      className="group relative flex overflow-hidden rounded-2xl"
      style={{
        height: 300,
        boxShadow: '0 8px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.05)',
      }}
    >
      {/* Imagen de fondo */}
      <Image
        src={item.photo}
        alt=""
        fill
        className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 1280px) 50vw, 640px"
        aria-hidden="true"
      />

      {/* Overlay: gradiente de izquierda (texto) */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0e0a18]/90 via-[#0e0a18]/55 to-[#0e0a18]/10 transition-opacity duration-500" />
      {/* Overlay: gradiente de abajo */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0e0a18]/80 via-transparent to-transparent" />
      {/* Borde gold en hover */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/8 group-hover:ring-[#D4AF37]/35 transition-all duration-500 pointer-events-none" />

      {/* Contenido: anclado abajo-izquierda */}
      <div className="relative z-10 flex flex-col justify-end p-8 pr-20 flex-1">
        {/* Category label */}
        <div className="flex items-center gap-2 mb-3">
          <Icon className="h-3.5 w-3.5 text-[#D4AF37]/80" strokeWidth={1.5} />
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/80">
            {item.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-3xl lg:text-4xl font-bold text-white leading-tight mb-4 group-hover:text-[#ffe08a] transition-colors duration-300">
          {item.title}
        </h3>

        {/* Feature bullets */}
        <ul className="space-y-1.5">
          {item.features.map(f => (
            <li key={f} className="flex items-center gap-2 font-sans text-xs text-white/65">
              <span className="text-[#D4AF37] text-[10px]">✦</span>
              <span className="uppercase tracking-[0.12em] font-semibold">{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Pestaña vertical derecha */}
      <div
        className="absolute right-0 top-0 bottom-0 w-14 flex items-center justify-center transition-all duration-300 group-hover:w-16"
        style={{
          background: 'linear-gradient(180deg, #ffe599 0%, #D4AF37 45%, #b8922e 100%)',
          boxShadow: '-4px 0 20px rgba(0,0,0,0.4)',
        }}
      >
        <span
          className="font-sans font-black text-[11px] tracking-[0.25em] text-[#0e0a18] select-none"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          {item.cta}
        </span>
      </div>
    </Link>
  )
}

/* ── Mobile card — estilo editorial ── */
function MobileCard({ item }: { item: typeof OCCASIONS[0] }) {
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      className="group relative overflow-hidden rounded-2xl flex flex-col"
      style={{
        minHeight: 320,
        boxShadow: '0 8px 40px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.06)',
      }}
    >
      {/* Imagen visible */}
      <Image
        src={item.photo}
        alt=""
        fill
        className="object-cover object-center transition-transform duration-700 group-active:scale-105"
        sizes="90vw"
        aria-hidden="true"
      />

      {/* Overlay: sólo abajo para legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0e0a18] via-[#0e0a18]/65 to-[#0e0a18]/15" />
      {/* Borde sutil */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/8 pointer-events-none" />

      {/* Badge categoría — arriba izquierda */}
      <div className="relative z-10 p-5 flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(212,175,55,0.18)', border: '1px solid rgba(212,175,55,0.30)' }}
        >
          <Icon className="w-3.5 h-3.5 text-[#D4AF37]" strokeWidth={1.5} />
        </div>
        <span className="font-sans text-[9px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/80">
          {item.category}
        </span>
      </div>

      {/* Contenido — anclado abajo */}
      <div className="relative z-10 mt-auto p-5 pt-0 flex flex-col gap-3">
        <h3 className="font-serif text-[1.65rem] font-bold text-white leading-tight">
          {item.title}
        </h3>

        {/* Feature bullets */}
        <ul className="space-y-1.5">
          {item.features.map(f => (
            <li key={f} className="flex items-center gap-2 font-sans text-[11px] text-white/70">
              <span className="text-[#D4AF37] text-[9px] flex-shrink-0">✦</span>
              <span className="uppercase tracking-[0.1em] font-semibold">{f}</span>
            </li>
          ))}
        </ul>

        {/* CTA botón dorado */}
        <div
          className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-sans text-[11px] font-black uppercase tracking-[0.18em] text-[#0e0a18]"
          style={{ background: 'linear-gradient(135deg, #ffe599 0%, #D4AF37 100%)' }}
        >
          {item.cta} →
        </div>
      </div>
    </Link>
  )
}
