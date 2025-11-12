// app/api/players/route.ts
import { fetchFromAPIFootball } from '@/lib/api-football/api-football'
import { PlayersArraySchema } from '@/lib/api-football/schemas/players'
import { validateAPIFootballResponse } from '@/lib/api-football/validate-response'
import { API_FOOTBALL, DEFAULT_TEAM_ID } from '@/lib/config/api-football'
import { NextResponse } from 'next/server'

export const revalidate = 300

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const teamId = searchParams.get("teamId") || DEFAULT_TEAM_ID
  const league = searchParams.get("league") || "39" // Default to Premier League

  try {
    const params = {
      team: teamId,
      season: API_FOOTBALL.season,
    }

    // First request to get total pages
    const initialData = await fetchFromAPIFootball('/players', {
      ...params,
      page: "1"
    })

    const validation = validateAPIFootballResponse(initialData)
    if (!validation.valid) {
      return NextResponse.json(
        { ok: false, error: validation.error, details: validation.details },
        { status: validation.details ? 400 : 404 }
      )
    }

    const totalPages = initialData?.paging?.total ?? 1
    const firstPagePlayers = initialData?.response ?? []

    // Fetch remaining pages concurrently
    const remainingPages = Array.from(
      { length: totalPages - 1 }, 
      (_, i) => i + 2
    )

    const remainingRequests = remainingPages.map(page =>
      fetchFromAPIFootball('/players', {
        ...params,
        page: page.toString()
      })
    )

    const remainingResults = await Promise.all(remainingRequests)
    
    // Combine all players
    let allPlayers = [...firstPagePlayers]
    remainingResults.forEach(result => {
      if (result?.response) {
        allPlayers = [...allPlayers, ...result.response]
      }
    })

    // Filter players:
    // 1. Must have Premier League stats (or specified league)
    // 2. Must have played at least 1 game
    const filteredPlayers = allPlayers.filter(player => {
      const leagueStats = player.statistics?.find(
        (s: any) => s.league.id === parseInt(league)
      )
      return leagueStats && (leagueStats.games?.appearences ?? 0) > 0
    })

    // Validate filtered data
    const parsed = PlayersArraySchema.safeParse(filteredPlayers)

    if (!parsed.success) {
      console.error("Schema validation error:", parsed.error)
      return NextResponse.json(
        { ok: false, error: "Invalid players payload", issues: parsed.error.message },
        { status: 502 }
      )
    }

    return NextResponse.json({ 
      ok: true, 
      data: parsed.data,
      meta: {
        total: filteredPlayers.length,
        league: league
      }
    })

  } catch (error) {
    console.error("Players API error:", error)
    return NextResponse.json(
      { ok: false, error: "Upstream failure" },
      { status: 502 }
    )
  }
}
