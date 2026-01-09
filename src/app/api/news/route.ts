// app/api/news/route.ts
import { NextResponse } from "next/server"
import { getTeamConfig } from "@/lib/config/team"
import { z } from "zod"

// --- Config ---
export const revalidate = 600 // Cache for 10 minutes

const GUARDIAN_API_KEY = process.env.GUARDIAN_API_KEY
const NEWS_API_KEY = process.env.NEWS_API_KEY
const DEFAULT_TEAM_ID = process.env.API_FOOTBALL_TEAM_ID ?? "42" // Arsenal ID

// --- Schemas & Types ---

// 1. Unified Article Shape (Matches frontend expectations)
type NewsArticle = {
  id: string
  title: string
  url: string
  publishedAt: string
  source: string
  summary: string
  imageUrl: string | null
}

// 2. NewsAPI Response Schema
const NewsApiArticleSchema = z.object({
  source: z.object({ name: z.string().nullable() }).optional(),
  title: z.string(),
  description: z.string().nullable().optional(),
  url: z.string().url(),
  urlToImage: z.string().nullable().optional(),
  publishedAt: z.string(),
})

const NewsApiResponseSchema = z.object({
  status: z.string(),
  articles: z.array(NewsApiArticleSchema),
})

// 3. Guardian Response Schema
const GuardianArticleSchema = z.object({
  webTitle: z.string(),
  webUrl: z.string().url(),
  webPublicationDate: z.string(),
  fields: z.object({
    trailText: z.string().optional(),
    thumbnail: z.string().url().optional(),
  }).optional(),
})

const GuardianResponseSchema = z.object({
  response: z.object({
    status: z.string(),
    results: z.array(GuardianArticleSchema),
  }),
})

// --- Fetch Functions ---

async function fetchGuardianNews(tag: string): Promise<NewsArticle[]> {
  if (!GUARDIAN_API_KEY) return []

  try {
    const url = new URL("https://content.guardianapis.com/search")
    url.searchParams.set("tag", tag)
    url.searchParams.set("show-fields", "thumbnail,trailText")
    url.searchParams.set("page-size", "10") 
    url.searchParams.set("order-by", "newest")
    url.searchParams.set("api-key", GUARDIAN_API_KEY)

    const res = await fetch(url.toString(), { next: { revalidate: 600 } })
    
    if (!res.ok) {
        console.error(`[Guardian API] Error: ${res.status}`)
        return []
    }
    
    const data = await res.json()
    const parsed = GuardianResponseSchema.safeParse(data)

    if (!parsed.success) {
      console.error("[Guardian API] Parse Error:", parsed.error)
      return []
    }

    return parsed.data.response.results.map((item) => ({
      id: item.webUrl,
      title: item.webTitle,
      url: item.webUrl,
      publishedAt: item.webPublicationDate,
      source: "The Guardian",
      // Strip HTML tags from trailText (e.g. <strong>)
      summary: item.fields?.trailText?.replace(/<[^>]+>/g, "") ?? "", 
      imageUrl: item.fields?.thumbnail ?? null,
    }))
  } catch (error) {
    console.error("[Guardian API] Fetch Failed", error)
    return []
  }
}

async function fetchNewsApi(query: string): Promise<NewsArticle[]> {
  if (!NEWS_API_KEY) return []

  try {
    const url = new URL("https://newsapi.org/v2/everything")
    
    // Use the smart query passed from the handler
    url.searchParams.set("q", query) 
    
    // UPDATED: Restrict search to title and description to avoid random mentions in body text
    url.searchParams.set("searchIn", "title,description")
    
    url.searchParams.set("language", "en")
    url.searchParams.set("sortBy", "publishedAt")
    url.searchParams.set("pageSize", "15") 
    url.searchParams.set("excludeDomains", "theguardian.com") 
    url.searchParams.set("apiKey", NEWS_API_KEY)

    const res = await fetch(url.toString(), { next: { revalidate: 600 } })
    
    if (!res.ok) {
         console.error(`[NewsAPI] Error: ${res.status}`)
         return []
    }

    const data = await res.json()
    const parsed = NewsApiResponseSchema.safeParse(data)

    if (!parsed.success) {
      console.error("[NewsAPI] Parse Error:", parsed.error)
      return []
    }

    return parsed.data.articles
      .filter(a => a.title !== "[Removed]") // Filter out pulled articles
      .map((item) => ({
        id: item.url,
        title: item.title,
        url: item.url,
        publishedAt: item.publishedAt,
        source: item.source?.name ?? "News",
        summary: item.description ?? "",
        imageUrl: item.urlToImage ?? null,
    }))
  } catch (error) {
    console.error("[NewsAPI] Fetch Failed", error)
    return []
  }
}

// --- Main Handler ---

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const teamId = searchParams.get("teamId") ?? DEFAULT_TEAM_ID
  const teamConfig = getTeamConfig(teamId)
  
  // 1. Determine search terms
  // UPDATED QUERY: "Arsenal" AND (League OR Football OR Soccer OR FC)
  // This ensures the article mentions the team name AND at least one sports context keyword.
  const baseName = teamConfig.name
  const newsApiQuery = `"${baseName}" AND (League OR Football OR Soccer OR FC)`
  
  const guardianTag = teamConfig.guardianTag || "football/football"

  // 2. Parallel Fetch
  const [guardianResults, newsApiResults] = await Promise.allSettled([
    fetchGuardianNews(guardianTag),
    fetchNewsApi(newsApiQuery),
  ])

  // 3. Extract successful data
  const guardianArticles = guardianResults.status === "fulfilled" ? guardianResults.value : []
  const otherArticles = newsApiResults.status === "fulfilled" ? newsApiResults.value : []

  // 4. Combine
  let allArticles = [...guardianArticles, ...otherArticles]

  // 5. Deduplicate (by URL)
  const seenUrls = new Set()
  allArticles = allArticles.filter(article => {
    if (seenUrls.has(article.url)) return false
    seenUrls.add(article.url)
    return true
  })

  // 6. Sort by Date (Newest First)
  allArticles.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  // 7. Return Unified Response
  if (allArticles.length === 0) {
     return NextResponse.json(
        { ok: false, error: "No news articles found", data: [] },
        { status: 404 }
      )
  }

  return NextResponse.json({ 
    ok: true, 
    data: allArticles 
  })
}
