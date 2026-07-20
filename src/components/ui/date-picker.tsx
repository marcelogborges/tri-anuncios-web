"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import {
  formatDate,
  formatDateTime,
  formatTime,
  maskDate,
  maskDateTime,
  parseDateText,
  parseDateTimeText,
} from "@/lib/format"

type DatePickerProps = {
  value: Date | null
  onChange: (date: Date | null) => void
  /** Inclui hora (campo HH:mm no popover e na máscara de digitação) */
  withTime?: boolean
  minDate?: Date
  maxDate?: Date
  placeholder?: string
  disabled?: boolean
  className?: string
  id?: string
}

const DEFAULT_TIME = { hours: 12, minutes: 0 }

const mergeTime = (date: Date, source: Date | null) => {
  const merged = new Date(date)
  merged.setHours(
    source?.getHours() ?? DEFAULT_TIME.hours,
    source?.getMinutes() ?? DEFAULT_TIME.minutes,
    0,
    0
  )
  return merged
}

const DatePicker = ({
  value,
  onChange,
  withTime = false,
  minDate,
  maxDate,
  placeholder,
  disabled,
  className,
  id,
}: DatePickerProps) => {
  const [open, setOpen] = React.useState(false)
  const [text, setText] = React.useState(() =>
    value ? (withTime ? formatDateTime(value) : formatDate(value)) : ""
  )

  // Prop mudou por fora (reset do form, seleção no calendário): re-sincroniza o texto.
  const [lastValueMs, setLastValueMs] = React.useState<number | null>(
    value?.getTime() ?? null
  )
  const incomingMs = value?.getTime() ?? null
  if (incomingMs !== lastValueMs) {
    setLastValueMs(incomingMs)
    const synced = value ? (withTime ? formatDateTime(value) : formatDate(value)) : ""
    if (synced !== text) setText(synced)
  }

  const handleTextChange = (raw: string) => {
    const masked = withTime ? maskDateTime(raw) : maskDate(raw)
    setText(masked)
    const parsed = withTime ? parseDateTimeText(masked) : parseDateText(masked)
    setLastValueMs(parsed?.getTime() ?? null)
    onChange(parsed)
  }

  const handleSelect = (selected: Date | undefined) => {
    if (!selected) return
    const next = withTime ? mergeTime(selected, value) : selected
    onChange(next)
    if (!withTime) setOpen(false)
  }

  const handleTimeChange = (time: string) => {
    const match = time.match(/^(\d{2}):(\d{2})$/)
    if (!match || !value) return
    const next = new Date(value)
    next.setHours(Number(match[1]), Number(match[2]), 0, 0)
    onChange(next)
  }

  const disabledDays = [
    ...(minDate ? [{ before: minDate }] : []),
    ...(maxDate ? [{ after: maxDate }] : []),
  ]

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverAnchor asChild>
        <div className={cn("relative", className)}>
          <Input
            id={id}
            type="text"
            inputMode="numeric"
            placeholder={placeholder ?? (withTime ? "DD/MM/AAAA HH:mm" : "DD/MM/AAAA")}
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            disabled={disabled}
            className="pr-11"
          />
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label="Abrir calendário"
              disabled={disabled}
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50"
            >
              <CalendarIcon className="h-4 w-4" />
            </button>
          </PopoverTrigger>
        </div>
      </PopoverAnchor>
      <PopoverContent align="end" className="w-auto p-3">
        <Calendar
          mode="single"
          selected={value ?? undefined}
          defaultMonth={value ?? minDate ?? undefined}
          onSelect={handleSelect}
          disabled={disabledDays.length > 0 ? disabledDays : undefined}
        />
        {withTime && (
          <div className="mt-2 flex items-center justify-between gap-3 border-t border-border pt-3">
            <span className="text-body-sm text-muted-foreground">Horário</span>
            <Input
              type="time"
              value={value ? formatTime(value) : ""}
              onChange={(e) => handleTimeChange(e.target.value)}
              disabled={!value}
              className="h-9 w-auto"
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }
