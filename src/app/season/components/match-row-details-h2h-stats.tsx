import { FixtureTeamStatistics } from "@/lib/schemas/statistics"
import { getMatchStat } from "../util/get-match-stat"

type MatchH2HProps = {
  yourTeamColor: string
  opponentTeamColor: string
  isHomeTeam: boolean
  homeStats?: FixtureTeamStatistics
  awayStats?: FixtureTeamStatistics
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

// Format display value
const formatValue = (value: string | number | null, statKey: string): string => {
  if (value === null || value === undefined) return '0'
  if (typeof value === 'string' && value.includes('%')) return value
  if (typeof value === 'number' && statKey === 'expected_goals') {
    return value.toFixed(2)
  }
  return String(value)
}


const MatchH2H = ({ yourTeamColor, opponentTeamColor, isHomeTeam, homeStats, awayStats }: MatchH2HProps) => {
  return (
    <div className="flex flex-col">
      <h3 className="mb-4 text-sm font-semibold text-slate-600">Stats</h3>
      <div className="rounded-lg bg-slate-50 p-4 space-y-3">
        {STATS_CONFIG.map((stat) => {
          const { yourValue, opponentValue, yourNum, opponentNum } = getMatchStat(stat.key, isHomeTeam, homeStats, awayStats)

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
  )
}

export default MatchH2H
