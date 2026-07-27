import { api } from "@/lib/api"

export type AdRequestStatus =
  | "draft"
  | "pending_publication"
  | "processing"
  | "partially_published"
  | "published"
  | "failed"
  | "rejected"
  | "cancelled"
  | "scheduled"

export const AD_REQUEST_STATUS_INFO: Record<
  AdRequestStatus,
  { label: string; isLive: boolean }
> = {
  published: { label: "Ao vivo", isLive: true },
  partially_published: { label: "Ao vivo", isLive: true },
  draft: { label: "Rascunho", isLive: false },
  pending_publication: { label: "Processando", isLive: false },
  processing: { label: "Processando", isLive: false },
  scheduled: { label: "Agendado", isLive: false },
  failed: { label: "Encerrado", isLive: false },
  rejected: { label: "Encerrado", isLive: false },
  cancelled: { label: "Encerrado", isLive: false },
}

export type AdRequestCarouselCard = {
  id: number
  position: number
  headline: string | null
  description: string | null
  link: string | null
  image_url: string | null
}

export type AdRequestBaseAdCreative = {
  id: number
  name: string
  product_service: string | null
  media_type: "static_image" | "video" | "carousel"
  feed_image_url: string | null
  story_image_url: string | null
  cover_image_url: string | null
  video_url: string | null
  carousel_cards: AdRequestCarouselCard[]
  message: string | null
  message_variations: string[]
  headline: string | null
  link: string | null
  call_to_action: string | null
  target_gender: string
  target_age_min: number | null
  target_age_max: number | null
  geo_locations: Record<string, unknown>
}

export type AdRequestAdPackage = {
  id: number
  name: string
  price_cents: number
  duration_days: number
  platform_providers: string[]
}

export type AdRequestPlatformPublication = {
  id: number
  provider: string
  status: string
  created_at: string
}

export type PricingTier = "essencial" | "impulso" | "performance"

export const PRICING_TIER_LABELS: Record<PricingTier, string> = {
  essencial: "Essencial",
  impulso: "Impulso",
  performance: "Performance",
}

export type AdRequest = {
  id: number
  organization_id: number
  user_id: number
  ad_package_id: number | null
  base_ad_creative_id: number | null
  status: AdRequestStatus
  scheduled_start_at: string | null
  budget_amount_cents: number | null
  duration_days: number | null
  pricing_tier: PricingTier | null
  created_at: string
  updated_at: string
  base_ad_creative: AdRequestBaseAdCreative
  ad_package: AdRequestAdPackage | null
  platform_publications: AdRequestPlatformPublication[]
}

export type AdRequestPayload = {
  organization_id: number
  user_id: number
  ad_package_id?: number | null
  base_ad_creative_id?: number | null
}

type AdRequestsResponse = {
  ad_requests: AdRequest[]
}

type AdRequestResponse = {
  ad_request: AdRequest
}

export const getAdRequests = async () => {
  const res = await api<AdRequestsResponse>("/api/v1/ad_requests")
  return res.ad_requests
}

export const getAdRequest = async (id: number | string) => {
  const res = await api<AdRequestResponse>(`/api/v1/ad_requests/${id}`)
  return res.ad_request
}

export const createAdRequest = async (payload: AdRequestPayload) => {
  const res = await api<AdRequestResponse>("/api/v1/ad_requests", {
    method: "POST",
    body: {
      ad_request: payload,
    },
  })
  return res.ad_request
}

export const updateAdRequest = async (
  id: number | string,
  payload: Partial<AdRequestPayload>
) => {
  const res = await api<AdRequestResponse>(`/api/v1/ad_requests/${id}`, {
    method: "PATCH",
    body: {
      ad_request: payload,
    },
  })
  return res.ad_request
}

export type PublishAdRequestPayload = {
  budget_amount_cents: number
  duration_days?: number | null
  scheduled_start_at?: string | null
}

export const publishAdRequest = async (
  id: number | string,
  payload: PublishAdRequestPayload
) => {
  const res = await api<AdRequestResponse>(`/api/v1/ad_requests/${id}/publish`, {
    method: "POST",
    body: {
      ad_request: {
        budget_amount_cents: payload.budget_amount_cents,
        ...(payload.duration_days ? { duration_days: payload.duration_days } : {}),
        ...(payload.scheduled_start_at ? { scheduled_start_at: payload.scheduled_start_at } : {}),
      },
    },
  })
  return res.ad_request
}
