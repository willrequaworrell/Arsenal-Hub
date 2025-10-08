import type { TeamFormAndRecord } from "@/lib/api-football/schemas/team-stats"

export type TeamStatsResult = {
  data: TeamFormAndRecord
  success: boolean
  message?: string
}

const FALLBACK: TeamFormAndRecord = { form: "", record: { w: 0, d: 0, l: 0 } }

export async function getTeamFormAndRecord(
  opts?: { revalidate?: number; tags?: string[] }
): Promise<TeamStatsResult> {
  try {
    const url = new URL("/api/team-stats", process.env.NEXT_PUBLIC_BASE_URL).toString()
    const res = await fetch(url, {
      next: { revalidate: opts?.revalidate ?? 120, tags: opts?.tags ?? ["team-stats"] },
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

// import type { TeamFormAndRecord } from "@/lib/api-football/schemas/team-stats"

// export async function getTeamFormAndRecord(opts?: { revalidate?: number; tags?: string[] }): Promise<TeamFormAndRecord> {

//   const url = new URL("/api/team-stats", process.env.NEXT_PUBLIC_BASE_URL).toString()
//   const res = await fetch(url, {
//     next: { revalidate: opts?.revalidate ?? 120, tags: opts?.tags ?? ["team-stats"] },
//   })
//   if (!res.ok) throw new Error("team stats request failed")

//   const json = (await res.json()) as { ok: boolean; data?: TeamFormAndRecord }
//   if (!json.ok || !json.data) throw new Error("team stats schema invalid")

//   return json.data
// }
