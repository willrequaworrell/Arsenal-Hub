// app/(season)/components/match-details.tsx
import { Fixture } from "@/lib/api-football/schemas/fixtures"
import Image from "next/image"
import missingLogo from "../../../../public/missingLogo.png"

type MatchDetailsProps = {
  fixture: Fixture
  isHomeTeam: boolean
  configuredTeamName: string
}

export default function MatchDetails({ fixture, isHomeTeam, configuredTeamName }: MatchDetailsProps) {
  const { teams, goals, score, fixture: fixtureData } = fixture
  const homeTeam = teams.home
  const awayTeam = teams.away
  
  // Determine which team is configured team and opponent
  const yourTeam = isHomeTeam ? homeTeam : awayTeam
  const opponent = isHomeTeam ? awayTeam : homeTeam
  const yourScore = isHomeTeam ? goals.home : goals.away
  const opponentScore = isHomeTeam ? goals.away : goals.home

  return (
    <div className="border-t bg-gradient-to-b from-slate-50 to-white p-6 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="mx-auto max-w-4xl space-y-6">
        
        {/* Match Header with Team Badges */}
        <div className="flex items-center justify-between">
          {/* Your Team */}
          <div className="flex flex-col items-center gap-2">
            <Image
              src={yourTeam.logo || missingLogo}
              alt={yourTeam.name}
              width={64}
              height={64}
              className="size-16"
            />
            <p className="text-sm font-semibold text-center">{yourTeam.name}</p>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold">{yourScore}</span>
              <span className="text-2xl text-slate-400">-</span>
              <span className="text-4xl font-bold">{opponentScore}</span>
            </div>
            <p className="text-xs text-slate-500">{fixtureData.status.long}</p>
            {score.halftime.home !== null && (
              <p className="text-xs text-slate-400">
                HT: {isHomeTeam ? score.halftime.home : score.halftime.away} - {isHomeTeam ? score.halftime.away : score.halftime.home}
              </p>
            )}
          </div>

          {/* Opponent */}
          <div className="flex flex-col items-center gap-2">
            <Image
              src={opponent.logo || missingLogo}
              alt={opponent.name}
              width={64}
              height={64}
              className="size-16"
            />
            <p className="text-sm font-semibold text-center">{opponent.name}</p>
          </div>
        </div>

        {/* Match Info */}
        {(fixtureData.venue.name || fixtureData.referee) && (
          <div className="flex justify-center gap-4 text-xs text-slate-500">
            {fixtureData.venue.name && (
              <span>📍 {fixtureData.venue.name}</span>
            )}
            {fixtureData.referee && (
              <span>👤 {fixtureData.referee}</span>
            )}
          </div>
        )}

        {/* Match Events Timeline */}
        <div className="rounded-lg border bg-white p-4">
          <h4 className="mb-4 text-sm font-bold">Match Events</h4>
          <div className="relative">
            {/* Center Timeline */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2" />
            
            {/* Events - This would be populated with real data */}
            <div className="space-y-4">
              {/* Placeholder event structure */}
              <div className="text-center text-sm text-slate-400 italic py-8">
                Match events (goals, cards, substitutions) will appear here
                <br />
                <span className="text-xs">Requires events API data</span>
              </div>
            </div>
          </div>
        </div>

        {/* Match Statistics */}
        <div className="rounded-lg border bg-white p-4">
          <h4 className="mb-4 text-sm font-bold text-center">Match Statistics</h4>
          <div className="space-y-4">
            {/* Placeholder stats - would be populated with real API data */}
            {[
              { label: 'Possession', home: 45, away: 55 },
              { label: 'Shots', home: 12, away: 8 },
              { label: 'Shots on Target', home: 5, away: 3 },
              { label: 'Passes', home: 380, away: 420 },
              { label: 'Pass Accuracy', home: 82, away: 86 },
              { label: 'Fouls', home: 11, away: 14 },
              { label: 'Corners', home: 6, away: 10 },
            ].map((stat, idx) => {
              const yourValue = isHomeTeam ? stat.home : stat.away
              const opponentValue = isHomeTeam ? stat.away : stat.home
              const total = yourValue + opponentValue
              const yourPercentage = total > 0 ? (yourValue / total) * 100 : 50
              
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-700 w-12 text-right">{yourValue}</span>
                    <span className="flex-1 text-center text-xs text-slate-500">{stat.label}</span>
                    <span className="font-semibold text-slate-700 w-12">{opponentValue}</span>
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
          
          <p className="mt-4 text-center text-xs text-slate-400 italic">
            Statistics are placeholders - requires statistics API data
          </p>
        </div>

      </div>
    </div>
  )
}
