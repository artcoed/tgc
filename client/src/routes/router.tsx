import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Futures from "@/components/Futures.tsx";
import RouletteWindow from "@/components/RouletteWindow.tsx";
import Bonuses from "@/components/Bonuses.tsx";
import RouletteRegistrationBlock from "@/components/RouletteRegistrationBlock.tsx";
import UserProfile from "@/components/UserProfile.tsx";
import { useAuth } from '../contexts/AuthContext';

const MainPage = lazy(() => import('../components/MainPage'));
const History = lazy(() => import('../components/History'));
const Manager = lazy(() => import('../components/Manager'));

// Компонент загрузки
const LoadingSpinner: React.FC = () => (
    <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
    }}>
        Загрузка...
    </div>
);

// Компонент-обертка для проверки аутентификации
const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isRegistered, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!isRegistered) {
        return <RouletteRegistrationBlock />;
    }

    return (
        <Suspense fallback={<LoadingSpinner />}>
            {children}
        </Suspense>
    );
};

const routes: RouteObject[] = [
    {
        path: '/',
        element: (
            <AuthWrapper>
                <MainPage />
            </AuthWrapper>
        ),
    },
    {
        path: '/profile',
        element: (
            <AuthWrapper>
                <UserProfile />
            </AuthWrapper>
        ),
    },
    {
        path: '/history',
        element: (
            <AuthWrapper>
                <History />
            </AuthWrapper>
        ),
    },
    {
        path: '/manager',
        element: (
            <AuthWrapper>
                <Manager />
            </AuthWrapper>
        ),
    },
    {
        path: '/trading',
        element: (
            <AuthWrapper>
                <Futures />
            </AuthWrapper>
        ),
    },
    {
        path: '/roulette',
        element: (
            <AuthWrapper>
                <RouletteWindow />
            </AuthWrapper>
        ),
    },
    {
        path: '/bonuses',
        element: (
            <AuthWrapper>
                <Bonuses />
            </AuthWrapper>
        ),
    },
    {
        path: '*',
        element: (
            <AuthWrapper>
                <MainPage />
            </AuthWrapper>
        ),
    },
];

const router = createBrowserRouter(routes);

export default router;