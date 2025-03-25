import { Button } from "antd";
import React from 'react';
import { CountdownTimerProps } from '../utils/interface';

const CountdownTimer = ({
    isRunning,
    isPaused,
    displayTime,
    handleStart,
    handleStop,
    handlePause,
    handleResume,
    getStatus,
    testNotification,
}: CountdownTimerProps) => {
    return (
        <div className="timer-container">
            <div className="timer-display">{displayTime}</div>
            <p>Status: {getStatus()}</p>

            <div className="timer-controls">
                <div>
                    {!isRunning && !isPaused && (<Button onClick={handleStart} disabled={isRunning} >Start</Button>)}
                    {isRunning && !isPaused && (<Button onClick={handlePause}>Pause</Button>)}
                    {isRunning && isPaused && (<Button onClick={handleResume}>Resume</Button>)}
                </div>
                {/* <button onClick={testNotification}>Test Notification</button> */}
            </div>
        </div>
    );
}

export default CountdownTimer;