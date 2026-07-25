"use client"

import { useCallback, useEffect, useState } from "react"
import { getAdRequests } from "@/api/ad-request"
import type { AdRequest } from "@/api/ad-request"
import { getLandingPages } from "@/api/landing-pages"
import type { LandingPage } from "@/api/landing-pages"
import { getPlatformAccounts } from "@/api/platform-accounts"
import type { PlatformAccount } from "@/api/platform-accounts"
import { getDashboardSummary } from "@/api/dashboard"
import type { DashboardSummary } from "@/api/dashboard"

export const useDashboardData = () => {
  const [adRequests, setAdRequests] = useState<AdRequest[]>([])
  const [landingPages, setLandingPages] = useState<LandingPage[]>([])
  const [accounts, setAccounts] = useState<PlatformAccount[]>([])
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSummaryLoading, setIsSummaryLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadLists = async () => {
      try {
        const [requests, pages, platformAccounts] = await Promise.all([
          getAdRequests(),
          getLandingPages(),
          getPlatformAccounts(),
        ])
        setAdRequests(requests)
        setLandingPages(pages)
        setAccounts(platformAccounts)
      } catch {
        setError("Erro ao carregar seus dados. Tente recarregar a página.")
      } finally {
        setIsLoading(false)
      }
    }

    const loadSummary = async () => {
      try {
        setSummary(await getDashboardSummary())
      } catch {
        setSummary(null)
      } finally {
        setIsSummaryLoading(false)
      }
    }

    loadLists()
    loadSummary()
  }, [])

  const refreshAccounts = useCallback(async () => {
    try {
      setAccounts(await getPlatformAccounts())
    } catch {
      setError("Erro ao atualizar conexões.")
    }
  }, [])

  return {
    adRequests,
    landingPages,
    accounts,
    summary,
    isLoading,
    isSummaryLoading,
    error,
    refreshAccounts,
  }
}
