import type { ComponentData, Data } from "@measured/puck"

import { landingPageConfig, type LandingPageProps } from "./puck-config"

/**
 * Ready-made landing page templates (à la Unbounce), one per business
 * vertical. A template is just pre-filled Puck Data using the same blocks
 * as the editor — picking one creates a normal, fully editable page.
 *
 * Layouts modeled on Unbounce reference templates: hero with embedded
 * form + rounded photo (medical), product gallery with price + CTA
 * (ecommerce), form-in-card next to copy (B2B demo), testimonial trios.
 */

export type LandingPageTemplate = {
  key: string
  name: string
  description: string
  content: Data
}

let seq = 0

/** Builds a block with the config's defaultProps merged in, so templates
 *  only declare what differs and never miss a required prop. */
function block<K extends keyof LandingPageProps & string>(
  type: K,
  props: Partial<LandingPageProps[K]>,
): ComponentData {
  const defaults = (landingPageConfig.components[type]?.defaultProps ?? {}) as Record<
    string,
    unknown
  >
  seq += 1
  return {
    type,
    props: { ...defaults, ...props, id: `${type}-tpl-${seq}` },
  } as ComponentData
}

const page = (rootProps: Record<string, unknown>, content: ComponentData[]): Data =>
  ({ root: { props: rootProps }, content, zones: {} }) as Data

const CONTACT_FIELDS = [
  { label: "Nome", fieldType: "text", required: true },
  { label: "E-mail", fieldType: "email", required: true },
  { label: "Telefone", fieldType: "tel", required: true },
] as LandingPageProps["LeadForm"]["formFields"]

const img = (w: number, h: number, bg: string, fg: string, text: string) =>
  `https://placehold.co/${w}x${h}/${bg}/${fg}?text=${encodeURIComponent(text)}`

export const LANDING_PAGE_TEMPLATES: LandingPageTemplate[] = [
  /* ------------------------------------------------------------------ */
  /* Profissional / Clínica — ref: StarPractice (form no hero + foto)     */
  /* ------------------------------------------------------------------ */
  {
    key: "profissional",
    name: "Profissional & Clínica",
    description: "Agendamento com formulário em destaque e seções alternadas de foto e texto.",
    content: page(
      { backgroundColor: "#ffffff", textColor: "#1f2937", fontFamily: "serif" },
      [
        block("BrandHeader", {
          businessName: "Clínica Exemplo",
          backgroundColor: "#047857",
          textColor: "#ffffff",
        }),
        block("Columns", {
          ratio: "1fr 1fr",
          gap: 40,
          verticalAlign: "center",
          backgroundColor: "#d7f0e5",
          paddingY: 56,
          left: [
            block("Heading", {
              text: "Cuidado profissional, quando você precisar.",
              level: "h1",
              align: "left",
              paddingY: 0,
            }),
            block("Text", {
              content: "Ajudamos você a ter acesso ao atendimento que merece, sem espera.",
              paddingY: 8,
              textColor: "#374151",
            }),
            block("LeadForm", {
              title: "Agende sua avaliação",
              buttonLabel: "Agendar consulta",
              buttonColor: "#047857",
              successMessage: "Recebido! Nossa equipe confirma seu horário em breve.",
              formFields: CONTACT_FIELDS,
              paddingY: 8,
            }),
          ] as never,
          right: [
            block("Image", {
              url: img(460, 480, "047857", "ffffff", "Foto do atendimento"),
              alt: "Atendimento",
              borderRadius: 32,
              paddingY: 0,
            }),
          ] as never,
        }),
        block("Columns", {
          ratio: "1fr 1fr",
          gap: 40,
          verticalAlign: "center",
          backgroundColor: "#fdf3e3",
          paddingY: 56,
          left: [
            block("Image", {
              url: img(460, 380, "b45309", "ffffff", "Sua estrutura"),
              alt: "Estrutura",
              borderRadius: 32,
              paddingY: 0,
            }),
          ] as never,
          right: [
            block("Heading", {
              text: "Equipe qualificada com a melhor tecnologia.",
              level: "h2",
              align: "left",
              paddingY: 0,
            }),
            block("Text", {
              content:
                "Somos profissionais dedicados a oferecer a melhor experiência de atendimento, do primeiro contato ao acompanhamento.",
              paddingY: 8,
              textColor: "#374151",
            }),
            block("CallToAction", {
              label: "Agendar consulta",
              url: "#form",
              buttonColor: "#047857",
              align: "left",
              paddingY: 8,
            }),
          ] as never,
        }),
        block("Testimonials", {
          items: [
            { quote: "Atendimento impecável, me senti acolhida desde a primeira consulta.", name: "Fernanda L.", role: "Paciente", avatarUrl: "" },
            { quote: "Profissionais excelentes e pontuais. Recomendo.", name: "Marcos A.", role: "Paciente", avatarUrl: "" },
          ],
        }),
      ],
    ),
  },

  /* ------------------------------------------------------------------ */
  /* Produto / Promoção — ref: Rundown (galeria + preço) + headphones     */
  /* ------------------------------------------------------------------ */
  {
    key: "promocao",
    name: "Produto & Promoção",
    description: "Página de produto com galeria, preço com desconto, avaliações e cupom.",
    content: page(
      { backgroundColor: "#ffffff", textColor: "#111827", fontFamily: "system" },
      [
        block("Hero", {
          title: "SUA MARCA",
          subtitle: "Performance que se encontra com perfeição.",
          backgroundColor: "#111827",
          paddingY: 56,
          buttonLabel: "",
        }),
        block("Columns", {
          ratio: "1fr 1fr",
          gap: 40,
          verticalAlign: "start",
          paddingY: 48,
          left: [
            block("Image", {
              url: img(460, 300, "b91c1c", "ffffff", "Produto - frente"),
              alt: "Produto frente",
              borderRadius: 8,
              paddingY: 4,
            }),
            block("Image", {
              url: img(460, 300, "7f1d1d", "ffffff", "Produto - detalhe"),
              alt: "Produto detalhe",
              borderRadius: 8,
              paddingY: 4,
            }),
          ] as never,
          right: [
            block("Text", {
              content: "MAIS VENDIDO",
              fontSize: 12,
              textColor: "#b91c1c",
              paddingY: 0,
            }),
            block("Heading", {
              text: "Nome do seu produto",
              level: "h2",
              align: "left",
              paddingY: 4,
            }),
            block("Text", {
              content: "De R$ 89 por R$ 75 — oferta {{promo|de lançamento}}",
              fontSize: 20,
              paddingY: 4,
            }),
            block("Text", {
              content:
                "Descreva o produto: material, diferenciais e por que ele resolve o problema do cliente. Tecido respirável garante conforto o dia todo, com design flexível para total mobilidade.",
              paddingY: 4,
              textColor: "#4b5563",
            }),
            block("CallToAction", {
              label: "Quero o desconto",
              url: "#form",
              buttonColor: "#111827",
              align: "left",
              paddingY: 8,
            }),
          ] as never,
        }),
        block("Heading", { text: "Quem comprou, aprovou", level: "h2", paddingY: 24 }),
        block("Testimonials", {
          items: [
            { quote: "Qualidade acima do esperado, uso todos os dias.", name: "Lídia M.", role: "Cliente", avatarUrl: "" },
            { quote: "Chegou rápido e é ainda melhor pessoalmente.", name: "Sofia T.", role: "Cliente", avatarUrl: "" },
            { quote: "Já comprei duas vezes. Vale cada centavo.", name: "João L.", role: "Cliente", avatarUrl: "" },
          ],
        }),
        block("Columns", {
          ratio: "1fr 1fr",
          gap: 40,
          verticalAlign: "center",
          backgroundColor: "#dcdce8",
          paddingY: 48,
          left: [
            block("Image", {
              url: img(460, 340, "facc15", "111827", "Foto do produto"),
              alt: "Produto",
              borderRadius: 12,
              paddingY: 0,
            }),
          ] as never,
          right: [
            block("LeadForm", {
              title: "Receba seu cupom de desconto",
              buttonLabel: "Quero meu cupom",
              buttonColor: "#facc15",
              successMessage: "Cupom enviado! Confira seu e-mail.",
              formFields: [
                { label: "Nome", fieldType: "text", required: true },
                { label: "Telefone", fieldType: "tel", required: false },
                { label: "E-mail", fieldType: "email", required: true },
              ] as LandingPageProps["LeadForm"]["formFields"],
              paddingY: 0,
            }),
          ] as never,
        }),
      ],
    ),
  },

  /* ------------------------------------------------------------------ */
  /* Serviços Locais — ref: StarPractice em azul (form no hero)           */
  /* ------------------------------------------------------------------ */
  {
    key: "servicos",
    name: "Serviços Locais",
    description: "Orçamento em destaque no topo, garantias e foto do trabalho.",
    content: page(
      { backgroundColor: "#ffffff", textColor: "#111827", fontFamily: "system" },
      [
        block("BrandHeader", {
          businessName: "Sua Empresa de Serviços",
          backgroundColor: "#1e3a8a",
          textColor: "#ffffff",
        }),
        block("Columns", {
          ratio: "1fr 1fr",
          gap: 40,
          verticalAlign: "center",
          backgroundColor: "#dbeafe",
          paddingY: 56,
          left: [
            block("Heading", {
              text: "Orçamento grátis em menos de 1 hora.",
              level: "h1",
              align: "left",
              paddingY: 0,
            }),
            block("Text", {
              content: "Atendemos toda a região, com garantia de 90 dias por escrito.",
              paddingY: 8,
              textColor: "#1e3a8a",
            }),
            block("LeadForm", {
              title: "Peça seu orçamento",
              buttonLabel: "Pedir orçamento",
              buttonColor: "#1d4ed8",
              successMessage: "Recebemos! Entraremos em contato em até 1 hora útil.",
              formFields: [
                ...CONTACT_FIELDS,
                { label: "Descreva o serviço", fieldType: "textarea", required: false },
              ],
              paddingY: 8,
            }),
          ] as never,
          right: [
            block("Image", {
              url: img(460, 480, "1d4ed8", "ffffff", "Foto do seu trabalho"),
              alt: "Trabalho realizado",
              borderRadius: 32,
              paddingY: 0,
            }),
          ] as never,
        }),
        block("FeatureList", {
          items: [
            { icon: "🛠️", title: "Profissionais qualificados", description: "Equipe com anos de experiência." },
            { icon: "📋", title: "Orçamento sem compromisso", description: "Você só fecha se quiser." },
            { icon: "🛡️", title: "Garantia de 90 dias", description: "Serviço garantido por escrito." },
          ],
        }),
        block("Columns", {
          ratio: "1fr 1fr",
          gap: 40,
          verticalAlign: "center",
          backgroundColor: "#f8fafc",
          paddingY: 48,
          left: [
            block("Image", {
              url: img(460, 340, "334155", "ffffff", "Antes e depois"),
              alt: "Antes e depois",
              borderRadius: 16,
              paddingY: 0,
            }),
          ] as never,
          right: [
            block("Heading", {
              text: "Resolvemos no mesmo dia.",
              level: "h2",
              align: "left",
              paddingY: 0,
            }),
            block("Text", {
              content:
                "Atendimento de segunda a sábado, material incluso no orçamento e limpeza completa ao final do serviço.",
              paddingY: 8,
              textColor: "#475569",
            }),
            block("CallToAction", {
              label: "Falar com a equipe",
              url: "#form",
              buttonColor: "#1d4ed8",
              align: "left",
              paddingY: 8,
            }),
          ] as never,
        }),
        block("WhatsAppButton", { floating: true, label: "WhatsApp" }),
      ],
    ),
  },

  /* ------------------------------------------------------------------ */
  /* Restaurante — ref: capa de marca (Rundown) + colunas + avaliações    */
  /* ------------------------------------------------------------------ */
  {
    key: "restaurante",
    name: "Restaurante & Delivery",
    description: "Capa com a marca, prato em destaque, avaliações e pedido pelo WhatsApp.",
    content: page(
      { backgroundColor: "#fffbf5", textColor: "#3b2f2f", fontFamily: "system" },
      [
        block("Hero", {
          title: "SEU RESTAURANTE",
          subtitle: "A melhor comida da região, na sua casa.",
          backgroundColor: "#7f1d1d",
          paddingY: 64,
          buttonLabel: "Pedir agora",
          buttonUrl: "#form",
          buttonColor: "#f59e0b",
        }),
        block("Columns", {
          ratio: "1fr 1fr",
          gap: 40,
          verticalAlign: "center",
          paddingY: 48,
          left: [
            block("Image", {
              url: img(460, 360, "b91c1c", "ffffff", "Foto do carro-chefe"),
              alt: "Prato principal",
              borderRadius: 16,
              paddingY: 0,
            }),
          ] as never,
          right: [
            block("Heading", { text: "Feito na hora, do nosso fogão pra sua mesa.", level: "h2", align: "left", paddingY: 0 }),
            block("Text", {
              content:
                "Ingredientes frescos todos os dias e entrega em até 40 minutos. Peça pelo WhatsApp e acompanhe seu pedido em tempo real.",
              paddingY: 8,
              textColor: "#57534e",
            }),
            block("WhatsAppButton", {
              label: "Pedir pelo WhatsApp",
              message: "Olá! Quero fazer um pedido.",
              paddingY: 8,
            }),
          ] as never,
        }),
        block("FeatureList", {
          backgroundColor: "#fdf3e3",
          paddingY: 40,
          items: [
            { icon: "🍕", title: "Feito na hora", description: "Ingredientes frescos todos os dias." },
            { icon: "🛵", title: "Entrega rápida", description: "Até 40 minutos ou a próxima é grátis." },
            { icon: "⭐", title: "4,9 de avaliação", description: "Centenas de clientes satisfeitos." },
          ],
        }),
        block("Testimonials", {
          items: [
            { quote: "Melhor pizza que já pedi, chegou super rápido!", name: "Carla M.", role: "Cliente", avatarUrl: "" },
            { quote: "Peço toda semana, nunca decepciona.", name: "Rodrigo S.", role: "Cliente", avatarUrl: "" },
            { quote: "O combo da família virou tradição de sexta.", name: "Ana P.", role: "Cliente", avatarUrl: "" },
          ],
        }),
        block("LeadForm", {
          title: "Receba nossas promoções",
          buttonLabel: "Quero receber",
          buttonColor: "#b91c1c",
          successMessage: "Pronto! Você vai receber nossas ofertas.",
          formFields: CONTACT_FIELDS,
        }),
      ],
    ),
  },

  /* ------------------------------------------------------------------ */
  /* Demonstração / B2B — ref: página de demo (copy + form em card)       */
  /* ------------------------------------------------------------------ */
  {
    key: "evento",
    name: "Demonstração & B2B",
    description: "Agende uma demonstração: o que acontece depois do formulário, vídeo e prova social.",
    content: page(
      { backgroundColor: "#ffffff", textColor: "#111827", fontFamily: "system" },
      [
        block("BrandHeader", {
          businessName: "SUA EMPRESA",
          backgroundColor: "#ffffff",
          textColor: "#111827",
        }),
        block("Columns", {
          ratio: "1fr 1fr",
          gap: 48,
          verticalAlign: "start",
          paddingY: 48,
          left: [
            block("Text", {
              content: "AGENDE UMA DEMONSTRAÇÃO",
              fontSize: 12,
              textColor: "#2563eb",
              paddingY: 0,
            }),
            block("Heading", { text: "Veja na prática.", level: "h1", align: "left", paddingY: 4 }),
            block("Text", {
              content:
                "Agende um horário para ver nossa solução em ação.\n\nRespeitamos seu tempo — o que acontece depois do formulário:\n\n1. Um especialista entra em contato em até 24h\n2. Fazemos uma conversa introdutória de 30 minutos\n3. Montamos uma demonstração personalizada para o seu caso",
              paddingY: 4,
              textColor: "#374151",
            }),
          ] as never,
          right: [
            block("LeadForm", {
              title: "Agendar demonstração",
              buttonLabel: "Enviar",
              buttonColor: "#111827",
              successMessage: "Recebido! Um especialista fala com você em até 24h.",
              formFields: [
                { label: "Nome", fieldType: "text", required: true },
                { label: "E-mail corporativo", fieldType: "email", required: true },
                { label: "Empresa", fieldType: "text", required: false },
                { label: "Conte seu desafio", fieldType: "textarea", required: false },
              ] as LandingPageProps["LeadForm"]["formFields"],
              paddingY: 0,
            }),
          ] as never,
        }),
        block("Video", { url: "", backgroundColor: "#f8fafc", paddingY: 40 }),
        block("FeatureList", {
          items: [
            { icon: "🎯", title: "Demonstração sob medida", description: "Focada no seu caso de uso." },
            { icon: "⏱️", title: "Resposta em 24h", description: "Sem fila, sem enrolação." },
            { icon: "🤝", title: "Sem compromisso", description: "Você decide depois de ver funcionando." },
          ],
        }),
        block("Testimonials", {
          items: [
            { quote: "A demonstração mostrou exatamente o que precisávamos. Fechamos na semana seguinte.", name: "Lídia Marine", role: "Marketing", avatarUrl: "" },
            { quote: "Processo rápido e transparente do início ao fim.", name: "Sophia Thomas", role: "Design", avatarUrl: "" },
          ],
        }),
      ],
    ),
  },
]
