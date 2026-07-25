"use client"

import { useEffect, useState } from "react"
import { AD_REQUEST_STATUS_INFO, type AdRequest } from "@/api/ad-request"
import { getPlatformPublicationInsights, type InsightsData } from "@/api/platform-publication"

export const useAdRequestInsights = (adRequest: AdRequest) => {
  const statusInfo = AD_REQUEST_STATUS_INFO[adRequest.status] ?? { label: adRequest.status, isLive: false }
  const metaPublication = adRequest.platform_publications?.find(p => p.provider === "meta")
  const [insights, setInsights] = useState<InsightsData | null>(null)

  useEffect(() => {
    if (!statusInfo.isLive || !metaPublication) return

    const loadInsights = async () => {
      try {
        const res = await getPlatformPublicationInsights(adRequest.id, metaPublication.id)
        const data = res.data

        if (data && Object.keys(data).length > 0) {
          setInsights(data as InsightsData)
        }
      } catch {}
    }

    loadInsights()
  }, [metaPublication?.id, statusInfo.isLive])

  return insights
}
