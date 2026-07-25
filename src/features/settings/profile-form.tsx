"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { updateUser } from "@/api/user"
import type { UpdateUserPayload } from "@/api/user"
import { ApiError } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const ProfileForm = () => {
  const { user } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!user) {
      return
    }

    if (password && password !== passwordConfirmation) {
      setError("As senhas não coincidem.")
      return
    }

    setLoading(true)

    try {
      const payload: UpdateUserPayload = { name, email }

      if (password) {
        payload.password = password
        payload.password_confirmation = passwordConfirmation
      }

      await updateUser(user.id, payload)
      setPassword("")
      setPasswordConfirmation("")
      setSuccess(true)
    } catch (err) {
      if (err instanceof ApiError) {
        const data = err.data as { errors?: string[] } | null
        setError(data?.errors?.join(", ") ?? "Erro ao salvar seus dados.")
      } else {
        setError("Erro ao salvar seus dados. Tente novamente.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-xl rounded-xl shadow-ambient">
      <CardHeader>
        <CardTitle className="text-base">Seus dados</CardTitle>
        <CardDescription>Nome, e-mail e senha de acesso.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="profileName" className="text-body-sm">
              Nome
            </label>
            <Input
              id="profileName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="profileEmail" className="text-body-sm">
              Email
            </label>
            <Input
              id="profileEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="profilePassword" className="text-body-sm">
                Nova senha
              </label>
              <Input
                id="profilePassword"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              <p className="text-xs text-muted-foreground">
                Deixe em branco para manter a atual.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="profilePasswordConfirmation" className="text-body-sm">
                Confirmar nova senha
              </label>
              <Input
                id="profilePasswordConfirmation"
                type="password"
                placeholder="••••••••"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                autoComplete="new-password"
              />
            </div>
          </div>
          {error && <p className="text-body-sm text-destructive">{error}</p>}
          {success && <p className="text-body-sm text-primary">Dados atualizados com sucesso.</p>}
          <Button type="submit" disabled={loading} className="self-start rounded-full px-6">
            {loading ? "Salvando..." : "Salvar alterações"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
