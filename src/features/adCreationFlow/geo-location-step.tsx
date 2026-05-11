"use client"

import { useEffect, useRef, useState } from "react"
import { X, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { searchCities } from "@/api/ibge-cities"
import type { BrazilianCity } from "@/api/ibge-cities"
import { StepHeader } from "@/features/adCreationFlow/step-header"

export type GeoLocationData = {
  cities: BrazilianCity[]
}

type Props = {
  initialValues?: GeoLocationData | null
  onComplete: (data: GeoLocationData) => void
}

const QUICK_SUGGESTIONS = [
  { id: 4314902, name: "Porto Alegre", state: "RS" },
  { id: 3550308, name: "São Paulo", state: "SP" },
  { id: 3304557, name: "Rio de Janeiro", state: "RJ" },
  { id: 3106200, name: "Belo Horizonte", state: "MG" },
]

export const GeoLocationStep = ({ initialValues, onComplete }: Props) => {
  const [selected, setSelected] = useState<BrazilianCity[]>(initialValues?.cities ?? [])
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<BrazilianCity[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.length < 3) {
      setResults([])
      setShowDropdown(false)
      return
    }

    setIsSearching(true)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      try {
        const cities = await searchCities(query)
        const selectedIds = new Set(selected.map((c) => c.id))
        setResults(cities.filter((c) => !selectedIds.has(c.id)))
        setShowDropdown(true)
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, selected])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const addCity = (city: BrazilianCity) => {
    setSelected((prev) =>
      prev.some((c) => c.id === city.id) ? prev : [...prev, city]
    )
    setQuery("")
    setResults([])
    setShowDropdown(false)
  }

  const removeCity = (id: number) => {
    setSelected((prev) => prev.filter((c) => c.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete({ cities: selected })
  }

  const quickSuggestionsFiltered = QUICK_SUGGESTIONS.filter(
    (s) => !selected.some((c) => c.id === s.id)
  )

  return (
    <div className="mx-auto w-full max-w-xl px-8 py-8">
      <StepHeader
        eyebrow="PASSO 4 · LOCALIZAÇÃO"
        title="Onde está seu público?"
        subtitle="Escolha as cidades onde seu anúncio será exibido. Digite pelo menos 3 letras para buscar."
      />
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div ref={containerRef} className="relative">
          <Input
            type="text"
            placeholder="Buscar cidade..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setShowDropdown(true)}
            className="rounded-md focus-visible:ring-0 focus-visible:shadow-[0_0_0_3px_var(--primary-soft)] focus-visible:border-primary"
          />
          {isSearching && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-label-caps text-muted-foreground">
              Buscando...
            </span>
          )}
          {showDropdown && results.length > 0 && (
            <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md border bg-card shadow-ambient">
              {results.map((city) => (
                <li key={city.id}>
                  <button
                    type="button"
                    onClick={() => addCity(city)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-accent transition-colors"
                  >
                    <span className="text-body-sm">{city.name}</span>
                    <span className="text-label-caps text-muted-foreground">{city.state}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {showDropdown && !isSearching && query.length >= 3 && results.length === 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-md border bg-card px-3 py-2 text-label-caps text-muted-foreground shadow-ambient">
              Nenhuma cidade encontrada
            </div>
          )}
        </div>

        {selected.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selected.map((city) => (
              <span
                key={city.id}
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary-soft)] px-3 py-1 text-label-caps text-primary"
              >
                <MapPin className="h-3 w-3" />
                {city.name} · {city.state}
                <button
                  type="button"
                  onClick={() => removeCity(city.id)}
                  className="rounded-full hover:bg-primary/20 transition-colors p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {quickSuggestionsFiltered.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-label-caps text-muted-foreground">Adicionar rápido</p>
            <div className="flex flex-wrap gap-2">
              {quickSuggestionsFiltered.map((city) => (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => addCity(city as BrazilianCity)}
                  className={cn(
                    "rounded-full border border-dashed border-border-strong bg-muted px-3 py-1 text-label-caps",
                    "hover:border-primary hover:bg-[var(--primary-soft)] transition-colors"
                  )}
                >
                  📍 {city.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <Button type="submit" className="w-full rounded-full" disabled={selected.length === 0}>
          Continuar
        </Button>
      </form>
    </div>
  )
}
