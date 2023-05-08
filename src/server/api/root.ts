import { createTRPCRouter } from "~/server/api/trpc";
import { playerRouter } from "~/server/api/routers/playerRouter";
import { battlePassRouter } from "./routers/battlePassRouter";
import { questRouter } from "./routers/questRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  player: playerRouter,
  battlePass: battlePassRouter,
  quest: questRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
