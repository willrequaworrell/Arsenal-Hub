import { FixtureEvents } from "../api-football/schemas/fixture-events"

export type EventsResult = {
  data: FixtureEvents | null
  success: boolean
  message?: string
}

const REVALIDATE_SECS = 300

export const getFixtureEvents = async (
  fixtureId: number
): Promise<EventsResult> => {
  const absoluteUrl = new URL(
    `/api/fixtures/events`,
    process.env.NEXT_PUBLIC_BASE_URL
  )
  absoluteUrl.searchParams.set('fixtureId', fixtureId.toString())

  try {
    const res = await fetch(absoluteUrl, {
      next: {
        revalidate: REVALIDATE_SECS,
        tags: [`events-${fixtureId}`],
      },
    })

    if (!res.ok) {
      return { data: null, success: false, message: `HTTP ${res.status}` }
    }

    const json = await res.json() as {
      ok: boolean
      data?: FixtureEvents
      error?: string
      details?: Record<string, unknown>
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
