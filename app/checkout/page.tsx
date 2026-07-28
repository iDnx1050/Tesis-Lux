'use client'

import { Suspense, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Check, CalendarDays, ChevronLeft, ChevronRight,
  User, Mail, Phone, MapPin, Home, Lock, ShieldCheck, Clock, CreditCard, Tag,
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { vedetos } from '@/lib/mock-data'
import { locationPricing } from '@/lib/regions'
import type { AvailabilitySlot } from '@/lib/types'

const EXTRA_PER_ARTIST = 60000
const clp = (n: number) => `$${n.toLocaleString('es-CL')}`

/* ────────────────────────────────────────────────────────────── */
/*  Página (wrapper con Suspense — requerido para useSearchParams)  */
/* ────────────────────────────────────────────────────────────── */
export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutFallback />}>
      <CheckoutContent />
    </Suspense>
  )
}

function CheckoutFallback() {
  return (
    <main className="min-h-screen bg-[#0e0a18] flex items-center justify-center">
      <div className="flex items-center gap-3 text-white/50 font-sans text-sm">
        <div className="w-4 h-4 rounded-full border-2 border-[#D4AF37]/40 border-t-[#D4AF37] animate-spin" />
        Cargando tu reserva…
      </div>
    </main>
  )
}

/* ────────────────────────────────────────────────────────────── */
/*  Contenido                                                       */
/* ────────────────────────────────────────────────────────────── */
function CheckoutContent() {
  const params = useSearchParams()

  const slug = params.get('slug') ?? ''
  const tierId = params.get('tier') ?? ''
  const regionId = params.get('region') ?? 'metropolitana'
  const communeName = params.get('commune') ?? 'Santiago'
  const extraSlugs = (params.get('extras') ?? '').split(',').map(s => s.trim()).filter(Boolean)

  const vedeto = vedetos.find(v => v.slug === slug)
  const tier = vedeto?.pricing.find(t => t.id === tierId) ?? vedeto?.pricing[0]
  const extraArtists = extraSlugs
    .map(s => vedetos.find(v => v.slug === s))
    .filter((v): v is NonNullable<typeof v> => Boolean(v))

  /* ── Formulario ── */
  const [form, setForm] = useState({
    nombre: '', email: '', telefono: '', direccion: '', numero: '',
  })
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  /* ── Cupón de descuento (validado en el servidor) ── */
  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [couponRate, setCouponRate] = useState(0)
  const [serverDiscount, setServerDiscount] = useState(0)
  const [couponError, setCouponError] = useState(false)
  const [couponLoading, setCouponLoading] = useState(false)

  // El código y la tasa del cupón viven solo en el servidor (lib/coupons.ts).
  // El cliente los envía a /api/checkout/quote y muestra el descuento calculado ahí.
  const applyCoupon = async () => {
    const code = couponInput.trim().toUpperCase()
    if (!code) return
    setCouponLoading(true)
    try {
      const res = await fetch('/api/checkout/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: vedeto?.slug,
          tierId: tier?.id,
          regionId,
          communeName,
          extras: extraSlugs,
          coupon: code,
        }),
      })
      const data = (await res.json())?.data
      if (data?.coupon) {
        setAppliedCoupon(data.coupon.code)
        setCouponRate(data.coupon.rate)
        setServerDiscount(data.discount)
        setCouponError(false)
      } else {
        setAppliedCoupon(null)
        setCouponRate(0)
        setServerDiscount(0)
        setCouponError(true)
      }
    } catch {
      setAppliedCoupon(null)
      setCouponRate(0)
      setServerDiscount(0)
      setCouponError(true)
    } finally {
      setCouponLoading(false)
    }
  }
  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponRate(0)
    setServerDiscount(0)
    setCouponInput('')
    setCouponError(false)
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
  const formComplete =
    form.nombre.trim().length > 2 &&
    emailValid &&
    form.telefono.trim().length >= 8 &&
    form.direccion.trim().length > 2 &&
    form.numero.trim().length > 0
  const dateComplete = Boolean(selectedDate && selectedTime)
  const readyToPay = formComplete && dateComplete

  const currentStep = !formComplete ? 1 : !dateComplete ? 2 : 3

  /* ── Precio ── */
  const pricing = useMemo(
    () => (tier ? locationPricing(tier.price, regionId, communeName) : null),
    [tier, regionId, communeName],
  )
  const extrasTotal = extraArtists.length * EXTRA_PER_ARTIST
  const subtotal = (pricing?.effective ?? 0) + extrasTotal
  // El descuento proviene del servidor (/api/checkout/quote), no se calcula aquí.
  const discount = appliedCoupon ? serverDiscount : 0
  const grandTotal = subtotal - discount

  /* ── Sin reserva válida ── */
  if (!vedeto || !tier || !pricing) {
    return (
      <main className="min-h-screen bg-[#0e0a18]">
        <Navbar />
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
          <p className="text-[#D4AF37] font-sans text-[11px] font-semibold tracking-[0.4em] uppercase mb-4">
            Reserva
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
            No hay una reserva seleccionada
          </h1>
          <p className="text-white/45 font-sans text-sm max-w-sm mx-auto leading-relaxed mb-8">
            Elige un artista y un plan para continuar con tu reserva.
          </p>
          <Link
            href="/vedetos"
            className="btn-gold-pulse inline-flex items-center gap-2 rounded-xl px-7 py-3.5 font-sans text-sm font-bold uppercase tracking-widest text-[#0e0a18]"
            style={{ background: 'linear-gradient(135deg, #ffe599 0%, #D4AF37 45%, #b8922e 100%)' }}
          >
            Ver artistas →
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0e0a18]">
      {/* Fondo ambiental morado */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-20 left-1/4 h-[420px] w-[420px] rounded-full bg-[#6b21a8]/18 blur-[130px]" />
        <div className="absolute top-1/3 right-0 h-[360px] w-[360px] rounded-full bg-[#4c1d95]/20 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-[#D4AF37]/6 blur-[110px]" />
      </div>

      <Navbar />

      <section className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 pt-28 md:pt-32 pb-20">

        {/* Volver */}
        <Link
          href={`/vedetos/${vedeto.slug}`}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 font-sans text-xs text-white/70 transition-all duration-300 hover:border-[#D4AF37]/45 hover:text-[#D4AF37]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver al perfil
        </Link>

        {/* Encabezado */}
        <div className="mb-8">
          <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.4em] text-[#D4AF37]">
            Finaliza tu reserva
          </p>
          <h1 className="font-serif text-[clamp(2.2rem,5vw,3.4rem)] font-bold leading-tight text-white">
            Casi listo para la fiesta
          </h1>
        </div>

        {/* Pasos */}
        <Steps current={currentStep} />

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1fr_400px]">

          {/* ── COLUMNA IZQUIERDA ── */}
          <div className="space-y-6">

            {/* Datos del cliente */}
            <Card>
              <CardHeader
                step="1"
                title="Tus datos"
                subtitle="Con quién coordinamos el evento"
                done={formComplete}
              />
              <div className="grid gap-4 p-5 sm:grid-cols-2">
                <Field
                  className="sm:col-span-2"
                  icon={User}
                  label="Nombre completo"
                  placeholder="Ej. Camila Fernández"
                  value={form.nombre}
                  onChange={set('nombre')}
                />
                <Field
                  icon={Mail}
                  label="Correo electrónico"
                  type="email"
                  placeholder="tucorreo@email.com"
                  value={form.email}
                  onChange={set('email')}
                  error={form.email.length > 0 && !emailValid ? 'Correo no válido' : undefined}
                />
                <Field
                  icon={Phone}
                  label="Teléfono / WhatsApp"
                  type="tel"
                  placeholder="+56 9 1234 5678"
                  value={form.telefono}
                  onChange={set('telefono')}
                />
                <Field
                  className="sm:col-span-2"
                  icon={Home}
                  label="Dirección del evento"
                  placeholder="Ej. Av. Providencia 1234"
                  value={form.direccion}
                  onChange={set('direccion')}
                />
                <Field
                  icon={MapPin}
                  label="N° / Depto / Casa"
                  placeholder="Ej. Depto 502"
                  value={form.numero}
                  onChange={set('numero')}
                />
                <div className="flex flex-col justify-end">
                  <span className="mb-1.5 block font-sans text-[11px] tracking-wide text-white/40">Comuna</span>
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <MapPin className="h-4 w-4 flex-shrink-0 text-[#D4AF37]/70" />
                    <span className="truncate font-sans text-sm text-white/80">
                      {pricing.commune?.name ?? communeName}, {pricing.region.name}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Calendario de disponibilidad */}
            <Card>
              <CardHeader
                step="2"
                title="Fecha y hora"
                subtitle="Disponibilidad del artista"
                done={dateComplete}
              />
              <div className="p-5">
                <AvailabilityCalendar
                  availability={vedeto.availability}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onSelectDate={(d) => { setSelectedDate(d); setSelectedTime(null) }}
                  onSelectTime={setSelectedTime}
                />
                {/* Marco: integración futura */}
                <div className="mt-4 flex items-start gap-2 rounded-lg border border-[#6b21a8]/25 bg-[#6b21a8]/10 px-3 py-2.5">
                  <CalendarDays className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#c4a4f5]" />
                  <p className="font-sans text-[11px] leading-relaxed text-[#c4a4f5]/90">
                    Disponibilidad sincronizada en tiempo real con <strong>Google Calendar</strong>
                    <span className="text-[#c4a4f5]/60"> · integración pendiente</span>
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* ── COLUMNA DERECHA: RESUMEN ── */}
          <div className="lg:sticky lg:top-28 space-y-4">
            <div
              className="overflow-hidden rounded-2xl border border-[#D4AF37]/20"
              style={{
                background: 'linear-gradient(165deg, rgba(44,21,72,0.92), rgba(14,10,24,0.97))',
                boxShadow: '0 30px 70px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.03)',
              }}
            >
              {/* Artista principal */}
              <div className="flex items-center gap-4 border-b border-white/8 p-5">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl ring-1 ring-[#D4AF37]/40">
                  <Image src={vedeto.image} alt={vedeto.name} fill sizes="64px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
                    Tu reserva
                  </p>
                  <h3 className="truncate font-serif text-xl font-bold text-white">{vedeto.name}</h3>
                  <p className="truncate font-sans text-xs text-white/45">{tier.name}</p>
                </div>
              </div>

              {/* Artistas adicionales */}
              {extraArtists.length > 0 && (
                <div className="border-b border-white/8 p-5">
                  <p className="mb-3 font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-white/40">
                    Artistas adicionales
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {extraArtists.map(a => (
                      <div key={a.slug} className="flex items-center gap-2">
                        <div className="relative h-8 w-8 overflow-hidden rounded-full ring-1 ring-white/15">
                          <Image src={a.image} alt={a.name} fill sizes="32px" className="object-cover" />
                        </div>
                        <span className="font-sans text-xs text-white/70">{a.name.split(' ')[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detalle de precio */}
              <div className="space-y-2.5 p-5">
                <Row k="Ubicación" v={`${pricing.commune?.name ?? communeName}, ${pricing.region.name}`} small />
                {(selectedDate || selectedTime) && (
                  <Row
                    k="Fecha"
                    v={
                      selectedDate
                        ? `${formatDateLong(selectedDate)}${selectedTime ? ` · ${selectedTime}` : ''}`
                        : '—'
                    }
                    small
                  />
                )}

                <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
                  <Row k={tier.name} v={clp(tier.price)} />
                  {pricing.zoneCharge !== 0 && (
                    <Row
                      k="Cargo por zona"
                      v={`${pricing.zoneCharge > 0 ? '+' : '-'}${clp(Math.abs(pricing.zoneCharge))}`}
                    />
                  )}
                  {pricing.communeSurcharge > 0 && (
                    <Row k={`Recargo ${pricing.commune?.name}`} v={`+${clp(pricing.communeSurcharge)}`} />
                  )}
                  {extraArtists.map(a => (
                    <Row key={a.slug} k={`+ ${a.name.split(' ')[0]}`} v={clp(EXTRA_PER_ARTIST)} />
                  ))}
                  {appliedCoupon && (
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-1.5 font-sans text-xs text-[#25D366]">
                        <Check className="h-3 w-3" />
                        Descuento {appliedCoupon} ({Math.round(couponRate * 100)}%)
                      </span>
                      <span className="font-sans text-xs font-medium text-[#25D366]">
                        −{clp(discount)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Cupón de descuento */}
                <div className="mt-4 border-t border-white/10 pt-4">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 px-3.5 py-2.5">
                      <div className="flex items-center gap-2">
                        <Tag className="h-3.5 w-3.5 text-[#25D366]" />
                        <span className="font-sans text-xs font-semibold text-white">{appliedCoupon}</span>
                        <span className="font-sans text-[11px] text-white/50">aplicado</span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="font-sans text-[11px] text-white/45 underline underline-offset-2 transition-colors hover:text-white/80"
                      >
                        Quitar
                      </button>
                    </div>
                  ) : (
                    <>
                      <label className="mb-1.5 block font-sans text-[11px] tracking-wide text-white/40">
                        ¿Tienes un cupón?
                      </label>
                      <div className="flex gap-2">
                        <div
                          className={`flex flex-1 items-center gap-2 rounded-xl border bg-white/[0.03] px-3.5 py-2.5 transition-colors focus-within:border-[#D4AF37]/50 ${
                            couponError ? 'border-red-400/40' : 'border-white/10'
                          }`}
                        >
                          <Tag className="h-3.5 w-3.5 flex-shrink-0 text-white/35" />
                          <input
                            value={couponInput}
                            onChange={e => { setCouponInput(e.target.value); setCouponError(false) }}
                            onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                            placeholder="Ej. LUXX10"
                            className="w-full bg-transparent font-sans text-sm uppercase tracking-wider text-white placeholder:normal-case placeholder:tracking-normal placeholder:text-white/25 focus:outline-none"
                          />
                        </div>
                        <button
                          onClick={applyCoupon}
                          disabled={!couponInput.trim() || couponLoading}
                          className="flex-shrink-0 rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 font-sans text-xs font-bold uppercase tracking-wider text-[#D4AF37] transition-all hover:bg-[#D4AF37]/20 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          {couponLoading ? '…' : 'Aplicar'}
                        </button>
                      </div>
                      {couponError && (
                        <p className="mt-1.5 font-sans text-[10px] text-red-400/80">
                          Cupón no válido o expirado.
                        </p>
                      )}
                    </>
                  )}
                </div>

                <div className="mt-4 flex items-end justify-between border-t border-white/10 pt-3">
                  <span className="font-sans text-sm font-semibold text-white">Total</span>
                  <div className="text-right">
                    {discount > 0 && (
                      <span className="mr-2 font-sans text-sm text-white/35 line-through">
                        {clp(subtotal)}
                      </span>
                    )}
                    <span className="font-serif text-3xl font-bold leading-none text-[#D4AF37]">
                      {clp(grandTotal)}
                    </span>
                    {pricing.region.flight && (
                      <p className="mt-1 font-sans text-[9px] text-amber-300/60">+ pasajes aéreos aparte</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Pago / Transbank (marco) */}
              <div className="p-5 pt-0">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="ok"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 p-4 text-center"
                    >
                      <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366]/20">
                        <Check className="h-4 w-4 text-[#25D366]" />
                      </div>
                      <p className="font-sans text-sm font-semibold text-white">Datos recibidos</p>
                      <p className="mt-1 font-sans text-[11px] leading-relaxed text-white/55">
                        Aquí se conectará la pasarela <strong>Transbank Webpay</strong> para procesar
                        el pago de forma segura.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="pay"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      /* TODO: integrar Transbank Webpay Plus — iniciar transacción aquí */
                      onClick={() => readyToPay && setSubmitted(true)}
                      disabled={!readyToPay}
                      className={`flex w-full items-center justify-center gap-2.5 rounded-xl px-4 py-4 font-sans text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
                        readyToPay
                          ? 'btn-gold-pulse text-[#0e0a18]'
                          : 'cursor-not-allowed border border-white/10 bg-white/5 text-white/30'
                      }`}
                      style={
                        readyToPay
                          ? {
                              background: 'linear-gradient(135deg, #ffe599 0%, #D4AF37 45%, #b8922e 100%)',
                              boxShadow: '0 0 18px rgba(212,175,55,0.5), 0 0 40px rgba(212,175,55,0.25)',
                            }
                          : undefined
                      }
                    >
                      <CreditCard className="h-4 w-4 flex-shrink-0" />
                      {readyToPay ? 'Pagar con Transbank' : 'Completa tus datos'}
                    </motion.button>
                  )}
                </AnimatePresence>

                {!submitted && !readyToPay && (
                  <p className="mt-3 text-center font-sans text-[11px] text-white/35">
                    {!formComplete ? 'Completa tus datos' : 'Elige fecha y hora del evento'}
                  </p>
                )}

                {/* Sello de seguridad */}
                <div className="mt-4 flex items-center justify-center gap-1.5 text-white/35">
                  <Lock className="h-3 w-3" />
                  <span className="font-sans text-[10px] tracking-wide">
                    Pago protegido con Transbank Webpay
                  </span>
                </div>
              </div>
            </div>

            {/* Confianza */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: ShieldCheck, t: 'Reserva garantizada' },
                { icon: Clock, t: 'Respuesta < 1 hora' },
              ].map(({ icon: Icon, t }) => (
                <div
                  key={t}
                  className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5"
                >
                  <Icon className="h-4 w-4 flex-shrink-0 text-[#D4AF37]/70" />
                  <span className="font-sans text-[11px] leading-tight text-white/55">{t}</span>
                </div>
              ))}
            </div>

            <p className="px-1 text-center font-sans text-[10px] leading-relaxed text-white/30">
              Al pagar aceptas nuestros{' '}
              <Link href="/terminos" target="_blank" className="underline underline-offset-2 hover:text-white/50">
                términos y condiciones
              </Link>{' '}
              y la{' '}
              <Link href="/privacidad" target="_blank" className="underline underline-offset-2 hover:text-white/50">
                política de privacidad
              </Link>.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

/* ────────────────────────────────────────────────────────────── */
/*  Sub-componentes                                                 */
/* ────────────────────────────────────────────────────────────── */

function Steps({ current }: { current: number }) {
  const steps = [
    { n: 1, label: 'Datos' },
    { n: 2, label: 'Fecha' },
    { n: 3, label: 'Pago' },
  ]
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {steps.map((s, i) => {
        const active = current === s.n
        const done = current > s.n
        return (
          <div key={s.n} className="flex flex-1 items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border font-sans text-xs font-bold transition-all duration-300 ${
                  done
                    ? 'border-[#D4AF37] bg-[#D4AF37] text-[#0e0a18]'
                    : active
                      ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#D4AF37]'
                      : 'border-white/15 bg-white/5 text-white/40'
                }`}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : s.n}
              </div>
              <span
                className={`font-sans text-xs font-medium transition-colors duration-300 ${
                  active || done ? 'text-white' : 'text-white/40'
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
            )}
          </div>
        )
      })}
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm">
      {children}
    </div>
  )
}

function CardHeader({
  step, title, subtitle, done,
}: { step: string; title: string; subtitle: string; done: boolean }) {
  return (
    <div className="flex items-center gap-3 border-b border-white/8 px-5 py-4">
      <div
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border font-sans text-sm font-bold transition-colors duration-300 ${
          done
            ? 'border-[#D4AF37] bg-[#D4AF37] text-[#0e0a18]'
            : 'border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]'
        }`}
      >
        {done ? <Check className="h-4 w-4" /> : step}
      </div>
      <div>
        <h2 className="font-serif text-lg leading-tight text-white">{title}</h2>
        <p className="font-sans text-xs text-white/40">{subtitle}</p>
      </div>
    </div>
  )
}

function Field({
  icon: Icon, label, error, className = '', ...props
}: {
  icon: React.ElementType
  label: string
  error?: string
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <label className="mb-1.5 block font-sans text-[11px] tracking-wide text-white/40">{label}</label>
      <div
        className={`flex items-center gap-2.5 rounded-xl border bg-white/[0.03] px-4 py-3 transition-colors duration-200 focus-within:border-[#D4AF37]/50 ${
          error ? 'border-red-400/40' : 'border-white/10'
        }`}
      >
        <Icon className="h-4 w-4 flex-shrink-0 text-white/35" />
        <input
          {...props}
          className="w-full bg-transparent font-sans text-sm text-white placeholder:text-white/25 focus:outline-none"
        />
      </div>
      {error && <p className="mt-1 font-sans text-[10px] text-red-400/80">{error}</p>}
    </div>
  )
}

function Row({ k, v, small }: { k: string; v: string; small?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={`font-sans ${small ? 'text-xs text-white/45' : 'text-xs text-white/48'}`}>{k}</span>
      <span className={`text-right font-sans font-medium ${small ? 'text-xs text-white/75' : 'text-xs text-white/75'}`}>
        {v}
      </span>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────── */
/*  Calendario de disponibilidad                                    */
/* ────────────────────────────────────────────────────────────── */

const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

function ymd(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function formatDateLong(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('es-CL', {
    weekday: 'long', day: 'numeric', month: 'long',
  })
}

function AvailabilityCalendar({
  availability, selectedDate, selectedTime, onSelectDate, onSelectTime,
}: {
  availability: AvailabilitySlot[]
  selectedDate: string | null
  selectedTime: string | null
  onSelectDate: (d: string) => void
  onSelectTime: (t: string) => void
}) {
  const availMap = useMemo(
    () => new Map(availability.map(s => [s.date, s])),
    [availability],
  )

  // Rango navegable: del primer al último día con datos
  const bounds = useMemo(() => {
    if (availability.length === 0) return null
    const parse = (s: string) => { const [y, m] = s.split('-').map(Number); return y * 12 + (m - 1) }
    const first = availability[0].date
    const last = availability[availability.length - 1].date
    const [fy, fm] = first.split('-').map(Number)
    return { min: parse(first), max: parse(last), startYear: fy, startMonth: fm - 1 }
  }, [availability])

  const [view, setView] = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  })

  const viewIndex = view.year * 12 + view.month
  const canPrev = bounds ? viewIndex > bounds.min : false
  const canNext = bounds ? viewIndex < bounds.max : false

  const shift = (delta: number) => {
    setView(v => {
      const idx = v.year * 12 + v.month + delta
      return { year: Math.floor(idx / 12), month: ((idx % 12) + 12) % 12 }
    })
  }

  const today = new Date()
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()

  const firstWeekday = (new Date(view.year, view.month, 1).getDay() + 6) % 7 // Lunes primero
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()

  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const times = selectedDate ? (availMap.get(selectedDate)?.times ?? []) : []

  return (
    <div>
      {/* Cabecera de mes */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => shift(-1)}
          disabled={!canPrev}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/60 transition-colors hover:border-[#D4AF37]/40 hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-25"
          aria-label="Mes anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="font-serif text-base text-white">
          {MONTHS[view.month]} {view.year}
        </span>
        <button
          onClick={() => shift(1)}
          disabled={!canNext}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/60 transition-colors hover:border-[#D4AF37]/40 hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-25"
          aria-label="Mes siguiente"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Días de la semana */}
      <div className="mb-2 grid grid-cols-7 gap-1.5">
        {WEEKDAYS.map((d, i) => (
          <div key={i} className="text-center font-sans text-[10px] font-semibold uppercase text-white/30">
            {d}
          </div>
        ))}
      </div>

      {/* Rejilla de días */}
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((day, i) => {
          if (day === null) return <div key={`e${i}`} />
          const key = ymd(view.year, view.month, day)
          const slot = availMap.get(key)
          const dayTime = new Date(view.year, view.month, day).getTime()
          const isPast = dayTime < todayMidnight
          const available = Boolean(slot?.available) && !isPast
          const isSelected = key === selectedDate

          return (
            <button
              key={key}
              disabled={!available}
              onClick={() => available && onSelectDate(key)}
              className={`relative aspect-square rounded-lg font-sans text-sm transition-all duration-200 ${
                isSelected
                  ? 'bg-[#D4AF37] font-bold text-[#0e0a18] shadow-[0_0_16px_rgba(212,175,55,0.5)]'
                  : available
                    ? 'border border-[#D4AF37]/20 bg-[#D4AF37]/[0.06] text-white hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/15'
                    : 'text-white/20 cursor-not-allowed'
              }`}
            >
              {day}
              {available && !isSelected && (
                <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#D4AF37]/70" />
              )}
            </button>
          )
        })}
      </div>

      {/* Leyenda */}
      <div className="mt-4 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#D4AF37]/70" />
          <span className="font-sans text-[10px] text-white/40">Disponible</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="font-sans text-[10px] text-white/40">No disponible</span>
        </div>
      </div>

      {/* Horarios */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-5 border-t border-white/8 pt-4">
              <p className="mb-3 font-sans text-xs text-white/50">
                Horarios para <span className="text-[#D4AF37]">{formatDateLong(selectedDate)}</span>
              </p>
              {times.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {times.map(t => (
                    <button
                      key={t}
                      onClick={() => onSelectTime(t)}
                      className={`flex items-center gap-1.5 rounded-lg border px-3.5 py-2 font-sans text-sm transition-all duration-200 ${
                        selectedTime === t
                          ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#D4AF37]'
                          : 'border-white/12 bg-white/[0.03] text-white/70 hover:border-white/30'
                      }`}
                    >
                      <Clock className="h-3.5 w-3.5" />
                      {t}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="font-sans text-xs text-white/35">No hay horarios disponibles este día.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
