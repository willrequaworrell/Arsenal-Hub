import { StandingRow } from "../schemas/standings";

type StandingsResult = {
  data: StandingRow[] | null
  success: boolean
  message?: string
}

export const getStandings = async (): Promise<StandingsResult> => {
  const absoluteUrl = new URL('/api/standings', process.env.NEXT_PUBLIC_BASE_URL).toString();

  try {
    const res = await fetch(absoluteUrl, {
      next: { revalidate: 300, tags: ['standings'] },
    });
    if (!res.ok) {
      return { data: null, success: false, message: `HTTP ${res.status}` }
    }

    const json = await res.json() as { ok: boolean; data?: StandingRow[] }
    if (!json.ok || !json.data) {
      return { data: null, success: false, message: "invalid payload" }
    }

    return { data: json.data, success: true }
  } catch  {
    return { data: null, success: false, message: "network/timeout" }
  }


}