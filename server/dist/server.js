"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = createServer;
const standalone_1 = require("@trpc/server/adapters/standalone");
const router_1 = require("./trpc/router");
function createServer() {
    // Define CORS middleware
    const corsMiddleware = (req, res, next) => {
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
    return (0, standalone_1.createHTTPServer)({
        router: router_1.appRouter,
        createContext: () => ({}),
        middleware: corsMiddleware, // Apply the middleware
    });
}
