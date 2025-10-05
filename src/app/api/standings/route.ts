

import { fetchFromAPIFootball, API } from "@/lib/api-football/api-football";
import { StandingsArraySchema } from "@/lib/api-football/schemas/standings";
import { NextResponse } from "next/server";

export const revalidate = 300;

export async function GET() {

  try {
    const data = await fetchFromAPIFootball("/standings", {
      league: API.league,
      season: API.season,
    });
  
    // API shape: { response: [{ league: { standings: [[ rows ]] }}] } 
    const rows = data?.response?.[0]?.league?.standings?.[0] ?? [];
    const parsed = StandingsArraySchema.safeParse(rows);
  
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid standings payload", issues: parsed.error.message},
        { status: 502 }
      );
    }
  
    return NextResponse.json({ ok: true, data: parsed.data });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Upstream failure" },
      { status: 502 }
    )
  }
  
}


