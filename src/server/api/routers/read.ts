import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const readRouter = createTRPCRouter({
  ping: publicProcedure.query(async () => {
    return { ping: "pong" };
  }),
  getCurrentUser: protectedProcedure.query(async ({ ctx }) =>
    ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        name: true,
        email: true,
        image: true,
        browseHistories: { take: 10 },
        queryHistories: { take: 10, include: { queryParams: true } },
      },
    }),
  ),
  getUser: protectedProcedure
    .input(
      z.object({ id: z.string().describe("id of the user to be queried") }),
    )
    .query(async ({ ctx, input }) =>
      ctx.db.user.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      }),
    ),
  getUserBookmarks: protectedProcedure.query(async ({ ctx }) =>
    ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        bookmarks: { orderBy: { bookmarkedAt: "desc" } },
      },
    }),
  ),
  getUserFieldSubscriptions: protectedProcedure.query(async ({ ctx }) =>
    ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        fieldSubscriptions: true,
      },
    }),
  ),
  getUserJoinedChannels: protectedProcedure.query(async ({ ctx }) =>
    ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        joinedChannels: {
          include: {
            tags: true,
            members: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
    }),
  ),
  getChannelMessages: protectedProcedure
    .input(
      z.object({
        id: z
          .number()
          .nonnegative()
          .describe("id of the channel we are getting message from"),
        skip: z
          .number()
          .nonnegative()
          .describe("amount of messages the user already got"),
        amount: z
          .number()
          .nonnegative()
          .default(20)
          .describe("we return 20 messages per page by default"),
      }),
    )
    .query(async ({ ctx, input }) =>
      ctx.db.channel.findUnique({
        where: { id: input.id },
        select: {
          messages: {
            orderBy: {
              createdAt: "desc",
            },
            skip: input.skip,
            take: input.amount,
            include: {
              repliedBy: true,
              replyTo: true,
              sentBy: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
        },
      }),
    ),
});
