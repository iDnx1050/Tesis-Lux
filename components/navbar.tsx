'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, CalendarCheck } from 'lucide-react'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Bloquear el scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/vedetos', label: 'Artistas' },
    // { href: '/conjuntos', label: 'Conjuntos' }, // desactivado temporalmente
    { href: '/galeria', label: 'Galería' },
    { href: '/cotizador', label: 'Cotizador' },
    { href: '/extras', label: 'Extras' },
    { href: '/nosotros', label: 'Nosotros' },
    { href: '/contacto', label: 'Contacto' },
  ]

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className={`fixed top-9 md:top-10 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#1a0836]/92 backdrop-blur-2xl border-b border-white/8 shadow-[0_4px_32px_rgba(40,6,89,0.6)]'
            : 'bg-gradient-to-b from-[#1a0836]/75 to-transparent backdrop-blur-md'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-5 sm:px-6 py-3.5 sm:py-4">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 group">
              <motion.div whileHover={{ scale: 1.03 }} className="flex items-center">
                <span className="text-xl sm:text-2xl font-serif font-bold gold-text-glow" style={{
                  background: 'linear-gradient(135deg, #ffe599 0%, #D4AF37 35%, #FFD700 55%, #e8c84a 100%)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  LUXX
                </span>
                <span className="text-xl sm:text-2xl font-serif font-light text-white/90">
                  &nbsp;Producciones
                </span>
              </motion.div>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative font-sans text-sm tracking-widest uppercase group"
                >
                  <span className={`transition-colors duration-300 ${
                    isActive(link.href)
                      ? 'text-white'
                      : 'text-white/65 group-hover:text-white'
                  }`}>
                    {link.label}
                  </span>
                  {/* Active / hover underline */}
                  <span className={`absolute -bottom-1 left-0 h-px bg-gradient-to-r from-[#D4AF37] to-[#a855f7] transition-all duration-300 ${
                    isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:block">
              <Link href="/vedetos">
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-gold-pulse relative px-5 py-2.5 bg-[#D4AF37] text-[#0a0a0a] font-sans text-sm tracking-widest uppercase font-bold rounded-sm transition-colors duration-300 hover:bg-[#e8c84a]"
                >
                  Reserva Ya
                </motion.button>
              </Link>
            </div>

            {/* Mobile: Reservar pill + hamburger */}
            <div className="md:hidden flex items-center gap-4">
              <Link href="/vedetos">
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  className="flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] bg-[#D4AF37] text-[#0a0a0a] rounded-sm text-xs font-sans font-bold tracking-wide uppercase shadow-[0_0_12px_3px_rgba(212,175,55,0.45)]"
                >
                  <CalendarCheck className="w-4 h-4 flex-shrink-0" />
                  <span>Reservar</span>
                </motion.button>
              </Link>

              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileTap={{ scale: 0.9 }}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white/90 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm"
                aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isMobileMenuOpen ? (
                    <motion.span
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <X size={20} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="open"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <Menu size={20} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed top-9 md:top-10 inset-x-0 bottom-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-[#1a0836]/97 backdrop-blur-2xl"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Decorative orbs */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-[#6E45D5]/15 blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-[10%] h-48 w-48 rounded-full bg-[#cc1177]/10 blur-3xl pointer-events-none" />

            {/* Menu content */}
            <div className="relative z-10 flex flex-col h-full pt-24 pb-10 px-8 overflow-y-auto">

              {/* Nav links */}
              <nav className="flex flex-col items-center gap-2 flex-1 justify-center min-h-fit">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ delay: index * 0.07, duration: 0.3 }}
                    className="w-full"
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between w-full py-4 border-b border-white/8 group ${
                        isActive(link.href) ? 'text-white' : 'text-white/60'
                      }`}
                    >
                      <span className="font-serif text-3xl group-hover:text-white transition-colors duration-300">
                        {link.label}
                      </span>
                      {isActive(link.href) && (
                        <span className="h-2 w-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Bottom CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.38, duration: 0.3 }}
                className="flex flex-col gap-3 w-full max-w-sm mx-auto"
              >
                <Link href="/vedetos" onClick={() => setIsMobileMenuOpen(false)}>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center justify-center gap-2.5 py-4 w-full bg-[#D4AF37] text-[#0a0a0a] font-sans text-sm tracking-widest uppercase font-bold rounded-sm shadow-[0_0_16px_4px_rgba(212,175,55,0.45)] hover:bg-[#E8C34A] transition-colors duration-300 min-h-[56px]"
                  >
                    <CalendarCheck className="w-5 h-5 flex-shrink-0" />
                    Reservar Ahora
                  </motion.button>
                </Link>

                <p className="text-center text-white/30 font-sans text-xs tracking-widest uppercase">
                  Solo para mayores de 18 años
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
