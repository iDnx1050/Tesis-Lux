// Lógica de firma/verificación del age gate (HMAC-SHA256).
// Compartida entre app/api/age-verify (emite el token) y app/layout.tsx
// (verifica el token en el servidor antes de renderizar el contenido).
// Ambos corren en el runtime Node.js, por lo que se usa 'crypto' nativo.

import { createHmac, timingSafeEqual } from 'crypto'

// El token es el HMAC del "epoch en horas": rota cada hora y no requiere estado.
const SHA256_HEX_LEN = 64

function getSecret(): string {
  const secret = process.env.AGE_GATE_SECRET
  if (secret && secret.length >= 32) return secret

  // En producción el secreto es obligatorio: fallar de forma ruidosa en vez de
  // degradar silenciosamente a un valor conocido (evita tokens falsificables).
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'AGE_GATE_SECRET ausente o < 32 bytes en producción. ' +
        'Genéralo con: openssl rand -base64 32',
    )
  }

  // Solo en desarrollo local se permite un secreto de conveniencia, marcado.
  console.warn(
    '[age-gate] AGE_GATE_SECRET no definido; usando secreto de DESARROLLO. ' +
      'No usar en producción.',
  )
  return 'dev-only-insecure-secret-do-not-use-in-production-0000000'
}

function computeToken(hourEpoch: number): string {
  return createHmac('sha256', getSecret())
    .update(`age_verified:${hourEpoch}`)
    .digest('hex')
}

export function signAgeToken(): string {
  return computeToken(Math.floor(Date.now() / (1000 * 60 * 60)))
}

/**
 * Verifica el token con comparación de tiempo constante. Acepta la hora actual
 * y la anterior (ventana de 2h) para tolerar el cambio de hora. Falla cerrado:
 * ante cualquier error de configuración devuelve false (muestra el age gate),
 * nunca lanza hacia el árbol de renderizado.
 */
export function verifyAgeToken(token: string | undefined | null): boolean {
  if (!token || token.length !== SHA256_HEX_LEN) return false

  try {
    const now = Math.floor(Date.now() / (1000 * 60 * 60))
    const tokenBuf = Buffer.from(token)
    return [now, now - 1].some((h) => {
      const expected = Buffer.from(computeToken(h))
      return (
        expected.length === tokenBuf.length && timingSafeEqual(expected, tokenBuf)
      )
    })
  } catch {
    return false
  }
}
