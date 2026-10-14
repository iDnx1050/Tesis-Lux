import { FlaskConical } from 'lucide-react'
import { webpayEnvironment } from '@/lib/webpay'

// Mientras Webpay opere en el ambiente de integración, el checkout avisa que
// los pagos son de prueba: el sitio está publicado y una visita real no debe
// creer que reservó. Desaparece al configurar TRANSBANK_ENV=production.
export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  const isTest = webpayEnvironment() === 'integration'

  return (
    <>
      {children}
      {isTest && (
        <>
          {/* Espacio para que el aviso fijo no tape el final del pie de página */}
          <div className="h-12" aria-hidden />
          <div
            role="note"
            className="fixed inset-x-0 bottom-0 z-50 border-t border-[#c4a4f5]/25 bg-[#1a0f2e]/95 px-4 py-2.5 backdrop-blur"
          >
            <p className="mx-auto flex max-w-4xl items-center justify-center gap-2 text-center font-sans text-[11px] leading-snug text-[#c4a4f5]">
              <FlaskConical className="h-3.5 w-3.5 flex-shrink-0" />
              <span>
                Modo de prueba de Transbank: no se realizan cargos reales. Tarjeta de prueba VISA
                4051 8856 0044 6623, CVV 123, cualquier fecha futura. Si pide RUT y clave:
                11.111.111-1 y 123.
              </span>
            </p>
          </div>
        </>
      )}
    </>
  )
}
