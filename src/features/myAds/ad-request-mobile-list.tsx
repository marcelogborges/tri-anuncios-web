"use client"

import type { AdRequest } from "@/api/ad-request"
import { AdRequestMobileRow } from "@/features/myAds/ad-request-mobile-row"

type AdRequestMobileListProps = {
  adRequests: AdRequest[]
}

export const AdRequestMobileList = ({ adRequests }: AdRequestMobileListProps) => {
  const rows = adRequests.map(ad => <AdRequestMobileRow key={ad.id} adRequest={ad} />)

  return <div className="overflow-hidden rounded-lg border bg-card">{rows}</div>
}
