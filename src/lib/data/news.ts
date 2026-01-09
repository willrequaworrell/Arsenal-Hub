// src/lib/data/news.ts
import { DEFAULT_TEAM_ID } from "../config/api-football"

export type NewsArticle = {
  id: string
  title: string
  url: string       // Was 'link'
  publishedAt: string // Was 'pubDate'
  source: string    // New field
  summary: string   // Was 'content'
  imageUrl: string | null // Was 'thumbnail'
}

export type NewsResult = {
  data: NewsArticle[] | null
  success: boolean
  message?: string
}

const REVALIDATE_SECS = 600

export const getTeamNews = async (teamId: string = DEFAULT_TEAM_ID): Promise<NewsResult> => {
  // Ensure we have a valid base URL for server-side fetches
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const url = new URL('/api/news', baseUrl)
  url.searchParams.set('teamId', teamId)

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: REVALIDATE_SECS, tags: [`news-${teamId}`] },
    })

    if (!res.ok) {
      return { data: null, success: false, message: `HTTP ${res.status}` }
    }

    const json = await res.json() as { ok: boolean; data?: NewsArticle[]; error?: string }
    if (!json.ok || !json.data) {
      return { data: null, success: false, message: json.error ?? "invalid payload" }
    }

    return { data: json.data, success: true }

  } catch (error) {
    console.error("News fetch error:", error)
    return { data: null, success: false, message: "network/timeout" }
  }
}
