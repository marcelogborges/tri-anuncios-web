"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { fetchPages, connectPage, MetaPage } from "@/api/meta-oauth"

export default function ConnectMetaPage() {
  const searchParams = useSearchParams()
  const connectionToken = searchParams.get("connection_token")

  const [pages, setPages] = useState<MetaPage[]>([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [connected, setConnected] = useState<{ page_id: string; instagram_id: string | null } | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!connectionToken) {
      setError("connection_token ausente na URL.")
      setLoading(false)
      return
    }

    fetchPages(connectionToken)
      .then(({ pages }) => setPages(pages))
      .catch((err) => setError(err?.message ?? "Erro ao buscar páginas."))
      .finally(() => setLoading(false))
  }, [connectionToken])

  async function handleConnect(pageId: string) {
    if (!connectionToken) return
    setConnecting(true)
    setError("")
    try {
      const { platform_account } = await connectPage({
        connection_token: connectionToken,
        page_id: pageId,
      })
      setConnected({
        page_id: platform_account.facebook_page_id,
        instagram_id: platform_account.instagram_account_id,
      })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao conectar página.")
    } finally {
      setConnecting(false)
    }
  }

  if (loading) {
    return <div style={{ padding: 40, fontFamily: "sans-serif" }}>Carregando páginas...</div>
  }

  if (connected) {
    return (
      <div style={{ padding: 40, fontFamily: "sans-serif" }}>
        <h2 style={{ color: "green" }}>✓ Meta conectado com sucesso!</h2>
        <p><strong>Facebook Page ID:</strong> {connected.page_id}</p>
        <p><strong>Instagram Account ID:</strong> {connected.instagram_id ?? "não encontrado"}</p>
        <a href="/anuncios">Ir para anúncios</a>
      </div>
    )
  }

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif", maxWidth: 600 }}>
      <h2>Conectar conta Meta</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {pages.length === 0 && !error && (
        <p>Nenhuma página encontrada. Verifique se você autorizou o acesso.</p>
      )}

      {pages.map((page) => (
        <div
          key={page.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 16,
            marginBottom: 12,
          }}
        >
          <strong>{page.name}</strong>
          <p style={{ fontSize: 12, color: "#666", margin: "4px 0" }}>
            Page ID: {page.id}
          </p>
          <p style={{ fontSize: 12, color: "#666", margin: "4px 0" }}>
            Instagram: {page.instagram_account_id ?? "não conectado"}
          </p>
          <button
            onClick={() => handleConnect(page.id)}
            disabled={connecting}
            style={{
              marginTop: 8,
              padding: "8px 16px",
              background: "#1877f2",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            {connecting ? "Conectando..." : "Usar esta página"}
          </button>
        </div>
      ))}
    </div>
  )
}
