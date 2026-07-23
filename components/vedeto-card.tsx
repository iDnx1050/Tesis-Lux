'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Star } from 'lucide-react'
import { Vedeto } from '@/lib/types'

const BLUR_PLACEHOLDER = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

interface VedetoCardProps {
  vedeto: Vedeto
  index?: number
}

export function VedetoCard({ vedeto, index = 0 }: VedetoCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mainLoaded, setMainLoaded] = useState(false)
  const [hoverLoaded, setHoverLoaded] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const hoverImage = vedeto.gallery[1] ?? vedeto.image

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: prefersReducedMotion ? 0 : index * 0.08 }}
    >
      <Link href={`/vedetos/${vedeto.slug}`} className="block">
        <motion.div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          animate={prefersReducedMotion ? {} : { y: isHovered ? -6 : 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-2xl cursor-pointer"
          style={{
            background: 'linear-gradient(160deg, #1e0f38 0%, #150929 60%, #0f0620 100%)',
            boxShadow: isHovered
              ? '0 20px 60px rgba(110,69,213,0.35), 0 0 0 2px rgba(212,175,55,0.75), 0 8px 24px rgba(0,0,0,0.6)'
              : '0 8px 32px rgba(0,0,0,0.45), 0 0 0 2px rgba(212,175,55,0.45)',
            WebkitTapHighlightColor: 'transparent',
            transition: 'box-shadow 0.35s ease',
          }}
        >
          {/* Image */}
          <div className="relative aspect-[3/4] overflow-hidden bg-[#12082a]">
            {!mainLoaded && (
              <div className="absolute inset-0 bg-[#1a0f30] animate-pulse z-10">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite]" />
              </div>
            )}

            {/* Main image */}
            <motion.div
              animate={{ scale: isHovered && !prefersReducedMotion ? 1.07 : 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="absolute inset-0"
            >
              <Image
                src={vedeto.image}
                alt={vedeto.name}
                fill
                className="object-cover transition-opacity duration-500"
                style={{ opacity: mainLoaded ? 1 : 0 }}
                sizes="(max-width: 640px) 92vw, (max-width: 768px) 48vw, (max-width: 1200px) 34vw, 28vw"
                priority={index < 3}
                placeholder="blur"
                blurDataURL={BLUR_PLACEHOLDER}
                onLoad={() => setMainLoaded(true)}
              />
            </motion.div>

            {/* Hover image */}
            <motion.div
              animate={{ opacity: isHovered && hoverLoaded ? 1 : 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <motion.div
                animate={{ scale: isHovered && !prefersReducedMotion ? 1.07 : 1 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="absolute inset-0"
              >
                <Image
                  src={hoverImage}
                  alt={`${vedeto.name} vista alternativa`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 92vw, (max-width: 768px) 48vw, (max-width: 1200px) 34vw, 28vw"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={BLUR_PLACEHOLDER}
                  onLoad={() => setHoverLoaded(true)}
                />
              </motion.div>
            </motion.div>

            {/* Bottom gradient — longer & softer for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0620] via-[#0f0620]/55 via-40% to-transparent" />

            {/* Shine sweep on hover */}
            {!prefersReducedMotion && (
              <motion.div
                initial={{ x: '-160%', opacity: 0 }}
                animate={{ x: isHovered ? '200%' : '-160%', opacity: isHovered ? 0.6 : 0 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent mix-blend-screen pointer-events-none"
              />
            )}

            {/* Featured badge */}
            {vedeto.featured && (
              <div className="absolute top-0 right-0 bottom-0 w-7 flex items-center justify-center"
                style={{ background: 'linear-gradient(180deg, #c9a227 0%, #D4AF37 40%, #ffe599 100%)', boxShadow: '-4px 0 16px rgba(212,175,55,0.4)' }}
              >
                <span className="text-[#0a0a0a] font-bold tracking-[0.25em] uppercase font-sans text-[10px] rotate-90 whitespace-nowrap">
                  Destacado
                </span>
              </div>
            )}
          </div>

          {/* Card content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 space-y-2">
            {/* Rating */}
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37] flex-shrink-0" />
              <span className="text-[#D4AF37] font-sans text-sm font-bold leading-none">
                {vedeto.rating}
              </span>
              <span className="text-white/40 font-sans text-xs leading-none">
                ({vedeto.reviewCount})
              </span>
            </div>

            {/* Name */}
            <h3 className={`font-serif text-lg sm:text-xl font-bold leading-tight transition-colors duration-300 ${
              isHovered ? 'text-[#D4AF37]' : 'text-white'
            }`}>
              {vedeto.name}
            </h3>

            {/* Description */}
            <p className="text-white/55 font-sans text-xs sm:text-sm line-clamp-2 leading-relaxed">
              {vedeto.shortDescription}
            </p>

            {/* Tags — unified palette: dark purple bg + white text */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {vedeto.specialties.slice(0, 3).map((specialty) => (
                <span
                  key={specialty}
                  className="px-2.5 py-0.5 text-[10px] font-sans font-medium tracking-wide uppercase rounded-full border border-white/15 bg-white/8 text-white/70"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

export function VedetoCardSkeleton() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl animate-pulse"
      style={{ background: 'linear-gradient(160deg, #1e0f38 0%, #150929 60%, #0f0620 100%)' }}
    >
      <div className="aspect-[3/4] bg-[#1a0f30]" />
      <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2.5">
        <div className="h-3 w-16 bg-white/10 rounded" />
        <div className="h-5 w-36 bg-white/10 rounded" />
        <div className="h-3 w-full bg-white/10 rounded" />
        <div className="h-3 w-3/4 bg-white/10 rounded" />
      </div>
    </div>
  )
}
