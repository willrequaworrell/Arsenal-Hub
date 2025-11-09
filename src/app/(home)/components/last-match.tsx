import Image from "next/image"
import CardContainer from "@/components/ui/custom/card-container"
import { FixtureTeamSchema, GoalsSchema } from "@/lib/api-football/schemas/fixtures"
import z from "zod"

import missingLogo from "../../../../public/missingLogo.png"
import { getFixtures } from "@/lib/data/fixtures"
import DataUnavailable from "@/components/ui/custom/data-unavailable"
import { getTeamAbbreviation } from "@/lib/api-football/team-data"
import { DEFAULT_TEAM_ID } from "@/lib/config/api-football"

type FixtureTeam = z.infer<typeof FixtureTeamSchema>
type Goals = z.infer<typeof GoalsSchema>

const LastMatch = async () => {
  const { data: fixtures, success } = await getFixtures(DEFAULT_TEAM_ID)
  
  if (!success || !fixtures || fixtures.length < 2) {
    return (
      <CardContainer title="Last Result">
        <DataUnavailable message="Last match data unavailable" />
      </CardContainer>
    )
  }
  
  const lastResult = fixtures[fixtures.length - 2]
  const homeTeam = lastResult.teams.home
  const awayTeam = lastResult.teams.away
  const goals = lastResult.goals

  return (
    <CardContainer title="Last Result">
      <div className="flex h-full flex-col justify-center gap-y-2">
        <div className="flex items-center gap-x-2 p-1">
          <Image 
            width={50} 
            height={50} 
            src={homeTeam.logo || missingLogo} 
            alt={`${homeTeam.name} logo`} 
            className="size-6" 
          />
          <p className="flex-1 font-semibold text-[clamp(0.875rem,1.5vw,1rem)]">
            {/* Show abbreviation on mobile, full name on larger screens */}
            <span className="sm:hidden">{getTeamAbbreviation(homeTeam.id)}</span>
            <span className="hidden sm:inline">{homeTeam.name}</span>
          </p>
          <p className="font-bold text-[clamp(1rem,2vw,2rem)]">
            {goals.home}
          </p>
        </div>
        
        <div className="flex items-center gap-x-2 p-1">
          <Image 
            width={50} 
            height={50} 
            src={awayTeam.logo || missingLogo} 
            alt={`${awayTeam.name} logo`} 
            className="size-6" 
          />
          <p className="flex-1 font-semibold text-[clamp(0.875rem,1.5vw,1rem)]">
            {/* Show abbreviation on mobile, full name on larger screens */}
            <span className="sm:hidden">{getTeamAbbreviation(awayTeam.id)}</span>
            <span className="hidden sm:inline">{awayTeam.name}</span>
          </p>
          <p className="font-bold text-[clamp(1rem,2vw,2rem)]">
            {goals.away}
          </p>
        </div>
      </div>
    </CardContainer>
  )
}

export default LastMatch
