import { z } from "zod"

/**
 * In Zod v4, prefer z.looseObject(...) when you want to allow unknown keys
 * (previously .passthrough()). For API‑Football, these nested objects often
 * include extra fields you don’t care about. Using looseObject prevents
 * parse failures when the provider adds fields.
 */

// Inner “side result” objects often look like { total: number, ...extras }
const ResultSideSchema = z.looseObject({
  total: z.number().nullable().optional(),
})

// The “fixtures” aggregate typically contains wins/draws/loses each with totals,
// plus other keys we don’t need; keep it loose so added fields won’t break parsing.
export const TeamStatsRecordSchema = z.looseObject({
  wins: ResultSideSchema,
  draws: ResultSideSchema,
  loses: ResultSideSchema,
})

// Top‑level team statistics. The endpoint returns a large object with many sections
// (biggest streaks, goals per minute, etc.). We only pick what we need but keep the
// container loose to tolerate new sections without failing.
export const TeamStatsSchema = z.looseObject({
  form: z.string().nullable().optional(), // e.g., "WWDLW"
  fixtures: TeamStatsRecordSchema.optional(),
})

// Inferred TS type for callers that need the wide object:
export type TeamStats = z.infer<typeof TeamStatsSchema>

// A compact UI shape you can use across widgets:
export type TeamFormAndRecord = {
  form: string
  record: { w: number; d: number; l: number }
}

// Normalize the API object into a small, UI‑friendly structure.
export function toFormAndRecord(stats: TeamStats): TeamFormAndRecord {
  const form = stats.form ?? ""
  const w = stats.fixtures?.wins?.total ?? 0
  const d = stats.fixtures?.draws?.total ?? 0
  const l = stats.fixtures?.loses?.total ?? 0
  return { form, record: { w, d, l } }
}
