"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { lookupInviteCode } from "@/api/organization"
import { ApiError } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type FlowType = "new-org" | "existing-org"

export const RegisterForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated, isLoading: authLoading, signUp } = useAuth()

  const orgKeyFromUrl = searchParams.get("org_key") ?? ""
  const initialFlow: FlowType = orgKeyFromUrl ? "existing-org" : "new-org"

  const [flow, setFlow] = useState<FlowType>(initialFlow)
  const [organizationName, setOrganizationName] = useState("")
  const [inviteCode, setInviteCode] = useState(orgKeyFromUrl)
  const [resolvedOrgName, setResolvedOrgName] = useState<string | null>(null)
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [document, setDocument] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/")
    }
  }, [authLoading, isAuthenticated, router])

  const validateInviteCode = useCallback(async (code: string) => {
    if (!code.trim()) {
      setResolvedOrgName(null)
      setInviteError(null)
      return
    }

    try {
      const result = await lookupInviteCode(code.trim())
      setResolvedOrgName(result.organization.name)
      setInviteError(null)
    } catch {
      setResolvedOrgName(null)
      setInviteError("Código de convite inválido")
    }
  }, [])

  useEffect(() => {
    if (orgKeyFromUrl) {
      validateInviteCode(orgKeyFromUrl)
    }
  }, [orgKeyFromUrl, validateInviteCode])

  const handleInviteCodeBlur = () => {
    validateInviteCode(inviteCode)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== passwordConfirmation) {
      setError("As senhas não coincidem.")
      return
    }

    if (flow === "existing-org" && !inviteCode.trim()) {
      setError("Informe o código de convite.")
      return
    }

    setLoading(true)

    try {
      const payload =
        flow === "new-org"
          ? {
              name,
              email,
              document,
              password,
              password_confirmation: passwordConfirmation,
              organization_attributes: { name: organizationName },
            }
          : {
              name,
              email,
              document,
              password,
              password_confirmation: passwordConfirmation,
              invite_code: inviteCode.trim(),
            }

      await signUp(payload)
    } catch (err) {
      if (err instanceof ApiError) {
        const data = err.data as { errors?: string[] } | null
        setError(data?.errors?.join(", ") ?? "Erro ao criar conta.")
      } else {
        setError("Erro ao criar conta. Tente novamente.")
      }
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Criar conta</CardTitle>
          <CardDescription>
            {flow === "new-org"
              ? "Crie sua organização e comece a gerenciar seus anúncios"
              : "Entre para a organização e comece a colaborar"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex gap-2">
            <Button
              type="button"
              variant={flow === "new-org" ? "default" : "outline"}
              className="flex-1 rounded-full"
              onClick={() => setFlow("new-org")}
            >
              Nova organização
            </Button>
            <Button
              type="button"
              variant={flow === "existing-org" ? "default" : "outline"}
              className="flex-1 rounded-full"
              onClick={() => setFlow("existing-org")}
            >
              Tenho um convite
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {flow === "new-org" ? (
              <div className="flex flex-col gap-2">
                <label htmlFor="organizationName" className="text-body-sm">
                  Nome da organização
                </label>
                <Input
                  id="organizationName"
                  type="text"
                  placeholder="Minha Empresa"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  required
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <label htmlFor="inviteCode" className="text-body-sm">
                  Código de convite
                </label>
                <Input
                  id="inviteCode"
                  type="text"
                  placeholder="ABC12345"
                  value={inviteCode}
                  onChange={(e) => {
                    setInviteCode(e.target.value.toUpperCase())
                    setResolvedOrgName(null)
                    setInviteError(null)
                  }}
                  onBlur={handleInviteCodeBlur}
                  required
                />
                {resolvedOrgName && (
                  <p className="text-body-sm text-primary">
                    Organização: {resolvedOrgName}
                  </p>
                )}
                {inviteError && (
                  <p className="text-body-sm text-destructive">{inviteError}</p>
                )}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-body-sm">
                Seu nome
              </label>
              <Input
                id="name"
                type="text"
                placeholder="João Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-body-sm">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="document" className="text-body-sm">
                CPF / CNPJ
              </label>
              <Input
                id="document"
                type="text"
                placeholder="000.000.000-00"
                value={document}
                onChange={(e) => setDocument(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-body-sm">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="passwordConfirmation" className="text-body-sm">
                Confirmar senha
              </label>
              <Input
                id="passwordConfirmation"
                type="password"
                placeholder="••••••••"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            {error && (
              <p className="text-body-sm text-destructive">{error}</p>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Criando conta..." : "Criar conta"}
            </Button>

            <p className="text-center text-body-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Entrar
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
