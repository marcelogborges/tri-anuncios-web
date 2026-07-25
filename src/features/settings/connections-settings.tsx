"use client"

import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { getPlatformAccounts } from "@/api/platform-accounts"
import type { PlatformAccount } from "@/api/platform-accounts"
import { MetaConnectModal } from "@/features/myAds/meta-connect-modal"
import { MetaConnectionDetails } from "@/features/connections/meta-connection-details"
import { LockedConnectionRows } from "@/features/connections/locked-connection-rows"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export const ConnectionsSettings = () => {
  const searchParams = useSearchParams()
  const [accounts, setAccounts] = useState<PlatformAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [metaOpen, setMetaOpen] = useState(searchParams.get("abrir") === "meta")
  const [connectModalOpen, setConnectModalOpen] = useState(false)

  const load = useCallback(async () => {
    try {
      setAccounts(await getPlatformAccounts())
    } catch {
      setError("Erro ao carregar as conexões.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const metaAccount = accounts.find(account => account.provider === "meta")
  const isMetaConnected = metaAccount?.status === "active"

  const handleConnected = () => {
    setConnectModalOpen(false)
    load()
  }

  const handleMetaRowClick = () => {
    if (isMetaConnected) {
      setMetaOpen(open => !open)
    } else {
      setConnectModalOpen(true)
    }
  }

  if (isLoading) {
    return <Skeleton className="h-72 rounded-lg" />
  }

  return (
    <div className="flex flex-col gap-4">
      {error && <p className="text-body-sm text-destructive">{error}</p>}
      <section className="overflow-hidden rounded-xl border bg-card shadow-ambient">
        <div className="px-6 py-4 max-[480px]:px-4">
          <h2 className="font-quicksand text-[17px] font-semibold text-foreground">
            Conexões de plataforma
          </h2>
          <p className="text-[13px] text-muted-foreground">
            Contas conectadas para publicar seus anúncios.
          </p>
        </div>
        <button
          type="button"
          onClick={handleMetaRowClick}
          aria-expanded={isMetaConnected ? metaOpen : undefined}
          className="flex w-full items-center gap-3 border-t px-6 py-4 text-left transition-colors hover:bg-secondary/20 max-[480px]:px-4"
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-secondary/20 p-2">
              <img src="/meta.png" alt="" className="h-full w-full object-contain" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">Meta Ads</p>
              <p className="text-[13px] text-muted-foreground">Facebook e Instagram</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {isMetaConnected ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                Conectado
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                Não conectado
              </span>
            )}
            {isMetaConnected && (
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                  metaOpen && "rotate-180"
                )}
              />
            )}
          </div>
        </button>
        {isMetaConnected && metaOpen && metaAccount && (
          <div className="border-t px-6 py-5 max-[480px]:px-4">
            <MetaConnectionDetails account={metaAccount} className="bg-muted" />
            <div className="mt-5 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[13px] text-muted-foreground">
                Reconectar substitui a conexão atual. Anúncios já publicados continuam ativos.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 self-start rounded-full sm:self-auto"
                onClick={() => setConnectModalOpen(true)}
              >
                Reconectar
              </Button>
            </div>
          </div>
        )}
        <LockedConnectionRows />
      </section>
      <MetaConnectModal
        open={connectModalOpen}
        onOpenChange={setConnectModalOpen}
        onConnected={handleConnected}
      />
    </div>
  )
}
