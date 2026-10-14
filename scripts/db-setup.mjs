// Aplica db/schema.sql a la base de datos de DATABASE_URL.
// Uso: npm run db:setup  (lee DATABASE_URL de .env.local o del entorno)
// Es idempotente: las sentencias usan IF NOT EXISTS.
import { readFile } from 'node:fs/promises'
import { neon } from '@neondatabase/serverless'

const url = process.env.DATABASE_URL
if (!url) {
  console.error('Falta DATABASE_URL: agrégala a .env.local (cadena de conexión de Neon).')
  process.exit(1)
}

const schema = await readFile(new URL('../db/schema.sql', import.meta.url), 'utf8')

// El driver HTTP ejecuta una sentencia por consulta: se separa el archivo en
// sentencias y se descartan los bloques que solo tienen comentarios.
const statements = schema
  .split(/;\s*$/m)
  .map((s) => s.trim())
  .filter((s) => s.split('\n').some((line) => line.trim() && !line.trim().startsWith('--')))

const sql = neon(url)
await sql.transaction(statements.map((s) => sql.query(s)))

console.log(`Esquema aplicado: ${statements.length} sentencias.`)
