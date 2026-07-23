import { NextResponse } from 'next/server'
import { createHmac } from 'crypto'

const SECRET = process.env.AGE_GATE_SECRET ?? 'dev-secret-change-in-production'
const COOKIE_MAX_AGE = 60 * 60 * 24 // 24 horas

function signToken(): string {
  const payload = `age_verified:${Math.floor(Date.now() / (1000 * 60 * 60))}`
  return createHmac('sha256', SECRET).update(payload).digest('hex')
}

export function verifyToken(token: string): boolean {
  // Verificar la hora actual y la hora anterior (ventana de 2h para evitar
  // que la cookie expire exactamente en el cambio de hora)
  const now = Math.floor(Date.now() / (1000 * 60 * 60))
  return [now, now - 1].some((h) => {
    const expected = createHmac('sha256', SECRET)
      .update(`age_verified:${h}`)
      .digest('hex')
    return token === expected
  })
}

export async function POST() {
  const token = signToken()

  const response = NextResponse.json({ ok: true })

  // Cookie HttpOnly: no accesible desde JS del cliente → protege contra XSS
  response.cookies.set('luxx_av', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  })

  // Cookie de UI: permite al AgeGate component leer el estado en el cliente
  response.cookies.set('luxx_av_ui', '1', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  })

  return response
}
