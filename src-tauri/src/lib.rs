use chrono::{Local, DateTime};
use serde::{Serialize, Deserialize};
use tauri::command;
use std::time::Duration;

#[derive(Serialize, Deserialize)]
pub struct TimeData {
    time_string: String,
    date_string: String,
    timestamp: i64,
}

#[command]
fn get_current_time() -> TimeData {
    let now: DateTime<Local> = Local::now();
    TimeData {
        time_string: now.format("%H:%M:%S").to_string(),
        date_string: now.format("%Y-%m-%d").to_string(),
        timestamp: now.timestamp(),
    }
}

#[derive(Serialize, Deserialize, Clone)]
pub struct TimerState {
    remaining_seconds: u32,
    is_running: bool,
    start_time: Option<String>
}

static mut TIMER_STATE: TimerState = TimerState {
    remaining_seconds: 0,
    is_running: false,
    start_time: None
};

#[command]
fn start_timer(duration_seconds: u32) -> TimerState {
    let now = Local::now().to_rfc3339();

    unsafe {
        TIMER_STATE = TimerState {
            remaining_seconds: duration_seconds,
            is_running: true,
            start_time: Some(now)
        };
        TIMER_STATE.clone()
    }
}

#[command]
fn get_timer_state() -> TimerState {
    unsafe {
        if TIMER_STATE.is_running && TIMER_STATE.remaining_seconds > 0 {
            TIMER_STATE.remaining_seconds -= 1;
        }
        TIMER_STATE.clone()
    }
}

#[command]
fn stop_timer() -> TimerState {
    unsafe {
        TIMER_STATE.is_running = false;
        TIMER_STATE.clone()
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_current_time,
            start_timer,
            get_timer_state,
            stop_timer
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
