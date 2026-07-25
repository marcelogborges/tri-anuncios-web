import { api } from "@/lib/api"

export type PlatformAccount = {
  id: number
  provider: string
  status: string
  organization_id: number
  external_id: string | null
  facebook_page_id: string | null
  facebook_page_name: string | null
  instagram_account_id: string | null
  meta_connected: boolean
  created_at: string
  updated_at: string
}

export async function getPlatformAccounts(): Promise<PlatformAccount[]> {
  const data = await api<{ platform_accounts: PlatformAccount[] }>("/api/v1/platform_accounts")
  return data.platform_accounts
}
