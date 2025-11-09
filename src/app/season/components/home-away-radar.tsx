// app/(season)/components/home-away-radar.tsx
"use client"

import { useMemo } from "react"
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartConfig } from "@/components/ui/chart"
import { Fixture } from "@/lib/api-football/schemas/fixtures"
import { calculateHomeAwayStats, transformToRadarData } from "../util/home-away-stats"

type HomeAwayRadarProps = {
  fixtures: Fixture[]
  teamId: number
}

const chartConfig = {
  home: {
    label: "Home",
    color: "#EF0107",
  },
  away: {
    label: "Away",
    color: "#1d4ed8",
  },
} satisfies ChartConfig

export default function HomeAwayRadar({ fixtures, teamId }: HomeAwayRadarProps) {
  const radarData = useMemo(() => {
    const stats = calculateHomeAwayStats(fixtures, teamId)
    return transformToRadarData(stats)
  }, [fixtures, teamId])

  return (
    <>
      {/* Custom Legend - positioned outside chart container */}
      <div className="mb-3 flex items-center gap-4 rounded-lg bg-slate-50 px-4 py-2.5 w-fit">
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: '#EF0107' }}
          />
          <span className="text-xs font-medium text-slate-600">
            Home
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: '#1d4ed8' }}
          />
          <span className="text-xs font-medium text-slate-600">
            Away
          </span>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-80 w-full rounded-lg bg-slate-50 p-4">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="#B2B8D0" />

              <PolarAngleAxis
                dataKey="metric"
                tick={{ fontSize: 11, fill: '#64748b' }}
              />

              <Radar
                name="Home"
                dataKey="home"
                stroke="#EF0107"
                fill="#EF0107"
                fillOpacity={0.2}
                strokeWidth={2}
              />

              <Radar
                name="Away"
                dataKey="away"
                stroke="#1d4ed8"
                fill="#1d4ed8"
                fillOpacity={0.2}
                strokeWidth={2}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload

                    // Format based on metric type
                    const formatValue = (metric: string, raw: number) => {
                      if (metric === 'Goals For' || metric === 'Goals Against') {
                        return `${raw.toFixed(2)}/game`
                      }
                      return `${raw.toFixed(1)}%`
                    }

                    return (
                      <div className="rounded-lg border bg-white p-2 shadow-sm">
                        <p className="text-xs font-medium mb-1">
                          {data.fullMetric}
                        </p>
                        <p className="text-xs text-red-600">
                          Home: {formatValue(data.metric, data.homeRaw)}
                        </p>
                        <p className="text-xs text-blue-600">
                          Away: {formatValue(data.metric, data.awayRaw)}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </>
  )
}
