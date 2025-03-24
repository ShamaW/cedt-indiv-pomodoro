use uuid::Uuid;

use serde::{Serialize, Deserialize};
use std::fmt::Debug;
use std::clone::Clone;
use chrono::Local;
use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;
use tauri::{command, AppHandle, Manager};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct TodoItem {
    id: String,
    title: String,
    completed: bool,
    create_at: String
}

pub struct TodoState(pub Mutex<Vec<TodoItem>>);

pub fn get_todos_path(app_handle: &AppHandle) -> PathBuf {
    let app_dir = app_handle.path().app_config_dir()
        .expect("Failed to get app config directory");
    
    fs::create_dir_all(&app_dir).expect("Failed to create app config directory");
    
    app_dir.join("todos.json")
}

pub fn load_todos(app_handle: &AppHandle) -> Vec<TodoItem> {
    let todos_path = get_todos_path(app_handle);

    if todos_path.exists() {
        match fs::read_to_string(&todos_path) {
            Ok(todos_str) => {
                match serde_json::from_str(&todos_str) {
                    Ok(todos) => todos,
                    Err(e) => {
                        eprintln!("Failed to parse todos: {}", e);
                        Vec::new()
                    }
                }
            },
            Err(e) => {
                eprintln!("Failed to read todos file: {}", e);
                Vec::new()
            }
        }
    } else {
        Vec::new()
    }
}

pub fn save_todos(app_handle: &AppHandle, todos: &Vec<TodoItem>) -> Result<(), String> {
    let todos_path = get_todos_path(app_handle);
    let todos_str = serde_json::to_string_pretty(todos)
        .map_err(|e| format!("Failed to serialize todos: {}", e))?;

    fs::write(todos_path, todos_str)
        .map_err(|e| format!("Failed to write todos file: {}", e))?;

    Ok(())
}

#[command]
pub fn get_todos(app_handle: AppHandle) -> Vec<TodoItem> {
    load_todos(&app_handle)
}

#[command]
pub fn add_todo(app_handle: AppHandle, title: String) -> Result<Vec<TodoItem>, String> {
    let mut todos = load_todos(&app_handle);

    let new_todo = TodoItem {
        id: Uuid::new_v4().to_string(),
        title,
        completed: false,
        create_at: Local::now().to_rfc3339()
    };

    todos.push(new_todo);
    save_todos(&app_handle, &todos)?;

    Ok(todos)
}

#[command]
pub fn toggle_todo(app_handle: AppHandle, id: String) -> Result<Vec<TodoItem>, String> {
    let mut todos = load_todos(&app_handle);

    if let Some(todo) = todos.iter_mut().find(|todo| todo.id == id) {
        todo.completed = !todo.completed;
    }

    save_todos(&app_handle, &todos)?;

    Ok(todos)
}

#[command]
pub fn delete_todo(app_handle: AppHandle, id: String) -> Result<Vec<TodoItem>, String> {
    let mut todos = load_todos(&app_handle);
    todos.retain(|todo| todo.id != id);

    save_todos(&app_handle, &todos)?;

    Ok(todos)
}