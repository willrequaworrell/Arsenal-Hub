// app/(home)/components/news-carousel.tsx
'use client'

import React, { useState } from 'react'
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { NewsArticle } from '@/lib/data/news'
import newsImg from '../../../../public/egNewsImg.jpg'

type NewsCarouselProps = {
  articles: NewsArticle[]
}

const NewsCarousel = ({ articles }: NewsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Guard: Handle empty or undefined data gracefully
  if (!articles || articles.length === 0) {
    return (
       <div className="h-full w-full bg-slate-100 flex items-center justify-center text-slate-400 text-sm rounded">
         No news available
       </div>
    )
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % articles.length)
  }

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length)
  }

  const currentArticle = articles[currentIndex]

  return (
    <div className="group relative h-full w-full">
      <a
        href={currentArticle.url} 
        target="_blank"
        rel="noopener noreferrer"
        className="relative block h-full w-full overflow-hidden rounded transition-opacity hover:opacity-95"
      >
        {/* Background Image */}
        <Image
          src={currentArticle.imageUrl ?? newsImg}
          alt={currentArticle.title}
          fill
          className="object-cover object-top"
          sizes="(max-width: 768px) 100vw, 60vw"
          priority
        />
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent" />
        
        {/* Text Content */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-4 text-white">
          <h3 className="text-lg font-bold leading-tight line-clamp-1 mb-2">
            {currentArticle.title}
          </h3>
          {currentArticle.summary && (
            <p className="text-sm text-slate-200 line-clamp-2 mb-3">
              {currentArticle.summary}
            </p>
          )}
          
          {/* Attribution - Dynamic Source */}
          <p className="text-xs text-slate-300 font-medium">
             {currentArticle.source}
          </p>
        </div>

        {/* Dot Indicators */}
        {articles.length > 1 && (
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {articles.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentIndex(idx)
                }}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-white w-6' : 'bg-white/40 w-1.5'
                }`}
                aria-label={`Go to article ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </a>

      {/* Navigation Arrows */}
      {articles.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault()
              goToPrev()
            }}
            className="absolute left-2 top-1/2 z-20 -translate-y-1/2 cursor-pointer rounded-full bg-white/20 p-2 text-white opacity-0 transition-all duration-300 hover:bg-white/30 group-hover:opacity-100"
            aria-label="Previous article"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={(e) => {
              e.preventDefault()
              goToNext()
            }}
            className="absolute right-2 top-1/2 z-20 -translate-y-1/2 cursor-pointer rounded-full bg-white/20 p-2 text-white opacity-0 transition-all duration-300 hover:bg-white/30 group-hover:opacity-100"
            aria-label="Next article"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
    </div>
  )
}

export default NewsCarousel
