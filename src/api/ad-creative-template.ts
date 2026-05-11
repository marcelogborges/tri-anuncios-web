import { api } from "@/lib/api"

export type AdCreativeTemplate = {
  id: number
  name: string
}

export const listAdCreativeTemplates = async (): Promise<AdCreativeTemplate[]> => {
  return api<AdCreativeTemplate[]>("/api/v1/ad_creative_templates")
}
