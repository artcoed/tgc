import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { appRouter } from './trpc/router';
import type { IncomingMessage, ServerResponse } from 'http';

export function createServer() {
    // Define CORS middleware
    const corsMiddleware = (req: IncomingMessage, res: ServerResponse, next: (err?: any) => void) => {
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*'); // Replace with your frontend origin (e.g., '*' for all, but use specific in production)
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        // Handle preflight OPTIONS requests
        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }

        // Proceed to the next handler (tRPC)
        next();
    };

    return createHTTPServer({
        router: appRouter,
        createContext: () => ({}),
        middleware: corsMiddleware, // Apply the middleware
    });
}