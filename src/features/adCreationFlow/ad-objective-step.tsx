"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { OBJECTIVE_OPTIONS } from "@/features/adCreationFlow/constants"

export type AdObjective = (typeof OBJECTIVE_OPTIONS)[number]["value"]

export type AdObjectiveData = {
  objective: AdObjective
  link: string
}

type Props = {
  initialValues?: AdObjectiveData | null
  onComplete: (data: AdObjectiveData) => void
}

const formatPhone = (raw: string) => {
  const digits = raw.replace(/\D/g, "").slice(0, 11)
  if (digits.length <= 2) return digits
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

const phoneToDigits = (value: string) => value.replace(/\D/g, "")

export const AdObjectiveStep = ({ initialValues, onComplete }: Props) => {
  const [selected, setSelected] = useState<AdObjective | null>(
    initialValues?.objective ?? null
  )
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

  const handleSubmit = () => {
    if (!selected) return
    const finalLink =
      selected === "lead_generation"
        ? `https://wa.me/55${phoneToDigits(phone)}`
        : link

    onComplete({ objective: selected, link: finalLink })
  }

  return (
    <Card className="mx-auto mt-6 w-full max-w-lg border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-heading">Objetivo do Anúncio</CardTitle>
        <CardDescription>
          Escolha o que você espera alcançar com esse anúncio
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {OBJECTIVE_OPTIONS.map((opt) => {
          const Icon = opt.icon
          const isSelected = selected === opt.value

          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt.value)}
              className={cn(
                "flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-colors",
                isSelected
                  ? "border-emerald-600 bg-emerald-50"
                  : "border-muted hover:border-emerald-300"
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  isSelected
                    ? "bg-emerald-600 text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-body font-medium">{opt.label}</p>
                <p className="text-body-sm text-muted-foreground">
                  {opt.description}
                </p>
              </div>
            </button>
          )
        })}

        {selected === "link_clicks" && (
          <div className="mt-2 flex flex-col gap-2">
            <label htmlFor="site-link" className="text-body-sm font-medium">Link do site</label>
            <Input
              id="site-link"
              type="url"
              placeholder="https://www.seusite.com.br"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>
        )}

        {selected === "lead_generation" && (
          <div className="mt-2 flex flex-col gap-2">
            <label htmlFor="whatsapp-phone" className="text-body-sm font-medium">Número do WhatsApp</label>
            <Input
              id="whatsapp-phone"
              type="tel"
              placeholder="(51) 99999-9999"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
            />
          </div>
        )}

        <Button
          className="mt-4 w-full"
          disabled={!isValid()}
          onClick={handleSubmit}
        >
          Continuar
        </Button>
      </CardContent>
    </Card>
  )
}
