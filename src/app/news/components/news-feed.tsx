// app/news/components/news-feed.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { NewsArticle } from '@/lib/data/news'
import NewsFeedCard from './news-feed-card'
import NewsHero from './news-hero'
import NewsFeedSkeleton from './news-feed-skeleton' // Import it

type NewsFeedProps = {
  initialArticles: NewsArticle[]
}

export default function NewsFeed({ initialArticles }: NewsFeedProps) {
  // Optimistic default (3) is fine now because we hide it behind skeleton
  const [columns, setColumns] = useState(3) 
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    const updateColumns = () => {
      const width = window.innerWidth
      if (width >= 1024) setColumns(3)
      else if (width >= 640) setColumns(2)
      else setColumns(1)
    }

    updateColumns()
    window.addEventListener('resize', updateColumns)
    return () => window.removeEventListener('resize', updateColumns)
  }, [])

  // --- LOADING STATE ---
  if (!isMounted) {
    return <NewsFeedSkeleton />
  }

  
  if (initialArticles.length === 0) {
    return <p className="text-center text-slate-400 py-8">No articles found</p>
  }

  // ... (Rest of logic: isMobile, hasHero, masonry, etc.) ...
  
  const isMobile = columns === 1
  const hasHero = !isMobile && initialArticles.length >= 3
  
  const heroArticles = hasHero ? initialArticles.slice(0, 3) : []
  const masonryArticles = hasHero ? initialArticles.slice(3) : initialArticles

  const columnWrapper: NewsArticle[][] = Array.from({ length: columns }, () => [])
  masonryArticles.forEach((article, index) => {
    columnWrapper[index % columns].push(article)
  })

  const getVariant = (index: number) => {
    if (isMobile) return 'standard'
    const i = index % 5
    if (i === 1) return 'tall'    
    if (i === 3) return 'square'  
    return 'standard'             
  }

  return (
    <div className="w-full animate-in fade-in zoom-in-95 duration-500">
      
      {/* HERO */}
      {hasHero && (
        <NewsHero articles={heroArticles} />
      )}

      {/* WATERFALL */}
      <div className="flex gap-6 items-start justify-center">
        {columnWrapper.map((colArticles, colIndex) => (
          <div 
            key={colIndex} 
            className="flex flex-col gap-6 flex-1 min-w-0" 
          >
            {colArticles.map((article, articleIndex) => {
              const globalIndex = articleIndex * columns + colIndex
              return (
                <NewsFeedCard 
                  key={article.id} 
                  article={article} 
                  variant={getVariant(globalIndex)} 
                />
              )
            })}
          </div>
        ))}
      </div>
      
       <div className="flex justify-center mt-16 mb-12">
          <p className="text-sm text-slate-400">End of content</p>
       </div>
    </div>
  )
}
