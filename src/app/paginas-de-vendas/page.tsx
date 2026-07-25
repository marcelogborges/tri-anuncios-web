"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ExternalLink, Eye, Globe, Layout as LayoutIcon, Pencil, Plus, Trash2, Users } from "lucide-react"

import { AuthGuard } from "@/lib/auth-guard"
import { useAuth } from "@/lib/auth-context"
import { Layout } from "@/components/layout"
import { getOrganization, type Organization } from "@/api/organization"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  createLandingPage,
  deleteLandingPage,
  getLandingPages,
  publishLandingPage,
  unpublishLandingPage,
  type LandingPage,
} from "@/api/landing-pages"
import { TemplatePickerDialog } from "@/features/landingPages/template-picker-dialog"
import type { LandingPageTemplate } from "@/features/landingPages/templates"

const STATUS_BADGE: Record<LandingPage["status"], { label: string; className: string }> = {
  draft: { label: "Rascunho", className: "bg-muted text-muted-foreground" },
  published: { label: "Publicada", className: "bg-primary-soft text-primary" },
  archived: { label: "Arquivada", className: "bg-muted text-muted-foreground" },
}

const LandingPagesPage = () => {
  const router = useRouter()
  const { user } = useAuth()
  const [pages, setPages] = useState<LandingPage[] | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [busyId, setBusyId] = useState<number | null>(null)

  const load = useCallback(async () => {
    try {
      setPages(await getLandingPages())
    } catch {
      setPages([])
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!user) return
    const loadOrganization = async () => {
      try {
        setOrganization(await getOrganization(user.organization_id))
      } catch {
        setOrganization(null)
      }
    }
    loadOrganization()
  }, [user])

  const handleCreate = async (name: string, template: LandingPageTemplate, slug: string) => {
    const page = await createLandingPage({ name, slug, content: template.content })
    router.push(`/paginas-de-vendas/editor/${page.id}`)
  }

  const togglePublish = async (page: LandingPage) => {
    setBusyId(page.id)
    try {
      if (page.status === "published") await unpublishLandingPage(page.id)
      else await publishLandingPage(page.id)
      await load()
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = async (page: LandingPage) => {
    if (!window.confirm(`Excluir a página "${page.name}"? Os leads dela também serão excluídos.`)) return
    setBusyId(page.id)
    try {
      await deleteLandingPage(page.id)
      await load()
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-title-1">Páginas de vendas</h1>
          <p className="text-body-md text-muted-foreground">
            Crie páginas de destino para seus anúncios e receba leads direto na plataforma.
          </p>
        </div>
        <Button onClick={() => setPickerOpen(true)} data-testid="create-landing-page">
          <Plus className="mr-2 h-4 w-4" />
          Nova página
        </Button>
      </div>

      {pages === null ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      ) : pages.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <LayoutIcon className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-body-lg font-medium">Nenhuma página ainda</p>
          <p className="text-body-sm text-muted-foreground">
            Crie sua primeira página de vendas e conecte-a aos seus anúncios.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2" data-testid="landing-pages-list">
          {pages.map((page) => {
            const badge = STATUS_BADGE[page.status]
            return (
              <div key={page.id} className="rounded-xl border bg-card p-5 shadow-ambient">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h2 className="text-title-2 leading-tight">{page.name}</h2>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.className}`}>
                    {badge.label}
                  </span>
                </div>
                <p className="mb-3 text-body-sm text-muted-foreground">
                  /{organization?.slug ?? "..."}/{page.slug}
                </p>
                <div className="mb-4 flex gap-4 text-body-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" /> {page.views_count} visitas
                  </span>
                  <Link
                    href={`/paginas-de-vendas/${page.id}/leads`}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    <Users className="h-4 w-4" /> {page.leads_count} leads
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/paginas-de-vendas/editor/${page.id}`}>
                      <Pencil className="mr-1 h-3.5 w-3.5" /> Editar
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant={page.status === "published" ? "secondary" : "default"}
                    disabled={busyId === page.id}
                    onClick={() => togglePublish(page)}
                  >
                    <Globe className="mr-1 h-3.5 w-3.5" />
                    {page.status === "published" ? "Despublicar" : "Publicar"}
                  </Button>
                  {page.status === "published" && (
                    <Button size="sm" variant="ghost" asChild>
                      <a href={page.public_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-1 h-3.5 w-3.5" /> Ver
                      </a>
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    disabled={busyId === page.id}
                    onClick={() => handleDelete(page)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <TemplatePickerDialog open={pickerOpen} onOpenChange={setPickerOpen} onCreate={handleCreate} orgSlug={organization?.slug} />
    </div>
  )
}

const Page = () => (
  <AuthGuard>
    <Layout>
      <LandingPagesPage />
    </Layout>
  </AuthGuard>
)

export default Page
