import { fetchFromAPIFootball } from '@/lib/api-football/api-football'
import { FixturesArraySchema } from '@/lib/schemas/fixtures'
import { validateAPIFootballResponse } from '@/lib/api-football/validate-response'
import { API_FOOTBALL, DEFAULT_TEAM_ID } from '@/lib/config/api-football'
import { NextResponse } from 'next/server'

export const revalidate = 60

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const teamId = searchParams.get("teamId")

  try {
    // Build params - only add team if provided
    const params: Record<string, string> = {
      league: API_FOOTBALL.leagueId,
      season: API_FOOTBALL.season,
    }

    // Add team filter if teamId provided (either from query or default)
    if (teamId) {
      params.team = teamId
    }

    const data = await fetchFromAPIFootball('/fixtures', params)

    // Validate API-Football response
    const validation = validateAPIFootballResponse(data)
    if (!validation.valid) {
      return NextResponse.json(
        { ok: false, error: validation.error, details: validation.details },
        { status: validation.details ? 400 : 404 }
      )
    }

    const fixtures = data?.response ?? null
    const parsed = FixturesArraySchema.safeParse(fixtures)

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid fixtures payload", issues: parsed.error.message },
        { status: 502 }
      )
    }

    return NextResponse.json({ ok: true, data: parsed.data })

  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Upstream failure" },
      { status: 502 }
    )
  }
}
