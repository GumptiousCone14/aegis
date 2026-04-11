//! App Settings Module
//!
//! Manages application configuration and persistence.

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct AppSettings {
    pub real_time_protection: bool,
    pub auto_updates: bool,
    pub cloud_protection: bool,
    pub behavioral_analysis: bool,
    pub ransomware_protection: bool,
    pub notifications: bool,
    pub scan_on_download: bool,
    pub quarantine_auto: bool,
    pub cpu_usage_limit: u32,
    pub scan_schedule: String,
    
    // Alert settings
    pub alert_in_app: bool,
    pub alert_email: bool,
    pub alert_critical_only: bool,
    pub alert_min_confidence: u32,
    pub email_digest: String,
    
    // Automated Response settings
    pub auto_quarantine: bool,
    pub auto_block_network: bool,
    pub require_confirmation: bool,
    pub auto_response_min_confidence: u32,
}

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            real_time_protection: true,
            auto_updates: true,
            cloud_protection: true,
            behavioral_analysis: true,
            ransomware_protection: true,
            notifications: true,
            scan_on_download: true,
            quarantine_auto: true,
            cpu_usage_limit: 20,
            scan_schedule: "daily".to_string(),
            alert_in_app: true,
            alert_email: true,
            alert_critical_only: false,
            alert_min_confidence: 80,
            email_digest: "daily".to_string(),
            auto_quarantine: true,
            auto_block_network: true,
            require_confirmation: true,
            auto_response_min_confidence: 90,
        }
    }
}

pub struct SettingsManager {
    config_dir: PathBuf,
}

impl SettingsManager {
    pub fn new() -> Self {
        let mut config_dir = dirs::config_dir().unwrap_or_else(|| PathBuf::from("."));
        config_dir.push("aegis-security");
        if !config_dir.exists() {
            fs::create_dir_all(&config_dir).ok();
        }
        Self { config_dir }
    }

    pub fn load_settings(&self) -> AppSettings {
        let settings_path = self.config_dir.join("settings.json");
        if settings_path.exists() {
            let content = fs::read_to_string(settings_path).unwrap_or_default();
            serde_json::from_str(&content).unwrap_or_default()
        } else {
            AppSettings::default()
        }
    }

    pub fn save_settings(&self, settings: &AppSettings) -> Result<(), String> {
        let settings_path = self.config_dir.join("settings.json");
        let content = serde_json::to_string_pretty(settings).map_err(|e| e.to_string())?;
        fs::write(settings_path, content).map_err(|e| e.to_string())?;
        Ok(())
    }
}
