import { useState, useEffect, useCallback } from "react"
import type { AdBasicInfo } from "@/features/adCreationFlow/ad-basic-info-step"
import type { AdObjectiveData } from "@/features/adCreationFlow/ad-objective-step"
import type { AudienceDemographics } from "@/features/adCreationFlow/audience-step"
import type { GeoLocationData } from "@/features/adCreationFlow/geo-location-step"

const STORAGE_KEY = "tri-anuncios:ad-creation-flow"

export type AdImageData =
  | { type: "file"; fileName: string }
  | { type: "url"; url: string }

export type AdCreationFlowState = {
  step: number
  adBasicInfo: AdBasicInfo | null
  adImage: AdImageData | null
  adMessage: string | null
  socialClasses: string[] | null
  audience: AudienceDemographics | null
  geoLocation: GeoLocationData | null
  optimizationGoal: AdObjectiveData | null
}

const DEFAULT_STATE: AdCreationFlowState = {
  step: 0,
  adBasicInfo: null,
  adImage: null,
  adMessage: null,
  socialClasses: null,
  audience: null,
  geoLocation: null,
  optimizationGoal: null,
}

const load = (): AdCreationFlowState => {
  if (typeof window === "undefined") return DEFAULT_STATE
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    return { ...DEFAULT_STATE, ...JSON.parse(raw) }
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

  return { ...state, hydrated, update, clear: clearAdCreationFlow }
}
