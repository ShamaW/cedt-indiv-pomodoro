use chrono::{Local, DateTime};
use serde::{Serialize, Deserialize};
use tauri::command;

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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_current_time
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
