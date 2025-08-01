import React, { createContext, useContext, useEffect, useState } from 'react';
import { trpc } from '../trpc';
import { useTelegramApp } from '../hooks/useTelegramApp';

interface AuthContextType {
    isRegistered: boolean;
    isLoading: boolean;
    user: any;
    telegramUser: any;
    registerUser: (userData: {
        fullName: string;
        age: number;
        city: string;
        phone: string;
        iban: string;
    }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const { user: telegramUser, isAvailable } = useTelegramApp();
    const [isRegistered, setIsRegistered] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Мутации tRPC
    const upsertUserMutation = trpc.upsertUserFromTelegram.useMutation();
    const completeRegistrationMutation = trpc.completeRegistration.useMutation();

    // Запрос для проверки регистрации
    const { data: isUserRegistered, isLoading: isCheckingRegistration } = trpc.isUserRegistered.useQuery(
        { telegramId: telegramUser?.id || 0 },
        { enabled: !!telegramUser?.id }
    );

    // Запрос для получения данных пользователя
    const { data: currentUser, isLoading: isLoadingUser } = trpc.getCurrentUser.useQuery(
        { telegramId: telegramUser?.id || 0 },
        { enabled: !!telegramUser?.id }
    );

    // Эффект для инициализации пользователя из Telegram
    useEffect(() => {
        if (telegramUser && isAvailable) {
            upsertUserMutation.mutate({
                telegramId: telegramUser.id,
                firstName: telegramUser.first_name,
                lastName: telegramUser.last_name,
                username: telegramUser.username,
                languageCode: telegramUser.language_code,
                isPremium: telegramUser.is_premium,
                allowsWriteToPm: telegramUser.allows_write_to_pm,
            });
        }
    }, [telegramUser, isAvailable]);

    // Эффект для обновления состояния регистрации
    useEffect(() => {
        if (isUserRegistered !== undefined) {
            setIsRegistered(isUserRegistered);
        }
    }, [isUserRegistered]);

    // Эффект для обновления данных пользователя
    useEffect(() => {
        if (currentUser) {
            setUser(currentUser);
        }
    }, [currentUser]);

    // Эффект для управления состоянием загрузки
    useEffect(() => {
        if (telegramUser) {
            setIsLoading(isCheckingRegistration || isLoadingUser);
        } else {
            setIsLoading(false);
        }
    }, [telegramUser, isCheckingRegistration, isLoadingUser]);

    const registerUser = async (userData: {
        fullName: string;
        age: number;
        city: string;
        phone: string;
        iban: string;
    }) => {
        if (!telegramUser?.id) {
            throw new Error('Telegram user not available');
        }

        try {
            const result = await completeRegistrationMutation.mutateAsync({
                telegramId: telegramUser.id,
                ...userData,
            });

            if (result) {
                setUser(result);
                setIsRegistered(true);
            }
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const value: AuthContextType = {
        isRegistered,
        isLoading,
        user,
        telegramUser,
        registerUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 