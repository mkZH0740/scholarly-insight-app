import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const updateRouter = createTRPCRouter({
  subscribeField: protectedProcedure
    .input(
      z.object({
        id: z
          .number()
          .nonnegative()
          .describe("id of the field current user is subscribing to"),
      }),
    )
    .query(async ({ ctx, input }) =>
      ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          fieldSubscriptions: {
            connect: { id: input.id },
          },
        },
      }),
    ),
});
