import { NextResponse } from "next/server";

export async function GET() {
  const url = new URL("/fixtures", process.env.API_FOOTBALL_BASE_URL!); // v3 base URL [web:19]
  url.searchParams.set("league", process.env.PREMIER_LEAGUE_ID!);       // e.g., 39 PL [web:19]
  url.searchParams.set("season", process.env.SEASON!);                  // e.g., 2024 [web:19]
  url.searchParams.set("team", process.env.ARSENAL_TEAM_ID!);           // e.g., 42 Arsenal [web:19]
  // url.searchParams.set("next", "1");                                    // use “next” filter [web:27]

  const res = await fetch(url.toString(), {
    headers: { "x-apisports-key": process.env.API_FOOTBALL_KEY! },      // direct auth header [web:19]
    cache: "no-store",
  });

  const body = await res.json();
  return NextResponse.json(
    { ok: res.ok, status: res.status, count: body?.response?.length ?? 0, sample: body },
    { status: res.ok ? 200 : res.status },
  );
}
