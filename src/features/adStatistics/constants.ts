import type { AdRequestStatus } from "@/api/ad-request"
import type { DatePreset } from "./types"

export const DATE_PRESETS: { key: DatePreset; label: string }[] = [
  { key: "today", label: "Hoje" },
  { key: "yesterday", label: "Ontem" },
  { key: "last_7d", label: "7 dias" },
  { key: "maximum", label: "Total" },
]

export const STATUS_CONFIG: Record<
  AdRequestStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "tertiary" }
> = {
  draft: { label: "Rascunho", variant: "secondary" },
  pending_publication: { label: "Processando", variant: "secondary" },
  processing: { label: "Processando", variant: "tertiary" },
  scheduled: { label: "Agendado", variant: "secondary" },
  partially_published: { label: "Parcialmente publicado", variant: "tertiary" },
  published: { label: "Publicado", variant: "default" },
  failed: { label: "Falhou", variant: "destructive" },
  rejected: { label: "Rejeitado", variant: "destructive" },
  cancelled: { label: "Cancelado", variant: "secondary" },
}

export const PLATFORM_LABELS: Record<string, string> = {
  meta: "Meta Ads",
  google_ads: "Google Ads",
  tiktok_ads: "TikTok Ads",
}

export const PLATFORM_ICONS: Record<string, string> = {
  meta: "/meta.png",
  google_ads: "/google.png",
  tiktok_ads: "/tiktok.png",
}

export const ALL_PLATFORMS = ["meta", "google_ads", "tiktok_ads"]
