import { useEffect, useState } from 'react';

declare global {
    interface Window {
        Telegram?: {
            WebApp: {
                initData: string;
                initDataUnsafe: {
                    query_id?: string;
                    user?: {
                        id: number;
                        is_bot: boolean;
                        first_name: string;
                        last_name?: string;
                        username?: string;
                        language_code?: string;
                        is_premium?: boolean;
                        allows_write_to_pm?: boolean;
                    };
                    receiver?: {
                        id: number;
                        is_bot: boolean;
                        first_name: string;
                        last_name?: string;
                        username?: string;
                    };
                    chat?: {
                        id: number;
                        type: string;
                        title?: string;
                        username?: string;
                    };
                    chat_type?: string;
                    chat_instance?: string;
                    start_param?: string;
                    can_send_after?: number;
                    auth_date: number;
                    hash: string;
                };
                ready(): void;
                expand(): void;
                close(): void;
                MainButton: {
                    text: string;
                    color: string;
                    textColor: string;
                    isVisible: boolean;
                    isProgressVisible: boolean;
                    isActive: boolean;
                    setText(text: string): void;
                    onClick(fn: () => void): void;
                    show(): void;
                    hide(): void;
                    enable(): void;
                    disable(): void;
                    showProgress(leaveActive?: boolean): void;
                    hideProgress(): void;
                };
                BackButton: {
                    isVisible: boolean;
                    onClick(fn: () => void): void;
                    show(): void;
                    hide(): void;
                };
                HapticFeedback: {
                    impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
                    notificationOccurred(type: 'error' | 'success' | 'warning'): void;
                    selectionChanged(): void;
                };
                themeParams: {
                    bg_color?: string;
                    text_color?: string;
                    hint_color?: string;
                    link_color?: string;
                    button_color?: string;
                    button_text_color?: string;
                };
                colorScheme: 'light' | 'dark';
                isExpanded: boolean;
                viewportHeight: number;
                viewportStableHeight: number;
                headerColor: string;
                backgroundColor: string;
                isClosingConfirmationEnabled: boolean;
                // LocalStorage API
                localStorage: {
                    getItem(key: string): string | null;
                    setItem(key: string, value: string): void;
                    removeItem(key: string): void;
                    clear(): void;
                };
            };
        };
    }
}

export interface TelegramUser {
    id: number;
    is_bot: boolean;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    is_premium?: boolean;
    allows_write_to_pm?: boolean;
}

export const useTelegramApp = () => {
    const [isAvailable, setIsAvailable] = useState(false);
    const [user, setUser] = useState<TelegramUser | null>(null);
    const [webApp, setWebApp] = useState<typeof window.Telegram.WebApp | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp;
            setIsAvailable(true);
            setWebApp(tg);
            
            // Инициализируем приложение
            tg.ready();
            
            // Получаем данные пользователя
            if (tg.initDataUnsafe.user) {
                setUser(tg.initDataUnsafe.user);
            }
        }
    }, []);

    const expand = () => {
        if (webApp) {
            webApp.expand();
        }
    };

    const close = () => {
        if (webApp) {
            webApp.close();
        }
    };

    const showMainButton = (text: string, callback: () => void) => {
        if (webApp) {
            webApp.MainButton.setText(text);
            webApp.MainButton.onClick(callback);
            webApp.MainButton.show();
        }
    };

    const hideMainButton = () => {
        if (webApp) {
            webApp.MainButton.hide();
        }
    };

    const showBackButton = (callback: () => void) => {
        if (webApp) {
            webApp.BackButton.onClick(callback);
            webApp.BackButton.show();
        }
    };

    const hideBackButton = () => {
        if (webApp) {
            webApp.BackButton.hide();
        }
    };

    const hapticFeedback = {
        impact: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => {
            if (webApp) {
                webApp.HapticFeedback.impactOccurred(style);
            }
        },
        notification: (type: 'error' | 'success' | 'warning') => {
            if (webApp) {
                webApp.HapticFeedback.notificationOccurred(type);
            }
        },
        selection: () => {
            if (webApp) {
                webApp.HapticFeedback.selectionChanged();
            }
        },
    };

    // LocalStorage методы
    const localStorage = {
        getItem: (key: string): string | null => {
            if (webApp?.localStorage) {
                return webApp.localStorage.getItem(key);
            }
            return null;
        },
        setItem: (key: string, value: string): void => {
            if (webApp?.localStorage) {
                webApp.localStorage.setItem(key, value);
            }
        },
        removeItem: (key: string): void => {
            if (webApp?.localStorage) {
                webApp.localStorage.removeItem(key);
            }
        },
        clear: (): void => {
            if (webApp?.localStorage) {
                webApp.localStorage.clear();
            }
        },
    };

    return {
        isAvailable,
        user,
        webApp,
        expand,
        close,
        showMainButton,
        hideMainButton,
        showBackButton,
        hideBackButton,
        hapticFeedback,
        localStorage,
    };
}; 