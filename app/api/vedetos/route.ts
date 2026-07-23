import { vedetos } from '@/lib/mock-data'
import { ok } from '@/lib/api-response'
import { logRequest } from '@/lib/logger'

// Revalidar cada hora — cuando exista una BD real, usar revalidación bajo demanda
export const revalidate = 3600

export async function GET(req: Request) {
  const start = Date.now()

  // Devolver solo los campos necesarios para el listado — nunca enviar galerías completas
  const data = vedetos.map(({ id, name, slug, shortDescription, image, rating, reviewCount, pricing, featured, location, specialties }) => ({
    id,
    name,
    slug,
    shortDescription,
    image,
    rating,
    reviewCount,
    pricing,
    featured,
    location,
    specialties,
  }))

  logRequest('GET', '/api/vedetos', 200, Date.now() - start, { count: data.length })

  return ok(data)
}
