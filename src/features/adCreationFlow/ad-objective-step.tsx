"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { OBJECTIVE_OPTIONS } from "@/features/adCreationFlow/constants"
import { CardOption } from "@/features/adCreationFlow/card-option"
import { StepHeader } from "@/features/adCreationFlow/step-header"

export type AdObjective = (typeof OBJECTIVE_OPTIONS)[number]["value"]

export type AdObjectiveData = {
  objective: AdObjective
  link: string
}

type Props = {
  initialValues?: AdObjectiveData | null
  onComplete: (data: AdObjectiveData) => void
  onLiveChange?: (link: string | null) => void
}

const formatPhone = (raw: string) => {
  const digits = raw.replace(/\D/g, "").slice(0, 11)
  if (digits.length <= 2) return digits
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

const phoneToDigits = (value: string) => value.replace(/\D/g, "")

export const AdObjectiveStep = ({ initialValues, onComplete, onLiveChange }: Props) => {
  const [selected, setSelected] = useState<AdObjective | null>(initialValues?.objective ?? null)
  const [link, setLink] = useState(initialValues?.link ?? "")
  const [phone, setPhone] = useState(() => {
    if (!initialValues?.link) return ""
    const match = initialValues.link.match(/wa\.me\/55(\d+)/)
    return match ? formatPhone(match[1]) : ""
  })

  const handleSelect = (value: AdObjective) => {
    if (value !== selected) {
      setSelected(value)
      setLink("")
      setPhone("")
    }
  }

  const isValid = () => {
    if (!selected) return false
    if (selected === "link_clicks") {
      try {
        new URL(link)
        return true
      } catch {
        return false
      }
    }
    return phoneToDigits(phone).length === 11
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setPhone(formatted)
    const digits = phoneToDigits(formatted)
    if (digits.length === 11) onLiveChange?.(`https://wa.me/55${digits}`)
  }

  const handleSubmit = () => {
    if (!selected) return
    const finalLink =
      selected === "lead_generation"
        ? `https://wa.me/55${phoneToDigits(phone)}`
        : link
    onComplete({ objective: selected, link: finalLink })
  }

  return (
    <div className="mx-auto w-full max-w-xl px-8 py-8">
      <StepHeader
        eyebrow="PASSO 5 · OBJETIVO"
        title="Qual é o objetivo do anúncio?"
        subtitle="Escolha o que você espera alcançar com esse anúncio."
      />
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          {OBJECTIVE_OPTIONS.map((opt) => {
            const Icon = opt.icon
            return (
              <div key={opt.value}>
                <CardOption
                  icon={<Icon className="h-5 w-5" />}
                  title={opt.label}
                  description={opt.description}
                  selected={selected === opt.value}
                  onClick={() => handleSelect(opt.value)}
                />
                {selected === opt.value && opt.value === "link_clicks" && (
                  <div className="mt-2 flex flex-col gap-2 pl-2">
                    <label htmlFor="site-link" className="text-base font-semibold text-primary">
                      Link do site
                    </label>
                    <Input
                      id="site-link"
                      type="url"
                      placeholder="https://www.seusite.com.br"
                      value={link}
                      onChange={(e) => { setLink(e.target.value); onLiveChange?.(e.target.value) }}
                      className={cn(
                        "rounded-md focus-visible:ring-0 focus-visible:shadow-[0_0_0_3px_var(--primary-soft)] focus-visible:border-primary"
                      )}
                    />
                  </div>
                )}
                {selected === opt.value && opt.value === "lead_generation" && (
                  <div className="mt-2 flex flex-col gap-2 pl-2">
                    <label htmlFor="whatsapp-phone" className="text-base font-semibold text-primary">
                      Número do WhatsApp
                    </label>
                    <Input
                      id="whatsapp-phone"
                      type="tel"
                      placeholder="(51) 99999-9999"
                      value={phone}
                      onChange={handlePhoneChange}
                      className="rounded-md focus-visible:ring-0 focus-visible:shadow-[0_0_0_3px_var(--primary-soft)] focus-visible:border-primary"
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <Button
          className="w-full rounded-full"
          disabled={!isValid()}
          onClick={handleSubmit}
        >
          Continuar
        </Button>
      </div>
    </div>
  )
}
