// lib/data/fixtures.ts
import { Fixture } from "../schemas/fixtures"
import { DEFAULT_TEAM_ID } from "../config/api-football"

export type FixturesResult = {
  data: Fixture[] | null
  success: boolean
  message?: string
}

const REVALIDATE_SECS = 300

export const getFixtures = async (teamId?: string): Promise<FixturesResult> => {
  const absoluteUrl = new URL('/api/fixtures', process.env.NEXT_PUBLIC_BASE_URL)
  
  // Only add teamId param if provided
  if (teamId) {
    absoluteUrl.searchParams.set('teamId', teamId)
  }

  const cacheTag = teamId 
    ? `fixtures-${teamId}` 
    : 'fixtures-all-league'

  try {
    const res = await fetch(absoluteUrl, {
      next: {
        revalidate: REVALIDATE_SECS,
        tags: [cacheTag]
      },
    });

    if (!res.ok) {
      return { data: null, success: false, message: `HTTP ${res.status}` }
    }

    const json = await res.json() as { ok: boolean; data?: Fixture[]; error?: string }
    if (!json.ok || !json.data) {
      return { data: null, success: false, message: "invalid payload" }
    }
    
    return { data: json.data, success: true }

  } catch {
    return { data: null, success: false, message: "network/timeout" }
  }
}
