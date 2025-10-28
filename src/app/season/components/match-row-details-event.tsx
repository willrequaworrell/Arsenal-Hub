import Image from "next/image"
import { Event } from "@/lib/api-football/schemas/fixture-events"

type MatchEventProps = {
  event: Event
}


const MatchEvent = ({ event }: MatchEventProps) => {


  const getEventIcon = () => {
    switch (event.type) {
      case "Goal":
        return "⚽"
      case "Card":
        return event.detail === "Yellow Card" ? "🟨" : "🟥"
      case "subst":
        return "🔄"
      default:
        return "•"
    }
  }

  const getEventDescription = () => {

    switch (event.type) {
      case "Goal":
        return (
          <div className="flex-1">
            <p className="font-semibold text-slate-900">{event.player.name}</p>
            {event.assist.name && (
              <p className="text-xs text-slate-500">
                Assist: {event.assist.name}
              </p>
            )}
            {event.detail !== "Normal Goal" && (
              <p className="text-xs text-slate-500 italic">{event.detail}</p>
            )}
          </div>
        )
      case "Card":
        return (
          <div className="flex-1">
            <p className="font-semibold text-slate-900">{event.player.name}</p>
            <p className="text-xs text-slate-500">{event.detail}</p>
          </div>
        )
      case "subst":
        return (
          <div className="flex-1">
            <p className="text-sm text-slate-900">
              <span className="text-green-600">▲</span> {event.player.name}
            </p>
            <p className="text-sm text-slate-500">
              <span className="text-red-600">▼</span> {event.assist.name}
            </p>
          </div>
        )
      default:
        return null
    }
  }


  return (
    <div className="flex items-center gap-3 text-sm bg-white rounded p-2">
      <span className="font-mono text-xs font-semibold text-slate-600 w-10">
        {event.time.elapsed}&apos;
      </span>
      <Image
        src={event.team.logo}
        alt={event.team.name}
        width={20}
        height={20}
        className="size-5"
      />
      {getEventDescription()}
      <span className="text-lg">{getEventIcon()}</span>
    </div>
  )
}

export default MatchEvent

