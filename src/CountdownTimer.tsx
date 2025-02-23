import React, { useState, useEffect } from 'react';
import { invoke } from "@tauri-apps/api/core";
import { TimerState } from './interface.ts';

function CountdownTimer() {
    const [timerState, setTimerState] = useState<TimerState>({
        remaining_seconds: 0,
        is_running: false,
        start_time: null
    });
    const [inputMinutes, setInputMinutes] = useState("5");

    const formatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        if (timerState.is_running) {
            const interval = setInterval(async () => {
                try {
                    const updateState = await invoke<TimerState>("get_timer_state");
                    setTimerState(updateState);

                    if (updateState.remaining_seconds <= 0 && updateState.is_running) {
                        await invoke<TimerState>("stop_timer");
                    }
                } catch (e) {
                    console.error("Failed to get timer state", e);
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timerState.is_running]);

    const handleStart = async() => {
        try {
            const durationSeconds = parseInt(inputMinutes) * 60;
            const state = await invoke<TimerState>("start_timer", { durationSeconds });
            setTimerState(state);
        } catch (e) {
            console.error("Failed to start timer", e);
        }
    };

    const handleStop = async() => {
        try {
            const state = await invoke<TimerState>("stop_timer");
            setTimerState(state);
        } catch (e) {
            console.error("Failed to stop timer", e);
        }
    };

    return (
        <div className="timer-container">
            <div className="timer-display">
                <h1>{formatTime(timerState.remaining_seconds)}</h1>
                <p>Status: {timerState.is_running ? "Running" : "Stopped"}</p>
            </div>

            <div className="timer-controls">
                <input
                    type="number"
                    value={inputMinutes}
                    onChange={(e) => setInputMinutes(e.target.value)}
                    min="1"
                    max="60"
                    disabled={timerState.is_running}
                    placeholder='5'
                />
                <span> minutes</span>
                <div>
                    <button onClick={handleStart} disabled={timerState.is_running} >Start</button>
                    <button onClick={handleStop} disabled={!timerState.is_running}>Stop</button>
                </div>
            </div>
        </div>
    );
}

export default CountdownTimer;