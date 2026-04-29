"use client"

import { BarChart3, Megaphone, Sparkles, Users2 } from "lucide-react";

import { AuthGuard } from "@/lib/auth-guard";
import { Layout } from "@/components/layout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const channels = [
  {
    name: "Meta Ads",
    status: "Ativo",
    requests: "128 campanhas",
    cpa: "R$ 18,40",
  },
  {
    name: "Google Ads",
    status: "Monitorando",
    requests: "74 campanhas",
    cpa: "R$ 22,10",
  },
  {
    name: "TikTok Ads",
    status: "Piloto",
    requests: "19 campanhas",
    cpa: "R$ 15,90",
  },
];

const squads = [
  {
    initials: "MA",
    name: "Midia e Aquisicao",
    focus: "Publicacao e performance",
  },
  {
    initials: "CR",
    name: "Criativos",
    focus: "Pecas e variacoes",
  },
  {
    initials: "OP",
    name: "Operacao",
    focus: "Fluxo e aprovacoes",
  },
];

export default function Home() {
  return (
    <AuthGuard>
    <Layout>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 md:px-10">

        <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr]">
          <Card className="border-none bg-zinc-950 text-zinc-50 shadow-lg">
            <CardHeader>
              <CardDescription className="text-zinc-400">
                Fundacao
              </CardDescription>
              <CardTitle className="text-3xl">Stack de interface definida</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-1 size-5 text-emerald-300" />
                <p className="text-sm leading-6 text-zinc-300">
                  Componentes prontos com ownership local no codigo, sem ficar
                  preso a uma biblioteca opaca.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                    Base
                  </p>
                  <p className="mt-3 text-xl font-semibold">shadcn/ui</p>
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                    Framework
                  </p>
                  <p className="mt-3 text-xl font-semibold">Next.js 16</p>
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                    Estilo
                  </p>
                  <p className="mt-3 text-xl font-semibold">Tailwind CSS</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Operacao</CardDescription>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="size-4" />
                Publicacoes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">221</p>
              <p className="mt-2 text-sm text-muted-foreground">
                campanhas em acompanhamento na visao inicial do produto.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Insights</CardDescription>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="size-4" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">R$ 19,30</p>
              <p className="mt-2 text-sm text-muted-foreground">
                custo medio por aquisicao na leitura consolidada de canais.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.3fr_0.9fr]">
          <Card>
            <CardHeader>
              <CardDescription>Direcao inicial do produto</CardDescription>
              <CardTitle>Mapa da interface</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="modulos" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="modulos">Modulos</TabsTrigger>
                  <TabsTrigger value="dados">Dados</TabsTrigger>
                  <TabsTrigger value="fluxos">Fluxos</TabsTrigger>
                </TabsList>
                <TabsContent value="modulos" className="mt-6 space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card className="shadow-none">
                      <CardHeader>
                        <CardTitle className="text-lg">Anuncios</CardTitle>
                        <CardDescription>
                          criacao, listagem e controle de campanhas
                        </CardDescription>
                      </CardHeader>
                    </Card>
                    <Card className="shadow-none">
                      <CardHeader>
                        <CardTitle className="text-lg">Contas</CardTitle>
                        <CardDescription>
                          canais, credenciais e integracoes
                        </CardDescription>
                      </CardHeader>
                    </Card>
                    <Card className="shadow-none">
                      <CardHeader>
                        <CardTitle className="text-lg">Organizacoes</CardTitle>
                        <CardDescription>
                          clientes, equipes e acessos
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="dados" className="mt-6">
                  <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                    A base visual ja suporta tabelas, cards, formularios e
                    feedback states. Isso cobre bem a superficie esperada para
                    consumir a API do projeto `tri-anuncios-api`.
                  </p>
                </TabsContent>
                <TabsContent value="fluxos" className="mt-6">
                  <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                    O proximo passo natural e desenhar login, dashboard,
                    listagens, detalhes de campanha e fluxo de publicacao.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Times envolvidos</CardDescription>
              <CardTitle className="flex items-center gap-2">
                <Users2 className="size-4" />
                Frentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {squads.map((squad, index) => (
                <div key={squad.name}>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10">
                      <AvatarFallback>{squad.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{squad.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {squad.focus}
                      </p>
                    </div>
                  </div>
                  {index < squads.length - 1 ? <Separator className="mt-4" /> : null}
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardDescription>Canais priorizados</CardDescription>
            <CardTitle>Estado inicial da operacao</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Canal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead className="text-right">CPA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {channels.map((channel) => (
                  <TableRow key={channel.name}>
                    <TableCell className="font-medium">{channel.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{channel.status}</Badge>
                    </TableCell>
                    <TableCell>{channel.requests}</TableCell>
                    <TableCell className="text-right">{channel.cpa}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
    </AuthGuard>
  );
}
