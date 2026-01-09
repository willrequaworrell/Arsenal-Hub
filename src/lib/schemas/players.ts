import { z } from "zod"

// Player basic info (from /players/squads)
export const PlayerSquadSchema = z.object({
  id: z.number(),
  name: z.string(),
  age: z.number().nullable(),
  number: z.number().nullable(),
  position: z.string(),
  photo: z.string().url(),
})

export const TeamSquadSchema = z.object({
  team: z.object({
    id: z.number(),
    name: z.string(),
    logo: z.string().url(),
  }),
  players: z.array(PlayerSquadSchema),
})

export type PlayerSquad = z.infer<typeof PlayerSquadSchema>
export type TeamSquad = z.infer<typeof TeamSquadSchema>

// Player detailed stats (from /players?season=X&team=Y)
export const PlayerStatisticsSchema = z.object({
  player: z.object({
    id: z.number(),
    name: z.string(),
    firstname: z.string().nullable(),
    lastname: z.string().nullable(),
    age: z.number().nullable(),
    birth: z.object({
      date: z.string().nullable(),
      place: z.string().nullable(),
      country: z.string().nullable(),
    }).nullable(),
    nationality: z.string().nullable(),
    height: z.string().nullable(),
    weight: z.string().nullable(),
    injured: z.boolean().nullable(),
    photo: z.string().url(),
  }),
  statistics: z.array(z.object({
    team: z.object({
      id: z.number(),
      name: z.string(),
      logo: z.string().url().nullable(),
    }),
    league: z.object({
      id: z.number(),
      name: z.string(),
      country: z.string(),
      logo: z.string().url().nullable(),
      flag: z.string().url().nullable(),
      season: z.number(),
    }),
    games: z.object({
      appearences: z.number().nullable(),
      lineups: z.number().nullable(),
      minutes: z.number().nullable(),
      number: z.number().nullable(),
      position: z.string().nullable(),
      rating: z.string().nullable(),
      captain: z.boolean().nullable(),
    }).nullable(),
    substitutes: z.object({
      in: z.number().nullable(),
      out: z.number().nullable(),
      bench: z.number().nullable(),
    }).nullable(),
    shots: z.object({
      total: z.number().nullable(),
      on: z.number().nullable(),
    }).nullable(),
    goals: z.object({
      total: z.number().nullable(),
      conceded: z.number().nullable(),
      assists: z.number().nullable(),
      saves: z.number().nullable(),
    }).nullable(),
    passes: z.object({
      total: z.number().nullable(),
      key: z.number().nullable(),
      accuracy: z.number().nullable(),
    }).nullable(),
    tackles: z.object({
      total: z.number().nullable(),
      blocks: z.number().nullable(),
      interceptions: z.number().nullable(),
    }).nullable(),
    duels: z.object({
      total: z.number().nullable(),
      won: z.number().nullable(),
    }).nullable(),
    dribbles: z.object({
      attempts: z.number().nullable(),
      success: z.number().nullable(),
      past: z.number().nullable(),
    }).nullable(),
    fouls: z.object({
      drawn: z.number().nullable(),
      committed: z.number().nullable(),
    }).nullable(),
    cards: z.object({
      yellow: z.number().nullable(),
      yellowred: z.number().nullable(),
      red: z.number().nullable(),
    }).nullable(),
    penalty: z.object({
      won: z.number().nullable(),
      commited: z.number().nullable(),
      scored: z.number().nullable(),
      missed: z.number().nullable(),
      saved: z.number().nullable(),
    }).nullable(),
  })),
})

export const PlayersArraySchema = z.array(PlayerStatisticsSchema)

export type PlayerStatistics = z.infer<typeof PlayerStatisticsSchema>
export type PlayersArray = z.infer<typeof PlayersArraySchema>
