// lib/data/calculate-league-position.ts
import { Fixture } from "@/lib/schemas/fixtures"

/**
 * Internal: Track team stats during calculation
 */
type TeamStanding = {
  teamId: number
  teamName: string
  points: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
}

/**
 * Output: Chart data point
 */
export type PositionSnapshot = {
  matchweek: number
  position: number
  points: number
}

/**
 * Calculates a team's league position after each matchweek
 */
export const calculateLeaguePositionOverTime = (
  allFixtures: Fixture[],
  teamId: number
): PositionSnapshot[] => {
  // Filter only finished fixtures
  const finishedFixtures = allFixtures.filter(
    f => f.fixture.status.short === 'FT'
  )

  if (finishedFixtures.length === 0) return []

  // Validate all fixtures have required data upfront
  validateFixtures(finishedFixtures)

  // Initialize standings for all teams
  const standings = new Map<number, TeamStanding>()

  const addTeamToStandings = (team: { id: number; name: string }) => {
    if (!standings.has(team.id)) {
      standings.set(team.id, {
        teamId: team.id,
        teamName: team.name,
        points: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
      })
    }
  }

  finishedFixtures.forEach(fixture => {
    addTeamToStandings(fixture.teams.home)
    addTeamToStandings(fixture.teams.away)
  })

  // Group fixtures by matchweek
  const fixturesByMatchweek = finishedFixtures.reduce((groups, fixture) => {
    const matchweek = extractMatchweek(fixture.league.round!)
    if (!groups[matchweek]) {
      groups[matchweek] = []
    }
    groups[matchweek].push(fixture)
    return groups
  }, {} as Record<number, Fixture[]>)

  // Get sorted matchweek numbers
  const matchweeks = Object.keys(fixturesByMatchweek)
    .map(Number)
    .sort((a, b) => a - b)

  // Process each matchweek
  const positionHistory: PositionSnapshot[] = []
  
  matchweeks.forEach(matchweek => {
    // Process all fixtures in this matchweek
    fixturesByMatchweek[matchweek].forEach(fixture => {
      updateStandings(standings, fixture)
    })
    
    // Calculate position after this matchweek
    const position = calculatePosition(standings, teamId)
    const teamStanding = standings.get(teamId)!
    
    positionHistory.push({
      matchweek,
      position,
      points: teamStanding.points,
    })
  })

  return positionHistory
}

/**
 * Validates all fixtures have required data - fails fast
 */
const validateFixtures = (fixtures: Fixture[]) => {
  for (const fixture of fixtures) {
    // Check goals data
    if (fixture.goals.home === null || fixture.goals.home === undefined) {
      throw new Error(`Invalid fixture data: Missing home goals for fixture ${fixture.fixture.id}`)
    }
    if (fixture.goals.away === null || fixture.goals.away === undefined) {
      throw new Error(`Invalid fixture data: Missing away goals for fixture ${fixture.fixture.id}`)
    }

    // Check team data
    if (!fixture.teams.home?.id || !fixture.teams.home?.name) {
      throw new Error(`Invalid fixture data: Missing home team info for fixture ${fixture.fixture.id}`)
    }
    if (!fixture.teams.away?.id || !fixture.teams.away?.name) {
      throw new Error(`Invalid fixture data: Missing away team info for fixture ${fixture.fixture.id}`)
    }

    // Check round data
    if (!fixture.league.round) {
      throw new Error(`Invalid fixture data: Missing round info for fixture ${fixture.fixture.id}`)
    }
  }
}

/**
 * Updates standings based on a fixture result
 */
const updateStandings = (standings: Map<number, TeamStanding>, fixture: Fixture) => {
  const homeTeam = standings.get(fixture.teams.home.id)!
  const awayTeam = standings.get(fixture.teams.away.id)!
  const homeGoals = fixture.goals.home!
  const awayGoals = fixture.goals.away!

  // Update goals
  homeTeam.goalsFor += homeGoals
  homeTeam.goalsAgainst += awayGoals
  awayTeam.goalsFor += awayGoals
  awayTeam.goalsAgainst += homeGoals

  // Update goal difference
  homeTeam.goalDifference = homeTeam.goalsFor - homeTeam.goalsAgainst
  awayTeam.goalDifference = awayTeam.goalsFor - awayTeam.goalsAgainst

  // Update points
  if (homeGoals > awayGoals) {
    homeTeam.points += 3
  } else if (awayGoals > homeGoals) {
    awayTeam.points += 3
  } else {
    homeTeam.points += 1
    awayTeam.points += 1
  }
}

/**
 * Calculates a team's position in the standings
 */
const calculatePosition = (
  standings: Map<number, TeamStanding>,
  teamId: number
): number => {
  const sortedTeams = Array.from(standings.values()).sort((a, b) => {
    // Sort by points (descending)
    if (b.points !== a.points) return b.points - a.points
    
    // If points equal, sort by goal difference
    if (b.goalDifference !== a.goalDifference) {
      return b.goalDifference - a.goalDifference
    }
    
    // If goal difference equal, sort by goals scored
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor
    
    // If still equal, alphabetical
    return a.teamName.localeCompare(b.teamName)
  })

  const position = sortedTeams.findIndex(team => team.teamId === teamId) + 1
  
  if (position === 0) {
    throw new Error(`Team ${teamId} not found in league standings`)
  }
  
  return position
}

/**
 * Extracts matchweek number from round string
 * e.g., "Regular Season - 10" -> 10
 */
const extractMatchweek = (round: string): number => {
  const match = round.match(/\d+/)
  if (!match) {
    throw new Error(`Unable to extract matchweek from round: "${round}"`)
  }
  return parseInt(match[0])
}
