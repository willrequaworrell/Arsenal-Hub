"use client"

import { PlayerStatistics } from "@/lib/api-football/schemas/players"
import Image from "next/image"

type PlayerStatsPanelProps = {
  player: PlayerStatistics
  onClose: () => void
}

export default function PlayerStatsPanel({ player, onClose }: PlayerStatsPanelProps) {
  const playerInfo = player.player
  const stats = player.statistics[0] // Premier League stats

  return (
    <div className="rounded-lg bg-white border-2 border-red-500 p-6 animate-in slide-in-from-top-4 duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 rounded-full overflow-hidden bg-slate-100">
            <Image
              src={playerInfo.photo}
              alt={playerInfo.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{playerInfo.name}</h2>
            <p className="text-slate-600">
              {stats?.games?.position} • #{stats?.games?.number}
            </p>
            <p className="text-sm text-slate-500">
              {playerInfo.nationality} • {playerInfo.age} years old
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Core Stats - Always visible */}
        <StatCard label="Appearances" value={stats?.games?.appearences || 0}
          subtext={`${stats?.games?.lineups || 0} starts`} />
        <StatCard label="Minutes" value={stats?.games?.minutes || 0} />
        <StatCard label="Goals" value={stats?.goals?.total || 0}
          subtext={stats?.penalty?.scored ? `${stats.penalty.scored} penalties` : undefined} />
        <StatCard label="Assists" value={stats?.goals?.assists || 0} />

        {/* Attack Stats */}
        <StatCard label="Shots" value={stats?.shots?.total || 0}
          subtext={stats?.shots?.on ? `${stats.shots.on} on target` : undefined} />
        <StatCard label="Dribbles" value={stats?.dribbles?.success || 0}
          subtext={stats?.dribbles?.attempts ? `${stats.dribbles.attempts} attempts` : undefined} />
        <StatCard label="Key Passes" value={stats?.passes?.key || 0} />

        {/* Defensive Stats */}
        <StatCard label="Tackles" value={stats?.tackles?.total || 0} />
        <StatCard label="Interceptions" value={stats?.tackles?.interceptions || 0} />
        <StatCard label="Duels Won" value={stats?.duels?.won || 0}
          subtext={`of ${stats?.duels?.total || 0}`} />

        {/* Discipline */}
        <StatCard label="Fouls Drawn" value={stats?.fouls?.drawn || 0} />
        <StatCard label="Cards" value={`${stats?.cards?.yellow || 0}Y ${stats?.cards?.red || 0}R`} />

        {/* Performance */}
        <StatCard label="Average Rating"
          value={stats?.games?.rating ? parseFloat(stats.games.rating).toFixed(2) : "N/A"} />

      </div>

      {/* Personal Info */}
      <div className="mt-6 pt-6 border-t grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        {playerInfo.height && (
          <div>
            <p className="text-slate-500">Height</p>
            <p className="font-medium">{playerInfo.height}</p>
          </div>
        )}
        {playerInfo.weight && (
          <div>
            <p className="text-slate-500">Weight</p>
            <p className="font-medium">{playerInfo.weight}</p>
          </div>
        )}
        {playerInfo.birth?.date && (
          <div>
            <p className="text-slate-500">Date of Birth</p>
            <p className="font-medium">
              {new Date(playerInfo.birth.date).toLocaleDateString()}
            </p>
          </div>
        )}
        {playerInfo.birth?.place && (
          <div>
            <p className="text-slate-500">Place of Birth</p>
            <p className="font-medium">{playerInfo.birth.place}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper component for stat cards
function StatCard({
  label,
  value,
  subtext
}: {
  label: string
  value: string | number
  subtext?: string
}) {
  return (
    <div className="bg-slate-50 rounded-lg p-4">
      <p className="text-xs text-slate-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
    </div>
  )
}
