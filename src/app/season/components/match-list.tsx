// app/(season)/components/match-list.tsx
"use client"

import { useState } from "react"
import { Fixture } from "@/lib/api-football/schemas/fixtures"
import CardContainer from "@/components/ui/custom/card-container"
import { Table, TableBody } from '@/components/ui/table'
import MatchRow from "./match-row"

type MatchListProps = {
  fixtures: Fixture[]
}

export default function MatchList({ fixtures }: MatchListProps) {
  // Track which fixture is currently expanded
  const [expandedFixtureId, setExpandedFixtureId] = useState<number | null>(null)

  // Get season from environment variable - use NEXT_PUBLIC_ for client components
  const season = process.env.NEXT_PUBLIC_SEASON || new Date().getFullYear().toString()
  const nextYear = (parseInt(season) + 1).toString().slice(-2)
  const seasonTitle = `${season}/${nextYear} Season Fixtures`

  if (!fixtures.length) {
    return (
      <CardContainer title={seasonTitle}>
        <div className="flex h-64 items-center justify-center p-4">
          <p className="text-slate-500">No fixtures available</p>
        </div>
      </CardContainer>
    )
  }

  return (
    <CardContainer title={seasonTitle}>
      <Table>
        <TableBody>
          {fixtures.map((fixture) => (
            <MatchRow 
              key={fixture.fixture.id} 
              fixture={fixture}
              isExpanded={expandedFixtureId === fixture.fixture.id}
              onToggleExpand={() => {
                setExpandedFixtureId(
                  expandedFixtureId === fixture.fixture.id
                    ? null // Collapse if clicking the same row
                    : fixture.fixture.id // Expand new row (auto-collapses previous)
                )
              }}
            />
          ))}
        </TableBody>
      </Table>
    </CardContainer>
  )
}
