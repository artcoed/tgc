import { useTelegramApp } from './useTelegramApp';

const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

export interface AuthData {
    telegramId: number;
    token: string;
    userData?: any;
}

export const useAuthStorage = () => {
    const { localStorage } = useTelegramApp();

    const saveAuthData = (authData: AuthData) => {
        try {
            localStorage.setItem(AUTH_TOKEN_KEY, authData.token);
            if (authData.userData) {
                localStorage.setItem(USER_DATA_KEY, JSON.stringify(authData.userData));
            }
        } catch (error) {
            console.error('Error saving auth data:', error);
        }
    };

    const getAuthData = (): AuthData | null => {
        try {
            const token = localStorage.getItem(AUTH_TOKEN_KEY);
            const userDataStr = localStorage.getItem(USER_DATA_KEY);
            
            if (!token) return null;

            const userData = userDataStr ? JSON.parse(userDataStr) : null;
            
            // Извлекаем telegramId из токена или userData
            const telegramId = userData?.telegram_id || null;
            
            if (!telegramId) return null;

            return {
                telegramId,
                token,
                userData,
            };
        } catch (error) {
            console.error('Error getting auth data:', error);
            return null;
        }
    };

    const clearAuthData = () => {
        try {
            localStorage.removeItem(AUTH_TOKEN_KEY);
            localStorage.removeItem(USER_DATA_KEY);
        } catch (error) {
            console.error('Error clearing auth data:', error);
        }
    };

    const isAuthenticated = (): boolean => {
        return getAuthData() !== null;
    };

    return {
        saveAuthData,
        getAuthData,
        clearAuthData,
        isAuthenticated,
    };
}; 