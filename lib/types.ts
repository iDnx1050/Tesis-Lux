/**
 * La interfaz `Vedeto` modela la estructura principal de un perfil.
 * Su diseno permite reutilizar la misma entidad en listados, detalle,
 * checkout y futuras extensiones del sistema.
 */
export interface Vedeto {
  id: string
  name: string
  slug: string
  shortDescription: string
  fullDescription: string
  image: string
  gallery: string[]
  videoUrl?: string
  rating: number
  reviewCount: number
  pricing: PricingTier[]
  availability: AvailabilitySlot[]
  location: string
  specialties: string[]
  featured: boolean
}

/**
 * Representa una variante comercial o plan de contratacion asociado a un perfil.
 */
export interface PricingTier {
  id: string
  name: string
  duration: string
  price: number
  description: string
  features: string[]
}

/**
 * Define la disponibilidad temporal de un perfil para fines de reserva.
 */
export interface AvailabilitySlot {
  date: string
  available: boolean
  /** Todos los horarios ofrecidos ese día, libres y ocupados. */
  times?: string[]
  /**
   * Subconjunto de `times` ya tomado en Google Calendar. Se envía al cliente
   * para poder pintar esos bloques en rojo en vez de esconderlos.
   */
  bookedTimes?: string[]
}
