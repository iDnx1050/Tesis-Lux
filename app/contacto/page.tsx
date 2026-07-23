import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { GoldParticles } from '@/components/gold-particles'

const WHATSAPP_URL = 'https://wa.me/56945501752?text=Hola,%20me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Luxx%20Producciones.'

export default function ContactoPage() {
  return (
    <main className="relative overflow-x-hidden flex flex-col min-h-screen" style={{ background: 'radial-gradient(ellipse 140% 90% at 50% 45%, #6b1572 0%, #4a1268 30%, #2b1368 58%, #221060 80%, #1a0848 100%)' }}>
      <GoldParticles count={30} className="fixed z-0" opacityClassName="opacity-55" />
      <Navbar />

      <section className="relative overflow-hidden px-6 pb-14 pt-32 md:px-10 md:pb-24 md:pt-40 flex-1 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative mx-auto max-w-3xl text-center z-10">
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
            <span className="text-[#D4AF37] font-sans text-sm tracking-[0.34em] uppercase">Contacto</span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
          </div>
          <h1 className="mt-5 font-serif text-5xl font-bold leading-[0.95] text-[#F7E6AE] md:text-7xl">
            Conversemos tu próxima experiencia.
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-[#D8D0E7]">
            Escríbenos por WhatsApp y te respondemos rápido. Coordinamos cada detalle de forma personalizada y discreta.
          </p>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#25D366] text-white font-sans text-sm tracking-wider uppercase font-semibold rounded-sm transition-all duration-300 min-h-[56px] animate-wa-pulse"
            style={{
              boxShadow: '0 0 24px rgba(37,211,102,0.5), 0 0 48px rgba(37,211,102,0.25)',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 flex-shrink-0">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.046 21.8a.5.5 0 00.61.637l4.8-1.525A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm5.47 12.385c-.23.644-1.348 1.23-1.848 1.308-.47.072-.847.103-1.268-.08-.233-.1-.532-.234-.91-.41-1.598-.737-2.64-2.338-2.72-2.446-.08-.107-.65-.864-.65-1.648 0-.784.41-1.17.556-1.33.146-.16.32-.2.426-.2h.306c.098 0 .23-.037.36.275.133.316.45 1.094.49 1.173.04.08.066.173.013.28-.053.106-.08.172-.16.265-.08.093-.168.208-.24.28-.08.08-.163.166-.07.326.093.16.414.682.888 1.104.61.543 1.124.71 1.284.79.16.08.253.067.346-.04.093-.107.4-.466.507-.626.106-.16.213-.133.36-.08.146.053 1.12.53 1.28.61.16.08.266.12.306.186.04.067.04.386-.19 1.03z"/>
            </svg>
            Consultar por WhatsApp
          </a>
        </div>
      </section>

      <Footer />
      <WhatsAppButton floating />
    </main>
  )
}
