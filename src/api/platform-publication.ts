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

export type InsightsVideoMetrics = {
  plays: number
  p25: number
  p50: number
  p75: number
  p100: number
}

export type InsightsData = {
  impressions: number
  reach: number
  frequency: number
  clicks: number
  unique_clicks: number
  spend: number
  cpc: number
  cpm: number
  ctr: number
  unique_ctr: number
  inline_link_clicks: number
  inline_link_click_ctr: number
  cost_per_inline_link_click: number
  actions: InsightsActions
  video: InsightsVideoMetrics
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
  spend: number
  inline_link_clicks: number
}

export type PlatformPublicationDailyInsights = {
  data: DailyInsightsEntry[]
}

export type BreakdownDimension = "age_gender" | "platform" | "region"

export type BreakdownRow = {
  impressions: number
  clicks: number
  spend: number
  age?: string
  gender?: string
  publisher_platform?: string
  platform_position?: string
  region?: string
}

export type PlatformPublicationBreakdownInsights = {
  data: BreakdownRow[]
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

export type CustomDateRange = { since: string; until: string }

const rangeParams = (searchParams: URLSearchParams, range?: CustomDateRange) => {
  if (!range) return
  searchParams.set("since", range.since)
  searchParams.set("until", range.until)
}

export const getPlatformPublicationInsights = async (
  adRequestId: number | string,
  id: number | string,
  datePreset?: string,
  range?: CustomDateRange
) => {
  const searchParams = new URLSearchParams()
  if (datePreset) searchParams.set("date_preset", datePreset)
  rangeParams(searchParams, range)
  const query = searchParams.toString()
  const res = await api<PlatformPublicationInsights>(
    `/api/v1/ad_requests/${adRequestId}/platform_publications/${id}/insights${query ? `?${query}` : ""}`
  )
  return res
}

export const getPlatformPublicationBreakdownInsights = async (
  adRequestId: number | string,
  id: number | string,
  dimension: BreakdownDimension,
  datePreset?: string,
  range?: CustomDateRange
) => {
  const searchParams = new URLSearchParams({ dimension })
  if (datePreset) searchParams.set("date_preset", datePreset)
  rangeParams(searchParams, range)
  const res = await api<PlatformPublicationBreakdownInsights>(
    `/api/v1/ad_requests/${adRequestId}/platform_publications/${id}/breakdown_insights?${searchParams.toString()}`
  )
  return res.data
}

export const getPlatformPublicationDailyInsights = async (
  adRequestId: number | string,
  id: number | string,
  period?: string,
  startDate?: string,
  range?: CustomDateRange
) => {
  const searchParams = new URLSearchParams()
  if (period) searchParams.set("period", period)
  if (startDate) searchParams.set("start_date", startDate)
  rangeParams(searchParams, range)
  const query = searchParams.toString()
  const res = await api<PlatformPublicationDailyInsights>(
    `/api/v1/ad_requests/${adRequestId}/platform_publications/${id}/daily_insights${query ? `?${query}` : ""}`
  )
  return res.data
}
