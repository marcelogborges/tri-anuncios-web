import { api } from "@/lib/api"

export type BaseAdCreative = {
  id: number
  organization_id: number
  name: string
  product_service: string | null
  message: string | null
  headline: string | null
  link: string | null
  call_to_action: string | null
  optimization_goal: string
  target_gender: string
  target_age_min: number | null
  target_age_max: number | null
  target_social_classes: string[]
  geo_locations: Record<string, unknown>
  remote_image_url: string | null
  created_at: string
  updated_at: string
}

export type CreateBaseAdCreativePayload = {
  organization_id: number
  name: string
  product_service?: string
  message?: string
  headline?: string
  link?: string
  call_to_action?: string
  optimization_goal?: string
  target_gender?: string
  target_age_min?: number
  target_age_max?: number
  target_social_classes?: string[]
  geo_locations?: Record<string, unknown>
  remote_image_url?: string
}

export const createBaseAdCreative = async (payload: CreateBaseAdCreativePayload) => {
  const res = await api<{ base_ad_creative: BaseAdCreative }>("/api/v1/base_ad_creatives", {
    method: "POST",
    body: { base_ad_creative: payload },
  })
  return res.base_ad_creative
}
