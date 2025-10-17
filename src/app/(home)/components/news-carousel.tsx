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

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % articles.length)
  }

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length)
  }

  const currentArticle = articles[currentIndex]

  return (
    <div className="relative h-full w-full">
      <a
        href={currentArticle.link}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block h-full w-full overflow-hidden rounded transition-opacity hover:opacity-95"
      >
        {/* Background Image */}
        <Image
          src={currentArticle.thumbnail ?? newsImg}
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
          {currentArticle.content && (
            <p className="text-sm text-slate-200 line-clamp-2 mb-3">
              {currentArticle.content}
            </p>
          )}
          
          {/* Attribution */}
          <p className="text-xs text-slate-300">The Guardian</p>
        </div>

        {/* Dot Indicators - Centered at bottom */}
        {articles.length > 1 && (
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
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

      {/* Navigation Arrows - Only show if multiple articles */}
      {articles.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault()
              goToPrev()
            }}
            className="absolute left-2 top-1/2 z-20 -translate-y-1/2 cursor-pointer rounded-full bg-white/20 p-2 text-white transition-all hover:bg-white/30"
            aria-label="Previous article"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={(e) => {
              e.preventDefault()
              goToNext()
            }}
            className="absolute right-2 top-1/2 z-20 -translate-y-1/2 cursor-pointer rounded-full bg-white/20 p-2 text-white transition-all hover:bg-white/30"
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
