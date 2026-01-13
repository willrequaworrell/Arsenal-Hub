// app/news/components/news-feed-skeleton.tsx
import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"

export default function NewsFeedSkeleton() {
  return (
    <div className="w-full animate-in fade-in duration-500">
      
      {/* 1. HERO SKELETON */}
      {/* Hidden on mobile, visible on lg+ */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-6 h-[600px] mb-12">
        
        {/* Left Big Card */}
        <div className="h-full bg-white rounded-xl border border-slate-100 p-0 overflow-hidden">
           <Skeleton className="h-3/5 w-full rounded-none" />
           <div className="p-6 space-y-4">
             <div className="flex justify-between">
               <Skeleton className="h-4 w-20" />
               <Skeleton className="h-4 w-20" />
             </div>
             <Skeleton className="h-8 w-3/4" />
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-2/3" />
           </div>
        </div>

        {/* Right Stacked Cards */}
        <div className="flex flex-col gap-6 h-full">
           {[1, 2].map((i) => (
             <div key={i} className="flex-1 bg-white rounded-xl border border-slate-100 overflow-hidden flex flex-col">
                <Skeleton className="h-2/5 w-full rounded-none" />
                <div className="p-5 flex-1 space-y-3">
                   <div className="flex justify-between">
                     <Skeleton className="h-3 w-16" />
                     <Skeleton className="h-3 w-16" />
                   </div>
                   <Skeleton className="h-6 w-full" />
                   <Skeleton className="h-6 w-1/2" />
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* 2. WATERFALL SKELETON */}
      {/* 
          We just render a grid of standard cards to fill the space.
          It doesn't need to be perfectly staggered, just enough to show "content loading".
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-100 overflow-hidden flex flex-col h-[350px]">
            <Skeleton className="h-[200px] w-full rounded-none" />
            <div className="p-5 flex-1 space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
