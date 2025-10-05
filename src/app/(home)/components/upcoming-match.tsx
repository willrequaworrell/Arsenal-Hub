import Image from "next/image";
import CardContainer from "@/components/ui/custom/card-container"
import MatchCountdown from "./match-countdown"
import { FixtureTeamSchema, VenueSchema } from "@/lib/api-football/schemas/fixtures";
import z from "zod";

import missingLogo from "../../../../public/missingLogo.png"
import { formatDate } from "../util/date-formatter";


type FixtureTeam = z.infer<typeof FixtureTeamSchema>
type Venue = z.infer<typeof VenueSchema>

type UpcomingMatchProps = {
  homeTeam: FixtureTeam
  awayTeam: FixtureTeam
  venue: Venue
  date: Date 
}

const UpcomingMatch = ({homeTeam, awayTeam, venue, date}: UpcomingMatchProps) => {


  return (
    <CardContainer title="Upcoming Match">
      <div className="flex flex-col h-full">
        <div className="flex flex-col items-center flex-1 p-1">
          <div className="relative flex justify-between w-full px-8">
            <div className="flex flex-col items-center font-bold">
              <Image width={50} height={50} src={homeTeam.logo || missingLogo } alt={`${homeTeam.name} logo`} className="size-16" />
              <p>{homeTeam.name}</p>
            </div>
            <p className="absolute left-1/2 -translate-x-1/2 bottom-0 -translate-y-1/3 text-4xl font-bold">vs.</p>
            <div className="flex flex-col items-center font-bold">
              <Image width={50} height={50} src={awayTeam.logo || missingLogo} alt={`${awayTeam.name} logo`} className="size-16" />
              <p>{awayTeam.name}</p>
            </div>
          </div>
          <div className="text-center text-sm text-slate-600">
            <p>{formatDate(date)}</p>
            <p>{venue.name}</p>
          </div>
        </div>
        <MatchCountdown />
      </div>
    </CardContainer>
  )
}

export default UpcomingMatch
