mod settings;
mod todo;

use chrono::{Local, DateTime};
use serde::{Serialize, Deserialize};
use std::sync::Mutex;
use tauri::{command, Manager};
use settings::{Settings, SettingsState, get_settings, save_user_settings, load_settings};
use todo::{TodoState, get_todos, load_todos, add_todo, toggle_todo, delete_todo};

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
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_notification::init())
        .manage(SettingsState(Mutex::new(Settings::default())))
        .manage(TodoState(Mutex::new(Vec::new())))
        .invoke_handler(tauri::generate_handler![
            get_current_time,
            get_settings,
            save_user_settings,
            get_todos,
            add_todo,
            toggle_todo,
            delete_todo
        ])
        .setup(|app| {
            let initial_settings = load_settings(&app.handle());
            let settings_state = app.state::<SettingsState>();
            *settings_state.0.lock().unwrap() = initial_settings;
            
            let initial_todos = load_todos(&app.handle());
            let todo_state = app.state::<TodoState>();
            *todo_state.0.lock().unwrap() = initial_todos;
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
