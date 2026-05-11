"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { getOrganization, updateOrganization } from "@/api/organization"
import type { Organization } from "@/api/organization"
import { ApiError } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type Props = {
  organization: Organization
  onComplete: (updated: Organization) => void
}

export const CompleteOrganizationStep = ({ organization, onComplete }: Props) => {
  const [sector, setSector] = useState(organization.sector ?? "")
  const [niche, setNiche] = useState(organization.niche ?? "")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const updated = await updateOrganization(organization.id, { sector, niche })
      onComplete(updated)
    } catch (err) {
      if (err instanceof ApiError) {
        const data = err.data as { errors?: string[] } | null
        setError(data?.errors?.join(", ") ?? "Erro ao salvar dados.")
      } else {
        setError("Erro ao salvar dados. Tente novamente.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-title-2">
            Complete os dados de{" "}
            <span className="text-primary">{organization.name}</span>
          </CardTitle>
          <CardDescription className="text-body-md mt-2">
            Para criarmos anúncios mais eficientes, precisamos entender o setor
            e o nicho da sua empresa. Isso nos ajuda a direcionar melhor o
            anúncio para o público ideal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="sector" className="text-base font-semibold text-primary">
                Setor de atuação
              </label>
              <Input
                id="sector"
                type="text"
                placeholder="Ex: Alimentação, Moda, Tecnologia"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="niche" className="text-base font-semibold text-primary">
                Nicho específico
              </label>
              <Input
                id="niche"
                type="text"
                placeholder="Ex: Hamburguerias artesanais, Roupas fitness, SaaS B2B"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-body-sm text-destructive">{error}</p>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Salvando..." : "Continuar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
