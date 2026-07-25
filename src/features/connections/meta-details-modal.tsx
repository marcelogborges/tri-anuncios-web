"use client"

import { useRouter } from "next/navigation"
import type { PlatformAccount } from "@/api/platform-accounts"
import { MetaConnectionDetails } from "@/features/connections/meta-connection-details"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type MetaDetailsModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  account: PlatformAccount
}

export const MetaDetailsModal = ({ open, onOpenChange, account }: MetaDetailsModalProps) => {
  const router = useRouter()

  const handleEdit = () => {
    onOpenChange(false)
    router.push("/configuracoes?tab=conexoes&abrir=meta")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Conexão Meta Ads</DialogTitle>
          <DialogDescription>Detalhes da conta conectada para publicação.</DialogDescription>
        </DialogHeader>
        <MetaConnectionDetails account={account} className="bg-muted" />
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" className="rounded-full" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button className="rounded-full" onClick={handleEdit}>
            Editar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
