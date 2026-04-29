"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type Props = {
  initialValue?: string | null
  onComplete: (message: string) => void
}

export const AdMessageStep = ({ initialValue, onComplete }: Props) => {
  const [message, setMessage] = useState(initialValue ?? "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete(message)
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-title-2">
            Texto do anúncio
          </CardTitle>
          <CardDescription className="text-body-md mt-2">
            Escreva o texto principal que aparecerá no seu anúncio.
            Seja direto, destaque o benefício e inclua uma chamada para ação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="adMessage" className="text-body-sm">
                Mensagem principal
              </label>
              <Textarea
                id="adMessage"
                placeholder="Ex: Vista seu estilo! Camisetas, bonés e moletons com frete grátis para todo o Brasil. Aproveite a promoção de inverno."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Continuar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
