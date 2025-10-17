export const API_FOOTBALL = {
  baseUrl: process.env.API_FOOTBALL_BASE_URL!,
  apiKey: process.env.API_FOOTBALL_KEY!,
  leagueId: process.env.API_FOOTBALL_LEAGUE_ID!, // Static: Premier League
  season: process.env.SEASON!,                    // Static or could change per season
}

// Default team (fallback for now, overridable later)
export const DEFAULT_TEAM_ID = process.env.API_FOOTBALL_TEAM_ID ?? "42"
