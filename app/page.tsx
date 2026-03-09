"use client"

import { useState, useCallback } from "react"
import ReactConfetti from "react-confetti"
import { Calendar } from "@/components/calendar"
import { Tree } from "@/components/tree"
import { useSmokedDates } from "@/hooks/use-smoked-dates"
import { useWindowSize } from "@/hooks/use-window-size"

export default function Page() {
  const { cleanDates, toggleDate, totalCleanDays } = useSmokedDates()
  const { width, height } = useWindowSize()
  const [showConfetti, setShowConfetti] = useState(false)

  const handleToggle = useCallback(
    (iso: string) => {
      const wasClean = cleanDates.has(iso)
      toggleDate(iso)

      // Fire confetti only when marking a new clean day (not un-marking)
      if (!wasClean) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 2500)
      }
    },
    [cleanDates, toggleDate],
  )

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      {showConfetti && (
        <ReactConfetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={120}
          gravity={0.25}
          colors={["#6ab04c", "#78c058", "#85d065", "#badc58", "#f6e58d"]}
          style={{ position: "fixed", top: 0, left: 0, zIndex: 50 }}
        />
      )}

      <div className="flex flex-col md:flex-row gap-10 md:gap-14 w-full max-w-3xl">
        {/* ── Left: Calendar ── */}
        <section className="flex-1 min-w-0">
          <h2 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-6">
            Clean Days
          </h2>
          <Calendar cleanDates={cleanDates} onToggle={handleToggle} />
        </section>

        {/* Divider */}
        <div className="hidden md:block w-px bg-border self-stretch" />
        <div className="block md:hidden h-px bg-border w-full" />

        {/* ── Right: Tree ── */}
        <section className="flex-1 flex flex-col items-center">
          <h2 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-6 self-start md:self-center">
            Your Progress
          </h2>
          <Tree totalCleanDays={totalCleanDays} />
          <p className="mt-5 text-sm text-muted-foreground">
            <span className="text-foreground font-semibold tabular-nums">
              {totalCleanDays}
            </span>{" "}
            clean {totalCleanDays === 1 ? "day" : "days"} total
          </p>
        </section>
      </div>
    </main>
  )
}
