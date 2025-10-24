// app/(season)/components/match-row.tsx
'use client'

import { useState } from "react"
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
    staleTime: 5 * 60 * 1000, // 5 minutes
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
  })

  const isLoading = statsLoading || eventsLoading
  const hasError = statsError && eventsError // Both failed
  
  const handleExpand = () => {
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

        {/* Date Column */}
        <TableCell className="w-20 text-slate-600">
          <span className="flex items-center justify-center rounded bg-slate-100 px-3 py-2 text-md font-semibold text-slate-600">
            {formattedDate}
          </span>
        </TableCell>

        {/* Home/Away Badge */}
        <TableCell>
          <span className="flex items-center justify-center rounded bg-slate-100 px-3 py-2 text-md font-semibold text-slate-600">
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
              "inline-flex items-center justify-center rounded px-3 py-2 text-md font-bold text-white",
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
            {isLoading ? (
              <LoadingSkeleton />
            ) : hasError ? (
              <ErrorState error="Failed to load match details" onRetry={handleExpand} />
            ) : (
              <MatchDetails 
                fixture={fixture} 
                isHomeTeam={isHomeTeam}
                statistics={statistics ?? null}
                events={events ?? null}
              />
            )}
          </TableCell>
        </TableRow>
      )}
    </>
  )
}

// Loading Skeleton Component
function LoadingSkeleton() {
  return (
    <div className="border-t bg-gradient-to-b from-slate-50 to-white p-6 animate-in fade-in duration-200">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="rounded-lg border bg-white p-4">
          <Skeleton className="h-5 w-32 mb-4" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Error State Component
function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="border-t bg-gradient-to-b from-slate-50 to-white p-6 animate-in fade-in duration-200">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 text-4xl">⚠️</div>
          <h3 className="mb-2 text-lg font-semibold text-slate-900">
            Failed to Load Statistics
          </h3>
          <p className="mb-4 text-sm text-slate-600">{error}</p>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRetry()
            }}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  )
}
