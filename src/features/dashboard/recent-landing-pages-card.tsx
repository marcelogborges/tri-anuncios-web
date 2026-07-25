"use client"

import Link from "next/link"
import { ArrowRight, LayoutTemplate } from "lucide-react"
import type { LandingPage } from "@/api/landing-pages"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type RecentLandingPagesCardProps = {
  landingPages: LandingPage[]
}

const STATUS_LABELS: Record<string, string> = {
  published: "Publicada",
  draft: "Rascunho",
  archived: "Arquivada",
}

export const RecentLandingPagesCard = ({ landingPages }: RecentLandingPagesCardProps) => {
  const recent = landingPages.slice(0, 4)

  const emptyState = (
    <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
        <LayoutTemplate className="size-5 text-primary" />
      </div>
      <p className="text-sm text-muted-foreground">Nenhuma página de vendas criada ainda.</p>
      <Button asChild variant="outline" className="rounded-full">
        <Link href="/paginas-de-vendas">Criar página de vendas</Link>
      </Button>
    </div>
  )

  const rows = recent.map(page => {
    const isPublished = page.status === "published"
    return (
      <Link
        key={page.id}
        href="/paginas-de-vendas"
        className="flex items-center gap-3 border-t px-6 py-3.5 transition-colors hover:bg-secondary/40 max-[480px]:px-4"
      >
        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border bg-secondary/20">
          <LayoutTemplate className="size-4 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{page.name}</p>
          <p className="text-[13px] text-muted-foreground tabular-nums">
            {page.leads_count.toLocaleString("pt-BR")} lead{page.leads_count !== 1 ? "s" : ""} ·{" "}
            {page.views_count.toLocaleString("pt-BR")} visita{page.views_count !== 1 ? "s" : ""}
          </p>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
            isPublished ? "bg-secondary text-primary" : "bg-muted text-muted-foreground"
          )}
        >
          {isPublished && <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />}
          {STATUS_LABELS[page.status] ?? page.status}
        </span>
      </Link>
    )
  })

  return (
    <section className="overflow-hidden rounded-xl border bg-card shadow-ambient">
      <div className="flex items-center justify-between px-6 py-4 max-[480px]:px-4">
        <h2 className="font-quicksand text-[17px] font-semibold text-foreground">
          Páginas de vendas
        </h2>
        <Link
          href="/paginas-de-vendas"
          className="flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline"
        >
          Ver todas
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
      {recent.length === 0 ? emptyState : <div className="flex flex-col">{rows}</div>}
    </section>
  )
}
