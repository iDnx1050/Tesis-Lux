import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter, Nunito_Sans } from 'next/font/google'
import { connection } from 'next/server'
import { AgeGate } from '@/components/age-gate'
import { AnnouncementBar } from '@/components/announcement-bar'
import { SITE_URL } from '@/lib/site'
import { SITE_NAME } from '@/lib/seo'
import { siteJsonLd } from '@/lib/structured-data'
import { JsonLd } from '@/components/json-ld'
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
  // Iconos por convencion de archivos: app/icon.svg, app/favicon.ico y
  // app/apple-icon.png. Declarar `icons` aqui dejaria fuera el apple-touch-icon.
  // Cada pagina define solo su titulo; la plantilla agrega la marca para que
  // todos los <title> sigan el mismo formato.
  title: {
    default: 'Luxx Producciones | Shows Premium en Chile',
    template: `%s | ${SITE_NAME}`,
  },
  description: 'Los artistas más solicitados de Chile. Agenda tu show privado con Luxx Producciones — espectáculos de alto impacto para eventos privados, cumpleaños y celebraciones exclusivas.',
  // Sin canonica ni og:url aqui: se heredarian a paginas que no las definen
  // (p. ej. /checkout) y todas apuntarian a la home. Cada pagina las declara
  // con pageMetadata() de lib/seo.ts.
  openGraph: {
    siteName: SITE_NAME,
    locale: 'es_CL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  // Google pide etiquetar los sitios +18 para que SafeSearch los clasifique
  // por pagina y no tome acciones sobre todo el dominio.
  other: {
    rating: 'adult',
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
        <JsonLd data={siteJsonLd()} />
        <AnnouncementBar />
        {children}
        <AgeGate />
      </body>
    </html>
  )
}
