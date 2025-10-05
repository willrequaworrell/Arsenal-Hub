import { z } from "zod"

export const FixtureTeamSchema = z.object({
  id: z.number(),
  name: z.string(),
  logo: z.string().url().nullable().optional(),
  winner: z.boolean().nullable().optional(),
})

const PeriodsSchema = z.object({
  first: z.number().nullable().optional(),
  second: z.number().nullable().optional(),
})

const VenueSchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
})

const StatusSchema = z.object({
  long: z.string().nullable().optional(),
  short: z.string().nullable().optional(),
  elapsed: z.number().nullable().optional(),
  extra: z.unknown().nullable().optional(), 
})

const FixtureCoreSchema = z.object({
  id: z.number(),
  referee: z.string().nullable().optional(),
  timezone: z.string(),
  date: z.string(),         // ISO string
  timestamp: z.number(),    // epoch seconds
  periods: PeriodsSchema,
  venue: VenueSchema,
  status: StatusSchema,
})

const LeagueSchema = z.object({
  id: z.number(),
  name: z.string(),
  country: z.string().nullable().optional(),
  logo: z.string().url().nullable().optional(),
  flag: z.string().url().nullable().optional(),
  season: z.number(),
  round: z.string().nullable().optional(),
  standings: z.boolean().nullable().optional(),
})

export const GoalsSchema = z.object({
  home: z.number().nullable().optional(),
  away: z.number().nullable().optional(),
})

const ScoreSideSchema = z.object({
  home: z.number().nullable().optional(),
  away: z.number().nullable().optional(),
})

const ScoreSchema = z.object({
  halftime: ScoreSideSchema,
  fulltime: ScoreSideSchema,
  extratime: ScoreSideSchema,
  penalty: ScoreSideSchema,
})

export const FixtureSchema = z.object({
  fixture: FixtureCoreSchema,
  league: LeagueSchema,
  teams: z.object({
    home: FixtureTeamSchema,
    away: FixtureTeamSchema,
  }),
  goals: GoalsSchema,
  score: ScoreSchema,
})

export const FixturesArraySchema = z.array(FixtureSchema)

export type Fixture = z.infer<typeof FixtureSchema>
