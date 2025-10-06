import type { TeamFormAndRecord } from "@/lib/api-football/schemas/team-stats"

export async function getTeamFormAndRecord(
  opts?: { revalidate?: number; tags?: string[] }
): Promise<TeamFormAndRecord> {
  const url = new URL("/api/team-stats", process.env.NEXT_PUBLIC_BASE_URL).toString()
  const res = await fetch(url, {
    next: { revalidate: opts?.revalidate ?? 120, tags: opts?.tags ?? ["team-stats"] },
  })
  if (!res.ok) throw new Error("team stats request failed")

  const json = (await res.json()) as { ok: boolean; data?: TeamFormAndRecord }
  if (!json.ok || !json.data) throw new Error("team stats schema invalid")

  return json.data
}
