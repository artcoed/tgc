import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@server/trpc/router'; // Ensure this path is correct

export const trpc = createTRPCReact<AppRouter>();

export const createTRPCClient = () => {
    return trpc.createClient({
        links: [
            httpBatchLink({
                url: 'http://localhost:3000/',
            }),
        ],
    });
};