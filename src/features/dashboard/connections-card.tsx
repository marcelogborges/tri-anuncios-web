"use client"

import { useState } from "react"
import type { PlatformAccount } from "@/api/platform-accounts"
import { MetaConnectModal } from "@/features/myAds/meta-connect-modal"
import { MetaDetailsModal } from "@/features/connections/meta-details-modal"
import { LockedConnectionRows } from "@/features/connections/locked-connection-rows"
import { Button } from "@/components/ui/button"

type ConnectionsCardProps = {
  accounts: PlatformAccount[]
  onConnected: () => void
}

export const ConnectionsCard = ({ accounts, onConnected }: ConnectionsCardProps) => {
  const [connectModalOpen, setConnectModalOpen] = useState(false)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)

  const metaAccount = accounts.find(account => account.provider === "meta")
  const isMetaConnected = metaAccount?.status === "active"

  const handleConnected = () => {
    setConnectModalOpen(false)
    onConnected()
  }

  const handleMetaClick = () => {
    if (isMetaConnected) {
      setDetailsModalOpen(true)
    } else {
      setConnectModalOpen(true)
    }
  }

  return (
    <section className="overflow-hidden rounded-xl border bg-card shadow-ambient">
      <div className="px-6 py-4 max-[480px]:px-4">
        <h2 className="font-quicksand text-[17px] font-semibold text-foreground">
          Conexões de plataforma
        </h2>
        <p className="text-[13px] text-muted-foreground">
          Contas conectadas para publicar seus anúncios.
        </p>
      </div>
      <div className="flex items-center gap-3 border-t px-6 py-4 max-[480px]:px-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-secondary/20 p-2">
            <img src="/meta.png" alt="" className="h-full w-full object-contain" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">Meta Ads</p>
            <p className="text-[13px] text-muted-foreground">Facebook e Instagram</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5 sm:flex-row sm:items-center sm:gap-2">
          {isMetaConnected && (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              Conectado
            </span>
          )}
          <Button
            variant={isMetaConnected ? "outline" : "default"}
            size="sm"
            className="rounded-full"
            onClick={handleMetaClick}
          >
            {isMetaConnected ? "Gerenciar" : "Conectar"}
          </Button>
        </div>
      </div>
      <LockedConnectionRows />
      <MetaConnectModal
        open={connectModalOpen}
        onOpenChange={setConnectModalOpen}
        onConnected={handleConnected}
      />
      {metaAccount && (
        <MetaDetailsModal
          open={detailsModalOpen}
          onOpenChange={setDetailsModalOpen}
          account={metaAccount}
        />
      )}
    </section>
  )
}
