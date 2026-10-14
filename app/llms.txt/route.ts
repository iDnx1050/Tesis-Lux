import { vedetos } from '@/lib/mock-data'
import { SITE_URL } from '@/lib/site'
import { CONTACT } from '@/lib/structured-data'

/**
 * /llms.txt (llmstxt.org): resumen en Markdown para asistentes de IA.
 * Google Search lo ignora; Lighthouse y otros agentes si lo leen.
 * Se genera desde lib/mock-data para que la lista de artistas no quede
 * desactualizada al agregar o quitar un perfil.
 */
export const dynamic = 'force-static'

const clp = (n: number) => `$${n.toLocaleString('es-CL')}`

export function GET() {
  const prices = vedetos.flatMap((v) => v.pricing.map((p) => p.price))
  const body = `# Luxx Producciones

> Agencia de shows privados para despedidas de soltera, cumpleaños y celebraciones en Santiago, Chile. Sitio solo para mayores de 18 años. Reservas y pago online; planes desde ${clp(Math.min(...prices))} CLP.

Contacto: WhatsApp ${CONTACT.telephone}, ${CONTACT.email}, Instagram ${CONTACT.instagram}

## Artistas

${vedetos.map((v) => `- [${v.name}](${SITE_URL}/vedetos/${v.slug}): ${v.shortDescription}`).join('\n')}

## Servicios

- [Cotizador](${SITE_URL}/cotizador): calcula el precio de una despedida de soltera y cuánto pone cada invitada
- [Extras](${SITE_URL}/extras): limusina, decoración y coctelería para el evento
- [Galería](${SITE_URL}/galeria): fotos de eventos realizados

## Políticas

- [Política de eventos](${SITE_URL}/politica-eventos): requisitos, conducta, logística y penalidades
- [Términos y condiciones](${SITE_URL}/terminos): reservas, pagos, cancelaciones y reembolsos
- [Política de privacidad](${SITE_URL}/privacidad): tratamiento de datos conforme a la Ley N° 21.719

## Optional

- [Nosotros](${SITE_URL}/nosotros)
- [Contacto](${SITE_URL}/contacto)
`
  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}
