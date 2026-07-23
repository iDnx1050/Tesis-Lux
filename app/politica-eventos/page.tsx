import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, CalendarCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Política de Eventos | Luxx Producciones',
  description: 'Reglas, condiciones y lineamientos para la realización de eventos con Luxx Producciones.',
}

export default function PoliticaEventosPage() {
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
            <CalendarCheck className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#D4AF37]">Legal</p>
            <h1 className="font-serif text-3xl italic text-white">Política de Eventos</h1>
          </div>
        </div>

        <p className="text-sm text-[#8877aa]">Última actualización: 22 de abril de 2026</p>

        <LegalSection title="1. Requisitos para Contratar un Show">
          <ul>
            <li>El organizador del evento debe ser mayor de <strong className="text-white">18 años</strong> y presentar identificación válida si se solicita.</li>
            <li>El evento debe realizarse en un espacio privado, con acceso controlado y reservado exclusivamente para adultos.</li>
            <li>El organizador es responsable de garantizar que todos los asistentes sean mayores de 18 años.</li>
            <li>El espacio debe cumplir con condiciones mínimas de seguridad, iluminación, acceso y sanitarios.</li>
          </ul>
        </LegalSection>

        <LegalSection title="2. Condiciones del Lugar del Evento">
          <p>El cliente se compromete a proporcionar:</p>
          <ul>
            <li>Un espacio adecuado para la actuación, con al menos <strong className="text-white">9 m²</strong> de área libre despejada.</li>
            <li>Sistema de sonido funcional (altavoces) o coordinar el equipo con Luxx Producciones.</li>
            <li>Acceso para el equipo de producción con mínimo <strong className="text-white">30 minutos de anticipación</strong>.</li>
            <li>Estacionamiento o zona de arribo cercana para el transporte del talento y equipos.</li>
          </ul>
        </LegalSection>

        <LegalSection title="3. Conducta Durante el Show">
          <p>Para garantizar la seguridad e integridad de todos los participantes:</p>
          <ul>
            <li><strong className="text-white">Prohibido</strong> fotografiar, filmar o transmitir en vivo el show sin autorización expresa y escrita de Luxx Producciones y del talento.</li>
            <li><strong className="text-white">Prohibido</strong> el contacto físico no autorizado con el talento. El talento tiene derecho a detener el show ante cualquier conducta inapropiada.</li>
            <li><strong className="text-white">Prohibido</strong> el ingreso de menores de edad al espacio mientras se realiza el show.</li>
            <li>El consumo de alcohol y otras sustancias debe mantenerse dentro de los límites legales. No se realizará el show ante público visiblemente en estado de ebriedad severa que represente un riesgo.</li>
          </ul>
        </LegalSection>

        <LegalSection title="4. Derechos del Talento">
          <p>Los talentos de Luxx Producciones tienen derecho a:</p>
          <ul>
            <li>Interrumpir o abandonar el show si su seguridad física o integridad personal está en riesgo.</li>
            <li>Exigir el cumplimiento de las condiciones pactadas (espacio, sonido, puntualidad).</li>
            <li>Negarse a realizar actos o conductas que no estén pactados en el contrato de servicio.</li>
            <li>No ser fotografiados o filmados sin su consentimiento.</li>
          </ul>
          <p>
            El incumplimiento de estas condiciones por parte del cliente puede resultar en la cancelación
            del show <strong className="text-white">sin reembolso</strong>.
          </p>
        </LegalSection>

        <LegalSection title="5. Logística y Coordinación">
          <ul>
            <li><strong className="text-white">Confirmación de dirección:</strong> El cliente debe confirmar la dirección exacta del evento con mínimo 24 horas de anticipación.</li>
            <li><strong className="text-white">Cambios de horario:</strong> Se aceptan con un mínimo de 48 horas de anticipación, sujetos a disponibilidad.</li>
            <li><strong className="text-white">Retrasos:</strong> Si el talento debe esperar más de 30 minutos por causas atribuibles al cliente, se puede cobrar un recargo de coordinación.</li>
            <li><strong className="text-white">Transporte:</strong> En casos de eventos fuera de la Región Metropolitana, los gastos de traslado se coordinan por separado.</li>
          </ul>
        </LegalSection>

        <LegalSection title="6. Privacidad del Evento">
          <p>
            Luxx Producciones garantiza la <strong className="text-white">confidencialidad absoluta</strong> sobre
            la identidad del cliente, la dirección y los detalles del evento. Esta información no será
            compartida con terceros ni utilizada con fines publicitarios sin consentimiento expreso.
          </p>
          <p>
            Los datos del evento son tratados como <strong className="text-white">datos sensibles</strong> conforme
            al Art. 2 de la Ley N° 21.719, y reciben el nivel más alto de protección disponible.
          </p>
        </LegalSection>

        <LegalSection title="7. Incumplimiento y Penalidades">
          <p>El incumplimiento de esta política por parte del cliente puede resultar en:</p>
          <ul>
            <li>Interrupción inmediata del show sin reembolso.</li>
            <li>Bloqueo del acceso a futuras reservas en la plataforma.</li>
            <li>Acciones legales en caso de daños materiales o morales al talento.</li>
          </ul>
        </LegalSection>

        <div className="border-t border-[#2a1f3d] pt-8 text-center">
          <p className="text-xs text-[#5a4f75]">
            © {new Date().getFullYear()} Luxx Producciones ·{' '}
            <Link href="/terminos" className="underline hover:text-[#b3acc4] transition">Términos y Condiciones</Link>
            {' · '}
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
