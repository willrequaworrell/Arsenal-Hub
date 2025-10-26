
type TeamData = {
  abbreviation: string
  primaryColor: string
}


/**
 * Comprehensive team data mapping using API-Football team IDs
 * Includes Premier League (2024/25) and Championship teams
 */
export const TEAM_DATA: Record<number, TeamData> = {
  // Premier League 2023/24
  33: { abbreviation: "MUN", primaryColor: "#DA291C" },    // Manchester United
  34: { abbreviation: "NEW", primaryColor: "#241F20" },    // Newcastle United
  35: { abbreviation: "BOU", primaryColor: "#DA291C" },    // Bournemouth
  36: { abbreviation: "FUL", primaryColor: "#FFFFFF" },    // Fulham
  39: { abbreviation: "WOL", primaryColor: "#FDB913" },    // Wolverhampton Wanderers
  40: { abbreviation: "LIV", primaryColor: "#C8102E" },    // Liverpool
  42: { abbreviation: "ARS", primaryColor: "#EF0107" },    // Arsenal
  44: { abbreviation: "BUR", primaryColor: "#6C1D45" },    // Burnley
  45: { abbreviation: "EVE", primaryColor: "#003399" },    // Everton
  47: { abbreviation: "TOT", primaryColor: "#132257" },    // Tottenham Hotspur
  48: { abbreviation: "WHU", primaryColor: "#7A263A" },    // West Ham United
  49: { abbreviation: "CHE", primaryColor: "#034694" },    // Chelsea
  50: { abbreviation: "MCI", primaryColor: "#6CABDD" },    // Manchester City
  51: { abbreviation: "BHA", primaryColor: "#0057B8" },    // Brighton & Hove Albion
  52: { abbreviation: "CRY", primaryColor: "#1B458F" },    // Crystal Palace
  55: { abbreviation: "BRE", primaryColor: "#E30613" },    // Brentford
  62: { abbreviation: "SHU", primaryColor: "#EE2737" },    // Sheffield United
  65: { abbreviation: "NFO", primaryColor: "#DD0000" },    // Nottingham Forest (CORRECTED!)
  66: { abbreviation: "AVL", primaryColor: "#95BFE5" },    // Aston Villa
  1359: { abbreviation: "LUT", primaryColor: "#F78F1E" },  // Luton Town

  // Championship 2023/24
  37: { abbreviation: "HUD", primaryColor: "#0E63AD" },    // Huddersfield Town
  38: { abbreviation: "SWA", primaryColor: "#FFFFFF" },    // Swansea City (note: was 38 in 2023, moved)
  41: { abbreviation: "SOU", primaryColor: "#D71920" },    // Southampton
  43: { abbreviation: "NOR", primaryColor: "#00A650" },    // Norwich City (note: was 43 in 2023, moved)
  46: { abbreviation: "LEI", primaryColor: "#003090" },    // Leicester City
  54: { abbreviation: "BIR", primaryColor: "#0033A0" },    // Birmingham City
  56: { abbreviation: "BRI", primaryColor: "#E30613" },    // Bristol City
  57: { abbreviation: "IPS", primaryColor: "#0000FF" },    // Ipswich Town
  58: { abbreviation: "MIL", primaryColor: "#0033A0" },    // Millwall
  59: { abbreviation: "PNE", primaryColor: "#FFF200" },    // Preston North End
  60: { abbreviation: "WBA", primaryColor: "#122F67" },    // West Bromwich Albion
  63: { abbreviation: "LEE", primaryColor: "#FFCD00" },    // Leeds United
  64: { abbreviation: "HUL", primaryColor: "#F5A12D" },    // Hull City
  67: { abbreviation: "BLA", primaryColor: "#0066B3" },    // Blackburn Rovers
  70: { abbreviation: "MID", primaryColor: "#DC0714" },    // Middlesbrough (CORRECTED ID!)
  71: { abbreviation: "QPR", primaryColor: "#1D5BA4" },    // Queens Park Rangers
  72: { abbreviation: "WAT", primaryColor: "#FBEE23" },    // Watford (note: different from above)
  73: { abbreviation: "ROT", primaryColor: "#C8102E" },    // Rotherham United
  74: { abbreviation: "SHW", primaryColor: "#0053A0" },    // Sheffield Wednesday
  75: { abbreviation: "STO", primaryColor: "#E03A3E" },    // Stoke City
  76: { abbreviation: "CAR", primaryColor: "#0070B5" },    // Cardiff City (note: different from above)
  746: { abbreviation: "SUN", primaryColor: "#EB172B" },   // Sunderland
  1346: { abbreviation: "COV", primaryColor: "#5BCEF4" },  // Coventry City
  1357: { abbreviation: "PLY", primaryColor: "#00361E" },  // Plymouth Argyle
} as const

const FALLBACK_DATA: TeamData = {
  abbreviation: "???",
  primaryColor: "#64748B",
}

export function getTeamAbbreviation(teamId: number): string {
  return TEAM_DATA[teamId]?.abbreviation ?? FALLBACK_DATA.abbreviation
}

export function getTeamColor(teamId: number): string {
  return TEAM_DATA[teamId]?.primaryColor ?? FALLBACK_DATA.primaryColor
}

export function getTeamData(teamId: number): TeamData {
  return TEAM_DATA[teamId] ?? FALLBACK_DATA
}

export function adjustColorForVisibility(color: string): string {
  if (color === "#FFFFFF" || color === "#FFF") {
    return "#1F2937"
  }
  return color
}

// ============================================
// Color Contrast & Differentiation Logic
// ============================================

/**
 * Converts hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

/**
 * Converts RGB to hex
 */
function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16)
    return hex.length === 1 ? "0" + hex : hex
  }).join("")
}

/**
 * Calculates perceptual color difference using Euclidean distance in RGB space
 * Returns a value between 0 (identical) and ~442 (max difference)
 */
function calculateColorDistance(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1)
  const rgb2 = hexToRgb(hex2)
  
  if (!rgb1 || !rgb2) return 442 // Max distance if parsing fails
  
  // Weighted Euclidean distance (gives more weight to green, as human eye is most sensitive to it)
  const rDiff = rgb1.r - rgb2.r
  const gDiff = rgb1.g - rgb2.g
  const bDiff = rgb1.b - rgb2.b
  
  return Math.sqrt(2 * rDiff * rDiff + 4 * gDiff * gDiff + 3 * bDiff * bDiff)
}

/**
 * Darkens a color by reducing its RGB values
 */
function darkenColor(hex: string, amount: number = 0.3): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  
  return rgbToHex(
    rgb.r * (1 - amount),
    rgb.g * (1 - amount),
    rgb.b * (1 - amount)
  )
}

/**
 * Lightens a color by moving RGB values toward white
 */
function lightenColor(hex: string, amount: number = 0.3): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  
  return rgbToHex(
    rgb.r + (255 - rgb.r) * amount,
    rgb.g + (255 - rgb.g) * amount,
    rgb.b + (255 - rgb.b) * amount
  )
}

/**
 * Gets the perceived brightness of a color (0-255)
 */
function getColorBrightness(hex: string): number {
  const rgb = hexToRgb(hex)
  if (!rgb) return 128
  
  // Perceived brightness formula
  return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
}

/**
 * Gets team colors with automatic contrast adjustment for opponent if needed
 * Your team's color is NEVER modified, only the opponent's color is adjusted
 * 
 * @param yourTeamId - Your team's ID (e.g., Arsenal)
 * @param opponentTeamId - Opponent team's ID
 * @returns Object with yourColor (unmodified) and opponentColor (adjusted if needed)
 */
export function getContrastingTeamColors(
  yourTeamId: number,
  opponentTeamId: number
): { yourColor: string; opponentColor: string } {
  const yourColor = adjustColorForVisibility(getTeamColor(yourTeamId))
  let opponentColor = adjustColorForVisibility(getTeamColor(opponentTeamId))
  
  const distance = calculateColorDistance(yourColor, opponentColor)
  const CONTRAST_THRESHOLD = 100 // Adjust this value to be more/less aggressive
  
  // If colors are too similar, adjust ONLY the opponent's color
  if (distance < CONTRAST_THRESHOLD) {
    const yourBrightness = getColorBrightness(yourColor)
    const opponentBrightness = getColorBrightness(opponentColor)
    
    // If opponent is darker, make it even darker
    // If opponent is lighter, make it lighter
    if (opponentBrightness < yourBrightness) {
      opponentColor = darkenColor(opponentColor, 0.40)
    } else {
      opponentColor = lightenColor(opponentColor, 0.35)
    }
    
    // If still not enough contrast, try the opposite direction
    const newDistance = calculateColorDistance(yourColor, opponentColor)
    if (newDistance < CONTRAST_THRESHOLD) {
      if (opponentBrightness < yourBrightness) {
        opponentColor = lightenColor(adjustColorForVisibility(getTeamColor(opponentTeamId)), 0.35)
      } else {
        opponentColor = darkenColor(adjustColorForVisibility(getTeamColor(opponentTeamId)), 0.40)
      }
    }
  }
  
  return { yourColor, opponentColor }
}