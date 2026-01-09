import { z } from "zod"

export const StatisticSchema = z.object({
  type: z.string(),
  value: z.union([z.number(), z.string(), z.null()]),
})

export const FixtureTeamStatisticsSchema = z.object({
  team: z.object({
    id: z.number(),
    name: z.string(),
    logo: z.string().url(),
  }),
  statistics: z.array(StatisticSchema),
})

export const FixtureStatisticsSchema = z.array(FixtureTeamStatisticsSchema)

export type FixtureTeamStatistics = z.infer<typeof FixtureTeamStatisticsSchema>
export type FixtureStatistics = z.infer<typeof FixtureStatisticsSchema>
