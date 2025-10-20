// app/(season)/components/match-list.tsx
import { Fixture } from "@/lib/api-football/schemas/fixtures"
import CardContainer from "@/components/ui/custom/card-container"
import { Table, TableBody } from '@/components/ui/table'
import MatchRow from "./match-row"

type MatchListProps = {
  fixtures: Fixture[]
}

export default function MatchList({ fixtures }: MatchListProps) {
  // Get season from environment variable
  const season = process.env.SEASON || new Date().getFullYear().toString()
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
            <MatchRow key={fixture.fixture.id} fixture={fixture} />
          ))}
        </TableBody>
      </Table>
    </CardContainer>
  )
}
