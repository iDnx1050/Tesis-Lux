import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

/**
 * Genera /robots.txt en build (convencion de metadata de Next.js App Router).
 *
 * Se bloquean solo las rutas sin valor para busqueda:
 *  - /api/    → endpoints JSON, nunca deben indexarse.
 *  - /checkout → paso transaccional con datos de la reserva en la URL.
 *
 * El resto del sitio queda abierto. La declaracion de `sitemap` es la que
 * permite que Google lo descubra por si solo, ademas del envio manual en
 * Search Console.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/checkout'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
