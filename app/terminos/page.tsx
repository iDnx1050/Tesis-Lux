import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Términos y Condiciones | Luxx Producciones',
  description: 'Términos y condiciones del servicio de Luxx Producciones.',
}

export default function TerminosPage() {
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
            <FileText className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#D4AF37]">Legal</p>
            <h1 className="font-serif text-3xl italic text-white">Términos y Condiciones</h1>
          </div>
        </div>

        <p className="text-sm text-[#8877aa]">Última actualización: 22 de abril de 2026</p>

        <LegalSection title="1. Aceptación de los Términos">
          <p>
            Al acceder o utilizar la plataforma <strong className="text-white">Luxx Producciones</strong> y sus servicios,
            declaras haber leído, comprendido y aceptado los presentes Términos y Condiciones en su totalidad.
            Si no estás de acuerdo, debes abstenerte de usar el servicio.
          </p>
          <p>
            El uso de este sitio está restringido a personas <strong className="text-white">mayores de 18 años</strong>.
            Al continuar, confirmas que cumples con este requisito.
          </p>
        </LegalSection>

        <LegalSection title="2. Descripción del Servicio">
          <p>
            Luxx Producciones es una plataforma de intermediación para la contratación de shows de entretenimiento
            adulto para eventos privados en Chile. El servicio incluye:
          </p>
          <ul>
            <li>Catálogo de talentos (vedetos) con descripción y disponibilidad.</li>
            <li>Sistema de reservas en línea con selección de fecha, hora y plan.</li>
            <li>Procesamiento de pagos mediante Transbank Webpay Plus.</li>
            <li>Coordinación logística entre el talento y el cliente.</li>
          </ul>
        </LegalSection>

        <LegalSection title="3. Reservas y Confirmación">
          <p>
            Una reserva se considera <strong className="text-white">confirmada</strong> únicamente cuando:
          </p>
          <ul>
            <li>El pago ha sido procesado exitosamente por Transbank.</li>
            <li>El cliente ha recibido confirmación por correo electrónico.</li>
            <li>El talento ha aceptado la disponibilidad para la fecha solicitada.</li>
          </ul>
          <p>
            Luxx Producciones se reserva el derecho de rechazar o cancelar una reserva si la disponibilidad
            del talento cambia por causas de fuerza mayor, con reembolso íntegro al cliente.
          </p>
        </LegalSection>

        <LegalSection title="4. Precios y Pagos">
          <p>
            Todos los precios están expresados en <strong className="text-white">Pesos Chilenos (CLP)</strong> e
            incluyen IVA cuando corresponda. El precio final se calcula y confirma en el servidor antes de
            iniciar el proceso de pago — el valor mostrado en pantalla es el valor definitivo a cobrar.
          </p>
          <p>
            Los pagos se procesan a través de <strong className="text-white">Transbank Webpay Plus</strong>,
            plataforma certificada por la industria financiera chilena. Luxx Producciones no almacena datos de
            tarjetas de crédito ni débito.
          </p>
        </LegalSection>

        <LegalSection title="5. Política de Cancelación y Reembolsos">
          <ul>
            <li><strong className="text-white">Cancelación con más de 72 horas:</strong> Reembolso del 100% del valor pagado.</li>
            <li><strong className="text-white">Cancelación entre 24 y 72 horas:</strong> Reembolso del 50% del valor pagado.</li>
            <li><strong className="text-white">Cancelación con menos de 24 horas:</strong> Sin reembolso, salvo casos de fuerza mayor debidamente acreditados.</li>
            <li><strong className="text-white">No-show del talento:</strong> Reembolso del 100% más compensación equivalente al 20% del valor del show.</li>
          </ul>
          <p>
            Las solicitudes de reembolso deben realizarse a{' '}
            <a href="mailto:contacto@luxxproducciones.cl" className="text-[#D4AF37] underline hover:brightness-110">
              contacto@luxxproducciones.cl
            </a>{' '}
            indicando el número de reserva.
          </p>
        </LegalSection>

        <LegalSection title="6. Conducta del Usuario">
          <p>Al utilizar el servicio, el usuario se compromete a:</p>
          <ul>
            <li>Proporcionar información veraz y actualizada durante el proceso de reserva.</li>
            <li>No suplantar la identidad de terceros.</li>
            <li>No utilizar el servicio para actividades ilegales o que vulneren derechos de terceros.</li>
            <li>Respetar la dignidad e integridad de los talentos en todo momento.</li>
            <li>No grabar ni difundir el show sin autorización expresa del talento y de Luxx Producciones.</li>
          </ul>
        </LegalSection>

        <LegalSection title="7. Limitación de Responsabilidad">
          <p>
            Luxx Producciones actúa como intermediario entre el cliente y el talento. No somos responsables de:
          </p>
          <ul>
            <li>Daños o perjuicios derivados de eventos de fuerza mayor (cortes de luz, catástrofes naturales, etc.).</li>
            <li>Incumplimientos del talento atribuibles exclusivamente a éste.</li>
            <li>Daños indirectos, emergentes o lucro cesante.</li>
          </ul>
          <p>
            En ningún caso nuestra responsabilidad total excederá el monto pagado por la reserva específica
            que dio origen al reclamo.
          </p>
        </LegalSection>

        <LegalSection title="8. Propiedad Intelectual">
          <p>
            Todo el contenido de esta plataforma (textos, imágenes, diseño, código fuente) es propiedad de
            Luxx Producciones o de sus licenciantes. Queda prohibida su reproducción total o parcial sin
            autorización escrita previa.
          </p>
        </LegalSection>

        <LegalSection title="9. Legislación Aplicable">
          <p>
            Los presentes Términos y Condiciones se rigen por las leyes de la República de Chile.
            Cualquier controversia será sometida a los tribunales ordinarios de justicia competentes.
          </p>
        </LegalSection>

        <div className="border-t border-[#2a1f3d] pt-8 text-center">
          <p className="text-xs text-[#5a4f75]">
            © {new Date().getFullYear()} Luxx Producciones · Todos los derechos reservados ·{' '}
            <Link href="/privacidad" className="underline hover:text-[#b3acc4] transition">Política de Privacidad</Link>
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
