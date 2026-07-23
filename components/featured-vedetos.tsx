'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { VedetoCard } from './vedeto-card'
import { GoldParticles } from './gold-particles'
import { featuredVedetos } from '@/lib/mock-data'

import 'swiper/css'

export function FeaturedVedetos() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) return
    gsap.registerPlugin(ScrollTrigger)

    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 82%',
            end: 'top 55%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [prefersReducedMotion])

  return (
    <section
      ref={sectionRef}
      id="featured"
      className="py-8 md:py-14 bg-transparent relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[480px] w-[480px] rounded-full bg-[#3d1c85]/12 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-[8%] h-[200px] w-[200px] rounded-full bg-[#D8AF43]/6 blur-3xl pointer-events-none" />
      <GoldParticles count={25} className="z-0" opacityClassName="opacity-60" />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
            className="flex items-center justify-center gap-3 mb-3"
          >
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
            <span className="text-white/80 font-sans text-[11px] sm:text-sm tracking-[0.32em] uppercase">
              Nuestra Selección
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
          </motion.div>

          <h2
            ref={titleRef}
            className="gold-text-glow text-[clamp(2rem,8vw,4rem)] font-serif font-bold leading-tight"
            style={{
              background: 'linear-gradient(135deg, #ffe599 0%, #D4AF37 30%, #FFD700 55%, #B8962E 75%, #e8c84a 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.04em',
              animationPlayState: prefersReducedMotion ? 'paused' : 'running',
            }}
          >
            Artistas Destacados
          </h2>
          <span className="title-vip-line" aria-hidden="true" />

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.25 }}
            className="mt-3 text-white/75 font-sans text-sm sm:text-base max-w-xl mx-auto leading-relaxed"
          >
            Desata la pasión eligiendo tu show masculino irresistible.
          </motion.p>
        </div>

        {/* Swipe hint — visible only on mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2 mb-4 sm:hidden"
        >
          <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]/60" />
          <span className="text-[#b3acc4] font-sans text-[10px] tracking-widest uppercase">
            Desliza para ver más
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]/60" />
        </motion.div>

        {/* Featured Carousel */}
        <Swiper
          modules={[Autoplay]}
          grabCursor={true}
          loop={true}
          speed={prefersReducedMotion ? 0 : 6500}
          spaceBetween={16}
          autoplay={prefersReducedMotion ? false : {
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            0:    { slidesPerView: 1.1, spaceBetween: 12 },
            480:  { slidesPerView: 1.4, spaceBetween: 14 },
            640:  { slidesPerView: 1.9, spaceBetween: 16 },
            768:  { slidesPerView: 2.5, spaceBetween: 20 },
            1024: { slidesPerView: 2.8, spaceBetween: 22 },
            1200: { slidesPerView: 3.4, spaceBetween: 24 },
          }}
          className="featured-vedetos-swiper !overflow-visible !py-6"
        >
          {featuredVedetos.map((vedeto, index) => (
            <SwiperSlide key={vedeto.id} className="h-auto">
              <VedetoCard vedeto={vedeto} index={index} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.5 }}
          className="text-center mt-6 sm:mt-10"
        >
          <Link href="/vedetos">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="btn-gold-pulse group inline-flex items-center gap-2.5 rounded-sm px-7 sm:px-8 py-3.5 sm:py-4 bg-[#D4AF37] text-[#0A0A0A] font-sans text-sm tracking-wider uppercase font-bold hover:bg-[#E8C34A] transition-colors duration-300 min-h-[52px]"
            >
              <span>Ver Todos los Artistas</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 flex-shrink-0" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
