"use client"

import { useState } from "react"
import { ExternalLink, LayoutTemplate } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { OBJECTIVE_OPTIONS } from "@/features/adCreationFlow/constants"
import { CardOption } from "@/features/adCreationFlow/card-option"
import { StepHeader } from "@/features/adCreationFlow/step-header"
import { LandingPagePickerDialog } from "@/features/landingPages/landing-page-picker-dialog"
import { TemplatePickerDialog } from "@/features/landingPages/template-picker-dialog"
import type { LandingPage } from "@/api/landing-pages"
import type { LandingPageTemplate } from "@/features/landingPages/templates"

export type AdObjective = (typeof OBJECTIVE_OPTIONS)[number]["value"]

export type AdLandingPageRef = {
  id: number
  name: string
  status: LandingPage["status"]
  public_url: string
}

export type AdObjectiveData = {
  objective: AdObjective
  link: string
  landingPage?: AdLandingPageRef | null
}

type Destination = "site" | "landing_page"

type Props = {
  initialValues?: AdObjectiveData | null
  onComplete: (data: AdObjectiveData) => void
  onLiveChange?: (link: string | null) => void
  onCreateLandingPage?: (name: string, template: LandingPageTemplate, slug: string) => Promise<void>
  onEditLandingPage?: (id: number) => void
  orgSlug?: string
}

const formatPhone = (raw: string) => {
  const digits = raw.replace(/\D/g, "").slice(0, 11)
  if (digits.length <= 2) return digits
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

const phoneToDigits = (value: string) => value.replace(/\D/g, "")

export const AdObjectiveStep = ({
  initialValues,
  onComplete,
  onLiveChange,
  onCreateLandingPage,
  onEditLandingPage,
  orgSlug,
}: Props) => {
  const [selected, setSelected] = useState<AdObjective | null>(initialValues?.objective ?? null)
  const [link, setLink] = useState(initialValues?.landingPage ? "" : (initialValues?.link ?? ""))
  const [destination, setDestination] = useState<Destination>(
    initialValues?.landingPage ? "landing_page" : "site"
  )
  const [landingPage, setLandingPage] = useState<AdLandingPageRef | null>(
    initialValues?.landingPage ?? null
  )
  const [pickerOpen, setPickerOpen] = useState(false)
  const [templateOpen, setTemplateOpen] = useState(false)
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

  const handleDestinationChange = (next: Destination) => {
    setDestination(next)
    onLiveChange?.(next === "landing_page" ? (landingPage?.public_url ?? null) : (link || null))
  }

  const handleLandingPageSelect = (page: LandingPage) => {
    const ref: AdLandingPageRef = {
      id: page.id,
      name: page.name,
      status: page.status,
      public_url: page.public_url,
    }
    setLandingPage(ref)
    setPickerOpen(false)
    onLiveChange?.(page.public_url)
  }

  const isValid = () => {
    if (!selected) return false
    if (selected === "link_clicks") {
      if (destination === "landing_page") return landingPage !== null
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
    if (selected === "link_clicks" && destination === "landing_page" && landingPage) {
      onComplete({ objective: selected, link: landingPage.public_url, landingPage })
      return
    }
    const finalLink =
      selected === "lead_generation"
        ? `https://wa.me/55${phoneToDigits(phone)}`
        : link
    onComplete({ objective: selected, link: finalLink, landingPage: null })
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
                  <div className="mt-2 flex flex-col gap-3 pl-2">
                    <div className="flex gap-1 rounded-full bg-muted p-1">
                      <button
                        type="button"
                        onClick={() => handleDestinationChange("site")}
                        className={cn(
                          "flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                          destination === "site"
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Meu site
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDestinationChange("landing_page")}
                        className={cn(
                          "flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                          destination === "landing_page"
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                        data-testid="destination-landing-page"
                      >
                        <LayoutTemplate className="h-3.5 w-3.5" />
                        Landing page
                      </button>
                    </div>

                    {destination === "site" && (
                      <div className="flex flex-col gap-2">
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

                    {destination === "landing_page" && (
                      landingPage ? (
                        <div className="rounded-lg border-2 border-primary bg-[var(--primary-soft)] p-4" data-testid="selected-landing-page">
                          <div className="flex items-center gap-3">
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-body-sm font-semibold text-foreground">{landingPage.name}</p>
                              <p className="mt-0.5 truncate text-label-caps text-muted-foreground">{landingPage.public_url}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setPickerOpen(true)}
                              className="shrink-0 text-sm font-semibold text-primary hover:underline"
                            >
                              Trocar
                            </button>
                          </div>
                          {landingPage.status !== "published" && (
                            <p className="mt-3 rounded-md bg-card px-3 py-2 text-xs text-muted-foreground">
                              Essa página ainda é um rascunho.{" "}
                              {onEditLandingPage ? (
                                <button
                                  type="button"
                                  onClick={() => onEditLandingPage(landingPage.id)}
                                  className="font-semibold text-primary hover:underline"
                                >
                                  Edite e publique
                                </button>
                              ) : (
                                "Publique"
                              )}{" "}
                              antes do anúncio ir ao ar.
                            </p>
                          )}
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          className="rounded-full"
                          onClick={() => setPickerOpen(true)}
                          data-testid="open-landing-page-picker"
                        >
                          <LayoutTemplate className="mr-1 h-4 w-4" />
                          Escolher ou criar landing page
                        </Button>
                      )
                    )}
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

      <LandingPagePickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={handleLandingPageSelect}
        onCreateNew={() => {
          setPickerOpen(false)
          setTemplateOpen(true)
        }}
      />
      {onCreateLandingPage && (
        <TemplatePickerDialog
          open={templateOpen}
          onOpenChange={setTemplateOpen}
          onCreate={onCreateLandingPage}
          orgSlug={orgSlug}
        />
      )}
    </div>
  )
}
