import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const createRouter = createTRPCRouter({
  createBrowseHistory: protectedProcedure
    .input(
      z.object({
        url: z.string().describe("arxiv article url"),
        title: z.string().describe("arxiv article title"),
      }),
    )
    .query(async ({ ctx, input }) =>
      ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          browseHistories: {
            create: {
              url: input.url,
              title: input.title,
            },
          },
        },
        select: {
          browseHistories: {
            orderBy: {
              browsedAt: "desc",
            },
            take: 10,
          },
        },
      }),
    ),
  createBookmark: protectedProcedure
    .input(
      z.object({
        url: z.string().describe("arxiv article url"),
        title: z.string().describe("arxiv article title"),
      }),
    )
    .query(async ({ ctx, input }) =>
      ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          bookmarks: {
            create: {
              url: input.url,
              title: input.title,
            },
          },
        },
        select: {
          bookmarks: true,
        },
      }),
    ),
  createQueryHistory: protectedProcedure
    .input(
      z.object({
        maxResults: z
          .number()
          .nonnegative()
          .describe("max results param of arxiv api"),
        start: z.number().nonnegative().describe("start param of arxiv api"),
        queryParams: z.array(
          z.object({
            key: z.string().describe("key of query param"),
            value: z.string().describe("value of query param"),
            order: z
              .number()
              .nonnegative()
              .describe("order of this query param in overall request"),
            operator: z
              .string()
              .optional()
              .describe(
                "succeeding logic operator connecting multiple query params",
              ),
          }),
        ),
      }),
    )
    .query(async ({ ctx, input }) =>
      ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          queryHistories: {
            create: {
              maxResults: input.maxResults,
              start: input.start,
              queryParams: {
                createMany: {
                  data: input.queryParams,
                },
              },
            },
          },
        },
        select: {
          queryHistories: {
            orderBy: {
              queriedAt: "desc",
            },
            take: 10,
            include: {
              queryParams: true,
            },
          },
        },
      }),
    ),
  createChannel: protectedProcedure
    .input(
      z.object({
        name: z.string().describe("name of the channel"),
        tags: z
          .array(z.number().nonnegative())
          .describe("array of tag ids to be included"),
      }),
    )
    .query(async ({ ctx, input }) =>
      ctx.db.channel.create({
        data: {
          name: input.name,
          createdBy: {
            connect: { id: ctx.session.user.id },
          },
          ownedBy: {
            connect: { id: ctx.session.user.id },
          },
          members: {
            connect: { id: ctx.session.user.id },
          },
          tags: {
            connect: input.tags.map((tagId) => ({ id: tagId })),
          },
        },
      }),
    ),
  createMessage: protectedProcedure
    .input(
      z.object({
        content: z.string().describe("content of the message"),
        replyToId: z
          .number()
          .nonnegative()
          .optional()
          .describe("the id of the message this message is replying to"),
        channelId: z
          .number()
          .nonnegative()
          .describe("id of the channel this message belongs to"),
      }),
    )
    .query(async ({ ctx, input }) =>
      ctx.db.message.create({
        data: {
          content: input.content,
          replyTo: input.replyToId
            ? {
                connect: { id: input.replyToId },
              }
            : undefined,
          sentBy: {
            connect: { id: ctx.session.user.id },
          },
          sentTo: {
            connect: { id: input.channelId },
          },
        },
      }),
    ),
});
