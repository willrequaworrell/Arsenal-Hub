// app/news/components/news-feed-card.tsx
'use client'

import React from 'react'
import Image from 'next/image'
import { NewsArticle } from '@/lib/data/news'
import CardContainer from '@/components/ui/custom/card-container'
import { ExternalLink } from 'lucide-react'
import newsImg from '../../../../public/egNewsImg.jpg'

type NewsFeedCardProps = {
  article: NewsArticle
}

const NewsFeedCard = ({ article }: NewsFeedCardProps) => {
  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <CardContainer className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {/* Image Section */}
        <div className="relative w-full aspect-video bg-slate-100">
          <Image
            src={article.imageUrl ?? newsImg}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 672px"
            priority={false} // Only lazy load cards in the feed
          />
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Source & Time */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-red-600">
              {article.source}
            </span>
            <span className="text-xs text-slate-400">
              {formatDate(article.publishedAt)}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 hover:text-red-600 transition-colors">
            {article.title}
          </h2>

          {/* Summary */}
          {article.summary && (
            <p className="text-sm text-slate-600 line-clamp-3 mb-4">
              {article.summary}
            </p>
          )}

          {/* Read More Link */}
          <div className="flex items-center text-sm font-medium text-red-600 hover:text-red-700">
            <span>Read full article</span>
            <ExternalLink className="ml-1 h-4 w-4" />
          </div>
        </div>
      </a>
    </CardContainer>
  )
}

export default NewsFeedCard
