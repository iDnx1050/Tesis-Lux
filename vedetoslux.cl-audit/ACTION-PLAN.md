# Plan de acción SEO — vedetoslux.cl

Puntaje actual: **47/100**. Estimación tras Fases 1–2: **~75/100**.

## Fase 1 — Crítico (semana 1)

### 1. Metadata por página + canónica (O1, O2, T1)

`app/layout.tsx` — plantilla de título y Open Graph base:

```ts
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Luxx Producciones | Shows Premium en Chile', template: '%s | Luxx Producciones' },
  description: '…',
  alternates: { canonical: '/' },
  openGraph: { siteName: 'Luxx Producciones', locale: 'es_CL', type: 'website' },
  twitter: { card: 'summary_large_image' },
  other: { rating: 'adult' }, // ver §9 del informe
}
```

`app/vedetos/[slug]/layout.tsx` (nuevo; la página es `'use client'`):

```ts
import type { Metadata } from 'next'
import { vedetos } from '@/lib/mock-data'

export function generateStaticParams() {
  return vedetos.map((v) => ({ slug: v.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const v = vedetos.find((x) => x.slug === slug)
  if (!v) return {}
  const title = `${v.name} — Show privado en Santiago`
  const description = `Contrata a ${v.name} para tu despedida de soltera o evento privado. Planes desde $… CLP, reserva online.`
  return {
    title,
    description,
    alternates: { canonical: `/vedetos/${slug}` },
    openGraph: { title, description, url: `/vedetos/${slug}`, images: [v.images[0]] },
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
```

(Ajustar nombres de campos a `lib/types.ts`.) Repetir con `app/vedetos/layout.tsx` (metadata estática) y añadir `export const metadata` en `app/page.tsx`, `app/nosotros/page.tsx` y `app/contacto/page.tsx`. En las demás páginas que ya tienen metadata, añadir `alternates.canonical` y `openGraph.url`.

### 2. Imagen Open Graph (O2)
Crear `app/opengraph-image.jpg` (1200×630) con logo y foto grupal (`public/vedetos/todos.webp`).

### 3. H1 de la home (O3) — `components/hero-section.tsx:128-139`

```tsx
<h1 className="…">
  <span className="block">{splitTextGold('Shows')}{splitText(' que')}</span>{' '}
  <span className="block">{splitTextGold('Nadie')}{splitText(' Olvida')}</span>
</h1>
```

> **Estado (2026-10-14):** los puntos 1–4 de la Fase 1 están aplicados y verificados en un build local de producción.

### 4. Video móvil (P1) — `components/hero-section.tsx:89-94` y `app/vedetos/[slug]/page.tsx:164-166`

```tsx
<video … preload="metadata" poster="/vedetos/todos.webp">
  <source media="(max-width: 768px)" src="/magicmike-mobile.mp4" type="video/mp4" />
  <source src="/magicmike-desktop.mp4" type="video/mp4" />
</video>
```

## Fase 2 — Alto impacto (semanas 2-3)

> **Estado (2026-10-14):** aplicados 5 (JSON-LD sin reseñas), 7 (H1 en galería y cotizador; las descripciones ya se ampliaron en Fase 1), 8, 10, el `rating=adult`, y del 9 la conversión de 26 imágenes pesadas a WebP (7,6 MB → 313 KB). Pendientes: 6 (decisión sobre reseñas de demo) y la recompresión de videos (requiere ffmpeg). De la Fase 3 ya están `favicon.ico`, `apple-icon.png` y `llms.txt`. El age-gate se dejó como overlay de cliente: renderizarlo en el servidor obligaría a mostrarlo a quien ya lo aceptó o a un script inline con nonce, y no compensa el riesgo.

5. **JSON-LD** (§5): componente `<JsonLd>` server-side con `Organization` + `WebSite` en el layout, `EntertainmentBusiness` (`areaServed`, `telephone`, `priceRange`, `sameAs`) en home, `Service`/`Offer` + `BreadcrumbList` en perfiles. Pasar el `nonce` del CSP al `<script type="application/ld+json">` no es necesario (no es ejecutable), pero validar con Rich Results Test.
6. **Reseñas/cifras de demo** (C1): rotular o quitar "4.9 (143 reseñas)", "500+ eventos", "Perfil verificado" si no son reales.
7. **H1 en `/galeria` y `/cotizador`** (O4) y descripciones de 120–155 caracteres (O6).
8. **`/conjuntos`** (C2): `robots: { index: false }` y quitarla de `app/sitemap.ts` hasta que tenga contenido.
9. **Recomprimir videos** a < 1,5 MB y originales de `public/` a < 400 KB (P1, I1).
10. **`lastmod` real** en `app/sitemap.ts` (T3).

## Fase 3 — Contenido y autoridad (mes 2)

11. Página de preguntas frecuentes (anticipo, cancelación, cobertura por comuna, seguridad, duración).
12. Ampliar `/nosotros` (historia, equipo, cobertura) y `/contacto` (horario, comunas, tiempo de respuesta).
13. Texto único por perfil: personajes, estilo, zonas, mini-FAQ.
14. Datos de empresa en footer (razón social, RUT) y marca/dominio de correo unificados.
15. Perfil de Google Business de **área de servicio** con NAP idéntico al sitio.
16. `favicon.ico`, `apple-icon.png`, `llms.txt`.

## Fase 4 — Monitoreo (continuo)

17. Verificar el dominio en Google Search Console y enviar el sitemap; revisar cobertura e informe de SafeSearch.
18. Configurar una API key de PageSpeed (`claude-seo setup`) y repetir la auditoría para obtener Lighthouse + CrUX reales.
19. Línea base de drift: `/seo-drift baseline https://vedetoslux.cl` antes de cada avance de la tesis.
