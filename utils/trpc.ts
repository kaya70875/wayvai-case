import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import type { AppRouter } from '../app/api/root';

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      links: [
        httpBatchLink({
          url: '/api/trpc',
        }),
      ],
    };
  },
  ssr: false,
});