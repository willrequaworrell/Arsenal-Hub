import { z } from "zod";

export const TeamSchema = z.object({
  id: z.number(),
  name: z.string(),
  // logo can occasionally be null, so allow nullable + optional
  logo: z.string().url().nullable().optional(),
});

const performance = z.object({
  played: z.number(),
  win: z.number(),
  draw: z.number(),
  lose: z.number(),
  goals: z.object({ for: z.number(), against: z.number() }),
});

export const StandingRowSchema = z.object({
  rank: z.number(),
  team: TeamSchema,
  points: z.number(),
  goalsDiff: z.number(),
  // these appear in the payload but can be null, so allow nullable
  group: z.string().nullable().optional(),
  form: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  all: performance,
  home: performance,
  away: performance,
  update: z.string(), // ISO date string
});

export const StandingsArraySchema = z.array(StandingRowSchema);
export type StandingRow = z.infer<typeof StandingRowSchema>;
