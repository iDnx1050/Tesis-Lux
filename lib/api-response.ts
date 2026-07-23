import type { RateLimitResult } from './rate-limiter'

export function ok<T>(data: T, status = 200): Response {
  return Response.json({ success: true, data }, { status })
}

export function created<T>(data: T): Response {
  return ok(data, 201)
}

export function apiError(
  message: string,
  status = 400,
  code?: string
): Response {
  return Response.json({ success: false, error: { message, code } }, { status })
}

export function rateLimitedResponse(result: RateLimitResult): Response {
  return Response.json(
    {
      success: false,
      error: {
        message: 'Demasiadas solicitudes. Intenta más tarde.',
        code: 'RATE_LIMITED',
      },
    },
    {
      status: 429,
      headers: {
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
        'Retry-After': String(Math.ceil((result.resetAt - Date.now()) / 1000)),
      },
    }
  )
}

export function addRateLimitHeaders(
  response: Response,
  result: RateLimitResult
): Response {
  const headers = new Headers(response.headers)
  headers.set('X-RateLimit-Limit', String(result.limit))
  headers.set('X-RateLimit-Remaining', String(result.remaining))
  headers.set('X-RateLimit-Reset', String(Math.ceil(result.resetAt / 1000)))
  return new Response(response.body, { status: response.status, headers })
}
