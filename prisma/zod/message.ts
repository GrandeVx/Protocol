import * as z from "zod"
import { Completemail, relatedmailSchema } from "./index"

export const messageSchema = z.object({
  id: z.string(),
  mail_id: z.string(),
  subject: z.string(),
  body: z.string(),
  from: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface Completemessage extends z.infer<typeof messageSchema> {
  mail: Completemail
}

/**
 * relatedmessageSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedmessageSchema: z.ZodSchema<Completemessage> = z.lazy(() => messageSchema.extend({
  mail: relatedmailSchema,
}))
