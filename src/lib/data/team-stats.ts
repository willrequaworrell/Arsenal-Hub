import type { TeamFormAndRecord } from "@/lib/api-football/schemas/team-stats"

export type TeamStatsResult = {
  data: TeamFormAndRecord
  success: boolean
  message?: string
}

const REVALIDATE_SECS = 300

const FALLBACK: TeamFormAndRecord = { form: "-----", record: { w: 0, d: 0, l: 0 } }

export async function getTeamFormAndRecord(): Promise<TeamStatsResult> {
  try {
    const url = new URL("/api/team-stats", process.env.NEXT_PUBLIC_BASE_URL).toString()
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_SECS, tags: ["team-stats"] },
    })

    if (!res.ok) {
      return { data: FALLBACK, success: false, message: `HTTP ${res.status}` }
    }

    const json = (await res.json()) as { ok: boolean; data?: TeamFormAndRecord; error?: string }
    if (!json.ok || !json.data) {
      return { data: FALLBACK, success: false, message: json.error ?? "invalid payload" }
    }

    return { data: json.data, success: true }
  } catch {
    return { data: FALLBACK, success: false, message: "network/timeout" }
  }
}
