"use client"

import Image from "next/image"
import { ChevronDown } from "lucide-react"
import { PlayerStatistics } from "@/lib/api-football/schemas/players"

type PlayerCardProps = {
  player: PlayerStatistics
  isExpanded: boolean
  onClick: () => void
}

// app/squad/components/player-card.tsx
export default function PlayerCard({ player, isExpanded, onClick }: PlayerCardProps) {
  const plStats = player.statistics.find(s => s.league.id === 39)
  const position = plStats?.games?.position || "Unknown"

  return (
    <div
      onClick={onClick}
      className={`
        relative cursor-pointer rounded-lg border bg-white p-8 transition-all
        hover:shadow-lg hover:scale-[1.02]
        ${isExpanded ? 'ring-2 ring-red-500 shadow-lg' : 'hover:border-slate-300'}
      `}
    >
      {/* Player Photo */}
      <div className="relative aspect-square w-full mb-3 bg-slate-100 rounded-lg overflow-hidden">
        <Image
          src={player.player.photo}
          alt={player.player.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      {/* Player Info */}
      <div className="space-y-1">
        <div>
          <h3 className="font-bold text-lg text-slate-900 truncate">
            {player.player.name}
          </h3>
          <p className="text-sm text-slate-500">{position}</p>
        </div>

        {/* Expand Indicator */}
        <div className="flex justify-end">
          <ChevronDown 
            className={`h-4 w-4 text-slate-400 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>

        {/* Quick Stats */}
        <div className="flex justify-between pt-2 border-t text-xs text-slate-600">
          <div className="text-center">
            <p className="font-semibold text-slate-900">
              {plStats?.games?.appearences || 0}
            </p>
            <p className="text-slate-500">Apps</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-slate-900">
              {plStats?.goals?.total || 0}
            </p>
            <p className="text-slate-500">Goals</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-slate-900">
              {plStats?.goals?.assists || 0}
            </p>
            <p className="text-slate-500">Assists</p>
          </div>
        </div>
      </div>
    </div>
  )
}
