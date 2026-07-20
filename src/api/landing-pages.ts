import { api } from "@/lib/api"
import type { Data } from "@measured/puck"

export type LandingPageStatus = "draft" | "published" | "archived"

export type LandingPage = {
  id: number
  name: string
  slug: string
  status: LandingPageStatus
  content: Data
  meta_pixel_id: string | null
  ad_request_id: number | null
  views_count: number
  leads_count: number
  public_url: string
  published_at: string | null
  created_at: string
  updated_at: string
}

export type PublicLandingPage = {
  id: number
  name: string
  slug: string
  org_slug: string
  meta_pixel_id: string | null
  content: Data
}

export type LandingPageLead = {
  id: number
  data: Record<string, string>
  event_id: string
  tracking: Record<string, string>
  capi_status: "pending" | "sent" | "failed" | "skipped"
  created_at: string
}

export type MetaPixel = { id: string; name: string }

export async function getLandingPages(): Promise<LandingPage[]> {
  const res = await api<{ landing_pages: LandingPage[] }>("/api/v1/landing_pages")
  return res.landing_pages
}

export async function getLandingPage(id: number): Promise<LandingPage> {
  const res = await api<{ landing_page: LandingPage }>(`/api/v1/landing_pages/${id}`)
  return res.landing_page
}

export async function createLandingPage(payload: {
  name: string
  slug?: string
  content: Data
}): Promise<LandingPage> {
  const res = await api<{ landing_page: LandingPage }>("/api/v1/landing_pages", {
    method: "POST",
    body: { landing_page: payload },
  })
  return res.landing_page
}

export async function updateLandingPage(
  id: number,
  payload: Partial<{
    name: string
    slug: string
    content: Data
    meta_pixel_id: string | null
    ad_request_id: number | null
  }>,
): Promise<LandingPage> {
  const res = await api<{ landing_page: LandingPage }>(`/api/v1/landing_pages/${id}`, {
    method: "PATCH",
    body: { landing_page: payload },
  })
  return res.landing_page
}

export async function deleteLandingPage(id: number): Promise<void> {
  await api(`/api/v1/landing_pages/${id}`, { method: "DELETE" })
}

export async function publishLandingPage(id: number): Promise<LandingPage> {
  const res = await api<{ landing_page: LandingPage }>(`/api/v1/landing_pages/${id}/publish`, {
    method: "POST",
  })
  return res.landing_page
}

export async function unpublishLandingPage(id: number): Promise<LandingPage> {
  const res = await api<{ landing_page: LandingPage }>(`/api/v1/landing_pages/${id}/unpublish`, {
    method: "POST",
  })
  return res.landing_page
}

export async function getLandingPageLeads(id: number): Promise<LandingPageLead[]> {
  const res = await api<{ leads: LandingPageLead[] }>(`/api/v1/landing_pages/${id}/leads`)
  return res.leads
}

export async function uploadLandingPageImage(file: File): Promise<{ id: number; url: string }> {
  const body = new FormData()
  body.append("file", file)
  const res = await api<{ image: { id: number; url: string } }>("/api/v1/landing_page_images", {
    method: "POST",
    body,
  })
  return res.image
}

export async function getMetaPixels(): Promise<MetaPixel[]> {
  const res = await api<{ pixels: MetaPixel[] }>("/api/v1/meta/pixels")
  return res.pixels
}

/* Public endpoints (no auth) — used by the published page. */

export async function getPublicLandingPage(orgSlug: string, slug: string): Promise<PublicLandingPage> {
  const res = await api<{ landing_page: PublicLandingPage }>(
    `/api/v1/public/landing_pages/${orgSlug}/${slug}`,
  )
  return res.landing_page
}

export async function createPublicLead(
  orgSlug: string,
  slug: string,
  payload: {
    data: Record<string, string>
    event_id: string
    tracking: Record<string, string>
  },
): Promise<{ id: number; event_id: string }> {
  const res = await api<{ lead: { id: number; event_id: string } }>(
    `/api/v1/public/landing_pages/${orgSlug}/${slug}/leads`,
    { method: "POST", body: { lead: payload } },
  )
  return res.lead
}
