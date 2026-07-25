"use client"

import { useRouter } from "next/navigation"
import { ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { AD_REQUEST_STATUS_INFO, type AdRequest } from "@/api/ad-request"
import { useAdRequestInsights } from "@/features/myAds/use-ad-request-insights"
import { TableCell, TableRow } from "@/components/ui/table"

type AdRequestTableRowProps = {
  adRequest: AdRequest
}

const MEDIA_TYPE_LABELS: Record<string, string> = {
  static_image: "Imagem",
  video: "Vídeo",
  carousel: "Carrossel",
}

const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

export const AdRequestTableRow = ({ adRequest }: AdRequestTableRowProps) => {
  const router = useRouter()
  const insights = useAdRequestInsights(adRequest)

  const imageUrl =
    adRequest.base_ad_creative?.cover_image_url ??
    adRequest.base_ad_creative?.feed_image_url ??
    adRequest.base_ad_creative?.story_image_url
  const adName = adRequest.base_ad_creative?.name ?? `Anúncio #${adRequest.id}`
  const mediaLabel = MEDIA_TYPE_LABELS[adRequest.base_ad_creative?.media_type] ?? ""
  const statusInfo = AD_REQUEST_STATUS_INFO[adRequest.status] ?? { label: adRequest.status, isLive: false }
  const createdAt = new Date(adRequest.created_at).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  })

  const handleClick = () => {
    router.push(`/anuncios/${adRequest.id}`)
  }

  return (
    <TableRow onClick={handleClick} className="cursor-pointer">
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="size-10 shrink-0 overflow-hidden rounded-lg border bg-secondary/20">
            {imageUrl ? (
              <img src={imageUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ImageIcon className="size-4 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="max-w-[220px] truncate text-sm font-semibold text-foreground">{adName}</p>
            <p className="text-xs text-muted-foreground">{mediaLabel}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
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
      </TableCell>
      <TableCell className="text-right tabular-nums">
        {insights ? insights.impressions.toLocaleString("pt-BR") : "—"}
      </TableCell>
      <TableCell className="text-right tabular-nums">
        {insights ? insights.clicks.toLocaleString("pt-BR") : "—"}
      </TableCell>
      <TableCell className="text-right tabular-nums">
        {insights ? formatBRL(insights.cpc) : "—"}
      </TableCell>
      <TableCell className="text-right tabular-nums">
        {insights ? formatBRL(insights.spend) : "—"}
      </TableCell>
      <TableCell className="pr-6 text-right text-muted-foreground">{createdAt}</TableCell>
    </TableRow>
  )
}
