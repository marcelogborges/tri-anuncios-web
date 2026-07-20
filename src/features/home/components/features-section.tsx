import Link from "next/link"
import { ArrowRight, Check, Sparkles, CalendarClock } from "lucide-react"
import { Button } from "@/components/ui/button"

type Feature = {
  eyebrow: string
  title: string
  bullets: string[]
  cta: { label: string; href: string }
  visual: React.ReactNode
}

const features: Feature[] = [
  {
    eyebrow: "Criação de anúncios",
    title: "Anúncios com a sua cara, prontos em minutos",
    bullets: [
      "Escolha o formato: feed, story ou os dois",
      "Use uma foto sua ou gere um criativo do zero",
      "Agende a publicação para o melhor horário",
    ],
    cta: { label: "Criar anúncio", href: "/anuncios/criar" },
    visual: <CreateAdVisual />,
  },
  {
    eyebrow: "Inteligência artificial",
    title: "Copy otimizada sem quebrar a cabeça",
    bullets: [
      "Descreva seu negócio e a IA escreve o texto do anúncio",
      "Criativos gerados a partir de uma foto ou do zero",
      "Sugestões que seguem as boas práticas das plataformas",
    ],
    cta: { label: "Experimentar a IA", href: "/anuncios/criar" },
    visual: <AiVisual />,
  },
  {
    eyebrow: "Estatísticas",
    title: "Acompanhe os resultados em uma tela só",
    bullets: [
      "Impressões, cliques e mensagens em tempo real",
      "Sem dashboards confusos: só o que importa",
      "Compare períodos e saiba o que está funcionando",
    ],
    cta: { label: "Ver estatísticas", href: "/anuncios" },
    visual: <StatsVisual />,
  },
]

export const FeaturesSection = () => {
  return (
    <>
      {features.map((f, i) => {
        const reversed = i % 2 === 1
        return (
          <section key={f.eyebrow} className={reversed ? "" : "bg-muted"}>
            <div className="mx-auto max-w-6xl px-6 sm:px-8 py-16 max-[960px]:py-12">
              <div className="grid grid-cols-2 gap-16 items-center max-[960px]:grid-cols-1 max-[960px]:gap-8">
                <div className={reversed ? "order-2 max-[960px]:order-1" : ""}>
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-secondary text-secondary-foreground rounded-full text-xs font-bold uppercase tracking-[0.08em] mb-4">
                    {f.eyebrow}
                  </span>
                  <h3 className="font-quicksand text-[clamp(1.5rem,2.6vw,2rem)] font-bold leading-[1.15] tracking-tight mb-6 text-balance">
                    {f.title}
                  </h3>
                  <ul className="flex flex-col gap-3.5 mb-8">
                    {f.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
                        <span className="size-6 rounded-full bg-[var(--primary-soft)] text-primary grid place-items-center shrink-0 mt-0.5">
                          <Check className="size-3.5" strokeWidth={2.4} />
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="rounded-full" asChild>
                    <Link href={f.cta.href}>
                      {f.cta.label}
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>

                <div className={reversed ? "order-1 max-[960px]:order-2" : ""} aria-hidden="true">
                  {f.visual}
                </div>
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}

function CreateAdVisual() {
  return (
    <div className="bg-card border rounded-[22px] shadow-lift p-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-5">
        <span className="font-quicksand text-[0.9375rem] font-bold">Novo anúncio</span>
        <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-[0.06em] bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full">
          Rascunho
        </span>
      </div>
      <div className="flex gap-2 mb-5">
        <span className="px-3.5 py-1.5 rounded-full text-[0.8125rem] font-bold bg-primary text-primary-foreground">Feed</span>
        <span className="px-3.5 py-1.5 rounded-full text-[0.8125rem] font-semibold bg-muted text-muted-foreground">Story</span>
        <span className="px-3.5 py-1.5 rounded-full text-[0.8125rem] font-semibold bg-muted text-muted-foreground">Os dois</span>
      </div>
      <div className="rounded-[14px] border overflow-hidden mb-4">
        <div
          className="h-36 grid place-items-center"
          style={{ background: "linear-gradient(160deg, #adedd3 0%, #e6f4ee 100%)" }}
        >
          <span className="font-quicksand text-[1.0625rem] font-bold text-secondary-foreground">
            Promoção da semana 🥐
          </span>
        </div>
        <div className="px-4 py-3 flex items-center justify-between bg-card">
          <div>
            <div className="text-[0.8125rem] font-bold">Padaria do Bairro</div>
            <div className="text-[0.75rem] text-muted-foreground">Café + pão na chapa por R$ 9,90</div>
          </div>
          <span className="text-[0.75rem] font-bold text-primary shrink-0">Saiba mais</span>
        </div>
      </div>
      <div className="flex items-center gap-2.5 text-[0.8125rem] text-muted-foreground">
        <span className="size-8 rounded-lg bg-[var(--primary-soft)] text-primary grid place-items-center shrink-0">
          <CalendarClock className="size-4" strokeWidth={2.2} />
        </span>
        Agendado para sexta, 18h
      </div>
    </div>
  )
}

function AiVisual() {
  return (
    <div className="bg-card border rounded-[22px] shadow-lift p-6 max-w-md mx-auto">
      <div className="bg-muted rounded-[14px] px-4 py-3.5 mb-4">
        <div className="text-[0.625rem] font-bold uppercase tracking-[0.08em] text-muted-foreground mb-1">
          Você descreve
        </div>
        <p className="text-[0.875rem] leading-relaxed">
          &ldquo;Sou nail designer, quero divulgar o alongamento em gel com 20% de desconto essa semana&rdquo;
        </p>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <span className="size-8 rounded-lg bg-[var(--primary-soft)] text-primary grid place-items-center shrink-0">
          <Sparkles className="size-4" strokeWidth={2.2} />
        </span>
        <span className="text-[0.75rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">
          A IA escreve
        </span>
      </div>
      <div className="border-2 border-primary rounded-[14px] px-4 py-3.5">
        <p className="text-[0.9375rem] leading-relaxed font-medium mb-2.5">
          Unhas impecáveis por mais tempo 💅 Alongamento em gel com 20% off só essa semana. Agende seu horário!
        </p>
        <div className="flex gap-2">
          <span className="px-2.5 py-1 rounded-full text-[0.7rem] font-bold bg-secondary text-secondary-foreground">
            Copy otimizada
          </span>
          <span className="px-2.5 py-1 rounded-full text-[0.7rem] font-bold bg-secondary text-secondary-foreground">
            Pronta para publicar
          </span>
        </div>
      </div>
    </div>
  )
}

function StatsVisual() {
  const bars = [34, 52, 44, 68, 58, 82, 74]
  return (
    <div className="bg-card border rounded-[22px] shadow-lift p-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-5">
        <span className="font-quicksand text-[0.9375rem] font-bold">Últimos 7 dias</span>
        <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-[0.06em] bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full">
          <span className="size-1.5 rounded-full bg-primary" />
          Ao vivo
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="bg-background border rounded-[10px] px-2.5 py-2.5 min-w-0">
          <div className="text-[0.55rem] font-bold uppercase tracking-[0.03em] text-muted-foreground whitespace-nowrap">Impressões</div>
          <div className="font-quicksand text-[1.0625rem] font-bold mt-0.5 tabular-nums">12.480</div>
        </div>
        <div className="bg-background border rounded-[10px] px-2.5 py-2.5 min-w-0">
          <div className="text-[0.55rem] font-bold uppercase tracking-[0.03em] text-muted-foreground whitespace-nowrap">Cliques</div>
          <div className="font-quicksand text-[1.0625rem] font-bold mt-0.5 tabular-nums">318</div>
        </div>
        <div className="bg-background border rounded-[10px] px-2.5 py-2.5 min-w-0">
          <div className="text-[0.55rem] font-bold uppercase tracking-[0.03em] text-muted-foreground whitespace-nowrap">Mensagens</div>
          <div className="font-quicksand text-[1.0625rem] font-bold mt-0.5 tabular-nums">42</div>
        </div>
      </div>
      <div className="flex items-end gap-2 h-[104px] mb-2">
        {bars.map((h, i) => (
          <div key={i} className="flex-1 rounded-t-[6px]" style={{ height: `${h}%`, background: i === bars.length - 2 ? "#006c49" : "#adedd3" }} />
        ))}
      </div>
      <div className="flex justify-between text-[0.7rem] text-muted-foreground font-semibold">
        <span>seg</span><span>ter</span><span>qua</span><span>qui</span><span>sex</span><span>sáb</span><span>dom</span>
      </div>
    </div>
  )
}
