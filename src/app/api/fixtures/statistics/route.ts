import { fetchFromAPIFootball } from '@/lib/api-football/api-football'
import { FixtureStatisticsSchema } from '@/lib/schemas/statistics'
import { validateAPIFootballResponse } from '@/lib/api-football/validate-response'
import { NextResponse } from 'next/server'

// Cache this endpoint itself for 1 hour
export const revalidate = 3600 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const fixtureId = searchParams.get('fixtureId')

  if (!fixtureId) {
    return NextResponse.json({ ok: false, error: 'fixtureId is required' }, { status: 400 })
  }

  try {
    // Upstream call with heavy caching
    // Statistics for a specific fixture ID rarely change once generated/finished
    const data = await fetchFromAPIFootball(
      '/fixtures/statistics', 
      { fixture: fixtureId },
      // Cache this upstream call for 24 hours (86400s)
      { revalidate: 86400, tags: [`statistics-${fixtureId}`] }
    )

    const validation = validateAPIFootballResponse(data)
    if (!validation.valid) {
      return NextResponse.json({ ok: false, error: validation.error }, { status: 400 })
    }

    const statistics = data?.response ?? null
    const parsed = FixtureStatisticsSchema.safeParse(statistics)

    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 502 })
    }

    return NextResponse.json({ ok: true, data: parsed.data })
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Upstream failure' }, { status: 502 })
  }
}
