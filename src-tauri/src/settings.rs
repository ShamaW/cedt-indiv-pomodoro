use serde::{Serialize, Deserialize};
use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;
use tauri::{command, AppHandle, Manager};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Settings {
    pub default_focus_time: String,
    pub default_break_time: String,
    pub default_rest_time: String,
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

pub struct SettingsState(pub Mutex<Settings>);

fn get_settings_path(app_handle: &AppHandle) -> PathBuf {
    let app_dir = app_handle.path().app_config_dir()
        .expect("Failed to get app config directory");
    
    fs::create_dir_all(&app_dir).expect("Failed to create app config directory");
    
    app_dir.join("settings.json")
}

pub fn load_settings(app_handle: &AppHandle) -> Settings {
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

pub fn save_settings(app_handle: &AppHandle, settings: &Settings) -> Result<(), String> {
    let settings_path = get_settings_path(app_handle);
    let settings_str = serde_json::to_string_pretty(settings)
        .map_err(|e| format!("Failed to serialize settings: {}", e))?;
    
    fs::write(settings_path, settings_str)
        .map_err(|e| format!("Failed to write settings file: {}", e))?;
    
    Ok(())
}

#[command]
pub fn get_settings(app_handle: AppHandle) -> Settings {
    load_settings(&app_handle)
}

#[command]
pub fn save_user_settings(app_handle: AppHandle, settings: Settings) -> Result<(), String> {
    save_settings(&app_handle, &settings)
}
