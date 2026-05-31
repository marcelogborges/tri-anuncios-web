"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { connectPage } from "@/api/meta-oauth"
import type { MetaPage } from "@/api/meta-oauth"
import { notifyOAuthParent, META_OAUTH_PAGES_KEY } from "@/lib/meta-oauth-popup"

export type PageStatus = "loading" | "selecting" | "connecting" | "error"

export const useMetaPageConnect = (connectionToken: string | null) => {
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
    if (!connectionToken) {
      setErrorMsg("connection_token ausente na URL.")
      setPageStatus("error")
      return
    }

    const stored = sessionStorage.getItem(META_OAUTH_PAGES_KEY)
    if (!stored) {
      setErrorMsg("Sessão expirada. Tente conectar novamente.")
      setPageStatus("error")
      return
    }

    sessionStorage.removeItem(META_OAUTH_PAGES_KEY)
    setPages(JSON.parse(stored))
    setPageStatus("selecting")
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
