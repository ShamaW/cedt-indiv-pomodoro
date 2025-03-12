import React, { useState, useEffect } from 'react';
import { Navigation, AppRouter } from './AppNavigation.tsx';

function App() {
    // const [name, setName] = useState("");
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, [])

    return (
        <main className="container">
            <h1>Pomo by ShamaW</h1>
            <div className="time-display">
                <p>Current System time: {currentTime.toLocaleTimeString(undefined, {hour12: false})}</p>
                <p>Date: {currentTime.toLocaleDateString(undefined, {dateStyle:'medium'})}</p>
            </div>
            <Navigation />
            <AppRouter />
        </main>
    );
}

export default App;