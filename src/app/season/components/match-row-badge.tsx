import { cn } from "@/lib/utils"

type MatchRowBadgeProps = {
  content: string
  className?: string
}


const MatchRowBadge = ({content, className=""}: MatchRowBadgeProps ) => {
  return (
    <span className={cn(
      "flex items-center justify-center rounded-sm bg-slate-100 px-3 py-2 text-md font-semibold text-slate-600",
      className
    )}>
      {content}
    </span>
  )
}

export default MatchRowBadge

