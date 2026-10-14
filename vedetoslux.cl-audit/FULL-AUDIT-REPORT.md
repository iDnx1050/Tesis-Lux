# Auditoría SEO completa — vedetoslux.cl

| Campo | Valor |
|---|---|
| Sitio | https://vedetoslux.cl (Luxx Producciones — tesis) |
| Fecha | 2026-10-14 |
| Herramienta | claude-seo v2.4.2 (`/seo-audit`) vía Claude Code |
| Alcance | 21 URLs del sitemap + rastreo de enlaces internos (22 respuestas), código fuente Next.js del repositorio |
| Tipo de negocio detectado | Servicio local de entretenimiento para eventos privados (sin local físico; área de servicio: Chile / RM) con reserva y pago online |

> **Limitaciones.** PageSpeed Insights sin API key devolvió "cuota diaria excedida", así que no hay puntaje Lighthouse oficial ni datos de campo CrUX. El rendimiento se midió en laboratorio con Playwright + Edge (sin throttling de red), por lo que las cifras son **optimistas** respecto a un móvil real en 4G. No hay credenciales de Search Console/GA4, así que no se verificó indexación real ni tráfico.

---

## 1. Resumen ejecutivo

### SEO Health Score: **47 / 100**

| Categoría | Peso | Puntaje | Aporte |
|---|---:|---:|---:|
| SEO técnico | 22 % | 60 | 13,2 |
| Calidad de contenido | 23 % | 50 | 11,5 |
| SEO on-page | 20 % | 38 | 7,6 |
| Schema / datos estructurados | 10 % | 5 | 0,5 |
| Rendimiento (CWV) | 10 % | 62 | 6,2 |
| Preparación para búsqueda con IA | 10 % | 50 | 5,0 |
| Imágenes | 5 % | 60 | 3,0 |
| **Total** | | | **47** |

La base es sólida (HTTPS + HSTS, redirecciones correctas, SSR real, robots y sitemap válidos, 404 reales, CLS ≈ 0). El puntaje cae por **metadatos**: 13 de 21 páginas comparten título y descripción, ninguna tiene canónica ni imagen Open Graph, y no existe ningún dato estructurado.

### Top 5 problemas críticos / altos

1. **Títulos y descripciones duplicados en 13/21 páginas** (home, `/vedetos`, `/nosotros`, `/contacto` y los 10 perfiles). Google no puede distinguir los perfiles entre sí.
2. **Sin `<link rel="canonical">` en ninguna página.**
3. **Open Graph fijo en todo el sitio**: `og:title` y `og:url` apuntan a la home desde cualquier página y no hay `og:image` → al compartir un perfil por WhatsApp/Instagram se ve la home sin imagen.
4. **Cero JSON-LD** (ni `Organization`, ni `LocalBusiness`/`EntertainmentBusiness`, ni `Service`/`Offer`, ni `BreadcrumbList`).
5. **Video hero de 5,6 MB servido también en móvil** (existe `magicmike-mobile.mp4` pero no se usa) y con `preload="auto"`: la home pesa **7,3 MB** en móvil.

### Top 5 quick wins (≤ 1 h cada uno)

1. Añadir `alternates.canonical` y `openGraph.url` por página en `metadata`.
2. Crear `app/vedetos/layout.tsx` y `app/vedetos/[slug]/layout.tsx` con `generateMetadata` (las páginas son `'use client'` y no pueden exportar metadata).
3. Añadir `export const metadata` a `app/page.tsx`, `app/nosotros/page.tsx` y `app/contacto/page.tsx`.
4. Crear `app/opengraph-image.(jpg|tsx)` → `og:image` en todo el sitio.
5. Usar `<source media="(max-width: 768px)" src="/magicmike-mobile.mp4">` y `preload="metadata"` en el hero.

---

## 2. SEO técnico — 60/100

### Lo que funciona
- HTTPS con HSTS (`max-age=31536000; includeSubDomains`); `http://` y `www.` redirigen 301 en un salto a `https://vedetoslux.cl/`.
- `robots.txt` válido: permite todo, bloquea `/api/` y `/checkout`, declara el sitemap.
- `sitemap.xml` válido, 21 URLs, todas 200, mismo host que el sitio (`lib/site.ts` centraliza el origen).
- URLs inexistentes devuelven **404 real** (no hay soft-404).
- Contenido **renderizado en servidor** (867 palabras visibles sin JS en la home); el age-gate es un overlay de cliente, así que no impide la indexación.
- `lang="es"`, `viewport` correcto, cabeceras de seguridad completas (CSP con nonce, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy).

### Hallazgos

| # | Severidad | Hallazgo | Evidencia | Recomendación |
|---|---|---|---|---|
| T1 | **Alta** | Ninguna página declara URL canónica | `canonical = None` en las 22 respuestas | `alternates: { canonical: '/ruta' }` en cada `metadata` (con `metadataBase` ya definido en `app/layout.tsx:36`) |
| T2 | Media | Todo el sitio se renderiza dinámicamente y sin caché | `Cache-Control: private,no-cache,no-store` en HTML; TTFB de laboratorio 420–1 775 ms. Causa: `await connection()` en `app/layout.tsx:73`, necesario para el CSP con nonce | Mantener el nonce (es una decisión de seguridad documentada), pero vigilar TTFB. Alternativa: CSP con hashes (`experimental.sri`) para poder volver a prerenderizar las páginas legales/estáticas |
| T3 | Media | `lastmod` del sitemap es siempre la hora actual | Todas las URLs con `2026-10-14T18:22:06.611Z` | Usar fechas reales de última modificación (constantes por ruta o fecha de commit); Google ignora `lastmod` que cambia en cada request |
| T4 | Baja | `/favicon.ico` responde 404 | Solo existe `/icon.svg` | Añadir `app/favicon.ico` (Google Search y algunos clientes aún lo piden) y un `apple-icon.png` |
| T5 | Baja | `Host:` en robots.txt | Directiva solo de Yandex, Google la ignora | Se puede quitar de `app/robots.ts:25` |
| T6 | Info | `changefreq`/`priority` en sitemap | Google los ignora | Sin acción necesaria |

---

## 3. Calidad de contenido (E-E-A-T) — 50/100

### Lo que funciona
- Páginas legales completas y bien estructuradas (términos 559 palabras, privacidad 713 con referencia explícita a la Ley 21.719, política de eventos 517).
- Cada perfil tiene un párrafo "Acerca de" propio y planes con precios visibles en CLP.

### Hallazgos

| # | Severidad | Hallazgo | Evidencia | Recomendación |
|---|---|---|---|---|
| C1 | **Alta** | Calificaciones y reseñas sin respaldo verificable | Perfiles muestran "4.9 (143 reseñas)", "500+ eventos", "Perfil verificado" desde `lib/mock-data.ts` | Si son datos de demostración, rotularlos como tales o quitarlos antes de producción. **No** marcarlos con `AggregateRating`: Google penaliza reseñas no verificables y la Ley 19.496 sanciona información engañosa al consumidor |
| C2 | Media | Contenido delgado en páginas indexables | `/conjuntos` 91 palabras ("próximamente"), `/galeria` 73, `/contacto` 69, `/nosotros` 144 | `/conjuntos`: `robots: { index: false }` hasta que tenga oferta real (y sacarla del sitemap). `/nosotros`: historia, equipo, años de operación, cobertura. `/contacto`: horario, comunas cubiertas, tiempos de respuesta |
| C3 | Media | Perfiles muy similares entre sí | Similitud textual perfil 1 vs 2 ≈ 73 % (plantilla + planes idénticos); texto único ≈ 1 párrafo | Ampliar lo único de cada perfil: estilo de show, personajes, duración, zonas, FAQ propia |
| C4 | Media | Sin sección de preguntas frecuentes | Ninguna página responde dudas típicas (anticipo, cancelación, cobertura, seguridad) | Página `/preguntas-frecuentes` o bloque FAQ en `/cotizador`; mejora conversión y citabilidad en IA |
| C5 | Baja | Señales de autoría/empresa débiles | No hay razón social, RUT, ni dirección comercial visibles | Añadir en footer/`/nosotros` (también exigido para comercio electrónico en Chile) |
| C6 | Baja | Inconsistencia de marca | "Luxx" y "LUXX" alternan en títulos; dominio `vedetoslux.cl` pero correos `@luxxproducciones.cl` | Unificar nombre y, si es posible, dominio de correo |

---

## 4. SEO on-page — 38/100

### Hallazgos

| # | Severidad | Hallazgo | Evidencia | Recomendación |
|---|---|---|---|---|
| O1 | **Crítica** | Título y meta description duplicados en 13/21 páginas | "Luxx Producciones \| Shows Premium en Chile" en `/`, `/vedetos`, `/nosotros`, `/contacto` y los 10 `/vedetos/[slug]` | `/vedetos/[slug]`: `generateMetadata` → `"{Nombre} — Show privado en Santiago \| Luxx Producciones"` + descripción con personajes y precio desde. Ver plan de acción |
| O2 | **Alta** | Open Graph heredado del layout en todas las páginas | `og:title` = título de la home y `og:url = https://vedetoslux.cl` en las 22 respuestas; sin `og:image`; `twitter:card = summary` | Definir `openGraph` por página (Next no fusiona `openGraph` anidado: hay que repetir `siteName`/`locale`) y añadir `opengraph-image`; `twitter: { card: 'summary_large_image' }` |
| O3 | **Alta** | H1 de la home duplicado | Dos `<h1>` en `components/hero-section.tsx:128` y `:134` ("Shows que" / "Nadie Olvida"). *Corrección posterior:* el "S h o w s" que mostraba el rastreo era un artefacto del extractor (cada letra va en su propio `<span>`); el texto real del DOM es correcto | Un único `<h1>` con dos `<span className="block">` separados por un espacio — **aplicado en Fase 1** |
| O4 | Media | Páginas sin H1 | `/galeria` y `/cotizador` | Añadir H1 descriptivo ("Galería de eventos", "Cotiza tu despedida de soltera") |
| O5 | Media | Formato de títulos inconsistente | Separadores "\|" y "·"; "LUXX" vs "Luxx" | `title: { template: '%s \| Luxx Producciones', default: ... }` en el layout |
| O6 | Baja | Descripciones cortas | `/galeria` (47 car.), `/extras` (63), `/cotizador` (58) | 120–155 caracteres con intención de búsqueda ("despedida de soltera", "Santiago") |
| O7 | Info | `keywords` meta en el layout | Google la ignora | Sin efecto; se puede eliminar |

Enlazado interno: correcto. Todos los perfiles están enlazados desde `/vedetos` y la home; el menú cubre todas las secciones; no se detectaron páginas huérfanas ni enlaces rotos.

---

## 5. Schema / datos estructurados — 5/100

**Estado actual:** ningún bloque `application/ld+json` en ninguna página.

**Oportunidades (por prioridad):**
1. `Organization` + `WebSite` en el layout (nombre, logo, `sameAs` → Instagram, `contactPoint` con WhatsApp).
2. `EntertainmentBusiness` (subtipo de `LocalBusiness`) con `areaServed` (Región Metropolitana / Chile), `telephone`, `priceRange`. **Sin** dirección física si no la hay (usar solo `areaServed`).
3. `Service` + `Offer` en cada perfil (planes con `price` y `priceCurrency: "CLP"`).
4. `BreadcrumbList` en `/vedetos/[slug]`.
5. `FAQPage` si se crea la sección de preguntas frecuentes (Google ya no muestra el rich result para la mayoría de sitios, pero ayuda a la citabilidad en IA).

**No hacer:** `AggregateRating`/`Review` con los datos de `mock-data.ts` (ver C1).

---

## 6. Rendimiento (Core Web Vitals) — 62/100

Medición de laboratorio (Edge headless, sin throttling de red; un móvil real en 4G será más lento):

| Página | Perfil | TTFB | FCP | LCP | CLS | Peso |
|---|---|---:|---:|---:|---:|---:|
| `/` | Pixel 7 | 1 775 ms | 2 560 ms | **3 196 ms** | 0 | **7,3 MB** |
| `/` | Escritorio | 841 ms | 1 232 ms | 1 232 ms | 0 | 6,2 MB |
| `/vedetos` | Pixel 7 | 419 ms | 748 ms | 1 568 ms | 0 | 0,7 MB |
| `/vedetos/benjamin` | Pixel 7 | 536 ms | 928 ms | 1 112 ms | 0 | **6,0 MB** |
| `/galeria` | Pixel 7 | 1 473 ms | 1 796 ms | 1 844 ms | 0 | 0,6 MB |
| `/galeria` | Escritorio | 606 ms | 968 ms | 1 016 ms | 0,082 | 0,6 MB |

### Hallazgos

| # | Severidad | Hallazgo | Evidencia | Recomendación |
|---|---|---|---|---|
| P1 | **Alta** | Video de escritorio (5,6 MB) descargado en móvil | `components/hero-section.tsx:94` y `app/vedetos/[slug]/page.tsx:166` solo usan `/magicmike-desktop.mp4`; `magicmike-mobile.mp4` (3,8 MB) nunca se referencia. Hero con `preload="auto"` | `<source media="(max-width: 768px)" src="/magicmike-mobile.mp4">` antes del de escritorio; `preload="metadata"` (o `none` + poster) en el hero; recomprimir ambos (H.264 CRF 28–30 o AV1/WebM, objetivo < 1,5 MB) |
| P2 | Media | LCP móvil de la home ≈ 3,2 s ya sin throttling | El LCP es el texto del age-gate, que aparece tras hidratar | Renderizar el overlay del age-gate en el HTML del servidor (o con CSS) para que pinte en el primer frame |
| P3 | Media | TTFB alto y variable (hasta 1,8 s) | Render dinámico obligatorio + caché `no-store` (ver T2) | Ver T2; además revisar consultas a Google Calendar/BD que corran en el render de páginas públicas |
| P4 | Baja | CLS 0,082 en `/galeria` (escritorio) | Bajo el umbral de 0,1 pero cerca | Reservar alto con `aspect-ratio` en el contenedor de la galería |

JS transferido 190–275 KB por página: aceptable.

---

## 7. Imágenes — 60/100

### Lo que funciona
- Todas las imágenes pasan por `next/image` (`/_next/image`) con `sizes`, `srcset`, lazy-loading y conversión a WebP/AVIF automática.
- Sin imágenes sin atributo `alt`.

### Hallazgos

| # | Severidad | Hallazgo | Recomendación |
|---|---|---|---|
| I1 | Media | Originales muy pesados en `/public` (60 MB en total; PNG de 1,6–2,3 MB en `public/vedetos/Paulo`, `Jesus Polanco`, `Lorenzo`, `Lazaro`) | Aunque `next/image` optimiza en el servidor, cada tamaño nuevo obliga a procesar el original. Convertir a WebP/JPEG ≤ 2000 px y < 400 KB |
| I2 | Baja | Nombres de archivo con espacios y sin semántica (`Paulo 1.png`, `IMG_9099.PNG`, `0b6b176f-….jpg`) | `paulo-cassanova-show-policia.webp`; ayuda a Google Imágenes |
| I3 | Baja | 12 `alt=""` en la home | Son duplicados de carrusel (correcto si son decorativos); verificar que la primera copia tenga `alt` descriptivo |
| I4 | Baja | Sin `og:image` (ver O2) | — |

---

## 8. Preparación para búsqueda con IA (GEO / agentes) — 50/100

| Chequeo | Estado |
|---|---|
| Contenido sin JS | ✅ 867 palabras en el HTML del servidor |
| robots.txt accesible y permisivo con GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc. | ✅ todos caen en `User-Agent: *` → permitido |
| 404 reales | ✅ |
| `llms.txt` | ❌ 404 (opcional; Google lo ignora, Lighthouse lo cuenta) |
| Datos estructurados de entidad | ❌ ninguno (ver §5) |
| Pasajes citables (preguntas/respuestas, datos concretos) | ⚠️ escasos: sin FAQ, sin cifras verificables |
| Política explícita para IA (`Content-Signal`) | ℹ️ no declarada (opcional) |

**Recomendaciones:** entidad clara con `Organization`/`EntertainmentBusiness` + `sameAs`; FAQ con respuestas de 40–60 palabras; `llms.txt` breve con descripción del servicio y enlaces a perfiles, cotizador y políticas; decidir si se permite entrenamiento (`ai-train=no`) y declararlo.

---

## 9. Consideraciones específicas del rubro

- **Contenido para adultos:** el sitio declara ser +18 (age-gate). Google pide etiquetar estos sitios con `<meta name="rating" content="adult">` para que SafeSearch los clasifique bien; no etiquetarlos puede derivar en acciones de SafeSearch sobre todo el dominio. El age-gate en sí es una interstitial aceptada por Google (verificación de edad legal).
- **SEO local:** no hay local físico, así que el perfil de Google Business debe ser de **área de servicio** (sin dirección pública). Mantener el mismo nombre, teléfono (+56 9 4550 1752) y URL en GBP, Instagram y el sitio.

---

## 10. Archivos de esta auditoría

- `ACTION-PLAN.md` — plan priorizado con cambios de código concretos
- `audit-data.json` — datos estructurados para generar el PDF
- `crawl.json` — datos on-page por URL
- `perf-lab.json` — mediciones de rendimiento
- `agentic.json` — chequeo de preparación para agentes IA
- `home-render.json` — render de la home
- `screenshots/` — capturas escritorio, laptop, tablet, móvil

*Auditoría generada con la skill claude-seo v2.4.2 (AgriciDaniel, MIT) por Claude Opus 5.5 (Anthropic) vía Claude Code.*
