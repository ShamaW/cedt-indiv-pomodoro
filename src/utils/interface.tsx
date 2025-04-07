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
    setIsPaused: (isPaused: boolean) => void;
    displayTime: string;
    handleStart: () => void;
    handleStop: () => void;
    handlePause: () => void;
    handleResume: () => void;
    getStatus: () => string;
    shakeWindow: () => Promise<void>;
    testNotification: () => void;
    currentTimerType: 'focus' | 'break' | 'rest';
    setCurrentTimerType: (type: 'focus' | 'break' | 'rest') => void;
}

export interface TodoItem {
    id: string;
    title: string;
    completed: boolean;
    createAt: string;
}

export interface TodoListProps {
    todos: TodoItem[];
    newTodoTitle: string;
    isLoading: boolean;
    showInput: boolean;
    editingId: string | null;
    editValue: string;
    setTodos: (todos: TodoItem[]) => void;
    setNewTodoTitle: (newTodoTitle: string) => void;
    setIsLoading: (isLoading: boolean) => void;
    setShowInput: (show: boolean) => void;
    setEditingId: (id: string | null) => void;
    loadTodos: () => void;
    addTodo: () => void;
    toggleTodo: (id: string) => void;
    deleteTodo: (id: string) => void;
    updateTodo: (id: string, title: string) => void;
    handleKeyPress: (e: React.KeyboardEvent) => void;
    handleShowInput: (value: boolean) => void;
    handleEditStart: (todo: TodoItem) => void;
    handleEditChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleEditBlur: (id: string) => void;
    handleEditKeyPress: (e: React.KeyboardEvent, id: string) => void;
}

export interface CalendarEvent {
    id: string;
    summary: string;
    start: {
        dateTime?: string;
        date?: string;
    };
    end: {
        dateTime?: string;
        date?: string;
    };
    location?: string;
    description?: string;
}

export interface StoredSession {
    isSignedIn: boolean;
    timestamp: number;
}

declare global {
    interface Window {
        gapi: {
            client: {
                calendar: {
                    events: {
                        list: (params: any) => Promise<any>;
                    };
                };
                setToken: (token: { access_token: string } | null) => void;
                getToken: () => { access_token: string } | null;
            };
        };
    }
}