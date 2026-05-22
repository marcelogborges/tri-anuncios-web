"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { AdRequest, AdRequestStatus } from "@/api/ad-request"
import { getPlatformPublicationInsights, type InsightsData } from "@/api/platform-publication"

const timeAgo = (dateStr: string): string => {
  const now = Date.now()
  const past = new Date(dateStr).getTime()
  const diffMs = now - past
  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 1) return "agora mesmo"
  if (minutes < 60) return `há ${minutes} minuto${minutes > 1 ? "s" : ""}`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `há ${hours} hora${hours > 1 ? "s" : ""}`
  const days = Math.floor(hours / 24)
  if (days < 30) return `há ${days} dia${days > 1 ? "s" : ""}`
  const months = Math.floor(days / 30)
  return `há ${months} ${months > 1 ? "meses" : "mês"}`
}

type StatusInfo = {
  label: string
  isLive: boolean
}

const STATUS_INFO: Record<AdRequestStatus, StatusInfo> = {
  published: { label: "Ao vivo", isLive: true },
  partially_published: { label: "Ao vivo", isLive: true },
  draft: { label: "Rascunho", isLive: false },
  pending_publication: { label: "Processando", isLive: false },
  processing: { label: "Processando", isLive: false },
  failed: { label: "Encerrado", isLive: false },
  rejected: { label: "Encerrado", isLive: false },
  cancelled: { label: "Encerrado", isLive: false },
}

type AdRequestCardProps = {
  adRequest: AdRequest
  orgName: string
}

export const AdRequestCard = ({ adRequest, orgName }: AdRequestCardProps) => {
  const imageUrl = adRequest.base_ad_creative?.feed_image_url ?? adRequest.base_ad_creative?.story_image_url
  const adName = adRequest.base_ad_creative?.name ?? ""
  const hasImage = Boolean(imageUrl)
  const isDraft = adRequest.status === "draft"
  const isProcessing = adRequest.status === "processing" || adRequest.status === "pending_publication"
  const statusInfo = STATUS_INFO[adRequest.status] ?? { label: adRequest.status, isLive: false }
  const pubCount = adRequest.platform_publications?.length ?? 0

  const metaPublication = adRequest.platform_publications?.find(p => p.provider === "meta")
  const [insights, setInsights] = useState<InsightsData | null>(null)

  useEffect(() => {
    if (!statusInfo.isLive || !metaPublication) return

    const loadInsights = async () => {
      try {
        const res = await getPlatformPublicationInsights(metaPublication.id)
        const data = res.data

        if (data && Object.keys(data).length > 0) {
          setInsights(data as InsightsData)
        }
      } catch {}
    }

    loadInsights()
  }, [metaPublication?.id, statusInfo.isLive])

  const metaText = isDraft
    ? `Nunca publicado · criado ${timeAgo(adRequest.created_at)}`
    : isProcessing
      ? "Processando..."
      : `${pubCount} ${pubCount !== 1 ? "publicações" : "publicação"} · criado ${timeAgo(adRequest.created_at)}`

  const imageContent = hasImage ? (
    <img src={imageUrl!} alt={adName} className="object-cover w-full h-full" />
  ) : (
    <div className="flex items-center justify-center w-full h-full bg-muted">
      <ImageIcon className="w-8 h-8 text-muted-foreground" />
    </div>
  )

  const statusPill = (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium shrink-0",
      statusInfo.isLive
        ? "bg-secondary text-primary"
        : "bg-muted text-muted-foreground"
    )}>
      {statusInfo.isLive && (
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      )}
      {statusInfo.label}
    </span>
  )

  return (
    <Link href={`/anuncios/${adRequest.id}`} className="block h-full">
      <div className="h-full flex flex-col bg-card rounded-lg border border-border hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_10px_20px_rgba(6,78,59,0.08)] transition-all duration-200">
        <div className="relative w-full aspect-video overflow-hidden rounded-t-lg shrink-0">
          {imageContent}
        </div>
        <div className="p-5 flex flex-col flex-1 gap-3">
          <div className="flex items-start justify-between gap-2">
            <p className="font-bold text-base line-clamp-2">{adName}</p>
            {statusPill}
          </div>
          <p className="text-sm text-muted-foreground">{metaText}</p>
          {!isDraft && (
            <div className="grid grid-cols-2 overflow-hidden rounded-md border border-border bg-card">
              <div className="border-r border-border bg-card p-3">
                <p className="text-label-caps uppercase text-muted-foreground">Impressões</p>
                <p className="text-lg font-bold text-foreground">
                  {insights ? new Intl.NumberFormat("pt-BR").format(insights.impressions) : "—"}
                </p>
              </div>
              <div className="bg-card p-3">
                <p className="text-label-caps uppercase text-muted-foreground">Cliques</p>
                <p className="text-lg font-bold text-foreground">
                  {insights ? new Intl.NumberFormat("pt-BR").format(insights.clicks) : "—"}
                </p>
              </div>
            </div>
          )}
          <div className="mt-auto border-t border-border pt-[14px]">
            <Button className="w-full rounded-full">Ver detalhes</Button>
          </div>
        </div>
      </div>
    </Link>
  )
}
