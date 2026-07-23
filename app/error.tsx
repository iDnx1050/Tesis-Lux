'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // El error real se registra solo en el servidor vía Next.js — aquí solo notificamos
    // No loguear error.message al cliente: puede contener rutas internas o datos sensibles
  }, [error])

  return (
    <main className="min-h-screen bg-[#0e0a18] text-[#F5F5F5] flex items-center justify-center px-6">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(180deg,#0e0a18_0%,#130e22_22%,#1a1229_44%,#1e1430_68%,#110d1e_100%)]" />

      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-[#D4AF37]" />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#D4AF37]">
            Error del sistema
          </p>
          <h1 className="font-serif text-3xl italic text-white">
            Algo salió mal
          </h1>
          <p className="text-sm leading-7 text-[#b3acc4]">
            Ocurrió un error inesperado. Nuestro equipo ha sido notificado automáticamente.
          </p>
          {error.digest && (
            <p className="text-xs text-[#5a4f75] font-mono">
              Referencia: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl bg-[#D4AF37] text-[#0e0a18] text-sm font-bold uppercase tracking-[0.2em] hover:brightness-110 transition"
          >
            Reintentar
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl border border-[#2a1f3d] text-[#b3acc4] text-sm font-semibold uppercase tracking-[0.2em] hover:border-[#D4AF37] hover:text-white transition"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </main>
  )
}
