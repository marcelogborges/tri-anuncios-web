import { AlertCircle, DollarSign } from "lucide-react"

export const ProblemsSection = () => {
  return (
    <section id="problemas" className="bg-card border-y border-border py-24 max-[960px]:py-16 scroll-mt-20">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-secondary text-secondary-foreground rounded-full text-xs font-bold uppercase tracking-[0.08em] mb-4">
            <span className="size-1.5 rounded-full bg-primary" />
            Por que TriAnúncios
          </span>
          <h2 className="font-quicksand text-[clamp(2rem,3.4vw,3rem)] font-bold leading-[1.1] tracking-tight max-w-[720px] mx-auto mb-4 text-balance">
            Tudo que trava você na hora de anunciar — a gente resolve.
          </h2>
          <p className="text-[1.125rem] text-muted-foreground max-w-[620px] mx-auto leading-relaxed">
            A gente conversou com dezenas de pequenos negócios. Esses dois problemas se repetiram em todos.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 max-w-[980px] mx-auto max-[960px]:grid-cols-1">
          <article className="grid grid-cols-[56px_1fr] gap-5 p-7 border rounded-[18px] bg-background max-[560px]:p-5">
            <div className="size-14 rounded-2xl bg-[var(--primary-soft)] text-primary grid place-items-center shrink-0">
              <AlertCircle className="size-[26px]" strokeWidth={2} />
            </div>
            <div>
              <h3 className="font-quicksand text-[1.25rem] font-bold leading-[1.25] mb-2">
                As plataformas de criação de anúncios são complicadas demais
              </h3>
              <p className="text-muted-foreground leading-[1.55] text-[0.9375rem]">
                Conta de negócio, gerenciador, públicos, pixel, conversões, lances, qualidade do criativo… cada plataforma fala uma língua diferente, e você só queria divulgar a sua promoção do mês.
              </p>
              <span className="inline-block mt-3 text-xs font-bold text-primary bg-[var(--primary-soft)] rounded-full px-3 py-1">
                No TriAnúncios: 4 passos · 5 minutos · em português
              </span>
            </div>
          </article>

          <article className="grid grid-cols-[56px_1fr] gap-5 p-7 border rounded-[18px] bg-background max-[560px]:p-5">
            <div className="size-14 rounded-2xl bg-[var(--primary-soft)] text-primary grid place-items-center shrink-0">
              <DollarSign className="size-[26px]" strokeWidth={2} />
            </div>
            <div>
              <h3 className="font-quicksand text-[1.25rem] font-bold leading-[1.25] mb-2">
                Medo de gastar e não ver resultado
              </h3>
              <p className="text-muted-foreground leading-[1.55] text-[0.9375rem]">
                Você coloca o seu dinheiro nas plataformas e ele some sem você entender pra onde foi. Aqui você compra um pacote fechado, com prazo definido, e acompanha em tempo real quantas mensagens e cliques cada real trouxe.
              </p>
              <span className="inline-block mt-3 text-xs font-bold text-primary bg-[var(--primary-soft)] rounded-full px-3 py-1">
                Pacote fechado · sem cobrança surpresa
              </span>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
