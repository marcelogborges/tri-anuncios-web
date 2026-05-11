import { api } from "@/lib/api"

export type CopyInputs = {
  name?: string
  product_service?: string
  hook?: string
  benefit?: string
  proof?: string
  offer?: string
  cta?: string
}

export type GeneratedCopyVariation = {
  angle: "dor" | "resultado" | "oferta"
  text: string
}

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
  feed_image_url: string | null
  story_image_url: string | null
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
  geo_locations?: Record<string, unknown>
}

const buildFormData = (
  payload: CreateBaseAdCreativePayload,
  feedFile?: File,
  storyFile?: File
): FormData => {
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

  if (feedFile) formData.append(`${prefix}[feed_image]`, feedFile)
  if (storyFile) formData.append(`${prefix}[story_image]`, storyFile)

  return formData
}

export type GenerateImageInputs = {
  productImage: string
  adText: string
  adName: string
  productService?: string
  style: "professional" | "vibrant" | "natural"
}

export const generateImage = async (inputs: GenerateImageInputs): Promise<string> => {
  const res = await api<{ image_data_url: string }>(
    "/api/v1/base_ad_creatives/generate_image",
    {
      method: "POST",
      body: {
        product_image: inputs.productImage,
        ad_text: inputs.adText,
        ad_name: inputs.adName,
        product_service: inputs.productService,
        style: inputs.style,
      },
    }
  )
  return res.image_data_url
}

export const generateCopy = async (inputs: CopyInputs): Promise<GeneratedCopyVariation[]> => {
  const res = await api<{ primary_texts: GeneratedCopyVariation[] }>(
    "/api/v1/base_ad_creatives/generate_copy",
    {
      method: "POST",
      body: { copy_inputs: inputs },
    }
  )
  return res.primary_texts
}

export const createBaseAdCreative = async (
  payload: CreateBaseAdCreativePayload,
  feedFile?: File,
  storyFile?: File
) => {
  const hasFile = feedFile || storyFile
  const body = hasFile
    ? buildFormData(payload, feedFile, storyFile)
    : { base_ad_creative: payload }
  const res = await api<{ base_ad_creative: BaseAdCreative }>("/api/v1/base_ad_creatives", {
    method: "POST",
    body,
  })
  return res.base_ad_creative
}
