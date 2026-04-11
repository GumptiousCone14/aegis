// Snapshot Manager
//
// Anti-Ransomware Time Machine with automatic rollback capabilities.

use async_trait::async_trait;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::PathBuf;
use std::sync::Arc;
use tokio::sync::Mutex;
#[allow(unused_imports)]
use log::{info, warn};
#[allow(unused_imports)]
use sha2::{Sha256, Digest};
#[allow(unused_imports)]
use chrono::{DateTime, Utc};

#[async_trait]
pub trait SnapshotManager: Send + Sync {
    async fn create_snapshot(&self, paths: Vec<PathBuf>) -> Result<String, Box<dyn std::error::Error>>;
    async fn restore_snapshot(&self, snapshot_id: &str) -> Result<(), Box<dyn std::error::Error>>;
    async fn detect_ransomware(&self, changed_files: Vec<FileChange>) -> Option<String>;
    async fn list_snapshots(&self) -> Vec<SnapshotInfo>;
    async fn delete_snapshot(&self, snapshot_id: &str) -> Result<(), Box<dyn std::error::Error>>;
}

pub struct SnapshotImpl {
    snapshots: Arc<Mutex<HashMap<String, Snapshot>>>,
    snapshot_dir: PathBuf,
    max_snapshots: usize,
}

impl SnapshotImpl {
    pub fn new() -> Self {
        Self {
            snapshots: Arc::new(Mutex::new(HashMap::new())),
            snapshot_dir: std::env::temp_dir().join("aegis_security_snapshots"),
            max_snapshots: 50, // Keep last 50 snapshots
        }
    }
}

#[async_trait]
impl SnapshotManager for SnapshotImpl {
    async fn create_snapshot(&self, paths: Vec<PathBuf>) -> Result<String, Box<dyn std::error::Error>> {
        let snapshot_id = format!("snapshot_{}", chrono::Utc::now().timestamp());
        let mut snapshot = Snapshot {
            id: snapshot_id.clone(),
            timestamp: chrono::Utc::now(),
            file_hashes: HashMap::new(),
            total_size: 0,
        };

        // Calculate file hashes and sizes
        for path in &paths {
            if path.is_file() {
                match tokio::fs::read(path).await {
                    Ok(content) => {
                        let hash = self.calculate_hash(&content);
                        snapshot.file_hashes.insert(path.clone(), hash);
                        snapshot.total_size += content.len();
                    }
                    Err(e) => log::warn!("Failed to read file {:?}: {}", path, e),
                }
            } else if path.is_dir() {
                // Recursively hash directory contents
                self.hash_directory(path, &mut snapshot).await?;
            }
        }

        // Create backup directory and copy files
        let backup_path = self.snapshot_dir.join(&snapshot_id);
        tokio::fs::create_dir_all(&backup_path).await?;
        for (path, hash) in &snapshot.file_hashes {
            let backup_file = backup_path.join(hash);
            tokio::fs::copy(path, &backup_file).await?;
        }

        // Store snapshot metadata
        let mut snapshots: tokio::sync::MutexGuard<'_, std::collections::HashMap<String, Snapshot>> = self.snapshots.lock().await;
        snapshots.insert(snapshot_id.clone(), snapshot);

        // Cleanup old snapshots if we exceed the limit
        if snapshots.len() > self.max_snapshots {
            let mut snapshot_list: Vec<(String, chrono::DateTime<chrono::Utc>)> = snapshots.iter().map(|(k, v): (&String, &Snapshot)| (k.clone(), v.timestamp)).collect();
            snapshot_list.sort_by_key(|(_, t)| *t);
            if let Some((oldest_id, _)) = snapshot_list.first() {
                snapshots.remove(oldest_id);
            }
        }

        log::info!("Created snapshot: {}", snapshot_id);
        Ok(snapshot_id)
    }

    async fn restore_snapshot(&self, snapshot_id: &str) -> Result<(), Box<dyn std::error::Error>> {
        let snapshots: tokio::sync::MutexGuard<'_, std::collections::HashMap<String, Snapshot>> = self.snapshots.lock().await;
        let snapshot = snapshots.get(snapshot_id)
            .ok_or_else(|| format!("Snapshot {} not found", snapshot_id))?;

        let backup_path = self.snapshot_dir.join(snapshot_id);

        // Restore files from backup
        for (original_path, hash) in &snapshot.file_hashes {
            let backup_file = backup_path.join(hash);
            if let Some(parent) = original_path.parent() {
                tokio::fs::create_dir_all(parent).await?;
            }
            tokio::fs::copy(&backup_file, original_path).await?;
        }

        log::info!("Restored snapshot: {} with {} files", snapshot_id, snapshot.file_hashes.len());

        Ok(())
    }

    async fn detect_ransomware(&self, changed_files: Vec<FileChange>) -> Option<String> {
        if changed_files.is_empty() {
            return None;
        }

        // Ransomware detection heuristics:
        // 1. Mass file encryption (many files changed to encrypted extensions)
        // 2. Files changed to known ransomware extensions
        // 3. High velocity of file changes
        // 4. Files becoming unreadable (entropy increase)

        let ransomware_extensions = ["encrypted", "locked", "crypto", "ransom"];
        let suspicious_extensions = ["aes", "rsa", "crypted"];

        let mut encrypted_count = 0;
        let total_changes = changed_files.len();
        let _time_window = chrono::Duration::minutes(5);

        // Check for mass encryption
        for change in &changed_files {
            if let Some(ext) = change.new_path.extension() {
                let ext_str = ext.to_string_lossy().to_lowercase();
                if ransomware_extensions.contains(&ext_str.as_str()) ||
                   suspicious_extensions.contains(&ext_str.as_str()) {
                    encrypted_count += 1;
                }
            }

            // Check if file became unreadable (high entropy)
            if change.entropy_change > 0.3 { // Significant entropy increase
                encrypted_count += 1;
            }
        }

        // If more than 10% of changed files look encrypted, trigger alert
        let encryption_ratio = encrypted_count as f32 / total_changes as f32;
        if encryption_ratio > 0.1 {
            // Find the most recent snapshot to restore from
            let snapshots = self.snapshots.lock().await;
            let mut snapshot_list: Vec<_> = snapshots.values().collect();
            snapshot_list.sort_by_key(|s| std::cmp::Reverse(s.timestamp));

            if let Some(latest_snapshot) = snapshot_list.first() {
                return Some(latest_snapshot.id.clone());
            }
        }

        None
    }

    async fn list_snapshots(&self) -> Vec<SnapshotInfo> {
        let snapshots: tokio::sync::MutexGuard<'_, std::collections::HashMap<String, Snapshot>> = self.snapshots.lock().await;
        snapshots.values().map(|s: &Snapshot| SnapshotInfo {
            id: s.id.clone(),
            timestamp: s.timestamp,
            file_count: s.file_hashes.len(),
            total_size: s.total_size,
        }).collect()
    }

    async fn delete_snapshot(&self, snapshot_id: &str) -> Result<(), Box<dyn std::error::Error>> {
        let mut snapshots: tokio::sync::MutexGuard<'_, std::collections::HashMap<String, Snapshot>> = self.snapshots.lock().await;
        snapshots.remove(snapshot_id)
            .ok_or_else(|| format!("Snapshot {} not found", snapshot_id))?;

        // Remove backup files from storage
        let backup_path = self.snapshot_dir.join(snapshot_id);
        tokio::fs::remove_dir_all(&backup_path).await?;

        log::info!("Deleted snapshot: {}", snapshot_id);
        Ok(())
    }
}

impl SnapshotImpl {
    async fn hash_directory(&self, dir_path: &PathBuf, snapshot: &mut Snapshot) -> Result<(), Box<dyn std::error::Error>> {
        let mut entries: tokio::fs::ReadDir = tokio::fs::read_dir(dir_path).await?;

        while let Some(entry) = entries.next_entry().await? {
            let path: std::path::PathBuf = entry.path();
            if path.is_file() {
                match tokio::fs::read(&path).await {
                    Ok(content) => {
                        let content: Vec<u8> = content;
                        let hash = self.calculate_hash(&content);
                        snapshot.file_hashes.insert(path.clone(), hash);
                        snapshot.total_size += content.len();
                    }
                    Err(e) => log::warn!("Failed to read file {:?}: {}", path, e),
                }
            } else if path.is_dir() {
                // Recursively hash subdirectories
                Box::pin(self.hash_directory(&path, snapshot)).await?;
            }
        }

        Ok(())
    }

    fn calculate_hash(&self, data: &[u8]) -> String {
        use sha2::{Sha256, Digest};
        let mut hasher = Sha256::new();
        hasher.update(data);
        format!("{:x}", hasher.finalize())
    }


}

#[derive(Debug, Clone)]
struct Snapshot {
    id: String,
    timestamp: chrono::DateTime<chrono::Utc>,
    file_hashes: HashMap<PathBuf, String>,
    total_size: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SnapshotInfo {
    pub id: String,
    pub timestamp: chrono::DateTime<chrono::Utc>,
    pub file_count: usize,
    pub total_size: usize,
}

#[derive(Debug, Clone)]
pub struct FileChange {
    pub old_path: PathBuf,
    pub new_path: PathBuf,
    pub change_type: ChangeType,
    pub entropy_change: f32,
    pub timestamp: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Clone)]
pub enum ChangeType {
    Modified,
    Renamed,
    Deleted,
    Created,
}
