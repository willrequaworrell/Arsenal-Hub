import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { FixtureStatistics } from "@/lib/api-football/schemas/statistics"
import missingLogo from "../../../../public/missingLogo.png"
import Image from "next/image"
import { Pie, PieChart } from "recharts"

type MatchPossessionChartProps = {
  yourTeam: {
    id: number;
    name: string;
    logo?: string | null | undefined;
    winner?: boolean | null | undefined;
  }
  opponent: {
    id: number;
    name: string;
    logo?: string | null | undefined;
    winner?: boolean | null | undefined;
  }
  statistics: FixtureStatistics | null
  possessionData: {
    yourValue: string | number;
    opponentValue: string | number;
    yourNum: number;
    opponentNum: number;
  }
  yourTeamColor: string
  opponentTeamColor: string
}

const chartConfig: ChartConfig = {
  possession: {
    label: "Possession",
  },
}


const MatchPossessionChart = ({ yourTeam, opponent, statistics, possessionData, yourTeamColor, opponentTeamColor }: MatchPossessionChartProps) => {

  const chartData = [
    { team: opponent.name, possession: possessionData.opponentNum, fill: opponentTeamColor },
    { team: yourTeam.name, possession: possessionData.yourNum, fill: yourTeamColor },
  ]

  return (
    <div className="flex flex-col">
      <h3 className="mb-4 text-sm font-semibold text-slate-600">Possession</h3>
      <div className="rounded-lg bg-slate-50 p-4 flex flex-col items-center justify-center h-[300px]">
        {statistics ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square h-[200px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={chartData}
                    dataKey="possession"
                    nameKey="team"
                    innerRadius={60}
                    outerRadius={80}
                    strokeWidth={2}
                    startAngle={90}
                    endAngle={-270}
                  />
                </PieChart>
              </ChartContainer>

              {/* Center logos overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <Image
                    src={yourTeam.logo || missingLogo}
                    alt={yourTeam.name}
                    width={28}
                    height={28}
                    className="size-7"
                  />
                  <div className="h-8 w-px bg-slate-300" />
                  <Image
                    src={opponent.logo || missingLogo}
                    alt={opponent.name}
                    width={28}
                    height={28}
                    className="size-7"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-lg font-bold text-slate-900">
              <span>{possessionData.yourNum}%</span>
              <span>{possessionData.opponentNum}%</span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center">
            Statistics unavailable
          </p>
        )}
      </div>
    </div>
  )
}

export default MatchPossessionChart
