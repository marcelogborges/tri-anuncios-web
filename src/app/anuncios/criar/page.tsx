"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { AuthGuard } from "@/lib/auth-guard"
import { useAuth } from "@/lib/auth-context"
import { Layout } from "@/components/layout"
import { AdPreview } from "@/features/adCreationFlow/ad-preview"
import type { AdPreviewProps } from "@/features/adCreationFlow/ad-preview"
import { getOrganization } from "@/api/organization"
import type { Organization } from "@/api/organization"
import { createBaseAdCreative } from "@/api/base-ad-creative"
import type { CreateBaseAdCreativePayload } from "@/api/base-ad-creative"
import { createAdRequest } from "@/api/ad-request"
import { CompleteOrganizationStep } from "@/features/adCreationFlow/complete-organization-step"
import { AdBasicInfoStep } from "@/features/adCreationFlow/ad-basic-info-step"
import type { AdBasicInfo } from "@/features/adCreationFlow/ad-basic-info-step"
import { AdMediaStep } from "@/features/adCreationFlow/ad-media-step"
import type { AdMediaFiles, AdMediaLivePreview } from "@/features/adCreationFlow/ad-media-step"
import type { AdImageData } from "@/features/adCreationFlow/use-ad-creation-flow"
import { AdMessageStep } from "@/features/adCreationFlow/ad-message-step"
import { GeoLocationStep } from "@/features/adCreationFlow/geo-location-step"
import type { GeoLocationData } from "@/features/adCreationFlow/geo-location-step"
import { AdObjectiveStep } from "@/features/adCreationFlow/ad-objective-step"
import type { AdObjectiveData } from "@/features/adCreationFlow/ad-objective-step"
import { ReviewStep } from "@/features/adCreationFlow/review-step"
import { useAdCreationFlow } from "@/features/adCreationFlow/use-ad-creation-flow"
import {
  saveAdImageFile,
  loadAdImageFiles,
  loadAdVideoFiles,
  loadCarouselFiles,
  clearCarouselFiles,
  carouselSlot,
} from "@/features/adCreationFlow/ad-image-store"
import { createLandingPage, getLandingPage } from "@/api/landing-pages"
import type { LandingPageTemplate } from "@/features/landingPages/templates"
import { PublishAdModal } from "@/features/myAds/publish-ad-modal"
import { getPlatformAccounts } from "@/api/platform-accounts"
import { MetaConnectModal } from "@/features/myAds/meta-connect-modal"

const TOTAL_STEPS = 6

const CriarAnuncioPage = () => {
  const router = useRouter()
  const { user } = useAuth()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [publishModalOpen, setPublishModalOpen] = useState(false)
  const [metaModalOpen, setMetaModalOpen] = useState(false)
  const [createdAdRequestId, setCreatedAdRequestId] = useState<number | null>(null)
  const [adFeedImageFile, setAdFeedImageFile] = useState<File | null>(null)
  const [adStoryImageFile, setAdStoryImageFile] = useState<File | null>(null)
  const [adVideoFile, setAdVideoFile] = useState<File | null>(null)
  const [adThumbFile, setAdThumbFile] = useState<File | null>(null)
  const [carouselFiles, setCarouselFiles] = useState<Array<File | null>>([])
  const [livePreview, setLivePreview] = useState<{
    name?: string
    message?: string
    feedImageUrl?: string
    storyImageUrl?: string
    videoUrl?: string
    carousel?: Array<{ imageUrl: string; headline?: string }>
    link?: string
  }>({})
  const flow = useAdCreationFlow()

  // Fresh step for async callbacks — flow.step inside useCallback closures can
  // be stale (created pre-hydration) and would clobber a restored/deep-linked step.
  const stepRef = useRef(flow.step)
  stepRef.current = flow.step

  const fetchOrganization = useCallback(async () => {
    if (!user) return
    try {
      const org = await getOrganization(user.organization_id)
      setOrganization(org)
      const needsCompletion = !org.sector || !org.niche
      if (needsCompletion) {
        flow.update({ step: 0 })
      } else if (stepRef.current === 0) {
        flow.update({ step: 1 })
      }
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  useEffect(() => {
    if (flow.hydrated) fetchOrganization()
  }, [flow.hydrated, fetchOrganization])

  useEffect(() => {
    if (!flow.hydrated) return

    const revoke: string[] = []

    const makeUrl = (file: File) => {
      const url = URL.createObjectURL(file)
      revoke.push(url)
      return url
    }

    const hydrateImages = async () => {
      try {
        const adImage = flow.adImage

        if (adImage?.type === "video") {
          const { video, thumb } = await loadAdVideoFiles()
          if (!video || !thumb) {
            flow.update({ adImage: null, step: Math.min(flow.step, 3) })
            return
          }
          setAdVideoFile(video)
          setAdThumbFile(thumb)
          const videoUrl = makeUrl(video)
          const thumbUrl = makeUrl(thumb)
          setLivePreview((p) => ({ ...p, videoUrl, feedImageUrl: thumbUrl }))
          flow.update({
            adImage: { ...adImage, videoPreviewUrl: videoUrl, thumbPreviewUrl: thumbUrl },
          })
          return
        }

        if (adImage?.type === "carousel") {
          const files = await loadCarouselFiles(adImage.cards.length)
          if (files.some((f) => !f)) {
            flow.update({ adImage: null, step: Math.min(flow.step, 3) })
            return
          }
          setCarouselFiles(files)
          const cards = adImage.cards.map((card, i) => ({ ...card, previewUrl: makeUrl(files[i]!) }))
          setLivePreview((p) => ({
            ...p,
            carousel: cards.map((c) => ({ imageUrl: c.previewUrl, headline: c.headline })),
          }))
          flow.update({ adImage: { ...adImage, cards } })
          return
        }

        const { feed, story } = await loadAdImageFiles()

        setAdFeedImageFile(feed)
        setAdStoryImageFile(story)

        if (adImage?.type === "file" && !feed) {
          flow.update({ adImage: null, step: Math.min(flow.step, 3) })
        } else if (adImage?.type === "file") {
          const feedUrl = makeUrl(feed!)
          const storyUrl = story ? makeUrl(story) : undefined

          setLivePreview((p) => ({ ...p, feedImageUrl: feedUrl, storyImageUrl: storyUrl }))
          flow.update({
            adImage: {
              ...adImage,
              feedPreviewUrl: feedUrl,
              storyPreviewUrl: storyUrl,
            },
          })
        } else if (adImage?.type === "generated") {
          setLivePreview((p) => ({ ...p, feedImageUrl: adImage.dataUrl }))
        }
      } catch (err) {
        console.error("Failed to restore ad images", err)
      }
    }

    hydrateImages()

    return () => revoke.forEach((url) => URL.revokeObjectURL(url))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flow.hydrated])

  const handleOrgComplete = (updated: Organization) => {
    setOrganization(updated)
    flow.update({ step: 1 })
  }

  const handleBasicInfoComplete = (data: AdBasicInfo) => {
    flow.update({ adBasicInfo: data, step: 2 })
  }

  const handleMediaComplete = (image: AdImageData, files: AdMediaFiles) => {
    if (image.type === "video") {
      if (files.video?.video) {
        setAdVideoFile(files.video.video)
        saveAdImageFile("video", files.video.video)
      }
      if (files.video?.thumb) {
        setAdThumbFile(files.video.thumb)
        saveAdImageFile("thumb", files.video.thumb)
      }
      setAdFeedImageFile(null)
      setAdStoryImageFile(null)
      setCarouselFiles([])
      saveAdImageFile("feed", null)
      saveAdImageFile("story", null)
      clearCarouselFiles()
    } else if (image.type === "carousel") {
      // merge with files restored from IndexedDB: a null entry means the card
      // kept its previously stored file
      const merged = (files.carousel ?? []).map((f, i) => f ?? carouselFiles[i] ?? null)
      setCarouselFiles(merged)
      clearCarouselFiles().then(() => {
        merged.forEach((f, i) => {
          if (f) saveAdImageFile(carouselSlot(i), f)
        })
      })
      setAdFeedImageFile(null)
      setAdStoryImageFile(null)
      setAdVideoFile(null)
      setAdThumbFile(null)
      saveAdImageFile("feed", null)
      saveAdImageFile("story", null)
      saveAdImageFile("video", null)
      saveAdImageFile("thumb", null)
    } else {
      setAdFeedImageFile(files.feed ?? null)
      setAdStoryImageFile(files.story ?? null)
      saveAdImageFile("feed", files.feed ?? null)
      saveAdImageFile("story", files.story ?? null)
      setAdVideoFile(null)
      setAdThumbFile(null)
      setCarouselFiles([])
      saveAdImageFile("video", null)
      saveAdImageFile("thumb", null)
      clearCarouselFiles()
    }
    flow.update({ adImage: image, step: 4 })
  }

  const handleMessageComplete = (message: string) => {
    flow.update({ adMessage: message, step: 3 })
  }

  const handleGeoLocationComplete = (data: GeoLocationData) => {
    flow.update({ geoLocation: data, step: 5 })
  }

  const handleObjectiveComplete = (data: AdObjectiveData) => {
    flow.update({ optimizationGoal: data, step: 6 })
  }

  // Creates the landing page picked in the objective step and jumps to the
  // editor; flow state stays in localStorage so the user comes right back.
  const handleCreateLandingPageForAd = async (name: string, template: LandingPageTemplate, slug: string) => {
    const page = await createLandingPage({ name, slug, content: template.content })
    flow.update({ optimizationGoal: { objective: "link_clicks", link: "", landingPage: null } })
    router.push(`/landing-pages/editor/${page.id}?from=criar-anuncio&step=${flow.step}`)
  }

  const handleEditLandingPageForAd = (id: number) => {
    router.push(`/landing-pages/editor/${id}?from=criar-anuncio&step=${flow.step}`)
  }

  // Deep-link handling on return to the flow:
  // ?step=<n> jumps to that step; ?lp=<id> also reselects the landing page.
  const returnParamsHandled = useRef(false)
  useEffect(() => {
    if (!flow.hydrated || returnParamsHandled.current) return
    const params = new URLSearchParams(window.location.search)
    const lpId = Number(params.get("lp"))
    const stepParam = Number(params.get("step"))
    const targetStep =
      Number.isInteger(stepParam) && stepParam >= 1 && stepParam <= TOTAL_STEPS ? stepParam : null
    if (!lpId && targetStep === null) return
    returnParamsHandled.current = true

    if (!lpId) {
      flow.update({ step: targetStep as number })
      router.replace("/anuncios/criar")
      return
    }
    getLandingPage(lpId).then((page) => {
      flow.update({
        step: targetStep ?? 5,
        optimizationGoal: {
          objective: "link_clicks",
          link: page.public_url,
          landingPage: { id: page.id, name: page.name, status: page.status, public_url: page.public_url },
        },
      })
      setLivePreview((p) => ({ ...p, link: page.public_url }))
      router.replace("/anuncios/criar")
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flow.hydrated])

  const handleEditStep = (step: number) => {
    flow.update({ step })
  }

  const handleBack = () => {
    if (flow.step <= 1) {
      router.push("/anuncios")
    } else {
      flow.update({ step: flow.step - 1 })
    }
  }

  const mediaTypeFromFlow = (): "static_image" | "video" | "carousel" => {
    if (flow.adImage?.type === "video") return "video"
    if (flow.adImage?.type === "carousel") return "carousel"
    return "static_image"
  }

  const buildCreativePayload = (): CreateBaseAdCreativePayload => ({
    organization_id: user!.organization_id,
    name: flow.adBasicInfo?.name ?? "",
    product_service: flow.adBasicInfo?.productService ?? undefined,
    message: flow.adMessage ?? undefined,
    optimization_goal: flow.optimizationGoal?.objective ?? undefined,
    link: flow.optimizationGoal?.link ?? undefined,
    media_type: mediaTypeFromFlow(),
    geo_locations: buildGeoLocations(),
  })

  const buildGeoLocations = (): Record<string, unknown> | undefined => {
    const geo = flow.geoLocation
    const geoCities = geo?.cities ?? []
    const geoStates = geo?.states ?? []
    if (geoCities.length === 0 && geoStates.length === 0) return undefined

    const payload: Record<string, unknown> = {
      countries: ["BR"],
      location_types: ["home", "recent"],
    }
    if (geoCities.length > 0) {
      payload.cities = geoCities.map((c) => ({ key: c.id.toString(), name: c.name, region: c.state }))
    }
    if (geoStates.length > 0) {
      payload.regions = geoStates.map((s) => ({ key: s.id.toString(), name: s.name, region: s.uf }))
    }
    return payload
  }

  const buildCreativeMedia = () => {
    const mediaType = mediaTypeFromFlow()

    if (mediaType === "video") {
      return {
        videoFile: adVideoFile ?? undefined,
        // the thumbnail doubles as the required video cover (feed_image)
        feedFile: adThumbFile ?? undefined,
      }
    }

    if (mediaType === "carousel") {
      const cards = flow.adImage?.type === "carousel" ? flow.adImage.cards : []
      return {
        carouselCards: cards.flatMap((card, i) => {
          const file = carouselFiles[i]
          if (!file) return []
          return [{ image: file, headline: card.headline, description: card.description, link: card.link }]
        }),
      }
    }

    return {
      feedFile: adFeedImageFile ?? undefined,
      storyFile: adStoryImageFile ?? adFeedImageFile ?? undefined,
    }
  }

  const createDraftAdRequest = async () => {
    if (!user) return null
    const creative = await createBaseAdCreative(buildCreativePayload(), buildCreativeMedia())
    const adRequest = await createAdRequest({
      organization_id: user.organization_id,
      user_id: user.id,
      base_ad_creative_id: creative.id,
    })
    return adRequest
  }

  const proceedWithPublish = async () => {
    try {
      const adRequest = await createDraftAdRequest()
      if (adRequest) {
        setCreatedAdRequestId(adRequest.id)
        setPublishModalOpen(true)
      }
    } catch (err) {
      console.error("Failed to create ad request", err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSaveDraft = async () => {
    if (!user || submitting) return
    setSubmitting(true)
    try {
      await createDraftAdRequest()
      flow.clear()
      router.push("/anuncios")
    } catch (err) {
      console.error("Failed to save draft", err)
    } finally {
      setSubmitting(false)
    }
  }

  const handlePublish = async () => {
    if (!user || submitting) return
    setSubmitting(true)
    try {
      const accounts = await getPlatformAccounts()
      const hasMeta = accounts.some(
        (a) => a.provider === "meta" && a.status === "active"
      )
      if (!hasMeta) {
        setMetaModalOpen(true)
        setSubmitting(false)
        return
      }
      await proceedWithPublish()
    } catch (err) {
      console.error("Failed to check platform accounts", err)
      setSubmitting(false)
    }
  }

  const handlePublished = () => {
    setPublishModalOpen(false)
    flow.clear()
    router.push("/anuncios")
  }

  const onMetaConnected = async () => {
    setMetaModalOpen(false)
    await proceedWithPublish()
  }

  const renderStep = () => {
    if (loading || !flow.hydrated) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      )
    }

    switch (flow.step) {
      case 0:
        return organization ? (
          <CompleteOrganizationStep
            organization={organization}
            onComplete={handleOrgComplete}
          />
        ) : null
      case 1:
        return (
          <AdBasicInfoStep
            initialValues={flow.adBasicInfo}
            onComplete={handleBasicInfoComplete}
            onLiveChange={(name) => setLivePreview((p) => ({ ...p, name }))}
          />
        )
      case 2:
        return (
          <AdMessageStep
            initialValue={flow.adMessage}
            adName={flow.adBasicInfo?.name}
            adProductService={flow.adBasicInfo?.productService}
            onComplete={handleMessageComplete}
            onLiveChange={(message) => setLivePreview((p) => ({ ...p, message }))}
          />
        )
      case 3:
        return (
          <AdMediaStep
            initialValue={flow.adImage}
            adMessage={flow.adMessage}
            adName={flow.adBasicInfo?.name}
            adProductService={flow.adBasicInfo?.productService}
            onComplete={handleMediaComplete}
            onLiveChange={(preview: AdMediaLivePreview) =>
              setLivePreview((p) => ({
                ...p,
                feedImageUrl: preview.feedUrl ?? undefined,
                storyImageUrl: preview.storyUrl ?? undefined,
                videoUrl: preview.videoUrl ?? undefined,
                carousel: preview.carousel,
              }))
            }
          />
        )
      case 4:
        return (
          <GeoLocationStep
            initialValues={flow.geoLocation}
            onComplete={handleGeoLocationComplete}
          />
        )
      case 5:
        return (
          <AdObjectiveStep
            key={flow.optimizationGoal?.landingPage?.id ?? "no-lp"}
            initialValues={flow.optimizationGoal}
            onComplete={handleObjectiveComplete}
            onLiveChange={(link) => setLivePreview((p) => ({ ...p, link: link ?? undefined }))}
            onCreateLandingPage={handleCreateLandingPageForAd}
            onEditLandingPage={handleEditLandingPageForAd}
            orgSlug={organization?.slug}
          />
        )
      default:
        return (
          <ReviewStep
            flow={flow}
            preview={previewProps}
            submitting={submitting}
            onEdit={handleEditStep}
            onSaveDraft={handleSaveDraft}
            onPublish={handlePublish}
          />
        )
    }
  }

  const currentStep = Math.min(Math.max(flow.step, 1), TOTAL_STEPS)

  const previewProps: AdPreviewProps = {
    name: livePreview.name ?? flow.adBasicInfo?.name,
    message: livePreview.message ?? flow.adMessage ?? undefined,
    feedImageUrl: livePreview.feedImageUrl,
    storyImageUrl: livePreview.storyImageUrl,
    videoUrl: livePreview.videoUrl,
    carousel: livePreview.carousel,
    organizationName: organization?.name,
    link: livePreview.link ?? flow.optimizationGoal?.link,
  }

  return (
    <AuthGuard>
      <Layout>
        <div className="grid gap-0 lg:grid-cols-[1fr_520px]">
          <div className="min-w-0">
            {!loading && flow.hydrated && (
              <div className="px-8 pt-6 pb-2">
                <div className="flex gap-1.5">
                  {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full transition-colors"
                      style={{ background: i < currentStep ? "var(--primary)" : "var(--border)" }}
                    />
                  ))}
                </div>
                <div className="mt-1.5 flex justify-between items-center">
                  {flow.step > 0 ? (
                    <button
                      onClick={handleBack}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-label-caps font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Voltar
                    </button>
                  ) : (
                    <span />
                  )}
                  <span />
                </div>
              </div>
            )}
            {renderStep()}
          </div>
          <div className="ad-creation-preview hidden border-l border-border lg:sticky lg:top-16 lg:flex lg:h-[calc(100vh-4rem)] lg:items-start lg:justify-center">
            <AdPreview {...previewProps} className="h-full justify-start px-8 pt-28 pb-8" />
          </div>
        </div>
        <PublishAdModal
          adRequestId={createdAdRequestId}
          open={publishModalOpen}
          onOpenChange={setPublishModalOpen}
          onPublished={handlePublished}
        />
        <MetaConnectModal
          open={metaModalOpen}
          onOpenChange={setMetaModalOpen}
          onConnected={onMetaConnected}
        />
      </Layout>
    </AuthGuard>
  )
}

export default CriarAnuncioPage
