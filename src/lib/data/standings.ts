import { StandingRow } from "../api-football/schemas/standings";



export const getStandings = async (): Promise<StandingRow[]> => {
  const absoluteUrl = new URL('/api/standings', process.env.NEXT_PUBLIC_BASE_URL).toString();
  
  const res = await fetch(absoluteUrl, {
    next: { revalidate: 300, tags: ['standings']},
  });
  if (!res.ok) throw new Error("failed to fetch standings");
  const json = await res.json() as { ok: boolean; data?: StandingRow[] }
  if (!json.ok || !json.data) throw new Error("standings schema invalid")
  return json.data
}