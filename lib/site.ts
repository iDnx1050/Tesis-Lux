/**
 * URL canonica del sitio en produccion.
 *
 * Se centraliza aqui para que el sitemap, el robots.txt y los metadatos de
 * Open Graph compartan siempre el mismo origen: si alguno difiere, Google
 * descarta el sitemap por "URLs de otro dominio".
 *
 * NEXT_PUBLIC_APP_URL permite sobreescribirla en los deploy previews de
 * Netlify sin tocar el codigo. La barra final se elimina para poder
 * concatenar rutas (`${SITE_URL}/vedetos`) sin generar dobles slashes.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_APP_URL ?? 'https://vedetoslux.cl'
).replace(/\/+$/, '')
