"use client"

import { useEffect, useState } from "react"
import { AuthGuard } from "@/lib/auth-guard"
import { useAuth } from "@/lib/auth-context"
import { Layout } from "@/components/layout"
import { getAdRequests } from "@/api/ad-request"
import type { AdRequest } from "@/api/ad-request"
import { AdRequestCard } from "@/features/myAds/ad-request-card"
import { PublishAdModal } from "@/features/myAds/publish-ad-modal"

const AnunciosPage = () => {
  const { user } = useAuth()
  const [adRequests, setAdRequests] = useState<AdRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [publishModalOpen, setPublishModalOpen] = useState(false)
  const [publishingAdRequestId, setPublishingAdRequestId] = useState<number | null>(null)

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

  const handlePublishClick = (adRequest: AdRequest) => {
    setPublishingAdRequestId(adRequest.id)
    setPublishModalOpen(true)
  }

  const handlePublished = async () => {
    setPublishModalOpen(false)
    setPublishingAdRequestId(null)
    const data = await getAdRequests()
    setAdRequests(data)
  }

  return (
    <AuthGuard>
      <Layout>
        <div className="mx-auto max-w-3xl px-6 py-10">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">
              Anúncios de <span className="text-primary">{user?.organization_name}</span>
            </h1>
          </div>

          {isLoading && (
            <p className="text-muted-foreground">Carregando...</p>
          )}

          {error && (
            <p className="text-destructive">{error}</p>
          )}

          {!isLoading && !error && adRequests.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-muted-foreground">
                Você ainda não tem anúncios.
              </p>
            </div>
          )}

          {!isLoading && !error && adRequests.length > 0 && (() => {
            const drafts = adRequests.filter((r) => r.status === "draft")
            const active = adRequests.filter((r) =>
              ["pending_publication", "processing", "partially_published", "published"].includes(r.status)
            )
            const other = adRequests.filter((r) =>
              ["failed", "rejected", "cancelled"].includes(r.status)
            )

            return (
              <div className="space-y-10">
                {drafts.length > 0 && (
                  <section>
                    <h2 className="mb-4 text-lg font-bold">Rascunhos</h2>
                    <div className="grid gap-3">
                      {drafts.map((adRequest) => (
                        <AdRequestCard
                          key={adRequest.id}
                          adRequest={adRequest}
                          onPublish={handlePublishClick}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {active.length > 0 && (
                  <section>
                    <h2 className="mb-4 text-lg font-bold">Rodando</h2>
                    <div className="grid gap-3">
                      {active.map((adRequest) => (
                        <AdRequestCard
                          key={adRequest.id}
                          adRequest={adRequest}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {other.length > 0 && (
                  <section>
                    <h2 className="mb-4 text-lg font-bold">Finalizados</h2>
                    <div className="grid gap-3">
                      {other.map((adRequest) => (
                        <AdRequestCard
                          key={adRequest.id}
                          adRequest={adRequest}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )
          })()}

          <PublishAdModal
            adRequestId={publishingAdRequestId}
            open={publishModalOpen}
            onOpenChange={setPublishModalOpen}
            onPublished={handlePublished}
          />
        </div>
      </Layout>
    </AuthGuard>
  )
}

export default AnunciosPage
