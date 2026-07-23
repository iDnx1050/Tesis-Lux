import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { GoldParticles } from '@/components/gold-particles'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Paquetes Grupales | Luxx Producciones',
  description: 'Combina más de un artista y arma el show perfecto. Paquetes grupales de Luxx Producciones próximamente disponibles.',
}

export default function ConjuntosPage() {
  return (
    <main className="min-h-screen relative overflow-x-hidden" style={{ background: 'radial-gradient(ellipse 140% 90% at 50% 45%, #6b1572 0%, #4a1268 30%, #2b1368 58%, #221060 80%, #1a0848 100%)' }}>
      <GoldParticles count={30} className="fixed z-0" opacityClassName="opacity-55" />
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-16 pt-32 md:px-10 md:pb-24 md:pt-36">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative mx-auto max-w-7xl z-10">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            {/* Texto */}
            <div className="max-w-2xl">
              <span className="text-[#D4AF37] font-sans text-sm tracking-[0.34em] uppercase">
                Paquetes Especiales
              </span>
              <h1 className="mt-5 font-serif text-5xl font-bold leading-[0.95] text-[#F7E6AE] md:text-7xl">
                Paquetes Grupales
              </h1>
              <p className="mt-8 text-lg leading-8 text-[#D8D0E7]">
                Combina más de un artista y arma el show perfecto.
                Paquetes diseñados para eventos que quieren impactar en grande.
              </p>

              {/* Badge "Próximamente" */}
              <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/8 px-6 py-3">
                <span className="h-2 w-2 rounded-full bg-[#D4AF37] animate-pulse" />
                <span className="text-[#F1D17A] font-sans text-sm tracking-wider uppercase font-semibold">
                  Próximamente disponible
                </span>
              </div>

              <p className="mt-6 text-base leading-7 text-[#b3acc4]">
                Mientras tanto, puedes reservar artistas por separado o
                contactarnos directamente para coordinar un paquete personalizado.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <a
                  href="https://wa.me/56945501752?text=Hola,%20me%20interesa%20un%20paquete%20grupal%20de%20Luxx%20Producciones."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wapp-pulse inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-[#25D366] text-white font-sans text-sm tracking-wider uppercase font-semibold rounded-sm shadow-[0_0_24px_rgba(37,211,102,0.3)] min-h-[52px]"
                >
                  Consultar por WhatsApp
                </a>
                <Link href="/vedetos">
                  <button className="w-full sm:w-auto px-7 py-4 border border-[#D4AF37]/50 text-[#F1D17A] font-sans text-sm tracking-wider uppercase font-semibold rounded-sm min-h-[52px] hover:bg-[#D4AF37] hover:text-[#0A0A0A] transition-all duration-300">
                    Ver Artistas
                  </button>
                </Link>
              </div>
            </div>

            {/* Imagen */}
            <div className="relative mx-auto w-full max-w-[28rem]">
              <div className="absolute -right-4 top-4 h-[90%] w-[88%] rounded-[2rem] border border-[#D4AF37]/12" />
              <div className="relative aspect-[3/4] overflow-hidden rounded-[1.8rem] shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                <Image
                  src="/vedetos/Lleva2.webp"
                  alt="Paquetes grupales Luxx Producciones"
                  fill
                  sizes="(max-width: 1024px) 85vw, 42vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07050d]/45 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton floating />
    </main>
  )
}
