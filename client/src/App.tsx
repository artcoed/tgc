import React from 'react';
import './App.css';
import MainPage from "@/components/MainPage.tsx";
import DebugInfo from "@/components/DebugInfo.tsx";

const App: React.FC = () => {
    return (
        <div>
            <MainPage/>
            <DebugInfo />
        </div>
    );
};

export default App;