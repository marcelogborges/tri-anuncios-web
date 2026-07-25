import { api } from "@/lib/api"

export type DashboardSummary = {
  impressions: number
  clicks: number
  spend: number
  campaigns: number
  date_preset: string
}

export async function getDashboardSummary(): Promise<DashboardSummary | null> {
  const res = await api<{ summary: DashboardSummary | null }>("/api/v1/dashboard/summary")
  return res.summary
}
