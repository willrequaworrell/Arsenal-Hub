// app/(season)/page.tsx
import { getFixtures } from "@/lib/data/fixtures"
import MatchList from "./components/match-list"
import Stats from "./components/stats"

export default async function SeasonPage() {
  const { data: fixtures, success } = await getFixtures()

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 sm:gap-6 sm:px-[5%] sm:py-[2%] lg:flex-row">
      {/* Left Column - Scrollable Match List */}
      <div className="flex-1 lg:w-[61.8%]">
        <MatchList fixtures={fixtures || []} />
      </div>

      {/* Right Column - Sticky Stats */}
      <div className="lg:w-[38.2%]">
        <div className="lg:sticky lg:top-4">
          <Stats fixtures={fixtures || []} />
        </div>
      </div>
    </div>
  )
}
