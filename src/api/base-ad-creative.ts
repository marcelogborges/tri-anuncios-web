import { api } from "@/lib/api"

export type CopyInputs = {
  briefing?: string
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

export type AdMediaType = "static_image" | "video" | "carousel"

export type CarouselCardResponse = {
  id: number
  position: number
  headline: string | null
  description: string | null
  link: string | null
  image_url: string | null
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
  geo_locations: Record<string, unknown>
  media_type: AdMediaType
  feed_image_url: string | null
  story_image_url: string | null
  video_url: string | null
  carousel_cards: CarouselCardResponse[]
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
  media_type?: AdMediaType
  geo_locations?: Record<string, unknown>
}

export type CarouselCardUpload = {
  image: File
  headline?: string
  description?: string
  link?: string
}

export type CreateBaseAdCreativeMedia = {
  feedFile?: File
  storyFile?: File
  videoFile?: File
  carouselCards?: CarouselCardUpload[]
}

const buildFormData = (
  payload: CreateBaseAdCreativePayload,
  media: CreateBaseAdCreativeMedia
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

  if (media.feedFile) formData.append(`${prefix}[feed_image]`, media.feedFile)
  if (media.storyFile) formData.append(`${prefix}[story_image]`, media.storyFile)
  if (media.videoFile) formData.append(`${prefix}[video]`, media.videoFile)

  media.carouselCards?.forEach((card, index) => {
    const cardPrefix = `${prefix}[carousel_cards_attributes][${index}]`
    formData.append(`${cardPrefix}[position]`, String(index))
    formData.append(`${cardPrefix}[image]`, card.image)
    if (card.headline) formData.append(`${cardPrefix}[headline]`, card.headline)
    if (card.description) formData.append(`${cardPrefix}[description]`, card.description)
    if (card.link) formData.append(`${cardPrefix}[link]`, card.link)
  })

  return formData
}

export type GenerateImageInputs = {
  productImage?: string
  adText: string
  adName: string
  productService?: string
  style: "professional" | "vibrant" | "natural"
  imageFormat?: "feed" | "story"
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
        image_format: inputs.imageFormat,
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
  media: CreateBaseAdCreativeMedia = {}
) => {
  const hasFile =
    media.feedFile || media.storyFile || media.videoFile || (media.carouselCards?.length ?? 0) > 0
  const body = hasFile
    ? buildFormData(payload, media)
    : { base_ad_creative: payload }
  const res = await api<{ base_ad_creative: BaseAdCreative }>("/api/v1/base_ad_creatives", {
    method: "POST",
    body,
  })
  return res.base_ad_creative
}
