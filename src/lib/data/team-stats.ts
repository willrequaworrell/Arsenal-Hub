// src/lib/data/team-stats.ts
import type { TeamFormAndRecord } from "@/lib/schemas/team-stats"

export type TeamStatsResult = {
  data: TeamFormAndRecord | null
  success: boolean
  message?: string
}

const REVALIDATE_SECS = 300
const DEFAULT_TEAM_ID = process.env.API_FOOTBALL_TEAM_ID ?? "42"

export async function getTeamFormAndRecord(teamId: string = DEFAULT_TEAM_ID): Promise<TeamStatsResult> {
  const url = new URL("/api/team-stats", process.env.NEXT_PUBLIC_BASE_URL)
  url.searchParams.set('teamId', teamId)

  try {
    const res = await fetch(url.toString(), {
      next: { 
        revalidate: REVALIDATE_SECS, 
        tags: [`team-stats-${teamId}`] 
      },
    })

    if (!res.ok) {
      return { data: null, success: false, message: `HTTP ${res.status}` }
    }

    const json = (await res.json()) as { ok: boolean; data?: TeamFormAndRecord; error?: string }
    if (!json.ok || !json.data) {
      return { data: null, success: false, message: json.error ?? "invalid payload" }
    }

    return { data: json.data, success: true }
  } catch {
    return { data: null, success: false, message: "network/timeout" }
  }
}
