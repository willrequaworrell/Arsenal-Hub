// app/news/components/news-hero.tsx
import React from 'react'
import { NewsArticle } from '@/lib/data/news'
import NewsFeedCard from './news-feed-card'

type NewsHeroProps = {
  articles: NewsArticle[]
}

export default function NewsHero({ articles }: NewsHeroProps) {
  if (articles.length < 3) return null

  const [main, sub1, sub2] = articles

  return (
    <div className="
       flex flex-col gap-6 mb-8
       lg:grid lg:grid-cols-2 
       lg:h-[calc(100vh-8rem)] lg:min-h-[600px]
    ">
      
      {/* LEFT COLUMN */}
      <div className="h-full min-h-0">
        <NewsFeedCard 
          article={main} 
          isHero={true} 
          className="h-full" 
          // Default h-3/5 (60%) image is great here
        />
      </div>

      {/* RIGHT COLUMN */}
      <div className="flex flex-col gap-6 h-full min-h-0">
        
        <div className="flex-1 min-h-0">
            <NewsFeedCard 
                article={sub1} 
                isHero={true} 
                className="h-full"
                imageClassName="h-1/2" // 50% Image
                // hideSummary REMOVED -> Description is back!
            />
        </div>
        
        <div className="flex-1 min-h-0">
            <NewsFeedCard 
                article={sub2} 
                isHero={true} 
                className="h-full"
                imageClassName="h-1/2" // 50% Image
                // hideSummary REMOVED
            />
        </div>
      </div>
      
    </div>
  )
}
