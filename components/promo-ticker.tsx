const ITEMS = [
  'DESPEDIDAS DE SOLTERA',
  'SHOWS PRIVADOS',
  'VEDETOS EXCLUSIVOS',
  'CÓDIGO LUXX10',
  'SANTIAGO Y REGIONES',
  'LIMUSINAS VIP',
  'DECORACIÓN & COCTELERÍA',
  'RESERVA TU SHOW',
]

const SEP = '✦'

const text = ITEMS.flatMap(item => [item, SEP]).join('  ')

export function PromoTicker() {
  return (
    <div
      className="relative w-full overflow-hidden py-3 select-none"
      style={{
        background: '#0a0614',
        borderTop: '1px solid rgba(212,175,55,0.15)',
        borderBottom: '1px solid rgba(212,175,55,0.15)',
      }}
    >
      {/* Left fade */}
      <div
        className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 z-10"
        style={{ background: 'linear-gradient(to right, #0a0614, transparent)' }}
      />
      {/* Right fade */}
      <div
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 z-10"
        style={{ background: 'linear-gradient(to left, #0a0614, transparent)' }}
      />

      <div className="ticker-track flex whitespace-nowrap">
        {[0, 1].map(i => (
          <span
            key={i}
            className="font-sans font-semibold uppercase"
            style={{
              fontSize: '11px',
              letterSpacing: '0.22em',
              color: 'rgba(212,175,55,0.75)',
              paddingRight: '3rem',
            }}
          >
            {text}&nbsp;&nbsp;&nbsp;
          </span>
        ))}
      </div>
    </div>
  )
}
