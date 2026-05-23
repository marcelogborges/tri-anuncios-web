"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { tokenCallback } from "@/api/meta-oauth"

export default function MetaIgCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState("")

  const notifyAndClose = (type: "meta-oauth-success" | "meta-oauth-error", message?: string) => {
    if (window.opener) {
      window.opener.postMessage(
        { type, ...(message ? { message } : {}) },
        window.location.origin
      )
      window.close()
    } else {
      if (type === "meta-oauth-success") {
        router.replace("/anuncios")
      } else {
        setError(message ?? "Erro desconhecido.")
      }
    }
  }

  useEffect(() => {
    const fragment = window.location.hash.replace("#", "")
    const params = new URLSearchParams(fragment)

    const longLivedToken = params.get("long_lived_token")
    const expiresIn = params.get("expires_in")
    const errorParam = params.get("error")

    if (errorParam) {
      notifyAndClose("meta-oauth-error", `Facebook retornou erro: ${errorParam}`)
      return
    }

    if (!longLivedToken) {
      notifyAndClose("meta-oauth-error", "Token não encontrado. Tente novamente.")
      return
    }

    tokenCallback({
      long_lived_token: longLivedToken,
      ...(expiresIn ? { expires_in: Number(expiresIn) } : {}),
    })
      .then(({ connection_token }) => {
        router.replace(`/settings/connect-meta?connection_token=${connection_token}`)
      })
      .catch((err) => {
        const msg = err?.message ?? "Erro ao processar token."
        notifyAndClose("meta-oauth-error", msg)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4">
        <p className="text-sm text-destructive">{error}</p>
        <a
          href="/settings/connect-meta"
          className="text-sm text-primary underline underline-offset-4"
        >
          Voltar
        </a>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-sm text-muted-foreground">Processando autenticação Meta...</p>
    </div>
  )
}
