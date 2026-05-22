"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { tokenCallback } from "@/api/meta-oauth"

export default function MetaIgCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "error">("loading")
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const fragment = window.location.hash.replace("#", "")
    const params = new URLSearchParams(fragment)

    const longLivedToken = params.get("long_lived_token")
    const expiresIn = params.get("expires_in")
    const errorParam = params.get("error")

    if (errorParam) {
      setError(`Facebook retornou erro: ${errorParam}`)
      setStatus("error")
      return
    }

    if (!longLivedToken) {
      setError("Token não encontrado na URL. Tente novamente.")
      setStatus("error")
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
        setError(err?.message ?? "Erro ao processar token.")
        setStatus("error")
      })
  }, [router])

  if (status === "error") {
    return (
      <div style={{ padding: 40, fontFamily: "sans-serif" }}>
        <h2>Erro ao conectar Meta</h2>
        <p style={{ color: "red" }}>{error}</p>
        <a href="/settings/connect-meta">Voltar</a>
      </div>
    )
  }

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <p>Processando autenticação Meta...</p>
    </div>
  )
}
