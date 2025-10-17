


import StandingsTable from "./components/standings-table";
import Performance from "./components/performance";
import LastMatch from "./components/last-match";
import UpcomingMatch from "./components/upcoming-match";
import News from "./components/news";


export default async function Home() {

  return (
    <div className="flex flex-1 gap-x-6  px-[5%] py-[2%]">
      <div className="flex flex-col flex-1 gap-y-6  w-[61.8%]">

        <div className="flex gap-x-6 h-[30%]">
          <Performance
          />
          <LastMatch
          />
        </div>

        <div className="h-[70%] ">
          <News/>
        </div>

      </div>
      <div className="flex flex-col gap-y-6 w-[38.2%]">
        <UpcomingMatch
        />
        <StandingsTable />
      </div>
    </div>
  );
}
