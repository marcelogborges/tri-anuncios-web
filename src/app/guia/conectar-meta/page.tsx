import type { Metadata } from "next"
import Link from "next/link"
import { Layout } from "@/components/layout"
import { GUIDE_SECTIONS } from "@/features/metaConnectGuide/guide-content"
import { GuideSection } from "@/features/metaConnectGuide/guide-section"
import { GuideToc } from "@/features/metaConnectGuide/guide-toc"

export const metadata: Metadata = {
  title: "Guia: conectando sua conta Meta — Tri Anúncios",
  description:
    "Passo a passo para configurar sua página do Facebook e conta do Instagram no Meta Business Suite antes de conectar ao Tri Anúncios.",
}

export default function ConectarMetaGuidePage() {
  return (
    <Layout>
      <article className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-24">
        <header className="mb-14">
          <p className="text-label-caps text-muted-foreground mb-3 uppercase tracking-widest">
            Guia de configuração
          </p>
          <h1 className="text-title-1 text-foreground">
            Conectando sua conta Meta
          </h1>
          <p className="text-body-lg text-muted-foreground mt-4 max-w-prose">
            Para publicar anúncios pelo Tri Anúncios, sua página do Facebook e
            sua conta do Instagram precisam estar corretamente configuradas no
            Meta Business Suite — com você tendo controle total sobre elas.
            Siga as verificações abaixo antes de conectar.
          </p>
        </header>
        <div className="mb-14">
          <GuideToc sections={GUIDE_SECTIONS} />
        </div>
        <div className="space-y-16">
          {GUIDE_SECTIONS.map((section) => (
            <GuideSection key={section.id} section={section} />
          ))}
        </div>
        <footer className="mt-16 rounded-lg border bg-muted/30 p-6">
          <h2 className="text-title-2 text-foreground mb-2">Tudo certo?</h2>
          <p className="text-body-md text-muted-foreground leading-relaxed">
            Com as permissões validadas, volte ao Tri Anúncios e{" "}
            <Link
              href="/anuncios/criar"
              className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
            >
              conecte sua conta para publicar seu anúncio
            </Link>
            .
          </p>
        </footer>
      </article>
    </Layout>
  )
}
