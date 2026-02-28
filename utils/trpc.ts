import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../app/api/root";

export const trpc = createTRPCReact<AppRouter>();