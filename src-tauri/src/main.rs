//! Aegis Security Main Application Entry Point
//!
//! This is the main entry point for the Aegis Security antivirus application.
//! It initializes the Tauri GUI and sets up the core engine.

#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use aegis_security::core::AegisSecurityCore;
use aegis_security::commands;
use std::sync::Arc;
use tokio::sync::Mutex;

fn main() {
    // Initialize logging
    env_logger::init();

    // Initialize core engine
    let core = Arc::new(Mutex::new(AegisSecurityCore::new()));

    tauri::Builder::default()
        .manage(core)
        .invoke_handler(tauri::generate_handler![
            commands::get_status,
            commands::start_scan,
            commands::start_quick_scan,
            commands::stop_scan,
            commands::update_definitions,
            commands::get_system_stats,
            commands::get_recent_threats,
            commands::enable_silent_mode,
            commands::disable_silent_mode,
            commands::get_system_info,
            commands::isolate_process,
            commands::get_isolated_processes,
            commands::get_settings,
            commands::update_settings,
 ])
 .run(tauri::generate_context!())
 .expect("error while running Aegis Security application");
}