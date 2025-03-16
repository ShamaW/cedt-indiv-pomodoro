export interface SettingData {
    defaultFocusTime: string;
    defaultBreakTime: string;
    defaultRestTime: string;
}

export interface settingProps {
    setInputMinutes: (minutes: string) => void;
}

export interface LayoutProps {
    children: React.ReactNode;
}

export interface AppRouterProps {
    timerProps: CountdownTimerProps;
}

export interface CountdownTimerProps {
    startTime: string | null;
    isRunning: boolean;
    remainingSeconds: number;
    inputMinutes: string;
    isPaused: boolean;
    setStartTime: (time: string | null) => void;
    setIsRunning: (isRunning: boolean) => void;
    setRemaningSeconds: (remainingSeconds: number) => void;
    setInputMinutes: (inputMinutes: string) => void;
    setIsPaused: (isPaued: boolean) => void;
    displayTime: number;
    handleStart: () => void;
    handleStop: () => void;
    handlePause: () => void;
    handleResume: () => void;
    getStatus: () => string;
    shakeWindow: () => Promise<void>;
    testNotification: () => void;
}