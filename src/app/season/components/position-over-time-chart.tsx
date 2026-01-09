"use client"

import { useMemo } from "react"
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartConfig } from "@/components/ui/chart"
import { Fixture } from "@/lib/schemas/fixtures"
import { calculateLeaguePositionOverTime } from "../util/position-over-time"

type LeaguePositionChartProps = {
  fixtures: Fixture[]
  teamId: number
}

const chartConfig = {
  position: {
    label: "Position",
    color: "#EF0107",
  },
} satisfies ChartConfig

export default function LeaguePositionChart({ fixtures, teamId }: LeaguePositionChartProps) {
  const positionData = useMemo(() => {
    try {
      return calculateLeaguePositionOverTime(fixtures, teamId)
    } catch (error) {
      console.error("Error calculating league position:", error)
      return []
    }
  }, [fixtures, teamId])

  if (positionData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center p-4 text-slate-400 rounded-lg bg-white">
        <p className="text-sm">No position data available</p>
      </div>
    )
  }

  const yTicks = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
  
  const xTicks = positionData
    .map(d => d.matchweek)
    .filter(mw => mw % 2 === 1)

  return (
    <div className="h-64 w-full rounded-lg bg-slate-50 p-4">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={positionData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <defs>
              <linearGradient id="positionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EF0107" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#EF0107" stopOpacity={0.08} />
              </linearGradient>
            </defs>

            <CartesianGrid 
              strokeDasharray="2 4" 
              vertical={false}
              stroke="#B2B8D0"
            />

            <XAxis
              dataKey="matchweek"
              type="number"
              domain={['dataMin', 'dataMax']}
              ticks={xTicks}
              allowDecimals={false}
              tick={{ fontSize: 10 }}
              axisLine={{ stroke: '#B2B8D0' }}
              tickLine={{ stroke: '#B2B8D0' }}
              label={{ 
                value: 'Matchweek', 
                position: 'insideBottom', 
                offset: -10,
                style: { fontSize: 12 }
              }}
            />

            <YAxis
              reversed
              domain={[1, 20]}
              ticks={yTicks}
              allowDecimals={false}
              tick={{ fontSize: 10 }}
              axisLine={{ stroke: '#B2B8D0' }}
              tickLine={{ stroke: '#B2B8D0' }}
              width={24}
              label={{ 
                value: 'Position', 
                angle: -90, 
                position: 'insideLeft',
                offset: -10,
                style: { fontSize: 12 }
              }}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const position = payload[0].payload.position
                  
                  return (
                    <div className="rounded-lg border bg-white p-2 shadow-sm">
                      <p className="text-xs font-medium">
                        Matchweek {payload[0].payload.matchweek}
                      </p>
                      <p className="text-xs text-slate-600">
                        Position: {position}
                        {position === 1 ? 'st' : position === 2 ? 'nd' : position === 3 ? 'rd' : 'th'}
                      </p>
                      <p className="text-xs text-slate-600">
                        Points: {payload[0].payload.points}
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />

            <Area
              type="monotone"
              dataKey="position"
              stroke="#EF0107"
              strokeWidth={3}
              fill="url(#positionGradient)"
              baseValue={20}
              dot={false}
              activeDot={{
                r: 7,
                fill: "#1d293d",
                stroke: "#fff",
                strokeWidth: 2,
              }}
              animationDuration={1000}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
