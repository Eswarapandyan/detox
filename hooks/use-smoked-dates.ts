"use client"

import { useState, useEffect, useCallback } from "react"

const STORAGE_KEY = "detox-clean-days"

function toLocalISO(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function loadFromStorage(): Set<string> {
  if (typeof window === "undefined") return new Set()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return new Set(parsed as string[])
  } catch {
    // corrupted data — start fresh
  }
  return new Set()
}

export function useSmokedDates() {
  // Start empty to avoid SSR/client hydration mismatch
  const [cleanDates, setCleanDates] = useState<Set<string>>(new Set())

  // Populate from localStorage after mount
  useEffect(() => {
    setCleanDates(loadFromStorage())
  }, [])

  const toggleDate = useCallback((iso: string) => {
    setCleanDates((prev) => {
      const next = new Set(prev)
      if (next.has(iso)) {
        next.delete(iso)
      } else {
        next.add(iso)
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
      return next
    })
  }, [])

  return {
    cleanDates,
    toggleDate,
    totalCleanDays: cleanDates.size,
    toLocalISO,
  }
}
