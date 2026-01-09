import { getPlayers } from "@/lib/data/players"
import { DEFAULT_TEAM_ID } from "@/lib/config/api-football"
import SquadGrid from "./components/squad-grid"

export default async function SquadPage() {
  const { data: players, success } = await getPlayers(DEFAULT_TEAM_ID)

  if (!success || !players) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">Failed to load squad data</p>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-[5%] sm:py-[2%]">
      <SquadGrid players={players} />
    </div>
  )
}
