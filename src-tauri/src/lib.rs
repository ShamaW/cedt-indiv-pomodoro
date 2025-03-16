use chrono::{Local, DateTime};
use serde::{Serialize, Deserialize};
use std::fs;
use std::path::PathBuf;
use tauri::{command, AppHandle, Manager};
use std::sync::Mutex;

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

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Settings {
    default_focus_time: String,
    default_break_time: String,
    default_rest_time: String,
}

impl Default for Settings {
    fn default() -> Self {
        Settings {
            default_focus_time: "25".to_string(),
            default_break_time: "5".to_string(),
            default_rest_time: "10".to_string(),
        }
    }
}

struct SettingsState(Mutex<Settings>);

fn get_settings_path(app_handle: &AppHandle) -> PathBuf {
    let app_dir = app_handle.path().app_config_dir()
        .expect("Failed to get app config directory");
    
    fs::create_dir_all(&app_dir).expect("Failed to create app config directory");
    
    app_dir.join("settings.json")
}

fn load_settings(app_handle: &AppHandle) -> Settings {
    let settings_path = get_settings_path(app_handle);
    
    if settings_path.exists() {
        match fs::read_to_string(&settings_path) {
            Ok(settings_str) => {
                match serde_json::from_str(&settings_str) {
                    Ok(settings) => settings,
                    Err(e) => {
                        eprintln!("Failed to parse settings: {}", e);
                        Settings::default()
                    }
                }
            },
            Err(e) => {
                eprintln!("Failed to read settings file: {}", e);
                Settings::default()
            }
        }
    } else {
        let default_settings = Settings::default();
        
        if let Err(e) = save_settings(app_handle, &default_settings) {
            eprintln!("Failed to save default settings: {}", e);
        }
        
        default_settings
    }
}

fn save_settings(app_handle: &AppHandle, settings: &Settings) -> Result<(), String> {
    let settings_path = get_settings_path(app_handle);
    let settings_str = serde_json::to_string_pretty(settings)
        .map_err(|e| format!("Failed to serialize settings: {}", e))?;
    
    fs::write(settings_path, settings_str)
        .map_err(|e| format!("Failed to write settings file: {}", e))?;
    
    Ok(())
}

#[command]
fn get_settings(app_handle: AppHandle) -> Settings {
    load_settings(&app_handle)
}

#[command]
fn save_user_settings(app_handle: AppHandle, settings: Settings) -> Result<(), String> {
    save_settings(&app_handle, &settings)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .manage(SettingsState(Mutex::new(Settings::default())))
        .invoke_handler(tauri::generate_handler![
            get_current_time,
            get_settings,
            save_user_settings
        ])
        .setup(|app| {
            let initial_settings = load_settings(&app.handle());
            let settings_state = app.state::<SettingsState>();
            *settings_state.0.lock().unwrap() = initial_settings;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
