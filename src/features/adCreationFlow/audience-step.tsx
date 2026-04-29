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
import { GENDER_OPTIONS } from "@/features/adCreationFlow/constants"

export type AudienceDemographics = {
  targetGender: string
  targetAgeMin: number
  targetAgeMax: number
}

type Props = {
  initialValues?: AudienceDemographics | null
  onComplete: (data: AudienceDemographics) => void
}

export const AudienceStep = ({ initialValues, onComplete }: Props) => {
  const [targetGender, setTargetGender] = useState(initialValues?.targetGender ?? "all")
  const [targetAgeMin, setTargetAgeMin] = useState(initialValues?.targetAgeMin ?? 18)
  const [targetAgeMax, setTargetAgeMax] = useState(initialValues?.targetAgeMax ?? 65)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete({ targetGender, targetAgeMin, targetAgeMax })
  }

  const isAgeValid = targetAgeMin >= 13 && targetAgeMax >= 13 && targetAgeMax >= targetAgeMin

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-title-2">
            Público-alvo
          </CardTitle>
          <CardDescription className="text-body-md mt-2">
            Defina o gênero e a faixa etária do público que você quer alcançar
            com este anúncio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-body-sm">Gênero do público</label>
              <div className="flex flex-wrap gap-2">
                {GENDER_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTargetGender(option.value)}
                    className={cn(
                      "rounded-full border px-4 py-1.5 text-center text-body-sm whitespace-nowrap transition-colors cursor-pointer",
                      targetGender === option.value
                        ? "border-primary bg-primary/10"
                        : "border-muted hover:border-muted-foreground/30"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-body-sm">Faixa etária</label>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label htmlFor="ageMin" className="text-body-sm text-muted-foreground">
                    Idade mínima
                  </label>
                  <Input
                    id="ageMin"
                    type="number"
                    min={13}
                    max={65}
                    value={targetAgeMin}
                    onChange={(e) => setTargetAgeMin(Number(e.target.value))}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="ageMax" className="text-body-sm text-muted-foreground">
                    Idade máxima
                  </label>
                  <Input
                    id="ageMax"
                    type="number"
                    min={13}
                    max={65}
                    value={targetAgeMax}
                    onChange={(e) => setTargetAgeMax(Number(e.target.value))}
                    required
                  />
                </div>
              </div>
              {!isAgeValid && (
                <p className="text-body-sm text-destructive">
                  A idade mínima deve ser entre 13 e 65 e não pode ser maior que a máxima.
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={!isAgeValid}>
              Continuar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
