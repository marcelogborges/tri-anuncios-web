export const HowItWorksSection = () => {
  const steps = [
    {
      num: "01",
      title: "Conte sobre seu negócio",
      body: "Em quatro perguntas a gente já sabe o que você vende, pra quem, em qual cidade e qual é a sua oferta. É só responder.",
    },
    {
      num: "02",
      title: "Escolha um pacote",
      body: "R$ 100, R$ 200 ou R$ 500. A gente já sabe quantas mensagens e cliques cabem em cada um — sem leilão, sem lance.",
    },
    {
      num: "03",
      title: "Acompanhe os resultados",
      body: "Mensagens no WhatsApp, cliques no site, alcance e investimento. Tudo em uma tela só, atualizado em tempo real.",
    },
  ]

  return (
    <section id="como-funciona" className="py-24 max-[960px]:py-16 scroll-mt-20">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-secondary text-secondary-foreground rounded-full text-xs font-bold uppercase tracking-[0.08em] mb-4">
            <span className="size-1.5 rounded-full bg-primary" />
            Como funciona
          </span>
          <h2 className="font-quicksand text-[clamp(2rem,3.4vw,3rem)] font-bold leading-[1.1] tracking-tight max-w-[720px] mx-auto mb-4 text-balance">
            Do criativo ao primeiro cliente em três passos.
          </h2>
          <p className="text-[1.125rem] text-muted-foreground max-w-[620px] mx-auto leading-relaxed">
            Sem instalar nada. Sem ler 200 páginas de tutorial.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-7 max-w-[1080px] mx-auto max-[960px]:grid-cols-1 max-[960px]:max-w-lg">
          {steps.map((step) => (
            <article key={step.num} className="bg-card border rounded-[18px] shadow-ambient p-8">
              <div className="font-quicksand text-xs font-bold text-primary bg-[var(--primary-soft)] size-8 rounded-full grid place-items-center mb-[18px]">
                {step.num}
              </div>
              <h3 className="font-quicksand text-[1.25rem] font-bold mb-2">{step.title}</h3>
              <p className="text-muted-foreground leading-[1.55] text-[0.9375rem]">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
