
type TeamData = {
  abbreviation: string
  primaryColor: string
}

/**
 * Comprehensive team data mapping using API-Football team IDs
 * Includes Premier League (2024/25) and Championship teams
 */
export const TEAM_DATA: Record<number, TeamData> = {
  // Premier League 2024/25
  42: { abbreviation: "ARS", primaryColor: "#EF0107" },    // Arsenal
  66: { abbreviation: "AVL", primaryColor: "#95BFE5" },    // Aston Villa
  35: { abbreviation: "BOU", primaryColor: "#DA291C" },    // Bournemouth
  55: { abbreviation: "BRE", primaryColor: "#E30613" },    // Brentford
  51: { abbreviation: "BHA", primaryColor: "#0057B8" },    // Brighton & Hove Albion
  49: { abbreviation: "CHE", primaryColor: "#034694" },    // Chelsea
  52: { abbreviation: "CRY", primaryColor: "#1B458F" },    // Crystal Palace
  45: { abbreviation: "EVE", primaryColor: "#003399" },    // Everton
  36: { abbreviation: "FUL", primaryColor: "#FFFFFF" },    // Fulham (white, will need contrast handling)
  46: { abbreviation: "LEI", primaryColor: "#003090" },    // Leicester City
  40: { abbreviation: "LIV", primaryColor: "#C8102E" },    // Liverpool
  50: { abbreviation: "MCI", primaryColor: "#6CABDD" },    // Manchester City
  33: { abbreviation: "MUN", primaryColor: "#DA291C" },    // Manchester United
  34: { abbreviation: "NEW", primaryColor: "#241F20" },    // Newcastle United
  17: { abbreviation: "NFO", primaryColor: "#DD0000" },    // Nottingham Forest
  62: { abbreviation: "SOU", primaryColor: "#D71920" },    // Southampton
  47: { abbreviation: "TOT", primaryColor: "#132257" },    // Tottenham Hotspur
  48: { abbreviation: "WHU", primaryColor: "#7A263A" },    // West Ham United
  39: { abbreviation: "WOL", primaryColor: "#FDB913" },    // Wolverhampton Wanderers
  57: { abbreviation: "IPS", primaryColor: "#0000FF" },    // Ipswich Town

  // Championship Teams (2024/25)
  44: { abbreviation: "BUR", primaryColor: "#6C1D45" },    // Burnley
  41: { abbreviation: "CAR", primaryColor: "#0070B5" },    // Cardiff City
  63: { abbreviation: "COV", primaryColor: "#5BCEF4" },    // Coventry City
  54: { abbreviation: "DER", primaryColor: "#FFFFFF" },    // Derby County
  53: { abbreviation: "HUL", primaryColor: "#F5A12D" },    // Hull City
  37: { abbreviation: "LEE", primaryColor: "#FFCD00" },    // Leeds United
  56: { abbreviation: "LUT", primaryColor: "#F78F1E" },    // Luton Town
  65: { abbreviation: "MID", primaryColor: "#DC0714" },    // Middlesbrough
  68: { abbreviation: "MIL", primaryColor: "#0033A0" },    // Millwall
  43: { abbreviation: "NOR", primaryColor: "#00A650" },    // Norwich City
  1334: { abbreviation: "OXF", primaryColor: "#FFD200" },  // Oxford United
  61: { abbreviation: "PLY", primaryColor: "#00361E" },    // Plymouth Argyle
  1346: { abbreviation: "PNE", primaryColor: "#FFF200" },  // Preston North End
  71: { abbreviation: "QPR", primaryColor: "#1D5BA4" },    // Queens Park Rangers
  64: { abbreviation: "SHU", primaryColor: "#EE2737" },    // Sheffield United
  38: { abbreviation: "SWA", primaryColor: "#FFFFFF" },    // Swansea City
  1323: { abbreviation: "SUN", primaryColor: "#EB172B" },  // Sunderland
  69: { abbreviation: "WAT", primaryColor: "#FBEE23" },    // Watford
  60: { abbreviation: "WBA", primaryColor: "#122F67" },    // West Bromwich Albion
  1359: { abbreviation: "BLA", primaryColor: "#0066B3" },  // Blackburn Rovers
  58: { abbreviation: "BRI", primaryColor: "#E30613" },    // Bristol City
  1371: { abbreviation: "POR", primaryColor: "#001489" },  // Portsmouth
  1357: { abbreviation: "STO", primaryColor: "#E03A3E" },  // Stoke City
} as const

const FALLBACK_DATA: TeamData = {
  abbreviation: "???",
  primaryColor: "#64748B", // slate-500
}

/**
 * Gets the abbreviated form of a team name for display on mobile
 * @param teamId - Team ID from API-Football
 * @returns Abbreviated team name (3 letters)
 */
export function getTeamAbbreviation(teamId: number): string {
  return TEAM_DATA[teamId]?.abbreviation ?? FALLBACK_DATA.abbreviation
}

/**
 * Gets the primary brand color for a team
 * @param teamId - Team ID from API-Football
 * @returns Hex color code
 */
export function getTeamColor(teamId: number): string {
  return TEAM_DATA[teamId]?.primaryColor ?? FALLBACK_DATA.primaryColor
}

/**
 * Gets complete team data (abbreviation and color)
 * @param teamId - Team ID from API-Football
 * @returns Team data object
 */
export function getTeamData(teamId: number): TeamData {
  return TEAM_DATA[teamId] ?? FALLBACK_DATA
}

/**
 * Adjusts white team colors for better visibility
 * White doesn't work well on light backgrounds, so we use a dark alternative
 * @param color - Hex color code
 * @returns Adjusted hex color code
 */
export function adjustColorForVisibility(color: string): string {
  // If color is white or very light, use a dark gray instead
  if (color === "#FFFFFF" || color === "#FFF") {
    return "#1F2937" // gray-800
  }
  return color
}
