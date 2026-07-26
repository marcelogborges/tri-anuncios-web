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

export type AdRequestBaseAdCreative = {
  id: number
  name: string
  product_service: string | null
  media_type: "static_image" | "video" | "carousel"
  feed_image_url: string | null
  story_image_url: string | null
  cover_image_url: string | null
  message: string | null
  link: string | null
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

export type AdRequest = {
  id: number
  organization_id: number
  user_id: number
  ad_package_id: number | null
  base_ad_creative_id: number | null
  status: AdRequestStatus
  scheduled_start_at: string | null
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

export const publishAdRequest = async (
  id: number | string,
  adPackageId: number,
  scheduledStartAt?: string | null
) => {
  const res = await api<AdRequestResponse>(`/api/v1/ad_requests/${id}/publish`, {
    method: "POST",
    body: {
      ad_request: {
        ad_package_id: adPackageId,
        ...(scheduledStartAt ? { scheduled_start_at: scheduledStartAt } : {}),
      },
    },
  })
  return res.ad_request
}
