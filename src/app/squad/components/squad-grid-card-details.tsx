// app/squad/components/squad-grid-card-details.tsx
"use client"

import { PlayerStatistics } from "@/lib/api-football/schemas/players"
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts"

type PlayerStatsPanelProps = {
  player: PlayerStatistics
  onClose: () => void
}

export default function PlayerStatsPanel({ player, onClose }: PlayerStatsPanelProps) {
  const plStats = player.statistics.find(s => s.league.id === 39)
  const pInfo = player.player
  const position = plStats?.games?.position
  const isGoalkeeper = position === "Goalkeeper"

  const formatUnit = (value: string | number | null, unit: string) => {
    if (!value) return null
    const valStr = String(value)
    if (valStr.toLowerCase().includes(unit.toLowerCase())) return valStr
    return `${valStr} ${unit}`
  }

  const heightDisplay = formatUnit(pInfo.height, "cm")
  const weightDisplay = formatUnit(pInfo.weight, "kg")

  const rawRating = plStats?.games?.rating ? parseFloat(plStats.games.rating) : 0
  const ratingColor = 
    rawRating >= 7.5 ? "#10b981" : 
    rawRating >= 7.0 ? "#22c55e" : 
    rawRating >= 6.0 ? "#eab308" : 
    "#94a3b8"

  const ratingData = [{ value: rawRating, fill: ratingColor }]

  return (
    <div className="relative w-full outline-4 outline-red-500 bg-white p-6 sm:p-8 shadow-sm animate-in fade-in zoom-in-95 duration-200">
      
      <button
        onClick={onClose}
        className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 transition-colors z-10"
        aria-label="Close details"
      >
        ✕
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-2">
        
        {/* Left Column: Profile & Hero Stats */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* 1. Profile Summary Card */}
          <div className="rounded-xl bg-slate-50 p-5 flex flex-col gap-4">
            <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider border-b border-slate-200 pb-2">
              Player Profile
            </span>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
              <InfoItem label="Age" value={pInfo.age} />
              <InfoItem label="Nationality" value={pInfo.nationality} />
              <InfoItem label="Height" value={heightDisplay} />
              <InfoItem label="Weight" value={weightDisplay} />
            </div>
          </div>

          {/* 2. Playing Time - Side by Side Layout */}
          <div className="rounded-xl bg-slate-50 p-5 flex flex-col">
            <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider border-b border-slate-200 pb-2 w-full">
              Playing Time
            </span>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <div className="text-4xl font-bold text-slate-900 leading-none">
                  {plStats?.games?.appearences ?? 0}
                </div>
                <span className="text-xs text-slate-400 font-medium mt-1 block">Apps</span>
              </div>
              <div className="border-l border-slate-200/50 pl-4">
                <div className="text-4xl font-bold text-slate-900 leading-none">
                  {plStats?.games?.minutes ?? 0}
                </div>
                <span className="text-xs text-slate-400 font-medium mt-1 block">Minutes</span>
              </div>
            </div>
          </div>

          {/* 3. Performance (Rating) */}
          <div className="rounded-xl bg-slate-50 p-5 flex flex-col overflow-hidden">
            <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider border-b border-slate-200 pb-2 w-full z-10">
              Performance
            </span>
            
            <div className="mt-4 flex items-end justify-between relative z-10">
              <div>
                <div className="text-4xl font-bold text-slate-900 leading-none">
                  {rawRating > 0 ? rawRating.toFixed(2) : "N/A"}
                </div>
                <span className="text-xs text-slate-400 font-medium mt-1 block">Avg Rating</span>
              </div>

              {/* Chart Container */}
              <div className="h-16 w-16 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    innerRadius="70%" 
                    outerRadius="100%" 
                    barSize={8} 
                    data={ratingData} 
                    startAngle={90} 
                    endAngle={-270}
                  >
                    <PolarAngleAxis type="number" domain={[0, 10]} angleAxisId={0} tick={false} />
                    <RadialBar background dataKey="value" cornerRadius={0} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 4. Discipline */}
          <div className="rounded-xl bg-slate-50 p-5 flex flex-col">
            <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider border-b border-slate-200 pb-2 w-full">
              Discipline
            </span>
            <div className="mt-4 flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-6 rounded-[2px] bg-yellow-400 shadow-sm border border-yellow-500/20"></div>
                <span className="text-3xl font-bold text-slate-700">{plStats?.cards?.yellow ?? 0}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-6 rounded-[2px] bg-red-500 shadow-sm border border-red-600/20"></div>
                <span className="text-3xl font-bold text-slate-700">{plStats?.cards?.red ?? 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Stat Groups (Unchanged) */}
        <div className="lg:col-span-2 space-y-8 min-w-0 py-2">
          {isGoalkeeper ? (
            <>
              <StatGroup title="Goalkeeping">
                <StatRow label="Saves" value={plStats?.goals?.saves ?? 0} />
                <StatRow label="Goals Conceded" value={plStats?.goals?.conceded ?? 0} />
                <StatRow label="Penalties Saved" value={plStats?.penalty?.saved ?? 0} />
              </StatGroup>

              <StatGroup title="Distribution">
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Pass Accuracy</span>
                    <span className="font-bold text-slate-900">{plStats?.passes?.accuracy ?? 0}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${plStats?.passes?.accuracy ?? 0}%` }} />
                  </div>
                </div>
                <StatRow label="Total Passes" value={plStats?.passes?.total ?? 0} />
              </StatGroup>
            </>
          ) : (
            <>
              <StatGroup title="Attack">
                <StatRow label="Goals" value={plStats?.goals?.total ?? 0} />
                <StatRow label="Assists" value={plStats?.goals?.assists ?? 0} />
                <StatRow label="Shots (On Target)" value={`${plStats?.shots?.total ?? 0}`} subValue={`(${plStats?.shots?.on ?? 0})`} />
                <StatRow label="Dribbles Succ." value={plStats?.dribbles?.success ?? 0} />
              </StatGroup>

              <StatGroup title="Possession">
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Pass Accuracy</span>
                    <span className="font-bold text-slate-900">{plStats?.passes?.accuracy ?? 0}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${plStats?.passes?.accuracy ?? 0}%` }} />
                  </div>
                </div>
                <StatRow label="Total Passes" value={plStats?.passes?.total ?? 0} />
                <StatRow label="Key Passes" value={plStats?.passes?.key ?? 0} />
              </StatGroup>

              <StatGroup title="Defense">
                <StatRow label="Tackles" value={plStats?.tackles?.total ?? 0} />
                <StatRow label="Interceptions" value={plStats?.tackles?.interceptions ?? 0} />
                <StatRow label="Duels Won" value={plStats?.duels?.won ?? 0} />
                <StatRow label="Blocks" value={plStats?.tackles?.blocks ?? 0} />
              </StatGroup>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// -- Helper Components --
function InfoItem({ label, value }: { label: string, value: string | number | null }) {
  if (!value) return null
  return (
    <div>
      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
      <p className="font-medium text-slate-900 leading-tight">{value}</p>
    </div>
  )
}

function StatGroup({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">{title}</h4>
      <div className="space-y-3 px-1">
        {children}
      </div>
    </div>
  )
}

function StatRow({ label, value, subValue }: { label: string, value: string | number, subValue?: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-slate-600">{label}</span>
      <span className="font-semibold text-slate-900">
        {value} <span className="text-xs text-slate-400 font-normal ml-1">{subValue}</span>
      </span>
    </div>
  )
}
