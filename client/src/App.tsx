import React from 'react';
import './App.css';
import MainPage from "@/components/MainPage.tsx";
import RouletteRegistrationBlock from "@/components/RouletteRegistrationBlock.tsx";
import { useAuth } from './contexts/AuthContext';

const AppContent: React.FC = () => {
    const { isRegistered, isLoading } = useAuth();

    // Показываем загрузку пока проверяем статус регистрации
    if (isLoading) {
        return (
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
    }

    // Если пользователь не зарегистрирован, показываем форму регистрации
    if (!isRegistered) {
        return <RouletteRegistrationBlock />;
    }

    // Если пользователь зарегистрирован, показываем основное приложение
    return (
        <div>
            <MainPage/>
        </div>
    );
};

const App: React.FC = () => {
    return <AppContent />;
};

export default App;