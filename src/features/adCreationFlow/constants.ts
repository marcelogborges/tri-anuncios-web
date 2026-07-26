import { Globe, MessageCircle } from "lucide-react"

export const OBJECTIVE_OPTIONS = [
  {
    value: "link_clicks",
    label: "Cliques no Site",
    description: "Direcione as pessoas para o seu site ou página de vendas",
    icon: Globe,
  },
  // WhatsApp/CTWA está fora do escopo inicial: o back publica whatsapp_messages como
  // cliques no link (o anúncio leva ao wa.me como um link comum). Será expandido para
  // CONVERSATIONS + destination WHATSAPP quando a page tiver WhatsApp vinculado.
  {
    value: "whatsapp_messages",
    label: "Mensagens no WhatsApp",
    description: "Inicie conversas com clientes pelo WhatsApp",
    icon: MessageCircle,
  },
] as const

export const OBJECTIVE_LABELS: Record<string, string> = {
  ...Object.fromEntries(OBJECTIVE_OPTIONS.map((o) => [o.value, o.label])),
  landing_page_views: "Cliques no Site",
}

export const CALL_TO_ACTION_OPTIONS = [
  { value: "LEARN_MORE", label: "Saiba mais" },
  { value: "SHOP_NOW", label: "Comprar agora" },
  { value: "ORDER_NOW", label: "Pedir agora" },
  { value: "CONTACT_US", label: "Fale conosco" },
  { value: "BOOK_NOW", label: "Reservar" },
  { value: "SIGN_UP", label: "Cadastre-se" },
] as const

export type CallToAction = (typeof CALL_TO_ACTION_OPTIONS)[number]["value"]

export const CALL_TO_ACTION_LABELS: Record<string, string> = Object.fromEntries(
  CALL_TO_ACTION_OPTIONS.map((o) => [o.value, o.label])
)

export const DEFAULT_CALL_TO_ACTION: CallToAction = "LEARN_MORE"
export const WHATSAPP_CALL_TO_ACTION: CallToAction = "CONTACT_US"
