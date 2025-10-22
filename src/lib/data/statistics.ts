// lib/data/statistics.ts
import { FixtureStatistics } from "../api-football/schemas/statistics"

export type StatisticsResult = {
  data: FixtureStatistics | null
  success: boolean
  message?: string
}

const REVALIDATE_SECS = 300

export const getFixtureStatistics = async (
  fixtureId: number
): Promise<StatisticsResult> => {
  const absoluteUrl = new URL(
    `/api/fixtures/statistics`,
    process.env.NEXT_PUBLIC_BASE_URL
  )
  absoluteUrl.searchParams.set('fixtureId', fixtureId.toString())

  try {
    const res = await fetch(absoluteUrl, {
      next: {
        revalidate: REVALIDATE_SECS,
        tags: [`statistics-${fixtureId}`],
      },
    })

    if (!res.ok) {
      return { data: null, success: false, message: `HTTP ${res.status}` }
    }

    const json = await res.json() as {
      ok: boolean
      data?: FixtureStatistics
      error?: string
      details?: any
    }

    if (!json.ok || !json.data) {
      return { 
        data: null, 
        success: false, 
        message: json.error || 'invalid payload' 
      }
    }

    return { data: json.data, success: true }
  } catch {
    return { data: null, success: false, message: 'network/timeout' }
  }
}
