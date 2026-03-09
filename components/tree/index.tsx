"use client"

import { useEffect, useState } from "react"
import Lottie from "lottie-react"

interface TreeProps {
  totalCleanDays: number
}

// Tree is fully revealed at 30 clean days
const MAX_DAYS = 30

const STAGE_LABELS = [
  "Plant your first clean day",
  "A seedling sprouts",
  "Growing stronger",
  "Branches reaching out",
  "Leaves beginning to bloom",
  "A flourishing tree",
]

function getStageLabel(days: number): string {
  if (days === 0) return STAGE_LABELS[0]
  if (days <= 5) return STAGE_LABELS[1]
  if (days <= 12) return STAGE_LABELS[2]
  if (days <= 20) return STAGE_LABELS[3]
  if (days <= 29) return STAGE_LABELS[4]
  return STAGE_LABELS[5]
}

export function Tree({ totalCleanDays }: TreeProps) {
  const [animationData, setAnimationData] = useState<object | null>(null)

  useEffect(() => {
    fetch("/tree.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
  }, [])

  // Calculate how much of the tree to reveal (from bottom → top)
  // clip-path inset(top 0 0 0): top% hides from the top down
  // 0 days → 100% hidden (inset 100% from top)
  // 30 days → 0% hidden (fully visible)
  const progress = Math.min(totalCleanDays / MAX_DAYS, 1)
  const clipTop = Math.round((1 - progress) * 100)

  if (!animationData) {
    return <div className="w-full max-w-[280px] aspect-square" />
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div
        className="w-full max-w-[280px] transition-[clip-path] duration-700 ease-out"
        style={{
          clipPath: `inset(${clipTop}% 0 0 0)`,
        }}
      >
        <Lottie
          animationData={animationData}
          loop
          autoplay
          style={{ width: "100%", height: "auto" }}
          aria-label="Your progress tree"
          role="img"
        />
      </div>

      <p className="text-xs text-muted-foreground text-center italic">
        {getStageLabel(totalCleanDays)}
      </p>
    </div>
  )
}
