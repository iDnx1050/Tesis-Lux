import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

// app/vedetos/page.tsx es un Client Component y no puede exportar metadata;
// este layout la declara en su lugar. Los perfiles la sobrescriben en
// app/vedetos/[slug]/layout.tsx.
export const metadata: Metadata = pageMetadata({
  title: 'Artistas',
  description:
    'Conoce el elenco de Luxx Producciones: artistas para shows privados, despedidas de soltera y cumpleaños en Santiago. Revisa sus perfiles, personajes y planes.',
  path: '/vedetos',
})

export default function VedetosLayout({ children }: { children: React.ReactNode }) {
  return children
}
