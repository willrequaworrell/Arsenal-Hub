// app/(season)/components/match-row.tsx
'use client'

import { useState } from "react"
import Image from "next/image"
import { TableRow, TableCell } from '@/components/ui/table'
import { Fixture } from "@/lib/api-football/schemas/fixtures"
import { FixtureStatistics } from "@/lib/api-football/schemas/statistics"
import { getTeamConfig } from "@/lib/config/team"
import { getFixtureStatistics } from "@/lib/data/statistics"
import missingLogo from "../../../../public/missingLogo.png"
import { cn } from "@/lib/utils"
import MatchDetails from "./match-details"
import { getTeamAbbreviation } from "@/lib/api-football/team-abbreviations"

type MatchRowProps = {
  fixture: Fixture
}

const RESULT_COLOR_VARIANTS = {
  W: "bg-green-600",
  D: "bg-yellow-500",
  L: "bg-red-600",
} 

export default function MatchRow({ fixture }: MatchRowProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [statistics, setStatistics] = useState<FixtureStatistics | null>(null)
  const [loading, setLoading] = useState(false)
  
  const { teams, goals, fixture: fixtureData } = fixture
  const homeTeam = teams.home
  const awayTeam = teams.away
  
  // Get configured team name
  const teamId = process.env.NEXT_PUBLIC_TEAM_ID || "42"
  const teamObj = getTeamConfig(teamId)
  
  // Determine match status
  const status = fixtureData.status.short
  const isFinished = ["FT", "AET", "PEN"].includes(status)
  const isLive = ["1H", "2H", "HT", "ET", "BT", "P"].includes(status)
  const isUpcoming = goals.home === null || goals.away === null
  
  // Determine if configured team is playing and get opponent
  const isHomeTeam = homeTeam.name === teamObj.name
  const opponent = isHomeTeam ? awayTeam : homeTeam
  const venue = isHomeTeam ? "Home" : "Away"
  
  // Calculate scores from your team's perspective
  const teamScore = isHomeTeam ? goals.home : goals.away
  const opponentScore = isHomeTeam ? goals.away : goals.home
  
  // Determine result
  let matchResult: 'W' | 'D' | 'L' | null = null
  
  if (!isUpcoming && teamScore !== null && opponentScore !== null) {
    if (teamScore === opponentScore) {
      matchResult = 'D'
    } else if (teamScore > opponentScore) {
      matchResult = 'W'
    } else if (teamScore < opponentScore) {
      matchResult = 'L'
    }
  }
  
  // Format date
  const matchDate = new Date(fixtureData.date)
  const formattedDate = matchDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  })

  // Handle expand/collapse with statistics fetching
  const handleExpand = async () => {
    if (!isExpanded && !statistics && isFinished) {
      setLoading(true)
      const result = await getFixtureStatistics(fixtureData.id)
      // console.log(result)
      if (result.success && result.data) {
        setStatistics(result.data)
      }
      setLoading(false)
    }
    setIsExpanded(prev => !prev)
  }

  return (
    <>
      <TableRow 
        onClick={() => isFinished && handleExpand()}
        className={cn(
          "flex items-center py-2",
          isFinished && "cursor-pointer hover:bg-slate-50",
          isLive && "bg-green-50",
          isExpanded && "bg-slate-50"
        )}
      >
        {/* Date Column */}
        <TableCell className="w-20 text-xs text-slate-600">
          {formattedDate}
        </TableCell>

        {/* Opponent */}
        <TableCell className="flex flex-1 items-center gap-2">
          <Image
            src={opponent.logo || missingLogo}
            alt={opponent.name}
            width={28}
            height={28}
            className="size-7"
          />
          <span className="font-semibold text-sm sm:text-base">
            <span className="sm:hidden">{getTeamAbbreviation(opponent.name)}</span>
            <span className="hidden sm:inline">{opponent.name}</span>
          </span>
        </TableCell>

        {/* Home/Away Badge */}
        <TableCell>
          <span className="flex items-center justify-center rounded bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
            {venue}
          </span>
        </TableCell>

        {/* Score - Filled Container with Result Color */}
        <TableCell className="text-center">
          {isLive && (
            <div className="mb-1 text-xs font-bold text-green-600">LIVE</div>
          )}
          {!isUpcoming && teamScore !== null && opponentScore !== null ? (
            <span className={cn(
              "inline-flex items-center justify-center rounded px-3 py-2 text-lg font-bold text-white",
              matchResult ? RESULT_COLOR_VARIANTS[matchResult] : "bg-slate-400"
            )}>
              {teamScore} - {opponentScore}
            </span>
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

      {/* Expanded Details Row */}
      {isExpanded && isFinished && (
        <TableRow className="flex">
          <TableCell colSpan={4} className="w-full p-0">
            <MatchDetails 
              fixture={fixture} 
              isHomeTeam={isHomeTeam}
              configuredTeamName={teamObj.name}
              statistics={statistics}
              loading={loading}
            />
          </TableCell>
        </TableRow>
      )}
    </>
  )
}
