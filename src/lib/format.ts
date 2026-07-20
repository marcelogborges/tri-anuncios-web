// Helpers genéricos de formatação/máscara (pt-BR). Reutilize daqui em vez de
// criar formatadores locais por feature.

// --- Datas e horas ---------------------------------------------------------

const asDate = (value: string | Date) =>
  value instanceof Date ? value : new Date(value)

const pad = (n: number) => String(n).padStart(2, "0")

/** "13/07/2026" */
export const formatDate = (value: string | Date) => {
  const d = asDate(value)
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
}

/** "13/07" */
export const formatDayMonth = (value: string | Date) => {
  const d = asDate(value)
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`
}

/** "14:30" */
export const formatTime = (value: string | Date) => {
  const d = asDate(value)
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** "13/07/2026 14:30" */
export const formatDateTime = (value: string | Date) =>
  `${formatDate(value)} ${formatTime(value)}`

/** "13/07 14:30" */
export const formatDayMonthTime = (value: string | Date) =>
  `${formatDayMonth(value)} ${formatTime(value)}`

/** "há 3 dias", "agora mesmo" */
export const timeAgo = (value: string | Date): string => {
  const diffMs = Date.now() - asDate(value).getTime()
  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 1) return "agora mesmo"
  if (minutes < 60) return `há ${minutes} minuto${minutes > 1 ? "s" : ""}`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `há ${hours} hora${hours > 1 ? "s" : ""}`
  const days = Math.floor(hours / 24)
  if (days < 30) return `há ${days} dia${days > 1 ? "s" : ""}`
  const months = Math.floor(days / 30)
  return `há ${months} ${months > 1 ? "meses" : "mês"}`
}

/** Date -> "2026-07-13" (dia local, formato de API) */
export const toIsoDateValue = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

/** "13/07/2026 14:30" -> Date local, ou null se inválida (rejeita 31/02 etc.) */
export const parseDateTimeText = (text: string): Date | null => {
  const match = text.match(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/)
  if (!match) return null
  const [, day, month, year, hours, minutes] = match.map(Number)
  const date = new Date(year, month - 1, day, hours, minutes)
  const valid =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    date.getHours() === hours &&
    date.getMinutes() === minutes
  return valid ? date : null
}

/** "13/07/2026" -> Date local à meia-noite, ou null se inválida */
export const parseDateText = (text: string): Date | null => {
  const match = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) return null
  const [, day, month, year] = match.map(Number)
  const date = new Date(year, month - 1, day)
  const valid =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  return valid ? date : null
}

// --- Máscaras de digitação (aplicar no onChange) ---------------------------

/** Dígitos -> "13/07/2026 14:30" conforme digita */
export const maskDateTime = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 12)
  let out = ""
  for (let i = 0; i < digits.length; i++) {
    if (i === 2 || i === 4) out += "/"
    if (i === 8) out += " "
    if (i === 10) out += ":"
    out += digits[i]
  }
  return out
}

/** Dígitos -> "13/07/2026" conforme digita */
export const maskDate = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 8)
  let out = ""
  for (let i = 0; i < digits.length; i++) {
    if (i === 2 || i === 4) out += "/"
    out += digits[i]
  }
  return out
}

/** Dígitos -> "123.456.789-09" conforme digita */
export const maskCpf = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11)
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
}

/** Dígitos -> "12.345.678/0001-90" conforme digita */
export const maskCnpj = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 14)
  return digits
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
    .replace(/(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, "$1.$2.$3/$4-$5")
}

/** CPF ou CNPJ conforme a quantidade de dígitos */
export const maskCpfCnpj = (value: string) => {
  const digits = value.replace(/\D/g, "")
  return digits.length > 11 ? maskCnpj(digits) : maskCpf(digits)
}

/** Dígitos -> "(11) 98765-4321" / "(11) 3456-7890" conforme digita */
export const maskPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11)
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2")
  }
  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
}

/** Dígitos -> "12345-678" conforme digita */
export const maskCep = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 8)
  return digits.replace(/(\d{5})(\d)/, "$1-$2")
}

// --- Moeda -----------------------------------------------------------------

/** Reais -> "R$ 199,00" */
export const formatCurrencyBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

/** Centavos -> "R$ 199,00" */
export const formatCurrencyFromCents = (cents: number) =>
  formatCurrencyBRL(cents / 100)
