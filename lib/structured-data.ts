import type { Vedeto } from './types'
import { vedetos } from './mock-data'
import { SITE_NAME } from './seo'
import { SITE_URL } from './site'

/**
 * Datos estructurados Schema.org (JSON-LD) del sitio.
 *
 * Los nodos se enlazan por @id para que Google los lea como una sola entidad:
 * el negocio publica el sitio y presta los servicios de cada perfil.
 *
 * Deliberadamente NO se incluyen AggregateRating ni Review: las calificaciones
 * que muestra la UI salen de lib/mock-data y Google penaliza el marcado de
 * reseñas que no son verificables.
 */

export const CONTACT = {
  telephone: '+56945501752',
  email: 'contacto@luxxproducciones.cl',
  instagram: 'https://www.instagram.com/luxx.producciones/',
}

const ORG_ID = `${SITE_URL}/#organization`
const BUSINESS_ID = `${SITE_URL}/#business`
const WEBSITE_ID = `${SITE_URL}/#website`

const AREA_SERVED = {
  '@type': 'AdministrativeArea',
  name: 'Región Metropolitana de Santiago',
}

const allPrices = vedetos.flatMap((v) => v.pricing.map((p) => p.price))
const clp = (n: number) => `$${n.toLocaleString('es-CL')}`

/** Organizacion y sitio web: van en todas las paginas (layout raiz). */
export function siteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': ORG_ID,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        email: CONTACT.email,
        sameAs: [CONTACT.instagram],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: CONTACT.telephone,
          contactType: 'customer service',
          availableLanguage: 'es',
          areaServed: 'CL',
        },
      },
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: 'es-CL',
        publisher: { '@id': ORG_ID },
      },
    ],
  }
}

/** Negocio de entretenimiento (home). Sin local fisico: solo area de servicio. */
export function businessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EntertainmentBusiness',
    '@id': BUSINESS_ID,
    name: SITE_NAME,
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image.jpg`,
    logo: `${SITE_URL}/logo.png`,
    telephone: CONTACT.telephone,
    email: CONTACT.email,
    priceRange: `${clp(Math.min(...allPrices))} - ${clp(Math.max(...allPrices))} CLP`,
    currenciesAccepted: 'CLP',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Santiago',
      addressRegion: 'Región Metropolitana',
      addressCountry: 'CL',
    },
    areaServed: AREA_SERVED,
    parentOrganization: { '@id': ORG_ID },
    sameAs: [CONTACT.instagram],
  }
}

/** Servicio con sus planes y ruta de navegacion de un perfil. */
export function vedetoJsonLd(vedeto: Vedeto) {
  const url = `${SITE_URL}/vedetos/${vedeto.slug}`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: `Show privado de ${vedeto.name}`,
        serviceType: 'Show privado para eventos',
        description: vedeto.shortDescription,
        url,
        image: `${SITE_URL}/og/${vedeto.slug}.jpg`,
        provider: { '@id': BUSINESS_ID },
        areaServed: AREA_SERVED,
        offers: vedeto.pricing.map((tier) => ({
          '@type': 'Offer',
          name: tier.name,
          description: `${tier.duration}. ${tier.description}`,
          price: tier.price,
          priceCurrency: 'CLP',
          url,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Artistas', item: `${SITE_URL}/vedetos` },
          { '@type': 'ListItem', position: 3, name: vedeto.name, item: url },
        ],
      },
    ],
  }
}
