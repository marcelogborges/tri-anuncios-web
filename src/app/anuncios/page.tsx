"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { AuthGuard } from "@/lib/auth-guard"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { getAdRequests } from "@/api/ad-request"
import type { AdRequest } from "@/api/ad-request"
import { AdRequestCard } from "@/features/myAds/ad-request-card"

const AnunciosPage = () => {
  const [adRequests, setAdRequests] = useState<AdRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAdRequests()
        setAdRequests(data)
      } catch {
        setError("Erro ao carregar anúncios.")
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  return (
    <AuthGuard>
      <Layout>
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Meus Anúncios</h1>
            <Button className="rounded-full gap-2" asChild>
              <Link href="/anuncios/criar">
                <Plus className="size-4" />
                Criar Anúncio
              </Link>
            </Button>
          </div>

          {isLoading && (
            <p className="text-muted-foreground">Carregando...</p>
          )}

          {error && (
            <p className="text-destructive">{error}</p>
          )}

          {!isLoading && !error && adRequests.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-muted-foreground mb-4">
                Você ainda não tem anúncios.
              </p>
              <Button className="rounded-full gap-2" asChild>
                <Link href="/anuncios/criar">
                  <Plus className="size-4" />
                  Criar seu primeiro anúncio
                </Link>
              </Button>
            </div>
          )}

          {!isLoading && !error && adRequests.length > 0 && (
            <div className="grid gap-4">
              {adRequests.map((adRequest) => (
                <AdRequestCard key={adRequest.id} adRequest={adRequest} />
              ))}
            </div>
          )}
        </div>
      </Layout>
    </AuthGuard>
  )
}

export default AnunciosPage
