import Image from "next/image";
import { Table, TableRow, TableCell, TableBody } from '@/components/ui/table'
import { StandingRow } from "@/lib/api-football/schemas/standings";
import missingLogo from '../../../../public/missingLogo.png'
import CardContainer from "@/components/ui/custom/card-container";
import { getStandings } from "@/lib/data/standings";
import DataUnavailable from "@/components/ui/custom/data-unavailable";


const StandingsTable = async () => {
  const {data: standings, success} = await getStandings();

  if (!success || !standings) {
    return (
      <CardContainer title="Standings">
        <DataUnavailable message="Standings data is currently unavailable." />
      </CardContainer>
    )
  }

  return (
    <CardContainer title="Standings">
      <Table>
        <TableBody>
          {standings.map((team, i: number) => {
            if (i < 5) return (
              <TableRow key={team.team.id} className={`flex ${team.team.name === "Arsenal" && "bg-red-500/10"}`}>
                <TableCell>{team.rank}</TableCell>
                <TableCell >
                  <Image width={50} height={50} src={team.team.logo || missingLogo} alt={`${team.team.name} Logo`} className="size-6" />
                </TableCell>
                <TableCell className="flex-1">{team.team.name}</TableCell>
                <TableCell className="font-bold">{team.points}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </CardContainer>
  )
}

export default StandingsTable