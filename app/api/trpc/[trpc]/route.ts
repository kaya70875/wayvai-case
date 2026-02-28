import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "../../../../server/api/trcp";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });

// BU SATIR KRİTİK: Next.js App Router büyük harfli GET ve POST bekler
export { handler as GET, handler as POST };