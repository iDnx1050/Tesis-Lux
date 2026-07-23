'use client'

import { motion, useReducedMotion } from 'framer-motion'

function WhatsAppIcon({ className, color = '#25D366' }: { className?: string; color?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12.001 2C6.477 2 2 6.477 2 12c0 1.934.528 3.74 1.445 5.285L2.05 21.95l4.783-1.374A9.953 9.953 0 0 0 12.001 22C17.523 22 22 17.523 22 12S17.523 2 12.001 2Zm0 1.8A8.2 8.2 0 1 1 12 20.2a8.16 8.16 0 0 1-4.07-1.083l-.285-.17-2.937.843.872-2.862-.187-.295A8.16 8.16 0 0 1 3.8 12a8.2 8.2 0 0 1 8.201-8.2Zm-2.706 4.3c-.193 0-.505.072-.77.36-.265.287-1.01.988-1.01 2.407 0 1.42 1.034 2.79 1.178 2.982.144.193 2.01 3.167 4.937 4.314 2.414.953 2.928.763 3.456.715.528-.048 1.703-.695 1.944-1.368.24-.672.24-1.248.168-1.368-.072-.12-.265-.192-.554-.336-.288-.144-1.703-.84-1.967-.936-.264-.096-.456-.144-.648.144-.192.288-.744.936-.912 1.128-.168.192-.336.216-.624.072-.288-.144-1.216-.448-2.318-1.428-.856-.764-1.435-1.707-1.603-1.995-.168-.288-.018-.444.126-.588.13-.13.288-.336.432-.504.143-.168.191-.288.287-.48.097-.192.049-.36-.024-.504-.072-.144-.636-1.56-.88-2.136-.232-.552-.472-.48-.648-.488l-.552-.01Z" />
    </svg>
  )
}

interface WhatsAppButtonProps {
  phoneNumber?: string
  message?: string
  vedetoName?: string
  selectedDate?: string
  floating?: boolean
}

export function WhatsAppButton({
  phoneNumber = '56945501752',
  message,
  vedetoName,
  selectedDate,
  floating = false,
}: WhatsAppButtonProps) {
  const prefersReducedMotion = useReducedMotion()

  const defaultMessage = vedetoName
    ? `Hola, me interesa coordinar una presentación con ${vedetoName}${selectedDate ? ` para ${selectedDate}` : ''}. ¿Podrías orientarme?`
    : 'Hola, me gustaría agendar un show privado con Luxx Producciones. ¿Podrías orientarme?'

  const finalMessage = message || defaultMessage
  const encodedMessage = encodeURIComponent(finalMessage)
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

  if (floating) {
    return (
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.45, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-5 right-4 sm:bottom-7 sm:right-6 z-50 flex flex-col items-center gap-1"
        aria-label="Contactar por WhatsApp"
        style={{ willChange: 'transform' }}
      >
        {/* Outer pulse ring — única capa de animación de fondo */}
        {!prefersReducedMotion && (
          <motion.div
            animate={{ scale: [0.85, 1.22, 0.85], opacity: [0, 0.45, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
            className="absolute inset-[-2px] rounded-full border border-[#25D366]/45"
            style={{ willChange: 'transform, opacity' }}
          />
        )}

        {/* Button body */}
        <motion.div
          className="relative w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full bg-[#25D366] flex items-center justify-center"
          animate={prefersReducedMotion ? {} : { scale: [1, 1.06, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            boxShadow: '0 0 18px 6px rgba(37,211,102,0.55), 0 0 40px 12px rgba(37,211,102,0.25), 0 0 70px 20px rgba(37,211,102,0.1)',
            willChange: 'transform',
          }}
        >
          <svg viewBox="0 0 24 24" fill="white" className="h-8 w-8 sm:h-9 sm:w-9" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.428a.75.75 0 00.916.916l5.573-1.471A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.717 9.717 0 01-4.953-1.355l-.355-.211-3.676.97.982-3.589-.232-.368A9.718 9.718 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
          </svg>
        </motion.div>

        {/* Label */}
        <span className="text-[#25D366] font-sans text-[9px] sm:text-[10px] tracking-widest uppercase font-semibold drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
          WhatsApp
        </span>
      </motion.a>
    )
  }

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className="wapp-pulse inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#25D366] text-white font-sans text-sm tracking-wider uppercase font-semibold rounded-sm hover:bg-[#20BD5A] transition-colors duration-300 w-full min-h-[52px] shadow-[0_0_24px_rgba(37,211,102,0.3)]"
    >
      <WhatsAppIcon className="w-5 h-5 flex-shrink-0" color="white" />
      <span>Preguntas vía WhatsApp</span>
    </motion.a>
  )
}
