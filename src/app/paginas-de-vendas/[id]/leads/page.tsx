"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { AuthGuard } from "@/lib/auth-guard"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  getLandingPage,
  getLandingPageLeads,
  type LandingPage,
  type LandingPageLead,
} from "@/api/landing-pages"

const CAPI_BADGE: Record<LandingPageLead["capi_status"], { label: string; className: string }> = {
  pending: { label: "Pendente", className: "bg-muted text-muted-foreground" },
  sent: { label: "Enviado à Meta", className: "bg-primary-soft text-primary" },
  failed: { label: "Falhou", className: "bg-destructive/10 text-destructive" },
  skipped: { label: "Sem pixel", className: "bg-muted text-muted-foreground" },
}

function LeadsPage() {
  const params = useParams<{ id: string }>()
  const id = Number(params.id)

  const [page, setPage] = useState<LandingPage | null>(null)
  const [leads, setLeads] = useState<LandingPageLead[] | null>(null)

  useEffect(() => {
    getLandingPage(id).then(setPage)
    getLandingPageLeads(id).then(setLeads)
  }, [id])

  // Union of every field name across leads keeps the table stable even
  // when the form changed between submissions.
  const columns = useMemo(() => {
    if (!leads) return []
    const keys = new Set<string>()
    leads.forEach((lead) => Object.keys(lead.data).forEach((k) => keys.add(k)))
    return [...keys]
  }, [leads])

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2">
            <Link href="/paginas-de-vendas">
              <ArrowLeft className="mr-1 h-4 w-4" /> Minhas páginas
            </Link>
          </Button>
          <h1 className="text-title-1">Leads — {page?.name ?? "..."}</h1>
          <p className="text-body-md text-muted-foreground">
            Contatos recebidos pelo formulário da página. Eventos de conversão são enviados à Meta
            automaticamente quando a página tem um pixel configurado.
          </p>
        </div>
      </div>

      {leads === null ? (
        <Skeleton className="h-48" />
      ) : leads.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          Nenhum lead ainda. Divulgue a página nos seus anúncios!
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                {columns.map((col) => (
                  <TableHead key={col}>{col}</TableHead>
                ))}
                <TableHead>Origem</TableHead>
                <TableHead>Conversão Meta</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody data-testid="leads-table-body">
              {leads.map((lead) => {
                const badge = CAPI_BADGE[lead.capi_status]
                return (
                  <TableRow key={lead.id}>
                    <TableCell className="whitespace-nowrap">
                      {new Date(lead.created_at).toLocaleString("pt-BR")}
                    </TableCell>
                    {columns.map((col) => (
                      <TableCell key={col}>{lead.data[col] ?? "—"}</TableCell>
                    ))}
                    <TableCell className="text-muted-foreground">
                      {lead.tracking?.utm_source ?? (lead.tracking?.fbclid ? "facebook" : "direto")}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

export default function Page() {
  return (
    <AuthGuard>
      <Layout>
        <LeadsPage />
      </Layout>
    </AuthGuard>
  )
}
