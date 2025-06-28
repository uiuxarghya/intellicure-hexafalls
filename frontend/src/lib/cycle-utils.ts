import type { CycleData, CyclePhase, UserSettings } from "../types/cycle"

export function getCyclePhase(date: Date, periodStartDates: Date[], userSettings: UserSettings | null): CyclePhase {
  if (!userSettings || periodStartDates.length === 0) return "unknown"

  const cycleDay = getCycleDayNumber(date, periodStartDates, userSettings)
  if (!cycleDay) return "unknown"

  const periodLength = userSettings.averagePeriodLength
  const cycleLength = userSettings.averageCycleLength

  // Biologically accurate phase calculations
  const ovulationDay = cycleLength - 14 // Luteal phase is typically 14 days
  const ovulationWindow = 2 // ±2 days around ovulation

  if (cycleDay <= periodLength) {
    return "menstrual"
  } else if (cycleDay < ovulationDay - ovulationWindow) {
    return "follicular"
  } else if (cycleDay >= ovulationDay - ovulationWindow && cycleDay <= ovulationDay + ovulationWindow) {
    return "ovulation"
  } else {
    return "luteal"
  }
}

export function getCycleDayNumber(
  date: Date,
  periodStartDates: Date[],
  userSettings: UserSettings | null,
): number | null {
  if (!userSettings || periodStartDates.length === 0) return null

  const sortedStarts = [...periodStartDates].sort((a, b) => a.getTime() - b.getTime())

  // Find the most recent period start before or on the given date
  let relevantStart: Date | null = null

  for (const startDate of sortedStarts) {
    if (startDate <= date) {
      relevantStart = startDate
    } else {
      break
    }
  }

  if (!relevantStart) return null

  const daysSinceStart = Math.floor((date.getTime() - relevantStart.getTime()) / (1000 * 60 * 60 * 24)) + 1

  // If we're beyond the expected cycle length, calculate based on cycle length
  if (daysSinceStart > userSettings.averageCycleLength) {
    return ((daysSinceStart - 1) % userSettings.averageCycleLength) + 1
  }

  return daysSinceStart
}

export function getAllCycleDays(periodStartDates: Date[], userSettings: UserSettings | null) {
  const cycleDays = {
    menstrual: [] as Date[],
    follicular: [] as Date[],
    ovulation: [] as Date[],
    luteal: [] as Date[],
  }

  if (!userSettings || periodStartDates.length === 0) return cycleDays

  const sortedStarts = [...periodStartDates].sort((a, b) => a.getTime() - b.getTime())
  const cycleLength = userSettings.averageCycleLength
  const periodLength = userSettings.averagePeriodLength

  // Biologically accurate phase boundaries
  const ovulationDay = cycleLength - 14 // Luteal phase is typically 14 days
  const ovulationWindow = 2

  // Generate cycle days for each period start
  sortedStarts.forEach((startDate) => {
    for (let day = 1; day <= cycleLength; day++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(currentDate.getDate() + day - 1)

      // Don't go beyond today + 60 days to avoid infinite future dates
      const maxDate = new Date()
      maxDate.setDate(maxDate.getDate() + 60)
      if (currentDate > maxDate) break

      if (day <= periodLength) {
        cycleDays.menstrual.push(new Date(currentDate))
      } else if (day < ovulationDay - ovulationWindow) {
        cycleDays.follicular.push(new Date(currentDate))
      } else if (day >= ovulationDay - ovulationWindow && day <= ovulationDay + ovulationWindow) {
        cycleDays.ovulation.push(new Date(currentDate))
      } else {
        cycleDays.luteal.push(new Date(currentDate))
      }
    }
  })

  return cycleDays
}

export function getPredictedNextPeriod(periodStartDates: Date[], userSettings: UserSettings | null): Date | null {
  if (!userSettings || periodStartDates.length === 0) return null

  const sortedStarts = [...periodStartDates].sort((a, b) => a.getTime() - b.getTime())
  const lastStart = sortedStarts[sortedStarts.length - 1]

  // Use actual cycle length if we have data, otherwise use user setting
  let predictedCycleLength = userSettings.averageCycleLength

  if (sortedStarts.length >= 2) {
    // Calculate average of last 3 cycles for more accurate prediction
    const recentCycles = sortedStarts.slice(-4) // Last 4 starts = 3 cycles
    if (recentCycles.length >= 2) {
      const cycleLengths = []
      for (let i = 1; i < recentCycles.length; i++) {
        const cycleLength = Math.round(
          (recentCycles[i].getTime() - recentCycles[i - 1].getTime()) / (1000 * 60 * 60 * 24),
        )
        cycleLengths.push(cycleLength)
      }
      predictedCycleLength = Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
    }
  }

  const nextPeriodDate = new Date(lastStart)
  nextPeriodDate.setDate(nextPeriodDate.getDate() + predictedCycleLength)

  return nextPeriodDate
}

export function getHormoneLevels(cycleDay: number, cycleLength = 28): { estrogen: number; progesterone: number } {
  // Biologically accurate hormone modeling
  const ovulationDay = cycleLength - 14 // Luteal phase is consistently ~14 days

  let estrogen = 0
  let progesterone = 0

  if (cycleDay <= 5) {
    // Menstrual phase - both hormones at baseline
    estrogen = 1.0 + Math.random() * 0.3
    progesterone = 0.3 + Math.random() * 0.2
  } else if (cycleDay < ovulationDay - 2) {
    // Follicular phase - estrogen rises gradually then sharply
    const follicularProgress = (cycleDay - 5) / (ovulationDay - 7)
    estrogen = 1.0 + follicularProgress * 6 + Math.sin(follicularProgress * Math.PI) * 2
    progesterone = 0.3 + Math.random() * 0.4
  } else if (cycleDay >= ovulationDay - 2 && cycleDay <= ovulationDay + 1) {
    // Ovulation - estrogen peaks then drops, progesterone starts rising
    const ovulationProgress = (cycleDay - (ovulationDay - 2)) / 3
    estrogen = 8.5 - ovulationProgress * 3 + Math.random() * 0.5
    progesterone = 0.5 + ovulationProgress * 2 + Math.random() * 0.3
  } else {
    // Luteal phase - progesterone dominates, estrogen has secondary rise
    const lutealProgress = (cycleDay - ovulationDay - 1) / (cycleLength - ovulationDay - 1)

    // Progesterone rises to peak then falls if no pregnancy
    if (lutealProgress < 0.6) {
      progesterone = 2.5 + lutealProgress * 5 + Math.random() * 0.5
    } else {
      progesterone = 7.5 - (lutealProgress - 0.6) * 12 + Math.random() * 0.5
    }

    // Estrogen has a secondary rise mid-luteal phase
    estrogen = 2.5 + Math.sin(lutealProgress * Math.PI) * 2 + Math.random() * 0.5
  }

  return {
    estrogen: Math.max(0.1, Math.round(estrogen * 100) / 100),
    progesterone: Math.max(0.1, Math.round(progesterone * 100) / 100),
  }
}

export function calculateCycleStatistics(cycles: CycleData[], userSettings: UserSettings | null) {
  if (cycles.length === 0) {
    return {
      totalCycles: 0,
      actualAverageCycleLength: userSettings?.averageCycleLength || 28,
      actualAveragePeriodLength: userSettings?.averagePeriodLength || 5,
      cycleVariation: 0,
      regularityStatus: "No data",
      predictabilityScore: 0,
      predictabilityLevel: "Unknown",
      shortestCycle: 0,
      longestCycle: 0,
      shortestPeriod: 0,
      longestPeriod: 0,
      regularCycles: 0,
      consistentPeriods: 0,
    }
  }

  const cycleLengths = cycles.map((c) => c.length)
  const periodLengths = cycles.map((c) => c.periodLength)

  const actualAverageCycleLength = Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
  const actualAveragePeriodLength = Math.round(periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length)

  // Calculate standard deviation for cycle variation
  const cycleVariation =
    Math.round(
      Math.sqrt(
        cycleLengths.reduce((acc, length) => acc + Math.pow(length - actualAverageCycleLength, 2), 0) /
          cycleLengths.length,
      ) * 10,
    ) / 10

  // Determine regularity status
  let regularityStatus = "Regular"
  if (cycleVariation > 8) {
    regularityStatus = "Highly Irregular"
  } else if (cycleVariation > 5) {
    regularityStatus = "Irregular"
  } else if (cycleVariation > 3) {
    regularityStatus = "Somewhat Irregular"
  }

  // Calculate predictability score (inverse of variation)
  const maxVariation = 15 // Maximum expected variation
  const predictabilityScore = Math.round(Math.max(0, (1 - cycleVariation / maxVariation) * 100))

  let predictabilityLevel = "High"
  if (predictabilityScore < 60) {
    predictabilityLevel = "Low"
  } else if (predictabilityScore < 80) {
    predictabilityLevel = "Moderate"
  }

  // Calculate min/max values
  const shortestCycle = Math.min(...cycleLengths)
  const longestCycle = Math.max(...cycleLengths)
  const shortestPeriod = Math.min(...periodLengths)
  const longestPeriod = Math.max(...periodLengths)

  // Count regular cycles (within ±3 days of average)
  const regularCycles = cycleLengths.filter((length) => Math.abs(length - actualAverageCycleLength) <= 3).length

  // Count consistent periods (3-7 days)
  const consistentPeriods = periodLengths.filter((length) => length >= 3 && length <= 7).length

  return {
    totalCycles: cycles.length,
    actualAverageCycleLength,
    actualAveragePeriodLength,
    cycleVariation,
    regularityStatus,
    predictabilityScore,
    predictabilityLevel,
    shortestCycle,
    longestCycle,
    shortestPeriod,
    longestPeriod,
    regularCycles,
    consistentPeriods,
  }
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

export function isIrregularCycle(cycles: CycleData[]): boolean {
  if (cycles.length < 3) return false

  const lengths = cycles.map((c) => c.length)
  const average = lengths.reduce((a, b) => a + b, 0) / lengths.length
  const variation = Math.sqrt(lengths.reduce((acc, length) => acc + Math.pow(length - average, 2), 0) / lengths.length)

  return variation > 7 // More than 7 days variation is considered irregular
}

// Enhanced ovulation prediction based on biological accuracy
export function getPredictedOvulation(periodStartDates: Date[], userSettings: UserSettings | null): Date | null {
  if (!userSettings || periodStartDates.length === 0) return null

  const nextPeriod = getPredictedNextPeriod(periodStartDates, userSettings)
  if (!nextPeriod) return null

  // Ovulation typically occurs 14 days before next period (luteal phase length)
  const ovulationDate = new Date(nextPeriod)
  ovulationDate.setDate(ovulationDate.getDate() - 14)

  return ovulationDate
}

// Fertile window calculation (5 days before ovulation + ovulation day)
export function getFertileWindow(
  periodStartDates: Date[],
  userSettings: UserSettings | null,
): { start: Date; end: Date } | null {
  const ovulationDate = getPredictedOvulation(periodStartDates, userSettings)
  if (!ovulationDate) return null

  const fertileStart = new Date(ovulationDate)
  fertileStart.setDate(fertileStart.getDate() - 5) // Sperm can survive up to 5 days

  const fertileEnd = new Date(ovulationDate)
  fertileEnd.setDate(fertileEnd.getDate() + 1) // Egg survives ~24 hours

  return { start: fertileStart, end: fertileEnd }
}
