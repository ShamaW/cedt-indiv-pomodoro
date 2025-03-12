import { useState, useEffect } from 'react';
import { PhysicalPosition, Window } from "@tauri-apps/api/window";
import sound from "./assets/alarm_sound.wav";

const useCountdownTimer = () => {
    const loadSettings = () => {
        try {
            const savedSettings = localStorage.getItem('pomoSetting');
            if (savedSettings) {
                return JSON.parse(savedSettings);
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
        return { defaultFocusTime: "25", defaultBreakTime: "5", defaultRestTime: "10" };
    };

    const settings = loadSettings();

    const [startTime, setStartTime] = useState<string | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [remainingSeconds, setRemainingSeconds] = useState(0);
    const [inputMinutes, setInputMinutes] = useState(settings.defaultFocusTime);
    const [isPaused, setIsPaused] = useState(false);

    const formatTime = (totalSecond : number) => {
        const minutes = Math.floor(totalSecond / 60);
        const second = totalSecond % 60;
        return `${minutes.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
    };

    const alarmSound = new Audio(sound);

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
            alarmSound.play();
        }

        return () => {if (interval) clearInterval(interval)};
    }, [isRunning, isPaused, remainingSeconds]);

    const testNotification = () => {
        setIsRunning(false);
        setIsPaused(false);
        shakeWindow();
        alarmSound.play();
    }

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

    return {startTime, isRunning, remainingSeconds, inputMinutes, isPaused, setStartTime, setIsRunning, setRemainingSeconds, setInputMinutes, setIsPaused, formatTime, handleStart, handleStop, handlePause, handleResume, getStatus, shakeWindow, testNotification};
}

export default useCountdownTimer;