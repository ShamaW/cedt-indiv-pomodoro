import React, { useState, useEffect } from 'react';
import { PhysicalPosition, Window } from "@tauri-apps/api/window";

function CountdownTimer() {
    const [startTime, setStartTime] = useState<string | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [remainingSeconds, setRemainingSeconds] = useState(0);
    const [inputMinutes, setInputMinutes] = useState("5");
    const [isPaused, setIsPaused] = useState(false);

    const formatTime = (totalSecond : number) => {
        const minutes = Math.floor(totalSecond / 60);
        const second = totalSecond % 60;
        return `${minutes.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        let interval : number | undefined;

        if (isRunning && !isPaused && remainingSeconds > 0) {
            interval = window.setInterval(() => {
                setRemainingSeconds(prev => prev - 1);
            }, 1000);
        }
        else if (remainingSeconds <= 0 && isRunning) {
            setIsRunning(false);
            setIsPaused(false);
            shakeWindow();
            // sound
        }

        return () => {if (interval) clearInterval(interval)};
    }, [isRunning, isPaused, remainingSeconds]);

    const handleStart = () => {
        const durationSeconds = parseInt(inputMinutes) * 60;
        setRemainingSeconds(durationSeconds);
        setIsRunning(true);
        setIsPaused(false);
        setStartTime(new Date().toISOString());
        console.log("start");
    };

    const handleStop = () => {
        setIsRunning(false);
        setIsPaused(false);
    };

    const handlePause = () => { setIsPaused(true); };
    const handleResume = () => { setIsPaused(false); };

    const getStatus = () => {
        if (!isRunning) return "Stopped";
        if (isPaused) return "Paused";
        return "Running";
    }

    const shakeWindow = async () => {
        const appWindow = Window.getCurrent();

        const position = await appWindow.outerPosition();
        const baseX = position.x;
        const baseY = position.y;
        
        const shakePattern = [
            { x: -10, y: -10 },
            { x: 10, y: -10 },
            { x: 8, y: 8 },
            { x: 8, y: -8 },
            { x: -5, y: -5 },
            { x: 5, y: -5 },
            { x: 0, y: 0 }
        ];
        
        for (let i = 0; i < shakePattern.length; i++) {
            setTimeout(async () => {
                await appWindow.setPosition(
                    new PhysicalPosition(baseX + shakePattern[i].x, baseY + shakePattern[i].y)
                );
            }, i * 50);
        }
    };

    return (
        <div className="timer-container">
            <div className="timer-display">
                <h1>{formatTime(remainingSeconds)}</h1>
                <p>Status: {getStatus()}</p>
            </div>

            <div className="timer-controls">
                <input
                    type="number"
                    value={inputMinutes}
                    onChange={(e) => setInputMinutes(e.target.value)}
                    min="1"
                    max="60"
                    disabled={isRunning}
                    placeholder='5'
                />
                <span> minutes</span>
                <div>
                    <button onClick={handleStart} disabled={isRunning} >Start</button>
                    {isRunning && !isPaused && (<button onClick={handlePause}>Pause</button>)}
                    {isRunning && isPaused && (<button onClick={handleResume}>Resume</button>)}
                    <button onClick={handleStop} disabled={!isRunning}>Stop</button>
                </div>
            </div>
        </div>
    );
}

export default CountdownTimer;