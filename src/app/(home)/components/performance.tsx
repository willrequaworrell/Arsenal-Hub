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
      <div className="flex h-full justify-between items-center">
        <div>
          <p className="text-4xl font-bold">{`${record.w}-${record.d}-${record.l}`}</p>
          <p className="text-slate-600">Record</p> 
        </div>
        <div className="h-full w-[1px] bg-slate-400"></div>
        <div>
          <p className="text-4xl font-bold">{recentForm}</p>
          <p className="text-slate-600">Recent Form</p>
        </div>
      </div>
    </CardContainer>
  )
}

export default Performance
