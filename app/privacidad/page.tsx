import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Política de Privacidad | Luxx Producciones',
  description: 'Información sobre el tratamiento de datos personales por parte de Luxx Producciones, conforme a la Ley N° 21.719 de Chile.',
}

export default function PoliticaPrivacidadPage() {
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
            <Shield className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#D4AF37]">Legal</p>
            <h1 className="font-serif text-3xl italic text-white">Política de Privacidad</h1>
          </div>
        </div>

        <p className="text-sm text-[#8877aa]">
          Última actualización: 22 de abril de 2026 · Vigente desde: 1 de diciembre de 2026 (Ley N° 21.719)
        </p>

        <LegalSection title="1. Responsable del Tratamiento">
          <p>
            <strong className="text-white">Luxx Producciones</strong> (en adelante, «el Responsable»),
            con domicilio en Chile, es responsable del tratamiento de los datos personales que se recopilen
            a través de la plataforma <strong className="text-white">luxxproducciones.cl</strong> y sus
            servicios relacionados.
          </p>
          <p>
            Contacto de privacidad:{' '}
            <a href="mailto:privacidad@luxxproducciones.cl" className="text-[#D4AF37] underline hover:brightness-110">
              privacidad@luxxproducciones.cl
            </a>
          </p>
        </LegalSection>

        <LegalSection title="2. Datos Personales que Recopilamos">
          <p>En la Fase actual, la plataforma no recopila datos personales de forma directa. Toda consulta
          se canaliza mediante WhatsApp (servicio externo operado por Meta Platforms, Inc.).</p>
          <p>Cuando se implemente el sistema completo de reservas, se recopilarán los siguientes datos:</p>
          <ul>
            <li><strong className="text-white">Identificación:</strong> Nombre completo, RUT o documento de identidad.</li>
            <li><strong className="text-white">Contacto:</strong> Correo electrónico, número de teléfono.</li>
            <li><strong className="text-white">Evento:</strong> Dirección del evento, fecha, horario, tipo de show solicitado.</li>
            <li><strong className="text-white">Pago:</strong> Los datos de pago son procesados exclusivamente por Transbank S.A. Luxx Producciones no almacena números de tarjeta, CVV ni datos de cuentas bancarias.</li>
          </ul>
          <p className="border border-[#D4AF37]/20 bg-[#D4AF37]/5 rounded-xl p-4 text-sm">
            ⚠️ <strong className="text-[#D4AF37]">Dato sensible:</strong> El tipo de show contratado (entretenimiento adulto) puede
            calificar como dato relativo a la vida sexual del titular conforme al Art. 2 de la Ley N° 21.719.
            Este dato recibe tratamiento especialmente cuidadoso: cifrado en reposo, acceso restringido
            y no se comparte con terceros salvo obligación legal.
          </p>
        </LegalSection>

        <LegalSection title="3. Finalidad y Base de Licitud">
          <p>Los datos personales se tratan con las siguientes finalidades y bases de licitud:</p>
          <table>
            <thead>
              <tr>
                <th>Finalidad</th>
                <th>Base de licitud (Art. 12 Ley 21.719)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Gestión y confirmación de reservas</td><td>Ejecución de contrato</td></tr>
              <tr><td>Comunicación sobre el servicio</td><td>Ejecución de contrato</td></tr>
              <tr><td>Cumplimiento de obligaciones tributarias</td><td>Obligación legal</td></tr>
              <tr><td>Mejora del servicio y análisis estadístico</td><td>Interés legítimo / Consentimiento</td></tr>
              <tr><td>Envío de comunicaciones comerciales</td><td>Consentimiento explícito</td></tr>
            </tbody>
          </table>
        </LegalSection>

        <LegalSection title="4. Plazo de Conservación">
          <ul>
            <li><strong className="text-white">Datos de reservas:</strong> 3 años desde la fecha del evento, por obligaciones tributarias y de facturación (SII).</li>
            <li><strong className="text-white">Datos de cuenta de usuario:</strong> 1 año desde el último acceso activo a la plataforma.</li>
            <li><strong className="text-white">Registros de seguridad (logs):</strong> 90 días, sin contenido de datos sensibles.</li>
            <li><strong className="text-white">Datos de comunicaciones comerciales:</strong> Hasta que el titular revoque su consentimiento.</li>
          </ul>
          <p>Transcurridos estos plazos, los datos serán eliminados de forma segura o anonimizados.</p>
        </LegalSection>

        <LegalSection title="5. Terceros Receptores de Datos">
          <ul>
            <li><strong className="text-white">Transbank S.A.</strong> — Procesamiento de pagos con tarjeta de crédito/débito. Datos transmitidos: monto de transacción, identificador de orden. No se transmiten datos de tarjeta directamente desde nuestra plataforma.</li>
            <li><strong className="text-white">Meta Platforms, Inc. (WhatsApp)</strong> — Canal de contacto. Los mensajes enviados por WhatsApp están sujetos a la política de privacidad de Meta.</li>
            <li><strong className="text-white">Vercel Inc.</strong> — Hosting e infraestructura. Datos de acceso (IP, user-agent) procesados según la política de privacidad de Vercel.</li>
            <li><strong className="text-white">Vercel Analytics</strong> — Análisis de tráfico web anonimizado, sin cookies de seguimiento entre sitios.</li>
          </ul>
          <p>No vendemos ni cedemos datos personales a terceros con fines comerciales.</p>
        </LegalSection>

        <LegalSection title="6. Derechos del Titular (ARCO+P)">
          <p>Conforme a los Arts. 18–24 de la Ley N° 21.719, tienes derecho a:</p>
          <ul>
            <li><strong className="text-white">Acceso:</strong> Solicitar información sobre qué datos tuyos tratamos y cómo.</li>
            <li><strong className="text-white">Rectificación:</strong> Corregir datos inexactos o desactualizados.</li>
            <li><strong className="text-white">Cancelación / Supresión:</strong> Solicitar la eliminación de tus datos cuando ya no sean necesarios.</li>
            <li><strong className="text-white">Oposición:</strong> Oponerte al tratamiento de tus datos para determinadas finalidades.</li>
            <li><strong className="text-white">Portabilidad:</strong> Obtener una copia de tus datos en formato estructurado y legible por máquina (JSON).</li>
          </ul>
          <p>
            Para ejercer estos derechos, escríbenos a{' '}
            <a href="mailto:privacidad@luxxproducciones.cl" className="text-[#D4AF37] underline hover:brightness-110">
              privacidad@luxxproducciones.cl
            </a>{' '}
            indicando tu nombre completo y el derecho que deseas ejercer. Responderemos en un plazo
            máximo de <strong className="text-white">15 días hábiles</strong>.
          </p>
        </LegalSection>

        <LegalSection title="7. Seguridad de los Datos">
          <p>Implementamos medidas técnicas y organizativas para proteger tus datos personales:</p>
          <ul>
            <li>Transmisión cifrada mediante TLS/HTTPS en todas las comunicaciones.</li>
            <li>Cifrado en reposo para datos de reservas (datos sensibles).</li>
            <li>Control de acceso por roles: solo personal autorizado accede a los datos.</li>
            <li>Registro de auditoría (logs) de accesos a datos sensibles.</li>
            <li>Revisiones periódicas de seguridad del sistema.</li>
          </ul>
        </LegalSection>

        <LegalSection title="8. Notificación de Brechas de Seguridad">
          <p>
            En caso de detectarse una brecha de seguridad que afecte tus datos personales,
            notificaremos a la <strong className="text-white">Agencia de Protección de Datos Personales (APDP)</strong> y
            a los titulares afectados dentro del plazo establecido en el Art. 40 de la Ley N° 21.719
            (máximo <strong className="text-white">72 horas</strong> desde que tengamos conocimiento del incidente).
          </p>
        </LegalSection>

        <LegalSection title="9. Modificaciones a esta Política">
          <p>
            Podemos actualizar esta política para reflejar cambios en el tratamiento de datos o en la
            legislación aplicable. La fecha de «Última actualización» al inicio del documento indica
            cuándo fue revisada por última vez. Te recomendamos revisarla periódicamente.
          </p>
        </LegalSection>

        <div className="border-t border-[#2a1f3d] pt-8 text-center">
          <p className="text-xs text-[#5a4f75]">
            © {new Date().getFullYear()} Luxx Producciones · Todos los derechos reservados ·{' '}
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
      <div className="space-y-3 text-sm leading-7 text-[#b3acc4] [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:list-disc [&_strong]:font-semibold [&_a]:transition [&_table]:w-full [&_table]:border-collapse [&_th]:text-left [&_th]:text-xs [&_th]:uppercase [&_th]:tracking-wider [&_th]:text-[#D4AF37] [&_th]:pb-2 [&_th]:border-b [&_th]:border-[#2a1f3d] [&_td]:py-2 [&_td]:pr-4 [&_td]:border-b [&_td]:border-[#1a1229] [&_td]:text-sm">
        {children}
      </div>
    </div>
  )
}
