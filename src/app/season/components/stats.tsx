import CardContainer from "@/components/ui/custom/card-container"
import { Fixture } from "@/lib/schemas/fixtures"
import LeaguePositionChart from "./position-over-time-chart"
import HomeAwayRadar from "./home-away-radar"
import { DEFAULT_TEAM_ID } from "@/lib/config/api-football"
import SeasonSummary from "./summary"
import { calculateSeasonSummary } from "../util/calculate-season-summary"

type StatsProps = {
  teamFixtures: Fixture[]
  allFixtures: Fixture[]
}

export default function Stats({ teamFixtures, allFixtures }: StatsProps) {
  
  const { 
    played, 
    wins, 
    draws, 
    losses, 
    totalGoalsFor, 
    totalGoalsAgainst, 
    goalDifference 
  } = calculateSeasonSummary(teamFixtures, Number(DEFAULT_TEAM_ID))

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <CardContainer title="SEASON SUMMARY" className="p-6">
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

      <CardContainer title="LEAGUE POSITION OVER TIME" className="p-6">
        <LeaguePositionChart 
          fixtures={allFixtures} 
          teamId={Number(DEFAULT_TEAM_ID)} 
        />
      </CardContainer>

      <CardContainer title="HOME VS. AWAY" className="p-6">
        <HomeAwayRadar 
          fixtures={teamFixtures} 
          teamId={Number(DEFAULT_TEAM_ID)} 
        />
      </CardContainer>
    </div>
  )
}
