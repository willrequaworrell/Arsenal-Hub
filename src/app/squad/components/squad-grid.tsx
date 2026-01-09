"use client"

import { useState, useMemo } from "react"
import { PlayerStatistics } from "@/lib/schemas/players"
import PlayerCard from "./squad-grid-card"
import PlayerStatsPanel from "./squad-grid-card-details"
import { useMediaQuery } from "@/hooks/use-media-query"

interface SquadGridProps {
  players: PlayerStatistics[]
}

interface SquadSection {
  title: string
  rows: Array<{
    id: string
    players: PlayerStatistics[]
    expandedPlayer: PlayerStatistics | null
  }>
}

export default function SquadGrid({ players }: SquadGridProps) {
  const [expandedPlayerId, setExpandedPlayerId] = useState<number | null>(null)
  
  // match cards per row to screen size to match tailwind
  const isXl = useMediaQuery('(min-width: 1280px)')
  const isLg = useMediaQuery('(min-width: 1024px)')
  const isSm = useMediaQuery('(min-width: 640px)')
  
  const cardsPerRow = isXl ? 4 : isLg ? 3 : isSm ? 2 : 1

  // break out players into sections by position, then into rows based on cardsPerRow (memoized)
  const squadSections = useMemo(() => {
    const positionOrder = ["Attacker", "Midfielder", "Defender", "Goalkeeper"]

    // Group raw players by position
    const groupedPlayers = players.reduce((acc, player) => {
      const plStats = player.statistics.find(s => s.league.id === 39)
      const position = plStats?.games?.position || "Unknown"
      if (!acc[position]) acc[position] = []
      acc[position].push(player)
      return acc
    }, {} as Record<string, PlayerStatistics[]>)

    return positionOrder.reduce<SquadSection[]>((sections, position) => {
      const playersInPosition = groupedPlayers[position] || []
      
      // skip position if empty
      if (playersInPosition.length === 0) return sections

      // Chunk players into rows for the grid
      const rows = []
      for (let i = 0; i < playersInPosition.length; i += cardsPerRow) {
        const rowPlayers = playersInPosition.slice(i, i + cardsPerRow)
        
        // check if expanded player is in this row
        const activePlayerInRow = rowPlayers.find(p => p.player.id === expandedPlayerId)

        rows.push({
          id: `${position}-row-${i}`, 
          players: rowPlayers,
          expandedPlayer: activePlayerInRow || null
        })
      }

      sections.push({
        title: `${position}s`, 
        rows
      })

      return sections
    }, [])

  }, [players, cardsPerRow, expandedPlayerId])

  return (
    <div className="space-y-8">
      {squadSections.map((section) => (
        <div key={section.title}>
          <h2 className="text-xl font-semibold mb-4 text-slate-700">
            {section.title}
          </h2>

          <div className="space-y-8">
            {section.rows.map((row) => (
              <div key={row.id}>
                {/* Grid Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {row.players.map((player) => (
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

                {/* Details Panel */}
                {row.expandedPlayer && (
                  <div className="mt-8">
                    <PlayerStatsPanel
                      player={row.expandedPlayer}
                      onClose={() => setExpandedPlayerId(null)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
