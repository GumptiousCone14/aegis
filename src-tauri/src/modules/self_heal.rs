// Self-Healing OS Protection
//
// Detects system file tampering and restores clean copies.
// Removes persistence mechanisms like registry hooks, scheduled tasks, and WMI backdoors.

use async_trait::async_trait;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::PathBuf;
use std::sync::Arc;
use tokio::sync::Mutex;
#[allow(unused_imports)]
use log::{info, warn, error};
#[allow(unused_imports)]
use sha2::{Sha256, Digest};
#[allow(unused_imports)]
use chrono::{DateTime, Utc};

#[async_trait]
pub trait SelfHeal: Send + Sync {
    async fn scan_system_integrity(&self) -> Result<SystemIntegrityReport, Box<dyn std::error::Error + Send + Sync>>;
    async fn restore_system_file(&self, file_path: &str) -> Result<(), Box<dyn std::error::Error + Send + Sync>>;
    async fn remove_persistence(&self, mechanism_type: PersistenceType) -> Result<(), Box<dyn std::error::Error + Send + Sync>>;
    async fn quarantine_file(&self, file_path: PathBuf) -> Result<(), Box<dyn std::error::Error + Send + Sync>>;
    async fn get_system_file_hashes(&self) -> HashMap<String, String>;
}

pub struct SelfHealImpl {
    system_files: Arc<Mutex<HashMap<String, SystemFile>>>,
    known_good_hashes: Arc<Mutex<HashMap<String, String>>>,
    quarantine_dir: PathBuf,
}

impl SelfHealImpl {
    pub fn new() -> Self {
        let mut system_files = HashMap::new();
        let mut known_good_hashes = HashMap::new();

        // Initialize critical system files to monitor
        let critical_files = vec![
            "C:\\Windows\\System32\\kernel32.dll",
            "C:\\Windows\\System32\\ntdll.dll",
            "C:\\Windows\\System32\\user32.dll",
            "C:\\Windows\\explorer.exe",
            "C:\\Windows\\System32\\svchost.exe",
        ];

        for file in critical_files {
            system_files.insert(file.to_string(), SystemFile {
                path: PathBuf::from(file),
                current_hash: String::new(),
            });
        }

        // Known good hashes for critical files (would be loaded from secure database)
        known_good_hashes.insert("kernel32.dll".to_string(), "placeholder_hash".to_string());
        known_good_hashes.insert("ntdll.dll".to_string(), "placeholder_hash".to_string());

        Self {
            system_files: Arc::new(Mutex::new(system_files)),
            known_good_hashes: Arc::new(Mutex::new(known_good_hashes)),
            quarantine_dir: PathBuf::from("./quarantine"),
        }
    }
}

#[async_trait]
impl SelfHeal for SelfHealImpl {
    async fn scan_system_integrity(&self) -> Result<SystemIntegrityReport, Box<dyn std::error::Error + Send + Sync>> {
        let mut report = SystemIntegrityReport {
            scan_time: chrono::Utc::now(),
            total_files_checked: 0,
            corrupted_files: Vec::new(),
            missing_files: Vec::new(),
            modified_files: Vec::new(),
            overall_integrity: IntegrityStatus::Clean,
        };

        let mut system_files: tokio::sync::MutexGuard<'_, std::collections::HashMap<String, SystemFile>> = self.system_files.lock().await;
        let known_hashes = self.known_good_hashes.lock().await;

        for (file_path, file_info) in system_files.iter_mut() {
            report.total_files_checked += 1;

            // Check if file exists
            if !file_info.path.exists() {
                report.missing_files.push(file_path.clone());
                report.overall_integrity = IntegrityStatus::Compromised;
                continue;
            }

            // Calculate current hash
            match self.calculate_file_hash(&file_info.path).await {
                Ok(hash) => {
                    file_info.current_hash = hash.clone();

                    // Check against known good hash
                    if let Some(expected_hash) = known_hashes.get(&file_info.path.file_name()
                        .unwrap_or_default().to_string_lossy().to_string()) {
                        if hash != *expected_hash {
                            report.modified_files.push(CorruptedFile {
                                path: file_path.clone(),
                                expected_hash: expected_hash.clone(),
                                actual_hash: hash,
                                corruption_type: CorruptionType::HashMismatch,
                            });
                            report.overall_integrity = IntegrityStatus::Compromised;
                        }
                    }
                }
                Err(e) => {
                    log::warn!("Failed to hash file {}: {}", file_path, e);
                }
            }
        }

        // Check for persistence mechanisms
        let persistence_issues = self.scan_persistence_mechanisms().await;
        if !persistence_issues.is_empty() {
            report.overall_integrity = IntegrityStatus::Compromised;
            // Add persistence issues to corrupted files list
            for issue in persistence_issues {
                report.corrupted_files.push(CorruptedFile {
                    path: issue.location,
                    expected_hash: String::new(),
                    actual_hash: String::new(),
                    corruption_type: CorruptionType::PersistenceMechanism,
                });
            }
        }

        Ok(report)
    }

    async fn restore_system_file(&self, file_path: &str) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        log::info!("Restoring system file: {}", file_path);

        // Use System File Checker to restore the file from Windows installation media or cache
        let output = tokio::process::Command::new("sfc")
            .args(&["/scanfile", file_path])
            .output()
            .await?;

        if output.status.success() {
            log::info!("Successfully restored system file: {}", file_path);
        } else {
            let stderr = String::from_utf8_lossy(&output.stderr);
            log::error!("Failed to restore system file {}: {}", file_path, stderr);
            return Err(format!("SFC failed: {}", stderr).into());
        }

        Ok(())
    }

    async fn remove_persistence(&self, mechanism_type: PersistenceType) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        match mechanism_type {
            PersistenceType::Registry => {
                self.clean_registry_persistence().await?;
            }
            PersistenceType::ScheduledTask => {
                self.clean_scheduled_tasks().await?;
            }
            PersistenceType::Wmi => {
                self.clean_wmi_persistence().await?;
            }
            PersistenceType::Service => {
                self.clean_service_persistence().await?;
            }
            PersistenceType::Startup => {
                self.clean_startup_persistence().await?;
            }
        }

        log::info!("Removed persistence mechanism: {:?}", mechanism_type);
        Ok(())
    }

    async fn quarantine_file(&self, file_path: PathBuf) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        // Ensure quarantine directory exists
        tokio::fs::create_dir_all(&self.quarantine_dir).await?;

        let file_name = file_path.file_name().unwrap_or_default();
        let quarantine_path = self.quarantine_dir.join(format!("{}_quarantined_{}",
            file_name.to_string_lossy(),
            chrono::Utc::now().timestamp()));

        // Move file to quarantine
        tokio::fs::rename(&file_path, &quarantine_path).await?;

        log::info!("File quarantined: {} -> {}", file_path.display(), quarantine_path.display());
        Ok(())
    }

    async fn get_system_file_hashes(&self) -> HashMap<String, String> {
        let system_files = self.system_files.lock().await;
        system_files.iter()
            .map(|(path, file)| (path.clone(), file.current_hash.clone()))
            .collect()
    }
}

impl SelfHealImpl {
    async fn calculate_file_hash(&self, path: &PathBuf) -> Result<String, Box<dyn std::error::Error + Send + Sync>> {
        use sha2::{Sha256, Digest};
        let content = tokio::fs::read(path).await?;
        let mut hasher = Sha256::new();
        hasher.update(&content);
        Ok(format!("{:x}", hasher.finalize()))
    }

    async fn scan_persistence_mechanisms(&self) -> Vec<PersistenceIssue> {
        let mut issues = Vec::new();

        // Scan registry for suspicious entries
        issues.extend(self.scan_registry().await);

        // Scan scheduled tasks
        issues.extend(self.scan_scheduled_tasks().await);

        // Scan WMI subscriptions
        issues.extend(self.scan_wmi().await);

        // Scan services
        issues.extend(self.scan_services().await);

        issues
    }

    async fn scan_registry(&self) -> Vec<PersistenceIssue> {
        let mut issues = Vec::new();

        // Common registry keys for persistence
        let keys_to_scan = vec![
            r"HKCU\Software\Microsoft\Windows\CurrentVersion\Run",
            r"HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run",
            r"HKCU\Software\Microsoft\Windows\CurrentVersion\RunOnce",
            r"HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnce",
        ];

        for key_path in keys_to_scan {
            match self.scan_registry_key(key_path).await {
                Ok(found_issues) => issues.extend(found_issues),
                Err(e) => log::warn!("Failed to scan registry key {}: {}", key_path, e),
            }
        }

        issues
    }

    async fn scan_registry_key(&self, key_path: &str) -> Result<Vec<PersistenceIssue>, Box<dyn std::error::Error + Send + Sync>> {
        let output = tokio::process::Command::new("reg")
            .args(&["query", key_path])
            .output()
            .await?;

        if !output.status.success() {
            return Ok(vec![]); // Key doesn't exist
        }

        let stdout = String::from_utf8_lossy(&output.stdout);
        let mut issues = Vec::new();

        for line in stdout.lines() {
            let line = line.trim();
            if line.is_empty() || line.starts_with(key_path) || line.starts_with("HKEY_") {
                continue;
            }

            // Parse value name and data
            if let Some((name, data)) = line.split_once("    ") {
                let name = name.trim();
                let data = data.trim().trim_matches('"');

                // Simple heuristic: suspicious if path is not in system directories and has .exe
                if data.contains(".exe") && !data.to_lowercase().contains("system32") && !data.to_lowercase().contains("syswow64") && !data.to_lowercase().contains("windows\\") {
                    issues.push(PersistenceIssue {
                        location: format!("{}:{}", key_path, name),
                    });
                }
            }
        }

        Ok(issues)
    }

    async fn scan_scheduled_tasks(&self) -> Vec<PersistenceIssue> {
        let output = match tokio::process::Command::new("schtasks")
            .args(&["/query", "/fo", "csv", "/nh"])
            .output()
            .await {
                Ok(out) => out,
                Err(e) => {
                    log::warn!("Failed to query scheduled tasks: {}", e);
                    return vec![];
                }
            };

        if !output.status.success() {
            log::warn!("schtasks command failed");
            return vec![];
        }

        let stdout = String::from_utf8_lossy(&output.stdout);
        let mut issues = Vec::new();

        for line in stdout.lines() {
            let parts: Vec<&str> = line.split(',').collect();
            if parts.len() >= 3 {
                let task_name = parts[0].trim_matches('"');
                let task_path = parts[2].trim_matches('"');

                // Simple heuristic: suspicious if task path is not in system directories
                if task_path.contains(".exe") && !task_path.to_lowercase().contains("system32") && !task_path.to_lowercase().contains("windows\\") {
                    issues.push(PersistenceIssue {
                        location: task_name.to_string(),
                    });
                }
            }
        }

        issues
    }

    async fn scan_wmi(&self) -> Vec<PersistenceIssue> {
        let mut issues = Vec::new();

        // Query WMI event filters
        let ps_script = r#"Get-WmiObject -Namespace root\subscription -Class __EventFilter | Select-Object Name, Query | Format-Table -AutoSize"#;

        let output = match tokio::process::Command::new("powershell")
            .args(&["-Command", ps_script])
            .output()
            .await {
                Ok(out) => out,
                Err(e) => {
                    log::warn!("Failed to query WMI event filters: {}", e);
                    return issues;
                }
            };

        if output.status.success() {
            let stdout = String::from_utf8_lossy(&output.stdout);
            for line in stdout.lines().skip(2) { // Skip header
                let line = line.trim();
                if !line.is_empty() && !line.contains("Name") {
                    // Simple heuristic: suspicious if query contains suspicious keywords
                    if line.to_lowercase().contains("process") && line.to_lowercase().contains("create") {
                        issues.push(PersistenceIssue {
                            location: "WMI Event Filter".to_string(),
                        });
                    }
                }
            }
        }

        // Query event consumers
        let ps_script_consumers = r#"Get-WmiObject -Namespace root\subscription -Class __EventConsumer | Select-Object Name, __CLASS | Format-Table -AutoSize"#;

        let output_consumers = match tokio::process::Command::new("powershell")
            .args(&["-Command", ps_script_consumers])
            .output()
            .await {
                Ok(out) => out,
                Err(e) => {
                    log::warn!("Failed to query WMI event consumers: {}", e);
                    return issues;
                }
            };

        if output_consumers.status.success() {
            let stdout = String::from_utf8_lossy(&output_consumers.stdout);
            for line in stdout.lines().skip(2) {
                let line = line.trim();
                if !line.is_empty() && !line.contains("Name") {
                    issues.push(PersistenceIssue {
                        location: "WMI Event Consumer".to_string(),
                    });
                }
            }
        }

        issues
    }

    async fn scan_services(&self) -> Vec<PersistenceIssue> {
        let output = match tokio::process::Command::new("sc")
            .args(&["query", "type=", "service", "state=", "all"])
            .output()
            .await {
                Ok(out) => out,
                Err(e) => {
                    log::warn!("Failed to query services: {}", e);
                    return vec![];
                }
            };

        if !output.status.success() {
            log::warn!("sc query command failed");
            return vec![];
        }

        let stdout = String::from_utf8_lossy(&output.stdout);
        let mut issues = Vec::new();
        let mut current_service = String::new();

        for line in stdout.lines() {
            let line = line.trim();
            if line.starts_with("SERVICE_NAME:") {
                current_service = line.split(':').nth(1).unwrap_or("").trim().to_string();
            } else if line.starts_with("BINARY_PATH_NAME:") {
                if let Some(path) = line.split(':').nth(1) {
                    let path = path.trim().trim_matches('"');
                    // Simple heuristic: suspicious if binary path is not in system directories
                    if path.contains(".exe") && !path.to_lowercase().contains("system32") && !path.to_lowercase().contains("windows\\") {
                        issues.push(PersistenceIssue {
                            location: current_service.clone(),
                        });
                    }
                }
            }
        }

        issues
    }

    async fn clean_registry_persistence(&self) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        log::debug!("Cleaning registry persistence mechanisms");

        let issues = self.scan_registry().await;

        for issue in issues {
            // Parse location as key:value
            if let Some((key, value)) = issue.location.split_once(':') {
                let output = tokio::process::Command::new("reg")
                    .args(&["delete", key, "/v", value, "/f"])
                    .output()
                    .await?;

                if output.status.success() {
                    log::info!("Removed malicious registry entry: {}", issue.location);
                } else {
                    log::warn!("Failed to remove registry entry: {}", issue.location);
                }
            }
        }

        Ok(())
    }

    async fn clean_scheduled_tasks(&self) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        log::debug!("Cleaning scheduled task persistence mechanisms");

        let issues = self.scan_scheduled_tasks().await;

        for issue in issues {
            let output = tokio::process::Command::new("schtasks")
                .args(&["/delete", "/tn", &issue.location, "/f"])
                .output()
                .await?;

            if output.status.success() {
                log::info!("Removed malicious scheduled task: {}", issue.location);
            } else {
                log::warn!("Failed to remove scheduled task: {}", issue.location);
            }
        }

        Ok(())
    }

    async fn clean_wmi_persistence(&self) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        log::debug!("Cleaning WMI persistence mechanisms");

        // Remove suspicious WMI event filters
        let ps_script = r#"Get-WmiObject -Namespace root\subscription -Class __EventFilter | Where-Object { $_.Query -like '*process*' -and $_.Query -like '*create*' } | ForEach-Object { $_.Delete() }"#;

        let output = tokio::process::Command::new("powershell")
            .args(&["-Command", ps_script])
            .output()
            .await?;

        if output.status.success() {
            log::info!("Removed suspicious WMI event filters");
        } else {
            log::warn!("Failed to remove WMI event filters");
        }

        // Remove event consumers (be careful, this removes all)
        let ps_script_consumers = r#"Get-WmiObject -Namespace root\subscription -Class __EventConsumer | ForEach-Object { $_.Delete() }"#;

        let output_consumers = tokio::process::Command::new("powershell")
            .args(&["-Command", ps_script_consumers])
            .output()
            .await?;

        if output_consumers.status.success() {
            log::info!("Removed WMI event consumers");
        } else {
            log::warn!("Failed to remove WMI event consumers");
        }

        Ok(())
    }

    async fn clean_service_persistence(&self) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        log::debug!("Cleaning service persistence mechanisms");

        let issues = self.scan_services().await;

        for issue in issues {
            // Stop the service first
            let _ = tokio::process::Command::new("sc")
                .args(&["stop", &issue.location])
                .output()
                .await;

            // Delete the service
            let output = tokio::process::Command::new("sc")
                .args(&["delete", &issue.location])
                .output()
                .await?;

            if output.status.success() {
                log::info!("Removed malicious service: {}", issue.location);
            } else {
                log::warn!("Failed to remove service: {}", issue.location);
            }
        }

        Ok(())
    }

    async fn clean_startup_persistence(&self) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        log::debug!("Cleaning startup persistence mechanisms");

        // Clean registry startup entries (same as registry persistence)
        self.clean_registry_persistence().await?;

        // Clean startup folders
        let startup_paths = vec![
            r"C:\Users\*\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup",
            r"C:\ProgramData\Microsoft\Windows\Start Menu\Programs\StartUp",
        ];

        for path_pattern in startup_paths {
            // Use dir command or something, but since it's wildcard, use PowerShell
            let ps_script = format!(r#"Get-ChildItem -Path "{}" -File | Where-Object {{ $_.Name -notlike "*.lnk" -or $_.FullName -notmatch "system32|windows" }} | Remove-Item -Force"#, path_pattern);

            let output = tokio::process::Command::new("powershell")
                .args(&["-Command", &ps_script])
                .output()
                .await?;

            if output.status.success() {
                log::info!("Cleaned startup folder: {}", path_pattern);
            } else {
                log::warn!("Failed to clean startup folder: {}", path_pattern);
            }
        }

        Ok(())
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemIntegrityReport {
    pub scan_time: chrono::DateTime<chrono::Utc>,
    pub total_files_checked: usize,
    pub corrupted_files: Vec<CorruptedFile>,
    pub missing_files: Vec<String>,
    pub modified_files: Vec<CorruptedFile>,
    pub overall_integrity: IntegrityStatus,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum IntegrityStatus {
    Clean,
    Suspicious,
    Compromised,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CorruptedFile {
    pub path: String,
    pub expected_hash: String,
    pub actual_hash: String,
    pub corruption_type: CorruptionType,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum CorruptionType {
    HashMismatch,
    Missing,
    PersistenceMechanism,
}

#[derive(Debug, Clone)]
struct SystemFile {
    path: PathBuf,
    current_hash: String,
}

#[derive(Debug, Clone)]
pub enum PersistenceType {
    Registry,
    ScheduledTask,
    Wmi,
    Service,
    Startup,
}

#[derive(Debug, Clone)]
struct PersistenceIssue {
    location: String,
}
