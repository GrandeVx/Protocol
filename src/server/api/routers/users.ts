import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const usersRouter = createTRPCRouter({
  CreateUser: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        email: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        profileImageUrl: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, email, firstName, lastName, profileImageUrl } = input;
      const user = await ctx.db.user.create({
        data: {
          id,
          email,
          firstName,
          lastName,
          profileImageUrl,
        },
      });
      return user;
    }),

  GetUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const user = await ctx.db.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return user;
    }),

  GetUsersFromName: protectedProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      const { name } = input;
      // limit to 10 users
      const users = await ctx.db.user.findMany({
        where: {
          OR: [
            {
              firstName: {
                contains: name,
              },
            },
            {
              lastName: {
                contains: name,
              },
            },
          ],
        },
      });

      if (!users) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No users found",
        });
        return [];
      }

      return users.map((user) => ({
        value: user.id,
        label: user.email,
      }));
    }),
});
