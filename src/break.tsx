import React from 'react';
import { CountdownTimerProps } from './interface';

const Break = ({
    isRunning,
    isPaused,
    displayTime,
    handleStart,
    handleStop,
    handlePause,
    handleResume,
    getStatus
}: CountdownTimerProps) => {
    return (
        <div className="timer-container">

            <h1>Break</h1>

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
            </div>
        </div>
    );
}

export default Break;