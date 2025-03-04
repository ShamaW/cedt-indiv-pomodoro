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
            <h1>Pomodoro Application</h1>
            <div className="time-display">
                <h2>Current System time</h2>
                <p>Date: {currentTime.toLocaleDateString()}</p>
                <p>Time: {currentTime.toLocaleTimeString()}</p>
            </div>
            <CountdownTimer />
        </main>
    );
}

export default App;