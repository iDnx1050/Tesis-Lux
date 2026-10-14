import type { Metadata } from 'next'
import Link from 'next/link'
import { AlertTriangle, Check, Clock, FlaskConical, X } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { isDatabaseConfigured } from '@/lib/db'
import { BUY_ORDER_RE, findOrderByBuyOrder, type Order } from '@/lib/orders'
import { paymentTypeLabel } from '@/lib/webpay'
import { vedetos } from '@/lib/mock-data'
import { findRegion } from '@/lib/regions'
import { logError } from '@/lib/logger'

// Página de resultado del comercio (requisito de Webpay Plus REST): Transbank
// ya no muestra comprobante, así que al volver de Webpay la clienta ve aquí si
// el pago fue aprobado o no, con los datos mínimos que pide Transbank.
export const metadata: Metadata = {
  title: 'Resultado del pago | Luxx Producciones',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

const MERCHANT_NAME = 'Luxx Producciones'
const clp = (n: number) => `$${n.toLocaleString('es-CL')}`

export default async function PaymentResultPage({
  searchParams,
}: {
  searchParams: Promise<{ orden?: string | string[] }>
}) {
  const { orden } = await searchParams
  const order = await loadOrder(typeof orden === 'string' ? orden : null)

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0e0a18]">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-20 left-1/4 h-[420px] w-[420px] rounded-full bg-[#6b21a8]/18 blur-[130px]" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-[#D4AF37]/6 blur-[110px]" />
      </div>

      <Navbar />

      <section className="relative z-10 mx-auto max-w-2xl px-4 sm:px-6 pt-28 md:pt-32 pb-20">
        {order ? <OrderResult order={order} /> : <UnknownOrder />}
      </section>

      <Footer />
    </main>
  )
}

async function loadOrder(buyOrder: string | null): Promise<Order | null> {
  // La orden de compra es aleatoria (100 bits): conocerla es lo que habilita
  // ver el comprobante. Se valida el formato antes de consultar.
  if (!buyOrder || !BUY_ORDER_RE.test(buyOrder) || !isDatabaseConfigured()) return null
  try {
    return await findOrderByBuyOrder(buyOrder)
  } catch (err) {
    logError('No se pudo leer la orden para la página de resultado', {
      buyOrder,
      error: err instanceof Error ? err.message : String(err),
    })
    return null
  }
}

// ─── Resultado por estado ────────────────────────────────────────────────────

function OrderResult({ order }: { order: Order }) {
  const testBadge = order.environment === 'integration' && (
    <div className="mb-6 flex items-start gap-2 rounded-xl border border-[#c4a4f5]/25 bg-[#6b21a8]/15 px-4 py-3">
      <FlaskConical className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#c4a4f5]" />
      <p className="font-sans text-xs leading-relaxed text-[#c4a4f5]">
        Transacción de prueba (ambiente de integración de Transbank). No se realizó ningún
        cargo real y la reserva no queda agendada.
      </p>
    </div>
  )

  if (order.status === 'AUTHORIZED') {
    return (
      <>
        {testBadge}
        <Header
          tone="ok"
          title="¡Pago aprobado!"
          subtitle="Tu reserva quedó confirmada. Te contactaremos por WhatsApp o correo para coordinar los detalles del show."
        />
        <Voucher order={order} />
        <p className="mt-4 text-center font-sans text-[11px] text-white/40">
          Guarda este comprobante: el número de orden identifica tu reserva.
        </p>
        <Actions primary={{ href: '/', label: 'Volver al inicio' }} />
      </>
    )
  }

  if (order.status === 'REJECTED') {
    return (
      <>
        {testBadge}
        <Header tone="error" title={`Orden de Compra ${order.buyOrder} rechazada`} />
        <Panel>
          <p className="mb-3 font-sans text-sm text-white/70">Las posibles causas de este rechazo son:</p>
          <ul className="list-disc space-y-1.5 pl-5 font-sans text-sm text-white/60">
            <li>Error en el ingreso de los datos de su tarjeta de crédito o débito (fecha y/o código de seguridad).</li>
            <li>Su tarjeta de crédito o débito no cuenta con saldo suficiente.</li>
            <li>Tarjeta aún no habilitada en el sistema financiero.</li>
          </ul>
        </Panel>
        <Actions primary={{ href: retryHref(order), label: 'Intentar nuevamente' }} secondary />
      </>
    )
  }

  const closed: Record<string, { tone: Tone; title: string; text: string }> = {
    ABORTED: {
      tone: 'neutral',
      title: 'Pago anulado',
      text: 'Anulaste el pago en Webpay. No se realizó ningún cargo y el horario quedó libre.',
    },
    TIMEOUT: {
      tone: 'neutral',
      title: 'Se agotó el tiempo para pagar',
      text: 'El formulario de pago expiró antes de completarse. No se realizó ningún cargo.',
    },
    FAILED: {
      tone: 'error',
      title: 'No se pudo completar el pago',
      text: 'Ocurrió un error durante el pago. No se realizó ningún cargo.',
    },
    REVERSED: {
      tone: 'error',
      title: 'Pago anulado',
      text: 'No pudimos validar tu pago, así que lo anulamos. Si ves un cargo en tu cuenta, se reversará automáticamente.',
    },
  }

  const info = closed[order.status]
  if (info) {
    return (
      <>
        {testBadge}
        <Header tone={info.tone} title={info.title} subtitle={info.text} />
        <Panel>
          <Row k="Orden de compra" v={order.buyOrder} />
        </Panel>
        <Actions primary={{ href: retryHref(order), label: 'Intentar nuevamente' }} secondary />
      </>
    )
  }

  // PENDING: Transbank no respondió al confirmar.
  return (
    <>
      {testBadge}
      <Header
        tone="pending"
        title="Estamos verificando tu pago"
        subtitle="Aún no recibimos la confirmación de Transbank. Si se realizó un cargo, te contactaremos para confirmar tu reserva."
      />
      <Panel>
        <Row k="Orden de compra" v={order.buyOrder} />
        <Row k="Monto" v={`${clp(order.amount)} CLP`} />
      </Panel>
      <Actions primary={{ href: '/', label: 'Volver al inicio' }} />
    </>
  )
}

function UnknownOrder() {
  return (
    <>
      <Header
        tone="neutral"
        title="No encontramos esta orden"
        subtitle="Si realizaste un pago, escríbenos indicando tu número de orden y lo revisamos."
      />
      <Actions primary={{ href: '/vedetos', label: 'Ver artistas' }} />
    </>
  )
}

// ─── Comprobante ─────────────────────────────────────────────────────────────

function Voucher({ order }: { order: Order }) {
  const installments = order.installmentsNumber ?? 0
  return (
    <Panel>
      <Row k="Orden de compra" v={order.buyOrder} />
      <Row k="Comercio" v={MERCHANT_NAME} />
      <Row k="Monto" v={`${clp(order.amount)} CLP`} strong />
      <Row k="Código de autorización" v={order.authorizationCode ?? '—'} />
      <Row k="Fecha de la transacción" v={formatTransactionDate(order.transactionDate)} />
      <Row k="Tipo de pago" v={paymentTypeLabel(order.paymentTypeCode)} />
      <Row
        k="Cuotas"
        v={
          installments > 0
            ? `${installments}${order.installmentsAmount ? ` de ${clp(order.installmentsAmount)}` : ''}`
            : 'Sin cuotas'
        }
      />
      <Row k="Tarjeta" v={order.cardLast4 ? `**** ${order.cardLast4}` : '—'} />
      <Row k="Servicio" v={describeService(order)} />
    </Panel>
  )
}

function describeService(order: Order): string {
  const vedeto = vedetos.find((v) => v.slug === order.vedetoSlug)
  const tier = vedeto?.pricing.find((t) => t.id === order.tierId)
  const extras = order.extras.map((slug) => vedetos.find((v) => v.slug === slug)?.name ?? slug)
  const artists = [vedeto?.name ?? order.vedetoSlug, ...extras].join(', ')
  const region = findRegion(order.regionId)
  const flights = region.flight ? ' (pasajes aéreos aparte)' : ''
  return `${tier?.name ?? 'Show'} con ${artists} — ${formatEventDate(order.eventDate)} a las ${order.eventTime} hrs, ${order.communeName}${flights}`
}

function formatEventDate(date: string): string {
  // Mediodía UTC: el día no se corre al formatear en cualquier zona horaria.
  return new Date(`${date}T12:00:00Z`).toLocaleDateString('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

function formatTransactionDate(date: Date | null): string {
  if (!date) return '—'
  return date.toLocaleString('es-CL', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  })
}

/** Vuelve al checkout con la misma selección para reintentar el pago. */
function retryHref(order: Order): string {
  const params = new URLSearchParams({
    slug: order.vedetoSlug,
    tier: order.tierId,
    region: order.regionId,
    commune: order.communeName,
  })
  if (order.extras.length > 0) params.set('extras', order.extras.join(','))
  return `/checkout?${params.toString()}`
}

// ─── Piezas de UI ────────────────────────────────────────────────────────────

type Tone = 'ok' | 'error' | 'neutral' | 'pending'

const TONES: Record<Tone, { icon: typeof Check; ring: string; text: string }> = {
  ok: { icon: Check, ring: 'border-[#25D366]/40 bg-[#25D366]/15', text: 'text-[#25D366]' },
  error: { icon: X, ring: 'border-[#E5484D]/40 bg-[#E5484D]/15', text: 'text-[#E5484D]' },
  neutral: { icon: AlertTriangle, ring: 'border-[#E8A33D]/40 bg-[#E8A33D]/15', text: 'text-[#E8A33D]' },
  pending: { icon: Clock, ring: 'border-[#D4AF37]/40 bg-[#D4AF37]/15', text: 'text-[#D4AF37]' },
}

function Header({ tone, title, subtitle }: { tone: Tone; title: string; subtitle?: string }) {
  const { icon: Icon, ring, text } = TONES[tone]
  return (
    <div className="mb-8 text-center">
      <div className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border ${ring}`}>
        <Icon className={`h-7 w-7 ${text}`} />
      </div>
      <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.4em] text-[#D4AF37]">
        Resultado del pago
      </p>
      <h1 className="font-serif text-[clamp(1.8rem,5vw,2.6rem)] font-bold leading-tight text-white">{title}</h1>
      {subtitle && (
        <p className="mx-auto mt-3 max-w-md font-sans text-sm leading-relaxed text-white/55">{subtitle}</p>
      )}
    </div>
  )
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="space-y-3 rounded-2xl border border-[#D4AF37]/20 p-5 sm:p-6"
      style={{ background: 'linear-gradient(165deg, rgba(44,21,72,0.92), rgba(14,10,24,0.97))' }}
    >
      {children}
    </div>
  )
}

function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] pb-3 last:border-b-0 last:pb-0">
      <span className="flex-shrink-0 font-sans text-xs text-white/45">{k}</span>
      <span
        className={`text-right font-sans ${strong ? 'text-base font-bold text-[#D4AF37]' : 'text-xs font-medium text-white/80'}`}
      >
        {v}
      </span>
    </div>
  )
}

function Actions({
  primary,
  secondary,
}: {
  primary: { href: string; label: string }
  secondary?: boolean
}) {
  return (
    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
      <Link
        href={primary.href}
        className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 font-sans text-sm font-bold uppercase tracking-widest text-[#0e0a18]"
        style={{ background: 'linear-gradient(135deg, #ffe599 0%, #D4AF37 45%, #b8922e 100%)' }}
      >
        {primary.label}
      </Link>
      {secondary && (
        <Link
          href="/"
          className="font-sans text-xs text-white/50 underline underline-offset-4 transition-colors hover:text-white/80"
        >
          Volver al inicio
        </Link>
      )}
    </div>
  )
}
