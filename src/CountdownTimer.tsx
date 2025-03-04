import React from 'react';
import useCountdownTimer from './useCountdownTimer';

const CountdownTimer = () => {
    const {isRunning, remainingSeconds, inputMinutes, isPaused, setInputMinutes, formatTime, handleStart, handleStop, handlePause, handleResume, getStatus} = useCountdownTimer();

    return (
        <div className="timer-container">
            <div className="timer-display">
                <h1>{formatTime(remainingSeconds)}</h1>
                <p>Status: {getStatus()}</p>
            </div>

            <div className="timer-controls">
            <span>Set time to </span>
                <input
                    type="number"
                    value={inputMinutes}
                    onChange={(e) => setInputMinutes(e.target.value)}
                    min="1"
                    max="60"
                    disabled={isRunning}
                    placeholder='25'
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