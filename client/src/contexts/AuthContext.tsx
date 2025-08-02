import React, { createContext, useContext, useEffect, useState } from 'react';
import { trpc } from '../trpc';
import { useTelegramApp } from '../hooks/useTelegramApp';
import { useAuthStorage, AuthData } from '../hooks/useAuthStorage';

interface AuthContextType {
    isRegistered: boolean;
    isLoading: boolean;
    user: any;
    telegramUser: any;
    botId: number | null;
    authToken: string | null;
    registerUser: (userData: {
        fullName: string;
        age: number;
        city: string;
        phone: string;
        iban: string;
    }) => Promise<void>;
    logout: () => void;
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
    const { user: telegramUser, receiver, isAvailable } = useTelegramApp();
    const { saveAuthData, getAuthData, clearAuthData, isAuthenticated } = useAuthStorage();
    const [isRegistered, setIsRegistered] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [botId, setBotId] = useState<number | null>(null);

    // Мутации tRPC
    const upsertUserMutation = trpc.upsertUserFromTelegram.useMutation();
    const completeRegistrationMutation = trpc.completeRegistration.useMutation();

    // Проверяем сохраненную авторизацию при загрузке
    useEffect(() => {
        const savedAuth = getAuthData();
        if (savedAuth) {
            setAuthToken(savedAuth.token);
            if (savedAuth.userData) {
                setUser(savedAuth.userData);
                setIsRegistered(true); // Если есть сохраненные данные, считаем пользователя зарегистрированным
            }
        }
        setIsLoading(false);
    }, []);

    // Запрос для проверки регистрации (только если нет сохраненных данных)
    const { data: isUserRegistered, isLoading: isCheckingRegistration } = trpc.isUserRegistered.useQuery(
        { telegramId: telegramUser?.id || 0, botId: botId || 1 },
        { enabled: !!telegramUser?.id && !!botId && !user } // Проверяем только если нет сохраненных данных
    );

    // Запрос для получения данных пользователя (только если нет сохраненных данных)
    const { data: currentUser, isLoading: isLoadingUser } = trpc.getCurrentUser.useQuery(
        { telegramId: telegramUser?.id || 0, botId: botId || 1 },
        { enabled: !!telegramUser?.id && !!botId && !user } // Загружаем только если нет сохраненных данных
    );

    // Эффект для установки bot_id
    useEffect(() => {
        if (receiver) {
            setBotId(receiver.id);
            console.log('Bot ID set from receiver:', receiver.id);
        } else {
            // Fallback: используем дефолтный bot_id = 1
            setBotId(1);
            console.log('Using fallback bot ID: 1');
        }
    }, [receiver]);

    // Эффект для инициализации пользователя из Telegram
    useEffect(() => {
        if (telegramUser && botId && isAvailable && !user) {
            console.log('Initializing user with botId:', botId);
            upsertUserMutation.mutate({
                telegramId: telegramUser.id,
                botId: botId,
                firstName: telegramUser.first_name,
                lastName: telegramUser.last_name,
                username: telegramUser.username,
                languageCode: telegramUser.language_code,
                isPremium: telegramUser.is_premium,
                allowsWriteToPm: telegramUser.allows_write_to_pm,
            });
        }
    }, [telegramUser, botId, isAvailable, user]);

    // Эффект для обновления состояния регистрации
    useEffect(() => {
        if (isUserRegistered !== undefined && !user) {
            setIsRegistered(isUserRegistered);
        }
    }, [isUserRegistered, user]);

    // Эффект для обновления данных пользователя
    useEffect(() => {
        if (currentUser && !user) {
            setUser(currentUser);
            setIsRegistered(true);
            // Сохраняем данные пользователя в localStorage
            if (telegramUser?.id) {
                const token = `auth_${telegramUser.id}_${Date.now()}`;
                setAuthToken(token);
                saveAuthData({
                    telegramId: telegramUser.id,
                    token,
                    userData: currentUser,
                });
            }
        }
    }, [currentUser, telegramUser?.id, user]);

    // Эффект для управления состоянием загрузки
    useEffect(() => {
        if (telegramUser && !user) {
            setIsLoading(isCheckingRegistration || isLoadingUser);
        } else {
            setIsLoading(false);
        }
    }, [telegramUser, isCheckingRegistration, isLoadingUser, user]);

    const registerUser = async (userData: {
        fullName: string;
        age: number;
        city: string;
        phone: string;
        iban: string;
    }) => {
        if (!telegramUser?.id || !botId) {
            throw new Error('Telegram user or bot not available');
        }

        try {
            const result = await completeRegistrationMutation.mutateAsync({
                telegramId: telegramUser.id,
                botId: botId,
                ...userData,
            });

            if (result) {
                setUser(result);
                setIsRegistered(true);
                
                // Сохраняем авторизацию в localStorage
                const token = `auth_${telegramUser.id}_${Date.now()}`; // Генерируем токен
                setAuthToken(token);
                saveAuthData({
                    telegramId: telegramUser.id,
                    token,
                    userData: result,
                });
            }
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const logout = () => {
        clearAuthData();
        setUser(null);
        setIsRegistered(false);
        setAuthToken(null);
    };

    const value: AuthContextType = {
        isRegistered,
        isLoading,
        user,
        telegramUser,
        botId,
        authToken,
        registerUser,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 