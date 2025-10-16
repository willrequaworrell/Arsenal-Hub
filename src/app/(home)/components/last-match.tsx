import Image from "next/image";
import CardContainer from "@/components/ui/custom/card-container"
import { FixtureTeamSchema, GoalsSchema } from "@/lib/api-football/schemas/fixtures";
import z from "zod";

import missingLogo from "../../../../public/missingLogo.png"
import { getFixtures } from "@/lib/data/fixtures";
import DataUnavailable from "@/components/ui/custom/data-unavailable";

type FixtureTeam = z.infer<typeof FixtureTeamSchema>
type Goals = z.infer<typeof GoalsSchema>


const LastMatch = async () => {
  const {data: fixtures, success} = await getFixtures();
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
    <CardContainer
      title="Last Result"
    >
      <div className="flex flex-col">
        <div className="flex p-1 font-bold gap-x-2">
          <Image width={50} height={50} src={homeTeam.logo || missingLogo } alt={`${homeTeam.name} logo`} className="size-6" />
          <p className="flex-1">{homeTeam.name}</p>
          <p className="text-xl">{goals.home}</p>
        </div>
        <div className="flex p-1 font-bold gap-x-2">
          <Image width={50} height={50} src={awayTeam.logo || missingLogo} alt={`${awayTeam.name} logo`} className="size-6" />
          <p className="flex-1">{awayTeam.name}</p>
          <p className="text-xl">{goals.away}</p>
        </div>

      </div>
    </CardContainer>
  )
}

export default LastMatch