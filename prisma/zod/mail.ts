import * as z from "zod"
import { Completemessage, relatedmessageSchema, Completeuser, relateduserSchema } from "./index"

export const mailSchema = z.object({
  id: z.string(),
  from: z.string(),
  to: z.string(),
  is_deleted: z.boolean(),
  is_viewed: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface Completemail extends z.infer<typeof mailSchema> {
  messages: Completemessage[]
  sent_by: Completeuser
  received_by: Completeuser
}

/**
 * relatedmailSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedmailSchema: z.ZodSchema<Completemail> = z.lazy(() => mailSchema.extend({
  messages: relatedmessageSchema.array(),
  sent_by: relateduserSchema,
  received_by: relateduserSchema,
}))
