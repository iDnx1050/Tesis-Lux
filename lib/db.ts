// Acceso a PostgreSQL (Neon). Se usa el driver HTTP de Neon: cada consulta es
// un fetch, sin conexiones persistentes, que es lo que conviene en funciones
// serverless como las de Netlify.
//
// Importar SOLO desde código de servidor: lee DATABASE_URL del entorno.
import { neon } from '@neondatabase/serverless'

let client: ReturnType<typeof neon> | null = null

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL)
}

/**
 * Ejecuta una consulta con parámetros posicionales ($1, $2, …). Los valores
 * viajan separados del SQL, así que nunca se interpolan en el texto de la
 * consulta (sin riesgo de inyección SQL).
 */
export async function query<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  if (!client) {
    const url = process.env.DATABASE_URL
    if (!url) throw new Error('Falta DATABASE_URL')
    client = neon(url)
  }
  return (await client.query(text, params)) as T[]
}
