import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { Cotizador } from '@/components/cotizador'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'

export const metadata = {
  title: 'Cotizador — Luxx Producciones',
  description: 'Calcula el precio de tu despedida de soltera al instante.',
}

export default function CotizadorPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-transparent">
      <Navbar />
      <div className="pt-24">
        <Cotizador />
      </div>

      {/* Sección Llévate más de uno */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 pb-24">
        {/* Título */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
            <span className="text-white/50 font-sans text-[10px] font-semibold tracking-[0.4em] uppercase">
              Experiencia doble
            </span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
          </div>
          <h2
            className="font-serif text-[clamp(2rem,5vw,3.2rem)] font-bold leading-tight gold-text-glow"
            style={{
              background: 'linear-gradient(135deg, #ffe599 0%, #D4AF37 35%, #FFD700 55%, #e8c84a 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            ¿Por qué elegir uno cuando puedes tener más?
          </h2>
        </div>

        {/* Foto */}
        <div
          className="relative w-full rounded-2xl overflow-hidden border border-[#D4AF37]/20"
          style={{ boxShadow: '0 12px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(212,175,55,0.08)' }}
        >
          <Image
            src="/Galeria/Llevate.jpg"
            alt="Llévate más de un artista Luxx"
            width={1200}
            height={800}
            className="w-full h-auto object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0a18]/40 to-transparent pointer-events-none" />
        </div>
      </section>

      <Footer />
      <WhatsAppButton floating />
    </main>
  )
}
