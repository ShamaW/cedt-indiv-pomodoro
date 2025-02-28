import React, { useState, useEffect } from 'react';
import CountdownTimer from './CountdownTimer.tsx'

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
                <p>Current System time: {currentTime.toLocaleTimeString()}</p>
                <p>Date: {currentTime.toLocaleDateString()}</p>
            </div>
            <CountdownTimer />
        </main>
    );
}

export default App;