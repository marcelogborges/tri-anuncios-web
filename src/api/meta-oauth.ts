import { api } from "@/lib/api"

export type MetaPage = {
  id: string
  name: string
  access_token: string
  instagram_account_id: string | null
}

export async function tokenCallback(params: {
  long_lived_token: string
  expires_in?: number
}): Promise<{ connection_token: string; pages: MetaPage[] }> {
  return api("/api/v1/meta/oauth/token_callback", {
    method: "POST",
    body: params,
  })
}

export async function fetchPages(
  connectionToken: string
): Promise<{ pages: MetaPage[] }> {
  return api(`/api/v1/meta/oauth/pages?connection_token=${connectionToken}`)
}

export async function connectPage(params: {
  connection_token: string
  page_id: string
}): Promise<{ platform_account: { facebook_page_id: string; instagram_account_id: string | null } }> {
  return api("/api/v1/meta/oauth/connect", {
    method: "POST",
    body: params,
  })
}
