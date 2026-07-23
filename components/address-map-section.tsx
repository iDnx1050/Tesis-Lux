'use client'

import { useState, useEffect, useRef } from 'react'
import { MapPin, Search, Loader2 } from 'lucide-react'
import { CHILE_REGIONS } from '@/lib/chile-locations'

const selectClass =
  'w-full rounded-xl border border-[#2a1f3d] bg-[#130e22] px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors duration-200 appearance-none cursor-pointer'

const labelClass = 'mb-2 block text-[10px] uppercase tracking-[0.28em] text-[#8877aa]'

interface Suggestion {
  display_name: string
  lat: string
  lon: string
}

export function AddressMapSection() {
  const [regionId, setRegionId] = useState('')
  const [commune, setCommune] = useState('')
  const [address, setAddress] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [mapQuery, setMapQuery] = useState('')
  const [mapCoords, setMapCoords] = useState<{ lat: string; lon: string } | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const region = CHILE_REGIONS.find((r) => r.id === regionId)
  const communes = region?.communes ?? []

  const handleRegionChange = (value: string) => {
    setRegionId(value)
    setCommune('')
  }

  // Cierra sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Autocompletado con Nominatim
  useEffect(() => {
    if (address.length < 4) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const communeParam = commune ? `, ${commune}` : ''
        const query = `${address}${communeParam}, Chile`
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=cl&addressdetails=1`
        const res = await fetch(url, {
          headers: { 'Accept-Language': 'es' },
        })
        const data: Suggestion[] = await res.json()
        setSuggestions(data)
        setShowSuggestions(data.length > 0)
      } catch {
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }, 450)
  }, [address, commune])

  const handleSelectSuggestion = (s: Suggestion) => {
    setAddress(s.display_name)
    setMapQuery(s.display_name)
    setMapCoords({ lat: s.lat, lon: s.lon })
    setSuggestions([])
    setShowSuggestions(false)
  }

  const handleShowMap = () => {
    if (!address.trim()) return
    const parts = [address.trim(), commune, region?.name, 'Chile'].filter(Boolean)
    setMapQuery(parts.join(', '))
    setMapCoords(null)
  }

  const mapSrc = mapCoords
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(mapCoords.lon) - 0.005},${parseFloat(mapCoords.lat) - 0.005},${parseFloat(mapCoords.lon) + 0.005},${parseFloat(mapCoords.lat) + 0.005}&layer=mapnik&marker=${mapCoords.lat},${mapCoords.lon}`
    : mapQuery
    ? `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed&hl=es`
    : ''

  return (
    <div className="space-y-6 border-t border-[#2a1f3d] pt-8">
      <div>
        <p className="mb-1 text-[10px] uppercase tracking-[0.35em] text-[#D4AF37]">
          Ubicación del evento
        </p>
        <p className="text-[11px] text-[#8877aa]">
          Selecciona tu región y comuna, ingresa la dirección y verifica en el mapa.
        </p>
      </div>

      {/* Region + Commune */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="relative">
          <label className={labelClass}>Región de origen *</label>
          <div className="relative">
            <select
              value={regionId}
              onChange={(e) => handleRegionChange(e.target.value)}
              className={selectClass}
            >
              <option value="" disabled>Selecciona una región</option>
              {CHILE_REGIONS.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8877aa]">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="relative">
          <label className={labelClass}>Comuna de origen *</label>
          <div className="relative">
            <select
              value={commune}
              onChange={(e) => setCommune(e.target.value)}
              disabled={!regionId}
              className={`${selectClass} disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              <option value="" disabled>
                {regionId ? 'Selecciona una comuna' : 'Primero selecciona una región'}
              </option>
              {communes.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8877aa]">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Address + autocomplete */}
      <div>
        <label className={labelClass}>Dirección del evento *</label>
        <div className="flex gap-3">
          <div ref={wrapperRef} className="relative flex-1">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8877aa]" />
            {loading && (
              <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-[#8877aa]" />
            )}
            <input
              type="text"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value)
                setMapCoords(null)
              }}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              onKeyDown={(e) => e.key === 'Enter' && handleShowMap()}
              placeholder="Calle, número, depto, recinto..."
              className="w-full rounded-xl border border-[#2a1f3d] bg-[#130e22] py-3 pl-10 pr-10 text-sm text-white placeholder:text-[#4a3f60] focus:border-[#D4AF37] focus:outline-none transition-colors duration-200"
              autoComplete="off"
            />

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-[#2a1f3d] bg-[#1a1229] shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    onMouseDown={() => handleSelectSuggestion(s)}
                    className="flex cursor-pointer items-start gap-3 px-4 py-3 text-xs text-[#D8D0E7] transition-colors hover:bg-[#261a38]"
                  >
                    <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#D4AF37]" />
                    <span className="leading-relaxed">{s.display_name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="button"
            onClick={handleShowMap}
            disabled={!address.trim()}
            className="flex items-center gap-2 rounded-xl border border-[#D4AF37]/50 bg-[#D4AF37]/10 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4AF37] transition-all duration-200 hover:bg-[#D4AF37]/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Search className="h-4 w-4" />
            Ver en mapa
          </button>
        </div>
      </div>

      {/* Map */}
      {mapSrc && (
        <div className="overflow-hidden rounded-2xl border border-[#2a1f3d]">
          <div className="flex items-center gap-2 border-b border-[#2a1f3d] bg-[#130e22] px-4 py-2.5">
            <MapPin className="h-3.5 w-3.5 text-[#D4AF37]" />
            <span className="truncate text-[11px] text-[#b3acc4]">{mapQuery || address}</span>
          </div>
          <iframe
            src={mapSrc}
            width="100%"
            height="320"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa de ubicación del evento"
          />
        </div>
      )}
    </div>
  )
}
