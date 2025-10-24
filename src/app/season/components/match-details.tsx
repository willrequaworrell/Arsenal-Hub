// app/(season)/components/match-details.tsx
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
import { FixtureEvents } from "@/lib/api-football/schemas/fixture-events"
import { getTeamAbbreviation } from "@/lib/api-football/team-data"

type MatchDetailsProps = {
  fixture: Fixture
  isHomeTeam: boolean
  statistics: FixtureStatistics | null
  events: FixtureEvents | null
}

export default function MatchDetails({
  fixture,
  isHomeTeam,
  statistics,
  events,
}: MatchDetailsProps) {
  const { teams, goals, score, fixture: fixtureData } = fixture
  const homeTeam = teams.home
  const awayTeam = teams.away

  const yourTeam = isHomeTeam ? homeTeam : awayTeam
  const opponent = isHomeTeam ? awayTeam : homeTeam
  const yourScore = isHomeTeam ? goals.home : goals.away
  const opponentScore = isHomeTeam ? goals.away : goals.home

  // Parse statistics data
  const homeStats = statistics?.find(s => s.team.id === homeTeam.id)
  const awayStats = statistics?.find(s => s.team.id === awayTeam.id)

  const getStat = (type: string) => {
    const homeStat = homeStats?.statistics.find(s => s.type === type)?.value ?? 0
    const awayStat = awayStats?.statistics.find(s => s.type === type)?.value ?? 0
    return { home: homeStat, away: awayStat }
  }

  // Get possession percentages
  const { home: homePossession, away: awayPossession } = getStat('Ball Possession')
  const yourPossession = isHomeTeam ? homePossession : awayPossession
  const opponentPossession = isHomeTeam ? awayPossession : homePossession

  // Parse possession values
  const yourPossessionNum = typeof yourPossession === 'string'
    ? parseInt(yourPossession)
    : Number(yourPossession)
  const opponentPossessionNum = typeof opponentPossession === 'string'
    ? parseInt(opponentPossession)
    : Number(opponentPossession)

  // Chart data
  const chartData = [
    { team: opponent.name, possession: opponentPossessionNum, fill: "#1F2937" },
    { team: yourTeam.name, possession: yourPossessionNum, fill: "#EF4444" },
  ]

  const chartConfig = {
    possession: {
      label: "Possession",
    },
  } satisfies ChartConfig

  // Filter for goals only
  const goals_events = events?.filter(e => e.type === "Goal") ?? []

  // Key stats to display
  const statsToShow = [
    { key: 'Shots on Goal', label: 'Shots on Goal' },
    { key: 'Total Shots', label: 'Shot Attempts' },
    { key: 'Yellow Cards', label: 'Yellow Cards' },
    { key: 'Corner Kicks', label: 'Corner Kicks' },
    { key: 'Goalkeeper Saves', label: 'Saves' },
  ]

  return (
    <div className="border-t bg-white p-6 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="mx-auto max-w-5xl">
        
        {/* Legend - Top Left */}
        {(statistics || events) && (
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <span className="text-xs font-medium text-slate-600">
                {getTeamAbbreviation(yourTeam.id)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-gray-800" />
              <span className="text-xs font-medium text-slate-600">
                {getTeamAbbreviation(opponent.id)}
              </span>
            </div>
          </div>
        )}

        {(!statistics && !events) ? (
          <div className="py-12 text-center text-sm text-slate-400">
            Match details unavailable
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Section: Possession Chart + Match Events */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Possession Donut Chart */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <h3 className="text-sm font-semibold text-slate-600">Possession</h3>

                {statistics ? (
                  <>
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

                    <div className="flex items-center gap-6 text-lg font-bold">
                      <span className="text-red-500">{yourPossessionNum}%</span>
                      <span className="text-gray-800">{opponentPossessionNum}%</span>
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center text-sm text-slate-400">
                    Statistics unavailable
                  </div>
                )}
              </div>

              {/* Match Events - Goals */}
              <div>
                <h3 className="mb-4 text-sm font-semibold text-slate-600">Goals</h3>
                <div className="space-y-2 rounded-lg bg-slate-50 p-4 min-h-[250px]">
                  {goals_events.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-8">
                      {events ? "No goals scored" : "Events unavailable"}
                    </p>
                  ) : (
                    goals_events.map((goal, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm bg-white rounded p-2">
                        <span className="font-mono text-xs font-semibold text-slate-600 w-10">
                          {goal.time.elapsed}'
                        </span>
                        <Image
                          src={goal.team.logo}
                          alt={goal.team.name}
                          width={20}
                          height={20}
                          className="size-5"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">{goal.player.name}</p>
                          {goal.assist.name && (
                            <p className="text-xs text-slate-500">
                              Assist: {goal.assist.name}
                            </p>
                          )}
                        </div>
                        <span className="text-lg">⚽</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Section: Detailed Stats */}
            {statistics && (
              <div className="space-y-3 border-t pt-6">
                {statsToShow.map((stat) => {
                  const { home, away } = getStat(stat.key)
                  const yourValue = isHomeTeam ? home : away
                  const opponentValue = isHomeTeam ? away : home

                  const yourNum = typeof yourValue === 'string' && yourValue.includes('%')
                    ? parseInt(yourValue)
                    : Number(yourValue)
                  const opponentNum = typeof opponentValue === 'string' && opponentValue.includes('%')
                    ? parseInt(opponentValue)
                    : Number(opponentValue)

                  const total = yourNum + opponentNum
                  const yourPercentage = total > 0 ? (yourNum / total) * 100 : 50

                  return (
                    <div key={stat.key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm w-12 text-left">{yourValue}</span>
                        <span className="flex-1 text-center text-xs font-medium text-slate-600">
                          {stat.label}
                        </span>
                        <span className="font-bold text-sm w-12 text-right">{opponentValue}</span>
                      </div>
                      <div className="flex h-1.5 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="bg-red-500"
                          style={{ width: `${yourPercentage}%` }}
                        />
                        <div
                          className="bg-gray-800"
                          style={{ width: `${100 - yourPercentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
