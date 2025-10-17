// src/lib/data/news.ts
import { DEFAULT_TEAM_ID } from "../config/api-football"

export type NewsArticle = {
  title: string
  link: string
  pubDate: string
  content: string
  thumbnail: string | null
}

export type NewsResult = {
  data: NewsArticle[] | null
  success: boolean
  message?: string
}

const REVALIDATE_SECS = 600

export const getTeamNews = async (teamId: string = DEFAULT_TEAM_ID): Promise<NewsResult> => {
  const url = new URL('/api/news', process.env.NEXT_PUBLIC_BASE_URL)
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

  } catch {
    return { data: null, success: false, message: "network/timeout" }
  }
}
