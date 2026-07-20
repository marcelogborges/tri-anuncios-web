"use client"

import { useEffect, useMemo, useSyncExternalStore } from "react"
import { Render } from "@measured/puck"

import { createPublicLead, type PublicLandingPage } from "@/api/landing-pages"
import { landingPageConfig } from "./puck-config"
import { applyDynamicText } from "./dynamic-text"
import {
  collectMetaBrowserData,
  collectTrackingParams,
  generateEventId,
  initMetaPixel,
  trackLead,
} from "./meta-pixel"
import { LandingPageRuntimeProvider, type LandingPageRuntime } from "./runtime-context"

/**
 * Renders a published landing page.
 * - Applies Dynamic Text Replacement from query params
 * - Boots the Meta Pixel (PageView) when the page has a pixel
 * - On lead submit: fires the browser "Lead" event and POSTs the lead to the
 *   API with the same event_id, which relays it via Conversions API (dedup).
 */
export function PublicLandingPageView({ page }: { page: PublicLandingPage }) {
  useEffect(() => {
    if (page.meta_pixel_id) initMetaPixel(page.meta_pixel_id)
  }, [page.meta_pixel_id])

  // DTR depends on query params, which only exist in the browser. The
  // external-store hook makes the server render (and first client render)
  // use the raw content, then re-render once with DTR applied — keeping
  // hydration consistent.
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
  const data = useMemo(() => {
    if (!isClient) return page.content
    return applyDynamicText(page.content, new URLSearchParams(window.location.search))
  }, [isClient, page.content])

  const runtime = useMemo<LandingPageRuntime>(
    () => ({
      submitLead: async ({ fields }) => {
        const eventId = generateEventId()
        const { fbp, fbc } = collectMetaBrowserData()

        const tracking: Record<string, string> = {
          ...collectTrackingParams(),
          source_url: window.location.href,
        }
        if (fbp) tracking.fbp = fbp
        if (fbc) tracking.fbc = fbc

        await createPublicLead(page.org_slug, page.slug, {
          data: fields,
          event_id: eventId,
          tracking,
        })

        if (page.meta_pixel_id) trackLead(eventId)
      },
    }),
    [page.org_slug, page.slug, page.meta_pixel_id],
  )

  return (
    <LandingPageRuntimeProvider value={runtime}>
      <Render config={landingPageConfig} data={data} />
    </LandingPageRuntimeProvider>
  )
}
