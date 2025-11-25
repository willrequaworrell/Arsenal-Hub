// app/squad/components/squad-grid-card-details.tsx
"use client"

import { PlayerStatistics } from "@/lib/api-football/schemas/players"

type PlayerStatsPanelProps = {
  player: PlayerStatistics
  onClose: () => void
}

export default function PlayerStatsPanel({ player, onClose }: PlayerStatsPanelProps) {
  const plStats = player.statistics.find(s => s.league.id === 39)
  const pInfo = player.player
  const position = plStats?.games?.position // "Goalkeeper", "Defender", etc.
  const isGoalkeeper = position === "Goalkeeper"

  // Helper to format rating color
  const getRatingColor = (rating: string | null) => {
    const r = parseFloat(rating || "0")
    if (r >= 7.5) return "text-emerald-600 bg-emerald-50"
    if (r >= 7.0) return "text-green-600 bg-green-50"
    if (r >= 6.0) return "text-yellow-600 bg-yellow-50"
    return "text-slate-600 bg-slate-50"
  }

  return (
    <div className="relative outline-4 outline-red-500 bg-white p-8 shadow-sm animate-in fade-in zoom-in-95 duration-200">
      
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 transition-colors"
        aria-label="Close details"
      >
        ✕
      </button>

      {/* 1. Personal Info (Shared) */}
      <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-6 border-b pb-6">
        <InfoItem label="Age" value={pInfo.age} />
        <InfoItem label="Nationality" value={pInfo.nationality} />
        <InfoItem 
          label="Height" 
          value={pInfo.height ? `${pInfo.height}` : null} 
        />
        <InfoItem 
          label="Weight" 
          value={pInfo.weight ? `${pInfo.weight}` : null} 
        />
      </div>

      {/* 2. Key Stats Hero Row (Shared) */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-slate-50 p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Playing Time</span>
          <div className="mt-2">
            <div className="text-3xl font-bold text-slate-900">{plStats?.games?.appearences ?? 0}</div>
            <div className="text-sm text-slate-500 flex justify-between">
              <span>Apps</span>
              <span>{plStats?.games?.minutes ?? 0} mins</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Rating</span>
          <div className="mt-2 flex items-end gap-2">
            <span className={`text-3xl font-bold px-2 py-0.5 rounded-md ${getRatingColor(plStats?.games?.rating ?? null)}`}>
              {plStats?.games?.rating ? parseFloat(plStats.games.rating).toFixed(2) : "N/A"}
            </span>
            <span className="text-sm text-slate-400 mb-1">Avg</span>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Discipline</span>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="h-6 w-4 rounded-[2px] bg-yellow-400 shadow-sm"></div>
              <span className="text-xl font-bold text-slate-700">{plStats?.cards?.yellow ?? 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-6 w-4 rounded-[2px] bg-red-500 shadow-sm"></div>
              <span className="text-xl font-bold text-slate-700">{plStats?.cards?.red ?? 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Position Specific Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* CASE A: GOALKEEPER */}
        {isGoalkeeper ? (
          <>
            {/* GK Specifics */}
            <StatGroup title="Goalkeeping">
              <StatRow label="Saves" value={plStats?.goals?.saves ?? 0} />
              <StatRow label="Goals Conceded" value={plStats?.goals?.conceded ?? 0} />
              {/* API often puts clean sheets in a weird spot or calc it manually, keeping simple for now */}
              <StatRow label="Penalties Saved" value={plStats?.penalty?.saved ?? 0} />
            </StatGroup>

            {/* Distribution (Key for modern GKs) */}
            <StatGroup title="Distribution">
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Pass Accuracy</span>
                  <span className="font-bold text-slate-900">{plStats?.passes?.accuracy ?? 0}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${plStats?.passes?.accuracy ?? 0}%` }} 
                  />
                </div>
              </div>
              <StatRow label="Total Passes" value={plStats?.passes?.total ?? 0} />
            </StatGroup>

            {/* Defensive Actions (Sweeper Keeper stuff) */}
            <StatGroup title="Defense">
               <StatRow label="Duels Won" value={plStats?.duels?.won ?? 0} />
               <StatRow label="Fouls Won" value={plStats?.fouls?.drawn ?? 0} />
            </StatGroup>
          </>
        ) : (
          
        /* CASE B: OUTFIELD PLAYERS (Def/Mid/Att) */
          <>
            <StatGroup title="Attack">
              <StatRow label="Goals" value={plStats?.goals?.total ?? 0} />
              <StatRow label="Assists" value={plStats?.goals?.assists ?? 0} />
              <StatRow 
                label="Shots (On Target)" 
                value={`${plStats?.shots?.total ?? 0}`} 
                subValue={`(${plStats?.shots?.on ?? 0})`} 
              />
              <StatRow label="Dribbles Succ." value={plStats?.dribbles?.success ?? 0} />
            </StatGroup>

            <StatGroup title="Possession">
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Pass Accuracy</span>
                  <span className="font-bold text-slate-900">{plStats?.passes?.accuracy ?? 0}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${plStats?.passes?.accuracy ?? 0}%` }} 
                  />
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
  )
}

// -- Helper Components --

function InfoItem({ label, value }: { label: string, value: string | number | null }) {
  if (!value) return null
  return (
    <div>
      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
      <p className="font-medium text-slate-900">{value}</p>
    </div>
  )
}

function StatGroup({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-sm font-bold text-slate-900 border-b pb-2 mb-3">{title}</h4>
      <div className="space-y-3">
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
        {value} <span className="text-xs text-slate-400 font-normal">{subValue}</span>
      </span>
    </div>
  )
}
