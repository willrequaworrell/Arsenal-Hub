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
  const recentForm = form.substring(form.length - FORM_LENGTH)

  return (
    <CardContainer title="Performance">
      <div className="flex h-full flex-col items-center justify-center gap-y-3 sm:flex-row sm:justify-around sm:gap-y-0">
        <div className="text-center">
          <p className="font-bold text-[clamp(1rem,2vw,2rem)]">
            {`${record.w}-${record.d}-${record.l}`}
          </p>
          <p className="text-xs text-slate-600 sm:text-sm">Record</p>
        </div>

        {/* Divider - horizontal on mobile, vertical on larger screens */}
        <div className="h-[1px] w-2/3 bg-slate-300 sm:h-2/3 sm:w-[1px]" />
        
        <div className="text-center">
          <p className="font-bold text-[clamp(1rem,2vw,2rem)]">
            {recentForm}
          </p>
          <p className="text-xs text-slate-600 sm:text-sm">Recent Form</p>
        </div>
      </div>
    </CardContainer>
  )
}

export default Performance
