import { Navbar } from '@/components/navbar'
import { EventGallery } from '@/components/event-gallery'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'

export const metadata = {
  title: 'Galería — LUXX Producciones',
  description: 'Fotos exclusivas de nuestros eventos privados.',
}

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
