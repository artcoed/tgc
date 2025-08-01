import React from 'react';
import { trpc } from './trpc';
import Futures from "@/components/Futures.tsx";
import './App.css';
import RouletteWindow from "@/components/RouletteWindow.tsx";
import History from "@/components/History.tsx";
import MainPage from "@/components/MainPage.tsx";
import Bonuses from "@/components/Bonuses.tsx";

const App: React.FC = () => {
    const { data, isLoading, error } = trpc.listBots.useQuery();

    // if (isLoading) return <div>Загрузка...</div>;
    // if (error) return <div>Ошибка: {error.message}</div>;

    return (
        <div>
            {/*<p>Данные: {JSON.stringify(data)}</p>*/}
            <MainPage/>
        </div>
    );
};

export default App;