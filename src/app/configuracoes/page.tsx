"use client"

import { Suspense } from "react"
import { AuthGuard } from "@/lib/auth-guard"
import { Layout } from "@/components/layout"
import { SettingsTabs } from "@/features/settings/settings-tabs"
import { Skeleton } from "@/components/ui/skeleton"

const ConfiguracoesPage = () => {
  return (
    <AuthGuard>
      <Layout>
        <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-8 sm:py-10">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-title-1 text-foreground">Configurações</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Seus dados, sua organização e as conexões de plataforma.
            </p>
          </div>
          <Suspense fallback={<Skeleton className="h-96 rounded-lg" />}>
            <SettingsTabs />
          </Suspense>
        </main>
      </Layout>
    </AuthGuard>
  )
}

export default ConfiguracoesPage
