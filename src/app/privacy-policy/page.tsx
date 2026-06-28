import type { Metadata } from "next"
import { Layout } from "@/components/layout"

export const metadata: Metadata = {
  title: "Política de Privacidade — Tri Anúncios",
  description:
    "Como o Tri Anúncios coleta, usa e protege seus dados pessoais e os dados das suas contas Meta.",
}

const usos = [
  "Criar e publicar anúncios no Facebook e Instagram em seu nome, via API do Meta.",
  "Exibir o desempenho das suas campanhas dentro da plataforma.",
  "Enviar comunicações transacionais relacionadas ao serviço (confirmações, alertas de erro).",
  "Manter a segurança da conta e prevenir uso indevido.",
  "Cumprir obrigações legais aplicáveis à nossa operação no Brasil.",
]

const direitos = [
  "Confirmar a existência de tratamento dos seus dados.",
  "Acessar os dados que mantemos sobre você.",
  "Corrigir dados incompletos ou desatualizados.",
  "Solicitar a exclusão dos seus dados (ver seção 7).",
  "Revogar o consentimento a qualquer momento.",
]

export default function PrivacyPolicyPage() {
  return (
    <Layout>
      <article className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-24">
        <header className="mb-14">
          <p className="text-label-caps text-muted-foreground mb-3 uppercase tracking-widest">
            Última atualização: 28 de junho de 2026
          </p>
          <h1 className="text-title-1 text-foreground">
            Política de Privacidade
          </h1>
          <p className="text-body-lg text-muted-foreground mt-4 max-w-prose">
            Esta política explica quais dados coletamos, como os usamos e
            quais direitos você tem sobre eles. Leitura estimada: 4 minutos.
          </p>
        </header>
        <div className="space-y-12">
          <section>
            <h2 className="text-title-2 text-foreground mb-4">
              1. Quem somos
            </h2>
            <p className="text-body-md text-muted-foreground leading-relaxed">
              O Tri Anúncios é uma plataforma brasileira que simplifica a
              criação e gestão de anúncios pagos no Meta (Facebook e Instagram)
              para pequenas empresas. Nesta política, "nós", "nosso" e
              "Tri Anúncios" referem-se ao serviço e seus operadores.
            </p>
          </section>
          <section>
            <h2 className="text-title-2 text-foreground mb-4">
              2. Dados que coletamos
            </h2>
            <div className="space-y-6 text-body-md text-muted-foreground leading-relaxed">
              <div>
                <h3 className="text-body-sm text-foreground mb-2">
                  Dados de cadastro
                </h3>
                <p>
                  Nome, endereço de e-mail e senha (armazenada com hash
                  seguro) fornecidos no momento do registro.
                </p>
              </div>
              <div>
                <h3 className="text-body-sm text-foreground mb-2">
                  Dados da conta Meta (Facebook e Instagram)
                </h3>
                <p>
                  Quando você conecta sua conta Meta ao Tri Anúncios via
                  Login do Facebook, recebemos: nome da Página do Facebook,
                  ID da conta de anúncios, ID da conta comercial do Instagram
                  vinculada, e o token de acesso necessário para publicar
                  anúncios em seu nome. Não armazenamos sua senha do Facebook
                  ou Instagram.
                </p>
              </div>
              <div>
                <h3 className="text-body-sm text-foreground mb-2">
                  Dados de campanhas
                </h3>
                <p>
                  Conteúdo criativo dos anúncios (texto, imagens, objetivos,
                  segmentação geográfica) que você cria dentro da plataforma,
                  bem como os resultados de desempenho retornados pela API do
                  Meta.
                </p>
              </div>
              <div>
                <h3 className="text-body-sm text-foreground mb-2">
                  Dados técnicos
                </h3>
                <p>
                  Logs de acesso, endereço IP e informações de dispositivo
                  coletados automaticamente para fins de segurança e
                  diagnóstico de erros.
                </p>
              </div>
            </div>
          </section>
          <section>
            <h2 className="text-title-2 text-foreground mb-4">
              3. Como usamos seus dados
            </h2>
            <ul className="space-y-3 text-body-md text-muted-foreground leading-relaxed list-none">
              {usos.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-body-md text-muted-foreground leading-relaxed">
              Não vendemos, alugamos nem compartilhamos seus dados com
              terceiros para fins de marketing.
            </p>
          </section>
          <section>
            <h2 className="text-title-2 text-foreground mb-4">
              4. Compartilhamento com terceiros
            </h2>
            <p className="text-body-md text-muted-foreground leading-relaxed">
              Seus dados são transmitidos à Meta Platforms, Inc. exclusivamente
              para executar as funções do serviço (publicação e monitoramento
              de anúncios). Esse compartilhamento é regido pela{" "}
              <a
                href="https://www.facebook.com/privacy/policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                Política de Privacidade do Meta
              </a>
              . Podemos ainda compartilhar dados quando exigido por lei ou
              ordem judicial.
            </p>
          </section>
          <section>
            <h2 className="text-title-2 text-foreground mb-4">
              5. Retenção de dados
            </h2>
            <p className="text-body-md text-muted-foreground leading-relaxed">
              Mantemos seus dados enquanto sua conta estiver ativa. Após a
              exclusão da conta, removemos seus dados pessoais em até 30 dias,
              exceto onde a retenção for exigida por lei (prazo máximo de 5
              anos para fins fiscais, conforme legislação brasileira).
            </p>
          </section>
          <section>
            <h2 className="text-title-2 text-foreground mb-4">
              6. Seus direitos
            </h2>
            <p className="text-body-md text-muted-foreground leading-relaxed mb-4">
              Nos termos da Lei Geral de Proteção de Dados (LGPD — Lei
              13.709/2018), você tem direito a:
            </p>
            <ul className="space-y-3 text-body-md text-muted-foreground leading-relaxed list-none">
              {direitos.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-title-2 text-foreground mb-4">
              7. Exclusão de dados
            </h2>
            <p className="text-body-md text-muted-foreground leading-relaxed">
              Para solicitar a exclusão dos seus dados, envie um e-mail para{" "}
              <a
                href="mailto:privacidade@trianuncios.com.br"
                className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                privacidade@trianuncios.com.br
              </a>{" "}
              com o assunto "Exclusão de dados". Atenderemos em até 15 dias
              úteis. Você também pode solicitar a exclusão diretamente pela
              plataforma do Meta, que nos notificará automaticamente via nosso
              callback de exclusão de dados.
            </p>
          </section>
          <section>
            <h2 className="text-title-2 text-foreground mb-4">
              8. Segurança
            </h2>
            <p className="text-body-md text-muted-foreground leading-relaxed">
              Utilizamos criptografia em trânsito (TLS) e em repouso para
              dados sensíveis. Tokens de acesso do Meta são armazenados de
              forma criptografada e nunca expostos em logs ou interfaces de
              usuário. Realizamos revisões periódicas de segurança.
            </p>
          </section>
          <section>
            <h2 className="text-title-2 text-foreground mb-4">
              9. Contato
            </h2>
            <p className="text-body-md text-muted-foreground leading-relaxed">
              Dúvidas sobre esta política? Entre em contato:{" "}
              <a
                href="mailto:privacidade@trianuncios.com.br"
                className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                privacidade@trianuncios.com.br
              </a>
            </p>
          </section>
        </div>
      </article>
    </Layout>
  )
}
