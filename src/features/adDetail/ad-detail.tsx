"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CreativeCard } from "./creative-card"
import { PublicationBlocks } from "./publication-blocks"
import { getPlatformPublicationInsights } from "@/api/platform-publication"
import type { AdRequest, AdRequestStatus } from "@/api/ad-request"
import type { InsightsData } from "@/api/platform-publication"

const STATUS_INFO: Record<AdRequestStatus, { label: string; isLive: boolean }> = {
  published: { label: "Ao vivo", isLive: true },
  partially_published: { label: "Ao vivo", isLive: true },
  draft: { label: "Rascunho", isLive: false },
  pending_publication: { label: "Processando", isLive: false },
  processing: { label: "Processando", isLive: false },
  failed: { label: "Encerrado", isLive: false },
  rejected: { label: "Encerrado", isLive: false },
  cancelled: { label: "Encerrado", isLive: false },
}

const fmtShortDate = (iso: string) => {
  const d = new Date(iso)
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`
}

type AdDetailProps = {
  adRequest: AdRequest
  onRefresh: () => void
}

export function AdDetail({ adRequest, onRefresh }: AdDetailProps) {
  const [insights, setInsights] = useState<InsightsData | null>(null)

  const isLive =
    adRequest.status === "published" || adRequest.status === "partially_published"

  const activePub = adRequest.platform_publications?.find(
    (p) => p.status === "published"
  ) ?? (isLive ? adRequest.platform_publications?.[adRequest.platform_publications.length - 1] : null)

  useEffect(() => {
    if (!activePub) return
    getPlatformPublicationInsights(activePub.id)
      .then((res) => {
        const data = res.data
        if (data && "impressions" in data) {
          setInsights(data as InsightsData)
        }
      })
      .catch(() => {})
  }, [activePub?.id])

  const statusInfo = STATUS_INFO[adRequest.status] ?? { label: adRequest.status, isLive: false }
  const pubCount = adRequest.platform_publications?.length ?? 0
  const adName = adRequest.base_ad_creative?.name ?? ""

  return (
    <div
      className="mx-auto"
      style={{
        maxWidth: 1280,
        padding: "32px 32px 80px",
      }}
    >
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-body-sm text-muted-foreground">
        <Link href="/anuncios" className="hover:text-foreground transition-colors shrink-0">
          Meus anúncios
        </Link>
        <ChevronRight className="w-3.5 h-3.5 opacity-40 shrink-0" />
        <span className="font-bold text-foreground truncate">{adName}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div className="flex flex-col gap-2">
          <h1 className="text-title-1">{adName}</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
                statusInfo.isLive
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {statusInfo.isLive && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
              {statusInfo.label}
            </span>
            <span className="text-body-sm text-muted-foreground">
              · {pubCount} {pubCount !== 1 ? "publicações" : "publicação"} · criado em{" "}
              {fmtShortDate(adRequest.created_at)}
            </span>
          </div>
        </div>
        <Button variant="outline" className="rounded-full shrink-0" disabled>
          Duplicar para variação
        </Button>
      </div>

      {/* Two-column grid — single col below lg (1024px ≈ 960px spec) */}
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">
        <CreativeCard creative={adRequest.base_ad_creative} />
        <PublicationBlocks
          adRequest={adRequest}
          insights={insights}
          onPublished={onRefresh}
        />
      </div>
    </div>
  )
}
