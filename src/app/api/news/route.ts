// app/api/news/route.ts
import { NextResponse } from "next/server"
import { getTeamConfig } from "@/lib/config/team"
import { GuardianResponseSchema } from "@/lib/api-football/schemas/articles"

export const revalidate = 600 // 10 min

const GUARDIAN_API_KEY = process.env.GUARDIAN_API_KEY!
const GUARDIAN_BASE_URL = "https://content.guardianapis.com"
const DEFAULT_TEAM_ID = process.env.API_FOOTBALL_TEAM_ID ?? "42"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const teamId = searchParams.get("teamId") ?? DEFAULT_TEAM_ID
  const teamConfig = getTeamConfig(teamId)

  try {
    const url = new URL("/search", GUARDIAN_BASE_URL)
    url.searchParams.set("tag", teamConfig.guardianTag)
    url.searchParams.set("show-fields", "thumbnail,trailText")
    url.searchParams.set("page-size", "5")
    url.searchParams.set("order-by", "newest")
    url.searchParams.set("api-key", GUARDIAN_API_KEY)

    const res = await fetch(url.toString(), {
      signal: AbortSignal.timeout(8000),
    })

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: `Guardian API error ${res.status}` },
        { status: 502 }
      )
    }

    const data = await res.json()
    const parsed = GuardianResponseSchema.safeParse(data)

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid Guardian response", issues: parsed.error.format() },
        { status: 422 }
      )
    }

    // Transform to your NewsArticle format
    const articles = parsed.data.response.results.map((article) => ({
      title: article.webTitle,
      link: article.webUrl,
      pubDate: article.webPublicationDate,
      content: article.fields?.trailText ?? "",
      thumbnail: article.fields?.thumbnail ?? null,
    }))

    return NextResponse.json({ ok: true, data: articles })
  } catch {
    return NextResponse.json(
      { ok: false, error: "Upstream failure" },
      { status: 502 }
    )
  }
}
