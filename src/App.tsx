import React, { useState, useEffect } from 'react';
import { invoke } from "@tauri-apps/api/core";
import { TimeData } from './interface.ts';
import CountdownTimer from './CountDownTimer.tsx'

function App() {
    // const [name, setName] = useState("");
    const [timeData, setTimeData] = useState<TimeData | null>(null);

    useEffect(() => {
        const fetchTime = async () => {
            try {
                const data = await invoke<TimeData>("get_current_time");
                setTimeData(data);
            } catch (error) {
                console.error("Error fetching time", error);
            }
        };

        fetchTime();

        const timer = setInterval(fetchTime, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <main className="container">
            <h1>Pomodoro Application</h1>
            <div className="time-display">
                <h2>Current System time</h2>
                {timeData ? (
                    <>
                        <p>Date: {timeData.date_string} Time: {timeData.time_string}</p>
                    </>
                ) : (<p>Loading time data ...</p>)}
            </div>
            <CountdownTimer />
        </main>
    );
}

export default App;