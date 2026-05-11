import { useState, useEffect, useCallback } from "react"
import type { AdBasicInfo } from "@/features/adCreationFlow/ad-basic-info-step"
import type { AdObjectiveData } from "@/features/adCreationFlow/ad-objective-step"
import type { GeoLocationData } from "@/features/adCreationFlow/geo-location-step"

const STORAGE_KEY = "tri-anuncios:ad-creation-flow"

export type AdImageData =
  | { type: "file"; feedFileName: string; feedPreviewUrl: string; storyFileName?: string; storyPreviewUrl?: string }
  | { type: "generated"; dataUrl: string }

export type AdCreationFlowState = {
  step: number
  adBasicInfo: AdBasicInfo | null
  adImage: AdImageData | null
  adMessage: string | null
  geoLocation: GeoLocationData | null
  optimizationGoal: AdObjectiveData | null
}

const DEFAULT_STATE: AdCreationFlowState = {
  step: 0,
  adBasicInfo: null,
  adImage: null,
  adMessage: null,
  geoLocation: null,
  optimizationGoal: null,
}

const load = (): AdCreationFlowState => {
  if (typeof window === "undefined") return DEFAULT_STATE
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    const parsed = JSON.parse(raw)
    if ("feedImage" in parsed || "storyImage" in parsed) {
      localStorage.removeItem(STORAGE_KEY)
      return DEFAULT_STATE
    }
    if (parsed.adImage?.type === "file" && "fileName" in parsed.adImage) {
      parsed.adImage = null
    }
    return { ...DEFAULT_STATE, ...parsed }
  } catch {
    return DEFAULT_STATE
  }
}

const save = (state: AdCreationFlowState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // storage full or unavailable — ignore
  }
}

export const clearAdCreationFlow = () => {
  localStorage.removeItem(STORAGE_KEY)
}

export const useAdCreationFlow = () => {
  const [state, setState] = useState<AdCreationFlowState>(DEFAULT_STATE)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setState(load())
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

  return { ...state, hydrated, update, clear: clearAdCreationFlow, reset }
}
