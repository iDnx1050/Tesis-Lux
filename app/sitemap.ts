import type { MetadataRoute } from 'next'
import { vedetos } from '@/lib/mock-data'
import { SITE_URL } from '@/lib/site'

/**
 * Genera /sitemap.xml en build (convencion de metadata de Next.js App Router).
 *
 * Cubre las paginas estaticas mas los perfiles dinamicos de /vedetos/[slug],
 * derivados de la misma fuente que usa la pagina de perfil (lib/mock-data),
 * de modo que agregar un artista actualiza el sitemap automaticamente.
 *
 * Queda fuera a proposito:
 *  - /checkout → paso transaccional, tambien bloqueado en robots.txt.
 *  - /api/*    → no son paginas HTML.
 */

// Se evalua una sola vez al generar el sitemap, no por request.
const lastModified = new Date()

type SitemapEntry = MetadataRoute.Sitemap[number]

const STATIC_ROUTES: Array<{
  path: string
  changeFrequency: NonNullable<SitemapEntry['changeFrequency']>
  priority: number
}> = [
  // Paginas comerciales: son las que deben posicionar.
  { path: '', changeFrequency: 'weekly', priority: 1 },
  { path: '/vedetos', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/conjuntos', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/extras', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/galeria', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/cotizador', changeFrequency: 'monthly', priority: 0.8 },
  // Paginas institucionales.
  { path: '/nosotros', changeFrequency: 'yearly', priority: 0.6 },
  { path: '/contacto', changeFrequency: 'yearly', priority: 0.6 },
  // Legales: se indexan, pero con prioridad baja.
  { path: '/terminos', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/privacidad', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/cookies', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/politica-eventos', changeFrequency: 'yearly', priority: 0.3 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  const vedetoEntries: MetadataRoute.Sitemap = vedetos.map((vedeto) => ({
    url: `${SITE_URL}/vedetos/${vedeto.slug}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticEntries, ...vedetoEntries]
}
