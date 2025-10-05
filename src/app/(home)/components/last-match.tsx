import Image from "next/image";
import CardContainer from "@/components/ui/custom/card-container"
import { FixtureTeamSchema, GoalsSchema } from "@/lib/api-football/schemas/fixtures";
import z from "zod";

import missingLogo from "../../../../public/missingLogo.png"

type FixtureTeam = z.infer<typeof FixtureTeamSchema>
type Goals = z.infer<typeof GoalsSchema>

type LastMatchProps = {
  homeTeam: FixtureTeam
  awayTeam: FixtureTeam
  goals: Goals
}

const LastMatch = ({homeTeam, awayTeam, goals}: LastMatchProps) => {
  return (
    <CardContainer
      title="Last Result"
    >
      <div className="flex flex-col">
        <div className="flex p-1 font-bold gap-x-2">
          <Image width={50} height={50} src={homeTeam.logo || missingLogo } alt="Arsenal Logo Badge" className="size-6" />
          <p className="flex-1">{homeTeam.name}</p>
          <p className="text-xl">{goals.home}</p>
        </div>
        <div className="flex p-1 font-bold gap-x-2">
          <Image width={50} height={50} src={awayTeam.logo || missingLogo} alt="Manchester City Logo Badge" className="size-6" />
          <p className="flex-1">{awayTeam.name}</p>
          <p className="text-xl">{goals.away}</p>
        </div>

      </div>
    </CardContainer>
  )
}

export default LastMatch