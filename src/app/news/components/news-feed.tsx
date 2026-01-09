// app/news/components/news-feed.tsx
'use client'

import React, { useState } from 'react'
import { NewsArticle } from '@/lib/data/news'
import NewsFeedCard from './news-feed-card'


type NewsFeedProps = {
  initialArticles: NewsArticle[]
}

const NewsFeed = ({ initialArticles }: NewsFeedProps) => {
  const [articles] = useState(initialArticles)
  // TODO: Add infinite scroll logic here later

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {articles.map((article) => (
        <NewsFeedCard key={article.id} article={article} />
      ))}
      
      {/* Placeholder for "Load More" or infinite scroll trigger */}
      {articles.length === 0 && (
        <p className="text-center text-slate-400 py-8">No articles found</p>
      )}
    </div>
  )
}

export default NewsFeed
