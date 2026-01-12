import { fetchFromAPIFootball, API } from "@/lib/api-football/api-football"
import { StandingsArraySchema, type StandingRow } from "@/lib/schemas/standings"
import { validateAPIFootballResponse } from "@/lib/api-football/validate-response"

export type StandingsResult = {
  data: StandingRow[] | null
  success: boolean
  message?: string
}

// Cache standings 1 hour
const REVALIDATE_SECS = 3600

export const getStandings = async (): Promise<StandingsResult> => {
  try {
    const data = await fetchFromAPIFootball(
      "/standings", 
      {
        league: API.league,
        season: API.season,
      },
      { revalidate: REVALIDATE_SECS, tags: ['standings'] }
    )

    const validation = validateAPIFootballResponse(data)
    if (!validation.valid) {
      return { 
        data: null, 
        success: false, 
        message: validation.error 
      }
    }
  
    // API shape: { response: [{ league: { standings: [[ rows ]] }}] } 
    const rows = data?.response?.[0]?.league?.standings?.[0] ?? []
    const parsed = StandingsArraySchema.safeParse(rows)
  
    if (!parsed.success) {
      return { 
        data: null, 
        success: false, 
        message: "Invalid standings payload" 
      }
    }
  
    return { data: parsed.data, success: true }
    
  } catch (error) {
    console.error("Standings Fetch Error:", error)
    return { 
      data: null, 
      success: false, 
      message: "Upstream failure" 
    }
  }
}
