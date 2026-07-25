"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, ExternalLink, Settings } from "lucide-react"
import { createUsePuck, Puck, type Data } from "@measured/puck"
import "@measured/puck/puck.css"

import { AuthGuard } from "@/lib/auth-guard"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { injectAdFlowLandingPage } from "@/features/adCreationFlow/use-ad-creation-flow"
import { landingPageEditorConfig } from "@/features/landingPages/puck-config"
import { PageSettingsDialog } from "@/features/landingPages/page-settings-dialog"
import {
  getLandingPage,
  publishLandingPage,
  updateLandingPage,
  type LandingPage,
} from "@/api/landing-pages"

type SaveState = "saved" | "saving" | "dirty" | "error"

const usePuck = createUsePuck()

// Selecting a section (outline or preview) opens its fields in a modal;
// closing the modal deselects it, so editing is an explicit open -> edit -> close.
const FieldsDialog = () => {
  const selectedItem = usePuck((s) => s.selectedItem)
  const dispatch = usePuck((s) => s.dispatch)

  const label = selectedItem
    ? (landingPageEditorConfig.components[selectedItem.type as keyof typeof landingPageEditorConfig.components]?.label ?? String(selectedItem.type))
    : ""

  return (
    <Dialog
      open={!!selectedItem}
      onOpenChange={(open) => {
        if (!open) dispatch({ type: "setUi", ui: { itemSelector: null } })
      }}
    >
      <DialogContent className="max-h-[85vh] w-[calc(100vw-2rem)] max-w-md overflow-y-auto" data-testid="content-fields">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
        </DialogHeader>
        <Puck.Fields />
      </DialogContent>
    </Dialog>
  )
}

function LandingPageEditor() {
  const params = useParams<{ id: string }>()
  const id = Number(params.id)
  const router = useRouter()

  const [page, setPage] = useState<LandingPage | null>(null)
  // Entered from the ad creation flow: back/publish return to the ad, at the
  // step passed via ?step= (so the user lands exactly where they left off).
  const [fromAdCreation, setFromAdCreation] = useState(false)
  const [adReturnStep, setAdReturnStep] = useState<number | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setFromAdCreation(params.get("from") === "criar-anuncio")
    const step = Number(params.get("step"))
    setAdReturnStep(Number.isInteger(step) && step > 0 ? step : null)
  }, [])

  const adReturnUrl = (extra?: string) => {
    const query = [extra, adReturnStep ? `step=${adReturnStep}` : null].filter(Boolean).join("&")
    return `/anuncios/criar${query ? `?${query}` : ""}`
  }
  const [saveState, setSaveState] = useState<SaveState>("saved")
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [publishing, setPublishing] = useState(false)

  const latestData = useRef<Data | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const loadPage = async () => {
      setPage(await getLandingPage(id))
    }
    loadPage()
  }, [id])

  useEffect(
    () => () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    },
    []
  )

  const persist = useCallback(async () => {
    if (!latestData.current) return
    setSaveState("saving")
    try {
      await updateLandingPage(id, { content: latestData.current })
      setSaveState("saved")
    } catch {
      setSaveState("error")
    }
  }, [id])

  // Debounced autosave: every change schedules a save 1.5s later.
  const handleChange = useCallback(
    (data: Data) => {
      // Puck calls onChange on mount too; skip until page is loaded
      if (!page) return
      latestData.current = data
      setSaveState("dirty")
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(persist, 1500)
    },
    [page, persist],
  )

  const handlePublish = useCallback(async () => {
    const data = latestData.current ?? page?.content
    if (!data) return
    setPublishing(true)
    try {
      if (saveTimer.current) clearTimeout(saveTimer.current)
      await updateLandingPage(id, { content: data })
      const updated = await publishLandingPage(id)
      setPage(updated)
      setSaveState("saved")
      if (fromAdCreation) {
        injectAdFlowLandingPage(updated)
        router.push(adReturnUrl())
      } else {
        window.open(updated.public_url, "_blank")
      }
    } finally {
      setPublishing(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, page, fromAdCreation, adReturnStep, router])

  if (!page) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        Carregando editor...
      </div>
    )
  }

  const saveLabel: Record<SaveState, string> = {
    saved: "Salvo",
    saving: "Salvando...",
    dirty: "Alterações pendentes",
    error: "Erro ao salvar — tentando de novo na próxima alteração",
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-12 shrink-0 items-center gap-3 max-lg:gap-1.5 border-b bg-card px-4 max-lg:px-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={fromAdCreation ? adReturnUrl() : "/paginas-de-vendas"}>
            <ArrowLeft className="h-4 w-4 lg:mr-1" />
            <span className="max-lg:hidden">{fromAdCreation ? "Voltar ao anúncio" : "Minhas páginas"}</span>
          </Link>
        </Button>
        <div className="flex min-w-0 flex-1 items-baseline gap-3">
          <span className="truncate font-semibold">{page.name}</span>
          <span className="max-lg:hidden shrink-0 text-xs text-muted-foreground" data-testid="save-state">
            {saveLabel[saveState]}
          </span>
        </div>
        {page.status === "published" && (
          <Button variant="ghost" size="sm" asChild>
            <a href={page.public_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 lg:mr-1" />
              <span className="max-lg:hidden">Ver publicada</span>
            </a>
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSettingsOpen(true)}
          data-testid="open-settings"
        >
          <Settings className="h-4 w-4 lg:mr-1" />
          <span className="max-lg:hidden">Configurações</span>
        </Button>
        <Button
          size="sm"
          onClick={handlePublish}
          disabled={publishing}
          data-testid="publish-page"
        >
          {publishing ? "Publicando..." : fromAdCreation ? "Publicar e voltar" : "Publicar"}
        </Button>
      </header>

      <div className="min-h-0 flex-1">
        <Puck
          config={landingPageEditorConfig}
          data={page.content}
          onChange={handleChange}
          permissions={{ drag: false, insert: false, delete: false, duplicate: false }}
        >
          <FieldsDialog />
          <main className="h-[calc(100vh-3rem)] min-w-0 overflow-auto">
            <Puck.Preview />
          </main>
        </Puck>
      </div>

      <PageSettingsDialog
        key={`${page.id}-${settingsOpen}`}
        page={page}
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        onSaved={setPage}
      />
    </div>
  )
}

export default function Page() {
  return (
    <AuthGuard>
      <LandingPageEditor />
    </AuthGuard>
  )
}
