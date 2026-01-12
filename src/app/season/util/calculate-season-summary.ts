import { Fixture } from "@/lib/schemas/fixtures"
import { DEFAULT_TEAM_ID } from "@/lib/config/api-football"

export type SeasonSummaryStats = {
  played: number
  wins: number
  draws: number
  losses: number
  totalGoalsFor: number
  totalGoalsAgainst: number
  goalDifference: number
}

export const calculateSeasonSummary = (
  teamFixtures: Fixture[], 
  teamId: number = Number(DEFAULT_TEAM_ID)
): SeasonSummaryStats => {
  const finishedMatches = teamFixtures.filter(f => 
    ["FT", "AET", "PEN"].includes(f.fixture.status.short)
  )
  
  const played = finishedMatches.length

  const wins = finishedMatches.filter(f => {
    const isHome = f.teams.home.id === teamId
    const homeWin = (f.goals.home ?? 0) > (f.goals.away ?? 0)
    const awayWin = (f.goals.away ?? 0) > (f.goals.home ?? 0)
    return (isHome && homeWin) || (!isHome && awayWin)
  }).length

  const draws = finishedMatches.filter(f => 
    f.goals.home === f.goals.away
  ).length

  const losses = played - wins - draws

  const totalGoalsFor = finishedMatches.reduce((sum, f) => {
    const isHome = f.teams.home.id === teamId
    return sum + (isHome ? (f.goals.home ?? 0) : (f.goals.away ?? 0))
  }, 0)

  const totalGoalsAgainst = finishedMatches.reduce((sum, f) => {
    const isHome = f.teams.home.id === teamId
    return sum + (isHome ? (f.goals.away ?? 0) : (f.goals.home ?? 0))
  }, 0)

  return {
    played,
    wins,
    draws,
    losses,
    totalGoalsFor,
    totalGoalsAgainst,
    goalDifference: totalGoalsFor - totalGoalsAgainst
  }
}
