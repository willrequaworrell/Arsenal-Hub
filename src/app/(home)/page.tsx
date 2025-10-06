import Image from "next/image";

import newsImg from '../../../public/egNewsImg.jpg'

import CardContainer from "@/components/ui/custom/card-container";
import StandingsTable from "./components/standings-table";
import { getStandings } from "@/lib/data/standings";
import MatchCountdown from "./components/match-countdown";
import { getFixtures } from "@/lib/data/fixtures";
import LastMatch from "./components/last-match";
import UpcomingMatch from "./components/upcoming-match";
import { getTeamFormAndRecord } from "@/lib/data/team-stats";


export default async function Home() {
  const standings = await getStandings();
  const fixtures = await getFixtures();
  const teamStats = await getTeamFormAndRecord();
  
  const lastResult = fixtures[fixtures.length - 2]
  const upcomingMatch = fixtures[fixtures.length - 1]

  return (
    <div className="flex flex-1 gap-x-6  px-[5%] py-[2%]">
      <div className="flex flex-col flex-1 gap-y-6  w-[61.8%]">

        <div className="flex gap-x-6 h-[30%]">
          <CardContainer
            title="Performance"
          >
            <div className="flex justify-between">
              <p className="text-4xl font-bold">{`${teamStats.record.w}-${teamStats.record.d}-${teamStats.record.l}`}</p>
              <p className="text-4xl font-bold">{teamStats.form.substring(teamStats.form.length - 5 - 1, teamStats.form.length -1)}</p>

            </div>
          </CardContainer>
          <LastMatch
            homeTeam={lastResult.teams.home}
            awayTeam={lastResult.teams.away}
            goals={lastResult.goals}
          />
        </div>

        <div className="h-[70%] ">
          <CardContainer title="News">
            <div className="relative w-full h-full">
              <Image
                src={newsImg}
                alt="Arsenal News Image"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 60vw"
                priority
              />
            </div>
          </CardContainer>
        </div>

      </div>
      <div className="flex flex-col gap-y-6 w-[38.2%]">
        <UpcomingMatch
          homeTeam={upcomingMatch.teams.home}
          awayTeam={upcomingMatch.teams.away}
          venue={upcomingMatch.fixture.venue}
          date={new Date(upcomingMatch.fixture.date)}
        />
        <StandingsTable standings={standings} />
      </div>
    </div>
  );
}
