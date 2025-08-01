import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc, createTRPCClient } from './trpc'; // Импорт из вашего файла
import App from './App';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from "../src/routes/router.tsx";

const queryClient = new QueryClient();
const trpcClient = createTRPCClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </trpc.Provider>
    </React.StrictMode>
);