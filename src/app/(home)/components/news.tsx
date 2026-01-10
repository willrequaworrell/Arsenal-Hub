// app/(home)/components/news.tsx
import React from 'react'
import CardContainer from '@/components/ui/custom/card-container'
import { getTeamNews } from '@/lib/data/news'
import DataUnavailable from '@/components/ui/custom/data-unavailable'
import NewsCarousel from './news-carousel'

const News = async () => {
  const { data, success } = await getTeamNews()

  if (!success || !data || data.length === 0) {
    return (
      <CardContainer title="RECENT NEWS" className="p-6">
        <DataUnavailable message="News data unavailable" />
      </CardContainer>
    )
  }

  // Take only the 5 most recent articles
  const recentArticles = data.slice(0, 5)
    
  return (
    <CardContainer title="RECENT NEWS" className="p-6">
      <div className="h-full"> 
        <NewsCarousel articles={recentArticles} />
      </div>
    </CardContainer>
  )
}

export default News
