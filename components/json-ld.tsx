/**
 * Inserta un bloque JSON-LD. Es un bloque de datos (no se ejecuta), asi que
 * no necesita el nonce del CSP. Se escapa "<" para que un texto con
 * "</script>" no pueda cerrar la etiqueta antes de tiempo.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
