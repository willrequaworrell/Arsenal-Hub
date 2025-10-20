// lib/utils/team-abbreviations.ts

const TEAM_ABBREVIATIONS: Record<string, string> = {
  // Premier League Teams
  "Arsenal": "ARS",
  "Aston Villa": "AVL",
  "Bournemouth": "BOU",
  "Brentford": "BRE",
  "Brighton": "BHA",
  "Brighton & Hove Albion": "BHA",
  "Burnley": "BUR",
  "Chelsea": "CHE",
  "Crystal Palace": "CRY",
  "Everton": "EVE",
  "Fulham": "FUL",
  "Liverpool": "LIV",
  "Luton": "LUT",
  "Luton Town": "LUT",
  "Manchester City": "MCI",
  "Manchester United": "MUN",
  "Newcastle": "NEW",
  "Newcastle United": "NEW",
  "Nottingham Forest": "NFO",
  "Sheffield United": "SHU",
  "Tottenham": "TOT",
  "West Ham": "WHU",
  "West Ham United": "WHU",
  "Wolves": "WOL",
  "Wolverhampton Wanderers": "WOL",
} as const

/**
 * Gets the abbreviated form of a team name for display on mobile
 * @param teamName - Full team name from API
 * @returns Abbreviated team name (3 letters) or first 3 letters if not found
 */
export function getTeamAbbreviation(teamName: string): string {
  return TEAM_ABBREVIATIONS[teamName] ?? teamName.substring(0, 3).toUpperCase()
}
