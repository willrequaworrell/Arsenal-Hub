// app/(season)/components/season-stats.tsx
import CardContainer from "@/components/ui/custom/card-container"
import { Fixture } from "@/lib/api-football/schemas/fixtures"
import LeaguePositionChart from "./position-over-time-chart"

type StatsProps = {
  fixtures: Fixture[]
}

export default function Stats({ fixtures }: StatsProps) {
  // Calculate basic stats
  const finishedMatches = fixtures.filter(f => 
    ["FT", "AET", "PEN"].includes(f.fixture.status.short)
  )
  
  const played = finishedMatches.length
  
  const wins = finishedMatches.filter(f => {
    const isHome = f.teams.home.name === "Arsenal"
    const homeWin = (f.goals.home ?? 0) > (f.goals.away ?? 0)
    const awayWin = (f.goals.away ?? 0) > (f.goals.home ?? 0)
    return (isHome && homeWin) || (!isHome && awayWin)
  }).length

  const draws = finishedMatches.filter(f => 
    f.goals.home === f.goals.away
  ).length

  const losses = played - wins - draws

  const totalGoalsFor = finishedMatches.reduce((sum, f) => {
    const isHome = f.teams.home.name === "Arsenal"
    return sum + (isHome ? (f.goals.home ?? 0) : (f.goals.away ?? 0))
  }, 0)

  const totalGoalsAgainst = finishedMatches.reduce((sum, f) => {
    const isHome = f.teams.home.name === "Arsenal"
    return sum + (isHome ? (f.goals.away ?? 0) : (f.goals.home ?? 0))
  }, 0)

  const goalDifference = totalGoalsFor - totalGoalsAgainst

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Season Summary */}
      <CardContainer title="Season Summary">
        <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-4">
          <div className="text-center">
            <p className="text-2xl font-bold sm:text-3xl">{played}</p>
            <p className="text-xs text-slate-600">Played</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 sm:text-3xl">{wins}</p>
            <p className="text-xs text-slate-600">Wins</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-500 sm:text-3xl">{draws}</p>
            <p className="text-xs text-slate-600">Draws</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600 sm:text-3xl">{losses}</p>
            <p className="text-xs text-slate-600">Losses</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 border-t p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 sm:text-3xl">{totalGoalsFor}</p>
            <p className="text-xs text-slate-600">Goals For</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600 sm:text-3xl">{totalGoalsAgainst}</p>
            <p className="text-xs text-slate-600">Goals Against</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold sm:text-3xl ${goalDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {goalDifference > 0 ? '+' : ''}{goalDifference}
            </p>
            <p className="text-xs text-slate-600">Goal Diff</p>
          </div>
        </div>
      </CardContainer>

      {/* Form Chart Placeholder */}
      <CardContainer title="League Position Over Time">
        <LeaguePositionChart fixtures={fixtures} teamId={42} />
      </CardContainer>

      {/* Home/Away Performance Placeholder */}
      <CardContainer title="Home vs Away Performance">
        <div className="flex h-48 items-center justify-center p-4 text-slate-400">
          <div className="text-center">
            <svg className="mx-auto mb-2 h-16 w-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            <p className="text-sm">Performance breakdown coming soon</p>
          </div>
        </div>
      </CardContainer>
    </div>
  )
}
