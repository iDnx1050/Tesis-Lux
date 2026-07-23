'use client'

import { useState, use, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  Star, MapPin, ArrowLeft, Check, Clock,
  Shield, Zap, Award, CalendarCheck,
  ChevronLeft, ChevronRight, X,
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { GoldParticles } from '@/components/gold-particles'
import { vedetos } from '@/lib/mock-data'
import { PricingTier } from '@/lib/types'
import { REGIONS, COMMUNES } from '@/lib/regions'

const BLUR = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function VedetoProfilePage({ params }: PageProps) {
  const { slug } = use(params)
  const vedeto = vedetos.find((v) => v.slug === slug)
  if (!vedeto) notFound()

  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null)
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [selectedRegion, setSelectedRegion] = useState('metropolitana')
  const [selectedCommune, setSelectedCommune] = useState('Santiago')
  const [selectedDate] = useState<string | null>(null)
  const [selectedTime] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [thumbOffset, setThumbOffset] = useState(0)

  const carouselRef = useRef<HTMLDivElement>(null)
  const carouselRafRef = useRef<number>(0)
  const carouselPausedRef = useRef(false)

  const otherArtists = vedetos.filter(v => v.slug !== vedeto.slug)
  const EXTRA_PER_ARTIST = 60000
  const MAX_EXTRAS = 3
  const extrasTotal = selectedExtras.length * EXTRA_PER_ARTIST

  const regionData = REGIONS.find(r => r.id === selectedRegion) ?? REGIONS[6]
  const regionCommunes = COMMUNES[selectedRegion] ?? []
  const communeData = regionCommunes.find(c => c.name === selectedCommune) ?? regionCommunes[0]
  const effectiveTierPrice = selectedTier
    ? (regionData.id === 'metropolitana'
        ? selectedTier.price + (communeData?.surcharge ?? 0)
        : (regionData.price ?? selectedTier.price))
    : 0
  const totalAmount = effectiveTierPrice + extrasTotal

  const toggleExtra = (slug: string) => {
    setSelectedExtras(prev =>
      prev.includes(slug)
        ? prev.filter(s => s !== slug)
        : prev.length < MAX_EXTRAS ? [...prev, slug] : prev
    )
  }

  const locationLabel = selectedCommune
    ? `${selectedCommune}, ${regionData.name}`
    : regionData.name
  const whatsappMessage = selectedTier
    ? `Hola, me interesa reservar con ${vedeto.name}.\nPlan: ${selectedTier.name}\nUbicación: ${locationLabel}${selectedExtras.length > 0 ? `\nArtistas adicionales: ${selectedExtras.map(s => vedetos.find(v => v.slug === s)?.name).join(', ')}` : ''}\nTotal estimado: $${totalAmount.toLocaleString('es-CL')} CLP${regionData.flight ? ' + pasajes en avión aparte' : ''}. ¿Podrían darme más información?`
    : undefined
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const el = carouselRef.current
    if (!el || prefersReducedMotion) return
    const tick = () => {
      if (!carouselPausedRef.current) {
        el.scrollLeft += 0.9
        if (el.scrollLeft >= el.scrollWidth / 2) el.scrollLeft = 0
      }
      carouselRafRef.current = requestAnimationFrame(tick)
    }
    carouselRafRef.current = requestAnimationFrame(tick)
    const pause = () => { carouselPausedRef.current = true }
    const resume = () => { carouselPausedRef.current = false }
    el.addEventListener('touchstart', pause, { passive: true })
    el.addEventListener('touchend', resume, { passive: true })
    el.addEventListener('mouseenter', pause)
    el.addEventListener('mouseleave', resume)
    return () => {
      if (carouselRafRef.current) cancelAnimationFrame(carouselRafRef.current)
      el.removeEventListener('touchstart', pause)
      el.removeEventListener('touchend', resume)
      el.removeEventListener('mouseenter', pause)
      el.removeEventListener('mouseleave', resume)
    }
  }, [prefersReducedMotion])

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return
      if (e.key === 'Escape') setLightboxIndex(null)
      if (e.key === 'ArrowRight') setLightboxIndex((i) => (i! + 1) % vedeto.gallery.length)
      if (e.key === 'ArrowLeft') setLightboxIndex((i) => (i! - 1 + vedeto.gallery.length) % vedeto.gallery.length)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightboxIndex, vedeto.gallery.length])

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('es-CL', { weekday: 'long', month: 'long', day: 'numeric' })

  const mainImage = vedeto.gallery[0]
  const thumbImages = vedeto.gallery.slice(1)

  // Rotar miniaturas automáticamente cada 2.5s
  useEffect(() => {
    if (thumbImages.length <= 3) return
    const interval = setInterval(() => {
      setThumbOffset(prev => (prev + 1) % thumbImages.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [thumbImages.length])

  const visibleThumbs = thumbImages.length > 3
    ? [0, 1, 2].map(i => ({ src: thumbImages[(thumbOffset + i) % thumbImages.length], galleryIndex: (thumbOffset + i) % thumbImages.length + 1 }))
    : thumbImages.slice(0, 3).map((src, i) => ({ src, galleryIndex: i + 1 }))

  const fadeUp = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : { initial: { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 } }

  return (
    <main className="relative min-h-screen bg-transparent overflow-x-hidden">
      <GoldParticles count={isMobile ? 12 : 28} className="fixed z-0" opacityClassName="opacity-45" />
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative h-[58vh] min-h-[400px] sm:min-h-[500px]">
        <div className="absolute inset-0">
          {/* Mobile: foto del artista */}
          <Image
            src={vedeto.image}
            alt={vedeto.name}
            fill
            className="object-cover object-[center_15%] md:hidden"
            priority
            sizes="100vw"
            placeholder="blur"
            blurDataURL={BLUR}
          />
          {/* Desktop: video de fondo */}
          <video
            className="hidden md:block absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src="/magicmike-desktop.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0a18] via-[#0e0a18]/45 to-black/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/25" />
        </div>

        {/* Back */}
        <div className="absolute top-[4.5rem] left-4 sm:left-6 z-20">
          <Link href="/vedetos">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 px-3.5 py-2 bg-black/40 backdrop-blur-md border border-white/15 rounded-full text-white/85 font-sans text-xs sm:text-sm hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-all duration-300 min-h-[38px]"
            >
              <ArrowLeft className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Volver</span>
            </motion.button>
          </Link>
        </div>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 md:px-10 pb-9 sm:pb-11">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 backdrop-blur-sm">
                  <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                  <span className="text-[#D4AF37] font-sans font-bold text-sm">{vedeto.rating}</span>
                  <span className="text-white/50 font-sans text-xs">({vedeto.reviewCount} reseñas)</span>
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-4 leading-[0.9] tracking-tight">
                {vedeto.name}
              </h1>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-white/45 flex-shrink-0" />
                  <span className="text-white/55 font-sans text-sm">{vedeto.location}</span>
                </div>
                <span className="text-white/20">·</span>
                <div className="flex flex-wrap gap-1.5">
                  {vedeto.specialties.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-0.5 text-[11px] font-sans font-semibold uppercase tracking-wider rounded-full border border-[#D4AF37]/35 text-[#D4AF37] bg-[#D4AF37]/8"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <div className="relative z-10 border-y border-white/8 bg-black/25 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-4">
          <div className="flex items-center justify-center gap-6 sm:gap-12 md:gap-20 flex-wrap">
            {[
              { icon: Shield, value: 'Perfil Verificado', sub: 'Identidad confirmada' },
              { icon: Zap,    value: '< 1 hora',          sub: 'Tiempo de respuesta' },
              { icon: Award,  value: '500+ Eventos',       sub: 'Shows realizados' },
            ].map(({ icon: Icon, value, sub }) => (
              <div key={value} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/12 border border-[#D4AF37]/22 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 text-[#D4AF37]" />
                </div>
                <div>
                  <p className="text-white font-sans text-sm font-semibold leading-tight">{value}</p>
                  <p className="text-white/38 font-sans text-[11px] leading-tight mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <section className="relative z-10 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
          <div className="grid lg:grid-cols-[1fr_370px] xl:grid-cols-[1fr_400px] gap-10 lg:gap-14 items-start">

            {/* ── LEFT COLUMN ── */}
            <div className="space-y-14 min-w-0">

              {/* Gallery */}
              <motion.div {...fadeUp} transition={{ duration: 0.55 }}>
                <SectionLabel>Fotos</SectionLabel>
                <h2 className="text-[#F5F5F5] font-serif text-2xl md:text-3xl mb-5">Galería</h2>

                {/* ── MÓVIL: carrusel con todas las fotos ── */}
                <div className="md:hidden">
                  <MobileGalleryCarousel
                    images={vedeto.gallery}
                    name={vedeto.name}
                    onPhotoClick={(idx) => setLightboxIndex(idx)}
                  />
                </div>

                {/* ── DESKTOP: grid principal + miniaturas rotativas ── */}
                <div className={`hidden md:grid gap-3 ${thumbImages.length > 0 ? 'grid-cols-[2fr_1fr]' : 'grid-cols-1'}`}>
                  {/* Main image */}
                  <motion.div
                    className="relative overflow-hidden rounded-2xl cursor-pointer group"
                    style={{ aspectRatio: thumbImages.length > 0 ? '3/4' : '16/9' }}
                    whileHover={prefersReducedMotion ? {} : { scale: 1.01 }}
                    transition={{ duration: 0.4 }}
                    onClick={() => setLightboxIndex(0)}
                  >
                    <Image
                      src={mainImage}
                      alt={`${vedeto.name} foto principal`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      sizes="42vw"
                      priority
                      placeholder="blur"
                      blurDataURL={BLUR}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                    <div className="absolute inset-0 rounded-2xl ring-2 ring-inset ring-[#D4AF37]/65 group-hover:ring-[#D4AF37]/90 transition-all duration-400" />
                  </motion.div>

                  {/* Thumbnails con rotación automática */}
                  {thumbImages.length > 0 && (
                    <div className="flex flex-col gap-3">
                      {visibleThumbs.map((thumb, i) => (
                        <div
                          key={i}
                          className="relative flex-1 overflow-hidden rounded-xl cursor-pointer group"
                          style={{ minHeight: 110 }}
                          onClick={() => setLightboxIndex(thumb.galleryIndex)}
                        >
                          <AnimatePresence mode="sync">
                            <motion.div
                              key={thumb.src}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.8 }}
                              className="absolute inset-0"
                            >
                              <Image
                                src={thumb.src}
                                alt={`${vedeto.name} foto`}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="18vw"
                                loading="lazy"
                                placeholder="blur"
                                blurDataURL={BLUR}
                              />
                            </motion.div>
                          </AnimatePresence>
                          <div className="absolute inset-0 rounded-xl ring-2 ring-inset ring-[#D4AF37]/65 group-hover:ring-[#D4AF37]/90 transition-all duration-300 z-10" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300 z-10" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Acerca de */}
              <motion.div {...fadeUp} transition={{ duration: 0.55, delay: prefersReducedMotion ? 0 : 0.08 }}>
                <SectionLabel>Perfil</SectionLabel>
                <h2 className="text-[#F5F5F5] font-serif text-2xl md:text-3xl mb-5">Acerca de</h2>
                <p className="text-white/62 font-sans text-base sm:text-[17px] leading-[1.75] max-w-2xl">
                  {vedeto.fullDescription}
                </p>
              </motion.div>

              {/* Términos — solo en desktop cuando hay plan seleccionado */}
              <AnimatePresence>
                {selectedTier && (
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4 }}
                    className="hidden lg:block rounded-2xl border border-white/10 bg-white/4 p-5 space-y-3 text-[13.5px] text-white/50 font-sans leading-relaxed"
                  >
                    <p className="text-[#D4AF37]/80 font-semibold text-[10px] tracking-[0.22em] uppercase">
                      Términos y Condiciones
                    </p>
                    <p>
                      <span className="text-white/70 font-medium">Confirmación:</span> La reserva queda confirmada una vez recibido el pago completo. Luxx Producciones se reserva el derecho de reagendar ante casos de fuerza mayor, con aviso previo mínimo de 24 horas.
                    </p>
                    <p>
                      <span className="text-white/70 font-medium">Cancelación por el cliente:</span> Cancelaciones con más de 72 horas de anticipación tienen derecho a reembolso total. Entre 24 y 72 horas, reembolso del 50%. Menos de 24 horas, sin reembolso.
                    </p>
                    <p>
                      <span className="text-white/70 font-medium">Devoluciones Transbank:</span> Los pagos procesados mediante Transbank están sujetos a la política de devolución del emisor. El plazo estándar de acreditación es de <span className="text-white/75">2 a 10 días hábiles</span> según el banco o tarjeta utilizada.
                    </p>
                    <p>
                      <span className="text-white/70 font-medium">Evento rechazado:</span> En caso de rechazo del evento por parte de Luxx Producciones (aforo inadecuado, condiciones de seguridad insuficientes u otras causas justificadas), se realizará el reembolso total en el mismo medio de pago en un plazo máximo de 10 días hábiles.
                    </p>
                    <p>
                      <span className="text-white/70 font-medium">Privacidad:</span> Los datos personales ingresados se tratan conforme a nuestra{' '}
                      <a href="/privacidad" target="_blank" className="text-[#D4AF37]/70 underline underline-offset-2 hover:text-[#D4AF37]">
                        Política de Privacidad
                      </a>{' '}
                      y la Ley N° 21.719.
                    </p>
                    <p>
                      <span className="text-white/70 font-medium">Mayoría de edad:</span> El contratante declara ser mayor de 18 años y tener capacidad legal para celebrar este acuerdo.
                    </p>
                    <p className="text-white/35 text-[10px]">
                      Al continuar, aceptas estos términos y las condiciones generales disponibles en{' '}
                      <a href="/terminos" target="_blank" className="underline underline-offset-2 hover:text-white/55">
                        /terminos
                      </a>.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* ── RIGHT SIDEBAR ── */}
            <div className="lg:sticky lg:top-24 space-y-4">

              {/* Plans card */}
              <motion.div
                initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.12 }}
                className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md overflow-hidden"
              >
                <div className="px-5 pt-5 pb-4 border-b border-white/8">
                  <h3 className="text-[#F5F5F5] font-serif text-xl leading-tight">Selecciona un Plan</h3>
                  <p className="text-white/38 font-sans text-xs mt-1">Todos incluyen equipo de música y luces</p>
                </div>

                <div className="p-4 space-y-3">
                  {vedeto.pricing.map((tier, idx) => (
                    <motion.button
                      key={tier.id}
                      onClick={() => {
                        if (selectedTier?.id === tier.id) {
                          setSelectedTier(null)
                          setSelectedExtras([])
                        } else {
                          setSelectedTier(tier)
                        }
                      }}
                      whileHover={prefersReducedMotion ? {} : { scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`w-full text-left rounded-xl border transition-all duration-300 overflow-hidden ${
                        selectedTier?.id === tier.id
                          ? 'border-[#D4AF37]/55 bg-[#D4AF37]/7 shadow-[0_0_20px_rgba(212,175,55,0.12)]'
                          : 'border-white/8 bg-white/3 hover:border-white/18 hover:bg-white/5'
                      }`}
                    >
                      {idx === 1 && (
                        <div className="px-4 py-1.5 bg-[#D4AF37]/12 border-b border-[#D4AF37]/18">
                          <span className="text-[#D4AF37] font-sans text-[10px] font-bold tracking-[0.28em] uppercase">
                            Más Popular
                          </span>
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h4 className="text-[#F5F5F5] font-sans font-semibold text-sm leading-tight">{tier.name}</h4>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <Clock className="w-3 h-3 text-white/30 flex-shrink-0" />
                              <span className="text-white/38 text-xs font-sans">{tier.duration}</span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-serif text-[1.6rem] font-bold text-[#D4AF37] leading-none">
                              ${tier.price.toLocaleString()}
                            </p>
                            <p className="text-white/28 font-sans text-[10px] mt-0.5 tracking-wide">CLP</p>
                          </div>
                        </div>

                        <p className="text-white/42 font-sans text-xs leading-relaxed mb-3">{tier.description}</p>

                        <ul className="space-y-1.5">
                          {tier.features.map((f) => (
                            <li key={f} className="flex items-start gap-2">
                              <Check className="w-3 h-3 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                              <span className="text-white/55 font-sans text-xs leading-snug">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Artistas adicionales */}
              <AnimatePresence>
                {selectedTier && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35 }}
                    className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md overflow-hidden"
                  >
                    <div className="px-5 pt-4 pb-5">
                      <p className="text-[#D4AF37] font-sans text-[10px] font-bold tracking-[0.28em] uppercase mb-1">
                        Experiencia Ampliada
                      </p>
                      <h4 className="text-[#F5F5F5] font-serif text-base leading-snug mb-1">
                        ¿Sumar más artistas a la velada?
                      </h4>
                      <p className="text-white/38 font-sans text-xs leading-relaxed mb-3">
                        Cada artista adicional suma $60.000. Máximo 3.{' '}
                        <span aria-live="polite" className="text-[#D4AF37]/80">
                          {selectedExtras.length > 0 ? `${selectedExtras.length} seleccionado${selectedExtras.length > 1 ? 's' : ''}` : 'Ninguno seleccionado'}
                        </span>
                      </p>

                      {/* Grid de artistas */}
                      <div className="grid grid-cols-4 gap-2">
                        {otherArtists.map(artist => {
                          const isSelected = selectedExtras.includes(artist.slug)
                          const isDisabled = !isSelected && selectedExtras.length >= MAX_EXTRAS
                          return (
                            <button
                              key={artist.slug}
                              onClick={() => toggleExtra(artist.slug)}
                              disabled={isDisabled}
                              aria-label={`${isSelected ? 'Quitar' : 'Agregar'} a ${artist.name}`}
                              aria-pressed={isSelected}
                              className={`relative rounded-xl overflow-hidden aspect-[3/4] border-2 transition-all duration-200 focus:outline-none ${
                                isSelected
                                  ? 'border-[#D4AF37] shadow-[0_0_14px_rgba(212,175,55,0.4)]'
                                  : isDisabled
                                    ? 'border-white/5 opacity-30 cursor-not-allowed'
                                    : 'border-white/10 hover:border-white/35'
                              }`}
                            >
                              <Image
                                src={artist.image}
                                alt={artist.name}
                                fill
                                sizes="80px"
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                              {isSelected && (
                                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#D4AF37] flex items-center justify-center">
                                  <Check className="w-2.5 h-2.5 text-black" />
                                </div>
                              )}
                              <p className="absolute bottom-1 left-0 right-0 text-center text-white font-sans text-[8px] font-semibold px-0.5 leading-tight">
                                {artist.name.split(' ')[0]}
                              </p>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Selector de zona / región */}
              <AnimatePresence>
                {selectedTier && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35 }}
                    className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md overflow-hidden"
                  >
                    <div className="px-5 pt-4 pb-5">
                      <p className="text-[#D4AF37] font-sans text-[10px] font-bold tracking-[0.28em] uppercase mb-1">
                        Ubicación del evento
                      </p>
                      <h4 className="text-[#F5F5F5] font-serif text-base leading-snug mb-3">
                        ¿Dónde es tu evento?
                      </h4>

                      {/* Selector de región */}
                      <label className="block text-white/40 font-sans text-[11px] mb-1.5 tracking-wide">Región</label>
                      <select
                        value={selectedRegion}
                        onChange={e => {
                          const newRegion = e.target.value
                          setSelectedRegion(newRegion)
                          setSelectedCommune(COMMUNES[newRegion]?.[0]?.name ?? '')
                        }}
                        className="w-full rounded-xl border border-white/15 bg-white/5 text-white font-sans text-sm px-4 py-3 appearance-none focus:outline-none focus:border-[#D4AF37]/50 transition-colors duration-200"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23D4AF37' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
                      >
                        {REGIONS.map(r => (
                          <option key={r.id} value={r.id} style={{ background: '#1a0836', color: '#fff' }}>
                            {r.name}
                          </option>
                        ))}
                      </select>

                      {/* Selector de comuna */}
                      {regionCommunes.length > 0 && (
                        <div className="mt-3">
                          <label className="block text-white/40 font-sans text-[11px] mb-1.5 tracking-wide">Comuna</label>
                          <select
                            value={selectedCommune}
                            onChange={e => setSelectedCommune(e.target.value)}
                            className="w-full rounded-xl border border-white/15 bg-white/5 text-white font-sans text-sm px-4 py-3 appearance-none focus:outline-none focus:border-[#D4AF37]/50 transition-colors duration-200"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23D4AF37' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
                          >
                            {regionCommunes.map(c => (
                              <option key={c.name} value={c.name} style={{ background: '#1a0836', color: '#fff' }}>
                                {c.name}{c.surcharge ? ` (+$${c.surcharge.toLocaleString('es-CL')})` : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Nota de traslado */}
                      {regionData.note && regionData.id !== 'metropolitana' && (
                        <div className={`mt-3 flex items-start gap-2 rounded-lg px-3 py-2.5 text-xs font-sans ${regionData.flight ? 'bg-amber-500/10 border border-amber-500/20 text-amber-300/80' : 'bg-[#D4AF37]/8 border border-[#D4AF37]/15 text-[#D4AF37]/80'}`}>
                          <span className="mt-0.5 flex-shrink-0">{regionData.flight ? '✈️' : '🚌'}</span>
                          <span>{regionData.note}{regionData.flight && ' — pasajes aéreos se coordinan por separado.'}</span>
                        </div>
                      )}

                      {/* Precio ajustado para regiones fuera de Santiago */}
                      {selectedTier && regionData.id !== 'metropolitana' && (
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-white/45 font-sans text-sm">Precio ajustado</span>
                          <span className="text-[#D4AF37] font-serif text-xl font-bold">
                            ${effectiveTierPrice.toLocaleString('es-CL')}
                            <span className="text-white/30 font-sans text-[10px] ml-1">CLP</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Booking summary */}
              <AnimatePresence>
                {(selectedTier || selectedDate) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35 }}
                    className="rounded-2xl border border-[#D4AF37]/22 bg-[#D4AF37]/5 overflow-hidden"
                  >
                    <div className="p-4 space-y-2.5">
                      <p className="text-[#D4AF37] font-sans text-[10px] font-bold tracking-[0.28em] uppercase mb-3">
                        Resumen de Reserva
                      </p>
                      {selectedTier && (
                        <div className="flex justify-between items-center">
                          <span className="text-white/48 font-sans text-sm">Plan</span>
                          <span className="text-white font-sans text-sm font-medium">{selectedTier.name}</span>
                        </div>
                      )}
                      {selectedTier && (
                        <div className="flex justify-between items-center gap-3">
                          <span className="text-white/48 font-sans text-sm flex-shrink-0">Ubicación</span>
                          <span className="text-white font-sans text-xs font-medium text-right">{locationLabel}</span>
                        </div>
                      )}
                      {selectedDate && (
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-white/48 font-sans text-sm flex-shrink-0">Fecha</span>
                          <span className="text-white font-sans text-xs text-right">{formatDate(selectedDate)}</span>
                        </div>
                      )}
                      {selectedTime && (
                        <div className="flex justify-between items-center">
                          <span className="text-white/48 font-sans text-sm">Hora</span>
                          <span className="text-white font-sans text-sm">{selectedTime}</span>
                        </div>
                      )}
                      {selectedTier && (
                        <>
                          <div className="border-t border-white/10 pt-3 mt-1 space-y-2">
                            {/* Precio base del plan */}
                            <div className="flex justify-between items-center">
                              <span className="text-white/48 font-sans text-xs">{selectedTier.name}</span>
                              <span className="text-white/70 font-sans text-xs">${selectedTier.price.toLocaleString('es-CL')}</span>
                            </div>
                            {/* Cargo por zona — regiones fuera de Metropolitana */}
                            {regionData.id !== 'metropolitana' && regionData.price != null && regionData.price !== selectedTier.price && (
                              <div className="flex justify-between items-center">
                                <span className="text-white/48 font-sans text-xs">Cargo por zona</span>
                                <span className="text-white/70 font-sans text-xs">
                                  {regionData.price > selectedTier.price ? '+' : '-'}${Math.abs(regionData.price - selectedTier.price).toLocaleString('es-CL')}
                                </span>
                              </div>
                            )}
                            {/* Recargo por comuna — solo Metropolitana */}
                            {regionData.id === 'metropolitana' && communeData?.surcharge && communeData.surcharge > 0 && (
                              <div className="flex justify-between items-center">
                                <span className="text-white/48 font-sans text-xs">Recargo {communeData.name}</span>
                                <span className="text-white/70 font-sans text-xs">+${communeData.surcharge.toLocaleString('es-CL')}</span>
                              </div>
                            )}
                            {selectedExtras.length > 0 && selectedExtras.map(slug => {
                              const a = vedetos.find(v => v.slug === slug)
                              return a ? (
                                <div key={slug} className="flex justify-between items-center">
                                  <span className="text-white/48 font-sans text-xs">+ {a.name}</span>
                                  <span className="text-white/70 font-sans text-xs">${EXTRA_PER_ARTIST.toLocaleString('es-CL')}</span>
                                </div>
                              ) : null
                            })}
                            <div className="flex justify-between items-end border-t border-white/10 pt-2 mt-1">
                              <span className="text-white font-sans font-semibold text-sm">Total</span>
                              <div className="text-right">
                                <span className="text-[#D4AF37] font-serif text-2xl font-bold leading-none">
                                  ${totalAmount.toLocaleString('es-CL')}
                                </span>
                                {regionData.flight && (
                                  <p className="text-amber-300/60 font-sans text-[9px] mt-0.5">+ pasajes aéreos aparte</p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Términos y condiciones — solo visible en móvil; en desktop se muestran en la columna izquierda */}
                          <div className="lg:hidden mt-3 rounded-xl border border-white/10 bg-white/4 p-3.5 space-y-2.5 text-[13px] text-white/50 font-sans leading-relaxed">
                            <p className="text-[#D4AF37]/80 font-semibold text-[10px] tracking-[0.22em] uppercase">
                              Términos y Condiciones
                            </p>
                            <p>
                              <span className="text-white/70 font-medium">Confirmación:</span> La reserva queda confirmada una vez recibido el pago completo. Luxx Producciones se reserva el derecho de reagendar ante casos de fuerza mayor, con aviso previo mínimo de 24 horas.
                            </p>
                            <p>
                              <span className="text-white/70 font-medium">Cancelación por el cliente:</span> Cancelaciones con más de 72 horas de anticipación tienen derecho a reembolso total. Entre 24 y 72 horas, reembolso del 50%. Menos de 24 horas, sin reembolso.
                            </p>
                            <p>
                              <span className="text-white/70 font-medium">Devoluciones Transbank:</span> Los pagos procesados mediante Transbank están sujetos a la política de devolución del emisor. El plazo estándar de acreditación es de <span className="text-white/75">2 a 10 días hábiles</span> según el banco o tarjeta utilizada.
                            </p>
                            <p>
                              <span className="text-white/70 font-medium">Evento rechazado:</span> En caso de rechazo del evento por parte de Luxx Producciones (aforo inadecuado, condiciones de seguridad insuficientes u otras causas justificadas), se realizará el reembolso total en el mismo medio de pago en un plazo máximo de 10 días hábiles.
                            </p>
                            <p>
                              <span className="text-white/70 font-medium">Privacidad:</span> Los datos personales ingresados se tratan conforme a nuestra{' '}
                              <a href="/privacidad" target="_blank" className="text-[#D4AF37]/70 underline underline-offset-2 hover:text-[#D4AF37]">
                                Política de Privacidad
                              </a>{' '}
                              y la Ley N° 21.719.
                            </p>
                            <p>
                              <span className="text-white/70 font-medium">Mayoría de edad:</span> El contratante declara ser mayor de 18 años y tener capacidad legal para celebrar este acuerdo.
                            </p>
                            <p className="text-white/35 text-[10px]">
                              Al continuar, aceptas estos términos y las condiciones generales disponibles en{' '}
                              <a href="/terminos" target="_blank" className="underline underline-offset-2 hover:text-white/55">
                                /terminos
                              </a>.
                            </p>
                          </div>

                          <Link
                            href={`/checkout?slug=${vedeto.slug}&tier=${selectedTier.id}&region=${selectedRegion}&commune=${encodeURIComponent(selectedCommune)}${selectedExtras.length ? `&extras=${selectedExtras.join(',')}` : ''}`}
                            className="btn-gold-pulse mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-[#0A0A0A] transition-all duration-300 hover:bg-[#E8C34A]"
                            style={{ boxShadow: '0 0 18px rgba(212,175,55,0.5), 0 0 40px rgba(212,175,55,0.25)' }}
                          >
                            <CalendarCheck className="w-4 h-4 flex-shrink-0" />
                            Confirmar Reserva
                          </Link>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* WhatsApp */}
              <WhatsAppButton
                vedetoName={vedeto.name}
                message={whatsappMessage}
                selectedDate={
                  selectedDate && selectedTime
                    ? `${formatDate(selectedDate)} a las ${selectedTime}`
                    : undefined
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/93 backdrop-blur-xl p-4"
          >
            {/* Close */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/60 hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-all z-10"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Image */}
            <motion.div
              initial={{ scale: 0.93, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl max-h-[85vh] aspect-[3/4]"
            >
              <Image
                src={vedeto.gallery[lightboxIndex]}
                alt={`${vedeto.name} galería ${lightboxIndex + 1}`}
                fill
                className="object-contain"
                sizes="80vw"
              />
            </motion.div>

            {/* Counter */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {vedeto.gallery.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(i) }}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                    i === lightboxIndex ? 'bg-[#D4AF37] w-4' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>

            {/* Nav arrows */}
            {vedeto.gallery.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + vedeto.gallery.length) % vedeto.gallery.length) }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/5 text-white/60 hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-all"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % vedeto.gallery.length) }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/5 text-white/60 hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-all"
                  aria-label="Siguiente"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── OTROS ARTISTAS ── */}
      {(() => {
        const otros = vedetos.filter(v => v.slug !== vedeto.slug)
        const doble = [...otros, ...otros]
        return (
          <section className="pb-16 pt-4">
            {/* Título centrado */}
            <div className="text-center px-4 mb-6">
              <h3
                className="font-serif text-2xl sm:text-3xl font-bold gold-text-glow"
                style={{
                  background: 'linear-gradient(135deg, #ffe599 0%, #D4AF37 30%, #FFD700 55%, #B8962E 75%, #e8c84a 100%)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: prefersReducedMotion ? 'none' : 'vip-shine 5s linear infinite, gold-text-glow 3s ease-in-out infinite',
                }}
              >
                Otros Artistas
              </h3>
              <span className="title-vip-line" aria-hidden="true" />
            </div>

            {/* Carrusel auto-scroll + swipe táctil */}
            <div className="relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#1a0848] to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#1a0848] to-transparent z-10 pointer-events-none" />
              <div ref={carouselRef} className="flex gap-4 scrollbar-hide" style={{ overflowX: 'scroll', cursor: 'grab' }}>
                {doble.map((a, i) => (
                  <Link
                    key={`${a.id}-${i}`}
                    href={`/vedetos/${a.slug}`}
                    className="flex-shrink-0 w-[300px] sm:w-[360px] group"
                  >
                    <motion.div
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.25 }}
                      className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-[#D4AF37]/45 transition-all duration-300 shadow-[0_4px_24px_rgba(212,175,55,0.15),0_2px_8px_rgba(0,0,0,0.35)]"
                    >
                      <Image
                        src={a.image}
                        alt={a.name}
                        fill
                        sizes="310px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3.5">
                        <p className="text-white font-serif font-bold text-base leading-tight">{a.name}</p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                          <span className="text-[#D4AF37] font-sans text-sm font-bold">{a.rating}</span>
                        </div>
                      </div>
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 shadow-[inset_0_0_0_1px_rgba(212,175,55,0.35)] transition-opacity duration-300" />
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )
      })()}

      <Footer />
      <WhatsAppButton floating />
    </main>
  )
}

function MobileGalleryCarousel({
  images,
  name,
  onPhotoClick,
}: {
  images: string[]
  name: string
  onPhotoClick: (idx: number) => void
}) {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent(i => (i - 1 + images.length) % images.length)
  const next = () => setCurrent(i => (i + 1) % images.length)

  return (
    <div className="relative w-full">
      {/* Slide */}
      <div
        className="relative w-full overflow-hidden rounded-2xl cursor-pointer"
        style={{ aspectRatio: '3/4' }}
        onClick={() => onPhotoClick(current)}
      >
        <AnimatePresence mode="sync">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image
              src={images[current]}
              alt={`${name} foto ${current + 1}`}
              fill
              className="object-cover"
              sizes="100vw"
              priority={current === 0}
              placeholder="blur"
              blurDataURL={BLUR}
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 rounded-2xl ring-2 ring-inset ring-[#D4AF37]/65 pointer-events-none" />
      </div>

      {/* Controles prev/next */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/55 backdrop-blur-sm flex items-center justify-center text-white border border-white/15 active:scale-95 transition-transform"
            aria-label="Foto anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/55 backdrop-blur-sm flex items-center justify-center text-white border border-white/15 active:scale-95 transition-transform"
            aria-label="Siguiente foto"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-5 h-1.5 bg-[#D4AF37]'
                  : 'w-1.5 h-1.5 bg-white/30'
              }`}
              aria-label={`Ir a foto ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Contador */}
      <p className="text-center text-white/40 font-sans text-xs mt-2 tracking-widest">
        {current + 1} / {images.length}
      </p>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="h-px w-8 bg-gradient-to-r from-[#D4AF37]/50 to-transparent" />
      <span className="text-[#D4AF37] font-sans text-[10px] font-semibold tracking-[0.32em] uppercase">
        {children}
      </span>
    </div>
  )
}
