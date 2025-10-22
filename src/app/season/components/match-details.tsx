// app/(season)/components/match-details.tsx
import { Fixture } from "@/lib/api-football/schemas/fixtures"
import { FixtureStatistics } from "@/lib/api-football/schemas/statistics"
import Image from "next/image"
import missingLogo from "../../../../public/missingLogo.png"

type MatchDetailsProps = {
  fixture: Fixture
  isHomeTeam: boolean
  configuredTeamName: string
  statistics: FixtureStatistics | null
  loading: boolean
}

export default function MatchDetails({ 
  fixture, 
  isHomeTeam, 
  configuredTeamName,
  statistics,
  loading 
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

  // Key stats to display
  const statsToShow = [
    { key: 'Ball Possession', label: 'Possession' },
    { key: 'Total Shots', label: 'Shots' },
    { key: 'Shots on Goal', label: 'Shots on Target' },
    { key: 'Total passes', label: 'Passes' },
    { key: 'Passes accurate', label: 'Accurate Passes' },
    { key: 'Fouls', label: 'Fouls' },
    { key: 'Corner Kicks', label: 'Corners' },
  ]

  return (
    <div className="border-t bg-gradient-to-b from-slate-50 to-white p-6 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="mx-auto max-w-4xl space-y-6">
        
        {/* Team Headers - Same as before */}
        <div className="flex items-center justify-between">
          {/* ... your existing header code ... */}
        </div>

        {/* Match Statistics */}
        <div className="rounded-lg border bg-white p-4">
          <h4 className="mb-4 text-sm font-bold text-center">Match Statistics</h4>
          
          {loading && (
            <div className="py-8 text-center text-sm text-slate-400">
              Loading statistics...
            </div>
          )}

          {!loading && !statistics && (
            <div className="py-8 text-center text-sm text-slate-400">
              Statistics unavailable
            </div>
          )}

          {!loading && statistics && (
            <div className="space-y-4">
              {statsToShow.map((stat) => {
                const { home, away } = getStat(stat.key)
                const yourValue = isHomeTeam ? home : away
                const opponentValue = isHomeTeam ? away : home
                
                // Handle percentage values
                const yourNum = typeof yourValue === 'string' && yourValue.includes('%') 
                  ? parseInt(yourValue) 
                  : Number(yourValue)
                const opponentNum = typeof opponentValue === 'string' && opponentValue.includes('%')
                  ? parseInt(opponentValue)
                  : Number(opponentValue)
                
                const total = yourNum + opponentNum
                const yourPercentage = total > 0 ? (yourNum / total) * 100 : 50
                
                return (
                  <div key={stat.key} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-slate-700 w-16 text-right">
                        {yourValue}
                      </span>
                      <span className="flex-1 text-center text-xs text-slate-500">
                        {stat.label}
                      </span>
                      <span className="font-semibold text-slate-700 w-16">
                        {opponentValue}
                      </span>
                    </div>
                    <div className="flex h-2 overflow-hidden rounded-full bg-slate-100">
                      <div 
                        className="bg-red-500"
                        style={{ width: `${yourPercentage}%` }}
                      />
                      <div 
                        className="bg-slate-400"
                        style={{ width: `${100 - yourPercentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
