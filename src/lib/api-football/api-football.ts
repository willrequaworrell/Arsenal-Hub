export const API = {
  base: process.env.API_FOOTBALL_BASE_URL!,
  key: process.env.API_FOOTBALL_KEY!,
  league: process.env.API_FOOTBALL_LEAGUE_ID!,
  team: process.env.API_FOOTBALL_TEAM_ID!,
  season: process.env.SEASON!,
};

export async function fetchFromAPIFootball(path: string, search?: Record<string,string|number>) {
  const url = new URL(path, API.base);
  if (search) Object.entries(search).forEach(([k,v]) => url.searchParams.set(k, String(v)));

  const signal = AbortSignal.timeout(8000)

  const res = await fetch(url.toString(), {
    headers: { 'x-apisports-key': API.key },
    signal
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}
