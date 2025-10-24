import { z } from "zod"

export const EventTeamSchema = z.object({
  id: z.number(),
  name: z.string(),
  logo: z.string().url(),
})

export const EventPlayerSchema = z.object({
  id: z.number().nullable(),
  name: z.string().nullable(),
})

export const EventSchema = z.object({
  time: z.object({
    elapsed: z.number(),
    extra: z.number().nullable().optional(),
  }),
  team: EventTeamSchema,
  player: EventPlayerSchema,
  assist: EventPlayerSchema,
  type: z.string(), // "Goal", "Card", "subst", "Var"
  detail: z.string(), // "Normal Goal", "Yellow Card", "Substitution 1", etc.
  comments: z.string().nullable().optional(),
})

export const FixtureEventsSchema = z.array(EventSchema)

export type FixtureEvents = z.infer<typeof FixtureEventsSchema>
export type Event = z.infer<typeof EventSchema>
