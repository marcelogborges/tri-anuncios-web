"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getPages, connectPage } from "@/api/meta-oauth"
import type { MetaPage } from "@/api/meta-oauth"
import { notifyOAuthParent } from "@/lib/meta-oauth-popup"

export type PageStatus = "loading" | "selecting" | "connecting" | "error"

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  access_denied: "Acesso negado no Facebook. Tente novamente.",
  invalid_state: "Sessão inválida. Tente conectar novamente.",
  oauth_failed: "Erro na autenticação com o Facebook. Tente novamente.",
}

export const useMetaPageConnect = (
  connectionToken: string | null,
  oauthError: string | null
) => {
  const router = useRouter()
  const [pageStatus, setPageStatus] = useState<PageStatus>("loading")
  const [pages, setPages] = useState<MetaPage[]>([])
  const [errorMsg, setErrorMsg] = useState("")

  const notifyAndClose = (type: "meta-oauth-success" | "meta-oauth-error", message?: string) => {
    const notified = notifyOAuthParent(type, message)
    if (notified) return
    if (type === "meta-oauth-success") {
      router.push("/anuncios")
    } else {
      setErrorMsg(message ?? "Erro desconhecido.")
      setPageStatus("error")
    }
  }

  useEffect(() => {
    if (oauthError) {
      const msg = OAUTH_ERROR_MESSAGES[oauthError] ?? `Facebook retornou erro: ${oauthError}`
      if (!notifyOAuthParent("meta-oauth-error", msg)) {
        setErrorMsg(msg)
        setPageStatus("error")
      }
      return
    }

    if (!connectionToken) {
      setErrorMsg("connection_token ausente na URL.")
      setPageStatus("error")
      return
    }

    const load = async () => {
      try {
        const { pages: fetchedPages } = await getPages(connectionToken)

        if (fetchedPages.length === 1) {
          await connectPage({ connection_token: connectionToken, page_id: fetchedPages[0].id })
          notifyAndClose("meta-oauth-success")
          return
        }

        setPages(fetchedPages)
        setPageStatus("selecting")
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Erro ao carregar páginas."
        setErrorMsg(msg)
        setPageStatus("error")
      }
    }

    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleConnect = async (pageId: string) => {
    if (!connectionToken) return
    setPageStatus("connecting")
    setErrorMsg("")
    try {
      await connectPage({ connection_token: connectionToken, page_id: pageId })
      notifyAndClose("meta-oauth-success")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao conectar página."
      setErrorMsg(msg)
      setPageStatus("error")
    }
  }

  return { pageStatus, pages, errorMsg, handleConnect, notifyAndClose }
}
