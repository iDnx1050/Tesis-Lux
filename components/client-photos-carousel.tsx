'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import { Heart } from 'lucide-react'

import 'swiper/css'

const ROW_1 = [
  { src: '/Galeria/IMG_9099.PNG',                              alt: 'Experiencia 1' },
  { src: '/Galeria/0b6b176f-3659-4521-8127-4a0260d8a4e6.jpg', alt: 'Experiencia 2' },
  { src: '/Galeria/IMG_9100.PNG',                              alt: 'Experiencia 3' },
  { src: '/Galeria/5719389e-b4e4-46f7-9f80-7590617fd216.JPG', alt: 'Experiencia 4' },
  { src: '/Galeria/IMG_9102.PNG',                              alt: 'Experiencia 5' },
  { src: '/Galeria/IMG_9103.PNG',                              alt: 'Experiencia 6' },
  { src: '/Galeria/IMG_9099.PNG',                              alt: 'Experiencia 1b' },
  { src: '/Galeria/0b6b176f-3659-4521-8127-4a0260d8a4e6.jpg', alt: 'Experiencia 2b' },
]


export function ClientPhotosCarousel() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="relative py-8 sm:py-12 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[28rem] w-[28rem] rounded-full bg-[#3d1c85]/8 blur-3xl" />
        <div className="absolute bottom-0 right-[8%] h-40 w-40 rounded-full bg-[#D4AF37]/4 blur-2xl" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center mb-6 sm:mb-8 px-5"
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
          <span className="text-white/80 font-sans text-[11px] sm:text-sm tracking-[0.32em] uppercase">Momentos reales</span>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
        </div>
        <h2
          className="gold-text-glow font-serif text-[clamp(1.4rem,4vw,2.2rem)] font-bold leading-tight"
          style={{
            background: 'linear-gradient(135deg, #ffe599 0%, #D4AF37 30%, #FFD700 55%, #B8962E 75%, #e8c84a 100%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Ellas ya vivieron la experiencia
        </h2>
        <span className="title-vip-line" aria-hidden="true" />
        <p className="mt-1.5 text-white/50 font-sans text-xs sm:text-sm max-w-xs mx-auto">
          ¿Cuándo es la tuya?
        </p>
      </motion.div>

      {/* Single carousel */}
      <div className="relative z-10">
        <Swiper
          modules={[Autoplay]}
          grabCursor
          loop
          speed={prefersReducedMotion ? 0 : 4800}
          autoplay={prefersReducedMotion ? false : {
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            0:    { slidesPerView: 2.2, spaceBetween: 8 },
            480:  { slidesPerView: 3.2, spaceBetween: 10 },
            768:  { slidesPerView: 4.2, spaceBetween: 12 },
            1200: { slidesPerView: 5.5, spaceBetween: 14 },
          }}
          className="!overflow-visible client-swiper"
        >
          {ROW_1.map((photo, i) => (
            <SwiperSlide key={`r1-${i}`}>
              <PhotoCard photo={photo} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

function PhotoCard({ photo }: { photo: { src: string; alt: string } }) {
  return (
    <div className="group relative overflow-hidden rounded-xl"
      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)' }}
    >
      {/* 4:5 ratio — compact, vertical, elegant */}
      <div className="relative aspect-[4/5]">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          className="object-cover transition-transform duration-600 group-hover:scale-105"
          sizes="(max-width: 480px) 48vw, (max-width: 768px) 32vw, (max-width: 1200px) 24vw, 18vw"
        />
        {/* Subtle base overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0620]/60 via-transparent to-transparent" />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[#6d28d9]/0 group-hover:bg-[#6d28d9]/15 transition-colors duration-400" />
        {/* Hover border */}
        <div className="absolute inset-0 rounded-xl border border-white/6 group-hover:border-[#D4AF37]/35 transition-colors duration-400" />
        {/* Heart badge */}
        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-75 group-hover:scale-100">
          <Heart className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
        </div>
      </div>
    </div>
  )
}
