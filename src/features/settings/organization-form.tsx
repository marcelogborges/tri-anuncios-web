"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { getOrganization, updateOrganization } from "@/api/organization"
import { ApiError } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const OrganizationForm = () => {
  const { user } = useAuth()
  const [name, setName] = useState("")
  const [document, setDocument] = useState("")
  const [sector, setSector] = useState("")
  const [niche, setNiche] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user?.organization_id) {
      setIsLoading(false)
      return
    }
    const load = async () => {
      try {
        const organization = await getOrganization(user.organization_id)
        setName(organization.name)
        setDocument(organization.document ?? "")
        setSector(organization.sector ?? "")
        setNiche(organization.niche ?? "")
      } catch {
        setError("Erro ao carregar os dados da organização.")
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [user?.organization_id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!user?.organization_id) {
      return
    }

    setSaving(true)

    try {
      await updateOrganization(user.organization_id, {
        name,
        document: document || null,
        sector: sector || null,
        niche: niche || null,
      })
      setSuccess(true)
    } catch (err) {
      if (err instanceof ApiError) {
        const data = err.data as { errors?: string[] } | null
        setError(data?.errors?.join(", ") ?? "Erro ao salvar a organização.")
      } else {
        setError("Erro ao salvar a organização. Tente novamente.")
      }
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return <Skeleton className="h-96 max-w-xl rounded-lg" />
  }

  return (
    <Card className="max-w-xl rounded-xl shadow-ambient">
      <CardHeader>
        <CardTitle className="text-base">Dados da organização</CardTitle>
        <CardDescription>
          A área de atuação e o nicho ajudam a IA a gerar anúncios do seu segmento.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="orgName" className="text-body-sm">
              Nome da organização
            </label>
            <Input
              id="orgName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="orgDocument" className="text-body-sm">
              CPF / CNPJ
            </label>
            <Input
              id="orgDocument"
              type="text"
              placeholder="00.000.000/0000-00"
              value={document}
              onChange={(e) => setDocument(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="orgSector" className="text-body-sm">
                Área de atuação
              </label>
              <Input
                id="orgSector"
                type="text"
                placeholder="Alimentação, moda, serviços..."
                value={sector}
                onChange={(e) => setSector(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="orgNiche" className="text-body-sm">
                Nicho
              </label>
              <Input
                id="orgNiche"
                type="text"
                placeholder="Padaria artesanal, moda fitness..."
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="text-body-sm text-destructive">{error}</p>}
          {success && (
            <p className="text-body-sm text-primary">Organização atualizada com sucesso.</p>
          )}
          <Button type="submit" disabled={saving} className="self-start rounded-full px-6">
            {saving ? "Salvando..." : "Salvar alterações"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
