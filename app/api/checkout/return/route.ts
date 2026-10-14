import { NextResponse } from 'next/server'
import { isDatabaseConfigured } from '@/lib/db'
import {
  BUY_ORDER_RE,
  closeOrder,
  findOrderByBuyOrder,
  findOrderByToken,
  setCalendarEventId,
  type Order,
} from '@/lib/orders'
import {
  commitTransaction,
  getTransactionStatus,
  isApproved,
  isValidToken,
  refundTransaction,
  type TransactionResult,
} from '@/lib/webpay'
import { createBookingEvent, isCalendarConfigured } from '@/lib/google-calendar'
import { vedetos } from '@/lib/mock-data'
import { getClientIp, hashIp } from '@/lib/get-client-ip'
import { logError, logInfo, logSecurityEvent, logWarn } from '@/lib/logger'

// return_url de Webpay Plus. Transbank devuelve aquí a la clienta, por GET o
// por POST según el caso, con uno de estos juegos de parámetros:
//   - token_ws                                → flujo normal: se confirma (commit)
//   - TBK_TOKEN + TBK_ORDEN_COMPRA + TBK_ID_SESION → la clienta anuló el pago
//   - TBK_ORDEN_COMPRA + TBK_ID_SESION         → se agotó el tiempo del formulario
//   - token_ws + TBK_TOKEN + …                 → error en el formulario de pago
// En los tres últimos casos NO se llama a commit. Siempre se termina
// redirigiendo a la página de resultado.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  return handleReturn(req, new URL(req.url).searchParams)
}

export async function POST(req: Request) {
  const params = new URLSearchParams(new URL(req.url).search)
  try {
    const form = await req.formData()
    for (const [key, value] of form) {
      if (typeof value === 'string') params.set(key, value)
    }
  } catch {
    // Sin cuerpo de formulario: quedan solo los parámetros de la URL.
  }
  return handleReturn(req, params)
}

async function handleReturn(req: Request, params: URLSearchParams): Promise<Response> {
  const ipHash = hashIp(getClientIp(req))
  const tokenWs = params.get('token_ws')
  const tbkToken = params.get('TBK_TOKEN')
  const tbkOrder = params.get('TBK_ORDEN_COMPRA')
  const tbkSession = params.get('TBK_ID_SESION')

  if (!isDatabaseConfigured()) {
    logError('Retorno de Webpay sin base de datos configurada', {})
    return redirectToResult(req, null)
  }

  try {
    if (tokenWs && !tbkToken) {
      return redirectToResult(req, await confirmPayment(tokenWs, ipHash))
    }

    if (tbkOrder && tbkSession) {
      const status = tokenWs ? 'FAILED' : tbkToken ? 'ABORTED' : 'TIMEOUT'
      return redirectToResult(req, await closeUnpaid(tbkOrder, tbkSession, status, ipHash))
    }

    logWarn('Retorno de Webpay sin parámetros reconocibles', { ipHash })
  } catch (err) {
    logError('Error procesando el retorno de Webpay', {
      ipHash,
      error: err instanceof Error ? err.message : String(err),
    })
  }

  return redirectToResult(req, null)
}

/** 303: el navegador sigue con GET aunque Webpay haya llegado por POST. */
function redirectToResult(req: Request, buyOrder: string | null): Response {
  const url = new URL('/checkout/resultado', req.url)
  if (buyOrder) url.searchParams.set('orden', buyOrder)
  return NextResponse.redirect(url, 303)
}

/**
 * Anulación, timeout o error de formulario: la orden se cierra sin commit.
 * Se exige que la sesión coincida con la de la orden, para que nadie pueda
 * cerrar la orden de otra persona conociendo solo su número.
 */
async function closeUnpaid(
  buyOrder: string,
  sessionId: string,
  status: 'ABORTED' | 'TIMEOUT' | 'FAILED',
  ipHash: string,
): Promise<string | null> {
  if (!BUY_ORDER_RE.test(buyOrder)) return null

  const order = await findOrderByBuyOrder(buyOrder)
  if (!order || order.sessionId !== sessionId) {
    logSecurityEvent('UNAUTHORIZED_ACCESS_ATTEMPT', {
      ipHash,
      endpoint: '/api/checkout/return',
      reason: 'orden o sesión desconocida',
    })
    return null
  }

  if (await closeOrder(buyOrder, status)) {
    logSecurityEvent('PAYMENT_FAILED', { ipHash, buyOrder, reason: status })
  }
  return buyOrder
}

/** Flujo normal: confirma la transacción y verifica lo que informa Webpay. */
async function confirmPayment(token: string, ipHash: string): Promise<string | null> {
  if (!isValidToken(token)) return null

  const order = await findOrderByToken(token)
  if (!order) {
    logSecurityEvent('UNAUTHORIZED_ACCESS_ATTEMPT', {
      ipHash,
      endpoint: '/api/checkout/return',
      reason: 'token desconocido',
    })
    return null
  }

  // Ya procesada (recarga de la página o doble envío): no se confirma dos veces.
  if (order.status !== 'PENDING') return order.buyOrder

  let result: TransactionResult
  let fromCommit = true
  try {
    result = await commitTransaction(token, order.environment)
  } catch (err) {
    // El commit pudo fallar porque otra solicitud ya confirmó esta orden, o
    // por un problema de red. Antes de decidir se consulta el estado real.
    logWarn('Commit de Webpay falló; se consulta el estado', {
      buyOrder: order.buyOrder,
      error: err instanceof Error ? err.message : String(err),
    })
    const fresh = await findOrderByBuyOrder(order.buyOrder)
    if (fresh && fresh.status !== 'PENDING') return fresh.buyOrder

    try {
      result = await getTransactionStatus(token, order.environment)
      fromCommit = false
    } catch (statusErr) {
      // Sin respuesta de Transbank la orden queda PENDING y la página de
      // resultado informa que el pago se está verificando.
      logError('No se pudo confirmar ni consultar el pago', {
        buyOrder: order.buyOrder,
        error: statusErr instanceof Error ? statusErr.message : String(statusErr),
      })
      return order.buyOrder
    }
  }

  // Lo que informa Transbank debe coincidir con lo que se envió al crear la
  // transacción (requisito de Transbank: validar monto y orden de compra).
  const matches =
    result.buy_order === order.buyOrder &&
    result.session_id === order.sessionId &&
    Number(result.amount) === order.amount

  if (isApproved(result) && !matches) {
    logSecurityEvent('PAYMENT_ANOMALY', {
      ipHash,
      buyOrder: order.buyOrder,
      reportedBuyOrder: result.buy_order,
      reportedAmount: Number(result.amount),
      expectedAmount: order.amount,
    })
    // No se entrega un servicio que no corresponde a lo cobrado: se reversa.
    try {
      await refundTransaction(token, Number(result.amount), order.environment)
      await closeOrder(order.buyOrder, 'REVERSED', result)
    } catch (err) {
      logError('No se pudo reversar un pago con datos inconsistentes', {
        buyOrder: order.buyOrder,
        error: err instanceof Error ? err.message : String(err),
      })
      await closeOrder(order.buyOrder, 'FAILED', result)
    }
    return order.buyOrder
  }

  if (isApproved(result)) {
    const paid = await closeOrder(order.buyOrder, 'AUTHORIZED', result)
    if (paid) {
      logSecurityEvent('PAYMENT_CONFIRMED', {
        ipHash,
        buyOrder: paid.buyOrder,
        amount: paid.amount,
        environment: paid.environment,
      })
      logSecurityEvent('BOOKING_CREATED', {
        ipHash,
        buyOrder: paid.buyOrder,
        vedetoSlug: paid.vedetoSlug,
        date: paid.eventDate,
      })
      await addToCalendar(paid)
    }
    return order.buyOrder
  }

  // Rechazada por el emisor (commit respondió) o cerrada de otra forma
  // (estado consultado tras un commit fallido).
  const status =
    fromCommit || result.status === 'FAILED'
      ? 'REJECTED'
      : result.status === 'REVERSED' || result.status === 'NULLIFIED'
        ? 'REVERSED'
        : 'FAILED'

  if (await closeOrder(order.buyOrder, status, result)) {
    logSecurityEvent('PAYMENT_FAILED', {
      ipHash,
      buyOrder: order.buyOrder,
      reason: status,
      responseCode: result.response_code,
      webpayStatus: result.status,
    })
  }
  return order.buyOrder
}

/**
 * Agenda el show en Google Calendar. Solo para pagos reales: las pruebas de
 * integración no deben ocupar la agenda del elenco. Si Google falla, el pago
 * ya está registrado en la base de datos y se agenda a mano desde el log.
 */
async function addToCalendar(order: Order): Promise<void> {
  if (order.environment !== 'production' || !isCalendarConfigured()) return

  const vedeto = vedetos.find((v) => v.slug === order.vedetoSlug)
  const tier = vedeto?.pricing.find((t) => t.id === order.tierId)
  const extras = order.extras
    .map((slug) => vedetos.find((v) => v.slug === slug)?.name ?? slug)
    .join(', ')

  try {
    const event = await createBookingEvent({
      vedetoSlug: order.vedetoSlug,
      vedetoName: vedeto?.name ?? order.vedetoSlug,
      date: order.eventDate,
      time: order.eventTime,
      eventName: `Reserva web ${order.buyOrder}`,
      address: `${order.address}, ${order.communeName}`,
      contactName: order.contactName,
      contactEmail: order.contactEmail,
      contactPhone: order.contactPhone,
      tierName: tier?.name ?? order.tierId,
      bookingId: order.buyOrder,
      specialRequests: extras ? `Artistas adicionales: ${extras}` : undefined,
    })
    await setCalendarEventId(order.buyOrder, event.id)
    logInfo('Reserva agendada en Google Calendar', { buyOrder: order.buyOrder })
  } catch (err) {
    logError('Pago aprobado pero no se pudo agendar en Google Calendar', {
      buyOrder: order.buyOrder,
      date: order.eventDate,
      time: order.eventTime,
      error: err instanceof Error ? err.message : String(err),
    })
  }
}
