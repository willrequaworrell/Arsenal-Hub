// app/api/fixtures/statistics/route.ts
import { fetchFromAPIFootball } from '@/lib/api-football/api-football'
import { FixtureStatisticsSchema } from '@/lib/api-football/schemas/statistics'
import { validateAPIFootballResponse } from '@/lib/api-football/validate-response'
import { NextResponse } from 'next/server'

export const revalidate = 300 // 5 minutes

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const fixtureId = searchParams.get('fixtureId')

  if (!fixtureId) {
    return NextResponse.json(
      { ok: false, error: 'fixtureId is required' },
      { status: 400 }
    )
  }

  try {
    const data = await fetchFromAPIFootball('/fixtures/statistics', {
      fixture: fixtureId,
    })

    // Validate API-Football response
    const validation = validateAPIFootballResponse(data)
    if (!validation.valid) {
      return NextResponse.json(
        { ok: false, error: validation.error, details: validation.details },
        { status: validation.details ? 400 : 404 }
      )
    }

    const statistics = data?.response ?? null
    const parsed = FixtureStatisticsSchema.safeParse(statistics)

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: 'Invalid statistics payload', issues: parsed.error.message },
        { status: 502 }
      )
    }

    return NextResponse.json({ ok: true, data: parsed.data })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: 'Upstream failure' },
      { status: 502 }
    )
  }
}
