import { initTRPC } from '@trpc/server';

// Initialize tRPC
const t = initTRPC.create();

export const publicProcedure = t.procedure;
export const router = t.router;

import { botProcedures, userProcedures, rouletteProcedures } from './procedures';

const internalRouter = t.router({
    internal: t.router({
        bot: botProcedures,
    }), // Apply middleware to all /internal/bot/... routes
});

// Merge all routers into appRouter
export const appRouter = t.mergeRouters(internalRouter, userProcedures, rouletteProcedures);

export type AppRouter = typeof appRouter;