import { useState, useEffect, useCallback, useMemo } from "react"
import type { AdBasicInfo } from "@/features/adCreationFlow/ad-basic-info-step"
import type { AdObjectiveData } from "@/features/adCreationFlow/ad-objective-step"
import type { GeoLocationData } from "@/features/adCreationFlow/geo-location-step"
import { clearAdImageFiles } from "@/features/adCreationFlow/ad-image-store"

const STORAGE_KEY = "tri-anuncios:ad-creation-flow"
const TTL_MS = 30 * 60 * 1000
const MAX_STEP = 7

// ?step=<n> deep-links straight to a step (e.g. returning from the landing
// page editor). Applied synchronously at hydration so no effect can race it.
const applyStepParam = (state: AdCreationFlowState): AdCreationFlowState => {
  const step = Number(new URLSearchParams(window.location.search).get("step"))
  if (Number.isInteger(step) && step >= 1 && step <= MAX_STEP) return { ...state, step }
  return state
}

export type CarouselCardData = {
  fileName: string
  previewUrl: string
  headline?: string
  description?: string
  link?: string
}

export type AdImageData =
  | { type: "file"; feedFileName?: string; feedPreviewUrl?: string; storyFileName?: string; storyPreviewUrl?: string }
  | { type: "generated"; dataUrl: string; format?: "feed" | "story" }
  | { type: "video"; videoFileName: string; videoPreviewUrl: string; thumbFileName: string; thumbPreviewUrl: string }
  | { type: "carousel"; cards: CarouselCardData[] }

export type AdInvestmentData = {
  amountCents: number
  durationDays: number | null
}

export type AdCreationFlowState = {
  step: number
  adBasicInfo: AdBasicInfo | null
  adImage: AdImageData | null
  adMessage: string | null
  adMessageVariations: string[] | null
  geoLocation: GeoLocationData | null
  optimizationGoal: AdObjectiveData | null
  investment: AdInvestmentData | null
}

const DEFAULT_STATE: AdCreationFlowState = {
  step: 0,
  adBasicInfo: null,
  adImage: null,
  adMessage: null,
  adMessageVariations: null,
  geoLocation: null,
  optimizationGoal: null,
  investment: null,
}

const load = (): AdCreationFlowState => {
  if (typeof window === "undefined") return DEFAULT_STATE
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    const parsed = JSON.parse(raw)
    if (typeof parsed.savedAt !== "number" || Date.now() - parsed.savedAt > TTL_MS) {
      localStorage.removeItem(STORAGE_KEY)
      clearAdImageFiles()
      return DEFAULT_STATE
    }
    if ("feedImage" in parsed || "storyImage" in parsed) {
      localStorage.removeItem(STORAGE_KEY)
      clearAdImageFiles()
      return DEFAULT_STATE
    }
    if (parsed.adImage?.type === "file" && "fileName" in parsed.adImage) {
      parsed.adImage = null
      clearAdImageFiles()
    }
    delete parsed.savedAt
    return { ...DEFAULT_STATE, ...parsed }
  } catch {
    return DEFAULT_STATE
  }
}

const save = (state: AdCreationFlowState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, savedAt: Date.now() }))
  } catch {
    // storage full or unavailable — ignore
  }
}

export const clearAdCreationFlow = () => {
  localStorage.removeItem(STORAGE_KEY)
  clearAdImageFiles()
}

// Writes the landing page selection straight into the persisted flow state.
// Called by the landing page editor right before navigating back, so the
// objective step hydrates already selected — no async fetch race on return.
export const injectAdFlowLandingPage = (page: {
  id: number
  name: string
  status: "draft" | "published" | "archived"
  public_url: string
}) => {
  if (typeof window === "undefined") return
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    parsed.optimizationGoal = {
      objective: "landing_page_views",
      link: page.public_url,
      landingPage: { id: page.id, name: page.name, status: page.status, public_url: page.public_url },
      callToAction: parsed.optimizationGoal?.callToAction ?? "LEARN_MORE",
    }
    parsed.savedAt = Date.now()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed))
  } catch {
    // storage unavailable — the ?lp= fallback on the flow page still applies
  }
}

export const useAdCreationFlow = () => {
  const [state, setState] = useState<AdCreationFlowState>(DEFAULT_STATE)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setState(applyStepParam(load()))
    setHydrated(true)
  }, [])

  const update = useCallback((patch: Partial<AdCreationFlowState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch }
      save(next)
      return next
    })
  }, [])

  const reset = useCallback(() => {
    clearAdCreationFlow()
    setState({ ...DEFAULT_STATE, step: 1 })
  }, [])

  return useMemo(
    () => ({ ...state, hydrated, update, clear: clearAdCreationFlow, reset }),
    [state, hydrated, update, reset]
  )
}
