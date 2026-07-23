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
    title: 'Despedidas',
    description:
      'El plan estelar para despedidas de soltera. Vedettos profesionales, show a tu medida y una noche inolvidable con tus amigas.',
    href: '/vedetos',
    photo: '/Galeria/IMG_9099.PNG',
  },
  {
    icon: Cake,
    title: 'Cumpleaños',
    description:
      'Sorprende en el cumpleaños perfecto. Un show personalizado que convierte la celebración en el mejor recuerdo del año.',
    href: '/vedetos',
    photo: '/Galeria/0b6b176f-3659-4521-8127-4a0260d8a4e6.jpg',
  },
  {
    icon: Building2,
    title: 'Eventos Corporativos',
    description:
      'Cierres de año, aniversarios y celebraciones de empresa. Producción profesional y discreta al nivel que tu organización merece.',
    href: '/contacto',
    photo: '/Galeria/IMG_9103.PNG',
  },
  {
    icon: Car,
    title: 'Limusina',
    description:
      'Llega en grande. Servicio de limusina para que tú y tus amigas vivan la experiencia VIP desde el primer momento, antes de que empiece el show.',
    href: '/extras',
    photo: '/Limu Lux.jpeg',
  },
  {
    icon: Flower2,
    title: 'Decoración',
    description:
      'Arcos de globos, paneles shimmer y ambientación completa. Transformamos tu espacio en algo que no se olvida.',
    href: '/extras',
    photo: '/Deco Lux.jpeg',
  },
  {
    icon: UtensilsCrossed,
    title: 'Coctelería',
    description:
      'Tablas de charcutería, brochetas, cupcakes y limonadas artesanales. La experiencia gastronómica perfecta para tu evento.',
    href: '/extras',
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

        {/* Título de sección */}
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

        {/* ── Móvil: carrusel ── */}
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
                <OccasionCard item={item} index={0} prefersReducedMotion={!!prefersReducedMotion} mobile />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* ── Desktop: grid 3 columnas ── */}
        <div className="hidden md:grid md:grid-cols-3 gap-4 px-6">
          {OCCASIONS.map((item, index) => (
            <OccasionCard
              key={item.title}
              item={item}
              index={index}
              prefersReducedMotion={!!prefersReducedMotion}
            />
          ))}
        </div>

      </div>
    </section>
  )
}

function OccasionCard({
  item,
  index,
  prefersReducedMotion,
  mobile = false,
}: {
  item: typeof OCCASIONS[0]
  index: number
  prefersReducedMotion: boolean
  mobile?: boolean
}) {
  const Icon = item.icon

  return (
    <motion.div
      initial={prefersReducedMotion || mobile ? false : { opacity: 0, y: 28 }}
      whileInView={mobile ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.55, delay: index * 0.12 }}
      className="group relative overflow-hidden rounded-2xl flex flex-col min-h-[240px] md:min-h-[420px]"
      style={{ boxShadow: '0 4px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)' }}
    >
      <Image
        src={item.photo}
        alt=""
        fill
        className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 90vw, 33vw"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[#0e0a18]/72 group-hover:bg-[#0e0a18]/65 transition-colors duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0e0a18]/90 via-[#0e0a18]/40 to-transparent" />
      <div className="absolute inset-0 rounded-2xl border border-white/8 group-hover:border-[#D4AF37]/35 transition-colors duration-500 pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/0 group-hover:via-[#D4AF37]/50 to-transparent transition-all duration-500 pointer-events-none" />

      <div className="relative z-10 p-6 md:p-12 flex flex-col items-center text-center gap-3 md:gap-6 h-full justify-center">
        <div
          className="w-10 h-10 md:w-16 md:h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.25)' }}
        >
          <Icon className="w-5 h-5 md:w-8 md:h-8 text-[#D4AF37]" strokeWidth={1.5} />
        </div>

        <div className="flex flex-col gap-1.5 md:gap-3">
          <h3 className="font-serif text-lg md:text-3xl font-bold text-white group-hover:text-[#ffe08a] transition-colors duration-300">
            {item.title}
          </h3>
          <p className="font-sans text-xs md:text-base text-white/70 leading-relaxed max-w-[260px]">
            {item.description}
          </p>
        </div>

        <Link
          href={item.href}
          className="inline-flex items-center gap-1.5 font-sans text-xs tracking-widest uppercase text-[#D4AF37]/80 hover:text-[#D4AF37] transition-colors duration-300"
        >
          Ver más
          <span className="text-base leading-none transition-transform duration-300 group-hover:translate-x-0.5">→</span>
        </Link>
      </div>
    </motion.div>
  )
}
