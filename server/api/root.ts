import { matchingRouter } from "./routers/matching";
import { createTRPCRouter } from "./trcp";

export const appRouter = createTRPCRouter({
  matching: matchingRouter,
});

export type AppRouter = typeof appRouter;