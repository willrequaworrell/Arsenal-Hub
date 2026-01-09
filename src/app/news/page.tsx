// app/news/page.tsx
import React from 'react'
import { getTeamNews } from '@/lib/data/news'
import NewsFeed from './components/news-feed'
import DataUnavailable from '@/components/ui/custom/data-unavailable'

export default async function NewsPage() {
  const { data, success } = await getTeamNews()

  if (!success || !data || data.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Arsenal News</h1>
        <DataUnavailable message="No news articles available" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Arsenal News</h1>
      <NewsFeed initialArticles={data} />
    </div>
  )
}
