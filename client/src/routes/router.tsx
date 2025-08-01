import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import Futures from "@/components/Futures.tsx";
import RouletteWindow from "@/components/RouletteWindow.tsx";
import Bonuses from "@/components/Bonuses.tsx";

const MainPage = lazy(() => import('../components/MainPage'));
const History = lazy(() => import('../components/History'));
const Manager = lazy(() => import('../components/Manager'));

const routes: RouteObject[] = [
    {
        path: '/',
        element: <MainPage />,
    },
    {
        path: '/history',
        element: <History />,
    },
    {
        path: '/manager',
        element: <Manager />,
    },
    {
        path: '/trading',
        element: <Futures />,
    },
    {
        path: '/roulette',
        element: <RouletteWindow />,
    },
    {
        path: '/bonuses',
        element: <Bonuses />,
    },
    {
        path: '*',
        element: <MainPage />,
    },
];

const router = createBrowserRouter(routes);

export default router;