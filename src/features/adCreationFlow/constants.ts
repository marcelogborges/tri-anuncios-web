import { Globe, MessageCircle } from "lucide-react"

export const SOCIAL_CLASS_OPTIONS = [
  { value: "class_a", label: "Classe A", detail: "R$ 20.000+" },
  { value: "class_b", label: "Classe B", detail: "R$ 8.000 – R$ 20.000" },
  { value: "class_c", label: "Classe C", detail: "R$ 3.000 – R$ 8.000" },
  { value: "class_d", label: "Classe D", detail: "Até R$ 3.000" },
] as const

export const GENDER_OPTIONS = [
  { value: "all", label: "Todos os públicos" },
  { value: "male", label: "Masculino" },
  { value: "female", label: "Feminino" },
] as const

export const OBJECTIVE_OPTIONS = [
  {
    value: "link_clicks",
    label: "Cliques no Site",
    description: "Direcione as pessoas para o seu site ou landing page",
    icon: Globe,
  },
  {
    value: "lead_generation",
    label: "Mensagens no WhatsApp",
    description: "Inicie conversas com clientes pelo WhatsApp",
    icon: MessageCircle,
  },
] as const

export const SOCIAL_CLASS_LABELS: Record<string, string> = Object.fromEntries(
  SOCIAL_CLASS_OPTIONS.map((o) => [o.value, o.label])
)

export const GENDER_LABELS: Record<string, string> = Object.fromEntries(
  GENDER_OPTIONS.map((o) => [o.value, o.label])
)

export const OBJECTIVE_LABELS: Record<string, string> = Object.fromEntries(
  OBJECTIVE_OPTIONS.map((o) => [o.value, o.label])
)
