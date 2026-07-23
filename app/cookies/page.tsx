import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Cookie } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Política de Cookies | Luxx Producciones',
  description: 'Información sobre el uso de cookies y tecnologías de seguimiento en Luxx Producciones.',
}

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-[#0e0a18] text-[#F5F5F5]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(180deg,#0e0a18_0%,#130e22_22%,#1a1229_44%,#1e1430_68%,#110d1e_100%)]" />

      <header className="sticky top-0 z-40 border-b border-[#2a1f3d] bg-[#0e0a18]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-serif text-2xl font-semibold italic tracking-tight text-[#D4AF37]">
            LUXX
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 rounded-xl border border-[#2a1f3d] bg-[#1a1229] px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#F5F5F5] transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-16 space-y-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
            <Cookie className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#D4AF37]">Legal</p>
            <h1 className="font-serif text-3xl italic text-white">Política de Cookies</h1>
          </div>
        </div>

        <p className="text-sm text-[#8877aa]">Última actualización: 22 de abril de 2026</p>

        <LegalSection title="1. ¿Qué son las Cookies?">
          <p>
            Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un
            sitio web. Nos permiten recordar tus preferencias y mejorar tu experiencia de navegación.
          </p>
        </LegalSection>

        <LegalSection title="2. Cookies que Utilizamos">
          <p>Luxx Producciones utiliza únicamente las siguientes cookies:</p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#2a1f3d]">
                  <th className="text-left py-3 pr-4 text-[10px] uppercase tracking-wider text-[#D4AF37]">Cookie</th>
                  <th className="text-left py-3 pr-4 text-[10px] uppercase tracking-wider text-[#D4AF37]">Tipo</th>
                  <th className="text-left py-3 pr-4 text-[10px] uppercase tracking-wider text-[#D4AF37]">Finalidad</th>
                  <th className="text-left py-3 text-[10px] uppercase tracking-wider text-[#D4AF37]">Duración</th>
                </tr>
              </thead>
              <tbody className="text-[#b3acc4]">
                <tr className="border-b border-[#1a1229]">
                  <td className="py-3 pr-4 font-mono text-xs">luxx_age_verified</td>
                  <td className="py-3 pr-4">Necesaria</td>
                  <td className="py-3 pr-4">Verificación de mayoría de edad — evita mostrar el aviso repetidamente en la misma sesión</td>
                  <td className="py-3">Sesión (se elimina al cerrar el navegador)</td>
                </tr>
                <tr className="border-b border-[#1a1229]">
                  <td className="py-3 pr-4 font-mono text-xs">_vercel_analytics</td>
                  <td className="py-3 pr-4">Analítica</td>
                  <td className="py-3 pr-4">Estadísticas de visitas agregadas y anónimas — sin seguimiento entre sitios</td>
                  <td className="py-3">Sesión</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-xs">next-auth.session*</td>
                  <td className="py-3 pr-4">Necesaria</td>
                  <td className="py-3 pr-4">Gestión de sesión de usuario autenticado (Fase 2 — aún no activa)</td>
                  <td className="py-3">30 días (httpOnly, Secure)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="border border-[#D4AF37]/20 bg-[#D4AF37]/5 rounded-xl p-4 text-sm">
            ✅ <strong className="text-[#D4AF37]">Sin cookies de terceros para publicidad.</strong> No utilizamos
            cookies de Google Ads, Facebook Pixel, ni ningún otro sistema de publicidad comportamental.
          </p>
        </LegalSection>

        <LegalSection title="3. Base Legal para el Uso de Cookies">
          <ul>
            <li><strong className="text-white">Cookies necesarias:</strong> Interés legítimo (Art. 12 letra f) y funcionamiento del servicio. No requieren consentimiento previo.</li>
            <li><strong className="text-white">Cookies analíticas:</strong> Consentimiento implícito al continuar la navegación, dado que son completamente anónimas y no permiten identificar a personas individuales.</li>
          </ul>
        </LegalSection>

        <LegalSection title="4. Cómo Gestionar las Cookies">
          <p>Puedes controlar y eliminar las cookies desde la configuración de tu navegador:</p>
          <ul>
            <li><strong className="text-white">Chrome:</strong> Configuración → Privacidad y seguridad → Cookies y otros datos de sitios</li>
            <li><strong className="text-white">Firefox:</strong> Preferencias → Privacidad y seguridad → Cookies y datos del sitio</li>
            <li><strong className="text-white">Safari:</strong> Preferencias → Privacidad → Gestionar datos del sitio web</li>
            <li><strong className="text-white">Edge:</strong> Configuración → Privacidad, búsqueda y servicios → Cookies</li>
          </ul>
          <p>
            Ten en cuenta que desactivar la cookie <code className="text-[#D4AF37] font-mono text-xs bg-[#1a1229] px-1 py-0.5 rounded">luxx_age_verified</code> hará
            que el aviso de verificación de edad se muestre en cada visita.
          </p>
        </LegalSection>

        <LegalSection title="5. Actualizaciones">
          <p>
            Esta política puede actualizarse cuando incorporemos nuevas tecnologías o cambie la legislación
            aplicable. La fecha de actualización al inicio del documento te indica la versión vigente.
          </p>
        </LegalSection>

        <div className="border-t border-[#2a1f3d] pt-8 text-center">
          <p className="text-xs text-[#5a4f75]">
            © {new Date().getFullYear()} Luxx Producciones ·{' '}
            <Link href="/privacidad" className="underline hover:text-[#b3acc4] transition">Política de Privacidad</Link>
            {' · '}
            <Link href="/terminos" className="underline hover:text-[#b3acc4] transition">Términos y Condiciones</Link>
          </p>
        </div>
      </section>
    </main>
  )
}

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="font-serif text-xl text-[#D4AF37]">{title}</h2>
      <div className="space-y-3 text-sm leading-7 text-[#b3acc4] [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:list-disc [&_strong]:font-semibold [&_a]:transition">
        {children}
      </div>
    </div>
  )
}
