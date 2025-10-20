// app/(season)/components/match-row.tsx
import Image from "next/image"
import { TableRow, TableCell } from '@/components/ui/table'
import { Fixture } from "@/lib/api-football/schemas/fixtures"
import { getTeamConfig } from "@/lib/config/team"
import missingLogo from "../../../../public/missingLogo.png"
import { cn } from "@/lib/utils"
import { getTeamAbbreviation } from "@/lib/api-football/team-abbreviations"

type MatchRowProps = {
  fixture: Fixture
}

export default function MatchRow({ fixture }: MatchRowProps) {
  const { teams, goals, fixture: fixtureData } = fixture
  const homeTeam = teams.home
  const awayTeam = teams.away
  
  // Get configured team name
  const teamId = process.env.API_FOOTBALL_TEAM_ID || "42"
  const configuredTeam = getTeamConfig(teamId)
  
  // Determine match status
  const status = fixtureData.status.short
  const isFinished = ["FT", "AET", "PEN"].includes(status)
  const isLive = ["1H", "2H", "HT", "ET", "BT", "P"].includes(status)
  const isUpcoming = goals.home === null || goals.away === null
  
  // Determine if configured team is playing and their result
  const isHomeTeam = homeTeam.name === configuredTeam.name
  const isAwayTeam = awayTeam.name === configuredTeam.name
  const isTeamPlaying = isHomeTeam || isAwayTeam
  
  let matchResult: 'win' | 'draw' | 'loss' | null = null
  
  if (isTeamPlaying && !isUpcoming && goals.home !== null && goals.away !== null) {
    if (goals.home === goals.away) {
      matchResult = 'draw'
    } else if (isHomeTeam && goals.home > goals.away) {
      matchResult = 'win'
    } else if (isAwayTeam && goals.away > goals.home) {
      matchResult = 'win'
    } else {
      matchResult = 'loss'
    }
  }
  
  // Get score color based on result
  const getScoreColor = () => {
    if (!matchResult) return ""
    switch (matchResult) {
      case 'win': return "text-green-600"
      case 'draw': return "text-yellow-600"
      case 'loss': return "text-red-600"
    }
  }
  
  // Format date
  const matchDate = new Date(fixtureData.date)
  const formattedDate = matchDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  })

  return (
    <TableRow 
      className={cn(
        "flex items-center",
        isLive && "bg-green-50"
      )}
    >
      {/* Date Column */}
      <TableCell className="w-20 text-xs text-slate-600">
        {formattedDate}
      </TableCell>

      {/* Teams Column (stacked) */}
      <TableCell className="flex-1">
        <div className="flex flex-col gap-2">
          {/* Home Team */}
          <div className="flex items-center gap-2">
            <Image
              src={homeTeam.logo || missingLogo}
              alt={homeTeam.name}
              width={24}
              height={24}
              className="size-6"
            />
            <span className="font-semibold text-sm">
              <span className="sm:hidden">{getTeamAbbreviation(homeTeam.name)}</span>
              <span className="hidden sm:inline">{homeTeam.name}</span>
            </span>
          </div>

          {/* Away Team */}
          <div className="flex items-center gap-2">
            <Image
              src={awayTeam.logo || missingLogo}
              alt={awayTeam.name}
              width={24}
              height={24}
              className="size-6"
            />
            <span className="font-semibold text-sm">
              <span className="sm:hidden">{getTeamAbbreviation(awayTeam.name)}</span>
              <span className="hidden sm:inline">{awayTeam.name}</span>
            </span>
          </div>
        </div>
      </TableCell>

      {/* Score/Status Column (stacked) */}
      <TableCell className="w-16 text-right">
        {isLive && (
          <div className="text-xs font-bold text-green-600 mb-1">LIVE</div>
        )}
        {!isUpcoming && goals.home !== null && goals.away !== null ? (
          <div className="flex flex-col gap-2">
            <span className={cn(
              "text-lg font-bold",
              isTeamPlaying && getScoreColor()
            )}>
              {goals.home}
            </span>
            <span className={cn(
              "text-lg font-bold",
              isTeamPlaying && getScoreColor()
            )}>
              {goals.away}
            </span>
          </div>
        ) : isUpcoming && (
          <div className="text-xs text-slate-500">
            {matchDate.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit"
            })}
          </div>
        )}
      </TableCell>
    </TableRow>
  )
}
