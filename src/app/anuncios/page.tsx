"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Megaphone, Plus, Search } from "lucide-react"
import { AuthGuard } from "@/lib/auth-guard"
import { useAuth } from "@/lib/auth-context"
import { Layout } from "@/components/layout"
import { getAdRequests } from "@/api/ad-request"
import type { AdRequest } from "@/api/ad-request"
import { AdRequestCard } from "@/features/myAds/ad-request-card"
import { AdCreationCtaCard } from "@/features/myAds/ad-creation-cta-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type TabKey = "todos" | "ao-vivo" | "encerrados" | "rascunhos"

const TABS: { key: TabKey; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "ao-vivo", label: "Ao vivo" },
  { key: "encerrados", label: "Encerrados" },
  { key: "rascunhos", label: "Rascunhos" },
]

const AnunciosPage = () => {
  const { user } = useAuth()
  const [adRequests, setAdRequests] = useState<AdRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabKey>("todos")

  const [search, setSearch] = useState("")

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAdRequests()
        setAdRequests(data)
      } catch {
        setError("Erro ao carregar anúncios.")
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const orgName = user?.organization_name ?? ""

  const liveCount = adRequests.filter(a =>
    ["published", "partially_published"].includes(a.status)
  ).length

  const counts: Record<TabKey, number> = {
    todos: adRequests.length,
    "ao-vivo": liveCount,
    encerrados: adRequests.filter(a => ["failed", "cancelled", "rejected"].includes(a.status)).length,
    rascunhos: adRequests.filter(a => a.status === "draft").length,
  }

  const filtered = adRequests
    .filter(ad => {
      if (activeTab === "ao-vivo") return ["published", "partially_published"].includes(ad.status)
      if (activeTab === "encerrados") return ["failed", "cancelled", "rejected"].includes(ad.status)
      if (activeTab === "rascunhos") return ad.status === "draft"
      return true
    })
    .filter(ad =>
      search === "" || ad.base_ad_creative?.name?.toLowerCase().includes(search.toLowerCase())
    )

  const skeletons = [0, 1, 2].map(i => <Skeleton key={i} className="h-[420px] rounded-lg" />)

  const emptyState = (
    <div className="col-span-full flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
        <Megaphone className="w-6 h-6 text-muted-foreground" />
      </div>
      <div>
        <p className="font-semibold text-foreground">Nenhum anúncio encontrado</p>
        <p className="text-sm text-muted-foreground mt-1">
          {search ? "Tente buscar por outro nome." : "Crie seu primeiro anúncio para começar."}
        </p>
      </div>
      {!search && (
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/anuncios/criar">Criar anúncio</Link>
        </Button>
      )}
    </div>
  )

  const adCards = filtered.map(ad => (
    <AdRequestCard key={ad.id} adRequest={ad} orgName={orgName} />
  ))

  const gridContent = isLoading ? skeletons : filtered.length === 0 ? emptyState : adCards

  return (
    <AuthGuard>
      <Layout>
        <main className="max-w-[1280px] mx-auto px-8 py-10">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-title-1 text-foreground">Meus anúncios</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {adRequests.length} anúncio{adRequests.length !== 1 ? "s" : ""} · {liveCount} ao vivo agora
              </p>
            </div>
            <Button asChild className="rounded-full h-12 px-6">
              <Link href="/anuncios/criar">
                <Plus className="mr-2 h-4 w-4" />
                Criar anúncio
              </Link>
            </Button>
          </div>
          {error && <p className="text-destructive mb-6">{error}</p>}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex bg-muted rounded-full p-1 gap-1">
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                    activeTab === tab.key
                      ? "bg-card text-foreground shadow-[var(--shadow-ambient)]"
                      : "text-muted-foreground"
                  )}
                >
                  {tab.label}
                  <span className={cn(
                    "ml-1.5 rounded-full px-1.5 py-0.5 text-xs",
                    activeTab === tab.key
                      ? "bg-primary-soft text-primary"
                      : "bg-accent text-muted-foreground"
                  )}>
                    {counts[tab.key]}
                  </span>
                </button>
              ))}
            </div>
            <div className="relative flex-1 min-w-[240px] max-w-[360px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar anúncios"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 rounded-full"
              />
            </div>
          </div>
          <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))" }}>
            {gridContent}
            {!isLoading && <AdCreationCtaCard />}
          </div>
        </main>
      </Layout>
    </AuthGuard>
  )
}

export default AnunciosPage
