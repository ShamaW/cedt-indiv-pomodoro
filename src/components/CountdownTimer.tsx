import { Button } from "antd";
import React from 'react';
import { CountdownTimerProps } from '../utils/interface';
import '../styles/styles.css'

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
    currentTimerType,
    setCurrentTimerType,
}: CountdownTimerProps) => {
    const changeMode = (newMode: 'focus' | 'break' | 'rest') => {
        setCurrentTimerType(newMode);
        handleStop();
    };

    return (
        <div className="timer-container">
            <div className="timer-display">{displayTime}</div>
            {/* <p>Mode: {currentTimerType.charAt(0).toUpperCase() + currentTimerType.slice(1)}</p> */}
            {/* <p>Status: {getStatus()}</p> */}

            <div className="timer-controls">
                <div>
                    {!isRunning && !isPaused && (<Button onClick={handleStart} disabled={isRunning} >Start</Button>)}
                    {isRunning && !isPaused && (<Button onClick={handlePause}>Pause</Button>)}
                    {isRunning && isPaused && (<Button onClick={handleResume}>Resume</Button>)}
                </div>
            </div>

            <div className="mode-controls">
                <Button onClick={() => changeMode('focus')} disabled={currentTimerType === 'focus'}>Focus</Button>
                <Button onClick={() => changeMode('break')} disabled={currentTimerType === 'break'}>Break</Button>
                <Button onClick={() => changeMode('rest')} disabled={currentTimerType === 'rest'}>Rest</Button>
            </div>
        </div>
    );
}

export default CountdownTimer;