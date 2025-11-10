// app/(season)/components/stats.tsx
import CardContainer from "@/components/ui/custom/card-container"
import { Fixture } from "@/lib/api-football/schemas/fixtures"
import LeaguePositionChart from "./position-over-time-chart"
import HomeAwayRadar from "./home-away-radar"
import { DEFAULT_TEAM_ID } from "@/lib/config/api-football"
import SeasonSummary from "./summary"

type StatsProps = {
  teamFixtures: Fixture[]
  allFixtures: Fixture[]
}

export default function Stats({ teamFixtures, allFixtures }: StatsProps) {
  // Calculate basic stats
  const finishedMatches = teamFixtures.filter(f => 
    ["FT", "AET", "PEN"].includes(f.fixture.status.short)
  )
  
  const played = finishedMatches.length
  
  const wins = finishedMatches.filter(f => {
    const isHome = f.teams.home.id === Number(DEFAULT_TEAM_ID)
    const homeWin = (f.goals.home ?? 0) > (f.goals.away ?? 0)
    const awayWin = (f.goals.away ?? 0) > (f.goals.home ?? 0)
    return (isHome && homeWin) || (!isHome && awayWin)
  }).length

  const draws = finishedMatches.filter(f => 
    f.goals.home === f.goals.away
  ).length

  const losses = played - wins - draws

  const totalGoalsFor = finishedMatches.reduce((sum, f) => {
    const isHome = f.teams.home.id === Number(DEFAULT_TEAM_ID)
    return sum + (isHome ? (f.goals.home ?? 0) : (f.goals.away ?? 0))
  }, 0)

  const totalGoalsAgainst = finishedMatches.reduce((sum, f) => {
    const isHome = f.teams.home.id === Number(DEFAULT_TEAM_ID)
    return sum + (isHome ? (f.goals.away ?? 0) : (f.goals.home ?? 0))
  }, 0)

  const goalDifference = totalGoalsFor - totalGoalsAgainst

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Season Summary - NEW VISUAL */}
      <CardContainer title="Season Summary">
        <SeasonSummary
          played={played}
          wins={wins}
          draws={draws}
          losses={losses}
          totalGoalsFor={totalGoalsFor}
          totalGoalsAgainst={totalGoalsAgainst}
          goalDifference={goalDifference}
        />
      </CardContainer>

      {/* League Position Over Time */}
      <CardContainer title="League Position Over Time">
        <LeaguePositionChart 
          fixtures={allFixtures} 
          teamId={Number(DEFAULT_TEAM_ID)} 
        />
      </CardContainer>

      {/* Home/Away Performance */}
      <CardContainer title="Home vs Away Performance">
        <HomeAwayRadar 
          fixtures={teamFixtures} 
          teamId={Number(DEFAULT_TEAM_ID)} 
        />
      </CardContainer>
    </div>
  )
}
