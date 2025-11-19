// app/squad/components/squad-grid-card-details.tsx
"use client"

import { PlayerStatistics } from "@/lib/api-football/schemas/players"

type PlayerStatsPanelProps = {
  player: PlayerStatistics
  onClose: () => void
}

export default function PlayerStatsPanel({ player, onClose }: PlayerStatsPanelProps) {
  const plStats = player.statistics.find(s => s.league.id === 39)

  return (
    <div className="rounded-lg border-2 border-red-500 bg-white p-6">
      {/* Top row: personal info + close */}
      <div className="mb-4 flex items-start justify-between gap-6">
        {/* Personal info (no photo or big name header) */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          {player.player.age != null && (
            <div>
              <p className="text-xs text-slate-500">Age</p>
              <p className="font-medium text-slate-900">{player.player.age}</p>
            </div>
          )}
          {player.player.nationality && (
            <div>
              <p className="text-xs text-slate-500">Nationality</p>
              <p className="font-medium text-slate-900">
                {player.player.nationality}
              </p>
            </div>
          )}
          {player.player.height && (
            <div>
              <p className="text-xs text-slate-500">Height</p>
              <p className="font-medium text-slate-900">{player.player.height}</p>
            </div>
          )}
          {player.player.weight && (
            <div>
              <p className="text-xs text-slate-500">Weight</p>
              <p className="font-medium text-slate-900">{player.player.weight}</p>
            </div>
          )}
          {player.player.birth?.date && (
            <div>
              <p className="text-xs text-slate-500">Date of Birth</p>
              <p className="font-medium text-slate-900">
                {new Date(player.player.birth.date).toLocaleDateString()}
              </p>
            </div>
          )}
          {player.player.birth?.place && (
            <div>
              <p className="text-xs text-slate-500">Place of Birth</p>
              <p className="font-medium text-slate-900">
                {player.player.birth.place}
              </p>
            </div>
          )}
        </div>

        {/* Close button + context label */}
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={onClose}
            className="text-slate-400 transition-colors hover:text-slate-700"
            aria-label="Close player stats"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="mb-4 border-t" />

      {/* Stats grid */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <StatCard
          label="Appearances"
          value={plStats?.games?.appearences ?? 0}
          subtext={`${plStats?.games?.lineups ?? 0} starts`}
        />
        <StatCard
          label="Minutes"
          value={plStats?.games?.minutes ?? 0}
          subtext={
            plStats?.games?.minutes && plStats.games.appearences
              ? `${Math.round(
                  plStats.games.minutes / plStats.games.appearences
                )} per game`
              : undefined
          }
        />
        <StatCard
          label="Goals"
          value={plStats?.goals?.total ?? 0}
          subtext={`${plStats?.penalty?.scored ?? 0} penalties`}
        />
        <StatCard
          label="Assists"
          value={plStats?.goals?.assists ?? 0}
        />
        <StatCard
          label="Shots"
          value={plStats?.shots?.total ?? 0}
          subtext={`${plStats?.shots?.on ?? 0} on target`}
        />
        <StatCard
          label="Pass Accuracy"
          value={
            plStats?.passes?.accuracy != null
              ? `${plStats.passes.accuracy}%`
              : "N/A"
          }
          subtext={`${plStats?.passes?.key ?? 0} key passes`}
        />
        <StatCard
          label="Tackles"
          value={plStats?.tackles?.total ?? 0}
          subtext={`${plStats?.tackles?.interceptions ?? 0} interceptions`}
        />
        <StatCard
          label="Cards"
          value={`${plStats?.cards?.yellow ?? 0}Y ${plStats?.cards?.red ?? 0}R`}
        />
        <StatCard
          label="Dribbles"
          value={plStats?.dribbles?.success ?? 0}
          subtext={`${plStats?.dribbles?.attempts ?? 0} attempts`}
        />
        <StatCard
          label="Duels Won"
          value={plStats?.duels?.won ?? 0}
          subtext={`of ${plStats?.duels?.total ?? 0} total`}
        />
        <StatCard
          label="Fouls Drawn"
          value={plStats?.fouls?.drawn ?? 0}
        />
        <StatCard
          label="Average Rating"
          value={
            plStats?.games?.rating
              ? Number(plStats.games.rating).toFixed(2)
              : "N/A"
          }
        />
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  subtext,
}: {
  label: string
  value: string | number
  subtext?: string
}) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="mb-1 text-xs text-slate-600">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      {subtext && <p className="mt-1 text-xs text-slate-500">{subtext}</p>}
    </div>
  )
}
