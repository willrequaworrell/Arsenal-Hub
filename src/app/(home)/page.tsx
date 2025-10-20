// app/(home)/page.tsx
import StandingsTable from "./components/standings-table"
import Performance from "./components/performance"
import LastMatch from "./components/last-match"
import UpcomingMatch from "./components/upcoming-match"
import News from "./components/news"

export default async function Home() {
  return (
    <div className="flex flex-1 flex-col gap-y-4 px-[5%] py-[5%] sm:gap-y-6 sm:py-[2%] lg:flex-row lg:gap-x-6">
      {/* Left Column - Main Content */}
      <div className="flex flex-1 flex-col gap-y-4 sm:gap-y-6 lg:w-[61.8%]">

        {/* Performance & Last Match Row */}
        <div className="flex gap-x-4 sm:gap-x-6 lg:h-[30%] min-h-[200px]">
          <div className="flex-1"> 
            <Performance />
          </div>
          <div className="flex-1"> 
            <LastMatch />
          </div>
        </div>

        {/* News Widget */}
        <div className="h-[400px] lg:h-[70%]">
          <News />
        </div>
      </div>

      {/* Right Column - Sidebar */}
      <div className="flex flex-col gap-y-4 sm:gap-y-6 lg:w-[38.2%]">
        <UpcomingMatch />
        <StandingsTable />
      </div>
    </div>
  )
}
