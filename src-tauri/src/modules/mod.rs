//! Module definitions and re-exports

pub mod ai_engine;
pub mod ai_service;
pub mod kernel;
pub mod sandbox;
pub mod network;
pub mod app_control;
pub mod snapshot;
pub mod self_heal;
pub mod mesh;
pub mod hardware;
pub mod privacy;
pub mod db;
pub mod settings;

// Re-export key traits and types
pub use ai_engine::{AiEngine, AiEngineImpl, SystemEvent, DetectionResult};
pub use ai_service::AiServiceManager;
pub use kernel::{KernelHook, KernelHookImpl};
pub use sandbox::{SandboxManager, SandboxImpl};
pub use network::{NetworkShield, NetworkShieldImpl};
pub use app_control::{AppControl, AppControlImpl};
pub use snapshot::{SnapshotManager, SnapshotImpl};
pub use self_heal::{SelfHeal, SelfHealImpl};
pub use mesh::{SecurityMesh, MeshImpl};
pub use hardware::{HardwareSecurity, HardwareSecurityImpl};
pub use db::{Database, DatabaseImpl, Threat};