import React from 'react';
import { useTelegramApp } from '../hooks/useTelegramApp';
import { useAuth } from '../contexts/AuthContext';

const DebugInfo: React.FC = () => {
    const { user: telegramUser, receiver, isAvailable, webApp } = useTelegramApp();
    const { user, botId } = useAuth();

    if (!isAvailable) {
        return <div style={{ padding: '10px', background: '#ff0000', color: 'white' }}>
            Telegram Web App не доступен
        </div>;
    }

    return (
        <div style={{ 
            padding: '10px', 
            background: '#333', 
            color: 'white', 
            fontSize: '12px',
            position: 'fixed',
            top: '10px',
            right: '10px',
            maxWidth: '300px',
            zIndex: 9999
        }}>
            <h4>Debug Info:</h4>
            <div><strong>Telegram User:</strong> {telegramUser ? `ID: ${telegramUser.id}, Name: ${telegramUser.first_name}` : 'null'}</div>
            <div><strong>Receiver:</strong> {receiver ? `ID: ${receiver.id}, Name: ${receiver.first_name}` : 'null'}</div>
            <div><strong>Bot ID:</strong> {botId || 'null'}</div>
            <div><strong>User from DB:</strong> {user ? `ID: ${user.id}, Telegram ID: ${user.telegram_id}` : 'null'}</div>
            <div><strong>Init Data:</strong> {webApp?.initDataUnsafe ? 'Available' : 'Not available'}</div>
            <pre style={{ fontSize: '10px', overflow: 'auto' }}>
                {JSON.stringify(webApp?.initDataUnsafe, null, 2)}
            </pre>
        </div>
    );
};

export default DebugInfo; 