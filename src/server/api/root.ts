import { createRouter } from "~/server/api/routers/create";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { readRouter } from "./routers/read";
import { updateRouter } from "./routers/update";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: createRouter,
  get: readRouter,
  put: updateRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
