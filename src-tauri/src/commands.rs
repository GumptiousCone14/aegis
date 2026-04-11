// Tauri Commands
//
// Commands exposed to the frontend GUI.

use crate::modules::db::Database;
use crate::modules::network::NetworkShield;
use crate::modules::sandbox::SandboxManager;
use crate::core::AegisSecurityCore;

use tauri::State;

use std::sync::Arc;
use tokio::sync::Mutex;

use serde::{Deserialize, Serialize};
use sysinfo::System;
use chrono::Utc;

#[tauri::command]
pub async fn get_status(core: State<'_, Arc<Mutex<AegisSecurityCore>>>) -> Result<String, String> {
    let core = core.lock().await;
    Ok(core.get_status().await)
}

#[tauri::command]
pub async fn get_settings() -> Result<crate::modules::settings::AppSettings, String> {
    let manager = crate::modules::settings::SettingsManager::new();
    Ok(manager.load_settings())
}

#[tauri::command]
pub async fn update_settings(settings: crate::modules::settings::AppSettings) -> Result<String, String> {
    let manager = crate::modules::settings::SettingsManager::new();
    manager.save_settings(&settings)?;
    // We could apply these settings to the core engine here
    Ok("Settings saved successfully".to_string())
}

#[tauri::command]
pub async fn start_scan(core: State<'_, Arc<Mutex<AegisSecurityCore>>>) -> Result<String, String> {
    let core = core.lock().await;
    core.scan().await.map_err(|e| e.to_string())?;
    Ok("Scan completed successfully".into())
}

#[tauri::command]
pub async fn start_quick_scan(core: State<'_, Arc<Mutex<AegisSecurityCore>>>) -> Result<String, String> {
    let core = core.lock().await;
    core.quick_scan().await.map_err(|e| e.to_string())?;
    Ok("Quick scan completed successfully".into())
}

#[tauri::command]
pub async fn stop_scan(core: State<'_, Arc<Mutex<AegisSecurityCore>>>) -> Result<String, String> {
    let core = core.lock().await;
    core.cancel_scan().await;
    Ok("Scan stopped".into())
}

#[tauri::command]
pub async fn update_definitions(core: State<'_, Arc<Mutex<AegisSecurityCore>>>) -> Result<String, String> {
    let core = core.lock().await;
    core.update_definitions().await.map_err(|e| e.to_string())?;
    Ok("Definitions updated successfully".into())
}

#[tauri::command]
pub async fn get_system_stats(core: State<'_, Arc<Mutex<AegisSecurityCore>>>) -> Result<SystemStats, String> {
    let core = core.lock().await;

    let mut sys = System::new_all();
    sys.refresh_all();

    // FIX: prevent division by zero
    let cpu_count = sys.cpus().len().max(1) as f32;

    let cpu_usage =
        sys.cpus().iter().map(|cpu| cpu.cpu_usage()).sum::<f32>() / cpu_count;

    let memory_usage =
        (sys.used_memory() as f32 / sys.total_memory().max(1) as f32) * 100.0;

    let active_connections = 0; // still TODO

    let db = core.db.lock().await;
    let threats_blocked = db.get_threats().await.map_err(|e| e.to_string())?.len() as u32;

    let network = core.network_shield.lock().await;
    let blocked_packets = network.get_blocked_connections().await.len() as u32;
    let vpn_active = *network.vpn_enabled.lock().await;

    let files_scanned = *core.files_scanned.lock().await;

    Ok(SystemStats {
        threats_blocked,
        files_scanned,
        cpu_usage,
        memory_usage,
        active_connections,
        blocked_packets,
        vpn_active,
        threat_level: match threats_blocked {
            0..=5 => "Low",
            6..=10 => "Medium",
            _ => "High",
        }.to_string(),
    })
}

#[tauri::command]
pub async fn get_recent_threats(core: State<'_, Arc<Mutex<AegisSecurityCore>>>) -> Result<Vec<ThreatInfo>, String> {
    let core = core.lock().await;
    let db = core.db.lock().await;

    let threats = db.get_threats().await.map_err(|e| e.to_string())?;

    Ok(threats.into_iter().map(|t| {
        let confidence = t.confidence;

        ThreatInfo {
            threat_type: t.threat_type,
            process_id: t.process_id,
            confidence,
            timestamp: t.timestamp.to_rfc3339(),
            status: if confidence > 0.8 {
                "Blocked".into()
            } else {
                "Monitored".into()
            },
        }
    }).collect())
}

#[tauri::command]
pub async fn enable_silent_mode(core: State<'_, Arc<Mutex<AegisSecurityCore>>>) -> Result<String, String> {
    let core = core.lock().await;
    *core.silent_mode.lock().await = true;

    log::info!("Silent mode enabled");
    Ok("Silent mode enabled".into())
}

#[tauri::command]
pub async fn disable_silent_mode(core: State<'_, Arc<Mutex<AegisSecurityCore>>>) -> Result<String, String> {
    let core = core.lock().await;
    *core.silent_mode.lock().await = false;

    log::info!("Silent mode disabled");
    Ok("Silent mode disabled".into())
}

#[tauri::command]
pub async fn get_system_info(core: State<'_, Arc<Mutex<AegisSecurityCore>>>) -> Result<SystemInfo, String> {
    let core = core.lock().await;

    let last_update = Utc::now().to_rfc3339();

    let db = core.db.lock().await;
    let db_version = db.get_version().await.map_err(|e| e.to_string())?;

    let license = core.get_license_info().await.map_err(|e| e.to_string())?;

    // FIX: unwrap_or returns &str, so convert properly
    let build_number = option_env!("BUILD_NUMBER")
        .unwrap_or("local")
        .to_string();

    let update_available = core.check_for_updates().await.map_err(|e| e.to_string())?;

    Ok(SystemInfo {
        version: env!("CARGO_PKG_VERSION").to_string(),
        last_update,
        database_version: db_version,
        license,
        build_number,
        update_available,
    })
}

#[tauri::command]
pub async fn isolate_process(
    core: State<'_, Arc<Mutex<AegisSecurityCore>>>,
    pid: u32
) -> Result<String, String> {
    let core = core.lock().await;
    let sandbox = core.sandbox.lock().await;

    sandbox
        .isolate_process(pid)
        .await
        .map_err(|e| e.to_string())?;

    Ok(format!("Process {} isolated", pid))
}

#[tauri::command]
pub async fn get_isolated_processes(
    core: State<'_, Arc<Mutex<AegisSecurityCore>>>
) -> Result<Vec<u32>, String> {
    let core = core.lock().await;
    let sandbox = core.sandbox.lock().await;

    Ok(sandbox.get_isolated_processes().await)
}

// =====================
// Structs
// =====================

#[derive(Serialize, Deserialize)]
pub struct SystemStats {
    pub threats_blocked: u32,
    pub files_scanned: u64,
    pub cpu_usage: f32,
    pub memory_usage: f32,
    pub active_connections: u32,
    pub blocked_packets: u32,
    pub vpn_active: bool,
    pub threat_level: String,
}

#[derive(Serialize, Deserialize)]
pub struct ThreatInfo {
    pub threat_type: String,
    pub process_id: u32,
    pub confidence: f32,
    pub timestamp: String,
    pub status: String,
}

#[derive(Serialize, Deserialize)]
pub struct SystemInfo {
    pub version: String,
    pub last_update: String,
    pub database_version: String,
    pub license: String,
    pub build_number: String,
    pub update_available: bool,
}

#[derive(Serialize, Deserialize)]
pub struct PrivacyInfo {
    pub data_collected_today: String,
    pub ai_processing_location: String,
    pub cloud_lookups: u32,
    pub telemetry_enabled: bool,
    pub last_cleanup: String,
}