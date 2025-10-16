import { Fixture } from "../api-football/schemas/fixtures";

export type FixturesResult = {
  data: Fixture[] | null
  success: boolean
  message?: string
}

const REVALIDATE_SECS = 300

export const getFixtures = async (): Promise<FixturesResult> => {
  const absoluteUrl = new URL('/api/fixtures', process.env.NEXT_PUBLIC_BASE_URL).toString();

  try {
    const res = await fetch(absoluteUrl, {
      next: { revalidate: REVALIDATE_SECS, tags: ['fixtures'] },
    });

    if (!res.ok) {
      return { data: null, success: false, message: `HTTP ${res.status}` }
    }

    const json = await res.json() as { ok: boolean; data?: Fixture[]; error?: string }
    if (!json.ok || !json.data) {
      return { data: null, success: false, message: "invalid payload" }
    }
    
    return { data: json.data, success: true }

  } catch {
    return { data: null, success: false, message: "network/timeout" }
  }


}