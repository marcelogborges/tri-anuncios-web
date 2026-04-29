"use client"

import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { searchCities } from "@/api/ibge-cities"
import type { BrazilianCity } from "@/api/ibge-cities"

export type GeoLocationData = {
  cities: BrazilianCity[]
}

type Props = {
  initialValues?: GeoLocationData | null
  onComplete: (data: GeoLocationData) => void
}

export const GeoLocationStep = ({ initialValues, onComplete }: Props) => {
  const [selected, setSelected] = useState<BrazilianCity[]>(
    initialValues?.cities ?? []
  )
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
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const addCity = (city: BrazilianCity) => {
    setSelected((prev) => [...prev, city])
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

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-title-2">Localização</CardTitle>
          <CardDescription className="text-body-md mt-2">
            Escolha as cidades onde seu anúncio será exibido. Digite pelo menos
            3 letras para buscar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div ref={containerRef} className="relative">
              <Input
                type="text"
                placeholder="Buscar cidade..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => results.length > 0 && setShowDropdown(true)}
              />
              {isSearching && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-body-sm text-muted-foreground">
                  Buscando...
                </span>
              )}

              {showDropdown && results.length > 0 && (
                <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-lg border bg-popover shadow-md">
                  {results.map((city) => (
                    <li key={city.id}>
                      <button
                        type="button"
                        onClick={() => addCity(city)}
                        className="w-full px-3 py-2 text-left text-body-sm hover:bg-accent cursor-pointer"
                      >
                        {city.name}
                        <span className="text-muted-foreground ml-1">
                          – {city.state}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {showDropdown && !isSearching && query.length >= 3 && results.length === 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-lg border bg-popover px-3 py-2 text-body-sm text-muted-foreground shadow-md">
                  Nenhuma cidade encontrada
                </div>
              )}
            </div>

            {selected.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selected.map((city) => (
                  <span
                    key={city.id}
                    className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-body-sm"
                  >
                    {city.name} – {city.state}
                    <button
                      type="button"
                      onClick={() => removeCity(city.id)}
                      className="rounded-full p-0.5 hover:bg-primary/20 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={selected.length === 0}
            >
              Continuar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
