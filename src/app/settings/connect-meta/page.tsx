"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { fetchPages, connectPage } from "@/api/meta-oauth"
import type { MetaPage } from "@/api/meta-oauth"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type PageStatus = "loading" | "selecting" | "connecting" | "error"

export default function ConnectMetaPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const connectionToken = searchParams.get("connection_token")
  const errorParam = searchParams.get("error")

  const [pageStatus, setPageStatus] = useState<PageStatus>(
    errorParam ? "error" : "loading"
  )
  const [pages, setPages] = useState<MetaPage[]>([])
  const [errorMsg, setErrorMsg] = useState(
    errorParam ? "Falha no login com Facebook." : ""
  )

  const notifyAndClose = (type: "meta-oauth-success" | "meta-oauth-error", message?: string) => {
    if (window.opener) {
      window.opener.postMessage(
        { type, ...(message ? { message } : {}) },
        window.location.origin
      )
      window.close()
    } else {
      if (type === "meta-oauth-success") {
        router.push("/anuncios")
      } else {
        setErrorMsg(message ?? "Erro desconhecido.")
        setPageStatus("error")
      }
    }
  }

  useEffect(() => {
    if (errorParam) {
      notifyAndClose("meta-oauth-error", "Falha no login com Facebook.")
      return
    }
    if (!connectionToken) {
      setErrorMsg("connection_token ausente na URL.")
      setPageStatus("error")
      return
    }
    fetchPages(connectionToken)
      .then(({ pages }) => {
        setPages(pages)
        setPageStatus("selecting")
      })
      .catch((err) => {
        const msg = err?.message ?? "Erro ao buscar páginas."
        notifyAndClose("meta-oauth-error", msg)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleConnect(pageId: string) {
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

  async function handleRetry() {
    if (!connectionToken) return
    setPageStatus("loading")
    setErrorMsg("")
    try {
      const { pages } = await fetchPages(connectionToken)
      setPages(pages)
      setPageStatus("selecting")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao buscar páginas."
      setErrorMsg(msg)
      setPageStatus("error")
    }
  }

  if (pageStatus === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Carregando páginas...</p>
      </div>
    )
  }

  if (pageStatus === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4">
        <p className="text-sm text-destructive">{errorMsg}</p>
        {window?.opener ? (
          <Button
            variant="outline"
            onClick={() =>
              notifyAndClose("meta-oauth-error", errorMsg)
            }
          >
            Fechar e tentar novamente
          </Button>
        ) : (
          <Button onClick={handleRetry}>Tentar novamente</Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-background px-4 pt-12">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-xl font-semibold">Selecione uma página</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Escolha a página do Facebook para vincular à sua conta.
          </p>
        </div>

        {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}

        {pages.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nenhuma página encontrada. Verifique se autorizou o acesso.
          </p>
        )}

        <div className="space-y-3">
          {pages.map((page) => (
            <button
              key={page.id}
              type="button"
              disabled={pageStatus === "connecting"}
              onClick={() => handleConnect(page.id)}
              className={cn(
                "w-full rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-muted-foreground/40",
                pageStatus === "connecting" && "opacity-60 cursor-not-allowed"
              )}
            >
              <p className="font-medium">{page.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {page.instagram_account_id
                  ? `Instagram conectado`
                  : "Sem conta Instagram"}
              </p>
            </button>
          ))}
        </div>

        {pageStatus === "connecting" && (
          <p className="text-center text-sm text-muted-foreground">Conectando...</p>
        )}
      </div>
    </div>
  )
}
