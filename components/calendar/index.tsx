"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DayTile } from "./day-tile"
import { cn } from "@/lib/utils"

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

function toLocalISO(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function buildMonthGrid(year: number, month: number): Date[] {
  const firstOfMonth = new Date(year, month, 1)
  const startDow = firstOfMonth.getDay() // 0 = Sunday
  const cells: Date[] = []
  for (let i = -startDow; i < 42 - startDow; i++) {
    cells.push(new Date(year, month, 1 + i))
  }
  return cells
}

interface CalendarProps {
  cleanDates: Set<string>
  onToggle: (iso: string) => void
}

export function Calendar({ cleanDates, onToggle }: CalendarProps) {
  const today = new Date()
  const todayISO = toLocalISO(today)

  // End-of-today for future detection
  const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999)

  const [viewMonth, setViewMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  )
  const [direction, setDirection] = useState<"left" | "right">("right")

  const year = viewMonth.getFullYear()
  const month = viewMonth.getMonth()
  const grid = buildMonthGrid(year, month)

  function goPrev() {
    setDirection("left")
    setViewMonth(new Date(year, month - 1, 1))
  }

  function goNext() {
    setDirection("right")
    setViewMonth(new Date(year, month + 1, 1))
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Month navigation header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={goPrev} aria-label="Previous month">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="text-sm font-medium tracking-wide">
          {MONTH_NAMES[month]} {year}
        </span>
        <Button variant="ghost" size="icon" onClick={goNext} aria-label="Next month">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 gap-1">
        {DAY_LABELS.map((label) => (
          <div
            key={label}
            className="flex items-center justify-center text-xs text-muted-foreground font-medium h-8"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Date grid — key change forces remount → slide animation replays */}
      <div
        key={`${year}-${month}`}
        className={cn(
          "grid grid-cols-7 gap-1",
          direction === "right" ? "animate-slide-in-right" : "animate-slide-in-left"
        )}
      >
        {grid.map((date) => {
          const iso = toLocalISO(date)
          return (
            <DayTile
              key={iso}
              date={date}
              isClean={cleanDates.has(iso)}
              isToday={iso === todayISO}
              isFuture={date > endOfToday}
              isCurrentMonth={date.getMonth() === month}
              onToggle={onToggle}
            />
          )
        })}
      </div>
    </div>
  )
}
