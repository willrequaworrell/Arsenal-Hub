import { getTeamAbbreviation } from "@/lib/api-football/team-data"

type MatchRowDetailsLegendProps = {
  yourTeamId: number
  yourTeamColor: string
  opponentId: number
  opponentTeamColor: string
}


const MatchRowDetailsLegend = ({yourTeamId, yourTeamColor, opponentId, opponentTeamColor}: MatchRowDetailsLegendProps) => {
  return (
    <div className="flex items-center gap-4 rounded-lg bg-slate-50 px-4 py-3">
      <div className="flex items-center gap-2">
        <div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: yourTeamColor }}
        />
        <span className="text-xs font-medium text-slate-600">
          {getTeamAbbreviation(yourTeamId)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: opponentTeamColor }}
        />
        <span className="text-xs font-medium text-slate-600">
          {getTeamAbbreviation(opponentId)}
        </span>
      </div>
    </div>
  )
}

export default MatchRowDetailsLegend
