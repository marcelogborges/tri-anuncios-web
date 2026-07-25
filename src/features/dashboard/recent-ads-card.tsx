"use client"

import Link from "next/link"
import { ArrowRight, ImageIcon, Megaphone } from "lucide-react"
import { AD_REQUEST_STATUS_INFO } from "@/api/ad-request"
import type { AdRequest } from "@/api/ad-request"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type RecentAdsCardProps = {
  adRequests: AdRequest[]
}

const MEDIA_TYPE_LABELS: Record<string, string> = {
  static_image: "Imagem",
  video: "Vídeo",
  carousel: "Carrossel",
}

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })

export const RecentAdsCard = ({ adRequests }: RecentAdsCardProps) => {
  const recent = adRequests.slice(0, 4)

  const emptyState = (
    <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
        <Megaphone className="size-5 text-primary" />
      </div>
      <p className="text-sm text-muted-foreground">Você ainda não criou nenhum anúncio.</p>
      <Button asChild variant="outline" className="rounded-full">
        <Link href="/anuncios/criar">Criar meu primeiro anúncio</Link>
      </Button>
    </div>
  )

  const rows = recent.map(ad => {
    const statusInfo = AD_REQUEST_STATUS_INFO[ad.status] ?? { label: ad.status, isLive: false }
    const mediaLabel = MEDIA_TYPE_LABELS[ad.base_ad_creative?.media_type] ?? ""
    const imageUrl =
      ad.base_ad_creative?.feed_image_url ?? ad.base_ad_creative?.story_image_url
    return (
      <Link
        key={ad.id}
        href={`/anuncios/${ad.id}`}
        className="flex items-center gap-3 border-t px-6 py-3.5 transition-colors hover:bg-secondary/40 max-[480px]:px-4"
      >
        <div className="size-11 shrink-0 overflow-hidden rounded-lg border bg-secondary/20">
          {imageUrl ? (
            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ImageIcon className="size-4 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {ad.base_ad_creative?.name ?? `Anúncio #${ad.id}`}
          </p>
          <p className="text-[13px] text-muted-foreground">
            {[mediaLabel, formatDate(ad.created_at)].filter(Boolean).join(" · ")}
          </p>
        </div>
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
      </Link>
    )
  })

  return (
    <section className="overflow-hidden rounded-xl border bg-card shadow-ambient">
      <div className="flex items-center justify-between px-6 py-4 max-[480px]:px-4">
        <h2 className="font-quicksand text-[17px] font-semibold text-foreground">
          Anúncios recentes
        </h2>
        <Link
          href="/anuncios"
          className="flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline"
        >
          Ver todos
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
      {recent.length === 0 ? emptyState : <div className="flex flex-col">{rows}</div>}
    </section>
  )
}
