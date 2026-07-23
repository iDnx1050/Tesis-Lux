'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, LogOut } from 'lucide-react'

// luxx_av_ui es la cookie client-readable para el estado del overlay.
// luxx_av es la cookie HttpOnly firmada con HMAC que el servidor verifica.
const UI_COOKIE = 'luxx_av_ui'

export function AgeGate({ children }: { children: React.ReactNode }) {
  const [verified, setVerified] = useState<boolean | null>(null)

  useEffect(() => {
    const cookies = document.cookie.split(';').map((c) => c.trim())
    const found = cookies.some((c) => c.startsWith(`${UI_COOKIE}=`))
    setVerified(found)
  }, [])

  const handleConfirm = async () => {
    try {
      // El servidor establece la cookie HttpOnly firmada (luxx_av)
      // y la cookie de UI (luxx_av_ui) en la misma respuesta
      await fetch('/api/age-verify', { method: 'POST' })
    } catch {
      // Si el fetch falla, continuar de todas formas (no bloquear al usuario)
    }
    setVerified(true)
  }

  // Evitar flash de contenido durante hidratación
  if (verified === null) return null
  if (verified) return <>{children}</>

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0e0a18] px-6"
      >
        {/* Fondo decorativo */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(212,175,67,0.07)_0%,rgba(110,69,213,0.08)_40%,transparent_70%)]" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="relative max-w-sm w-full text-center space-y-8"
        >
          {/* Logo */}
          <div>
            <span className="font-serif text-2xl font-bold text-[#D4AF37]">LUXX</span>
            <span className="font-serif text-2xl font-light text-[#F5F5F5]"> Producciones</span>
          </div>

          {/* Ícono */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-[#D4AF37]" />
            </div>
          </div>

          {/* Mensaje */}
          <div className="space-y-3">
            <h1 className="text-2xl italic text-white" style={{ fontFamily: 'var(--font-nunito)' }}>
              Verificación de edad
            </h1>
            <p className="text-sm leading-7 text-[#b3acc4]">
              Este sitio contiene contenido exclusivo para adultos.
              Al continuar declaras bajo tu responsabilidad que tienes{' '}
              <strong className="text-white">18 años o más</strong>.
            </p>
            <p className="text-xs text-[#5a4f75]">
              Sujeto a la Ley N° 20.120 y Ley N° 21.719 (Chile)
            </p>
          </div>

          {/* Botones */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleConfirm}
              className="w-full py-4 rounded-xl bg-[linear-gradient(135deg,#F1CB57_0%,#D4AF37_100%)] text-[#0e0a18] text-sm font-extrabold uppercase tracking-[0.25em] hover:brightness-110 transition duration-300"
            >
              Soy mayor de 18 años — Ingresar
            </button>
            <a
              href="https://www.google.com"
              className="w-full py-3 rounded-xl border border-[#2a1f3d] text-[#b3acc4] text-sm font-semibold uppercase tracking-[0.2em] hover:border-[#D4AF37]/40 hover:text-white transition duration-300 flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Salir del sitio
            </a>
          </div>

          <p className="text-[10px] text-[#3d3552] leading-5">
            No almacenamos datos personales durante esta verificación.
            Consulta nuestra{' '}
            <a href="/privacidad" className="underline hover:text-[#b3acc4] transition">
              Política de Privacidad
            </a>.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
