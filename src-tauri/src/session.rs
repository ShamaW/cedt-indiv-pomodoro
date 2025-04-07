use serde::{Serialize, Deserialize};
use std::fs;
use std::path::PathBuf;
use tauri::{command, AppHandle, Manager};
use chrono::{DateTime, Utc};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CalendarSession {
    token: String,
    expires_at: Option<DateTime<Utc>>,
    created_at: DateTime<Utc>
}

fn get_session_path(app_handle: &AppHandle) -> PathBuf {
    let app_dir = app_handle.path().app_config_dir()
        .expect("Failed to get app config directory");
    
    fs::create_dir_all(&app_dir).expect("Failed to create app config directory");
    
    app_dir.join("calendar_session.json")
}

#[command]
pub fn store_calendar_token(
    app_handle: AppHandle,
    token: String,
    expires_in: Option<i64>
) -> Result<(), String> {
    let expires_at = expires_in.map(|seconds| {
        Utc::now() + chrono::Duration::seconds(seconds)
    });

    let session = CalendarSession {
        token,
        expires_at,
        created_at: Utc::now()
    };

    let session_path = get_session_path(&app_handle);
    let session_str = serde_json::to_string_pretty(&session)
        .map_err(|e| format!("Failed to serialize session: {}", e))?;

    fs::write(session_path, session_str)
        .map_err(|e| format!("Failed to write session file: {}", e))?;

    Ok(())
}

#[command]
pub fn get_calendar_token(app_handle: AppHandle) -> Option<String> {
    let session_path = get_session_path(&app_handle);
    
    if !session_path.exists() {
        return None;
    }
    
    match fs::read_to_string(&session_path) {
        Ok(session_str) => {
            match serde_json::from_str::<CalendarSession>(&session_str) {
                Ok(session) => {
                    if let Some(expires_at) = session.expires_at {
                        if Utc::now() > expires_at {
                            let _ = fs::remove_file(&session_path);
                            return None;
                        }
                    }
                    Some(session.token)
                },
                Err(_) => None
            }
        },
        Err(_) => None
    }
}

#[command]
pub fn clear_calendar_token(app_handle: AppHandle) -> Result<(), String> {
    let session_path = get_session_path(&app_handle);
    
    if session_path.exists() {
        fs::remove_file(session_path)
            .map_err(|e| format!("Failed to delete session file: {}", e))?;
    }
    
    Ok(())
}
