import { z } from "zod"

export const StatisticSchema = z.object({
  type: z.string(),
  value: z.union([z.number(), z.string(), z.null()]),
})

export const TeamStatisticsSchema = z.object({
  team: z.object({
    id: z.number(),
    name: z.string(),
    logo: z.string().url(),
  }),
  statistics: z.array(StatisticSchema),
})

export const FixtureStatisticsSchema = z.array(TeamStatisticsSchema)

export type FixtureStatistics = z.infer<typeof FixtureStatisticsSchema>
export type TeamStatistics = z.infer<typeof TeamStatisticsSchema>
