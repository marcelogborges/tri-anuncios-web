import { api } from "@/lib/api"

export type PlatformAccount = {
  id: number
  provider: string
  status: string
  organization_id: number
}

export async function getPlatformAccounts(): Promise<PlatformAccount[]> {
  const data = await api<{ platform_accounts: PlatformAccount[] }>("/api/v1/platform_accounts")
  return data.platform_accounts
}
