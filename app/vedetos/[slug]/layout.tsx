import type { Metadata } from 'next'
import { vedetos } from '@/lib/mock-data'
import { pageMetadata } from '@/lib/seo'
import { vedetoJsonLd } from '@/lib/structured-data'
import { JsonLd } from '@/components/json-ld'

const clp = (n: number) => `$${n.toLocaleString('es-CL')}`

/**
 * Metadata de cada perfil. La pagina es un Client Component, asi que el
 * titulo, la canonica y la imagen para compartir se generan aqui.
 * Las imagenes de public/og/ son JPEG 1200x630 generados a partir de la foto
 * principal de cada artista (vedeto.image).
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const vedeto = vedetos.find((v) => v.slug === slug)
  if (!vedeto) return {}

  const desde = Math.min(...vedeto.pricing.map((p) => p.price))
  return pageMetadata({
    title: `${vedeto.name} — Show privado en Santiago`,
    // Precio primero: Google corta la descripcion cerca de los 155 caracteres.
    description: `Contrata a ${vedeto.name} para tu despedida de soltera o evento privado en Santiago. Planes desde ${clp(desde)} CLP. ${vedeto.shortDescription}`,
    path: `/vedetos/${vedeto.slug}`,
    image: `/og/${vedeto.slug}.jpg`,
  })
}

export default async function VedetoLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const vedeto = vedetos.find((v) => v.slug === slug)
  return (
    <>
      {vedeto && <JsonLd data={vedetoJsonLd(vedeto)} />}
      {children}
    </>
  )
}
