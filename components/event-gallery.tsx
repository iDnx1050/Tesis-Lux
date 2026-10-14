'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react'

const GALLERY_PHOTOS: { src: string; alt: string }[] = [
  { src: '/Galeria/IMG_9099.PNG',                              alt: 'Evento exclusivo 1' },
  { src: '/Galeria/0b6b176f-3659-4521-8127-4a0260d8a4e6.jpg', alt: 'Evento exclusivo 2' },
  { src: '/Galeria/IMG_9100.PNG',                              alt: 'Evento exclusivo 3' },
  { src: '/Galeria/5719389e-b4e4-46f7-9f80-7590617fd216.JPG', alt: 'Evento exclusivo 4' },
  { src: '/Galeria/IMG_9102.PNG',                              alt: 'Evento exclusivo 5' },
  { src: '/Galeria/IMG_9103.PNG',                              alt: 'Evento exclusivo 6' },
]

export function EventGallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const prefersReducedMotion = useReducedMotion()
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  const openLightbox = useCallback((i: number) => setLightboxIndex(i), [])
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

  const goPrev = useCallback(() =>
    setLightboxIndex(i => (i === null ? null : (i - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length)),
  [])

  const goNext = useCallback(() =>
    setLightboxIndex(i => (i === null ? null : (i + 1) % GALLERY_PHOTOS.length)),
  [])

  useEffect(() => {
    if (lightboxIndex === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxIndex, closeLightbox, goPrev, goNext])

  // Scroll horizontal: en escritorio la sección se fija (pin) y el scroll
  // vertical desplaza la pista hacia la izquierda; cada foto además se mueve
  // dentro de su marco (parallax) usando containerAnimation. En móvil o con
  // "reducir movimiento" queda el carrusel nativo con swipe. El HTML del
  // servidor ya es ese carrusel visible: si el JS falla, nada queda oculto.
  useEffect(() => {
    const pin = pinRef.current
    const track = trackRef.current
    if (!pin || !track) return
    gsap.registerPlugin(ScrollTrigger)

    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const distance = () => track.scrollWidth - window.innerWidth

      const scrollTween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressRef.current) gsap.set(progressRef.current, { scaleX: self.progress })
          },
        },
      })

      track.querySelectorAll<HTMLElement>('[data-parallax]').forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -8 },
          {
            xPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: img.parentElement,
              containerAnimation: scrollTween,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          },
        )
      })
    })

    return () => mm.revert()
  }, [])

  // Lock scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxIndex])

  return (
    <section className="relative py-16 sm:py-24 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 left-1/4 h-80 w-80 rounded-full bg-[#4c1d95]/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-[#D4AF37]/6 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
            <Camera className="w-4 h-4 text-[#D4AF37]/80" strokeWidth={1.5} />
            <span className="text-white/70 font-sans text-[11px] sm:text-xs tracking-[0.35em] uppercase">
              Galería de eventos
            </span>
            <Camera className="w-4 h-4 text-[#D4AF37]/80" strokeWidth={1.5} />
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
          </div>

          <h2
            className="gold-text-glow font-serif text-[clamp(1.8rem,5vw,3rem)] font-bold leading-tight"
            style={{
              background: 'linear-gradient(135deg, #ffe599 0%, #D4AF37 30%, #FFD700 55%, #B8962E 75%, #e8c84a 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Noches que no se olvidan
          </h2>

          <p className="mt-3 text-white/50 font-sans text-sm max-w-sm mx-auto">
            Momentos reales capturados en cada evento privado.
          </p>
        </motion.div>

      </div>

      {/* Galería horizontal. Inspirada en "Horizontal scrolling gallery" de
          GreenSock (ScrollTrigger + containerAnimation). */}
      <div ref={pinRef} className="relative z-10 md:h-screen md:flex md:items-center">
        <div
          ref={trackRef}
          className="flex gap-4 sm:gap-6 px-4 sm:px-6 md:px-[8vw] overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none pb-4 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {GALLERY_PHOTOS.map((photo, i) => (
            <GalleryPanel
              key={photo.src}
              photo={photo}
              index={i}
              total={GALLERY_PHOTOS.length}
              onOpen={() => openLightbox(i)}
            />
          ))}
        </div>

        {/* Barra de progreso (solo escritorio, la mueve GSAP) */}
        <div className="hidden md:block absolute bottom-10 left-[8vw] right-[8vw] h-px bg-white/10">
          <div ref={progressRef} className="h-full origin-left scale-x-0 bg-gradient-to-r from-[#D4AF37] to-[#FFD700]" />
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            photo={GALLERY_PHOTOS[lightboxIndex]}
            index={lightboxIndex}
            total={GALLERY_PHOTOS.length}
            onClose={closeLightbox}
            onPrev={goPrev}
            onNext={goNext}
            prefersReducedMotion={!!prefersReducedMotion}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

// ─── Panel ────────────────────────────────────────────────────────────────────

function GalleryPanel({
  photo,
  index,
  total,
  onOpen,
}: {
  photo: typeof GALLERY_PHOTOS[0]
  index: number
  total: number
  onOpen: () => void
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Ampliar foto ${index + 1} de ${total}`}
      className="group relative shrink-0 snap-center overflow-hidden rounded-2xl cursor-pointer w-[78vw] sm:w-[52vw] md:w-[34vw] lg:w-[28vw] h-[60vh] md:h-[68vh] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
      style={{
        boxShadow: '0 10px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)',
      }}
    >
      {/* La imagen es más ancha que el marco para que el parallax no deje bordes */}
      <div data-parallax className="absolute inset-y-0 -left-[10%] -right-[10%]">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 60vw, 34vw"
        />
      </div>

      {/* Degradado inferior */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0e0a18]/85 via-transparent to-transparent" />

      {/* Borde dorado en hover */}
      <div className="absolute inset-0 rounded-2xl border border-white/6 group-hover:border-[#D4AF37]/50 transition-colors duration-500" />

      {/* Numeración */}
      <div className="absolute bottom-5 left-5 flex items-baseline gap-2 text-left">
        <span className="font-serif text-4xl font-bold text-[#D4AF37]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="font-sans text-xs tracking-[0.3em] text-white/50">
          / {String(total).padStart(2, '0')}
        </span>
      </div>
    </button>
  )
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({
  photo,
  index,
  total,
  onClose,
  onPrev,
  onNext,
  prefersReducedMotion,
}: {
  photo: typeof GALLERY_PHOTOS[0]
  index: number
  total: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  prefersReducedMotion: boolean
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      initial={prefersReducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Image container */}
      <motion.div
        className="relative z-10 w-full max-w-4xl max-h-[90vh] mx-4"
        initial={prefersReducedMotion ? false : { scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative w-full h-[80vh] rounded-2xl overflow-hidden"
          style={{ boxShadow: '0 0 0 1px rgba(212,175,55,0.2), 0 20px 60px rgba(0,0,0,0.8)' }}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            className="object-contain"
            sizes="90vw"
            priority
          />
          {/* Subtle bottom gradient */}
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white/60 text-xs font-sans tracking-wider">
            {index + 1} / {total}
          </div>
        </div>
      </motion.div>

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-[#D4AF37]/40 transition-all duration-200"
        aria-label="Cerrar galería"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Prev */}
      {total > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/60 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-[#D4AF37]/40 transition-all duration-200"
          aria-label="Foto anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Next */}
      {total > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext() }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/60 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-[#D4AF37]/40 transition-all duration-200"
          aria-label="Siguiente foto"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </motion.div>
  )
}
