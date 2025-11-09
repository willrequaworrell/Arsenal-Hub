import Image from "next/image";
import CardContainer from "@/components/ui/custom/card-container"
import MatchCountdown from "./match-countdown"
import { FixtureTeamSchema, VenueSchema } from "@/lib/api-football/schemas/fixtures";
import z from "zod";

import missingLogo from "../../../../public/missingLogo.png"
import { formatDate } from "../util/date-formatter";
import { getFixtures } from "@/lib/data/fixtures";
import DataUnavailable from "@/components/ui/custom/data-unavailable";
import { DEFAULT_TEAM_ID } from "@/lib/config/api-football";


type FixtureTeam = z.infer<typeof FixtureTeamSchema>
type Venue = z.infer<typeof VenueSchema>


const UpcomingMatch = async () => {
  const {data: fixtures, success} = await getFixtures(DEFAULT_TEAM_ID);

  if (!success || !fixtures || fixtures.length < 1) {
    return (
      <CardContainer title="Upcoming Match">
        <DataUnavailable message="Upcoming match data unavailable" />
      </CardContainer>
    )
  }

  const upcomingMatch = fixtures[fixtures.length - 1]
  const homeTeam = upcomingMatch.teams.home
  const awayTeam = upcomingMatch.teams.away
  const venue = upcomingMatch.fixture.venue
  const date = new Date(upcomingMatch.fixture.date)

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
