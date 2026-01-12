import { fetchFromAPIFootball } from '@/lib/api-football/api-football'
import { FixtureEventsSchema } from '@/lib/schemas/fixture-events'
import { validateAPIFootballResponse } from '@/lib/api-football/validate-response'
import { NextResponse } from 'next/server'

// Cache this endpoint for 1 hour
export const revalidate = 3600

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const fixtureId = searchParams.get('fixtureId')

  if (!fixtureId) {
    return NextResponse.json({ ok: false, error: 'fixtureId is required' }, { status: 400 })
  }

  try {
    // Upstream call with heavy caching
    const data = await fetchFromAPIFootball(
      '/fixtures/events', 
      { fixture: fixtureId },
      // Cache for 24 hours
      { revalidate: 86400, tags: [`events-${fixtureId}`] }
    )

    const validation = validateAPIFootballResponse(data)
    if (!validation.valid) {
      return NextResponse.json({ ok: false, error: validation.error }, { status: 400 })
    }

    const events = data?.response ?? []
    const parsed = FixtureEventsSchema.safeParse(events)

    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 502 })
    }

    return NextResponse.json({ ok: true, data: parsed.data })
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Upstream failure' }, { status: 502 })
  }
}
