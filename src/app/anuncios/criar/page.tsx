"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { AuthGuard } from "@/lib/auth-guard"
import { useAuth } from "@/lib/auth-context"
import { Layout } from "@/components/layout"
import { AdPreview } from "@/features/adCreationFlow/ad-preview"
import { getOrganization } from "@/api/organization"
import type { Organization } from "@/api/organization"
import { createBaseAdCreative } from "@/api/base-ad-creative"
import type { CreateBaseAdCreativePayload } from "@/api/base-ad-creative"
import { createAdRequest } from "@/api/ad-request"
import { CompleteOrganizationStep } from "@/features/adCreationFlow/complete-organization-step"
import { AdBasicInfoStep } from "@/features/adCreationFlow/ad-basic-info-step"
import type { AdBasicInfo } from "@/features/adCreationFlow/ad-basic-info-step"
import { AdImageStep } from "@/features/adCreationFlow/ad-image-step"
import type { AdImageData } from "@/features/adCreationFlow/use-ad-creation-flow"
import { AdMessageStep } from "@/features/adCreationFlow/ad-message-step"
import { GeoLocationStep } from "@/features/adCreationFlow/geo-location-step"
import type { GeoLocationData } from "@/features/adCreationFlow/geo-location-step"
import { AdObjectiveStep } from "@/features/adCreationFlow/ad-objective-step"
import type { AdObjectiveData } from "@/features/adCreationFlow/ad-objective-step"
import { ReviewStep } from "@/features/adCreationFlow/review-step"
import { useAdCreationFlow } from "@/features/adCreationFlow/use-ad-creation-flow"
import { PublishAdModal } from "@/features/myAds/publish-ad-modal"

const TOTAL_STEPS = 6

const CriarAnuncioPage = () => {
  const router = useRouter()
  const { user } = useAuth()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [publishModalOpen, setPublishModalOpen] = useState(false)
  const [createdAdRequestId, setCreatedAdRequestId] = useState<number | null>(null)
  const [adFeedImageFile, setAdFeedImageFile] = useState<File | null>(null)
  const [adStoryImageFile, setAdStoryImageFile] = useState<File | null>(null)
  const [livePreview, setLivePreview] = useState<{ name?: string; message?: string; feedImageUrl?: string; storyImageUrl?: string; link?: string }>({})
  const flow = useAdCreationFlow()

  const fetchOrganization = useCallback(async () => {
    if (!user) return
    try {
      const org = await getOrganization(user.organization_id)
      setOrganization(org)
      const needsCompletion = !org.sector || !org.niche
      if (needsCompletion) {
        flow.update({ step: 0 })
      } else if (flow.step === 0) {
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

  const handleOrgComplete = (updated: Organization) => {
    setOrganization(updated)
    flow.update({ step: 1 })
  }

  const handleBasicInfoComplete = (data: AdBasicInfo) => {
    flow.update({ adBasicInfo: data, step: 2 })
  }

  const handleImageComplete = (image: AdImageData, feedFile: File | null, storyFile: File | null) => {
    setAdFeedImageFile(feedFile)
    setAdStoryImageFile(storyFile)
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

  const buildCreativePayload = (): CreateBaseAdCreativePayload => ({
    organization_id: user!.organization_id,
    name: flow.adBasicInfo?.name ?? "",
    product_service: flow.adBasicInfo?.productService ?? undefined,
    message: flow.adMessage ?? undefined,
    optimization_goal: flow.optimizationGoal?.objective ?? undefined,
    link: flow.optimizationGoal?.link ?? undefined,
    geo_locations: flow.geoLocation
      ? {
          countries: ["BR"],
          cities: flow.geoLocation.cities.map((c) => ({ key: c.id.toString(), name: c.name, region: c.state })),
          location_types: ["home", "recent"],
        }
      : undefined,
  })

  const createDraftAdRequest = async () => {
    if (!user) return null
    const creative = await createBaseAdCreative(
      buildCreativePayload(),
      adFeedImageFile ?? undefined,
      adStoryImageFile ?? adFeedImageFile ?? undefined
    )
    const adRequest = await createAdRequest({
      organization_id: user.organization_id,
      user_id: user.id,
      base_ad_creative_id: creative.id,
    })
    return adRequest
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

  const handlePublished = () => {
    setPublishModalOpen(false)
    flow.clear()
    router.push("/anuncios")
  }

  const STEP_NAMES = ["", "Básico", "Mensagem", "Criativo", "Localização", "Objetivo", "Revisão"]

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
          <AdImageStep
            initialValue={flow.adImage}
            adMessage={flow.adMessage}
            adName={flow.adBasicInfo?.name}
            adProductService={flow.adBasicInfo?.productService}
            onComplete={handleImageComplete}
            onLiveChange={(feedUrl, storyUrl) => setLivePreview((p) => ({ ...p, feedImageUrl: feedUrl ?? undefined, storyImageUrl: storyUrl ?? undefined }))}
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
            initialValues={flow.optimizationGoal}
            onComplete={handleObjectiveComplete}
            onLiveChange={(link) => setLivePreview((p) => ({ ...p, link: link ?? undefined }))}
          />
        )
      default:
        return (
          <ReviewStep
            flow={flow}
            submitting={submitting}
            onEdit={handleEditStep}
            onSaveDraft={handleSaveDraft}
            onPublish={handlePublish}
          />
        )
    }
  }

  const currentStep = Math.min(Math.max(flow.step, 1), TOTAL_STEPS)

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
                      className="flex items-center gap-1 text-label-caps text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ArrowLeft className="h-3 w-3" />
                      Voltar
                    </button>
                  ) : (
                    <span />
                  )}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={flow.reset}
                      className="text-label-caps text-muted-foreground hover:text-destructive transition-colors"
                    >
                      Recomeçar
                    </button>
                    <span className="text-label-caps text-muted-foreground">
                      {STEP_NAMES[currentStep]}
                    </span>
                  </div>
                </div>
              </div>
            )}
            {renderStep()}
          </div>
          <div className="ad-creation-preview hidden border-l border-border lg:sticky lg:top-16 lg:flex lg:h-[calc(100vh-4rem)] lg:items-start lg:justify-center">
            <AdPreview
              name={livePreview.name ?? flow.adBasicInfo?.name}
              message={livePreview.message ?? flow.adMessage ?? undefined}
              feedImageUrl={livePreview.feedImageUrl}
              storyImageUrl={livePreview.storyImageUrl}
              organizationName={organization?.name}
              link={livePreview.link ?? flow.optimizationGoal?.link}
            />
          </div>
        </div>
        <PublishAdModal
          adRequestId={createdAdRequestId}
          open={publishModalOpen}
          onOpenChange={setPublishModalOpen}
          onPublished={handlePublished}
        />
      </Layout>
    </AuthGuard>
  )
}

export default CriarAnuncioPage
