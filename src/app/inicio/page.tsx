"use client"

import Link from "next/link"
import { Plus } from "lucide-react"
import { AuthGuard } from "@/lib/auth-guard"
import { useAuth } from "@/lib/auth-context"
import { Layout } from "@/components/layout"
import { useDashboardData } from "@/features/dashboard/use-dashboard-data"
import { QuickActions } from "@/features/dashboard/quick-actions"
import { PerformanceSummaryCard } from "@/features/dashboard/performance-summary-card"
import { RecentAdsCard } from "@/features/dashboard/recent-ads-card"
import { RecentLandingPagesCard } from "@/features/dashboard/recent-landing-pages-card"
import { ConnectionsCard } from "@/features/dashboard/connections-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

const InicioPage = () => {
  const { user } = useAuth()
  const { adRequests, landingPages, accounts, summary, isLoading, error, refreshAccounts } =
    useDashboardData()

  const firstName = user?.name?.split(" ")[0] ?? ""
  const initial = user?.name?.charAt(0).toUpperCase() ?? ""

  const skeletons = (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-24 rounded-xl" />
      <Skeleton className="h-36 rounded-xl" />
      <Skeleton className="h-64 rounded-xl" />
    </div>
  )

  const content = (
    <div className="flex flex-col gap-4 sm:gap-6">
      <QuickActions />
      {summary && <PerformanceSummaryCard summary={summary} />}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <RecentAdsCard adRequests={adRequests} />
        <RecentLandingPagesCard landingPages={landingPages} />
      </div>
      <ConnectionsCard accounts={accounts} onConnected={refreshAccounts} />
    </div>
  )

  return (
    <AuthGuard>
      <Layout>
        <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
          <section className="mb-4 flex items-center gap-4 rounded-xl border bg-card p-6 shadow-ambient sm:mb-6 max-[480px]:p-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary font-quicksand text-lg font-bold text-primary-foreground sm:size-14">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-title-2 text-foreground max-[480px]:text-[18px] max-[480px]:leading-6">
                Olá, {firstName} 👋
              </h1>
              <p className="truncate text-sm text-muted-foreground">{user?.organization_name}</p>
            </div>
            <Button asChild className="hidden rounded-full px-6 sm:inline-flex">
              <Link href="/anuncios/criar">
                <Plus className="size-4" />
                Criar anúncio
              </Link>
            </Button>
          </section>
          {error && <p className="mb-6 text-sm text-destructive">{error}</p>}
          {isLoading ? skeletons : content}
        </main>
      </Layout>
    </AuthGuard>
  )
}

export default InicioPage
