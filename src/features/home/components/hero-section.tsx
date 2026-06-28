import { ArrowRight, Check, MessageCircle, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"

export const HeroSection = () => {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="grid grid-cols-2 gap-14 items-center max-[960px]:grid-cols-1 max-[960px]:gap-12">
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-secondary text-secondary-foreground rounded-full text-xs font-bold uppercase tracking-[0.08em] mb-5">
              <span className="size-1.5 rounded-full bg-primary" />
              Para pequenos negócios locais
            </span>

            <h1 className="font-quicksand text-[clamp(2.5rem,4.6vw,4rem)] font-bold leading-[1.05] tracking-tight mb-5 text-balance">
              Anunciar deveria ser tão simples quanto{" "}
              <span className="text-primary">atender um cliente.</span>
            </h1>

            <p className="text-[1.125rem] leading-relaxed text-muted-foreground max-w-[520px] mb-8">
              Sem gerenciador de tráfego, sem segmentação confusa, sem surpresa no fim do mês. Você escolhe um pacote, a gente publica, você acompanha as mensagens e os cliques que chegam.
            </p>

            <div className="flex gap-3 flex-wrap max-[560px]:flex-col">
              <Button size="lg" className="rounded-full" asChild>
                <a href="/anuncios/criar">
                  Criar meu primeiro anúncio
                  <ArrowRight className="size-4" />
                </a>
              </Button>
            </div>

            <div className="flex items-center gap-3 mt-7 text-sm text-muted-foreground">
              <span className="size-7 rounded-full bg-[var(--primary-soft)] text-primary grid place-items-center shrink-0">
                <Check className="size-3.5" strokeWidth={2.4} />
              </span>
              Comece com R$ 100 · sem fidelidade · cancele quando quiser
            </div>
          </div>

          <div className="relative aspect-[5/4.2] max-[960px]:max-w-lg max-[960px]:mx-auto max-[960px]:w-full" aria-hidden="true">
            <div className="absolute top-[14%] left-[-6%] max-[960px]:left-0 z-10 flex items-center gap-2.5 bg-card border rounded-2xl shadow-lift px-3.5 py-3 text-[0.8125rem]">
              <div className="size-8 rounded-lg bg-[var(--primary-soft)] text-primary grid place-items-center shrink-0">
                <MessageCircle className="size-4" strokeWidth={2.2} />
              </div>
              <div>
                <div className="text-[0.625rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">Nova mensagem</div>
                <div className="font-bold font-quicksand">+24 hoje</div>
              </div>
            </div>
            <div className="absolute bottom-[12%] right-[-4%] max-[960px]:right-0 z-10 flex items-center gap-2.5 bg-card border rounded-2xl shadow-lift px-3.5 py-3 text-[0.8125rem]">
              <div className="size-8 rounded-lg grid place-items-center shrink-0" style={{ background: "rgba(16,185,129,0.14)", color: "#10b981" }}>
                <Activity className="size-4" strokeWidth={2.2} />
              </div>
              <div>
                <div className="text-[0.625rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">Cliques no site</div>
                <div className="font-bold font-quicksand">+12,4%</div>
              </div>
            </div>
            <div className="absolute inset-0 bg-card border rounded-[22px] shadow-lift overflow-hidden">
              <div className="h-9 bg-muted border-b flex items-center px-3.5 gap-1.5">
                <span className="size-2.5 rounded-full bg-[#f5b3b3]" />
                <span className="size-2.5 rounded-full bg-[#f5dfa3]" />
                <span className="size-2.5 rounded-full bg-[#b3e5cb]" />
                <span className="ml-3 text-xs text-muted-foreground bg-card border rounded-full px-3 py-1">
                  trianuncios.com.br/anuncios/promocao-inverno
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3.5">
                  <span className="font-quicksand text-[1.125rem] font-bold">Promoção do Inverno</span>
                  <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-[0.06em] bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full">
                    <PulseDot />
                    Ao vivo
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-primary text-primary-foreground rounded-[10px] px-3 py-2.5">
                    <div className="text-[0.6rem] font-bold uppercase tracking-[0.08em] text-white/80">Impressões</div>
                    <div className="font-quicksand text-[1.125rem] font-bold mt-0.5 tabular-nums">48.236</div>
                  </div>
                  <div className="bg-background border rounded-[10px] px-3 py-2.5">
                    <div className="text-[0.6rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">Cliques</div>
                    <div className="font-quicksand text-[1.125rem] font-bold mt-0.5 tabular-nums">1.284</div>
                  </div>
                  <div className="bg-background border rounded-[10px] px-3 py-2.5">
                    <div className="text-[0.6rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">CTR</div>
                    <div className="font-quicksand text-[1.125rem] font-bold mt-0.5 tabular-nums">2,66%</div>
                  </div>
                </div>
                <div className="h-[92px] border rounded-[10px] overflow-hidden relative" style={{ background: "linear-gradient(180deg,rgba(0,108,73,0.18) 0%,rgba(0,108,73,0) 100%)" }}>
                  <svg viewBox="0 0 320 92" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                    <defs>
                      <linearGradient id="hg" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#006c49" stopOpacity="0.30" />
                        <stop offset="100%" stopColor="#006c49" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0 70 C 30 60, 50 50, 80 48 S 130 56, 160 38 S 220 22, 260 26 S 310 14, 320 10 L 320 92 L 0 92 Z" fill="url(#hg)" />
                    <path d="M0 70 C 30 60, 50 50, 80 48 S 130 56, 160 38 S 220 22, 260 26 S 310 14, 320 10" fill="none" stroke="#006c49" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="flex justify-between mt-2.5 text-[0.7rem] text-muted-foreground font-semibold">
                  <span>25/04</span><span>27/04</span><span>29/04</span><span>01/05</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

const PulseDot = () => {
  return (
    <span className="relative flex size-1.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
      <span className="relative inline-flex rounded-full size-1.5 bg-primary" />
    </span>
  )
}
