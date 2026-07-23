'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Facebook, Instagram, Music2, MessageCircle } from 'lucide-react'

const WHATSAPP_NUMBER = '56945501752'
const WHATSAPP_MESSAGE = encodeURIComponent('Hola, tengo consultas sobre los shows de Luxx Producciones. ¿Podrías ayudarme?')
import { GoldParticles } from './gold-particles'

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Síguenos en Facebook' },
  { icon: Instagram, href: '#', label: 'Síguenos en Instagram' },
  { icon: Music2, href: '#', label: 'Síguenos en TikTok' },
]

const legalLinks = [
  { label: 'Términos y Condiciones', href: '/terminos' },
  { label: 'Política de Privacidad', href: '/privacidad' },
  { label: 'Política de Cookies', href: '/cookies' },
  { label: 'Política de Eventos', href: '/politica-eventos' },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-transparent">
      {/* Dot grid with top fade */}
      <div
        className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(rgba(216,175,67,0.5)_0.8px,transparent_0.8px)] [background-size:12px_12px]"
        style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 18%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 18%)' }}
      />

      {/* Prominent glow orbs */}
      <div className="absolute left-1/2 top-[4rem] h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[#cc1177]/18 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-[6%] h-72 w-72 rounded-full bg-[#a01aaa]/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-[6%] h-56 w-56 rounded-full bg-[#6d1fd4]/12 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-[15%] h-44 w-44 rounded-full bg-[#cc1177]/10 blur-3xl pointer-events-none" />
      <GoldParticles count={28} className="z-0" opacityClassName="opacity-55" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 pt-10 sm:pt-14 pb-6 sm:pb-8 z-10">
        <div className="flex flex-col items-center text-center">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-3"
          >
            <span className="font-serif text-3xl font-bold text-[#D4AF37]">LUXX</span>
            <span className="font-serif text-3xl font-light text-[#F5F5F5]"> Producciones</span>
            <span className="title-vip-line" aria-hidden="true" />
          </motion.div>

          {/* Redes sociales */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 flex items-center justify-center gap-4"
          >
            {/* Facebook */}
            <motion.a href="#" aria-label="Síguenos en Facebook" rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.93 }}
            >
              <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="20" fill="#1877F2"/>
                <path d="M27 20h-4v12h-5V20h-3v-5h3v-3c0-3.3 2-5 5-5 1.4 0 3 .3 3 .3V12h-2c-1.7 0-2 .8-2 2v1h4l-.5 5z" fill="white"/>
              </svg>
            </motion.a>

            {/* Instagram */}
            <motion.a href="https://www.instagram.com/luxx.producciones/" aria-label="Síguenos en Instagram" rel="noopener noreferrer" target="_blank"
              whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.93 }}
            >
              <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
                <defs>
                  <radialGradient id="ig-grad" cx="30%" cy="107%" r="120%">
                    <stop offset="0%" stopColor="#ffd87a"/>
                    <stop offset="25%" stopColor="#f6a623"/>
                    <stop offset="50%" stopColor="#e2005a"/>
                    <stop offset="75%" stopColor="#a500b4"/>
                    <stop offset="100%" stopColor="#3b5fce"/>
                  </radialGradient>
                </defs>
                <rect width="40" height="40" rx="20" fill="url(#ig-grad)"/>
                <rect x="10" y="10" width="20" height="20" rx="6" stroke="white" strokeWidth="2.2" fill="none"/>
                <circle cx="20" cy="20" r="5" stroke="white" strokeWidth="2.2" fill="none"/>
                <circle cx="26.5" cy="13.5" r="1.5" fill="white"/>
              </svg>
            </motion.a>

            {/* TikTok */}
            <motion.a href="#" aria-label="Síguenos en TikTok" rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.93 }}
            >
              <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="20" fill="#010101"/>
                <path d="M28 16.5a6.5 6.5 0 0 1-3.8-1.2V23a6.2 6.2 0 1 1-5.3-6.1v3.3a2.9 2.9 0 1 0 2 2.8V11h3.3a6.5 6.5 0 0 0 3.8 5.5z" fill="white"/>
                <path d="M28 16.5a6.5 6.5 0 0 1-3.8-1.2V23a6.2 6.2 0 1 1-5.3-6.1v3.3a2.9 2.9 0 1 0 2 2.8V11h3.3a6.5 6.5 0 0 0 3.8 5.5z" fill="#69C9D0" fillOpacity="0.5"/>
              </svg>
            </motion.a>
          </motion.div>

          {/* === SECCIÓN REDES SOCIALES — desactivada temporalmente ===
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="font-serif text-[clamp(1.4rem,5vw,2.4rem)] font-bold uppercase tracking-tight text-[#F7E6AE] leading-tight"
          >
            Somos Muy Sociales
          </motion.h3>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          >
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                rel="noopener noreferrer"
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.94 }}
                className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-[#D4AF37]/35 bg-[radial-gradient(circle_at_35%_30%,rgba(241,209,122,0.22)_0%,rgba(110,69,213,0.18)_45%,rgba(9,6,15,0.95)_100%)] text-[#F1D17A] transition-all duration-300 hover:border-[#D4AF37]/70 hover:text-white"
              >
                <Icon size={18} strokeWidth={2} />
              </motion.a>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 w-full max-w-xs"
          >
            <motion.a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="wapp-pulse flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white font-sans text-sm tracking-wider uppercase font-semibold rounded-sm w-full"
            >
              <MessageCircle className="w-4 h-4 flex-shrink-0" />
              Consultas por WhatsApp
            </motion.a>
          </motion.div>
          === FIN SECCIÓN REDES SOCIALES === */}

          {/* Trust signals — métodos de pago */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 flex justify-center"
          >
            <Image
              src="/Webpay.png"
              alt="Medios de pago"
              width={520}
              height={130}
              className="object-contain"
            />
          </motion.div>

          {/* Divider */}
          <div className="mt-6 w-full max-w-xl h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

          {/* Legal links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-6"
          >
            {legalLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="font-sans text-xs text-[#b3acc4] underline decoration-[#D4AF37]/40 underline-offset-4 transition-colors duration-300 hover:text-white"
              >
                {label}
              </Link>
            ))}
          </motion.div>

          {/* Age disclaimer + Copyright */}
          <p className="mt-4 font-sans text-xs leading-relaxed text-white/50">
            Solo para mayores de 18 años. Se requiere identificación válida.
          </p>
          <p className="mt-2 font-sans text-xs text-white/30">
            © {new Date().getFullYear()} Lux Producciones. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
