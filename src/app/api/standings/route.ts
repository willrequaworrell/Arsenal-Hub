import { NextResponse } from 'next/server';
import { afGet, API } from '@/lib/api-football';

export const revalidate = 300; // 5 min

export async function GET() {
  const data = await afGet('/standings', {
    league: API.league,
    season: API.season,
  });
  // API returns { response: [{ league: { standings: [[ rows ]] }}] }
  const rows = data?.response?.[0]?.league?.standings?.[0] ?? [];
  return NextResponse.json(rows);
}
