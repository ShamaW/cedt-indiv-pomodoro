import React from 'react';
import useCountdownTimer from './useCountdownTimer';

const CountdownTimer = () => {
    const {isRunning, remainingSeconds, inputMinutes, isPaused, formatTime, handleStart, handleStop, handlePause, handleResume, getStatus, testNotification} = useCountdownTimer();

    const displayTime = isRunning
        ? formatTime(remainingSeconds)
        : formatTime(parseInt(inputMinutes) * 60);

    return (
        <div className="timer-container">
            <div className="timer-display">
                <h1>{displayTime}</h1>
                <p>Status: {getStatus()}</p>
            </div>

            <div className="timer-controls">
                <div>
                    <button onClick={handleStart} disabled={isRunning} >Start</button>
                    {isRunning && !isPaused && (<button onClick={handlePause}>Pause</button>)}
                    {isRunning && isPaused && (<button onClick={handleResume}>Resume</button>)}
                    <button onClick={handleStop} disabled={!isRunning}>Stop</button>
                </div>
                <button onClick={testNotification}>Test Notification</button>
            </div>
        </div>
    );
}

export default CountdownTimer;