import { DEFAULT_TEAM_ID } from "@/lib/config/api-football"
import { getFixtures } from "@/lib/data/fixtures"
import MatchList from "./components/match-list"
import Stats from "./components/stats"

// app/(season)/page.tsx
export default async function SeasonPage() {
  // Single fetch for all league fixtures
  const { data: allFixtures, success } = await getFixtures()

  // Filter to team fixtures on server (fast, happens once)
  const teamFixtures = allFixtures?.filter(f => 
    f.teams.home.id === Number(DEFAULT_TEAM_ID) || 
    f.teams.away.id === Number(DEFAULT_TEAM_ID)
  ) || []

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 sm:gap-6 sm:px-[5%] sm:py-[2%] lg:flex-row">
      <div className="flex-1 lg:w-[61.8%]">
        <MatchList fixtures={teamFixtures} />
      </div>

      <div className="lg:w-[38.2%]">
        <div className="lg:sticky lg:top-4">
          <Stats 
            teamFixtures={teamFixtures}
            allFixtures={allFixtures || []} 
          />
        </div>
      </div>
    </div>
  )
}
