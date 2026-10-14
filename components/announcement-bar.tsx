'use client'

import { usePathname } from 'next/navigation'

const HIDDEN_ON = ['/cookies', '/terminos', '/privacidad']

export function AnnouncementBar() {
  const pathname = usePathname()
  if (HIDDEN_ON.includes(pathname)) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[52] h-9 md:h-10 flex items-center justify-center px-4 select-none"
      style={{
        background: '#130b23',
        borderBottom: '1px solid rgba(212,175,55,0.18)',
      }}
    >
      {/* Gold shimmer line at top */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #D4AF37 30%, #FFD700 50%, #D4AF37 70%, transparent)' }}
      />

      <p className="font-sans text-[11.5px] md:text-[13px] tracking-wide text-center" style={{ color: 'rgba(255,229,153,0.85)' }}>
        ✨ Usa el código{' '}
        <span
          className="font-bold tracking-[0.15em] mx-1 px-2 py-0.5 rounded text-[#0e0a18]"
          style={{ background: 'linear-gradient(135deg, #ffe599, #D4AF37)' }}
        >
          LUXX10
        </span>
        {' '}y obtén un{' '}
        <span className="font-bold text-[#D4AF37]">10% de descuento</span>
        {' '}en tu reserva
      </p>
    </div>
  )
}
