"use client"

type SeasonSummaryProps = {
  played: number
  wins: number
  draws: number
  losses: number
  totalGoalsFor: number
  totalGoalsAgainst: number
  goalDifference: number
}

export default function SeasonSummary({
  played,
  wins,
  draws,
  losses,
  totalGoalsFor,
  totalGoalsAgainst,
  goalDifference,
}: SeasonSummaryProps) {
  const points = wins * 3 + draws
  const ppg = played > 0 ? (points / played).toFixed(2) : "0.00"

  const winPercent = played > 0 ? (wins / played) * 100 : 0
  const drawPercent = played > 0 ? (draws / played) * 100 : 0
  const lossPercent = played > 0 ? (losses / played) * 100 : 0

  const totalGoals = totalGoalsFor + totalGoalsAgainst
  const gfPercent = totalGoals > 0 ? (totalGoalsFor / totalGoals) * 100 : 0
  const gaPercent = totalGoals > 0 ? (totalGoalsAgainst / totalGoals) * 100 : 0

  return (
    <div className="space-y-4">
      {/* Results Section */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-sm font-semibold text-slate-500">Record</h3>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="font-medium">{points} pts</span>
            <span className="text-slate-400">•</span>
            <span>{ppg} PPG</span>
          </div>
        </div>

        <div className="rounded-lg bg-slate-50 p-4">
          <div className="flex w-full rounded-lg overflow-hidden">
            <div 
              className="bg-green-600 flex items-center justify-center text-white font-semibold text-sm transition-all hover:brightness-110"
              style={{ width: `${winPercent}%` }}
            >
              {wins > 0 && `${wins}W`}
            </div>
            
            <div 
              className="bg-yellow-500 flex items-center justify-center text-white font-semibold text-sm transition-all hover:brightness-110"
              style={{ width: `${drawPercent}%` }}
            >
              {draws > 0 && `${draws}D`}
            </div>
            
            <div 
              className="bg-red-600 flex items-center justify-center text-white font-semibold text-sm transition-all hover:brightness-110"
              style={{ width: `${lossPercent}%` }}
            >
              {losses > 0 && `${losses}L`}
            </div>
          </div>

          <div className="flex justify-between mt-3 text-xs text-slate-500">
            <span>{played} games played</span>
            <span>{((wins / played) * 100).toFixed(1)}% win rate</span>
          </div>
        </div>
      </div>

      {/* Goals Section */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-sm font-semibold text-slate-500">Goal Difference</h3>
          <div className={`text-sm font-semibold ${
            goalDifference >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {goalDifference > 0 ? '+' : ''}{goalDifference} GD
          </div>
        </div>

        <div className="rounded-lg bg-slate-50 p-4">
          <div className="flex w-full rounded-lg overflow-hidden">
            <div 
              className="bg-green-600 flex items-center justify-center text-white font-semibold text-sm transition-all hover:brightness-110"
              style={{ width: `${gfPercent}%` }}
            >
              {totalGoalsFor} GF
            </div>
            
            <div 
              className="bg-red-600 flex items-center justify-center text-white font-semibold text-sm transition-all hover:brightness-110"
              style={{ width: `${gaPercent}%` }}
            >
              {totalGoalsAgainst} GA
            </div>
          </div>

          <div className="flex justify-between mt-3 text-xs text-slate-500">
            <span>{(totalGoalsFor / played).toFixed(1)} goals/game</span>
            <span>{(totalGoalsAgainst / played).toFixed(1)} conceded/game</span>
          </div>
        </div>
      </div>
    </div>
  )
}
