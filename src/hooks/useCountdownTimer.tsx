import { invoke } from "@tauri-apps/api/core";
import { PhysicalPosition, Window } from "@tauri-apps/api/window";
import { useEffect, useMemo, useState } from 'react';
import sound from "../assets/alarm_sound.wav";
import { useNotification } from '../context/SystemNotificationContext';
import { SettingData } from '../utils/interface';

const DEFAULT_TIMER_SETTINGS = {
    focus: 'default_focus_time',
    break: 'default_break_time',
    rest: 'default_rest_time'
};

const useCountdownTimer = () => {
    const [currentTimerType, setCurrentTimerType] = useState<'focus' | 'break' | 'rest'>('focus');
    const { sendSystemNotification } = useNotification();
    
    const loadSettings = async () => {
        try {
            const settings: SettingData = await invoke("get_settings");
            const settingKey = DEFAULT_TIMER_SETTINGS[currentTimerType as keyof typeof DEFAULT_TIMER_SETTINGS];

            if (settingKey && settings[settingKey as keyof SettingData]) {
                setInputMinutes(settings[settingKey as keyof SettingData]);
            }
            else {
                setInputMinutes("25");
            }
        } catch (error) {
            console.error("Failed to load settings:", error);
        }
    };

    const [startTime, setStartTime] = useState<string | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [remainingSeconds, setRemainingSeconds] = useState(0);
    const [inputMinutes, setInputMinutes] = useState("25");
    const [isPaused, setIsPaused] = useState(false);

    const formatTime = (totalSecond : number) => {
        const minutes = Math.floor(totalSecond / 60);
        const second = totalSecond % 60;
        return `${minutes.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
    };

    const displayTime = isRunning
        ? formatTime(remainingSeconds)
        : formatTime(parseInt(inputMinutes) * 60);

    const alarmSound = useMemo(() => new Audio(sound), []);

    useEffect(() => {
        loadSettings();
        if (isRunning) {
            setIsRunning(false);
            setIsPaused(false);
        }
    }, [currentTimerType]);

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
            sendSystemNotification(currentTimerType);
        }

        return () => {if (interval) clearInterval(interval)};
    }, [isRunning, isPaused, remainingSeconds]);

    const testNotification = () => {
        setIsRunning(false);
        setIsPaused(false);
        shakeWindow();
        alarmSound.play();
        sendSystemNotification(currentTimerType);
    };

    const handleStart = () => {
        const durationSeconds = parseInt(inputMinutes, 10) * 60;
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
    };

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

    return {
        startTime,
        isRunning,
        remainingSeconds,
        inputMinutes,
        isPaused,
        displayTime,
        setStartTime,
        setIsRunning,
        setRemainingSeconds,
        setInputMinutes,
        setIsPaused,
        handleStart,
        handleStop,
        handlePause,
        handleResume,
        getStatus,
        shakeWindow,
        testNotification,
        loadSettings,
        currentTimerType,
        setCurrentTimerType};
}

export default useCountdownTimer;