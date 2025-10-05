import { fetchFromAPIFootball, API } from '@/lib/api-football/api-football';
import { NextResponse } from 'next/server';

export const revalidate = 60;

export async function GET() {
  // Last finished Arsenal match in PL, current season
  const data = await fetchFromAPIFootball('/fixtures', {
    league: API.league,
    season: API.season,
    team: API.team,
    last: 1,
  });
  const fixture = data?.response?.[0] ?? null;
  return NextResponse.json(fixture);
}
