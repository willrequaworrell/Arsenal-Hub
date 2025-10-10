import CardContainer from "@/components/ui/custom/card-container"
import DataUnavailable from "@/components/ui/custom/data-unavailable"
import { TeamFormAndRecord } from "@/lib/api-football/schemas/team-stats"
import { getTeamFormAndRecord } from "@/lib/data/team-stats"

const FORM_LENGTH = 5

const Performance = async () => {
  const performanceData = await getTeamFormAndRecord();
  const {data, success} = performanceData
  const { record, form } = data as TeamFormAndRecord
  const recentForm = form.substring(form.length - (FORM_LENGTH+1), form.length - 1)

  return (

    <CardContainer
      title="Performance"
    >

      {!success ? (
        <DataUnavailable message="Performance data unavailable" />
      ) : (
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
      )}
      
    </CardContainer>
  )
}

export default Performance
