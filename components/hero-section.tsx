'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { gsap } from 'gsap'
import { ArrowDown, Sparkles, CalendarCheck } from 'lucide-react'
import { GoldParticles } from './gold-particles'

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', prefersReducedMotion ? '0%' : '45%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  useEffect(() => {
    if (prefersReducedMotion || !textRef.current) return
    const chars = textRef.current.querySelectorAll('.char')
    gsap.fromTo(
      chars,
      { opacity: 0, y: 80 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.025,
        duration: 0.9,
        ease: 'power4.out',
        delay: 0.4,
      }
    )
  }, [prefersReducedMotion])

  const splitText = (text: string) => {
    return text.split('').map((char, index) => (
      <span key={index} className="char inline-block">
        {char === ' ' ? '\u00A0' : char}
      </span>
    ))
  }

  const splitTextGold = (text: string) => {
    return text.split('').map((char, index) => (
      <span
        key={index}
        className="char inline-block"
        style={{
          background: 'linear-gradient(135deg, #ffe599 0%, #D4AF37 35%, #FFD700 55%, #e8c84a 100%)',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 0 10px rgba(212,175,55,0.7))',
          animation: prefersReducedMotion ? 'none' : 'vip-shine 4s linear infinite, gold-text-glow 3s ease-in-out infinite',
        }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ))
  }

  return (
    <section
      ref={containerRef}
      className="relative h-[100svh] min-h-[640px] flex items-center justify-center overflow-hidden"
    >
      {/* Background Video/Image with Parallax */}
      <motion.div
        style={{ y, willChange: 'transform' }}
        className="absolute inset-0 z-0"
      >
        {/* Poster local — visible mientras carga el video */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/vedetos/todos.webp')" }}
        />

        {/* Video en todos los dispositivos */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/vedetos/todos.webp"
        >
          <source src="/magicmike-desktop.mp4" type="video/mp4" />
        </video>

        {/* Subtle top fade for navbar readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent via-30% to-transparent" />

        {/* Bottom fade — fuses seamlessly with page background */}
        <div className="hero-bottom-fade absolute inset-0" />
      </motion.div>

      {/* Gold Particles — concentrated toward center/text */}
      <GoldParticles count={30} className="z-10" opacityClassName="opacity-80" concentrated />

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-20 w-full max-w-5xl mx-auto px-5 sm:px-8 text-center flex flex-col items-center"
      >
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="flex items-center justify-center gap-2.5 mb-6 sm:mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-white/70" />
          <span className="text-white/80 font-sans text-[11px] sm:text-sm tracking-[0.32em] uppercase">
            Experiencias Exclusivas
          </span>
          <Sparkles className="w-3.5 h-3.5 text-white/70" />
        </motion.div>

        {/* Main Title */}
        <div ref={textRef} className="overflow-hidden mb-2">
          <h1
            className="text-[clamp(3rem,12vw,6rem)] font-serif font-bold text-[#F5F5F5] leading-[0.95] tracking-tight"
            style={{ opacity: prefersReducedMotion ? 1 : undefined }}
          >
            {splitTextGold('Shows')}{splitText(' que')}
          </h1>
          <h1
            className="text-[clamp(3rem,12vw,6rem)] font-serif font-bold leading-[0.95] tracking-tight text-white"
            style={{ opacity: prefersReducedMotion ? 1 : undefined }}
          >
            {splitTextGold('Nadie')}{splitText(' Olvida')}
          </h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.7 }}
          className="mt-5 sm:mt-7 text-base sm:text-lg text-white/75 font-sans max-w-lg mx-auto leading-relaxed"
        >
          Los artistas más solicitados de Chile. Agenda tu show privado.
        </motion.p>

        {/* CTA Buttons — mobile first: WhatsApp prominent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.7 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm sm:max-w-none"
        >
          {/* Primary: Reservar */}
          <Link href="/vedetos" className="w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 bg-[#D4AF37] text-[#0A0A0A] font-sans text-sm tracking-wider uppercase font-semibold rounded-sm min-h-[56px] sm:min-h-[52px] shadow-[0_0_22px_6px_rgba(212,175,55,0.5),0_0_50px_10px_rgba(212,175,55,0.2)] hover:bg-[#E8C34A] transition-colors duration-300"
            >
              <CalendarCheck className="w-5 h-5 flex-shrink-0" />
              <span>Reservar Ahora</span>
            </motion.button>
          </Link>

        </motion.div>

        {/* Trust badges — social proof for ads traffic */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.6 }}
          className="mt-6 flex items-center justify-center gap-4 sm:gap-6"
        >
          {[
            { value: '500+', label: 'Eventos' },
            { value: '4.9★', label: 'Calificación' },
            { value: '100%', label: 'Discreto' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-white font-serif text-base sm:text-lg font-bold leading-none">{stat.value}</p>
              <p className="text-[#b3acc4] font-sans text-[10px] sm:text-xs tracking-wider uppercase mt-0.5">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.7 }}
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-1.5"
        >
          <span className="text-[#b3acc4] font-sans text-[10px] tracking-widest uppercase">
            Desliza
          </span>
          <ArrowDown className="w-4 h-4 text-white/70" />
        </motion.div>
      </motion.div>
    </section>
  )
}
