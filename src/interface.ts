export interface TimeData {
    time_string: string;
    date_string: string;
    timestamp: number;
}

export interface TimerState {
    remaining_seconds: number;
    is_running: boolean;
    start_time: string | null;
}