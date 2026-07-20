import { cache } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { PublicLandingPageView } from "@/features/landingPages/public-landing-page"
import type { PublicLandingPage } from "@/api/landing-pages"

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL ?? "http://localhost:3000"

// react cache() dedupes the generateMetadata + page fetches within one request,
// so a visit counts as a single view on the API.
const fetchPage = cache(async (orgSlug: string, slug: string): Promise<PublicLandingPage | null> => {
  const res = await fetch(`${API_URL}/api/v1/public/landing_pages/${orgSlug}/${slug}`, {
    cache: "no-store",
  })
  if (!res.ok) return null
  const json = await res.json()
  return json.landing_page
})

type Props = { params: Promise<{ orgSlug: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orgSlug, slug } = await params
  const page = await fetchPage(orgSlug, slug)
  return { title: page?.name ?? "Página não encontrada" }
}

export default async function PublicPage({ params }: Props) {
  const { orgSlug, slug } = await params
  const page = await fetchPage(orgSlug, slug)
  if (!page) notFound()

  return <PublicLandingPageView page={page} />
}
