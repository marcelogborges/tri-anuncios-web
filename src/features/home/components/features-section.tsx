const features = [
  {
    num: "01",
    title: "Crie anúncios em minutos",
    body: "Responda quatro perguntas sobre seu negócio e seu anúncio está pronto para ir ao ar. Sem gerenciador, sem segmentação confusa, sem surpresa.",
  },
  {
    num: "02",
    title: "Conecte sua conta em um clique",
    body: "Integre o Facebook e o Instagram da sua empresa uma única vez. A partir daí, tudo acontece direto pelo TriAnúncios.",
  },
  {
    num: "03",
    title: "Acompanhe e deixe otimizar",
    body: "Cliques, alcance e mensagens do WhatsApp em uma tela só. O sistema ajusta automaticamente seu anúncio para você gastar menos e alcançar mais.",
  },
]

export const FeaturesSection = () => {
  return (
    <section className="py-24 max-[960px]:py-16">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="text-center mb-16">
          <h2 className="font-quicksand text-[clamp(2rem,3.4vw,2.75rem)] font-bold leading-[1.1] tracking-tight max-w-[640px] mx-auto text-balance">
            Tudo que você precisa. Nada do que não precisa.
          </h2>
        </div>

        <ol className="grid grid-cols-3 gap-px bg-border max-[720px]:grid-cols-1" aria-label="Como funciona">
          {features.map((f) => {
            return (
              <li
                key={f.num}
                className="bg-background flex flex-col gap-5 px-10 py-10 max-[960px]:px-7 max-[720px]:px-6"
              >
                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-xl bg-[var(--primary-soft)] text-primary grid place-items-center shrink-0">
                    <span
                      className="font-quicksand text-[0.6875rem] font-bold tabular-nums text-primary bg-[var(--primary-soft)] size-7 rounded-full grid place-items-center shrink-0 mt-0.5"
                      aria-hidden="true"
                    >
                      {f.num}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="font-quicksand text-[1.1875rem] font-bold leading-[1.25] mb-2">
                    {f.title}
                  </h3>
                  <p className="text-muted-foreground leading-[1.6] text-[0.9375rem]">{f.body}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
