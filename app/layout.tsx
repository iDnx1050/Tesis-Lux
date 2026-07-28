import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter, Nunito_Sans } from 'next/font/google'
import { cookies } from 'next/headers'
import { AgeGate } from '@/components/age-gate'
import { AnnouncementBar } from '@/components/announcement-bar'
import { verifyAgeToken } from '@/lib/age-gate'
import './globals.css'

/**
 * Configuracion tipografica global del proyecto.
 * Se emplea una combinacion serif y sans serif para reforzar la
 * identidad editorial de Lux Producciones.
 */
const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
})

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
})

export const metadata: Metadata = {
  icons: {
    icon: '/icon.svg',
  },
  title: 'Luxx Producciones | Shows Premium en Chile',
  description: 'Los artistas más solicitados de Chile. Agenda tu show privado con Luxx Producciones — espectáculos de alto impacto para eventos privados, cumpleaños y celebraciones exclusivas.',
  keywords: ['shows privados', 'luxx producciones', 'artistas premium', 'chile', 'entretenimiento vip', 'shows exclusivos', 'eventos privados'],
  openGraph: {
    title: 'Luxx Producciones | Shows Premium en Chile',
    description: 'Los artistas más solicitados de Chile. Agenda tu show privado con Luxx Producciones.',
    siteName: 'Luxx Producciones',
    locale: 'es_CL',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#09060f',
  width: 'device-width',
  initialScale: 1,
}

/**
 * RootLayout define la estructura general compartida por todas las rutas.
 * En este nivel se incorporan tipografias, estilos globales y analitica.
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Verificación de edad EN EL SERVIDOR: se comprueba la firma HMAC de la cookie
  // luxx_av antes de renderizar. Si no es válida, el contenido (children) nunca
  // se envía al navegador — solo la pantalla de verificación. Esto no es
  // saltable desde las DevTools como lo era el gate puramente client-side.
  const cookieStore = await cookies()
  const ageVerified = verifyAgeToken(cookieStore.get('luxx_av')?.value)

  return (
    <html lang="es" className="dark">
      <body className={`${playfair.variable} ${inter.variable} ${nunitoSans.variable} font-sans antialiased text-[#F5F5F5]`}>
        <AnnouncementBar />
        {ageVerified ? children : <AgeGate />}
      </body>
    </html>
  )
}
