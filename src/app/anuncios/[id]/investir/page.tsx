"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { AuthGuard } from "@/lib/auth-guard"
import { Layout } from "@/components/layout"
import { Skeleton } from "@/components/ui/skeleton"
import { getAdRequest, publishAdRequest } from "@/api/ad-request"
import type { AdRequest } from "@/api/ad-request"
import { getPlatformAccounts } from "@/api/platform-accounts"
import { MetaConnectModal } from "@/features/myAds/meta-connect-modal"
import { InvestmentPanel } from "@/features/adInvestment/investment-panel"
import type { InvestmentSubmitData } from "@/features/adInvestment/investment-panel"

const AdInvestmentPage = () => {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [adRequest, setAdRequest] = useState<AdRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [metaModalOpen, setMetaModalOpen] = useState(false)
  const pendingInvestment = useRef<InvestmentSubmitData | null>(null)

  useEffect(() => {
    if (!id) return
    const load = async () => {
      try {
        const data = await getAdRequest(id)
        setAdRequest(data)
      } catch {
        setError("Anúncio não encontrado.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const proceedWithPublish = async (investment: InvestmentSubmitData) => {
    try {
      await publishAdRequest(id, {
        budget_amount_cents: investment.amountCents,
        duration_days: investment.durationDays,
        scheduled_start_at: investment.scheduledStartAtIso,
      })
      router.push(`/anuncios/${id}`)
    } catch {
      setError("Erro ao publicar anúncio. Tente novamente.")
      setSubmitting(false)
    }
  }

  const handleSubmit = async (investment: InvestmentSubmitData) => {
    if (submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const accounts = await getPlatformAccounts()
      const hasMeta = accounts.some((a) => a.provider === "meta" && a.status === "active")
      if (!hasMeta) {
        pendingInvestment.current = investment
        setMetaModalOpen(true)
        setSubmitting(false)
        return
      }
      await proceedWithPublish(investment)
    } catch {
      setError("Não foi possível verificar sua conta de anúncios. Tente novamente.")
      setSubmitting(false)
    }
  }

  const handleMetaConnected = async () => {
    setMetaModalOpen(false)
    if (!pendingInvestment.current) return
    setSubmitting(true)
    await proceedWithPublish(pendingInvestment.current)
  }

  const adName = adRequest?.base_ad_creative?.name ?? ""

  return (
    <AuthGuard>
      <Layout>
        {loading && (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-8 sm:px-8">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        )}
        {!loading && !adRequest && (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <p className="text-muted-foreground">{error ?? "Anúncio não encontrado."}</p>
            <Link href="/anuncios" className="text-sm text-primary underline">
              Voltar para meus anúncios
            </Link>
          </div>
        )}
        {!loading && adRequest && (
          <>
            <nav className="mx-auto flex w-full max-w-3xl items-center gap-2 px-4 pt-8 text-body-sm text-muted-foreground sm:px-8">
              <Link href="/anuncios" className="shrink-0 transition-colors hover:text-foreground">
                Meus anúncios
              </Link>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" />
              <Link
                href={`/anuncios/${id}`}
                className="truncate transition-colors hover:text-foreground"
              >
                {adName}
              </Link>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" />
              <span className="shrink-0 font-bold text-foreground">Investimento</span>
            </nav>
            <InvestmentPanel
              title={`Quanto investir em "${adName}"?`}
              initialAmountCents={adRequest.budget_amount_cents}
              initialDurationDays={adRequest.duration_days}
              submitting={submitting}
              externalError={error}
              onSubmit={handleSubmit}
            />
            <MetaConnectModal
              open={metaModalOpen}
              onOpenChange={setMetaModalOpen}
              onConnected={handleMetaConnected}
            />
          </>
        )}
      </Layout>
    </AuthGuard>
  )
}

export default AdInvestmentPage
