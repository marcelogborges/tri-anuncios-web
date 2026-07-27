"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { CreativeDetails } from "./creative-details"
import { useSwipeTabs } from "./use-swipe-tabs"
import { useIsMobile } from "@/lib/use-is-mobile"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LivePublicationBlock,
  PublicationHistoryBlock,
  RepublishCtaBlock,
} from "./publication-blocks"
import { AdPreview } from "@/features/adCreationFlow/ad-preview"
import { CALL_TO_ACTION_LABELS } from "@/features/adCreationFlow/constants"
import { useAuth } from "@/lib/auth-context"
import { getOrganization } from "@/api/organization"
import { getPlatformPublicationInsights } from "@/api/platform-publication"
import { AD_REQUEST_STATUS_INFO, PRICING_TIER_LABELS, type AdRequest } from "@/api/ad-request"
import type { InsightsData } from "@/api/platform-publication"
import { formatDayMonth } from "@/lib/format"

const DETAIL_TAB_CLASS =
  "shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-[var(--shadow-ambient)]"

const TAB_LABELS: Record<string, string> = {
  estatisticas: "Estatísticas",
  detalhes: "Detalhes",
  preview: "Preview",
  historico: "Histórico",
}

type AdDetailProps = {
  adRequest: AdRequest
  onRefresh: () => void
}

export const AdDetail = ({ adRequest, onRefresh }: AdDetailProps) => {
  const { user } = useAuth()
  const isMobile = useIsMobile()
  const [insights, setInsights] = useState<InsightsData | null>(null)
  const [organizationName, setOrganizationName] = useState<string | undefined>(undefined)
  const [activeTab, setActiveTab] = useState("estatisticas")
  const tabsListRef = useRef<HTMLDivElement | null>(null)

  const isLive =
    adRequest.status === "published" || adRequest.status === "partially_published"

  const activePub = adRequest.platform_publications?.find(
    (p) => p.status === "published"
  ) ?? (isLive ? adRequest.platform_publications?.[adRequest.platform_publications.length - 1] : null)

  useEffect(() => {
    if (!activePub) return
    const loadInsights = async () => {
      try {
        const res = await getPlatformPublicationInsights(adRequest.id, activePub.id)
        const data = res.data
        if (data && "impressions" in data) {
          setInsights(data as InsightsData)
        }
      } catch {}
    }
    loadInsights()
  }, [activePub?.id])

  useEffect(() => {
    const pill = tabsListRef.current?.querySelector('[data-state="active"]')
    pill?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
  }, [activeTab])

  useEffect(() => {
    if (!user?.organization_id) return
    const loadOrganization = async () => {
      try {
        const org = await getOrganization(user.organization_id)
        setOrganizationName(org.name)
      } catch {}
    }
    loadOrganization()
  }, [user?.organization_id])

  const statusInfo = AD_REQUEST_STATUS_INFO[adRequest.status] ?? { label: adRequest.status, isLive: false }
  const pubCount = adRequest.platform_publications?.length ?? 0
  const creative = adRequest.base_ad_creative
  const adName = creative?.name ?? ""

  const pubs = adRequest.platform_publications ?? []
  const durationDays = adRequest.duration_days ?? adRequest.ad_package?.duration_days ?? 14
  const packageName = adRequest.pricing_tier
    ? PRICING_TIER_LABELS[adRequest.pricing_tier]
    : (adRequest.ad_package?.name ?? null)
  const sortedPubs = [...pubs].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )
  const activePubIndex = activePub
    ? sortedPubs.findIndex((p) => p.id === activePub.id) + 1
    : null

  const carouselCards = (creative.carousel_cards ?? [])
    .filter((card) => card.image_url)
    .map((card) => ({ imageUrl: card.image_url!, headline: card.headline ?? undefined }))

  const tabKeys = ["estatisticas", "detalhes", "preview", ...(pubs.length > 0 ? ["historico"] : [])]
  const activeIndex = tabKeys.indexOf(activeTab)
  const previousTab = activeIndex > 0 ? tabKeys[activeIndex - 1] : null
  const nextTab = activeIndex < tabKeys.length - 1 ? tabKeys[activeIndex + 1] : null
  const swipeHandlers = useSwipeTabs({
    tabs: tabKeys,
    active: activeTab,
    enabled: isMobile,
    onChange: setActiveTab,
  })

  return (
    <div className="mx-auto max-w-[1280px] px-4 pb-20 pt-8 sm:px-8">
      <nav className="mb-6 flex items-center gap-2 text-body-sm text-muted-foreground">
        <Link href="/anuncios" className="shrink-0 transition-colors hover:text-foreground">
          Meus anúncios
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" />
        <span className="truncate font-bold text-foreground">{adName}</span>
      </nav>
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-title-1">{adName}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
              statusInfo.isLive
                ? "bg-secondary text-secondary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            {statusInfo.isLive && (
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            )}
            {statusInfo.label}
          </span>
          <span className="text-body-sm font-normal text-muted-foreground">
            · {pubCount} {pubCount !== 1 ? "publicações" : "publicação"} · criado em{" "}
            {formatDayMonth(adRequest.created_at)}
          </span>
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList
          ref={tabsListRef}
          className="mb-4 flex h-auto w-full max-w-full justify-start gap-1 overflow-x-auto rounded-full border-none bg-muted p-1 lg:hidden"
        >
          <TabsTrigger value="estatisticas" className={DETAIL_TAB_CLASS}>
            Estatísticas
          </TabsTrigger>
          <TabsTrigger value="detalhes" className={DETAIL_TAB_CLASS}>
            Detalhes
          </TabsTrigger>
          <TabsTrigger value="preview" className={DETAIL_TAB_CLASS}>
            Preview
          </TabsTrigger>
          <TabsTrigger value="historico" className={DETAIL_TAB_CLASS} disabled={pubs.length === 0}>
            Histórico
          </TabsTrigger>
        </TabsList>
        <div
          onTouchStart={swipeHandlers.onTouchStart}
          onTouchEnd={swipeHandlers.onTouchEnd}
          className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[400px_1fr]"
        >
          <TabsContent
            forceMount
            value="estatisticas"
            className="mt-0 w-full data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:duration-200 data-[state=inactive]:hidden lg:col-start-2 lg:row-start-1 lg:data-[state=inactive]:block"
          >
            {isLive && activePub && activePubIndex != null ? (
              <LivePublicationBlock
                adRequestId={adRequest.id}
                pub={activePub}
                pubIndex={activePubIndex}
                durationDays={durationDays}
                budgetCents={adRequest.budget_amount_cents}
                insights={insights}
              />
            ) : (
              <RepublishCtaBlock
                adRequestId={adRequest.id}
                hasPreviousPublications={pubs.length > 0}
                onPublished={onRefresh}
              />
            )}
          </TabsContent>
          <TabsContent
            forceMount
            value="preview"
            className="mt-0 w-full data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:duration-200 data-[state=inactive]:hidden lg:sticky lg:top-6 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:data-[state=inactive]:block"
          >
            <AdPreview
              name={creative.headline ?? creative.name}
              message={creative.message ?? undefined}
              feedImageUrl={creative.feed_image_url ?? undefined}
              storyImageUrl={creative.story_image_url ?? undefined}
              videoUrl={creative.video_url ?? undefined}
              carousel={carouselCards.length > 0 ? carouselCards : undefined}
              organizationName={organizationName}
              link={creative.link}
              callToAction={
                creative.call_to_action
                  ? CALL_TO_ACTION_LABELS[creative.call_to_action] ?? undefined
                  : undefined
              }
              footnote="Como seu anúncio aparece no Facebook e Instagram"
            />
          </TabsContent>
          <TabsContent
            forceMount
            value="detalhes"
            className="mt-0 w-full data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:duration-200 data-[state=inactive]:hidden lg:col-start-2 lg:row-start-2 lg:data-[state=inactive]:block"
          >
            <CreativeDetails creative={creative} />
          </TabsContent>
          {pubs.length > 0 && (
            <TabsContent
              forceMount
              value="historico"
              className="mt-0 w-full data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:duration-200 data-[state=inactive]:hidden lg:col-start-2 lg:row-start-3 lg:data-[state=inactive]:block"
            >
              <PublicationHistoryBlock
                adRequestId={adRequest.id}
                publications={pubs}
                durationDays={durationDays}
                packageName={packageName}
                activeInsights={insights}
                activePubId={activePub?.id ?? null}
              />
            </TabsContent>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => previousTab && setActiveTab(previousTab)}
            disabled={!previousTab}
            className="flex min-w-0 items-center gap-1 rounded-full px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:invisible"
          >
            <ChevronLeft className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{previousTab ? TAB_LABELS[previousTab] : ""}</span>
          </button>
          <span className="flex shrink-0 items-center gap-1">
            {tabKeys.map((key) => (
              <span
                key={key}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  key === activeTab ? "w-4 bg-primary" : "w-1.5 bg-border"
                )}
              />
            ))}
          </span>
          <button
            type="button"
            onClick={() => nextTab && setActiveTab(nextTab)}
            disabled={!nextTab}
            className="flex min-w-0 items-center justify-end gap-1 rounded-full px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:invisible"
          >
            <span className="truncate">{nextTab ? TAB_LABELS[nextTab] : ""}</span>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          </button>
        </div>
      </Tabs>
    </div>
  )
}
