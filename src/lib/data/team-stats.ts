import { fetchFromAPIFootball, API } from "@/lib/api-football/api-football"
import { TeamStatsSchema, toFormAndRecord, type TeamFormAndRecord } from "@/lib/schemas/team-stats"
import { validateAPIFootballResponse } from "@/lib/api-football/validate-response"
import { DEFAULT_TEAM_ID } from "@/lib/config/api-football"

export type TeamStatsResult = {
  data: TeamFormAndRecord | null
  success: boolean
  message?: string
}

// 1 hour (3600s) bc stats only change after a match
const REVALIDATE_SECS = 3600 

export async function getTeamFormAndRecord(teamId: string = DEFAULT_TEAM_ID): Promise<TeamStatsResult> {
  try {
    const data = await fetchFromAPIFootball(
      "/teams/statistics", 
      {
        league: API.league,
        season: API.season,
        team: teamId
      },
      { 
        revalidate: REVALIDATE_SECS,
        tags: [`team-stats-${teamId}`] 
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

    const raw = data?.response ?? {}
    const parsed = TeamStatsSchema.safeParse(raw)

    if (!parsed.success) {
      return { 
        data: null, 
        success: false, 
        message: "Invalid payload from upstream" 
      }
    }

    const compact = toFormAndRecord(parsed.data)
    
    return { 
      data: compact, 
      success: true 
    }

  } catch (error) {
    console.error("Team Stats Fetch Error:", error)
    return { 
      data: null, 
      success: false, 
      message: "Upstream failure" 
    }
  }
}
