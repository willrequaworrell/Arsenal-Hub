// app/squad/components/squad-grid.tsx
"use client"

import { useState } from "react"
import { PlayerStatistics } from "@/lib/schemas/players"
import PlayerCard from "./squad-grid-card"
import PlayerStatsPanel from "./squad-grid-card-details"
import { useMediaQuery } from "@/hooks/use-media-query"

type SquadGridProps = {
  players: PlayerStatistics[]
}

export default function SquadGrid({ players }: SquadGridProps) {
  const [expandedPlayerId, setExpandedPlayerId] = useState<number | null>(null)

  // Match Tailwind breakpoints (min-width approach)
  const isXl = useMediaQuery('(min-width: 1280px)')  // xl: 4 cols
  const isLg = useMediaQuery('(min-width: 1024px)')  // lg: 3 cols  
  const isSm = useMediaQuery('(min-width: 640px)')   // sm: 2 cols
  // default: 1 col

  // Determine cards per row based on breakpoint
  const CARDS_PER_ROW = isXl ? 4 : isLg ? 3 : isSm ? 2 : 1

  // Group players by position
  const grouped = players.reduce((acc, player) => {
    const plStats = player.statistics.find(s => s.league.id === 39)
    const position = plStats?.games?.position || "Unknown"
    if (!acc[position]) acc[position] = []
    acc[position].push(player)
    return acc
  }, {} as Record<string, PlayerStatistics[]>)

  const positionOrder = ["Goalkeeper", "Defender", "Midfielder", "Attacker"]

  const expandedPlayer = expandedPlayerId
    ? players.find(p => p.player.id === expandedPlayerId)
    : null

  return (
    <div className="space-y-8">
      {positionOrder.map(position => {
        const playersInPosition = grouped[position] || []
        if (playersInPosition.length === 0) return null

        // Chunk players into rows based on current breakpoint
        const rows: PlayerStatistics[][] = []
        for (let i = 0; i < playersInPosition.length; i += CARDS_PER_ROW) {
          rows.push(playersInPosition.slice(i, i + CARDS_PER_ROW))
        }

        return (
          <div key={position}>
            <h2 className="text-xl font-semibold mb-4 text-slate-700">
              {position}s
            </h2>
            
            <div className="space-y-8">
              {rows.map((row, index) => {
                const isPanelActiveForRow = row.some(
                  p => p.player.id === expandedPlayerId
                )

                return (
                  <div key={index}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                      {row.map(player => (
                        <PlayerCard
                          key={player.player.id}
                          player={player}
                          isExpanded={expandedPlayerId === player.player.id}
                          onClick={() => setExpandedPlayerId(
                            expandedPlayerId === player.player.id ? null : player.player.id
                          )}
                        />
                      ))}
                    </div>

                    {isPanelActiveForRow && expandedPlayer && (
                      // UPDATED: increased margin to mt-8 to match grid gap
                      <div className="mt-8">
                        <PlayerStatsPanel
                          player={expandedPlayer}
                          onClose={() => setExpandedPlayerId(null)}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
