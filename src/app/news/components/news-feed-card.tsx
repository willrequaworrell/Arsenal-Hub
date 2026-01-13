// app/news/components/news-feed-card.tsx
'use client'

import React from 'react'
import Image from 'next/image'
import { NewsArticle } from '@/lib/data/news'
import CardContainer from '@/components/ui/custom/card-container'
import { ExternalLink } from 'lucide-react'
import newsImg from '../../../../public/egNewsImg.jpg'
import { cn } from "@/lib/utils"

type NewsFeedCardProps = {
  article: NewsArticle
  variant?: 'standard' | 'square' | 'tall'
  isHero?: boolean 
  className?: string
  imageClassName?: string
  hideSummary?: boolean
}

const NewsFeedCard = ({ 
  article, 
  variant = 'standard', 
  isHero = false, 
  className,
  imageClassName,
  hideSummary = false 
}: NewsFeedCardProps) => {
  
  const aspectRatioClass = {
    standard: "aspect-video",     
    square: "aspect-square",      
    tall: "aspect-[3/4]",         
  }[variant]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <CardContainer 
      className={cn(
        "flex flex-col bg-white border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group",
        "h-full", 
        className 
      )}
    >
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col h-full"
      >
        <div className={cn(
          "relative w-full bg-slate-100 flex-shrink-0",
          imageClassName 
            ? imageClassName 
            : isHero ? "h-3/5" : aspectRatioClass
        )}>
          <Image
            src={article.imageUrl ?? newsImg}
            alt={article.title}
            fill
            // ADDED object-top here
            className="object-cover object-top transition-transform duration-700 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div className="p-5 flex flex-col flex-grow min-h-0 bg-white relative z-10">
          
          <div className="flex items-center justify-between mb-2 flex-shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 truncate mr-2">
              {article.source}
            </span>
            <span className="text-xs text-slate-400 whitespace-nowrap">
              {formatDate(article.publishedAt)}
            </span>
          </div>

          <h2 className={cn(
            "font-bold text-slate-900 mb-2 leading-tight group-hover:text-red-600 transition-colors flex-shrink-0",
            isHero && hideSummary ? "text-lg line-clamp-3" : isHero ? "text-xl line-clamp-3" : "text-lg line-clamp-2"
          )}>
            {article.title}
          </h2>

          {!hideSummary && article.summary && (
            <p className="text-sm text-slate-600 mb-4 leading-relaxed text-pretty flex-grow overflow-hidden line-clamp-3">
              {article.summary}
            </p>
          )}

          <div className="flex items-center text-sm font-medium text-red-600 hover:text-red-700 mt-auto pt-1 flex-shrink-0">
            <span>Read full article</span>
            <ExternalLink className="ml-1 h-3 w-3" />
          </div>
        </div>
      </a>
    </CardContainer>
  )
}

export default NewsFeedCard
