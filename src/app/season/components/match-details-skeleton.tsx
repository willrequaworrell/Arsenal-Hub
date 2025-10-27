import { Skeleton } from "@/components/ui/skeleton";

const MatchDetailsSkeleton = () => {
  return (
    <div className="border-t bg-white p-6 animate-in fade-in duration-200">
      <div className="mx-auto max-w-5xl">
        
        {/* Header with Legend and Close Button skeleton */}
        <div className="flex items-center justify-between mb-6">
          {/* Legend skeleton */}
          <div className="flex items-center gap-4 rounded-lg bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-8" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-8" />
            </div>
          </div>
          
          {/* Close button skeleton */}
          <Skeleton className="h-10 w-20 rounded-lg" />
        </div>

        {/* Main content */}
        <div className="space-y-6">
          {/* Top Section: Possession + Match Events */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Possession skeleton */}
            <div className="flex flex-col">
              <Skeleton className="h-5 w-24 mb-4" />
              <div className="rounded-lg bg-slate-50 p-4 flex flex-col items-center justify-center h-[300px]">
                <Skeleton className="h-[200px] w-[200px] rounded-full mb-4" />
                <div className="flex items-center gap-6">
                  <Skeleton className="h-7 w-14" />
                  <Skeleton className="h-7 w-14" />
                </div>
              </div>
            </div>

            {/* Match Events skeleton */}
            <div className="flex flex-col">
              <Skeleton className="h-5 w-28 mb-4" />
              <div className="rounded-lg bg-slate-50 p-4 h-[300px] space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3 bg-white rounded p-2">
                    <Skeleton className="h-4 w-10" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-5 w-5 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Section skeleton */}
          <div className="flex flex-col">
            <Skeleton className="h-5 w-16 mb-4" />
            <div className="rounded-lg bg-slate-50 p-4 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <Skeleton className="h-1.5 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MatchDetailsSkeleton