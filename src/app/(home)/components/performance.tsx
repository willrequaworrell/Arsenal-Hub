import CardContainer from "@/components/ui/custom/card-container"
import DataUnavailable from "@/components/ui/custom/data-unavailable"
import { getTeamFormAndRecord } from "@/lib/data/team-stats"

const FORM_LENGTH = 5

const Performance = async () => {
  const { data, success } = await getTeamFormAndRecord()
  
  /* Handle case where data is unavailable */
  if (!success || !data) {
    return (
      <CardContainer title="Performance">
        <DataUnavailable message="Performance data unavailable" />
      </CardContainer>
    )
  }


  /* Data is available */
  const { record, form } = data
  const recentForm = form.substring(form.length - (FORM_LENGTH + 1), form.length - 1)

  return (
    <CardContainer title="Performance">
      <div className="flex h-full items-center justify-between">
        <div>
          <p className="text-4xl font-bold">{`${record.w}-${record.d}-${record.l}`}</p>
          <p className="text-slate-600">Record</p>
        </div>
        <div className="h-full w-[1px] bg-slate-400" />
        <div>
          <p className="text-4xl font-bold">{recentForm}</p>
          <p className="text-slate-600">Recent Form</p>
        </div>
      </div>
    </CardContainer>
  )
}


export default Performance
