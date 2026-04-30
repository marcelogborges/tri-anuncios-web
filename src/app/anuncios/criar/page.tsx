"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { AuthGuard } from "@/lib/auth-guard"
import { useAuth } from "@/lib/auth-context"
import { Layout } from "@/components/layout"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { getOrganization } from "@/api/organization"
import type { Organization } from "@/api/organization"
import { createBaseAdCreative } from "@/api/base-ad-creative"
import type { CreateBaseAdCreativePayload } from "@/api/base-ad-creative"
import { createAdRequest } from "@/api/ad-request"
import { CompleteOrganizationStep } from "@/features/adCreationFlow/complete-organization-step"
import { AdBasicInfoStep } from "@/features/adCreationFlow/ad-basic-info-step"
import type { AdBasicInfo } from "@/features/adCreationFlow/ad-basic-info-step"
import { AdMessageStep } from "@/features/adCreationFlow/ad-message-step"
import { SocialClassStep } from "@/features/adCreationFlow/social-class-step"
import { AudienceStep } from "@/features/adCreationFlow/audience-step"
import type { AudienceDemographics } from "@/features/adCreationFlow/audience-step"
import { GeoLocationStep } from "@/features/adCreationFlow/geo-location-step"
import type { GeoLocationData } from "@/features/adCreationFlow/geo-location-step"
import { AdObjectiveStep } from "@/features/adCreationFlow/ad-objective-step"
import type { AdObjectiveData } from "@/features/adCreationFlow/ad-objective-step"
import { ReviewStep } from "@/features/adCreationFlow/review-step"
import { useAdCreationFlow } from "@/features/adCreationFlow/use-ad-creation-flow"
import { PublishAdModal } from "@/features/myAds/publish-ad-modal"

const TOTAL_STEPS = 7

const CriarAnuncioPage = () => {
  const router = useRouter()
  const { user } = useAuth()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [publishModalOpen, setPublishModalOpen] = useState(false)
  const [createdAdRequestId, setCreatedAdRequestId] = useState<number | null>(null)
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

  const handleMessageComplete = (message: string) => {
    flow.update({ adMessage: message, step: 3 })
  }

  const handleSocialClassComplete = (classes: string[]) => {
    flow.update({ socialClasses: classes, step: 4 })
  }

  const handleAudienceComplete = (data: AudienceDemographics) => {
    flow.update({ audience: data, step: 5 })
  }

  const handleGeoLocationComplete = (data: GeoLocationData) => {
    flow.update({ geoLocation: data, step: 6 })
  }

  const handleObjectiveComplete = (data: AdObjectiveData) => {
    flow.update({ optimizationGoal: data, step: 7 })
  }

  const handleEditStep = (step: number) => {
    flow.update({ step })
  }

  const buildCreativePayload = (): CreateBaseAdCreativePayload => ({
    organization_id: user!.organization_id,
    name: flow.adBasicInfo?.name ?? "",
    product_service: flow.adBasicInfo?.productService ?? undefined,
    message: flow.adMessage ?? undefined,
    optimization_goal: flow.optimizationGoal?.objective ?? undefined,
    link: flow.optimizationGoal?.link ?? undefined,
    target_gender: flow.audience?.targetGender ?? undefined,
    target_age_min: flow.audience?.targetAgeMin ?? undefined,
    target_age_max: flow.audience?.targetAgeMax ?? undefined,
    target_social_classes: flow.socialClasses ?? undefined,
    geo_locations: flow.geoLocation
      ? {
          countries: ["BR"],
          cities: flow.geoLocation.cities.map((c) => ({ key: c.id.toString(), name: c.name, region: c.state })),
          location_types: ["home", "recent"],
        }
      : undefined,
    // TODO: replace with real image upload
    remote_image_url: "https://www.allrecipes.com/thmb/5JVfA7MxfTUPfRerQMdF-nGKsLY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/25473-the-perfect-basic-burger-DDMFS-4x3-56eaba3833fd4a26a82755bcd0be0c54.jpg",
  })

  const createDraftAdRequest = async () => {
    if (!user) return null
    const creative = await createBaseAdCreative(buildCreativePayload())
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

  const handleBack = () => {
    if (flow.step <= 1) return
    flow.update({ step: flow.step - 1 })
  }

  const progressValue = (flow.step / TOTAL_STEPS) * 100

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
          />
        )
      case 2:
        return (
          <AdMessageStep
            initialValue={flow.adMessage}
            onComplete={handleMessageComplete}
          />
        )
      case 3:
        return (
          <SocialClassStep
            initialValues={flow.socialClasses}
            onComplete={handleSocialClassComplete}
          />
        )
      case 4:
        return (
          <AudienceStep
            initialValues={flow.audience}
            onComplete={handleAudienceComplete}
          />
        )
      case 5:
        return (
          <GeoLocationStep
            initialValues={flow.geoLocation}
            onComplete={handleGeoLocationComplete}
          />
        )
      case 6:
        return (
          <AdObjectiveStep
            initialValues={flow.optimizationGoal}
            onComplete={handleObjectiveComplete}
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

  return (
    <AuthGuard>
      <Layout>
        {!loading && flow.hydrated && (
          <div className="mx-auto w-full max-w-lg px-4 pt-6">
            <div className="flex items-center gap-3">
              {flow.step > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  className="shrink-0"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <Progress value={progressValue} className="flex-1" />
              <span className="text-body-sm text-muted-foreground shrink-0">
                {flow.step}/{TOTAL_STEPS}
              </span>
            </div>
          </div>
        )}
        {renderStep()}
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
