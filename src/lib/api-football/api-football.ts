export const API = {
  base: process.env.API_FOOTBALL_BASE_URL!,
  key: process.env.API_FOOTBALL_KEY!,
  league: process.env.API_FOOTBALL_LEAGUE_ID!,
  team: process.env.API_FOOTBALL_TEAM_ID!,
  season: process.env.SEASON!,
};

type FetchOptions = {
  revalidate?: number | false
  tags?: string[]
}

const DEFAULT_REVALIDATE = 3600

export async function fetchFromAPIFootball(
  path: string, 
  search?: Record<string, string | number>,
  options: FetchOptions = {}
) {
  const url = new URL(path, API.base);
  
  if (search) {
    Object.entries(search).forEach(([k, v]) => 
      url.searchParams.set(k, String(v))
    );
  }

  const signal = AbortSignal.timeout(8000)

  const nextOptions: NextFetchRequestConfig = {
    revalidate: options.revalidate ?? DEFAULT_REVALIDATE,
  }
  
  if (options.tags) {
    nextOptions.tags = options.tags
  }

  const res = await fetch(url.toString(), {
    headers: { 'x-apisports-key': API.key },
    signal,
    next: nextOptions
  });

  if (!res.ok) {
    throw new Error(`API-Football error: ${res.status} ${res.statusText}`);
  }
  
  return res.json();
}
