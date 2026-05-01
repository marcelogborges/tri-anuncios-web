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
  image_url: string | null
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

const buildFormData = (payload: CreateBaseAdCreativePayload, file: File): FormData => {
  const formData = new FormData()
  const prefix = "base_ad_creative"

  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === null) continue
    if (Array.isArray(value)) {
      value.forEach((v) => formData.append(`${prefix}[${key}][]`, String(v)))
    } else if (typeof value === "object") {
      formData.append(`${prefix}[${key}]`, JSON.stringify(value))
    } else {
      formData.append(`${prefix}[${key}]`, String(value))
    }
  }

  formData.append(`${prefix}[media]`, file)
  return formData
}

export const createBaseAdCreative = async (
  payload: CreateBaseAdCreativePayload,
  file?: File
) => {
  const body = file ? buildFormData(payload, file) : { base_ad_creative: payload }
  const res = await api<{ base_ad_creative: BaseAdCreative }>("/api/v1/base_ad_creatives", {
    method: "POST",
    body,
  })
  return res.base_ad_creative
}
