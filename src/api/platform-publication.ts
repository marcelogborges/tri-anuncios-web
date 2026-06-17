import { api } from "@/lib/api"

export type PlatformPublication = {
  id: number
  ad_request_id: number
  platform_account_id: number
  provider: string
  status: string
  created_at: string
  updated_at: string
}

export type InsightsActions = Record<string, number>

export type InsightsData = {
  impressions: number
  clicks: number
  spend: number
  cpc: number
  cpm: number
  ctr: number
  reach: number
  frequency: number
  actions: InsightsActions
  date_start: string
  date_stop: string
}

export type PlatformPublicationInsights = {
  data: InsightsData | Record<string, never>
  message?: string
}

export type DailyInsightsEntry = {
  date: string
  impressions: number
  clicks: number
}

export type PlatformPublicationDailyInsights = {
  data: DailyInsightsEntry[]
}

type PlatformPublicationsResponse = {
  platform_publications: PlatformPublication[]
}

type PlatformPublicationResponse = {
  platform_publication: PlatformPublication
}

export const getPlatformPublications = async (adRequestId: number | string) => {
  const res = await api<PlatformPublicationsResponse>(
    `/api/v1/ad_requests/${adRequestId}/platform_publications`
  )
  return res.platform_publications
}

export const getPlatformPublication = async (adRequestId: number | string, id: number | string) => {
  const res = await api<PlatformPublicationResponse>(
    `/api/v1/ad_requests/${adRequestId}/platform_publications/${id}`
  )
  return res.platform_publication
}

export const getPlatformPublicationInsights = async (
  adRequestId: number | string,
  id: number | string,
  datePreset?: string
) => {
  const params = datePreset ? `?date_preset=${datePreset}` : ""
  const res = await api<PlatformPublicationInsights>(
    `/api/v1/ad_requests/${adRequestId}/platform_publications/${id}/insights${params}`
  )
  return res
}

export const getPlatformPublicationDailyInsights = async (
  adRequestId: number | string,
  id: number | string,
  period?: string,
  startDate?: string
) => {
  const searchParams = new URLSearchParams()
  if (period) searchParams.set("period", period)
  if (startDate) searchParams.set("start_date", startDate)
  const query = searchParams.toString()
  const res = await api<PlatformPublicationDailyInsights>(
    `/api/v1/ad_requests/${adRequestId}/platform_publications/${id}/daily_insights${query ? `?${query}` : ""}`
  )
  return res.data
}
