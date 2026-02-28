import { briefRouter } from "./routers/brief";
import { matchingRouter } from "./routers/matching";
import { createTRPCRouter } from "./trcp";

export const appRouter = createTRPCRouter({
  matching: matchingRouter,
  brief: briefRouter
});

export type AppRouter = typeof appRouter;