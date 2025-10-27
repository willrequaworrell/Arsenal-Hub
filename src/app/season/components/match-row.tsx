// app/(season)/components/match-row.tsx
'use client'

import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import { TableRow, TableCell } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Fixture } from "@/lib/api-football/schemas/fixtures"
import { getTeamConfig } from "@/lib/config/team"
import { getFixtureStatistics } from "@/lib/data/fixture-statistics"
import { getFixtureEvents } from "@/lib/data/fixture-events"
import missingLogo from "../../../../public/missingLogo.png"
import { cn } from "@/lib/utils"
import MatchDetails from "./match-details"
import { getTeamAbbreviation } from "@/lib/api-football/team-data"
import MatchRowBadge from "./match-row-badge"
import DataUnavailable from "@/components/ui/custom/data-unavailable"
import MatchDetailsSkeleton from "./match-details-skeleton"

type MatchRowProps = {
  fixture: Fixture
  isExpanded: boolean
  onToggleExpand: () => void
}

const RESULT_COLOR_VARIANTS = {
  W: "bg-green-600",
  D: "bg-yellow-500",
  L: "bg-red-600",
} 

export default function MatchRow({ fixture, isExpanded, onToggleExpand }: MatchRowProps) {
  // Get configured team name
  const teamId = process.env.NEXT_PUBLIC_TEAM_ID || "42"
  const teamObj = getTeamConfig(teamId)
  
  // Determine home/away and opponent
  const { teams, goals, fixture: fixtureData } = fixture
  const homeTeam = teams.home
  const awayTeam = teams.away
  const isHomeTeam = homeTeam.name === teamObj.name
  const opponent = isHomeTeam ? awayTeam : homeTeam
  const venue = isHomeTeam ? "Home" : "Away"
  const teamScore = isHomeTeam ? goals.home : goals.away
  const opponentScore = isHomeTeam ? goals.away : goals.home
  
  // Determine match status
  const status = fixtureData.status.short
  const isFinished = ["FT", "AET", "PEN"].includes(status)
  const isLive = ["1H", "2H", "HT", "ET", "BT", "P"].includes(status)
  const isUpcoming = goals.home === null || goals.away === null

  // Format match date
  const matchDate = new Date(fixtureData.date)
  const formattedDate = matchDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  })
  
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

  // TanStack Query for statistics
  const { 
    data: statistics, 
    isLoading: statsLoading,
    isError: statsError
  } = useQuery({
    queryKey: ['statistics', fixtureData.id],
    queryFn: async () => {
      const result = await getFixtureStatistics(fixtureData.id)
      if (!result.success) throw new Error(result.message)
      return result.data
    },
    enabled: isExpanded && isFinished,
    staleTime: 5 * 60 * 1000,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  // TanStack Query for events
  const { 
    data: events, 
    isLoading: eventsLoading,
    isError: eventsError
  } = useQuery({
    queryKey: ['events', fixtureData.id],
    queryFn: async () => {
      const result = await getFixtureEvents(fixtureData.id)
      if (!result.success) throw new Error(result.message)
      return result.data
    },
    enabled: isExpanded && isFinished,
    staleTime: 5 * 60 * 1000,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  const isLoading = statsLoading || eventsLoading
  const hasError = statsError && eventsError
  
  const handleExpand = () => {
    if (isFinished) {
      onToggleExpand()
    }
  }

  return (
    <>
      <TableRow 
        onClick={handleExpand}
        className={cn(
          "flex items-center py-2",
          isFinished && "cursor-pointer hover:bg-slate-50",
          isLive && "bg-green-50",
          isExpanded && "bg-slate-50"
        )}
      >
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
            <span className="sm:hidden">{getTeamAbbreviation(opponent.id)}</span>
            <span className="hidden sm:inline">{opponent.name}</span>
          </span>
        </TableCell>

        {/* Home/Away Badge */}
        <TableCell>
          <MatchRowBadge content={venue} />
        </TableCell>

        {/* Date Badge */}
        <TableCell className="w-20 text-slate-600">
          <MatchRowBadge content={formattedDate}/>
        </TableCell>

        {/* Score or time if upcoming or LIVE badge */}
        <TableCell className="text-center">
          {isLive ? (
            <MatchRowBadge 
              content="LIVE"
              className="bg-red-50 text-red-600 border-red-200 font-semibold relative before:absolute before:left-2 before:top-1/2 before:-translate-y-1/2 before:h-2 before:w-2 before:rounded-full before:bg-red-500 before:animate-ping after:absolute after:left-2 after:top-1/2 after:-translate-y-1/2 after:h-2 after:w-2 after:rounded-full after:bg-red-500 pl-6"
            />
          ) : !isUpcoming && teamScore !== null && opponentScore !== null ? (
            <MatchRowBadge 
              content={`${teamScore} - ${opponentScore}`} 
              className={matchResult ? `${RESULT_COLOR_VARIANTS[matchResult]} text-white` : ""}
            />
          ) : isUpcoming ? (
            <MatchRowBadge 
              content={
                matchDate.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit"
                })}
            />
          ) : null}
        </TableCell>
      </TableRow>

      {/* Expanded Details Row */}
      {isExpanded && isFinished && (
        <TableRow className="flex">
          <TableCell colSpan={4} className="w-full p-0">
            {isLoading ? (
              <MatchDetailsSkeleton/>
            ) : hasError ? (
              <div className="p-8 bg-slate-500">
                <DataUnavailable message="⚠️ Failed to fetch match details. Close and re-open to try again." />
              </div>
            ) : (
              <MatchDetails 
                fixture={fixture} 
                isHomeTeam={isHomeTeam}
                statistics={statistics ?? null}
                events={events ?? null}
                onClose={onToggleExpand}
              />
            )}
          </TableCell>
        </TableRow>
      )}
    </>
  )
}