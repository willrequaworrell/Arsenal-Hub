import Image from "next/image";

import arsLogo from '../../../public/arsenal_logo.png'
import mcLogo from '../../../public/mancity_logo.png'
import newLogo from '../../../public/newcastle_logo.png'
import newsImg from '../../../public/egNewsImg.jpg'

import CardContainer from "@/components/ui/custom/card-container";
import StandingsTable from "./components/standings-table";
import { getStandings } from "@/lib/data/standings";
import MatchCountdown from "./components/match-countdown";
import { getFixtures } from "@/lib/data/fixtures";
import LastMatch from "./components/last-match";


export default async function Home() {
  const standings = await getStandings();
  const fixtures = await getFixtures();
  const lastResult = fixtures[fixtures.length - 2]
  const upcomingMatch = fixtures[fixtures.length - 1]
  console.log(upcomingMatch)

  return (
    <div className="flex flex-1 gap-x-6  px-[5%] py-[2%]">
      <div className="flex flex-col flex-1 gap-y-6  w-[61.8%]">

        <div className="flex gap-x-6 h-[30%]">
          <CardContainer
            title="Performance"
          >
            <div className="flex justify-between">
              <p className="text-4xl font-bold">3-1-1</p>
              <p className="text-4xl font-bold">D/W/W/W/L</p>

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
        <CardContainer title="Upcoming Match">
          <div className="flex flex-col h-full">
            <div className="flex flex-col items-center flex-1 p-1">
              <div className="relative flex justify-between w-full px-8">
                <div className="flex flex-col items-center font-bold">
                  <Image src={arsLogo} alt="Arsenal Logo Badge" className="size-16" />
                  <p>Arsenal</p>
                </div>
                <p className="absolute left-1/2 -translate-x-1/2 bottom-0 -translate-y-1/3 text-4xl font-bold">vs.</p>
                <div className="flex flex-col items-center font-bold">
                  <Image src={newLogo} alt="Newcastle Logo Badge" className="size-16" />
                  <p>Newcastle</p>
                </div>
              </div>
              <div className="text-center text-sm text-slate-600">
                <p>Sun, Sep 28 // 11:30am</p>
                <p>St. James Park</p>
              </div>
            </div>
            <MatchCountdown/>
          </div>
        </CardContainer>
        
        <CardContainer title="Standings">
          <StandingsTable standings={standings}/>
        </CardContainer>
      </div>
    </div>
  );
}
