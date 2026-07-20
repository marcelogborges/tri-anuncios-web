"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getLandingPages, type LandingPage } from "@/api/landing-pages"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (page: LandingPage) => void
  onCreateNew: () => void
}

const STATUS_LABELS: Record<LandingPage["status"], string> = {
  draft: "Rascunho",
  published: "Publicada",
  archived: "Arquivada",
}

export function LandingPagePickerDialog({ open, onOpenChange, onSelect, onCreateNew }: Props) {
  const [pages, setPages] = useState<LandingPage[] | null>(null)

  useEffect(() => {
    if (!open) return
    setPages(null)
    getLandingPages().then((all) => setPages(all.filter((p) => p.status !== "archived")))
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Escolher landing page</DialogTitle>
          <DialogDescription>
            O anúncio vai levar as pessoas para essa página.
          </DialogDescription>
        </DialogHeader>

        {pages === null ? (
          <p className="py-6 text-center text-sm text-muted-foreground">Carregando suas páginas...</p>
        ) : pages.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Você ainda não tem nenhuma landing page. Crie a primeira agora — leva poucos minutos.
          </p>
        ) : (
          <div className="flex flex-col gap-2" data-testid="landing-page-list">
            {pages.map((page) => (
              <button
                key={page.id}
                type="button"
                onClick={() => onSelect(page)}
                className="flex w-full items-center gap-3 rounded-lg border border-border p-4 text-left transition-all hover:border-primary/50"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body-sm font-semibold text-foreground">{page.name}</p>
                  <p className="mt-0.5 truncate text-label-caps text-muted-foreground">/{page.slug}</p>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-[0.06em]",
                    page.status === "published"
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {STATUS_LABELS[page.status]}
                </span>
              </button>
            ))}
          </div>
        )}

        <Button variant="outline" className="rounded-full" onClick={onCreateNew} data-testid="picker-create-new">
          <Plus className="mr-1 h-4 w-4" />
          Criar nova landing page
        </Button>
      </DialogContent>
    </Dialog>
  )
}
