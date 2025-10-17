import { Fixture } from "../api-football/schemas/fixtures";
import { DEFAULT_TEAM_ID } from "../config/api-football";

export type FixturesResult = {
  data: Fixture[] | null
  success: boolean
  message?: string
}

const REVALIDATE_SECS = 300


export const getFixtures = async (teamId: string = DEFAULT_TEAM_ID): Promise<FixturesResult> => {
  const absoluteUrl = new URL('/api/fixtures', process.env.NEXT_PUBLIC_BASE_URL)
  absoluteUrl.searchParams.set('teamId', teamId)


  try {
    const res = await fetch(absoluteUrl, {
      next: {
        revalidate: REVALIDATE_SECS,
        tags: [`fixtures-${teamId}`]
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