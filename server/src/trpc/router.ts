import { initTRPC } from '@trpc/server';

// Initialize tRPC
const t = initTRPC.create();

// Export publicProcedure and router.ts for use in procedures.ts
export const publicProcedure = t.procedure;
export const router = t.router;

// Import procedures after defining exports to avoid circular dependency
import { botProcedures } from './procedures';

// Create and export appRouter
export const appRouter = router({
    ...botProcedures,
});

export type AppRouter = typeof appRouter;