'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  Minus, Plus, ChevronLeft, ChevronRight, Check,
  MessageCircle, Share2, Search, Tag, Users, MapPin,
} from 'lucide-react'

// ─── Data ─────────────────────────────────────────────────────────────────────

const WA = '56945501752'
const PROMO = { code: 'LUXX10', pct: 10 } as const

const SHOWS = [
  {
    id: 'clasico' as const,
    name: 'Despedida Clásica',
    price: 140_000,
    badge: 'Más elegida',
    desc: 'Tres salidas con vestuario distinto, música y luces propias.',
  },
  {
    id: 'animador' as const,
    name: 'Con Animador',
    price: 200_000,
    badge: null,
    desc: 'Incluye maestro de ceremonias para una experiencia de mayor impacto.',
  },
] as const

type ShowId = (typeof SHOWS)[number]['id']

const LIMOS = [
  { id: 'chrysler-dorado',  name: 'Chrysler blanca con dorado', cap: 6,  price: 372_990 },
  { id: 'chrysler-blanca',  name: 'Chrysler blanca',            cap: 10, price: 422_990 },
  { id: 'hummer-azul',      name: 'Hummer azul',                cap: 10, price: 422_990 },
  { id: 'party-truck',      name: 'Party Truck',                cap: 12, price: 472_990 },
  { id: 'hummer-blanca',    name: 'Hummer blanca',              cap: 15, price: 472_990 },
]

const REGIONES = [
  { name: 'Valparaíso', price: 180_000, note: '+ recargo traslado' },
  { name: "O'Higgins", price: 180_000, note: '+ recargo traslado' },
  { name: 'Coquimbo', price: 240_000, note: 'incluye bus' },
  { name: 'Maule', price: 240_000, note: 'incluye bus' },
  { name: 'Ñuble', price: 240_000, note: 'incluye bus' },
  { name: 'Biobío', price: 240_000, note: 'incluye bus' },
  { name: 'La Araucanía', price: 230_000, note: '+ pasajes avión' },
  { name: 'Los Ríos', price: 230_000, note: '+ pasajes avión' },
  { name: 'Los Lagos', price: 230_000, note: '+ pasajes avión' },
  { name: 'Antofagasta', price: 220_000, note: '+ pasajes avión' },
  { name: 'Atacama', price: 220_000, note: '+ pasajes avión' },
  { name: 'Tarapacá', price: 220_000, note: '+ pasajes avión' },
  { name: 'Arica y Parinacota', price: 220_000, note: '+ pasajes avión' },
  { name: 'Aysén', price: 230_000, note: '+ pasajes avión' },
  { name: 'Magallanes y Antártica', price: 230_000, note: '+ pasajes avión' },
]

const COMUNAS_RM = [
  'Alhué', 'Buin', 'Calera de Tango', 'Cerrillos', 'Cerro Navia', 'Colina', 'Conchalí',
  'Curacaví', 'El Bosque', 'El Monte', 'Estación Central', 'Huechuraba', 'Independencia',
  'Isla de Maipo', 'La Cisterna', 'La Florida', 'La Granja', 'La Pintana', 'La Reina',
  'Lampa', 'Las Condes', 'Lo Barnechea', 'Lo Espejo', 'Lo Prado', 'Macul', 'Maipú',
  'María Pinto', 'Melipilla', 'Ñuñoa', 'Padre Hurtado', 'Paine', 'Pedro Aguirre Cerda',
  'Peñaflor', 'Peñalolén', 'Pirque', 'Providencia', 'Pudahuel', 'Quilicura',
  'Quinta Normal', 'Recoleta', 'Renca', 'San Bernardo', 'San Joaquín',
  'San José de Maipo', 'San Miguel', 'San Pedro', 'San Ramón', 'Santiago',
  'Talagante', 'Tiltil', 'Vitacura',
]

const SURCHARGES: Record<string, number> = {
  Pudahuel: 20_000, Colina: 20_000, Lampa: 20_000, Tiltil: 30_000, Buin: 20_000,
}

const POPULAR_COMMUNES = [
  'Santiago', 'Providencia', 'Las Condes', 'Ñuñoa', 'Maipú', 'La Florida', 'Puente Alto',
]

const STEPS = ['Amigas', 'Show', 'Vedetos', 'Lugar', 'Extras', 'Resumen']

// ─── Helpers ──────────────────────────────────────────────────────────────────

const clp = (n: number) => `$${Math.round(n).toLocaleString('es-CL')}`
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

// ─── State ────────────────────────────────────────────────────────────────────

interface QS {
  n: number
  show: ShowId
  v: number
  rm: boolean
  region: string
  commune: string
  q: string
  limo: string | null
  deco: boolean
  coct: boolean
  promo: string
  promoOk: boolean
  promoMsg: string
}

const INIT: QS = {
  n: 10, show: 'clasico', v: 1, rm: true,
  region: REGIONES[0].name, commune: 'Santiago',
  q: '', limo: null, deco: false, coct: false,
  promo: '', promoOk: false, promoMsg: '',
}

// ─── Calculation ──────────────────────────────────────────────────────────────

function calcQuote(s: QS) {
  const sh = SHOWS.find(x => x.id === s.show)!
  let showBase: number
  let extraNote = ''

  if (s.rm) {
    const sur = SURCHARGES[s.commune] ?? 0
    showBase = sh.price + sur
    if (sur) extraNote = `+ recargo ${s.commune} (${clp(sur)})`
  } else {
    const reg = REGIONES.find(r => r.name === s.region) ?? REGIONES[0]
    showBase = reg.price
    extraNote = reg.note
  }

  const vedetoExtra = (s.v - 1) * 80_000
  const showTotal = showBase + vedetoExtra
  const discount = s.promoOk ? Math.round(showTotal * PROMO.pct / 100) : 0
  const limo = LIMOS.find(l => l.id === s.limo) ?? null
  const limoTotal = limo?.price ?? 0
  const total = showTotal - discount + limoTotal
  const perPerson = Math.ceil(total / s.n)

  return { sh, showBase, vedetoExtra, showTotal, discount, limo, limoTotal, total, perPerson, extraNote }
}

type Quote = ReturnType<typeof calcQuote>

// ─── WA messages ─────────────────────────────────────────────────────────────

function buildWaText(s: QS): string {
  const q = calcQuote(s)
  const lugar = s.rm ? `${s.commune}, RM` : `${s.region} (traslado por confirmar)`
  const lines = [
    'Hola Luxx! Quiero reservar una despedida 🥂',
    `• Servicio: ${q.sh.name}`,
    `• Vedetos: ${s.v}`,
    `• Lugar: ${lugar}`,
    `• Amigas: ${s.n}`,
  ]
  if (q.limo) lines.push(`• Limusina: ${q.limo.name}`)
  if (s.deco) lines.push('• Me interesa cotizar decoración')
  if (s.coct) lines.push('• Me interesa cotizar coctelería')
  if (s.promoOk) lines.push(`• Código ${PROMO.code}: -${clp(q.discount)}`)
  lines.push(`• Total estimado: ${clp(q.total)} (${clp(q.perPerson)} c/u)`)
  lines.push('¿Me pueden orientar con la fecha y el pago?')
  return lines.join('\n')
}

function buildShareText(s: QS): string {
  const q = calcQuote(s)
  return `Chiquillas! Armé la despedida con Luxx 🎉\n${q.sh.name} · ${s.v} ${s.v === 1 ? 'vedeto' : 'vedetos'}${q.limo ? ' · ' + q.limo.name : ''}\nSomos ${s.n} → pone cada una ${clp(q.perPerson)}\n(total ${clp(q.total)})`
}

// ─── Shared style tokens ──────────────────────────────────────────────────────

const GOLD_BTN = {
  background: 'linear-gradient(135deg, #ffe599 0%, #D4AF37 45%, #b8922e 100%)',
}

const GOLD_TEXT = {
  background: 'linear-gradient(135deg, #ffe599 0%, #D4AF37 35%, #FFD700 55%, #e8c84a 100%)',
  backgroundSize: '200% auto',
  WebkitBackgroundClip: 'text' as const,
  WebkitTextFillColor: 'transparent' as const,
  backgroundClip: 'text' as const,
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepHeader({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="mb-6">
      <span className="text-3xl">{icon}</span>
      <h3 className="font-serif text-2xl font-bold text-white mt-2 leading-tight">{title}</h3>
      <p className="font-sans text-sm text-white/45 mt-1 leading-relaxed">{desc}</p>
    </div>
  )
}

function StepDots({ step, count }: { step: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i === step
              ? 'w-4 h-1.5 bg-[#D4AF37]'
              : i < step
              ? 'w-1.5 h-1.5 bg-[#D4AF37]/50'
              : 'w-1.5 h-1.5 bg-white/15'
          }`}
        />
      ))}
    </div>
  )
}

function TicketRow({
  label, value, note, gold, muted,
}: { label: string; value: string; note?: string; gold?: boolean; muted?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <span className={`font-sans text-sm ${muted ? 'text-white/35' : 'text-white/65'}`}>{label}</span>
        {note && <p className="font-sans text-[10px] text-white/30 mt-0.5">{note}</p>}
      </div>
      <span
        className={`font-sans text-sm font-semibold tabular-nums shrink-0 ${
          gold ? 'text-[#D4AF37]' : muted ? 'text-white/35' : 'text-white/80'
        }`}
      >
        {value}
      </span>
    </div>
  )
}

function Ticket({ s, q, onWa, onShare }: { s: QS; q: Quote; onWa: () => void; onShare: () => void }) {
  return (
    <div
      className="rounded-2xl overflow-hidden border border-[#D4AF37]/25"
      style={{ background: 'linear-gradient(160deg, #150f22 0%, #0e0a18 100%)' }}
    >
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-[#D4AF37]/10">
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.35em] text-[#D4AF37]/70 mb-1">
          Tu despedida
        </p>
        <p className="font-serif text-xl font-bold text-white leading-tight">{q.sh.name}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
          <div className="flex items-center gap-1.5">
            <Users className="h-3 w-3 text-white/30" />
            <span className="font-sans text-xs text-white/40">{s.n} amigas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-white/20">·</span>
            <span className="font-sans text-xs text-white/40">{s.v} {s.v === 1 ? 'vedeto' : 'vedetos'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3 text-white/30" />
            <span className="font-sans text-xs text-white/40">{s.rm ? s.commune : s.region}</span>
          </div>
        </div>
      </div>

      {/* Line items */}
      <div className="px-6 py-4 space-y-3 border-b border-dashed border-[#D4AF37]/12">
        <TicketRow label={q.sh.name} value={clp(q.showBase)} note={q.extraNote || undefined} />
        {q.vedetoExtra > 0 && (
          <TicketRow
            label={`+${s.v - 1} vedeto${s.v - 1 > 1 ? 's' : ''} extra`}
            value={clp(q.vedetoExtra)}
          />
        )}
        {q.discount > 0 && (
          <TicketRow label={`Código ${PROMO.code}`} value={`-${clp(q.discount)}`} gold />
        )}
        {q.limo && <TicketRow label={q.limo.name} value={clp(q.limoTotal)} />}
        {s.deco && <TicketRow label="Decoración" value="Por cotizar" muted />}
        {s.coct && <TicketRow label="Coctelería" value="Por cotizar" muted />}
      </div>

      {/* Total + CTA */}
      <div className="px-6 py-5">
        <div className="flex items-baseline justify-between mb-1">
          <span className="font-sans text-sm text-white/50">Total estimado</span>
          <span className="font-serif text-2xl font-bold" style={GOLD_TEXT}>{clp(q.total)}</span>
        </div>

        <div
          className="flex items-center justify-between rounded-xl px-4 py-3 mt-3"
          style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.18)' }}
        >
          <span className="font-sans text-xs text-white/50">Cada una pone</span>
          <span className="font-serif text-xl font-bold text-[#D4AF37]">{clp(q.perPerson)}</span>
        </div>

        <p className="font-sans text-[10px] text-white/25 text-center mt-3 leading-relaxed">
          Valores referenciales. El total exacto se confirma al reservar.
        </p>

        <button
          type="button"
          onClick={onWa}
          className="btn-gold-pulse mt-4 w-full flex items-center justify-center gap-2.5 rounded-xl py-3.5 font-sans text-sm font-bold uppercase tracking-widest text-[#0e0a18] transition-all"
          style={GOLD_BTN}
        >
          <MessageCircle className="h-4 w-4" />
          Reservar por WhatsApp
        </button>

        <button
          type="button"
          onClick={onShare}
          className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl py-2.5 font-sans text-sm font-semibold text-white/45 border border-white/10 hover:border-[#D4AF37]/30 hover:text-white/60 transition-all"
        >
          <Share2 className="h-4 w-4" />
          Compartir con amigas
        </button>
      </div>
    </div>
  )
}

function CommuneSearch({ s, set }: { s: QS; set: (p: Partial<QS>) => void }) {
  const filtered = useMemo(() => {
    if (!s.q) return COMUNAS_RM
    const query = norm(s.q)
    return COMUNAS_RM.filter(c => norm(c).includes(query))
  }, [s.q])

  return (
    <div>
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
        <input
          type="text"
          placeholder="Buscar comuna…"
          value={s.q}
          onChange={e => set({ q: e.target.value })}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/12 font-sans text-sm text-white placeholder-white/25 outline-none focus:border-[#D4AF37]/50 transition-colors"
        />
      </div>

      <div className="h-52 overflow-y-auto overscroll-contain space-y-0.5 pr-1">
        {!s.q && (
          <>
            <p className="font-sans text-[10px] text-white/30 uppercase tracking-[0.3em] mb-2 px-2">
              Frecuentes
            </p>
            {POPULAR_COMMUNES.map(c => (
              <CommuneRow key={c} commune={c} selected={s.commune === c} onSelect={() => set({ commune: c, q: '' })} />
            ))}
            <p className="font-sans text-[10px] text-white/30 uppercase tracking-[0.3em] mt-3 mb-2 px-2">
              Todas las comunas
            </p>
          </>
        )}
        {filtered.map(c => (
          <CommuneRow key={c} commune={c} selected={s.commune === c} onSelect={() => set({ commune: c, q: '' })} />
        ))}
      </div>
    </div>
  )
}

function CommuneRow({ commune, selected, onSelect }: { commune: string; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left px-3 py-2 rounded-lg font-sans text-sm transition-colors flex items-center justify-between ${
        selected
          ? 'bg-[#D4AF37]/12 text-[#D4AF37] border border-[#D4AF37]/35'
          : 'text-white/65 hover:bg-white/5 hover:text-white/80'
      }`}
    >
      <span>{commune}</span>
      {SURCHARGES[commune] ? (
        <span className="text-[10px] text-white/30">+{clp(SURCHARGES[commune])}</span>
      ) : null}
    </button>
  )
}

// ─── Step views ───────────────────────────────────────────────────────────────

function StepAmigas({ s, set }: { s: QS; set: (p: Partial<QS>) => void }) {
  return (
    <div>
      <StepHeader icon="👯" title="¿Cuántas son?" desc="Incluye a la festejada en el conteo." />
      <div className="flex items-center justify-center gap-6 py-4">
        <button
          type="button"
          onClick={() => set({ n: Math.max(2, s.n - 1) })}
          disabled={s.n <= 2}
          className="h-12 w-12 rounded-full border border-white/15 text-white/60 flex items-center justify-center hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors disabled:opacity-30"
        >
          <Minus className="h-5 w-5" />
        </button>
        <div className="text-center w-24">
          <span className="font-serif text-6xl font-bold" style={GOLD_TEXT}>{s.n}</span>
          <p className="font-sans text-xs text-white/35 mt-1">amigas</p>
        </div>
        <button
          type="button"
          onClick={() => set({ n: Math.min(30, s.n + 1) })}
          disabled={s.n >= 30}
          className="h-12 w-12 rounded-full border border-white/15 text-white/60 flex items-center justify-center hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors disabled:opacity-30"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
      <div className="grid grid-cols-5 gap-2 mt-4">
        {[5, 8, 10, 15, 20].map(n => (
          <button
            key={n}
            type="button"
            onClick={() => set({ n })}
            className={`py-2.5 rounded-xl font-sans text-sm font-semibold transition-all ${
              s.n === n
                ? 'bg-[#D4AF37]/15 border border-[#D4AF37]/60 text-[#D4AF37]'
                : 'border border-white/10 text-white/40 hover:border-white/25 hover:text-white/65'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <p className="text-center font-sans text-xs text-white/25 mt-4">Mín. 2 · Máx. 30 personas</p>
    </div>
  )
}

function StepShow({ s, set }: { s: QS; set: (p: Partial<QS>) => void }) {
  return (
    <div>
      <StepHeader icon="💃" title="¿Qué show quieren?" desc="Elige la experiencia perfecta para la festejada." />
      <div className="space-y-4">
        {SHOWS.map(sh => (
          <button
            key={sh.id}
            type="button"
            onClick={() => set({ show: sh.id })}
            className={`w-full text-left rounded-2xl border p-5 transition-all duration-200 ${
              s.show === sh.id
                ? 'border-[#D4AF37] bg-[#D4AF37]/[0.07] shadow-[0_0_24px_rgba(212,175,55,0.15)]'
                : 'border-white/10 bg-white/[0.02] hover:border-[#D4AF37]/35 hover:bg-white/[0.04]'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="font-serif text-lg font-bold text-white leading-tight">{sh.name}</p>
                <p className="font-sans text-xs text-white/45 mt-1 leading-relaxed">{sh.desc}</p>
              </div>
              {sh.badge && (
                <span
                  className="shrink-0 rounded-full px-2.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wide text-[#0e0a18]"
                  style={GOLD_BTN}
                >
                  {sh.badge}
                </span>
              )}
            </div>
            <p className="font-serif text-xl font-bold" style={GOLD_TEXT}>{clp(sh.price)}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

function StepVedetos({ s, set }: { s: QS; set: (p: Partial<QS>) => void }) {
  return (
    <div>
      <StepHeader
        icon="⭐"
        title="¿Cuántos vedetos?"
        desc="Con más artistas, más salidas y más show. Cada vedeto extra suma $80.000."
      />
      <div className="flex items-center justify-center gap-6 py-4">
        <button
          type="button"
          onClick={() => set({ v: Math.max(1, s.v - 1) })}
          disabled={s.v <= 1}
          className="h-12 w-12 rounded-full border border-white/15 text-white/60 flex items-center justify-center hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors disabled:opacity-30"
        >
          <Minus className="h-5 w-5" />
        </button>
        <div className="text-center w-24">
          <span className="font-serif text-6xl font-bold" style={GOLD_TEXT}>{s.v}</span>
          <p className="font-sans text-xs text-white/35 mt-1">{s.v === 1 ? 'vedeto' : 'vedetos'}</p>
        </div>
        <button
          type="button"
          onClick={() => set({ v: Math.min(4, s.v + 1) })}
          disabled={s.v >= 4}
          className="h-12 w-12 rounded-full border border-white/15 text-white/60 flex items-center justify-center hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors disabled:opacity-30"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
      {s.v > 1 && (
        <div
          className="rounded-xl px-4 py-3 text-center"
          style={{ background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.2)' }}
        >
          <p className="font-sans text-sm text-white/70">
            +<span className="text-[#D4AF37] font-semibold">{s.v - 1} vedeto{s.v - 1 > 1 ? 's' : ''} extra</span>
            {' '}= <span className="font-semibold text-white">{clp((s.v - 1) * 80_000)}</span> adicional
          </p>
        </div>
      )}
      <p className="text-center font-sans text-xs text-white/25 mt-4">Hasta 4 artistas disponibles</p>
    </div>
  )
}

function StepLugar({ s, set }: { s: QS; set: (p: Partial<QS>) => void }) {
  return (
    <div>
      <StepHeader icon="📍" title="¿Dónde es la despedida?" desc="El lugar determina el traslado del equipo." />
      <div className="flex gap-2 mb-5">
        {([true, false] as const).map(isRm => (
          <button
            key={String(isRm)}
            type="button"
            onClick={() => set({ rm: isRm })}
            className={`flex-1 py-2.5 rounded-xl font-sans text-sm font-semibold transition-all ${
              s.rm === isRm
                ? 'bg-[#D4AF37]/15 border border-[#D4AF37]/55 text-[#D4AF37]'
                : 'border border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'
            }`}
          >
            {isRm ? 'Región Metropolitana' : 'Otra región'}
          </button>
        ))}
      </div>

      {s.rm ? (
        <CommuneSearch s={s} set={set} />
      ) : (
        <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
          {REGIONES.map(r => (
            <button
              key={r.name}
              type="button"
              onClick={() => set({ region: r.name })}
              className={`w-full text-left px-4 py-3 rounded-xl border font-sans text-sm transition-all ${
                s.region === r.name
                  ? 'border-[#D4AF37]/55 bg-[#D4AF37]/10 text-[#D4AF37]'
                  : 'border-white/10 text-white/65 hover:border-white/20 hover:bg-white/[0.03]'
              }`}
            >
              <span className="font-semibold">{r.name}</span>
              <span className="ml-2 text-[11px] text-white/30">{r.note}</span>
              <span className="float-right font-semibold">{clp(r.price)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function StepExtras({ s, set }: { s: QS; set: (p: Partial<QS>) => void }) {
  const applyPromo = () => {
    if (s.promo === PROMO.code) {
      set({ promoOk: true, promoMsg: `−${PROMO.pct}% aplicado 🎉` })
    } else {
      set({ promoOk: false, promoMsg: 'Código inválido' })
    }
  }

  return (
    <div>
      <StepHeader icon="✨" title="¿Le ponemos algo más?" desc="Cada extra se cotiza por separado al confirmar." />

      {/* Limusina */}
      <div className="mb-5">
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.3em] text-white/35 mb-3">
          Limusina
        </p>
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => set({ limo: null })}
            className={`w-full text-left px-4 py-3 rounded-xl border font-sans text-sm transition-all ${
              s.limo === null
                ? 'border-[#D4AF37]/55 bg-[#D4AF37]/10 text-[#D4AF37]'
                : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'
            }`}
          >
            Sin limusina
          </button>
          {LIMOS.map(l => (
            <button
              key={l.id}
              type="button"
              onClick={() => set({ limo: l.id })}
              className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                s.limo === l.id
                  ? 'border-[#D4AF37]/55 bg-[#D4AF37]/10'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/18 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-sans text-sm font-semibold text-white">{l.name}</span>
                  <span className="ml-2 font-sans text-[11px] text-white/30">hasta {l.cap} pax</span>
                </div>
                <span className="font-sans text-sm font-bold text-[#D4AF37]">{clp(l.price)}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Deco + Coct */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <button
          type="button"
          onClick={() => set({ deco: !s.deco })}
          className={`text-left p-4 rounded-2xl border transition-all duration-200 ${
            s.deco
              ? 'border-[#D4AF37] bg-[#D4AF37]/[0.08]'
              : 'border-white/10 bg-white/[0.02] hover:border-[#D4AF37]/30'
          }`}
        >
          <span className="text-2xl">🎀</span>
          <p className="font-sans text-sm font-semibold text-white mt-2">Decoración</p>
          <p className="font-sans text-[11px] text-white/35 mt-0.5">Arcos, shimmer, globos</p>
          {s.deco && (
            <span className="inline-flex items-center gap-1 mt-2 font-sans text-[10px] text-[#D4AF37]">
              <Check className="h-3 w-3" /> Incluida
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => set({ coct: !s.coct })}
          className={`text-left p-4 rounded-2xl border transition-all duration-200 ${
            s.coct
              ? 'border-[#D4AF37] bg-[#D4AF37]/[0.08]'
              : 'border-white/10 bg-white/[0.02] hover:border-[#D4AF37]/30'
          }`}
        >
          <span className="text-2xl">🍾</span>
          <p className="font-sans text-sm font-semibold text-white mt-2">Coctelería</p>
          <p className="font-sans text-[11px] text-white/35 mt-0.5">Tabla, brochetas, limonada</p>
          {s.coct && (
            <span className="inline-flex items-center gap-1 mt-2 font-sans text-[10px] text-[#D4AF37]">
              <Check className="h-3 w-3" /> Incluida
            </span>
          )}
        </button>
      </div>

      {/* Promo */}
      <div>
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.3em] text-white/35 mb-2">
          Código de descuento
        </p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
            <input
              type="text"
              placeholder="Ej: LUXX10"
              value={s.promo}
              onChange={e => set({ promo: e.target.value.toUpperCase(), promoMsg: '', promoOk: false })}
              onKeyDown={e => e.key === 'Enter' && applyPromo()}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border font-sans text-sm text-white placeholder-white/20 bg-white/5 outline-none transition-colors ${
                s.promoOk
                  ? 'border-emerald-500/50 focus:border-emerald-500/70'
                  : s.promoMsg
                  ? 'border-red-500/40 focus:border-red-500/60'
                  : 'border-white/12 focus:border-[#D4AF37]/50'
              }`}
            />
          </div>
          <button
            type="button"
            onClick={applyPromo}
            className="px-4 rounded-xl border border-white/15 font-sans text-sm text-white/55 hover:border-[#D4AF37]/40 hover:text-[#D4AF37] transition-colors"
          >
            Aplicar
          </button>
        </div>
        {s.promoMsg && (
          <p className={`mt-1.5 font-sans text-xs ${s.promoOk ? 'text-emerald-400' : 'text-red-400'}`}>
            {s.promoMsg}
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Mobile wizard ────────────────────────────────────────────────────────────

function MobileWizard({ s, set, q }: { s: QS; set: (p: Partial<QS>) => void; q: Quote }) {
  const [step, setStep] = useState(0)
  const TOTAL = 6

  const onWa = () => {
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(buildWaText(s))}`, '_blank')
  }

  const onShare = async () => {
    const text = buildShareText(s)
    if (navigator.share) {
      try { await navigator.share({ title: 'Despedida Luxx', text }) } catch {}
    } else {
      try { await navigator.clipboard.writeText(text) } catch {}
    }
  }

  const renderStep = () => {
    switch (step) {
      case 0: return <StepAmigas s={s} set={set} />
      case 1: return <StepShow s={s} set={set} />
      case 2: return <StepVedetos s={s} set={set} />
      case 3: return <StepLugar s={s} set={set} />
      case 4: return <StepExtras s={s} set={set} />
      case 5: return <Ticket s={s} q={q} onWa={onWa} onShare={onShare} />
    }
  }

  return (
    <div className="flex flex-col" style={{ minHeight: 'min(640px, 80dvh)' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/8 shrink-0">
        <div>
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]/70">
            {STEPS[step]}
          </p>
          <p className="font-sans text-[11px] text-white/25 mt-0.5">
            Paso {step + 1} de {TOTAL}
          </p>
        </div>
        <StepDots step={step} count={TOTAL} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6" key={step}>
        {renderStep()}
      </div>

      {/* Bottom bar */}
      <div
        className="shrink-0 px-5 py-4 border-t border-white/8"
        style={{ background: 'linear-gradient(to top, #110d19 0%, rgba(17,13,25,0.95) 100%)' }}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-sans text-[10px] text-white/30">Cada una pone</p>
            <p className="font-serif text-xl font-bold" style={GOLD_TEXT}>{clp(q.perPerson)}</p>
          </div>

          <div className="flex gap-2">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="h-11 px-4 rounded-xl border border-white/12 font-sans text-sm text-white/45 hover:border-white/25 hover:text-white/65 transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Atrás
              </button>
            )}
            {step < TOTAL - 1 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="btn-gold-pulse h-11 px-5 rounded-xl font-sans text-sm font-bold text-[#0e0a18] flex items-center gap-1.5"
                style={GOLD_BTN}
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onWa}
                className="btn-gold-pulse h-11 px-5 rounded-xl font-sans text-sm font-bold text-[#0e0a18] flex items-center gap-1.5"
                style={GOLD_BTN}
              >
                <MessageCircle className="h-4 w-4" />
                Reservar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Desktop layout ───────────────────────────────────────────────────────────

function DesktopLayout({ s, set, q }: { s: QS; set: (p: Partial<QS>) => void; q: Quote }) {
  const [step, setStep] = useState(0)
  const TOTAL = 5

  const onWa = () => {
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(buildWaText(s))}`, '_blank')
  }

  const onShare = async () => {
    const text = buildShareText(s)
    if (navigator.share) {
      try { await navigator.share({ title: 'Despedida Luxx', text }) } catch {}
    } else {
      try { await navigator.clipboard.writeText(text) } catch {}
    }
  }

  const renderStep = () => {
    switch (step) {
      case 0: return <StepAmigas s={s} set={set} />
      case 1: return <StepShow s={s} set={set} />
      case 2: return <StepVedetos s={s} set={set} />
      case 3: return <StepLugar s={s} set={set} />
      case 4: return <StepExtras s={s} set={set} />
    }
  }

  return (
    <div className="grid gap-6" style={{ gridTemplateColumns: '200px 1fr 340px' }}>
      {/* Left nav */}
      <div className="space-y-1 pt-1">
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.35em] text-white/25 mb-5 px-3">
          Pasos
        </p>
        {STEPS.slice(0, TOTAL).map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setStep(i)}
            className={`w-full text-left px-3 py-2.5 rounded-xl font-sans text-sm transition-all flex items-center gap-3 ${
              step === i
                ? 'bg-[#D4AF37]/12 text-[#D4AF37]'
                : i < step
                ? 'text-white/45 hover:text-white/65 hover:bg-white/[0.03]'
                : 'text-white/25 hover:text-white/40'
            }`}
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-all ${
                i < step
                  ? 'bg-[#D4AF37] text-[#0e0a18]'
                  : step === i
                  ? 'bg-[#D4AF37]/18 text-[#D4AF37] border border-[#D4AF37]/45'
                  : 'bg-white/5 text-white/20'
              }`}
            >
              {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </span>
            {label}
          </button>
        ))}
      </div>

      {/* Center panel */}
      <div
        className="rounded-2xl border border-white/8 p-8 overflow-y-auto"
        style={{ background: 'rgba(255,255,255,0.02)', maxHeight: 680 }}
        key={step}
      >
        {renderStep()}

        <div className="flex items-center gap-3 mt-8 pt-6 border-t border-white/8">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="h-11 px-5 rounded-xl border border-white/12 font-sans text-sm text-white/45 hover:border-white/25 hover:text-white/65 transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Atrás
            </button>
          )}
          {step < TOTAL - 1 && (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="btn-gold-pulse ml-auto h-11 px-6 rounded-xl font-sans text-sm font-bold text-[#0e0a18] flex items-center gap-2"
              style={GOLD_BTN}
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Right ticket (sticky) */}
      <div className="sticky top-28 self-start">
        <Ticket s={s} q={q} onWa={onWa} onShare={onShare} />
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function Cotizador() {
  const [s, setS] = useState<QS>(INIT)
  const set = useCallback((patch: Partial<QS>) => setS(prev => ({ ...prev, ...patch })), [])
  const q = useMemo(() => calcQuote(s), [s])

  return (
    <section className="relative px-4 sm:px-6 lg:px-8 pb-16">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
            <span className="text-white/45 font-sans text-[10px] font-semibold tracking-[0.4em] uppercase">
              Cotizador
            </span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
          </div>
          <h1
            className="gold-text-glow font-serif text-[clamp(2rem,5vw,3rem)] font-bold leading-tight"
            style={GOLD_TEXT}
          >
            ¿Cuánto pone cada una?
          </h1>
          <p className="text-white/40 font-sans text-sm sm:text-base mt-3 max-w-md mx-auto leading-relaxed">
            Ingresa los datos de tu despedida y calcula el precio por persona al instante.
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl border border-white/8 overflow-hidden"
          style={{
            background: 'rgba(17,13,25,0.85)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,175,55,0.06)',
          }}
        >
          {/* Mobile wizard */}
          <div className="lg:hidden">
            <MobileWizard s={s} set={set} q={q} />
          </div>
          {/* Desktop 3-column */}
          <div className="hidden lg:block p-8">
            <DesktopLayout s={s} set={set} q={q} />
          </div>
        </div>
      </div>
    </section>
  )
}
