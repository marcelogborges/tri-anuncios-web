import { api } from "@/lib/api"

export type MetaPage = {
  id: string
  name: string
  instagram_account_id: string | null
}

export const getPages = async (
  connectionToken: string
): Promise<{ pages: MetaPage[] }> =>
  api(`/api/v1/meta/oauth/pages?connection_token=${encodeURIComponent(connectionToken)}`)

export const connectPage = async (params: {
  connection_token: string
  page_id: string
}): Promise<{ platform_account: { facebook_page_id: string; instagram_account_id: string | null } }> =>
  api("/api/v1/meta/oauth/connect", {
    method: "POST",
    body: params,
  })

export const getAuthorizeUrl = async (): Promise<{ url: string }> =>
  api("/api/v1/meta/oauth/authorize_url")
