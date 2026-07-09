"use client"

import { useEffect, useRef, useState } from "react"
import { X, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { searchCities } from "@/api/ibge-cities"
import type { BrazilianCity } from "@/api/ibge-cities"
import { searchStates } from "@/api/ibge-states"
import type { BrazilianState } from "@/api/ibge-states"
import { StepHeader } from "@/features/adCreationFlow/step-header"

export type GeoLocationData = {
  cities: BrazilianCity[]
  states: BrazilianState[]
}

type Props = {
  initialValues?: GeoLocationData | null
  onComplete: (data: GeoLocationData) => void
}

type SearchResult =
  | { kind: "state"; state: BrazilianState }
  | { kind: "city"; city: BrazilianCity }

const QUICK_CITIES: BrazilianCity[] = [
  { id: 4314902, name: "Porto Alegre", state: "RS" },
  { id: 3550308, name: "São Paulo", state: "SP" },
  { id: 3304557, name: "Rio de Janeiro", state: "RJ" },
  { id: 3106200, name: "Belo Horizonte", state: "MG" },
]

const QUICK_STATES: BrazilianState[] = [
  { id: 43, name: "Rio Grande do Sul", uf: "RS" },
  { id: 35, name: "São Paulo", uf: "SP" },
  { id: 33, name: "Rio de Janeiro", uf: "RJ" },
]

export const GeoLocationStep = ({ initialValues, onComplete }: Props) => {
  const [cities, setCities] = useState<BrazilianCity[]>(initialValues?.cities ?? [])
  const [states, setStates] = useState<BrazilianState[]>(initialValues?.states ?? [])
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setShowDropdown(false)
      return
    }

    setIsSearching(true)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      try {
        const [foundStates, foundCities] = await Promise.all([
          searchStates(query),
          searchCities(query),
        ])
        const stateIds = new Set(states.map((s) => s.id))
        const cityIds = new Set(cities.map((c) => c.id))
        const merged: SearchResult[] = [
          ...foundStates
            .filter((s) => !stateIds.has(s.id))
            .map((s) => ({ kind: "state" as const, state: s })),
          ...foundCities
            .filter((c) => !cityIds.has(c.id))
            .map((c) => ({ kind: "city" as const, city: c })),
        ]
        setResults(merged)
        setShowDropdown(true)
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, states, cities])

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
    setCities((prev) => (prev.some((c) => c.id === city.id) ? prev : [...prev, city]))
    resetSearch()
  }

  const addState = (state: BrazilianState) => {
    setStates((prev) => (prev.some((s) => s.id === state.id) ? prev : [...prev, state]))
    resetSearch()
  }

  const resetSearch = () => {
    setQuery("")
    setResults([])
    setShowDropdown(false)
  }

  const removeCity = (id: number) => setCities((prev) => prev.filter((c) => c.id !== id))
  const removeState = (id: number) => setStates((prev) => prev.filter((s) => s.id !== id))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete({ cities, states })
  }

  const total = cities.length + states.length
  const quickStatesFiltered = QUICK_STATES.filter((s) => !states.some((x) => x.id === s.id))
  const quickCitiesFiltered = QUICK_CITIES.filter((c) => !cities.some((x) => x.id === c.id))

  return (
    <div className="mx-auto w-full max-w-xl px-8 py-8">
      <StepHeader
        eyebrow="PASSO 4 · LOCALIZAÇÃO"
        title="Onde está seu público?"
        subtitle="Escolha estados ou cidades onde seu anúncio será exibido. Digite pelo menos 2 letras para buscar."
      />
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div ref={containerRef} className="relative">
          <Input
            type="text"
            placeholder="Buscar estado ou cidade..."
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
              {results.map((r) =>
                r.kind === "state" ? (
                  <li key={`s-${r.state.id}`}>
                    <button
                      type="button"
                      onClick={() => addState(r.state)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-accent transition-colors"
                    >
                      <span className="text-body-sm">{r.state.name}</span>
                      <span className="rounded-full bg-muted px-1.5 py-0.5 text-label-caps text-muted-foreground">
                        Estado · {r.state.uf}
                      </span>
                    </button>
                  </li>
                ) : (
                  <li key={`c-${r.city.id}`}>
                    <button
                      type="button"
                      onClick={() => addCity(r.city)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-accent transition-colors"
                    >
                      <span className="text-body-sm">{r.city.name}</span>
                      <span className="text-label-caps text-muted-foreground">Cidade · {r.city.state}</span>
                    </button>
                  </li>
                )
              )}
            </ul>
          )}
          {showDropdown && !isSearching && query.length >= 2 && results.length === 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-md border bg-card px-3 py-2 text-label-caps text-muted-foreground shadow-ambient">
              Nenhum estado ou cidade encontrado
            </div>
          )}
        </div>

        {total > 0 && (
          <div className="flex flex-wrap gap-2">
            {states.map((state) => (
              <span
                key={`s-${state.id}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary-soft)] px-3 py-1 text-label-caps text-primary"
              >
                <MapPin className="h-3 w-3" />
                {state.name} · Estado
                <button
                  type="button"
                  onClick={() => removeState(state.id)}
                  className="rounded-full hover:bg-primary/20 transition-colors p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {cities.map((city) => (
              <span
                key={`c-${city.id}`}
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

        {(quickStatesFiltered.length > 0 || quickCitiesFiltered.length > 0) && (
          <div className="flex flex-col gap-2">
            <p className="text-label-caps text-muted-foreground">Adicionar rápido</p>
            <div className="flex flex-wrap gap-2">
              {quickStatesFiltered.map((state) => (
                <button
                  key={`s-${state.id}`}
                  type="button"
                  onClick={() => addState(state)}
                  className={cn(
                    "rounded-full border border-dashed border-border-strong bg-muted px-3 py-1 text-label-caps",
                    "hover:border-primary hover:bg-[var(--primary-soft)] transition-colors"
                  )}
                >
                  🗺️ {state.name}
                </button>
              ))}
              {quickCitiesFiltered.map((city) => (
                <button
                  key={`c-${city.id}`}
                  type="button"
                  onClick={() => addCity(city)}
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

        <Button type="submit" className="w-full rounded-full" disabled={total === 0}>
          Continuar
        </Button>
      </form>
    </div>
  )
}
