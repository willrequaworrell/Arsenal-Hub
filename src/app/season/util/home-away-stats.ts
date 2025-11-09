// app/(season)/util/home-away-stats.ts
import { Fixture } from "@/lib/api-football/schemas/fixtures"

type VenueStats = {
  goalsPerGame: number
  goalsAgainstPerGame: number
  winPercentage: number
  lossPercentage: number
  drawPercentage: number
  cleanSheetPercentage: number
}

export type HomeAwayStats = {
  home: VenueStats
  away: VenueStats
}

export const calculateHomeAwayStats = (
  fixtures: Fixture[],
  teamId: number
): HomeAwayStats => {
  const finishedFixtures = fixtures.filter(
    f => f.fixture.status.short === 'FT'
  )

  const homeFixtures = finishedFixtures.filter(
    f => f.teams.home.id === teamId
  )

  const awayFixtures = finishedFixtures.filter(
    f => f.teams.away.id === teamId
  )

  const calculateStats = (fixtures: Fixture[], isHome: boolean): VenueStats => {
    if (fixtures.length === 0) {
      return {
        goalsPerGame: 0,
        goalsAgainstPerGame: 0,
        winPercentage: 0,
        lossPercentage: 0,
        drawPercentage: 0,
        cleanSheetPercentage: 0,
      }
    }

    let totalGoals = 0
    let totalGoalsAgainst = 0
    let wins = 0
    let losses = 0
    let draws = 0
    let cleanSheets = 0

    fixtures.forEach(fixture => {
      const ourGoals = isHome ? fixture.goals.home ?? 0 : fixture.goals.away ?? 0
      const theirGoals = isHome ? fixture.goals.away ?? 0 : fixture.goals.home ?? 0

      totalGoals += ourGoals
      totalGoalsAgainst += theirGoals

      if (theirGoals === 0) cleanSheets++

      if (ourGoals > theirGoals) {
        wins++
      } else if (ourGoals < theirGoals) {
        losses++
      } else {
        draws++
      }
    })

    const games = fixtures.length

    return {
      goalsPerGame: parseFloat((totalGoals / games).toFixed(2)),
      goalsAgainstPerGame: parseFloat((totalGoalsAgainst / games).toFixed(2)),
      winPercentage: parseFloat(((wins / games) * 100).toFixed(1)),
      lossPercentage: parseFloat(((losses / games) * 100).toFixed(1)),
      drawPercentage: parseFloat(((draws / games) * 100).toFixed(1)),
      cleanSheetPercentage: parseFloat(((cleanSheets / games) * 100).toFixed(1)),
    }
  }

  return {
    home: calculateStats(homeFixtures, true),
    away: calculateStats(awayFixtures, false),
  }
}

export const transformToRadarData = (stats: HomeAwayStats) => {
  // Normalize goals: 3 goals/game = 100
  const normalizeGoalsFor = (gpg: number) => Math.min((gpg / 3) * 100, 100)
  
  // Normalize goals against: 0 = 100 (best), 3 = 0 (worst)
  const normalizeGoalsAgainst = (gapg: number) => Math.max(100 - (gapg / 3) * 100, 0)

  return [
    {
      metric: 'Win %',
      fullMetric: 'Win %',
      home: parseFloat(stats.home.winPercentage.toFixed(1)),
      away: parseFloat(stats.away.winPercentage.toFixed(1)),
      homeRaw: stats.home.winPercentage,
      awayRaw: stats.away.winPercentage,
    },
    {
      metric: 'Draw %',
      fullMetric: 'Draw %',
      home: parseFloat(stats.home.drawPercentage.toFixed(1)),
      away: parseFloat(stats.away.drawPercentage.toFixed(1)),
      homeRaw: stats.home.drawPercentage,
      awayRaw: stats.away.drawPercentage,
    },
    {
      metric: 'Goals For',
      fullMetric: 'Goals For',
      home: parseFloat(normalizeGoalsFor(stats.home.goalsPerGame).toFixed(1)),
      away: parseFloat(normalizeGoalsFor(stats.away.goalsPerGame).toFixed(1)),
      homeRaw: stats.home.goalsPerGame,
      awayRaw: stats.away.goalsPerGame,
    },
    {
      metric: 'Goals Against',
      fullMetric: 'Goals Against',
      home: parseFloat(normalizeGoalsAgainst(stats.home.goalsAgainstPerGame).toFixed(1)),
      away: parseFloat(normalizeGoalsAgainst(stats.away.goalsAgainstPerGame).toFixed(1)),
      homeRaw: stats.home.goalsAgainstPerGame,
      awayRaw: stats.away.goalsAgainstPerGame,
    },
    {
      metric: 'Clean Sheets',
      fullMetric: 'Clean Sheet %',
      home: parseFloat(stats.home.cleanSheetPercentage.toFixed(1)),
      away: parseFloat(stats.away.cleanSheetPercentage.toFixed(1)),
      homeRaw: stats.home.cleanSheetPercentage,
      awayRaw: stats.away.cleanSheetPercentage,
    },
    {
      metric: 'Loss %',
      fullMetric: 'Loss %',
      home: parseFloat((stats.home.lossPercentage).toFixed(1)), 
      away: parseFloat((stats.away.lossPercentage).toFixed(1)),
      homeRaw: stats.home.lossPercentage,
      awayRaw: stats.away.lossPercentage,
    },
  ]
}
