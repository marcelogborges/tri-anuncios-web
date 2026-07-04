"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useMetaPageConnect } from "@/features/meta-oauth/use-meta-page-connect"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ConnectMetaContent = () => {
  const searchParams = useSearchParams()
  const connectionToken = searchParams.get("connection_token")
  const oauthError = searchParams.get("error")
  const { pageStatus, pages, errorMsg, handleConnect, notifyAndClose } = useMetaPageConnect(connectionToken, oauthError)

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
        <Button variant="outline" onClick={() => notifyAndClose("meta-oauth-error", errorMsg)}>
          Fechar e tentar novamente
        </Button>
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
                {page.instagram_account_id ? "Instagram conectado" : "Sem conta Instagram"}
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

const ConnectMetaPage = () => (
  <Suspense fallback={<div style={{ padding: 40, fontFamily: "sans-serif" }}>Carregando...</div>}>
    <ConnectMetaContent />
  </Suspense>
)

export default ConnectMetaPage
