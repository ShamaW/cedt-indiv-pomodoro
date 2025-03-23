import React from 'react';
import { CountdownTimerProps } from './interface';

const Rest = ({
    isRunning,
    isPaused,
    displayTime,
    handleStart,
    handleStop,
    handlePause,
    handleResume,
    getStatus,
    testNotification
}: CountdownTimerProps) => {
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

export default Rest;
