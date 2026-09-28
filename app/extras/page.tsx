import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { LimusinasSelector } from '@/components/limusinas-selector'

export const metadata = {
  title: 'Extras — Luxx Producciones',
  description: 'Servicios adicionales para tu evento: decoración y coctelería.',
}

const EXTRAS = [
  {
    id: 'limusina',
    tag: 'Transporte VIP',
    title: 'Limusina',
    description:
      'Llega en grande. Servicio de limusina para que tú y tus amigas vivan la experiencia VIP desde el primer momento, antes de que empiece el show. El lujo empieza en el camino.',
    image: null,
    alt: 'Servicio de limusina VIP Luxx',
    wa: 'Hola, me interesa cotizar el servicio de limusina para mi evento 🚗 ¿Podrían orientarme?',
    imageHeight: 800,
  },
  {
    id: 'decoracion',
    tag: 'Ambientación',
    title: 'Decoración de Eventos',
    description:
      'Transformamos tu espacio en algo inolvidable. Desde arcos de globos hasta paneles shimmer, cada detalle está pensado para elevar el ambiente de tu celebración. Disponible para despedidas de soltera, cumpleaños y eventos corporativos.',
    image: '/Deco Lux.jpeg',
    alt: 'Opciones de decoración de eventos Luxx',
    wa: 'Hola, me interesa cotizar el servicio de decoración para mi evento 🎉 ¿Podrían orientarme?',
    imageHeight: 1500,
  },
  {
    id: 'cocteleria',
    tag: 'Gastronomía',
    title: 'Coctelería',
    description:
      'Completa tu show con una experiencia gastronómica de calidad. Tablas de charcutería, brochetas, mini cupcakes y limonadas artesanales — presentados con elegancia para que tú y tus amigas disfruten sin preocuparse de nada.',
    image: '/Cocteleria lux.jpeg',
    alt: 'Menús de coctelería para eventos Luxx',
    wa: 'Hola, me interesa cotizar el servicio de coctelería para mi evento 🥂 ¿Podrían orientarme?',
    imageHeight: 800,
  },
]

const GOLD = {
  background: 'linear-gradient(135deg, #ffe599 0%, #D4AF37 35%, #FFD700 55%, #e8c84a 100%)',
  backgroundSize: '200% auto',
  WebkitBackgroundClip: 'text' as const,
  WebkitTextFillColor: 'transparent' as const,
  backgroundClip: 'text' as const,
}

export default function ExtrasPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-transparent">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-16 px-4 sm:px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-1/3 left-1/4 h-[400px] w-[400px] rounded-full bg-[#D4AF37]/5 blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-[#6b21a8]/8 blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
            <span className="text-white/50 font-sans text-[10px] font-semibold tracking-[0.4em] uppercase">
              Servicios adicionales
            </span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
          </div>

          <h1
            className="font-serif text-[clamp(2.4rem,7vw,4rem)] font-bold leading-tight mb-5 gold-text-glow"
            style={GOLD}
          >
            Extras para tu Evento
          </h1>

          <p className="text-white/50 font-sans text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            Más allá del show, ofrecemos servicios que completan la experiencia. Elige lo que necesitas y personaliza tu velada al detalle.
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-24 space-y-20">
        {EXTRAS.map((item, i) => (
          <div key={item.id} className="group">

            {/* Label + title */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-8 bg-gradient-to-r from-[#D4AF37]/60 to-transparent" />
                <span className="text-[#D4AF37] font-sans text-[10px] font-semibold tracking-[0.35em] uppercase">
                  {item.tag}
                </span>
              </div>
              <h2 className="font-serif text-[clamp(1.8rem,4vw,2.6rem)] font-bold text-white">
                {item.title}
              </h2>
              <p className="mt-2 text-white/45 font-sans text-sm sm:text-base leading-relaxed max-w-2xl">
                {item.description}
              </p>
            </div>

            {item.image ? (
              <>
                {/* Image card */}
                <div
                  className="relative w-full rounded-2xl overflow-hidden border border-[#D4AF37]/20 transition-all duration-500 group-hover:border-[#D4AF37]/45"
                  style={{
                    boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.08)',
                  }}
                >
                  <Image
                    src={item.image}
                    alt={item.alt}
                    width={1200}
                    height={item.imageHeight}
                    className="w-full h-auto object-contain"
                    priority={i === 0}
                  />
                  {/* Gold shimmer on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/0 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>

                {/* CTA */}
                <div className="mt-6 flex justify-center sm:justify-start">
                  <a
                    href={`https://wa.me/56945501752?text=${encodeURIComponent(item.wa)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold-pulse inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-sans text-sm font-bold tracking-widest uppercase text-[#0e0a18] transition-all duration-300"
                    style={{
                      background: 'linear-gradient(135deg, #ffe599 0%, #D4AF37 45%, #b8922e 100%)',
                    }}
                  >
                    Cotizar este servicio →
                  </a>
                </div>
              </>
            ) : (
              // Limusinas: en vez de una imagen estática con los precios
              // quemados, la flota se elige y se cotiza en el propio sitio.
              <LimusinasSelector />
            )}
          </div>
        ))}
      </section>

      <Footer />
      <WhatsAppButton floating />
    </main>
  )
}
