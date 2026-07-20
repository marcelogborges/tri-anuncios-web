"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CreativeCard } from "./creative-card"
import {
  LivePublicationBlock,
  PublicationHistoryBlock,
  RepublishCtaBlock,
} from "./publication-blocks"
import { getPlatformPublicationInsights } from "@/api/platform-publication"
import { AD_REQUEST_STATUS_INFO, type AdRequest } from "@/api/ad-request"
import type { InsightsData } from "@/api/platform-publication"
import { formatDayMonth } from "@/lib/format"

type AdDetailProps = {
  adRequest: AdRequest
  onRefresh: () => void
}

export const AdDetail = ({ adRequest, onRefresh }: AdDetailProps) => {
  const [insights, setInsights] = useState<InsightsData | null>(null)

  const isLive =
    adRequest.status === "published" || adRequest.status === "partially_published"

  const activePub = adRequest.platform_publications?.find(
    (p) => p.status === "published"
  ) ?? (isLive ? adRequest.platform_publications?.[adRequest.platform_publications.length - 1] : null)

  useEffect(() => {
    if (!activePub) return
    const loadInsights = async () => {
      try {
        const res = await getPlatformPublicationInsights(adRequest.id, activePub.id)
        const data = res.data
        if (data && "impressions" in data) {
          setInsights(data as InsightsData)
        }
      } catch {}
    }
    loadInsights()
  }, [activePub?.id])

  const statusInfo = AD_REQUEST_STATUS_INFO[adRequest.status] ?? { label: adRequest.status, isLive: false }
  const pubCount = adRequest.platform_publications?.length ?? 0
  const adName = adRequest.base_ad_creative?.name ?? ""

  const pubs = adRequest.platform_publications ?? []
  const durationDays = adRequest.ad_package?.duration_days ?? 14
  const packageName = adRequest.ad_package?.name ?? null
  const sortedPubs = [...pubs].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )
  const activePubIndex = activePub
    ? sortedPubs.findIndex((p) => p.id === activePub.id) + 1
    : null

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
              {formatDayMonth(adRequest.created_at)}
            </span>
          </div>
        </div>
        <Button variant="outline" className="rounded-full shrink-0" disabled>
          Duplicar para variação
        </Button>
      </div>

      {/* Mobile: live → preview → history. Desktop (lg): preview left spanning both rows. */}
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">
        <div className="lg:col-start-2 lg:row-start-1 w-full">
          {isLive && activePub && activePubIndex != null ? (
            <LivePublicationBlock
              adRequestId={adRequest.id}
              pub={activePub}
              pubIndex={activePubIndex}
              durationDays={durationDays}
              insights={insights}
            />
          ) : (
            <RepublishCtaBlock
              adRequestId={adRequest.id}
              hasPreviousPublications={pubs.length > 0}
              onPublished={onRefresh}
            />
          )}
        </div>
        <div className="lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:self-stretch w-full">
          <CreativeCard creative={adRequest.base_ad_creative} />
        </div>
        <div className="lg:col-start-2 lg:row-start-2 w-full">
          <PublicationHistoryBlock
            adRequestId={adRequest.id}
            publications={pubs}
            durationDays={durationDays}
            packageName={packageName}
            activeInsights={insights}
            activePubId={activePub?.id ?? null}
          />
        </div>
      </div>
    </div>
  )
}
