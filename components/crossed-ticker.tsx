const SEP = '✦'

const BAND_1 = [
  'SHOWS VIP', 'VEDETOS EXCLUSIVOS', 'DESPEDIDAS ÚNICAS',
  'EXPERIENCIAS LUXX', 'CÓDIGO LUXX10', 'ARTISTAS DE ÉLITE',
]

const BAND_2 = [
  'LUXX PRODUCCIONES', 'RESERVA AHORA', 'SANTIAGO · CHILE',
  'TU NOCHE PERFECTA', 'SHOWS PRIVADOS', 'MOMENTOS ÚNICOS',
]

const row1 = Array(3).fill(BAND_1.flatMap(t => [t, SEP]).join('  ')).join('  ')
const row2 = Array(3).fill(BAND_2.flatMap(t => [t, SEP]).join('  ')).join('  ')

export function CrossedTicker() {
  return (
    <div
      className="relative overflow-hidden"
      style={{ height: 290 }}
      aria-hidden
    >
      {/* Band 1 — gold, tilted negative */}
      <div
        className="absolute inset-x-[-10%] flex items-center overflow-hidden"
        style={{
          top: 40,
          height: 90,
          transform: 'rotate(-4deg)',
          background: 'linear-gradient(135deg, #ffe599 0%, #D4AF37 45%, #b8922e 100%)',
          boxShadow: '0 16px 50px rgba(0,0,0,0.6)',
        }}
      >
        <div className="ticker-track flex whitespace-nowrap items-center">
          {[0, 1].map(i => (
            <span
              key={i}
              className="font-sans font-black uppercase text-[#0e0a18]"
              style={{ fontSize: '15px', letterSpacing: '0.22em', paddingRight: '3rem' }}
            >
              {row1}&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* Band 2 — dark with gold text, tilted positive */}
      <div
        className="absolute inset-x-[-10%] flex items-center overflow-hidden"
        style={{
          top: 160,
          height: 76,
          transform: 'rotate(3deg)',
          background: '#0d0919',
          borderTop: '1px solid rgba(212,175,55,0.3)',
          borderBottom: '1px solid rgba(212,175,55,0.3)',
          boxShadow: '0 16px 50px rgba(0,0,0,0.55)',
        }}
      >
        <div className="ticker-track-reverse flex whitespace-nowrap items-center">
          {[0, 1].map(i => (
            <span
              key={i}
              className="font-sans font-bold uppercase"
              style={{ fontSize: '14px', letterSpacing: '0.24em', paddingRight: '3rem', color: 'rgba(212,175,55,0.8)' }}
            >
              {row2}&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
