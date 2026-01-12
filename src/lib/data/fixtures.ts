import { FixturesArraySchema, type Fixture } from "../schemas/fixtures"
import { fetchFromAPIFootball, API } from "../api-football/api-football"
import { validateAPIFootballResponse } from "../api-football/validate-response"
import { DEFAULT_TEAM_ID } from "../config/api-football"

export type FixturesResult = {
  data: Fixture[] | null
  success: boolean
  message?: string
}

const REVALIDATE_SECS = 3600

export const getFixtures = async (teamId?: string): Promise<FixturesResult> => {
  
  // cache tags for single team vs whole league
  const cacheTag = teamId ? `fixtures-${teamId}` : `fixtures-league-${API.league}`

  const query: Record<string, string | number> = {
    league: API.league,
    season: API.season,
  }

  // CHANGE 3: Only add 'team' param if specifically requested
  if (teamId) {
    query.team = teamId
  }

  try {
    const data = await fetchFromAPIFootball(
      '/fixtures',
      query,
      {
        revalidate: REVALIDATE_SECS,
        tags: [cacheTag]
      }
    )

    const validation = validateAPIFootballResponse(data)
    if (!validation.valid) {
      return { 
        data: null, 
        success: false, 
        message: validation.error 
      }
    }

    const fixtures = data?.response ?? []
    const parsed = FixturesArraySchema.safeParse(fixtures)

    if (!parsed.success) {
      return { 
        data: null, 
        success: false, 
        message: "Invalid fixtures payload" 
      }
    }
    
    return { 
      data: parsed.data, 
      success: true 
    }

  } catch (error) {
    console.error("Fixtures Fetch Error:", error)
    return { 
      data: null, 
      success: false, 
      message: "Upstream failure" 
    }
  }
}
