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
      <CardContainer title="News">
        <DataUnavailable message="News data unavailable" />
      </CardContainer>
    )
  }
    
  return (
    <CardContainer title="News">
      <div className="h-full"> 
        <NewsCarousel articles={data} />
      </div>
    </CardContainer>
  )
}

export default News
