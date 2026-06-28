import type { Metadata } from "next"
import { Layout } from "@/components/layout"

export const metadata: Metadata = {
  title: "Termos de Serviço — Tri Anúncios",
  description:
    "Condições de uso da plataforma Tri Anúncios para criação e gestão de anúncios pagos.",
}

const requisitosConteudo = [
  "Não viola direitos de propriedade intelectual de terceiros.",
  "Cumpre as Políticas de Anúncios do Meta.",
  "Não contém informações falsas, enganosas ou fraudulentas.",
  "Respeita a legislação brasileira vigente (CDC, CONAR, etc.).",
]

export default function TermsPage() {
  return (
    <Layout>
      <article className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-24">
        <header className="mb-14">
          <p className="text-label-caps text-muted-foreground mb-3 uppercase tracking-widest">
            Última atualização: 28 de junho de 2026
          </p>
          <h1 className="text-title-1 text-foreground">Termos de Serviço</h1>
          <p className="text-body-lg text-muted-foreground mt-4 max-w-prose">
            Ao usar o Tri Anúncios, você concorda com estes termos. Leia-os
            antes de criar sua conta. Leitura estimada: 4 minutos.
          </p>
        </header>
        <div className="space-y-12">
          <section>
            <h2 className="text-title-2 text-foreground mb-4">
              1. O serviço
            </h2>
            <p className="text-body-md text-muted-foreground leading-relaxed">
              O Tri Anúncios é uma plataforma que permite a pequenas empresas
              brasileiras criar, publicar e monitorar anúncios pagos no
              Facebook e Instagram por meio da API do Meta. O serviço atua
              como intermediário técnico entre você e a plataforma Meta; não
              somos afiliados à Meta Platforms, Inc.
            </p>
          </section>
          <section>
            <h2 className="text-title-2 text-foreground mb-4">
              2. Elegibilidade
            </h2>
            <p className="text-body-md text-muted-foreground leading-relaxed">
              Para usar o Tri Anúncios, você deve: ter pelo menos 18 anos de
              idade, possuir uma Página do Facebook ativa com uma conta de
              anúncios válida, e concordar com os{" "}
              <a
                href="https://www.facebook.com/policies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                Termos de Anúncios do Meta
              </a>
              . Ao se registrar em nome de uma empresa, você declara ter
              autoridade para fazê-lo.
            </p>
          </section>
          <section>
            <h2 className="text-title-2 text-foreground mb-4">
              3. Sua conta
            </h2>
            <p className="text-body-md text-muted-foreground leading-relaxed">
              Você é responsável por manter a confidencialidade das suas
              credenciais de acesso e por todas as atividades realizadas na
              sua conta. Notifique-nos imediatamente em caso de uso não
              autorizado. Permitimos uma conta por empresa; contas duplicadas
              podem ser desativadas.
            </p>
          </section>
          <section>
            <h2 className="text-title-2 text-foreground mb-4">
              4. Conteúdo dos anúncios
            </h2>
            <p className="text-body-md text-muted-foreground leading-relaxed mb-4">
              Você é o único responsável pelo conteúdo dos anúncios criados
              via Tri Anúncios. Ao publicar um anúncio, você declara que o
              conteúdo:
            </p>
            <ul className="space-y-3 text-body-md text-muted-foreground leading-relaxed list-none">
              {requisitosConteudo.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-body-md text-muted-foreground leading-relaxed">
              Reservamo-nos o direito de suspender anúncios que violem estas
              condições, sem aviso prévio.
            </p>
          </section>
          <section>
            <h2 className="text-title-2 text-foreground mb-4">
              5. Plataforma Meta e API
            </h2>
            <p className="text-body-md text-muted-foreground leading-relaxed">
              O Tri Anúncios depende da API do Meta para funcionar. Alterações
              nas políticas ou disponibilidade da API pelo Meta podem afetar
              funcionalidades do serviço. Não nos responsabilizamos por
              interrupções, rejeições de anúncios ou outras ações tomadas pela
              Meta com relação às suas campanhas. O uso da plataforma Meta
              está sujeito aos termos e políticas do próprio Meta.
            </p>
          </section>
          <section>
            <h2 className="text-title-2 text-foreground mb-4">
              6. Pagamentos e cobranças
            </h2>
            <p className="text-body-md text-muted-foreground leading-relaxed">
              Os custos de veiculação dos anúncios (verba publicitária) são
              cobrados diretamente pela Meta na sua conta de anúncios. O Tri
              Anúncios pode cobrar uma taxa de serviço pela utilização da
              plataforma, conforme plano contratado. Detalhes de precificação
              estão disponíveis na página de planos. Taxas pagas não são
              reembolsáveis, salvo quando exigido por lei.
            </p>
          </section>
          <section>
            <h2 className="text-title-2 text-foreground mb-4">
              7. Propriedade intelectual
            </h2>
            <p className="text-body-md text-muted-foreground leading-relaxed">
              A plataforma Tri Anúncios, incluindo seu código, design e marca,
              é de propriedade exclusiva de seus operadores. Você conserva a
              propriedade do conteúdo criativo que produz. Ao publicar
              conteúdo via nossa plataforma, você nos concede uma licença
              limitada, não exclusiva, para transmiti-lo à Meta exclusivamente
              para fins de execução do serviço.
            </p>
          </section>
          <section>
            <h2 className="text-title-2 text-foreground mb-4">
              8. Limitação de responsabilidade
            </h2>
            <p className="text-body-md text-muted-foreground leading-relaxed">
              O Tri Anúncios é fornecido "no estado em que se encontra". Não
              garantimos resultados específicos de desempenho para suas
              campanhas. Em nenhuma hipótese nossa responsabilidade por danos
              diretos superará o valor pago pelo uso da plataforma nos 3
              meses anteriores ao evento. Não respondemos por danos indiretos,
              lucros cessantes ou perda de dados causados por falhas na
              plataforma Meta ou terceiros.
            </p>
          </section>
          <section>
            <h2 className="text-title-2 text-foreground mb-4">
              9. Encerramento
            </h2>
            <p className="text-body-md text-muted-foreground leading-relaxed">
              Você pode encerrar sua conta a qualquer momento pelo painel de
              configurações ou por e-mail. Podemos suspender ou encerrar sua
              conta em caso de violação destes termos, com aviso prévio quando
              possível. Após o encerramento, seus dados serão tratados conforme
              a Política de Privacidade.
            </p>
          </section>
          <section>
            <h2 className="text-title-2 text-foreground mb-4">
              10. Alterações nos termos
            </h2>
            <p className="text-body-md text-muted-foreground leading-relaxed">
              Podemos atualizar estes termos periodicamente. Notificaremos
              mudanças relevantes por e-mail ou aviso em destaque na
              plataforma com antecedência mínima de 15 dias. O uso continuado
              após a entrada em vigor das alterações constitui aceitação dos
              novos termos.
            </p>
          </section>
          <section>
            <h2 className="text-title-2 text-foreground mb-4">
              11. Lei aplicável
            </h2>
            <p className="text-body-md text-muted-foreground leading-relaxed">
              Estes termos são regidos pela legislação brasileira. Qualquer
              litígio será submetido ao foro da comarca de domicílio do
              usuário, conforme o Código de Defesa do Consumidor.
            </p>
          </section>
          <section>
            <h2 className="text-title-2 text-foreground mb-4">
              12. Contato
            </h2>
            <p className="text-body-md text-muted-foreground leading-relaxed">
              Dúvidas sobre estes termos? Fale conosco:{" "}
              <a
                href="mailto:contato@trianuncios.com.br"
                className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                contato@trianuncios.com.br
              </a>
            </p>
          </section>
        </div>
      </article>
    </Layout>
  )
}
