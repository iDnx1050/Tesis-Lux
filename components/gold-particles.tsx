'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface GoldParticlesProps {
  count?: number
  className?: string
  opacityClassName?: string
  /** When true, particles concentrate toward the vertical center of the container */
  concentrated?: boolean
}

export function GoldParticles({
  count = 8,
  className = '',
  opacityClassName = 'opacity-75',
  concentrated = false,
}: GoldParticlesProps) {
  const prefersReducedMotion = useReducedMotion()

  const particles = Array.from({ length: count }, (_, index) => {
    const baseLeft = (index * 17.37) % 100
    const baseTop = (index * 23.41) % 100

    const left = concentrated
      ? `${30 + ((index * 17.37) % 40)}%`
      : `${baseLeft}%`
    const top = concentrated
      ? `${20 + ((index * 23.41) % 50)}%`
      : `${baseTop}%`

    return {
      id: index,
      left,
      top,
      driftX: ((index % 5) - 2) * 8,
      driftY: 14 + (index % 4) * 7,
      duration: 5.5 + (index % 5) * 1.1,
      delay: (index % 6) * 0.4,
      size: index % 3 === 0 ? 'h-1.5 w-1.5' : 'h-[3px] w-[3px]',
      glow: index % 4 === 0,
    }
  })

  if (prefersReducedMotion) {
    return (
      <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute rounded-full bg-[#D4AF37] ${particle.size} ${opacityClassName}`}
            style={{
              left: particle.left,
              top: particle.top,
              opacity: 0.3,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          layout={false}
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 0.9, 0.15, 0],
            x: [0, particle.driftX, 0],
            y: [0, -particle.driftY, -particle.driftY * 1.55],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'linear',
          }}
          className={`absolute rounded-full bg-[#D4AF37] ${particle.size} ${opacityClassName} ${
            particle.glow ? 'shadow-[0_0_8px_rgba(212,175,55,0.6)]' : ''
          }`}
          style={{
            left: particle.left,
            top: particle.top,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  )
}
