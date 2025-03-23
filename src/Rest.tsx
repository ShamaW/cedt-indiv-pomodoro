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
            <div className="timer-display">{displayTime}</div>
            <p>Status: {getStatus()}</p>

            <div className="timer-controls">
                <div>
                    {!isRunning && !isPaused && (<button onClick={handleStart} disabled={isRunning} >Start</button>)}
                    {isRunning && !isPaused && (<button onClick={handlePause}>Pause</button>)}
                    {isRunning && isPaused && (<button onClick={handleResume}>Resume</button>)}
                </div>
            </div>
        </div>
    );
}

export default Rest;
