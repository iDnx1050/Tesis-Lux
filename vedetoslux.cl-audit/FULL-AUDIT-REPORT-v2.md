# Auditoría SEO v2 — vedetoslux.cl

| Campo | Valor |
|---|---|
| Fecha | 2026-10-14 |
| Versión auditada | Rama `seo/fase-1` (commits `21de6f8` + `ee28d9f`), build de producción local (`next start`) |
| Versión anterior | `FULL-AUDIT-REPORT.md` (v1, sitio publicado, mismo día) |
| Herramienta | claude-seo v2.4.2 (`/seo-audit`) vía Claude Code |
| Alcance | 20 URLs del sitemap + rastreo de enlaces internos (21 respuestas, todas 200) |

> **Importante: estos cambios todavía no están publicados.** vedetoslux.cl sigue sirviendo la versión de `main` (verificado: el perfil `/vedetos/benjamin` aún muestra el título de la home y `/llms.txt` responde 404). La puntuación v2 corresponde a la rama; el sitio público sigue en 47 hasta desplegarla.
>
> **Limitaciones.** Al auditar en `localhost` no se pueden medir TTFB ni LCP reales (no hay red de por medio) y el chequeo de agentes de la skill bloquea `localhost` por su protección SSRF; `llms.txt` se validó a mano. Sin API key de PageSpeed ni Search Console, no hay Lighthouse oficial, datos de campo CrUX ni estado de indexación.

---

## 1. Resumen ejecutivo

### SEO Health Score: **75 / 100** (v1: 47 → **+28**)

| Categoría | Peso | v1 | v2 | Δ | Aporte v2 |
|---|---:|---:|---:|---:|---:|
| SEO técnico | 22 % | 60 | 82 | +22 | 18,0 |
| Calidad de contenido | 23 % | 50 | 55 | +5 | 12,7 |
| SEO on-page | 20 % | 38 | 90 | +52 | 18,0 |
| Schema / datos estructurados | 10 % | 5 | 85 | +80 | 8,5 |
| Rendimiento (CWV) | 10 % | 62 | 72 | +10 | 7,2 |
| Preparación para búsqueda con IA | 10 % | 50 | 68 | +18 | 6,8 |
| Imágenes | 5 % | 60 | 82 | +22 | 4,1 |
| **Total** | | **47** | **75** | **+28** | |

Lo que queda por debajo es **contenido** (55): reseñas de demostración visibles, páginas cortas y sin preguntas frecuentes. Ya no es un problema técnico; requiere información del negocio.

---

## 2. Delta desde v1

### Resueltos (15)

| v1 | Hallazgo | Evidencia v2 |
|---|---|---|
| O1 (Crítica) | Títulos y descripciones duplicados en 13/21 páginas | 0 duplicados en 20 páginas; cada perfil con título propio ("Benjamin — Show privado en Santiago \| Luxx Producciones") |
| T1 (Alta) | Sin URL canónica | Canónica correcta en las 20 páginas indexables |
| O2 (Alta) | Open Graph fijo (`og:url` = home) y sin `og:image` | `og:url` propio en cada página; imagen 1200×630 general + una por artista (`public/og/`) |
| O3 (Alta) | Dos `<h1>` en la home | Un solo `<h1>`: "Shows que Nadie Olvida" |
| — (Alta) | Sin JSON-LD | Organization + WebSite (todas), EntertainmentBusiness (home), Service con 2 Offer + BreadcrumbList (cada perfil) |
| P1 (Alta) | Video de escritorio (5,6 MB) en móvil | Home móvil descarga `magicmike-mobile.mp4`; perfiles en móvil no descargan video |
| O4 (Media) | `/galeria` y `/cotizador` sin H1 | Ambas con un `<h1>` |
| O5 (Media) | Formato de títulos inconsistente | Plantilla única `%s \| Luxx Producciones` |
| C2 parcial (Media) | `/conjuntos` "próximamente" indexable | `noindex, follow` y fuera del sitemap |
| T3 (Media) | `lastmod` siempre igual a la hora actual | Fecha fija por ruta (`2026-10-14`) |
| I1 (Media) | Originales de 1–2,8 MB en `public/` | 24 imágenes usadas convertidas a WebP: 7,6 MB → 313 KB |
| O6 (Baja) | Descripciones cortas (47–63 caracteres) | 122–181 caracteres en páginas generales |
| T4 (Baja) | `/favicon.ico` 404 | `favicon.ico` (16/32/48), `apple-touch-icon` 180 px, `logo.png` 512 px |
| T5 / §8 (Baja) | `Host:` en robots.txt; sin `llms.txt` | `Host` eliminado; `/llms.txt` válido (H1, resumen `>`, 17 enlaces, generado desde `lib/mock-data`) |
| §9 | Sitio +18 sin etiquetar | `<meta name="rating" content="adult">` en todas las páginas |

### Persistentes

| v1 | Severidad | Hallazgo | Motivo |
|---|---|---|---|
| C1 | **Alta** | Calificaciones y cifras sin respaldo ("4.82 (67 reseñas)", "500+ eventos", "Perfil verificado") | Requiere tu decisión: rotular como demo o quitar |
| P1 | Media | Videos pesados en escritorio (5,6 MB) y móvil (3,8 MB) | No hay ffmpeg en el equipo para recomprimirlos |
| C2 | Media | Contenido delgado: `/galeria` 73 palabras, `/contacto` 69, `/nosotros` 144 | Requiere textos del negocio |
| C3 | Media | Perfiles ≈ 73 % similares | Requiere texto único por artista |
| C4 | Media | Sin preguntas frecuentes | Requiere tus políticas reales |
| T2 / P3 | Media | Render dinámico sin caché (`no-store`) por el CSP con nonce | Decisión de seguridad; no medible en local |
| P2 | Baja | LCP móvil = texto del aviso de edad | Se mantuvo el overlay de cliente a propósito |
| P4 | Baja | CLS 0,082 en `/galeria` (escritorio) | Bajo el umbral de 0,1 |
| C5, C6 | Baja | Sin razón social/RUT visibles; correos en `@luxxproducciones.cl` y dominio `vedetoslux.cl` | Requiere datos del negocio |
| I2 | Baja | Nombres de archivo con espacios y sin semántica | Cambio de bajo impacto, no aplicado |

### Nuevos (detectados en v2)

| # | Severidad | Hallazgo | Recomendación |
|---|---|---|---|
| N1 | Baja | Descripciones de perfiles de 209–237 caracteres y de la home de 181; Google muestra ~155 | El precio va al inicio, así que el corte no pierde lo importante. Si se quiere, acortar `shortDescription` o recortar en `app/vedetos/[slug]/layout.tsx` |
| N2 | Baja | `Service.provider` apunta a `#business`, que solo se declara en la home | Válido para Schema.org, pero más robusto incluir el nodo `EntertainmentBusiness` también en los perfiles |
| N3 | Info | `EntertainmentBusiness` sin `streetAddress` | Es lo correcto para un negocio sin local físico; implica que no es elegible para el resultado enriquecido de negocio local. La visibilidad local vendrá del perfil de Google Business de área de servicio |
| N4 | Baja | 5 imágenes pesadas sin uso en `public/` (p. ej. `Galeria/IMG_3761.jpg`, 2,8 MB) | No afectan a los visitantes; se pueden borrar para aligerar el repositorio |

---

## 3. Detalle por categoría

### Técnico — 82
Todo lo de v1 sigue bien (HTTPS + HSTS, robots, 404 reales, SSR). Ahora además: canónicas, `lastmod` fijo, iconos completos, robots sin directivas inválidas. Lo único pendiente es el TTFB por el render dinámico, que en v1 llegó a 1,8 s en el sitio publicado.

### Contenido — 55
Mejora solo por sacar `/conjuntos` del índice. El hallazgo de mayor peso es C1: mostrar reseñas sin respaldo afecta la confianza (E-E-A-T) y puede considerarse información engañosa al consumidor (Ley 19.496).

### On-page — 90
20/20 páginas con título único (28–54 caracteres), descripción propia, canónica, Open Graph completo, Twitter `summary_large_image` y un único H1. Resta solo el largo de algunas descripciones (N1).

### Schema — 85
| Página | Tipos | Propiedades requeridas |
|---|---|---|
| Todas | Organization, WebSite | Completas (name, url, logo, contactPoint, sameAs) |
| Home | + EntertainmentBusiness | Completas (address de área, telephone, priceRange `$140.000 - $200.000 CLP`, image) |
| Perfiles | + Service (2 Offer en CLP), BreadcrumbList (Inicio › Artistas › Nombre) | Completas; `@id` coherentes |

Sin `AggregateRating`/`Review`, a propósito (ver C1).

### Rendimiento — 72
Peso transferido (build local; las cifras de tiempo no son representativas):

| Página | Perfil | v1 (sitio) | v2 (rama) |
|---|---|---:|---:|
| `/` | Móvil | 7,3 MB | **4,7 MB** |
| `/vedetos/benjamin` | Móvil | 6,0 MB | **0,42 MB** |
| `/galeria` | Móvil | 0,6 MB | 0,57 MB |
| `/` | Escritorio | 6,2 MB | 6,2 MB |
| `/vedetos/benjamin` | Escritorio | 6,1 MB | 6,1 MB |

En móvil el video (3,8 MB) es ahora el 80 % del peso de la home. En escritorio no cambió: el siguiente salto es recomprimir los videos.

### IA / agentes — 68
`llms.txt` válido, entidad definida con JSON-LD y `sameAs`, contenido sin JS, bots permitidos. Falta material citable (preguntas y respuestas, datos verificables).

### Imágenes — 82
Imágenes de perfil y galería en WebP; `next/image` con `sizes` y lazy-loading; imágenes de compartir de 25–50 KB. Restan nombres de archivo y los originales sin uso.

---

## 4. Acciones prioritarias

1. **Desplegar** la rama `seo/fase-1` (merge a `main`). Sin esto, el puntaje público sigue en 47.
2. **Search Console:** verificar el dominio, enviar el sitemap y pedir la inspección de la home y de 2–3 perfiles.
3. **Decidir sobre las reseñas de demo** (C1): rotularlas o quitarlas. Es el mayor punto pendiente de contenido.
4. **Recomprimir videos** a < 1,5 MB (requiere ffmpeg: `ffmpeg -i in.mp4 -c:v libx264 -crf 28 -preset slow -an -movflags +faststart out.mp4`).
5. **Preguntas frecuentes** + ampliar `/nosotros` y `/contacto` (necesita tus políticas y datos).
6. Mejoras menores N1, N2 y N4.

Con 3–5 resueltos, el puntaje estimado sube a **~83–85**. Por encima de eso dependen de señales externas: perfil de Google Business, reseñas reales y enlaces.

---

## 5. Archivos de esta versión

- `crawl-v2.json` — datos on-page por URL (build local)
- `perf-v2-local.json` — peso por página y perfil (build local)

*Auditoría generada con la skill claude-seo v2.4.2 (AgriciDaniel, MIT) por Claude Opus 5.5 (Anthropic) vía Claude Code.*
