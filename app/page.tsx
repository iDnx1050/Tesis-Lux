import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import { businessJsonLd } from '@/lib/structured-data'
import { JsonLd } from '@/components/json-ld'
import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/hero-section'
import { PromoTicker } from '@/components/promo-ticker'
import { FeaturedVedetos } from '@/components/featured-vedetos'
import { EditorialShowcase } from '@/components/editorial-showcase'
import { CrossedTicker } from '@/components/crossed-ticker'
import { ClientPhotosCarousel } from '@/components/client-photos-carousel'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'

const HOME_TITLE = 'Luxx Producciones | Shows Premium en Chile'
const base = pageMetadata({
  title: 'Shows Premium en Chile',
  description:
    'Los artistas más solicitados de Chile. Agenda tu show privado con Luxx Producciones — espectáculos de alto impacto para despedidas de soltera, cumpleaños y celebraciones exclusivas.',
  path: '/',
})

// La home conserva el formato "marca | lema" en lugar de la plantilla.
export const metadata: Metadata = {
  ...base,
  title: { absolute: HOME_TITLE },
  openGraph: { ...base.openGraph, title: HOME_TITLE },
  twitter: { ...base.twitter, title: HOME_TITLE },
}

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-transparent">
      <JsonLd data={businessJsonLd()} />
      <Navbar />
      <HeroSection />
      <PromoTicker />
      <FeaturedVedetos />
      <EditorialShowcase />
      <CrossedTicker />
      <ClientPhotosCarousel />
      <Footer />
      <WhatsAppButton floating />
    </main>
  )
}
