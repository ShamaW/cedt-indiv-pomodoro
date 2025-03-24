export interface SettingData {
    default_focus_time: string;
    default_break_time: string;
    default_rest_time: string;
}

export interface SettingProps {
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
    setRemainingSeconds: (remainingSeconds: number) => void;
    setInputMinutes: (inputMinutes: string) => void;
    setIsPaused: (isPaued: boolean) => void;
    displayTime: string;
    handleStart: () => void;
    handleStop: () => void;
    handlePause: () => void;
    handleResume: () => void;
    getStatus: () => string;
    shakeWindow: () => Promise<void>;
    testNotification: () => void;
}

export interface TodoItem {
    id: string;
    title: string;
    completed: boolean;
    createAt: string;
}

export interface TodoListProps {
    todos: TodoItem[];
    addTodo: (title: string) => void;
    toggleTodo: (title: string) => void;
    deleteTodo: (title: string) => void;
}