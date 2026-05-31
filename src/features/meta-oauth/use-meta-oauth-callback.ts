"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { tokenCallback, connectPage } from "@/api/meta-oauth"
import { notifyOAuthParent, META_OAUTH_PAGES_KEY } from "@/lib/meta-oauth-popup"

export const useMetaOAuthCallback = () => {
  const router = useRouter()
  const [error, setError] = useState("")

  useEffect(() => {
    const process = async () => {
      const fragment = window.location.hash.replace("#", "")
      const params = new URLSearchParams(fragment)

      const longLivedToken = params.get("long_lived_token") ?? params.get("access_token")
      const expiresIn = params.get("expires_in")
      const errorParam = params.get("error")

      if (errorParam) {
        const msg = `Facebook retornou erro: ${errorParam}`
        if (!notifyOAuthParent("meta-oauth-error", msg)) setError(msg)
        return
      }

      if (!longLivedToken) {
        const msg = `Token não encontrado. Params: ${fragment || "(vazio)"}`
        if (!notifyOAuthParent("meta-oauth-error", msg)) setError(msg)
        return
      }

      try {
        const { connection_token, pages } = await tokenCallback({
          long_lived_token: longLivedToken,
          ...(expiresIn ? { expires_in: Number(expiresIn) } : {}),
        })

        if (pages.length === 1) {
          await connectPage({ connection_token, page_id: pages[0].id })
          if (!notifyOAuthParent("meta-oauth-success")) router.replace("/anuncios")
          return
        }

        sessionStorage.setItem(META_OAUTH_PAGES_KEY, JSON.stringify(pages))
        router.replace(`/settings/connect-meta?connection_token=${connection_token}`)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Erro ao processar token."
        if (!notifyOAuthParent("meta-oauth-error", msg)) setError(msg)
      }
    }

    process()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { error }
}
