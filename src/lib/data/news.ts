import { z } from "zod"
import { getTeamConfig } from "@/lib/config/team"
import { DEFAULT_TEAM_ID } from "@/lib/config/api-football"

// --- Configuration Constants ---

const REVALIDATE_SECS = 1800 // 30 minutes

// 1. Centralized Exclusions
// Add terms here to ban them from BOTH APIs and the manual filter
const EXCLUDED_KEYWORDS = [
  "Women",
  "Women's", 
  "Ladies",
  "WSL",
  "W.S.l.",
  "Female", 
  "Girl",
  "Girls",
]

// 2. Generate Query Strings
// Result: "-Women -WSL -Ladies ..."
const EXCLUSION_QUERY_STRING = EXCLUDED_KEYWORDS.map(k => `-${k}`).join(" ")

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

// --- Helper Functions ---

async function fetchGuardianNews(tag: string): Promise<NewsArticle[]> {
  if (!GUARDIAN_API_KEY) return []

  try {
    const url = new URL("https://content.guardianapis.com/search")
    
    // API-Level Filtering
    url.searchParams.set("tag", tag)
    // Guardian supports boolean operators in 'q'. 
    // This combines the Tag (Arsenal) AND the Query (NOT Women...)
    url.searchParams.set("q", EXCLUSION_QUERY_STRING) 
    
    url.searchParams.set("show-fields", "thumbnail,trailText")
    url.searchParams.set("page-size", "10") 
    url.searchParams.set("order-by", "newest")
    url.searchParams.set("api-key", GUARDIAN_API_KEY)

    const res = await fetch(url.toString(), { next: { revalidate: REVALIDATE_SECS } })
    if (!res.ok) return []
    
    const data = await res.json()
    const parsed = GuardianResponseSchema.safeParse(data)
    if (!parsed.success) return []

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
    console.error("[Guardian API] Error:", error)
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
    if (!res.ok) return []

    const data = await res.json()
    const parsed = NewsApiResponseSchema.safeParse(data)
    if (!parsed.success) return []

    return parsed.data.articles
      .filter(a => a.title !== "[Removed]" && a.description) 
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
    console.error("[NewsAPI] Error:", error)
    return []
  }
}

// --- Safety Net Filter (Client-side Logic) ---
// This catches edge cases where the API search might have been "fuzzy"
function isExcluded(article: NewsArticle): boolean {
  const text = (article.title + " " + article.summary).toLowerCase()
  // Check against our centralized list
  return EXCLUDED_KEYWORDS.some(keyword => text.includes(keyword.toLowerCase()))
}

// --- Main Export ---

export const getTeamNews = async (teamId: string = DEFAULT_TEAM_ID): Promise<NewsResult> => {
  const teamConfig = getTeamConfig(teamId)
  const baseName = teamConfig.name
  const guardianTag = teamConfig.guardianTag || "football/football"

  // Construct NewsAPI Query: "Arsenal" AND (League OR ...) -Women -WSL ...
  const newsApiQuery = `"${baseName}" AND (League OR Football OR Transfer) ${EXCLUSION_QUERY_STRING}` 

  try {
    const [guardianResults, newsApiResults] = await Promise.allSettled([
      fetchGuardianNews(guardianTag),
      fetchNewsApi(newsApiQuery),
    ])

    const guardianArticles = guardianResults.status === "fulfilled" ? guardianResults.value : []
    const otherArticles = newsApiResults.status === "fulfilled" ? newsApiResults.value : []

    // 1. Combine
    let allArticles = [...guardianArticles, ...otherArticles]
    
    // 2. Final Safety Filter
    // Even with API parameters, sometimes search indexes are weird. 
    // This double-checks the actual content before showing it.
    allArticles = allArticles.filter(article => !isExcluded(article))

    // 3. Deduplicate by URL
    const seenUrls = new Set()
    allArticles = allArticles.filter(article => {
      if (seenUrls.has(article.url)) return false
      seenUrls.add(article.url)
      return true
    })

    // 4. Sort Newest First
    allArticles.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )

    return { data: allArticles, success: true }

  } catch (error) {
    return { data: null, success: false, message: "Failed to load news" }
  }
}
