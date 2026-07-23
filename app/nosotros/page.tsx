import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { GoldParticles } from '@/components/gold-particles'

const values = [
  {
    label: 'Curaduría',
    title: 'Elenco seleccionado',
    description: 'Cada intérprete es incorporado tras un proceso de selección riguroso. Evaluamos presencia escénica, carisma y la capacidad de hacer que cada celebración sea irrepetible.',
  },
  {
    label: 'Exclusividad',
    title: 'Coordinación a medida',
    description: 'Cada presentación se adapta al lugar, el horario y el carácter del evento. Los detalles no son un extra — son el estándar.',
  },
  {
    label: 'Discreción',
    title: 'Privacidad garantizada',
    description: 'Operamos con absoluta confidencialidad. La identidad de la anfitriona, la dirección y los detalles del evento nunca se comparten.',
  },
]

export default function NosotrosPage() {
  return (
    <main className="min-h-screen relative overflow-x-hidden" style={{ background: 'radial-gradient(ellipse 140% 90% at 50% 45%, #6b1572 0%, #4a1268 30%, #2b1368 58%, #221060 80%, #1a0848 100%)' }}>
      <GoldParticles count={30} className="fixed z-0" opacityClassName="opacity-55" />
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-16 pt-32 md:px-10 md:pb-24 md:pt-36">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-3xl">
            <span className="text-white/80 font-sans text-sm tracking-[0.34em] uppercase">
              Sobre Nosotros
            </span>
            <h1 className="mt-5 font-serif text-5xl font-bold leading-[0.95] text-[#F7E6AE] md:text-7xl">
              Donde el estilo se convierte en experiencia.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-[#D8D0E7]">
              Luxx Producciones nace de una observación simple: en Chile, el entretenimiento privado para mujeres se quedó atrapado en un formato que dejó de representarlas. Espacios sin criterio, perfiles improvisados, experiencias predecibles.
            </p>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#D8D0E7]">
              Decidimos cambiar la conversación. Construimos una productora donde cada show se piensa como una velada, cada artista se selecciona con criterio, y cada anfitriona recibe el trato de una invitada de honor.
            </p>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#D8D0E7]">
              Hoy producimos shows privados de alto impacto para celebraciones que merecen ser recordadas. Seleccionamos a cada artista. Coordinamos cada detalle. La anfitriona solo tiene que disfrutar.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[72rem]">
            <div className="absolute -right-6 top-6 h-[90%] w-[88%] rounded-[2.2rem] border border-[#D4AF37]/35" />
            <div className="relative overflow-hidden rounded-[2rem]" style={{ boxShadow: '0 0 0 2px rgba(212,175,55,0.55), 0 8px 32px rgba(212,175,55,0.12)' }}>
              <Image
                src="/Galeria/Nosotros.jpg"
                alt="Nosotros Luxx Producciones"
                width={900}
                height={600}
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 70vw, 38vw"
                className="w-full h-auto object-contain"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,7,17,0.08)_0%,rgba(10,7,17,0.24)_44%,rgba(10,7,17,0.5)_100%)]" />
            </div>
          </div>
        </div>
      </section>

<Footer />
      <WhatsAppButton floating />
    </main>
  )
}
