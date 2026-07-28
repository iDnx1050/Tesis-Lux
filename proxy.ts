import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Next.js 16 reconoce `proxy.ts` como middleware (equivalente al antiguo
// middleware.ts). Aquí se genera el Content-Security-Policy con un nonce por
// request y se propaga a los <script> que inyecta Next.js.
// Nota: usar nonce fuerza el renderizado dinámico de las páginas (el nonce
// cambia en cada request); es un compromiso aceptable a cambio de un CSP fuerte.
export function proxy(request: NextRequest) {
  // Nonce aleatorio por request (Web Crypto, disponible en el runtime Edge).
  const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))))
  const isDev = process.env.NODE_ENV !== 'production'

  const csp = [
    "default-src 'self'",
    // 'unsafe-eval' solo en desarrollo (React Fast Refresh lo necesita)
    `script-src 'self' 'nonce-${nonce}'${isDev ? " 'unsafe-eval'" : ''}`,
    // Tailwind v4 y framer-motion inyectan estilos inline → 'unsafe-inline'
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://images.unsplash.com https://*.openstreetmap.org https://maps.google.com https://maps.gstatic.com",
    "font-src 'self'",
    // iframes de mapas (OpenStreetMap / Google Maps embed)
    "frame-src 'self' https://www.openstreetmap.org https://maps.google.com https://www.google.com",
    // El geocoding ahora pasa por /api/geocode (mismo origen), no directo a Nominatim
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ')

  const requestId = crypto.randomUUID()

  // Next.js lee el CSP de los headers del REQUEST para extraer el nonce y
  // aplicarlo a sus propios scripts. También exponemos x-nonce por si un Server
  // Component necesita leerlo vía headers().
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('x-request-id', requestId)
  requestHeaders.set('Content-Security-Policy', csp)

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set('Content-Security-Policy', csp)
  response.headers.set('x-request-id', requestId)
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
