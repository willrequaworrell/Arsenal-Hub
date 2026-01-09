import {Event} from "@/lib/schemas/fixture-events"
import MatchEvent from "./match-row-details-event"

type MatchEventProps = {
  events: Event[]
}
const MatchEvents = ({events}: MatchEventProps) => {
  return (
    <div className="flex flex-col">
      <h3 className="mb-4 text-sm font-semibold text-slate-600">Match Events</h3>
      <div className="rounded-lg bg-slate-50 p-4 h-[300px] overflow-y-auto space-y-2">
        {events.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-xs text-slate-400 text-center">
              No events recorded
            </p>
          </div>
        ) : (
          events.map((event, idx) => (
            <MatchEvent key={idx} event={event} />
          ))
        )}
      </div>
    </div>
  )
}

export default MatchEvents
