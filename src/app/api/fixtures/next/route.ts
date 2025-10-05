import { API, fetchFromAPIFootball } from '@/lib/api-football/api-football';
import { NextResponse } from 'next/server';

export const revalidate = 60; // 1 min

export async function GET() {
  // Next single upcoming Arsenal match in PL, current season
  const data = await fetchFromAPIFootball('/fixtures', {
    league: API.league,
    season: API.season,
    team: API.team,
    next: 1,
  });
  const fixture = data?.response?.[0] ?? null;
  return NextResponse.json(fixture);
}
