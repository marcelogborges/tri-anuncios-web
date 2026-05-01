import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Começar",
    tagline: "Para testar o primeiro anúncio",
    price: "100",
    duration: "por 7 dias de campanha",
    stats: [
      { val: "~50", lbl: "Mensagens" },
      { val: "~400", lbl: "Cliques no site" },
    ],
    features: [
      "1 anúncio ativo no Meta",
      "Painel de estatísticas em tempo real",
      "Segmentação por cidade",
    ],
    ctaLabel: "Começar com R$ 100",
    featured: false,
  },
  {
    name: "Crescer",
    tagline: "Para movimentar o WhatsApp todo dia",
    price: "200",
    duration: "por 14 dias de campanha",
    stats: [
      { val: "~120", lbl: "Mensagens" },
      { val: "~900", lbl: "Cliques no site" },
    ],
    features: [
      "2 anúncios ativos no Meta",
      "Painel + comparação entre criativos",
      "Segmentação por cidade e bairro",
      "Sugestão de copy automática",
    ],
    ctaLabel: "Quero crescer · R$ 200",
    featured: true,
    badge: "Mais escolhido",
  },
  {
    name: "Acelerar",
    tagline: "Para quem já tem um fluxo e quer escala",
    price: "500",
    duration: "por 30 dias de campanha",
    stats: [
      { val: "~350", lbl: "Mensagens" },
      { val: "~2.500", lbl: "Cliques no site" },
    ],
    features: [
      "5 anúncios ativos no Meta",
      "Painel completo + exportação CSV",
      "Segmentação avançada (raio em km)",
      "Suporte prioritário por WhatsApp",
    ],
    ctaLabel: "Acelerar com R$ 500",
    featured: false,
  },
]

export const PlansSection = () => {
  return (
    <section id="planos" className="py-24 max-[960px]:py-16 scroll-mt-20">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-secondary text-secondary-foreground rounded-full text-xs font-bold uppercase tracking-[0.08em] mb-4">
            <span className="size-1.5 rounded-full bg-primary" />
            Planos
          </span>
          <h2 className="font-quicksand text-[clamp(2rem,3.4vw,3rem)] font-bold leading-[1.1] tracking-tight max-w-[720px] mx-auto mb-4 text-balance">
            Pacote fechado, resultado previsível.
          </h2>
          <p className="text-[1.125rem] text-muted-foreground max-w-[620px] mx-auto leading-relaxed">
            Você sabe quanto vai pagar e o que vai receber. Sem leilão, sem surpresa.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-5 max-w-[1080px] mx-auto items-start max-[960px]:grid-cols-1 max-[960px]:max-w-[480px]">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={cn(
                "relative rounded-[20px] p-8 flex flex-col transition-all duration-[250ms] hover:-translate-y-[3px]",
                plan.featured
                  ? "plan-featured scale-[1.03] hover:scale-[1.03] max-[960px]:scale-100 max-[960px]:hover:scale-100 max-[960px]:hover:-translate-y-[3px]"
                  : "bg-card border border-border shadow-ambient hover:shadow-lift",
                "max-[560px]:p-6"
              )}
            >
              {plan.badge && (
                <span className="absolute top-[18px] right-[18px] text-[0.7rem] font-bold uppercase tracking-[0.08em] bg-white/[0.16] text-white px-3 py-1 rounded-full">
                  {plan.badge}
                </span>
              )}

              <div>
                <div className={cn("font-quicksand text-[1.375rem] font-bold tracking-[-0.01em]")}>
                  {plan.name}
                </div>
                <div className={cn("text-[0.875rem] mt-1 mb-6", plan.featured ? "text-white/[0.78]" : "text-muted-foreground")}>
                  {plan.tagline}
                </div>
              </div>

              <div className="flex items-baseline gap-1.5 mb-1">
                <span className={cn("text-[1.125rem] font-semibold opacity-70")}>R$</span>
                <span className="font-quicksand text-5xl font-bold leading-none tracking-[-0.02em] tabular-nums max-[560px]:text-[2.5rem]">
                  {plan.price}
                </span>
              </div>
              <div className={cn("text-[0.8125rem] mb-6", plan.featured ? "text-white/[0.78]" : "text-muted-foreground")}>
                {plan.duration}
              </div>

              <div className={cn(
                "grid grid-cols-2 gap-2.5 p-4 rounded-xl border mb-6",
                plan.featured ? "bg-white/[0.08] border-white/[0.12]" : "bg-background border-border"
              )}>
                {plan.stats.map((s) => (
                  <div key={s.lbl}>
                    <div className="font-quicksand text-2xl font-bold leading-none tabular-nums">{s.val}</div>
                    <div className={cn("text-[0.7rem] font-bold uppercase tracking-[0.06em] mt-1", plan.featured ? "text-white/[0.78]" : "text-muted-foreground")}>
                      {s.lbl}
                    </div>
                  </div>
                ))}
              </div>

              <ul className="flex-1 space-y-3 mb-7">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[0.9375rem] leading-[1.45]">
                    <Check
                      className={cn("size-[18px] shrink-0 mt-[2px]", plan.featured ? "text-[#b4f4d3]" : "text-primary")}
                      strokeWidth={2.6}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.featured ? "outline" : "outline"}
                className={cn(
                  "w-full rounded-full mt-auto",
                  plan.featured && "bg-white text-primary border-transparent hover:bg-white/90"
                )}
                asChild
              >
                <Link href="/register">{plan.ctaLabel}</Link>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
