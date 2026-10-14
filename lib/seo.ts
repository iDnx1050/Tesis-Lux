import type { Metadata } from 'next'

export const SITE_NAME = 'Luxx Producciones'

interface PageMetadataInput {
  /** Titulo sin la marca: el layout agrega " | Luxx Producciones". */
  title: string
  description: string
  /** Ruta absoluta desde la raiz ("/vedetos"); Next.js la resuelve con metadataBase. */
  path: string
  /** Imagen propia para compartir (JPEG 1200x630); por defecto la general. */
  image?: string
}

// Imagen general (app/opengraph-image.jpg). Se declara explicitamente porque
// al definir openGraph en una pagina, Next.js deja de heredar la del layout.
const DEFAULT_OG_IMAGE = '/opengraph-image.jpg'

/**
 * Metadata por pagina con canonica y Open Graph propios.
 *
 * Next.js reemplaza el objeto openGraph completo en vez de fusionarlo con el
 * del layout, asi que siteName, locale y type se repiten aqui; si no, cada
 * pagina compartida mostraria el titulo y la URL de la home.
 */
export function pageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
}: PageMetadataInput): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: 'es_CL',
      type: 'website',
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
  }
}
