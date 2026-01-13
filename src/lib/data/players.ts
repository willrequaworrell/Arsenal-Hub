import { fetchFromAPIFootball, API } from "@/lib/api-football/api-football"
import { PlayersArraySchema, type PlayerStatistics } from "@/lib/schemas/players"
import { validateAPIFootballResponse } from "@/lib/api-football/validate-response"
import { DEFAULT_TEAM_ID } from "@/lib/config/api-football"

export type PlayersResult = {
  data: PlayerStatistics[] | null
  success: boolean
  message?: string
  meta?: {
    total: number
    league: string
  }
}

// Cache players for 24 hours (86400s) because rosters rarely change
const REVALIDATE_SECS = 86400

export const getPlayers = async (
  teamId: string = DEFAULT_TEAM_ID, 
  league: string = "39" // Premier League
): Promise<PlayersResult> => {
  
  const cacheTag = `players-${teamId}-${league}`

  try {
    const params = {
      team: teamId,
      season: API.season,
      league: league
    }

    // 1. Fetch First Page
    const initialData = await fetchFromAPIFootball(
      '/players', 
      { ...params, page: 1 },
      { revalidate: REVALIDATE_SECS, tags: [cacheTag] }
    )

    const validation = validateAPIFootballResponse(initialData)
    if (!validation.valid) {
      return { data: null, success: false, message: validation.error }
    }

    const totalPages = initialData?.paging?.total ?? 1
    const firstPagePlayers = initialData?.response ?? []

    // 2. Fetch Remaining Pages Concurrently
    // We only trigger this if there's more than 1 page.
    let allPlayers: PlayerStatistics[] = [...firstPagePlayers]

    if (totalPages > 1) {
      const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2)
      
      const remainingRequests = remainingPages.map(page =>
        fetchFromAPIFootball(
            '/players', 
            { ...params, page: page },
            { revalidate: REVALIDATE_SECS, tags: [cacheTag] }
        )
      )

      const remainingResults = await Promise.all(remainingRequests)
      
      remainingResults.forEach(result => {
        if (result?.response) {
          allPlayers = [...allPlayers, ...result.response]
        }
      })
    }

    // 3. Filter Players (Must have played at least 1 minute)
    // Note: We already filtered by league in the API params, so we just check appearances
    const activePlayers = allPlayers.filter((player: any) => {
      const leagueStats = player.statistics?.find(
        (s: any) => s.league.id === parseInt(league)
      )
      // Ensure they actually have minutes/appearances
      return leagueStats && (leagueStats.games?.appearences ?? 0) > 0
    })

    // 4. Schema Validation
    const parsed = PlayersArraySchema.safeParse(activePlayers)

    if (!parsed.success) {
      console.error("Schema Error:", parsed.error)
      return { data: null, success: false, message: "Invalid players payload" }
    }

    return { 
      data: parsed.data, 
      success: true,
      meta: { total: parsed.data.length, league }
    }

  } catch (error) {
    console.error("Players Fetch Error:", error)
    return { data: null, success: false, message: "Upstream failure" }
  }
}
