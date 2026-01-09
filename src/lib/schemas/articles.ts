// src/lib/guardian/schemas/articles.ts
import { z } from "zod"

const ArticleFieldsSchema = z.object({
  thumbnail: z.string().url().optional(),
  trailText: z.string().optional(),
})

export const GuardianArticleSchema = z.object({
  id: z.string(),
  type: z.string(),
  sectionName: z.string().optional(),
  webPublicationDate: z.string(),
  webTitle: z.string(),
  webUrl: z.string().url(),
  fields: ArticleFieldsSchema.optional(),
})

export const GuardianResponseSchema = z.object({
  response: z.object({
    status: z.string(),
    total: z.number(),
    results: z.array(GuardianArticleSchema),
  }),
})

export type GuardianArticle = z.infer<typeof GuardianArticleSchema>
