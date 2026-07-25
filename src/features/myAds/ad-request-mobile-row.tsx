"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { AD_REQUEST_STATUS_INFO, type AdRequest } from "@/api/ad-request"
import { useAdRequestInsights } from "@/features/myAds/use-ad-request-insights"
import { Button } from "@/components/ui/button"

type AdRequestMobileRowProps = {
  adRequest: AdRequest
}

const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

export const AdRequestMobileRow = ({ adRequest }: AdRequestMobileRowProps) => {
  const [open, setOpen] = useState(false)
  const insights = useAdRequestInsights(adRequest)

  const imageUrl =
    adRequest.base_ad_creative?.cover_image_url ??
    adRequest.base_ad_creative?.feed_image_url ??
    adRequest.base_ad_creative?.story_image_url
  const adName = adRequest.base_ad_creative?.name ?? `Anúncio #${adRequest.id}`
  const statusInfo = AD_REQUEST_STATUS_INFO[adRequest.status] ?? { label: adRequest.status, isLive: false }
  const createdAt = new Date(adRequest.created_at).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  })

  const metrics = [
    { key: "impressions", label: "Impressões", value: insights ? insights.impressions.toLocaleString("pt-BR") : "—" },
    { key: "clicks", label: "Cliques", value: insights ? insights.clicks.toLocaleString("pt-BR") : "—" },
    { key: "cpc", label: "Custo por clique", value: insights ? formatBRL(insights.cpc) : "—" },
    { key: "spend", label: "Investido", value: insights ? formatBRL(insights.spend) : "—" },
    { key: "created", label: "Criado em", value: createdAt },
  ]

  const metricRows = metrics.map(metric => (
    <div key={metric.key} className="flex items-center justify-between gap-3 py-1.5">
      <span className="text-[13px] text-muted-foreground">{metric.label}</span>
      <span className="text-sm font-semibold tabular-nums text-foreground">{metric.value}</span>
    </div>
  ))

  return (
    <div className="border-t first:border-t-0">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/20"
      >
        <div className="size-10 shrink-0 overflow-hidden rounded-lg border bg-secondary/20">
          {imageUrl ? (
            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ImageIcon className="size-4 text-muted-foreground" />
            </div>
          )}
        </div>
        <p className="min-w-0 flex-1 text-sm font-semibold leading-snug text-foreground line-clamp-2">
          {adName}
        </p>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
            statusInfo.isLive ? "bg-secondary text-primary" : "bg-muted text-muted-foreground"
          )}
        >
          {statusInfo.isLive && (
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          )}
          {statusInfo.label}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="border-t bg-secondary/10 px-4 py-3">
          {metricRows}
          <Button asChild variant="outline" size="sm" className="mt-2 w-full rounded-full">
            <Link href={`/anuncios/${adRequest.id}`}>Ver detalhes</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
