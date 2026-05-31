"use client"

import { useMetaOAuthCallback } from "@/features/meta-oauth/use-meta-oauth-callback"

const MetaIgCallbackPage = () => {
  const { error } = useMetaOAuthCallback()

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

export default MetaIgCallbackPage
