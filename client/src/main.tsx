import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc, createTRPCClient } from './trpc';
import App from './App';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';

const queryClient = new QueryClient();
const trpcClient = createTRPCClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <trpc.Provider client={trpcClient} queryClient={queryClient}>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </trpc.Provider>
        </QueryClientProvider>
    </React.StrictMode>
);