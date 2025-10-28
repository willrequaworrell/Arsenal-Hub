"use client"

import { Fixture } from "@/lib/api-football/schemas/fixtures"
import { FixtureStatistics } from "@/lib/api-football/schemas/statistics"
import Image from "next/image"
import missingLogo from "../../../../public/missingLogo.png"
import { Pie, PieChart } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { FixtureEvents, Event } from "@/lib/api-football/schemas/fixture-events"
import { getTeamAbbreviation, getContrastingTeamColors } from "@/lib/api-football/team-data"
import { X } from "lucide-react"
import MatchEvent from "./match-row-details-event"

type MatchDetailsProps = {
  fixture: Fixture
  isHomeTeam: boolean
  statistics: FixtureStatistics | null
  events: FixtureEvents | null
  onClose: () => void
}

// Stat configuration for easy modification
const STATS_CONFIG = [
  { key: 'expected_goals', label: 'Expected Goals (xG)' },
  { key: 'Total Shots', label: 'Shot Attempts' },
  { key: 'Shots on Goal', label: 'Shots on Target' },
  { key: 'Total passes', label: 'Total Passes' },
  { key: 'Passes %', label: 'Pass Accuracy' },
  { key: 'Corner Kicks', label: 'Corner Kicks' },
]

export default function MatchDetails({
  fixture,
  isHomeTeam,
  statistics,
  events,
  onClose,
}: MatchDetailsProps) {
  const { teams } = fixture
  const homeTeam = teams.home
  const awayTeam = teams.away

  const yourTeam = isHomeTeam ? homeTeam : awayTeam
  const opponent = isHomeTeam ? awayTeam : homeTeam

  const homeStats = statistics?.find(s => s.team.id === homeTeam.id)
  const awayStats = statistics?.find(s => s.team.id === awayTeam.id)

  // Get team colors with contrast adjustment
  const { 
    yourColor: yourTeamColor, 
    opponentColor: opponentTeamColor 
  } = getContrastingTeamColors(yourTeam.id, opponent.id)


  /**
   * Unified function to get and parse stats for your team vs opponent
   * Returns both raw values and parsed numbers in one go
   */
  const getMatchStat = (type: string) => {
    // Get raw values from API
    const homeValue = homeStats?.statistics.find(s => s.type === type)?.value ?? 0
    const awayValue = awayStats?.statistics.find(s => s.type === type)?.value ?? 0
    
    // Determine which value belongs to your team vs opponent
    const yourValue = isHomeTeam ? homeValue : awayValue
    const opponentValue = isHomeTeam ? awayValue : homeValue
    
    // Parse to numbers
    const parseValue = (value: string | number | null): number => {
      if (value === null || value === undefined) return 0
      if (typeof value === 'string') {
        return parseFloat(value.replace('%', ''))
      }
      return Number(value)
    }
    
    return {
      yourValue,
      opponentValue,
      yourNum: parseValue(yourValue),
      opponentNum: parseValue(opponentValue),
    }
  }

  // Get possession data using unified function
  const possession = getMatchStat('Ball Possession')

  // Chart data with team colors
  const chartData = [
    { team: opponent.name, possession: possession.opponentNum, fill: opponentTeamColor },
    { team: yourTeam.name, possession: possession.yourNum, fill: yourTeamColor },
  ]

  const chartConfig: ChartConfig = {
    possession: {
      label: "Possession",
    },
  } 

  // Filter and sort all match events
  const matchEvents = events?.filter(e =>
    e.type === "Goal" || e.type === "Card" || e.type === "subst"
  ).sort((a, b) => a.time.elapsed - b.time.elapsed) ?? []

  // Format display value (keep % sign if original had it)
  const formatValue = (value: string | number | null, statKey: string): string => {
    if (value === null || value === undefined) return '0'
    if (typeof value === 'string' && value.includes('%')) return value
    if (typeof value === 'number' && statKey === 'expected_goals') {
      return value.toFixed(2) // Format xG to 2 decimals
    }
    return String(value)
  }

  return (
    <div className="border-t bg-white p-6 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="mx-auto max-w-5xl">

        {/* Header with Legend and Close Button */}
        {(statistics || events) && (
          <div className="flex items-center justify-between mb-6">
            {/* Legend with team colors */}
            <div className="flex items-center gap-4 rounded-lg bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: yourTeamColor }}
                />
                <span className="text-xs font-medium text-slate-600">
                  {getTeamAbbreviation(yourTeam.id)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: opponentTeamColor }}
                />
                <span className="text-xs font-medium text-slate-600">
                  {getTeamAbbreviation(opponent.id)}
                </span>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-3 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Hide match details"
            >
              <span>Close</span>
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {(!statistics && !events) ? (
          <div className="py-12 text-center text-sm text-slate-400">
            Match details unavailable
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Section: Possession Chart + Match Events Timeline */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Possession Donut Chart */}
              <div className="flex flex-col">
                <h3 className="mb-4 text-sm font-semibold text-slate-600">Possession</h3>
                <div className="rounded-lg bg-slate-50 p-4 flex flex-col items-center justify-center h-[300px]">
                  {statistics ? (
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative">
                        <ChartContainer
                          config={chartConfig}
                          className="mx-auto aspect-square h-[200px]"
                        >
                          <PieChart>
                            <ChartTooltip
                              cursor={false}
                              content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                              data={chartData}
                              dataKey="possession"
                              nameKey="team"
                              innerRadius={60}
                              outerRadius={80}
                              strokeWidth={2}
                              startAngle={90}
                              endAngle={-270}
                            />
                          </PieChart>
                        </ChartContainer>

                        {/* Center logos overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex items-center gap-2">
                            <Image
                              src={yourTeam.logo || missingLogo}
                              alt={yourTeam.name}
                              width={28}
                              height={28}
                              className="size-7"
                            />
                            <div className="h-8 w-px bg-slate-300" />
                            <Image
                              src={opponent.logo || missingLogo}
                              alt={opponent.name}
                              width={28}
                              height={28}
                              className="size-7"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-lg font-bold text-slate-900">
                        <span>{possession.yourNum}%</span>
                        <span>{possession.opponentNum}%</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 text-center">
                      Statistics unavailable
                    </p>
                  )}
                </div>
              </div>

              {/* Match Events Timeline */}
              <div className="flex flex-col">
                <h3 className="mb-4 text-sm font-semibold text-slate-600">Match Events</h3>
                <div className="rounded-lg bg-slate-50 p-4 h-[300px] overflow-y-auto space-y-2">
                  {matchEvents.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-xs text-slate-400 text-center">
                        {events ? "No events recorded" : "Events unavailable"}
                      </p>
                    </div>
                  ) : (
                    matchEvents.map((event, idx) => (
                      <MatchEvent key={idx} event={event} />
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Section: Detailed Stats */}
            {statistics && (
              <div className="flex flex-col">
                <h3 className="mb-4 text-sm font-semibold text-slate-600">Stats</h3>
                <div className="rounded-lg bg-slate-50 p-4 space-y-3">
                  {STATS_CONFIG.map((stat) => {
                    const { yourValue, opponentValue, yourNum, opponentNum } = getMatchStat(stat.key)

                    const total = yourNum + opponentNum
                    const yourPercentage = total > 0 ? (yourNum / total) * 100 : 50

                    return (
                      <div key={stat.key}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm w-16 text-left">
                            {formatValue(yourValue, stat.key)}
                          </span>
                          <span className="flex-1 text-center text-xs font-medium text-slate-600">
                            {stat.label}
                          </span>
                          <span className="font-bold text-sm w-16 text-right">
                            {formatValue(opponentValue, stat.key)}
                          </span>
                        </div>
                        <div className="flex h-1.5 overflow-hidden rounded-full bg-slate-200">
                          <div
                            style={{
                              width: `${yourPercentage}%`,
                              backgroundColor: yourTeamColor
                            }}
                          />
                          <div
                            style={{
                              width: `${100 - yourPercentage}%`,
                              backgroundColor: opponentTeamColor
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

