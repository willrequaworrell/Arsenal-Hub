import { fetchFromAPIFootball, API } from '@/lib/api-football/api-football';
import { FixturesArraySchema } from '@/lib/api-football/schemas/fixtures';
import { NextResponse } from 'next/server';

export const revalidate = 60;

export async function GET() {

  try {
    const data = await fetchFromAPIFootball('/fixtures', {
      league: API.league,
      season: API.season,
      team: API.team,
    });
    const fixtures = data?.response ?? null;
    const parsed = FixturesArraySchema.safeParse(fixtures)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid standings payload", issues: parsed.error.message},
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, data: parsed.data })

  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Upstream failure" },
      { status: 502 }
    )
  }
}
