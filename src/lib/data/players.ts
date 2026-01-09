// lib/data/players.ts
import { PlayerStatistics } from "../schemas/players"

export type PlayersResult = {
  data: PlayerStatistics[] | null
  success: boolean
  message?: string
  meta?: {
    total: number
    league: string
  }
}

const REVALIDATE_SECS = 300

export const getPlayers = async (
  teamId?: string, 
  league?: string
): Promise<PlayersResult> => {
  const absoluteUrl = new URL('/api/players', process.env.NEXT_PUBLIC_BASE_URL)
  
  if (teamId) {
    absoluteUrl.searchParams.set('teamId', teamId)
  }
  
  if (league) {
    absoluteUrl.searchParams.set('league', league)
  }

  const cacheTag = `players-${teamId || 'default'}-${league || '39'}`

  try {
    const res = await fetch(absoluteUrl, {
      next: {
        revalidate: REVALIDATE_SECS,
        tags: [cacheTag]
      },
    })

    if (!res.ok) {
      return { data: null, success: false, message: `HTTP ${res.status}` }
    }

    const json = await res.json() as { 
      ok: boolean
      data?: PlayerStatistics[]
      error?: string
      meta?: { total: number; league: string }
    }
    
    if (!json.ok || !json.data) {
      return { data: null, success: false, message: "invalid payload" }
    }
    
    return { 
      data: json.data, 
      success: true,
      meta: json.meta
    }

  } catch {
    return { data: null, success: false, message: "network/timeout" }
  }
}
