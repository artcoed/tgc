"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = exports.router = exports.publicProcedure = void 0;
const server_1 = require("@trpc/server");
// Initialize tRPC
const t = server_1.initTRPC.create();
// Export publicProcedure and router.ts for use in procedures.ts
exports.publicProcedure = t.procedure;
exports.router = t.router;
// Import procedures after defining exports to avoid circular dependency
const procedures_1 = require("./procedures");
// Create and export appRouter
exports.appRouter = t.mergeRouters(procedures_1.rouletteProcedures);
