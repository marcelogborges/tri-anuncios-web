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

export type AdBasicInfo = {
  name: string
  productService: string
}

type Props = {
  initialValues?: AdBasicInfo | null
  onComplete: (data: AdBasicInfo) => void
}

export const AdBasicInfoStep = ({ initialValues, onComplete }: Props) => {
  const [name, setName] = useState(initialValues?.name ?? "")
  const [productService, setProductService] = useState(initialValues?.productService ?? "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete({ name, productService })
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-title-2">
            Sobre o seu anúncio
          </CardTitle>
          <CardDescription className="text-body-md mt-2">
            Dê um nome para identificar este anúncio e nos conte o que você
            quer divulgar. Isso nos ajuda a montar a melhor campanha para você.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="adName" className="text-body-sm">
                Título do anúncio
              </label>
              <Input
                id="adName"
                type="text"
                placeholder="Ex: Promoção de Inverno, Lançamento Nova Coleção"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="productService" className="text-body-sm">
                Produto ou serviço anunciado
              </label>
              <Input
                id="productService"
                type="text"
                placeholder="Ex: Hambúrguer artesanal, Procedimentos de estética, Consultoria"
                value={productService}
                onChange={(e) => setProductService(e.target.value)}
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
