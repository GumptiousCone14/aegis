// Application Control
//
// Zero-Trust Application Control with dynamic trust scoring.

use async_trait::async_trait;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::Mutex;

use crate::modules::kernel::{KernelHook, KernelHookImpl};
use crate::modules::ai_engine::{AiEngine, AiEngineImpl, SystemEvent, DetectionResult};

#[async_trait]
pub trait AppControl: Send + Sync {
    async fn evaluate_app(&self, app: &Application) -> TrustScore;
    async fn update_trust_score(&self, app_id: &str, new_score: f32) -> Result<(), Box<dyn std::error::Error + Send + Sync>>;
    async fn restrict_permissions(&self, app_id: &str, permissions: Vec<Permission>) -> Result<(), Box<dyn std::error::Error + Send + Sync>>;
    async fn get_app_permissions(&self, app_id: &str) -> Vec<Permission>;
    async fn get_trusted_apps(&self) -> Vec<Application>;
    async fn get_license_info(&self) -> Result<String, Box<dyn std::error::Error + Send + Sync>>;
}

pub struct AppControlImpl {
    app_scores: Arc<Mutex<HashMap<String, AppProfile>>>,
    permission_policies: Arc<Mutex<HashMap<String, Vec<Permission>>>>,
    reputation_db: Arc<Mutex<HashMap<String, DeveloperReputation>>>,
    kernel_hook: Arc<dyn KernelHook>,
    ai_engine: Arc<dyn AiEngine>,
}

impl AppControlImpl {
    pub fn new() -> Self {
        let mut app_scores = HashMap::new();
        let mut reputation_db = HashMap::new();

        app_scores.insert("notepad.exe".to_string(), AppProfile {
            app_id: "notepad.exe".to_string(),
            developer: "Microsoft Corporation".to_string(),
            trust_score: 0.95,
            last_updated: chrono::Utc::now(),
            permissions: vec![Permission::FileRead, Permission::FileWrite],
        });

        app_scores.insert("chrome.exe".to_string(), AppProfile {
            app_id: "chrome.exe".to_string(),
            developer: "Google LLC".to_string(),
            trust_score: 0.85,
            last_updated: chrono::Utc::now(),
            permissions: vec![Permission::NetworkAccess, Permission::FileRead],
        });

        reputation_db.insert("Microsoft Corporation".to_string(), DeveloperReputation {
            reputation_score: 0.98,
            verified: true,
        });

        reputation_db.insert("Google LLC".to_string(), DeveloperReputation {
            reputation_score: 0.92,
            verified: true,
        });

        Self {
            app_scores: Arc::new(Mutex::new(app_scores)),
            permission_policies: Arc::new(Mutex::new(HashMap::new())),
            reputation_db: Arc::new(Mutex::new(reputation_db)),
            kernel_hook: Arc::new(KernelHookImpl::new()),
            ai_engine: Arc::new(AiEngineImpl::new()),
        }
    }

    async fn analyze_behavior(&self, app_id: &str) -> f32 {
        let event = SystemEvent {
            process_id: 0,
            event_type: "app_behavior_analysis".to_string(),
            timestamp: chrono::Utc::now(),
            data: serde_json::json!({ "app_id": app_id }),
        };

        match self.ai_engine.analyze_behavior(&event).await {
            DetectionResult::Safe => 0.9,
            DetectionResult::Suspicious(conf) => conf,
            DetectionResult::Malicious(conf) => 1.0 - conf,
        }
    }

    async fn analyze_permissions(&self, requested: &[Permission]) -> f32 {
        if requested.is_empty() {
            return 0.8;
        }

        let dangerous_permissions = [
            Permission::SystemAdmin,
            Permission::KernelAccess,
            Permission::RawDiskAccess,
        ];

        let dangerous_count = requested.iter()
            .filter(|p| dangerous_permissions.contains(p))
            .count();

        let dangerous_ratio = dangerous_count as f32 / requested.len() as f32;

        (1.0 - dangerous_ratio).max(0.1)
    }

    fn calculate_age_score(&self, first_seen: chrono::DateTime<chrono::Utc>) -> f32 {
        let age = chrono::Utc::now().signed_duration_since(first_seen);
        let days_old = age.num_days();

        match days_old {
            0..=30 => 0.3,
            31..=365 => 0.7,
            _ => 0.9,
        }
    }

    async fn get_community_score(&self, app_id: &str) -> f32 {
        if app_id.contains("malware") || app_id.contains("virus") {
            0.1
        } else if app_id.contains("trusted") {
            0.9
        } else {
            0.6
        }
    }

    fn score_to_risk_level(&self, score: f32) -> RiskLevel {
        match score {
            0.0..=0.3 => RiskLevel::High,
            0.3..=0.7 => RiskLevel::Medium,
            _ => RiskLevel::Low,
        }
    }

    fn get_recommended_permissions(&self, trust_score: f32, requested: &[Permission]) -> Vec<Permission> {
        if trust_score >= 0.8 {
            requested.to_vec()
        } else if trust_score >= 0.5 {
            requested.iter()
                .filter(|p| !matches!(p, Permission::SystemAdmin | Permission::KernelAccess))
                .cloned()
                .collect()
        } else {
            vec![Permission::FileRead]
        }
    }
}

#[async_trait]
impl AppControl for AppControlImpl {
    async fn evaluate_app(&self, app: &Application) -> TrustScore {
        let mut trust_components = Vec::new();

        let rep_db = self.reputation_db.lock().await;
        let dev_score = if let Some(rep) = rep_db.get(&app.developer) {
            if rep.verified {
                // Verified developers get a reputation boost
                (rep.reputation_score + 0.2).min(1.0)
            } else {
                rep.reputation_score
            }
        } else {
            0.3
        };
        drop(rep_db);

        trust_components.push(("developer_reputation".to_string(), dev_score));

        let signing_score = if app.is_signed { 0.9 } else { 0.2 };
        trust_components.push(("code_signing".to_string(), signing_score));

        let behavior_score = self.analyze_behavior(&app.executable).await;
        trust_components.push(("behavior_analysis".to_string(), behavior_score));

        let permission_score = self.analyze_permissions(&app.requested_permissions).await;
        trust_components.push(("permission_analysis".to_string(), permission_score));

        let age_score = self.calculate_age_score(app.first_seen);
        trust_components.push(("application_age".to_string(), age_score));

        let community_score = self.get_community_score(&app.executable).await;
        trust_components.push(("community_reputation".to_string(), community_score));

        let weights = [0.25, 0.20, 0.20, 0.15, 0.10, 0.10];

        let final_score: f32 = trust_components.iter()
            .zip(weights.iter())
            .map(|((_, score), weight)| score * weight)
            .sum();

        TrustScore {
            overall_score: final_score,
            components: trust_components,
            risk_level: self.score_to_risk_level(final_score),
            recommended_permissions: self.get_recommended_permissions(final_score, &app.requested_permissions),
        }
    }

    async fn update_trust_score(&self, app_id: &str, new_score: f32) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let mut scores = self.app_scores.lock().await;
        if let Some(profile) = scores.get_mut(app_id) {
            profile.trust_score = new_score.clamp(0.0, 1.0);
            profile.last_updated = chrono::Utc::now();
            Ok(())
        } else {
            Err(format!("Application {} not found", app_id).into())
        }
    }

    async fn restrict_permissions(&self, app_id: &str, permissions: Vec<Permission>) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let mut policies = self.permission_policies.lock().await;
        policies.insert(app_id.to_string(), permissions.clone());

        self.kernel_hook.restrict_app_permissions(app_id, &permissions).await?;
        Ok(())
    }

    async fn get_app_permissions(&self, app_id: &str) -> Vec<Permission> {
        let policies = self.permission_policies.lock().await;
        policies.get(app_id).cloned().unwrap_or_default()
    }

    async fn get_trusted_apps(&self) -> Vec<Application> {
        let scores = self.app_scores.lock().await;

        scores.values()
            .filter(|profile| profile.trust_score >= 0.8)
            .map(|profile| Application {
                executable: profile.app_id.clone(),
                developer: profile.developer.clone(),
                version: "1.0".to_string(),
                is_signed: true,
                first_seen: profile.last_updated,
                requested_permissions: profile.permissions.clone(),
            })
            .collect()
    }

    async fn get_license_info(&self) -> Result<String, Box<dyn std::error::Error + Send + Sync>> {
        Ok("Professional".to_string())
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Application {
    pub executable: String,
    pub developer: String,
    pub version: String,
    pub is_signed: bool,
    pub first_seen: chrono::DateTime<chrono::Utc>,
    pub requested_permissions: Vec<Permission>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TrustScore {
    pub overall_score: f32,
    pub components: Vec<(String, f32)>,
    pub risk_level: RiskLevel,
    pub recommended_permissions: Vec<Permission>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum RiskLevel {
    Low,
    Medium,
    High,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum Permission {
    FileRead,
    FileWrite,
    NetworkAccess,
    SystemAdmin,
    KernelAccess,
    RawDiskAccess,
    RegistryAccess,
    ProcessCreate,
}

#[derive(Debug, Clone)]
struct AppProfile {
    app_id: String,
    developer: String,
    trust_score: f32,
    last_updated: chrono::DateTime<chrono::Utc>,
    permissions: Vec<Permission>,
}

#[derive(Debug, Clone)]
struct DeveloperReputation {
    reputation_score: f32,
    verified: bool,
}