"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { SOCIAL_CLASS_OPTIONS } from "@/features/adCreationFlow/constants"

type Props = {
  initialValues?: string[] | null
  onComplete: (selected: string[]) => void
}

export const SocialClassStep = ({ initialValues, onComplete }: Props) => {
  const [selected, setSelected] = useState<string[]>(initialValues ?? [])

  const toggleOption = (value: string) => {
    setSelected((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete(selected)
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-title-2">
            Público-alvo por classe social
          </CardTitle>
          <CardDescription className="text-body-md mt-2">
            Selecione uma ou mais classes sociais que representam o público
            que você quer atingir. Os valores indicam a renda mensal estimada
            de cada classe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              {SOCIAL_CLASS_OPTIONS.map((option) => {
                const isSelected = selected.includes(option.value)
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleOption(option.value)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-colors cursor-pointer",
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-muted hover:border-muted-foreground/30"
                    )}
                  >
                    <span className="text-body-md font-semibold shrink-0">
                      {option.label}
                    </span>
                    <span className="text-body-sm text-muted-foreground">
                      {option.detail}
                    </span>
                  </button>
                )
              })}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={selected.length === 0}
            >
              Continuar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
