import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import { Navbar } from '@/components/navbar'
import { EventGallery } from '@/components/event-gallery'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'

export const metadata: Metadata = pageMetadata({
  title: 'Galería de Eventos',
  description:
    'Fotos de despedidas de soltera, cumpleaños y eventos privados realizados por Luxx Producciones. Mira cómo se viven nuestros shows.',
  path: '/galeria',
})

export default function GaleriaPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-transparent">
      <Navbar />
      <div className="pt-20">
        <EventGallery />
      </div>
      <Footer />
      <WhatsAppButton floating />
    </main>
  )
}
