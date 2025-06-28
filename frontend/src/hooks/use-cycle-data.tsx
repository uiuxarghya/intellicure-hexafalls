"use client"

import { useState, useEffect } from "react"
import type { CycleData, UserSettings } from "../types/cycle"

export function useCycleData() {
  const [periodStartDates, setPeriodStartDates] = useState<Date[]>([])
  const [cycles, setCycles] = useState<CycleData[]>([])
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedPeriodStarts = localStorage.getItem("menstrual-period-starts")
    const savedSettings = localStorage.getItem("menstrual-user-settings")

    if (savedPeriodStarts) {
      const dates = JSON.parse(savedPeriodStarts).map((dateStr: string) => new Date(dateStr))
      setPeriodStartDates(dates)
    }

    if (savedSettings) {
      setUserSettings(JSON.parse(savedSettings))
    }
  }, [])

  // Save data to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("menstrual-period-starts", JSON.stringify(periodStartDates.map((date) => date.toISOString())))
  }, [periodStartDates])

  useEffect(() => {
    if (userSettings) {
      localStorage.setItem("menstrual-user-settings", JSON.stringify(userSettings))
    }
  }, [userSettings])

  // Calculate cycles whenever period start dates change
  useEffect(() => {
    const calculatedCycles = calculateCycles(periodStartDates, userSettings)
    setCycles(calculatedCycles)
  }, [periodStartDates, userSettings])

  const addPeriodStart = (date: Date) => {
    const dateStr = date.toDateString()
    setPeriodStartDates((prev) => {
      const exists = prev.some((d) => d.toDateString() === dateStr)
      if (exists) return prev
      return [...prev, date].sort((a, b) => a.getTime() - b.getTime())
    })
  }

  const removePeriodStart = (date: Date) => {
    const dateStr = date.toDateString()
    setPeriodStartDates((prev) => prev.filter((d) => d.toDateString() !== dateStr))
  }

  const updateSettings = (settings: UserSettings) => {
    setUserSettings(settings)
  }

  return {
    periodStartDates,
    cycles,
    userSettings,
    addPeriodStart,
    removePeriodStart,
    updateSettings,
  }
}

function calculateCycles(periodStartDates: Date[], userSettings: UserSettings | null): CycleData[] {
  if (periodStartDates.length === 0 || !userSettings) return []

  const sortedDates = [...periodStartDates].sort((a, b) => a.getTime() - b.getTime())
  const cycles: CycleData[] = []

  for (let i = 0; i < sortedDates.length - 1; i++) {
    const currentStart = sortedDates[i]
    const nextStart = sortedDates[i + 1]

    const cycleLength = Math.round((nextStart.getTime() - currentStart.getTime()) / (1000 * 60 * 60 * 24))

    cycles.push({
      id: `cycle-${i}`,
      startDate: currentStart,
      endDate: nextStart,
      length: cycleLength,
      periodLength: userSettings.averagePeriodLength,
    })
  }

  return cycles
}
