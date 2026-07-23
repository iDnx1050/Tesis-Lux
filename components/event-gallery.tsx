'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react'

const GALLERY_PHOTOS: { src: string; alt: string; span?: 'tall' | 'wide' | 'normal' }[] = [
  { src: '/Galeria/IMG_9099.PNG',                              alt: 'Evento exclusivo 1', span: 'tall'   },
  { src: '/Galeria/0b6b176f-3659-4521-8127-4a0260d8a4e6.jpg', alt: 'Evento exclusivo 2', span: 'normal' },
  { src: '/Galeria/IMG_9100.PNG',                              alt: 'Evento exclusivo 3', span: 'normal' },
  { src: '/Galeria/5719389e-b4e4-46f7-9f80-7590617fd216.JPG', alt: 'Evento exclusivo 4', span: 'normal' },
  { src: '/Galeria/IMG_9102.PNG',                              alt: 'Evento exclusivo 5', span: 'tall'   },
  { src: '/Galeria/IMG_9103.PNG',                              alt: 'Evento exclusivo 6', span: 'wide'   },
]

export function EventGallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const prefersReducedMotion = useReducedMotion()

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
            className="font-serif text-[clamp(1.8rem,5vw,3rem)] font-bold leading-tight"
            style={{
              background: 'linear-gradient(135deg, #ffe599 0%, #D4AF37 30%, #FFD700 55%, #B8962E 75%, #e8c84a 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 16px rgba(212,175,55,0.3))',
              animation: 'vip-shine 5s linear infinite',
            }}
          >
            Noches que no se olvidan
          </h2>

          <p className="mt-3 text-white/50 font-sans text-sm max-w-sm mx-auto">
            Momentos reales capturados en cada evento privado.
          </p>
        </motion.div>

        {/* Masonry grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 auto-rows-[180px] sm:auto-rows-[220px]">
          {GALLERY_PHOTOS.map((photo, i) => (
            <GalleryTile
              key={photo.src}
              photo={photo}
              index={i}
              onOpen={() => openLightbox(i)}
              prefersReducedMotion={!!prefersReducedMotion}
            />
          ))}
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

// ─── Tile ─────────────────────────────────────────────────────────────────────

function GalleryTile({
  photo,
  index,
  onOpen,
  prefersReducedMotion,
}: {
  photo: typeof GALLERY_PHOTOS[0]
  index: number
  onOpen: () => void
  prefersReducedMotion: boolean
}) {
  const spanClass =
    photo.span === 'tall' ? 'row-span-2' :
    photo.span === 'wide' ? 'col-span-2' :
    ''

  return (
    <motion.div
      className={`group relative overflow-hidden rounded-xl cursor-pointer ${spanClass}`}
      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onClick={onOpen}
      style={{
        boxShadow: '0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
      }}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        className="object-contain bg-black/30 transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 50vw, 33vw"
      />

      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0e0a18]/70 via-transparent to-transparent" />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-[#D4AF37]/0 group-hover:bg-[#D4AF37]/8 transition-colors duration-500" />

      {/* Gold border on hover */}
      <div className="absolute inset-0 rounded-xl border border-white/6 group-hover:border-[#D4AF37]/40 transition-colors duration-400" />

      {/* Expand icon */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-[#D4AF37]/40 flex items-center justify-center">
          <svg className="w-4 h-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
          </svg>
        </div>
      </div>
    </motion.div>
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
