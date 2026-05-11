"use client"

import { useCallback, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { AuthGuard } from "@/lib/auth-guard"
import { Layout } from "@/components/layout"
import { Skeleton } from "@/components/ui/skeleton"
import { getAdRequest } from "@/api/ad-request"
import type { AdRequest } from "@/api/ad-request"
import { AdDetail } from "@/features/adDetail/ad-detail"

const AdDetailPage = () => {
  const params = useParams()
  const id = params.id as string
  const [adRequest, setAdRequest] = useState<AdRequest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!id) return
    setIsLoading(true)
    setError(null)
    try {
      const data = await getAdRequest(id)
      setAdRequest(data)
    } catch {
      setError("Anúncio não encontrado.")
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  return (
    <AuthGuard>
      <Layout>
        {isLoading && (
          <div
            className="mx-auto grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start"
            style={{ maxWidth: 1280, padding: "32px 32px 80px" }}
          >
            <div className="flex flex-col gap-4">
              <Skeleton className="aspect-square w-full rounded-2xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex flex-col gap-4">
              <Skeleton className="h-48 w-full rounded-2xl" />
              <Skeleton className="h-32 w-full rounded-2xl" />
            </div>
          </div>
        )}
        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-muted-foreground">{error}</p>
            <Link href="/anuncios" className="text-primary text-sm underline">
              Voltar para Meus anúncios
            </Link>
          </div>
        )}
        {!isLoading && adRequest && (
          <AdDetail adRequest={adRequest} onRefresh={load} />
        )}
      </Layout>
    </AuthGuard>
  )
}

export default AdDetailPage
