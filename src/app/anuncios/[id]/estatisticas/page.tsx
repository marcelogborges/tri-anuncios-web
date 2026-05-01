"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { AuthGuard } from "@/lib/auth-guard"
import { Layout } from "@/components/layout"
import { getAdRequest } from "@/api/ad-request"
import type { AdRequest } from "@/api/ad-request"
import { AdStatistics } from "@/features/adStatistics/ad-statistics"

const EstatisticasPage = () => {
  const params = useParams()
  const id = params.id as string
  const [adRequest, setAdRequest] = useState<AdRequest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const load = async () => {
      try {
        const data = await getAdRequest(id)
        setAdRequest(data)
      } catch {
        setError("Anúncio não encontrado.")
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [id])

  return (
    <AuthGuard>
      <Layout>
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center py-20">
            <p className="text-destructive">{error}</p>
          </div>
        )}
        {adRequest && <AdStatistics adRequest={adRequest} />}
      </Layout>
    </AuthGuard>
  )
}

export default EstatisticasPage
