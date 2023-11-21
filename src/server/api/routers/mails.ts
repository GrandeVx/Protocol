import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { MailsPacket } from "global";
import { z } from "zod";

export const mailsRouter = createTRPCRouter({
  getInboundMails: protectedProcedure
    .input(
      z.object({
        user_id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const mails = await ctx.db.user.findUnique({
        where: {
          id: input.user_id,
        },
        select: {
          mails_received: true,
        },
      });

      console.log("sono stato chiamato :", mails);

      if (!mails) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return {
        size: mails.mails_received.length,
        mails: mails.mails_received.filter((mail) => !mail.is_deleted),
      } as MailsPacket;
    }),

  getOutboundMails: protectedProcedure
    .input(
      z.object({
        user_id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const mails = await ctx.db.user.findUnique({
        where: {
          id: input.user_id,
        },
        select: {
          mails_sent: true,
        },
      });

      if (!mails) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return {
        size: mails.mails_sent.length,
        mails: mails.mails_sent.filter((mail) => !mail.is_deleted),
      } as MailsPacket;
    }),

  /*
   *  Get a specific mail
   *  This will return the mail, and mark it as viewed
   */
  getMailMessages: protectedProcedure
    .input(
      z.object({
        mail_id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const mail = await ctx.db.mail.update({
        where: {
          id: input.mail_id,
        },
        data: {
          is_viewed: true,
        },
      });

      if (!mail) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Mail not found",
        });
      }

      const messages = await ctx.db.message.findMany({
        where: {
          mail_id: mail.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return {
        mail: mail,
        messages: messages,
      };
    }),

  GetMailFirstMessage: protectedProcedure
    .input(
      z.object({
        mail_id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const message = await ctx.db.message.findFirst({
        where: {
          mail_id: input.mail_id,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      if (!message) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Message not found",
        });
      }

      return message;
    }),

  unmarkMail: protectedProcedure
    .input(
      z.object({
        mail_id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const mail = await ctx.db.mail.update({
        where: {
          id: input.mail_id,
        },
        data: {
          is_viewed: false,
        },
      });

      if (!mail) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Mail not found",
        });
      }

      return mail;
    }),

  sendMail: protectedProcedure
    .input(
      z.object({
        sender_id: z.string(),
        receiver_id: z.string(),
        title: z.string(),
        content: z.string().max(1000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let mail = await ctx.db.mail.create({
        data: {
          from: input.sender_id,
          to: input.receiver_id,
        },
      });

      if (!mail) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The mail could not be created",
        });
      }

      let message = await ctx.db.message.create({
        data: {
          subject: input.title,
          body: input.content,
          mail_id: mail.id,
          from: input.sender_id,
        },
      });

      if (!message) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The Body cannot be created",
        });
      }

      return mail.id; // Return the mail id for the client routing
    }),

  replyMail: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        mail_id: z.string(),
        user_id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let message = await ctx.db.message.create({
        data: {
          subject: input.title,
          body: input.content,
          mail_id: input.mail_id,
          from: input.user_id,
        },
      });
    }),

  deleteMail: protectedProcedure
    .input(
      z.object({
        mail_id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let mail = await ctx.db.mail.findUnique({
        where: {
          id: input.mail_id,
        },
        select: {
          is_deleted: true,
        },
      });

      if (!mail) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The mail could not be found",
        });
      }

      switch (mail.is_deleted) {
        // If the mail is not deleted, set it to deleted
        case false:
          await ctx.db.mail.update({
            where: {
              id: input.mail_id,
            },
            data: {
              is_deleted: true,
            },
          });
          break;

        // If the mail is deleted, delete it
        case true:
          let r_message = await ctx.db.message.deleteMany({
            where: {
              mail_id: input.mail_id,
            },
          });

          let r_mail = await ctx.db.mail.delete({
            where: {
              id: input.mail_id,
            },
          });

          if (!r_message || !r_message) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "The mail could not be deleted",
            });
          }
          break;
      }
    }),
});
