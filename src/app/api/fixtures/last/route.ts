import { NextResponse } from 'next/server';
import { afGet, API } from '@/lib/api-football';

export const revalidate = 60;

export async function GET() {
  // Last finished Arsenal match in PL, current season
  const data = await afGet('/fixtures', {
    league: API.league,
    season: API.season,
    team: API.team,
    last: 1,
  });
  const fixture = data?.response?.[0] ?? null;
  return NextResponse.json(fixture);
}
