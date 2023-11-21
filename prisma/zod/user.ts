import * as z from "zod"
import { Completemail, relatedmailSchema } from "./index"

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  profileImageUrl: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface Completeuser extends z.infer<typeof userSchema> {
  mails_sent: Completemail[]
  mails_received: Completemail[]
}

/**
 * relateduserSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relateduserSchema: z.ZodSchema<Completeuser> = z.lazy(() => userSchema.extend({
  mails_sent: relatedmailSchema.array(),
  mails_received: relatedmailSchema.array(),
}))
