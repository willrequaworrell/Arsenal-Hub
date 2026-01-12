import { z } from "zod"
import { getTeamConfig } from "@/lib/config/team"
import { DEFAULT_TEAM_ID } from "@/lib/config/api-football"

// --- Types ---
export type NewsArticle = {
  id: string
  title: string
  url: string
  publishedAt: string
  source: string
  summary: string
  imageUrl: string | null
}

export type NewsResult = {
  data: NewsArticle[] | null
  success: boolean
  message?: string
}

// --- Config ---
const REVALIDATE_SECS = 600 // 10 minutes
const GUARDIAN_API_KEY = process.env.GUARDIAN_API_KEY
const NEWS_API_KEY = process.env.NEWS_API_KEY

// --- Schemas ---
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

// --- Helper Functions (Now running directly on Server) ---

async function fetchGuardianNews(tag: string): Promise<NewsArticle[]> {
  if (!GUARDIAN_API_KEY) return []

  try {
    const url = new URL("https://content.guardianapis.com/search")
    url.searchParams.set("tag", tag)
    url.searchParams.set("show-fields", "thumbnail,trailText")
    url.searchParams.set("page-size", "10") 
    url.searchParams.set("order-by", "newest")
    url.searchParams.set("api-key", GUARDIAN_API_KEY)

    const res = await fetch(url.toString(), { next: { revalidate: REVALIDATE_SECS } })
    
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
    url.searchParams.set("q", query) 
    url.searchParams.set("searchIn", "title,description")
    url.searchParams.set("language", "en")
    url.searchParams.set("sortBy", "publishedAt")
    url.searchParams.set("pageSize", "15") 
    url.searchParams.set("excludeDomains", "theguardian.com") 
    url.searchParams.set("apiKey", NEWS_API_KEY)

    const res = await fetch(url.toString(), { next: { revalidate: REVALIDATE_SECS } })
    
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
      .filter(a => a.title !== "[Removed]")
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

// --- Main Export ---

export const getTeamNews = async (teamId: string = DEFAULT_TEAM_ID): Promise<NewsResult> => {
  const teamConfig = getTeamConfig(teamId)
  
  // 1. Prepare Queries
  const baseName = teamConfig.name
  const newsApiQuery = `"${baseName}" AND (League OR Football OR Soccer OR FC) -Women -WSL -Ladies`
  const guardianTag = teamConfig.guardianTag || "football/football"

  try {
    // 2. Parallel Fetch directly from upstream
    const [guardianResults, newsApiResults] = await Promise.allSettled([
      fetchGuardianNews(guardianTag),
      fetchNewsApi(newsApiQuery),
    ])

    const guardianArticles = guardianResults.status === "fulfilled" ? guardianResults.value : []
    const otherArticles = newsApiResults.status === "fulfilled" ? newsApiResults.value : []

    // 3. Combine & Deduplicate
    let allArticles = [...guardianArticles, ...otherArticles]
    const seenUrls = new Set()
    
    allArticles = allArticles.filter(article => {
      if (seenUrls.has(article.url)) return false
      seenUrls.add(article.url)
      return true
    })

    // 4. Sort
    allArticles.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )

    return { data: allArticles, success: true }

  } catch (error) {
    console.error("News Aggregation Error:", error)
    return { data: null, success: false, message: "Failed to aggregate news" }
  }
}
