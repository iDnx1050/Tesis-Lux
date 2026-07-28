import { NextResponse } from 'next/server'
import { signAgeToken } from '@/lib/age-gate'

export const runtime = 'nodejs'

const COOKIE_MAX_AGE = 60 * 60 * 24 // 24 horas

export async function POST() {
  // Si AGE_GATE_SECRET falta en producción, signAgeToken() lanza y esta ruta
  // responde 500: el age gate falla cerrado (nadie pasa) en vez de emitir un
  // token firmado con un secreto conocido.
  const token = signAgeToken()

  const response = NextResponse.json({ ok: true })

  // Cookie HttpOnly firmada: el servidor la verifica en app/layout.tsx antes de
  // renderizar el contenido. No accesible desde JS del cliente (protege ante XSS).
  response.cookies.set('luxx_av', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  })

  return response
}
