"use client"

import { Fixture } from "@/lib/api-football/schemas/fixtures"
import { FixtureStatistics } from "@/lib/api-football/schemas/statistics"
import { FixtureEvents } from "@/lib/api-football/schemas/fixture-events"
import { getContrastingTeamColors } from "@/lib/api-football/team-data"
import MatchPossessionChart from "./match-row-details-possession"
import DataUnavailable from "@/components/ui/custom/data-unavailable"
import MatchEvents from "./match-row-details-events"
import MatchH2H from "./match-row-details-h2h-stats"
import MatchRowDetailsLegend from "./match-row-details-legend"
import { getMatchStat } from "../util/get-match-stat"

type MatchDetailsProps = {
  fixture: Fixture
  isHomeTeam: boolean
  statistics: FixtureStatistics | null
  events: FixtureEvents | null
  onClose: () => void
}

const MatchDetails = ({fixture, isHomeTeam, statistics, events, onClose}: MatchDetailsProps) => {
  if (!statistics || !events) {
    return (
      <div className="border-t p-6 animate-in fade-in slide-in-from-top-2 duration-200 bg-slate-50">
        <div className="mx-auto max-w-5xl ">
          <DataUnavailable message="Match Details Unavailable" />
        </div>
      </div>
    )
  }

  const { teams } = fixture
  const homeTeam = teams.home
  const awayTeam = teams.away
  const yourTeam = isHomeTeam ? homeTeam : awayTeam
  const opponentTeam = isHomeTeam ? awayTeam : homeTeam
  const homeStats = statistics.find(s => s.team.id === homeTeam.id)
  const awayStats = statistics.find(s => s.team.id === awayTeam.id)

  // Get team colors with contrast adjustment
  const { yourColor: yourTeamColor, opponentColor: opponentTeamColor } = getContrastingTeamColors(yourTeam.id, opponentTeam.id)


  // Get possession data
  const possessionData = getMatchStat('Ball Possession', isHomeTeam, homeStats, awayStats)

  // Filter and sort match events
  const matchEvents = events
    .filter(e => e.type === "Goal" || e.type === "Card" || e.type === "subst")
    .sort((a, b) => a.time.elapsed - b.time.elapsed)

  return (
    <div className=" bg-white p-6 animate-in fade-in slide-in-from-top-2 duration-200">

      <div className="mx-auto max-w-5xl">
        {/* Header with Legend and Close Button */}
        <div className="flex items-center justify-between mb-6">
          {/* Legend with team colors */}
          <MatchRowDetailsLegend 
            yourTeamId={yourTeam.id}
            yourTeamColor={yourTeamColor}
            opponentId={opponentTeam.id}
            opponentTeamColor={opponentTeamColor}
          />

          {/* Close Button */}
          <button
            className="group flex items-center gap-2 px-4 py-3 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            onClick={onClose}
            aria-label="Hide match details"
          >
            Close <span className="group-hover:text-red-400 transition-opacity">✕</span>
          </button>
        </div>

        <div className="space-y-6">
          {/* Top Section: Possession Chart + Match Events Timeline */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Possession Donut Chart */}
            <MatchPossessionChart
              yourTeam={yourTeam}
              opponentTeam={opponentTeam}
              statistics={statistics}
              possessionData={possessionData}
              yourTeamColor={yourTeamColor}
              opponentTeamColor={opponentTeamColor}
            />

            {/* Match Events Timeline */}
            <MatchEvents events={matchEvents} />
          </div>

          <MatchH2H
            yourTeamColor={yourTeamColor}
            opponentTeamColor={opponentTeamColor}
            isHomeTeam={isHomeTeam}
            homeStats={homeStats}
            awayStats={awayStats}
          />
        </div>

      </div>
    </div>
  )
}

export default MatchDetails