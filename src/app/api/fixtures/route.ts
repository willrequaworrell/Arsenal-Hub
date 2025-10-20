import { fetchFromAPIFootball} from '@/lib/api-football/api-football';
import { FixturesArraySchema } from '@/lib/api-football/schemas/fixtures';
import { API_FOOTBALL, DEFAULT_TEAM_ID } from '@/lib/config/api-football';
import { NextResponse } from 'next/server';

export const revalidate = 60;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const teamId = searchParams.get("teamId") ?? DEFAULT_TEAM_ID

  try {
    const data = await fetchFromAPIFootball('/fixtures', {
      league: API_FOOTBALL.leagueId,
      season: API_FOOTBALL.season,
      team: teamId
    });
    const fixtures = data?.response ?? null;
    const parsed = FixturesArraySchema.safeParse(fixtures)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid standings payload", issues: parsed.error.message},
        { status: 502 }
      );
    }

    console.log(parsed.data[0].teams);

    return NextResponse.json({ ok: true, data: parsed.data })

  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Upstream failure" },
      { status: 502 }
    )
  }
}
