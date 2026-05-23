"use client"

import { useEffect, useRef, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { getAuthorizeUrl } from "@/api/meta-oauth"

type Status = "idle" | "loading_url" | "waiting" | "error" | "success"

type MetaConnectModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConnected: () => void
}

export const MetaConnectModal = ({
  open,
  onOpenChange,
  onConnected,
}: MetaConnectModalProps) => {
  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const popupRef = useRef<Window | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cleanup = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    intervalRef.current = null
    timeoutRef.current = null
  }

  useEffect(() => {
    if (!open) {
      cleanup()
      setStatus("idle")
      setErrorMsg("")
    }
  }, [open])

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      if (event.data?.type === "meta-oauth-success") {
        cleanup()
        setStatus("success")
        setTimeout(() => {
          onConnected()
        }, 800)
      } else if (event.data?.type === "meta-oauth-error") {
        cleanup()
        setErrorMsg(event.data.message ?? "Erro ao conectar. Tente novamente.")
        setStatus("error")
      }
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [onConnected])

  const startOAuth = async () => {
    setStatus("loading_url")
    setErrorMsg("")
    try {
      const { url } = await getAuthorizeUrl()
      const popup = window.open(url, "meta-oauth", "width=600,height=700")
      if (!popup) {
        setErrorMsg("Popup bloqueado. Permita popups para este site e tente novamente.")
        setStatus("error")
        return
      }
      popupRef.current = popup
      setStatus("waiting")

      timeoutRef.current = setTimeout(() => {
        cleanup()
        if (popupRef.current && !popupRef.current.closed) {
          popupRef.current.close()
        }
        setErrorMsg("Tempo esgotado. Tente novamente.")
        setStatus("error")
      }, 300_000)

      intervalRef.current = setInterval(() => {
        if (popupRef.current?.closed) {
          cleanup()
          if (status !== "success") {
            setErrorMsg("Login cancelado. Tente novamente.")
            setStatus("error")
          }
        }
      }, 500)
    } catch {
      setErrorMsg("Erro ao iniciar autenticação. Tente novamente.")
      setStatus("error")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Conecte sua conta Meta</DialogTitle>
          <DialogDescription>
            Para publicar anúncios, precisamos de acesso à sua página do Facebook e conta do Instagram.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 space-y-4">
          {status === "success" && (
            <p className="text-sm text-green-600 font-medium">✓ Conta conectada com sucesso!</p>
          )}

          {status === "error" && (
            <p className="text-sm text-destructive">{errorMsg}</p>
          )}

          {status === "waiting" && (
            <p className="text-sm text-muted-foreground">
              Aguardando autenticação na janela aberta...
            </p>
          )}

          {(status === "idle" || status === "error") && (
            <Button
              className="w-full"
              onClick={startOAuth}
              disabled={false}
            >
              {status === "error" ? "Tentar novamente" : "Continuar com Facebook"}
            </Button>
          )}

          {status === "loading_url" && (
            <Button className="w-full" disabled>
              Carregando...
            </Button>
          )}

          {status === "waiting" && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                cleanup()
                popupRef.current?.close()
                onOpenChange(false)
              }}
            >
              Cancelar
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
