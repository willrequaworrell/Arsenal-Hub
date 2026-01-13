// app/news/page.tsx
import React from 'react'
import { getTeamNews } from '@/lib/data/news'
import NewsFeed from './components/news-feed'
import DataUnavailable from '@/components/ui/custom/data-unavailable'

export default async function NewsPage() {
  const { data, success } = await getTeamNews()

  if (!success || !data || data.length === 0) {
    return (
      <div className="px-[5%] py-[5%] sm:py-[2%]">
        <DataUnavailable message="No news articles available" />
      </div>
    )
  }

  return (
    // Matches Home Page: px-[5%] py-[5%] sm:py-[2%]
    <div className="px-[5%] py-[5%] sm:py-[2%]">
      <NewsFeed initialArticles={data} />
    </div>
  )
}
