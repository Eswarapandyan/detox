"use client"

import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DayTileProps {
  date: Date
  isClean: boolean
  isToday: boolean
  isFuture: boolean
  isCurrentMonth: boolean
  onToggle: (iso: string) => void
}

function toLocalISO(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export function DayTile({
  date,
  isClean,
  isToday,
  isFuture,
  isCurrentMonth,
  onToggle,
}: DayTileProps) {
  const iso = toLocalISO(date)

  return (
    <button
      onClick={() => !isFuture && onToggle(iso)}
      disabled={isFuture}
      aria-label={`${iso}${isClean ? " — clean day" : ""}`}
      className={cn(
        "relative flex items-center justify-center rounded-md aspect-square text-sm select-none",
        "transition-transform duration-100 active:scale-95",
        "hover:bg-neutral-100 cursor-pointer",
        isToday && "ring-1 ring-neutral-400 font-semibold",
        !isCurrentMonth && "opacity-30",
        isFuture && "opacity-25 cursor-not-allowed pointer-events-none",
        isClean && "bg-neutral-50",
      )}
    >
      <span className={cn(isClean && "text-neutral-400 text-xs")}>{date.getDate()}</span>

      {/* Lucide X icon overlaid */}
      {isClean && (
        <X
          className="absolute inset-0 m-auto text-neutral-400 pointer-events-none animate-in fade-in zoom-in-75 duration-200"
          size={28}
          strokeWidth={2}
        />
      )}
    </button>
  )
}
