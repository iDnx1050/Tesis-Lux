'use client'

import { motion } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { VedetoCard } from '@/components/vedeto-card'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { GoldParticles } from '@/components/gold-particles'
import { vedetos } from '@/lib/mock-data'

export default function VedetosPage() {
  return (
    <main className="min-h-screen relative overflow-x-hidden" style={{ background: 'radial-gradient(ellipse 140% 90% at 50% 45%, #6b1572 0%, #4a1268 30%, #2b1368 58%, #221060 80%, #1a0848 100%)' }}>
      <GoldParticles count={30} className="fixed z-0" opacityClassName="opacity-55" />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
              <span className="text-white/80 font-sans text-[11px] sm:text-sm tracking-[0.32em] uppercase">Nuestro Elenco</span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
            </div>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold"
              style={{
                background: 'linear-gradient(135deg, #ffe599 0%, #D4AF37 30%, #FFD700 55%, #B8962E 75%, #e8c84a 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 14px rgba(212,175,55,0.35))',
                animation: 'vip-shine 5s linear infinite',
              }}
            >
              Artistas Luxx
            </h1>
            <span className="title-vip-line" aria-hidden="true" />
            <p className="mt-6 text-white/75 font-sans text-lg max-w-2xl mx-auto">
              Conoce a nuestros artistas y elige el perfil ideal para tu celebración.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vedetos Grid */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vedetos.map((vedeto, index) => (
              <VedetoCard key={vedeto.id} vedeto={vedeto} index={index} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton floating />
    </main>
  )
}
