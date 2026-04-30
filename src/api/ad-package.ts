import { api } from "@/lib/api"

export type AdPackage = {
  id: number
  name: string
  description: string | null
  price_cents: number
  duration_days: number
  platform_providers: string[]
  active: boolean
}

type AdPackagesResponse = {
  ad_packages: AdPackage[]
}

export const getAdPackages = async () => {
  const res = await api<AdPackagesResponse>("/api/v1/ad_packages")
  return res.ad_packages
}
