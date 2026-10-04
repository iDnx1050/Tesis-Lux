import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter, Nunito_Sans } from 'next/font/google'
import { connection } from 'next/server'
import { AgeGate } from '@/components/age-gate'
import { AnnouncementBar } from '@/components/announcement-bar'
import { SITE_URL } from '@/lib/site'
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
  // Origen base con el que Next.js resuelve las URLs relativas de Open Graph
  // y de las canonicas. Debe coincidir con el dominio del sitemap y del
  // robots.txt; si no, Google descarta las URLs por pertenecer a otro host.
  metadataBase: new URL(SITE_URL),
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
    url: SITE_URL,
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
  // OBLIGATORIO: proxy.ts emite un CSP con nonce por request. Una página
  // prerenderizada en el build no lleva ese nonce en sus <script>, así que el
  // navegador los bloquea todos: React no hidrata y todo lo que anima
  // framer-motion se queda en opacity 0 (página "vacía"). connection() obliga
  // a renderizar cada request para que Next.js inyecte el nonce.
  await connection()

  // El contenido se renderiza SIEMPRE en el servidor. El aviso de edad es un
  // overlay del lado del cliente (<AgeGate />) que se superpone encima: ya no
  // hay cookie firmada ni verificación en el servidor. Esto permite que Google
  // indexe las páginas y evita que un fallo de JS deje la pantalla en blanco.
  return (
    <html lang="es" className="dark">
      <body className={`${playfair.variable} ${inter.variable} ${nunitoSans.variable} font-sans antialiased text-[#F5F5F5]`}>
        <AnnouncementBar />
        {children}
        <AgeGate />
      </body>
    </html>
  )
}
