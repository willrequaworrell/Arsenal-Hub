import CardContainer from "@/components/ui/custom/card-container"
import { TeamFormAndRecord } from "@/lib/api-football/schemas/team-stats"

type PerformanceProps = {
  record: {
    w: number
    d: number
    l: number
  }
  form: string
}

const FORM_LENGTH = 5

const Performance = ({record, form}: PerformanceProps) => {

  const recentForm = form.substring(form.length - (FORM_LENGTH+1), form.length - 1)

  return (
    <CardContainer
      title="Performance"
    >
      <div className="flex justify-between">
        <p className="text-4xl font-bold">{`${record.w}-${record.d}-${record.l}`}</p>
        <p className="text-4xl font-bold">{recentForm}</p>

      </div>
    </CardContainer>
  )
}

export default Performance
