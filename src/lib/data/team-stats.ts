import type { TeamFormAndRecord } from "@/lib/api-football/schemas/team-stats"

export type TeamStatsResult = {
  data: TeamFormAndRecord | null
  success: boolean
  message?: string
}

const REVALIDATE_SECS = 300


export async function getTeamFormAndRecord(): Promise<TeamStatsResult> {
  const url = new URL("/api/team-stats", process.env.NEXT_PUBLIC_BASE_URL).toString()

  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_SECS, tags: ["team-stats"] },
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
