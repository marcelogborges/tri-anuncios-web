"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { ptBR } from "react-day-picker/locale"

import { cn } from "@/lib/utils"

type CalendarProps = React.ComponentProps<typeof DayPicker>

const Calendar = ({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) => {
  return (
    <DayPicker
      locale={ptBR}
      showOutsideDays={showOutsideDays}
      className={cn("select-none", className)}
      classNames={{
        months: "relative flex flex-col gap-4 sm:flex-row",
        month: "w-full space-y-3",
        month_caption: "mx-10 flex h-9 items-center justify-center",
        caption_label: "text-sm font-semibold capitalize",
        nav: "absolute inset-x-0 top-0 flex h-9 items-center justify-between",
        button_previous:
          "inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-40",
        button_next:
          "inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-40",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "size-9 text-label-caps uppercase text-muted-foreground flex items-center justify-center",
        week: "mt-1 flex w-full",
        day: "size-9 p-0 text-center text-sm",
        day_button:
          "size-9 rounded-full font-normal transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
        selected:
          "[&:not(.day-range-middle)>button]:!bg-primary [&:not(.day-range-middle)>button]:!text-primary-foreground [&>button]:!font-semibold",
        range_start: "day-range-start",
        range_end: "day-range-end",
        range_middle:
          "day-range-middle [&>button]:!bg-[var(--primary-soft)] [&>button]:!text-secondary-foreground",
        today:
          "[&>button]:bg-[var(--primary-soft)] [&>button]:text-secondary-foreground [&>button]:font-semibold",
        outside: "text-muted-foreground/50",
        disabled: "text-muted-foreground/40 [&>button]:pointer-events-none",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...chevronProps }) =>
          orientation === "left" ? (
            <ChevronLeft className="h-4 w-4" {...chevronProps} />
          ) : (
            <ChevronRight className="h-4 w-4" {...chevronProps} />
          ),
      }}
      {...props}
    />
  )
}

export { Calendar }
