'use client'

import { useState, useMemo } from 'react'
import { Sparkles } from 'lucide-react'
import { REGIONS, COMMUNES, locationPricing } from '@/lib/regions'

const SERVICES = [
  {
    id: 'clasico',
    name: 'Despedida Clásica',
    tag: 'Más elegida',
    description: 'Tres salidas con vestuario distinto, música y luces propias.',
    price: 140000,
  },
  {
    id: 'ceremonia',
    name: 'Con Animador',
    tag: null,
    description: 'Incluye maestro de ceremonias para una experiencia de mayor impacto.',
    price: 200000,
  },
]

function fmt(n: number) {
  return `$${Math.round(n).toLocaleString('es-CL')}`
}

export function Cotizador() {
  const [serviceId, setServiceId] = useState('clasico')
  const [people, setPeople] = useState(10)
  const [vedetos, setVedetos] = useState(1)
  const [selectedRegion, setSelectedRegion] = useState('metropolitana')
  const [selectedCommune, setSelectedCommune] = useState('Santiago')

  const service = SERVICES.find(s => s.id === serviceId)!
  const regionCommunes = COMMUNES[selectedRegion] ?? []

  const { total, perPerson, pricing } = useMemo(() => {
    const pricing = locationPricing(service.price, selectedRegion, selectedCommune)
    const total = pricing.effective + (vedetos - 1) * 80000
    return {
      total,
      perPerson: total / people,
      pricing,
    }
  }, [service.price, people, vedetos, selectedRegion, selectedCommune])

  const pct = ((people - 2) / 28) * 100

  const locationLabel = selectedCommune
    ? `${selectedCommune}, ${pricing.region.name}`
    : pricing.region.name

  const waMessage = encodeURIComponent(
    `Hola, me interesa cotizar una despedida 🥂\n\nServicio: ${service.name}\nVedetos: ${vedetos}\nUbicación: ${locationLabel}\nAmigas: ${people}\nTotal estimado: ${fmt(total)}\nCada una pone: ${fmt(perPerson)}${pricing.region.flight ? '\n(+ pasajes en avión aparte)' : ''}\n\n¿Podrían orientarme?`
  )

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/3 left-1/4 h-[500px] w-[500px] rounded-full bg-[#D4AF37]/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/3 h-[300px] w-[300px] rounded-full bg-[#6b21a8]/6 blur-[90px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-8 bg-[#D4AF37]/60" />
            <span className="text-[#D4AF37] font-sans text-[10px] font-semibold tracking-[0.35em] uppercase">Cotizador</span>
          </div>
          <h1 className="font-serif text-[clamp(2.6rem,5.5vw,4.2rem)] font-bold leading-[1.02] mb-5">
            <span className="text-white">¿Cuánto pone </span>
            <em
              className="not-italic gold-text-glow"
              style={{
                background: 'linear-gradient(120deg, #ffe599, #D4AF37 40%, #c9891a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                backgroundSize: '200% auto',
              }}
            >
              cada una?
            </em>
          </h1>
        </div>

        {/* Grid */}
        <div className="grid lg:grid-cols-[1.35fr_1fr] gap-10 lg:gap-12 items-start">

          {/* LEFT */}
          <div>
            {/* Ubicación del evento */}
            <p className="text-[#D4AF37] font-sans text-[10px] font-semibold tracking-[0.28em] uppercase mb-4">¿Dónde es tu evento?</p>
            <div
              className="rounded-2xl p-7 border border-white/7 mb-10"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <label className="block text-white/40 font-sans text-[11px] mb-1.5 tracking-wide">Región</label>
              <select
                value={selectedRegion}
                onChange={e => {
                  const newRegion = e.target.value
                  setSelectedRegion(newRegion)
                  setSelectedCommune(COMMUNES[newRegion]?.[0]?.name ?? '')
                }}
                className="w-full rounded-xl border border-white/15 bg-white/5 text-white font-sans text-sm px-4 py-3 appearance-none focus:outline-none focus:border-[#D4AF37]/50 transition-colors duration-200"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23D4AF37' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
              >
                {REGIONS.map(r => (
                  <option key={r.id} value={r.id} style={{ background: '#1a0836', color: '#fff' }}>
                    {r.name}
                  </option>
                ))}
              </select>

              {regionCommunes.length > 0 && (
                <div className="mt-3">
                  <label className="block text-white/40 font-sans text-[11px] mb-1.5 tracking-wide">Comuna</label>
                  <select
                    value={selectedCommune}
                    onChange={e => setSelectedCommune(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/5 text-white font-sans text-sm px-4 py-3 appearance-none focus:outline-none focus:border-[#D4AF37]/50 transition-colors duration-200"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23D4AF37' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
                  >
                    {regionCommunes.map(c => (
                      <option key={c.name} value={c.name} style={{ background: '#1a0836', color: '#fff' }}>
                        {c.name}{c.surcharge ? ` (+${fmt(c.surcharge)})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {pricing.region.note && pricing.region.id !== 'metropolitana' && (
                <div className={`mt-3 flex items-start gap-2 rounded-lg px-3 py-2.5 text-xs font-sans ${pricing.region.flight ? 'bg-amber-500/10 border border-amber-500/20 text-amber-300/80' : 'bg-[#D4AF37]/8 border border-[#D4AF37]/15 text-[#D4AF37]/80'}`}>
                  <span className="mt-0.5 flex-shrink-0">{pricing.region.flight ? '✈️' : '🚌'}</span>
                  <span>{pricing.region.note}{pricing.region.flight && ' — pasajes aéreos se coordinan por separado.'}</span>
                </div>
              )}

              {pricing.region.id !== 'metropolitana' && (
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-white/45 font-sans text-sm">Precio del show ajustado por zona</span>
                  <span className="text-[#D4AF37] font-serif text-xl font-bold">{fmt(pricing.effective)}</span>
                </div>
              )}
            </div>

            {/* Service cards */}
            <p className="text-[#D4AF37] font-sans text-[10px] font-semibold tracking-[0.28em] uppercase mb-4">Tipo de show</p>
            <div className="grid sm:grid-cols-2 gap-3 mb-10">
              {SERVICES.map(s => {
                const active = serviceId === s.id
                return (
                  <button
                    key={s.id}
                    onClick={() => setServiceId(s.id)}
                    className={`relative text-left p-6 rounded-2xl border transition-all duration-300 ${
                      active
                        ? 'border-[#D4AF37]/70 bg-gradient-to-br from-[#D4AF37]/14 to-[#a855f7]/8'
                        : 'border-white/8 bg-white/4 hover:border-white/18 hover:translate-y-[-2px]'
                    }`}
                    style={active ? { boxShadow: 'inset 0 0 40px rgba(212,175,55,0.10)' } : {}}
                  >
                    {/* Tick */}
                    <div className={`absolute top-5 right-5 w-5 h-5 rounded-full border transition-all duration-25 flex items-center justify-center ${
                      active ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-white/25'
                    }`}>
                      {active && <div className="w-2 h-2 rounded-full bg-[#0e0a18]" />}
                    </div>

                    {s.tag && (
                      <span className="absolute top-[18px] right-11 text-[9px] font-sans font-bold tracking-widest uppercase text-[#D4AF37] border border-[#D4AF37]/50 px-2 py-0.5 rounded-full bg-[#D4AF37]/8">
                        {s.tag}
                      </span>
                    )}

                    <h3 className={`font-serif text-[22px] font-semibold mb-2 pr-8 transition-colors duration-300 ${active ? 'text-[#D4AF37]' : 'text-white/85'}`}>
                      {s.name}
                    </h3>
                    <p className="text-white/40 font-sans text-[13px] leading-relaxed mb-4 min-h-[40px]">{s.description}</p>
                    <p className={`font-sans text-[15px] font-bold transition-colors duration-300 ${active ? 'text-white' : 'text-white/55'}`}>
                      {fmt(s.price)} <span className="text-white/35 font-normal text-xs">total show</span>
                    </p>
                  </button>
                )
              })}
            </div>

            {/* Vedetos */}
            <p className="text-[#D4AF37] font-sans text-[10px] font-semibold tracking-[0.28em] uppercase mb-4">Cantidad de vedetos</p>
            <div className="flex items-center gap-3 mb-10">
              {[1, 2, 3, 4].map(n => (
                <button
                  key={n}
                  onClick={() => setVedetos(n)}
                  className={`relative flex-1 py-4 rounded-xl border font-serif text-2xl font-semibold transition-all duration-300 ${
                    vedetos === n
                      ? 'border-[#D4AF37]/70 bg-[#D4AF37]/12 text-[#D4AF37]'
                      : 'border-white/8 bg-white/4 text-white/50 hover:border-white/20'
                  }`}
                  style={vedetos === n ? { boxShadow: '0 0 20px rgba(212,175,55,0.12)' } : {}}
                >
                  {n}
                  {n > 1 && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-sans font-bold tracking-wider text-[#D4AF37]/70 bg-[#0e0a18] px-1">
                      +{fmt((n - 1) * 80000)}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Slider */}
            <p className="text-[#D4AF37] font-sans text-[10px] font-semibold tracking-[0.28em] uppercase mb-4">¿Cuántas amigas?</p>
            <div
              className="rounded-2xl p-7 border border-white/7"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <div className="flex items-baseline justify-between mb-6">
                <div className="flex items-baseline gap-3">
                  <span
                    className="font-serif text-[58px] font-semibold leading-none"
                    style={{
                      color: '#D4AF37',
                      filter: 'drop-shadow(0 0 18px rgba(212,175,55,0.3))',
                    }}
                  >
                    {people}
                  </span>
                  <span className="text-white/45 text-lg font-sans">amigas</span>
                </div>
                <span className="text-white/25 font-sans text-xs tracking-wide">Mín. 2 · Máx. 30</span>
              </div>

              <input
                type="range"
                min={2}
                max={30}
                value={people}
                onChange={e => setPeople(Number(e.target.value))}
                className="cotizador-slider w-full"
                style={{
                  background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${pct}%, rgba(255,255,255,0.10) ${pct}%, rgba(255,255,255,0.10) 100%)`,
                }}
              />

              <div className="flex justify-between mt-3.5 mb-4">
                {['2', '10', '20', '30'].map(t => (
                  <span key={t} className="text-white/25 font-sans text-[11px]">{t}</span>
                ))}
              </div>

              <p className="text-white/35 font-sans text-[13px]">
                {people} × <strong className="text-[#D4AF37] font-semibold">{fmt(perPerson)}</strong> c/u = {fmt(total)} total
              </p>
            </div>
          </div>

          {/* RIGHT: Receipt card */}
          <div
            className="rounded-2xl overflow-hidden border border-[#D4AF37]/18 sticky top-28"
            style={{
              background: 'linear-gradient(165deg, rgba(44,21,72,0.9), rgba(14,10,24,0.97))',
              boxShadow: '0 30px 70px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.03)',
            }}
          >
            {/* Top */}
            <div
              className="px-8 pt-8 pb-7"
              style={{ background: 'radial-gradient(120% 100% at 70% 0%, rgba(212,175,55,0.10), transparent 60%)' }}
            >
              <p className="text-[#D4AF37] font-sans text-[10px] font-semibold tracking-[0.28em] uppercase mb-4">
                Precio por persona
              </p>
              <div className="flex items-start gap-1 leading-none">
                <span className="font-serif text-[32px] font-medium text-[#ffe599] mt-2">$</span>
                <span
                  className="font-serif text-[72px] font-semibold leading-[0.9]"
                  style={{
                    background: 'linear-gradient(120deg, #ffe599, #D4AF37 55%, #c9a24e)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 28px rgba(212,175,55,0.3))',
                  }}
                >
                  {Math.round(perPerson).toLocaleString('es-CL')}
                </span>
              </div>
              <p className="text-white/35 font-sans text-[13px] tracking-wide mt-2">lo que pone cada amiga</p>
            </div>

            {/* Dashed divider */}
            <div
              className="h-px mx-0"
              style={{ background: 'repeating-linear-gradient(90deg, rgba(212,175,55,0.22) 0 8px, transparent 8px 16px)' }}
            />

            {/* Rows */}
            <div className="px-8 py-6 space-y-3">
              {[
                { k: 'Servicio',           v: service.name,          gold: false },
                { k: 'Vedetos',            v: `${vedetos} artista${vedetos > 1 ? 's' : ''}`, gold: false },
                { k: 'Ubicación',          v: locationLabel,         gold: false },
                { k: 'Amigas',             v: `${people} personas`,  gold: false },
                { k: 'Total del show',     v: fmt(total),            gold: true  },
              ].map(row => (
                <div key={row.k} className="flex items-center justify-between text-sm">
                  <span className={row.gold ? 'text-white/75 font-sans' : 'text-white/40 font-sans'}>{row.k}</span>
                  <span className={`font-sans font-semibold text-right ${row.gold ? 'text-[#D4AF37]' : 'text-white/80'}`}>{row.v}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-8 pb-8">
              <a
                href={`https://wa.me/56945501752?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold-pulse flex items-center justify-center gap-2.5 w-full py-4 rounded-[14px] font-sans text-[14px] font-bold tracking-wider text-[#1A0E2C] transition-all duration-300 mb-4"
                style={{
                  background: 'linear-gradient(135deg, #ffe599 0%, #D4AF37 45%, #c9a24e 100%)',
                  boxShadow: '0 10px 30px rgba(212,175,55,0.32)',
                }}
              >
                <Sparkles className="w-4 h-4 flex-shrink-0" />
                Reservar con este precio
              </a>

              <p className="text-center text-white/25 font-sans text-[11px] tracking-wide mb-4">
                Precio referencial · Se coordina el pago directamente
              </p>

              <div className="flex gap-2 justify-center flex-wrap">
                {['Pago seguro', 'Confirmación 24h', '+300 despedidas'].map(t => (
                  <span key={t} className="text-[10.5px] text-white/40 font-sans border border-white/8 px-3 py-1 rounded-full tracking-wide">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
