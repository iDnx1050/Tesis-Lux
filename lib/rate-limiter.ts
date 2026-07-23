// Rate limiter de ventana deslizante en memoria.
// NOTA: En despliegues serverless/edge cada instancia tiene su propio almacén.
// Para producción con múltiples instancias usar Upstash Redis o Vercel KV.

interface Entry {
  count: number
  resetAt: number
}

const store = new Map<string, Entry>()

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetAt: number
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs
    store.set(key, { count: 1, resetAt })
    return { success: true, limit, remaining: limit - 1, resetAt }
  }

  if (entry.count >= limit) {
    return { success: false, limit, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count++
  return { success: true, limit, remaining: limit - entry.count, resetAt: entry.resetAt }
}

// Eliminar entradas expiradas para evitar crecimiento ilimitado del mapa
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key)
  }
}, 60_000)
