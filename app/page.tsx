import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/hero-section'
import { PromoTicker } from '@/components/promo-ticker'
import { FeaturedVedetos } from '@/components/featured-vedetos'
import { EditorialShowcase } from '@/components/editorial-showcase'
import { CrossedTicker } from '@/components/crossed-ticker'
import { ClientPhotosCarousel } from '@/components/client-photos-carousel'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-transparent">
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
