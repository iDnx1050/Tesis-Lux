'use client'

const TEXT =
  '  ✨ Usa el código  LUXX10  al momento de pagar y obtén un 10% de descuento  —  ⏳ Oferta por tiempo limitado  —  📋 Ingrésalo en el resumen de tu reserva    '

export function AnnouncementBar() {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-[52] h-9 md:h-10 overflow-hidden flex items-center select-none"
      style={{
        background: 'linear-gradient(90deg, #1a0836 0%, #2c0d5e 40%, #1a0836 100%)',
        borderBottom: '1px solid rgba(212,175,55,0.25)',
      }}
    >
      {/* Gold shimmer line at top */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #D4AF37 30%, #FFD700 50%, #D4AF37 70%, transparent)' }}
      />

      {/* Scrolling track — duplicated for seamless loop */}
      <div className="announcement-marquee flex whitespace-nowrap">
        {[0, 1].map(i => (
          <span
            key={i}
            className="font-sans text-[11.5px] md:text-[13px] tracking-wide"
            style={{ color: 'rgba(255,229,153,0.9)' }}
          >
            {TEXT}
            <span
              className="font-bold tracking-[0.15em] mx-1 px-2 py-0.5 rounded text-[#0e0a18]"
              style={{ background: 'linear-gradient(135deg, #ffe599, #D4AF37)' }}
            >
              LUXX10
            </span>
            {TEXT}
          </span>
        ))}
      </div>
    </div>
  )
}
