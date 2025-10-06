import { NextResponse } from "next/server"
import { fetchFromAPIFootball, API } from "@/lib/api-football/api-football"
import { TeamStatsSchema, toFormAndRecord } from "@/lib/api-football/schemas/team-stats"

// Keep stats relatively fresh; form can change each matchday
export const revalidate = 120

export async function GET() {
  try {
    const data = await fetchFromAPIFootball("/teams/statistics", {
      league: API.league,
      season: API.season,
      team: API.team,
    })

    // For this endpoint, API shape is { response: { ...stats... } }
    const raw = data?.response ?? {}
    const parsed = TeamStatsSchema.safeParse(raw)

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid team stats payload", issues: parsed.error.message },
        { status: 502 }
      )
    }

    // Return a compact, UI-friendly shape: { form: "WWDLW", record: { w, d, l } }
    const compact = toFormAndRecord(parsed.data)
    return NextResponse.json({ ok: true, data: compact })
  } catch {
    return NextResponse.json({ ok: false, error: "Upstream failure" }, { status: 502 })
  }
}
