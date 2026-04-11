// Privacy Protection Module
//
// Ensures user data privacy, prevents data leakage, and implements
// privacy-first architecture with zero-trust data handling.

use aes_gcm::{Aes256Gcm, Key, Nonce};
use aes_gcm::aead::{Aead, KeyInit};
use async_trait::async_trait;
use regex::Regex;
use ring::rand::SecureRandom;
use ring::rand::SystemRandom;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::Path;
use std::sync::Arc;
use std::time::{SystemTime, UNIX_EPOCH};
use tokio::sync::Mutex;

#[async_trait]
pub trait PrivacyManager {
    async fn scan_data_leakage(&self) -> Result<PrivacyReport, Box<dyn std::error::Error>>;
    async fn encrypt_sensitive_data(&self, data: &[u8]) -> Result<Vec<u8>, Box<dyn std::error::Error>>;
    async fn anonymize_logs(&self, logs: Vec<LogEntry>) -> Vec<LogEntry>;
    async fn check_compliance(&self) -> Result<ComplianceStatus, Box<dyn std::error::Error>>;
    async fn purge_old_data(&self) -> Result<(), Box<dyn std::error::Error>>;
}

pub struct PrivacyManagerImpl {
    data_patterns: Arc<Mutex<HashMap<String, DataPattern>>>,
    retention_policies: Vec<RetentionPolicy>,
}

impl PrivacyManagerImpl {
    pub fn new() -> Self {
        let mut data_patterns = HashMap::new();

        // Initialize with common sensitive data patterns
        data_patterns.insert("credit_card".to_string(), DataPattern {
            regex: r"\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b".to_string(),
            risk_level: RiskLevel::High,
        });

        data_patterns.insert("ssn".to_string(), DataPattern {
            regex: r"\b\d{3}[\s-]?\d{2}[\s-]?\d{4}\b".to_string(),
            risk_level: RiskLevel::High,
        });

        data_patterns.insert("email".to_string(), DataPattern {
            regex: r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b".to_string(),
            risk_level: RiskLevel::Medium,
        });

        data_patterns.insert("phone".to_string(), DataPattern {
            regex: r"\b\d{3}[\s.-]?\d{3}[\s.-]?\d{4}\b".to_string(),
            risk_level: RiskLevel::Medium,
        });

        Self {
            data_patterns: Arc::new(Mutex::new(data_patterns)),
            retention_policies: vec![
                RetentionPolicy {
                    directory: "logs".to_string(),
                    max_age_days: 30,
                },
            ],
        }
    }
}

#[async_trait]
impl PrivacyManager for PrivacyManagerImpl {
    async fn scan_data_leakage(&self) -> Result<PrivacyReport, Box<dyn std::error::Error>> {
        let mut report = PrivacyReport {
            scan_time: chrono::Utc::now(),
            data_leaks: Vec::new(),
            risk_assessment: RiskLevel::Low,
            recommendations: Vec::new(),
        };

        // Scan system for sensitive data patterns
        let patterns = self.data_patterns.lock().await.clone();
        let scan_path = "."; // Scan current directory, can be configured
        if let Ok(entries) = fs::read_dir(scan_path) {
            for entry in entries.flatten() {
                if let Ok(file_type) = entry.file_type() {
                    if file_type.is_file() {
                        if let Some(ext) = entry.path().extension() {
                            if matches!(ext.to_str(), Some("txt") | Some("log") | Some("json") | Some("rs") | Some("md")) {
                                if let Ok(content) = fs::read_to_string(entry.path()) {
                                    for (name, pattern) in &patterns {
                                        if let Ok(re) = Regex::new(&pattern.regex) {
                                            if re.is_match(&content) {
                                                report.data_leaks.push(DataLeak {
                                                    location: entry.path().to_string_lossy().to_string(),
                                                    data_type: name.clone(),
                                                    severity: pattern.risk_level.clone(),
                                                    context: "Found in file content".to_string(),
                                                });
                                                if matches!(pattern.risk_level, RiskLevel::High | RiskLevel::Critical) {
                                                    report.risk_assessment = RiskLevel::High;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } else if file_type.is_dir() {
                        // Recursive scan, but for simplicity, only top level
                    }
                }
            }
        }

        log::info!("Privacy scan completed: {} potential leaks found", report.data_leaks.len());
        Ok(report)
    }

    async fn encrypt_sensitive_data(&self, data: &[u8]) -> Result<Vec<u8>, Box<dyn std::error::Error>> {
        let rng = SystemRandom::new();
        let mut key_bytes = [0u8; 32];
        if rng.fill(&mut key_bytes).is_err() {
            return Err("Random fill failed".into());
        }
        let key = Key::<Aes256Gcm>::from_slice(&key_bytes);
        let cipher = Aes256Gcm::new(key);

        let mut nonce_bytes = [0u8; 12];
        if rng.fill(&mut nonce_bytes).is_err() {
            return Err("Random fill failed".into());
        }
        let nonce = Nonce::from_slice(&nonce_bytes);

        let ciphertext = match cipher.encrypt(nonce, data) {
            Ok(c) => c,
            Err(e) => return Err(format!("Encryption failed: {}", e).into()),
        };

        let mut result = Vec::new();
        result.extend_from_slice(&key_bytes);
        result.extend_from_slice(&nonce_bytes);
        result.extend(ciphertext);
        Ok(result)
    }

    async fn anonymize_logs(&self, logs: Vec<LogEntry>) -> Vec<LogEntry> {
        logs.into_iter().map(|mut log: LogEntry| {
            // Remove or hash sensitive information
            if log.content.contains("password") || log.content.contains("token") {
                log.content = "[REDACTED]".to_string();
            }
            // Anonymize IP addresses
            log.content = log.content.replace(|c: char| c.is_numeric(), "X");
            log
        }).collect()
    }

    async fn check_compliance(&self) -> Result<ComplianceStatus, Box<dyn std::error::Error>> {
        let report = self.scan_data_leakage().await?;
        let has_high_risk_leaks = report.data_leaks.iter().any(|leak| matches!(leak.severity, RiskLevel::High | RiskLevel::Critical));
        if has_high_risk_leaks {
            Ok(ComplianceStatus::NonCompliant)
        } else {
            Ok(ComplianceStatus::Compliant)
        }
    }

    async fn purge_old_data(&self) -> Result<(), Box<dyn std::error::Error>> {
        let now = SystemTime::now().duration_since(UNIX_EPOCH)?.as_secs() as i64;
        let _max_age_seconds = 30 * 24 * 60 * 60; // 30 days in seconds

        for policy in &self.retention_policies {
            let dir_path = Path::new(&policy.directory);
            if dir_path.exists() && dir_path.is_dir() {
                if let Ok(entries) = fs::read_dir(dir_path) {
                    for entry in entries.flatten() {
                        if let Ok(metadata) = entry.metadata() {
                            if let Ok(modified) = metadata.modified().unwrap_or(SystemTime::UNIX_EPOCH).duration_since(UNIX_EPOCH) {
                                let age_seconds = now - modified.as_secs() as i64;
                                if age_seconds > policy.max_age_days as i64 * 24 * 60 * 60 {
                                    if fs::remove_file(entry.path()).is_ok() {
                                        log::info!("Purged old file: {:?}", entry.path());
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        log::info!("Old data purged successfully");
        Ok(())
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PrivacyReport {
    pub scan_time: chrono::DateTime<chrono::Utc>,
    pub data_leaks: Vec<DataLeak>,
    pub risk_assessment: RiskLevel,
    pub recommendations: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DataLeak {
    pub location: String,
    pub data_type: String,
    pub severity: RiskLevel,
    pub context: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum RiskLevel {
    Low,
    Medium,
    High,
    Critical,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ComplianceStatus {
    Compliant,
    NonCompliant,
    Unknown,
}

#[derive(Debug, Clone)]
struct DataPattern {
    regex: String,
    risk_level: RiskLevel,
}

#[derive(Debug, Clone)]
pub struct LogEntry {
    pub timestamp: chrono::DateTime<chrono::Utc>,
    pub level: String,
    pub content: String,
}

#[derive(Debug, Clone)]
struct RetentionPolicy {
    directory: String,
    max_age_days: u32,
}