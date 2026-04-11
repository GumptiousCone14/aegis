//! aegis_security Core Library
//!
//! This library contains the core functionality for aegis_security antivirus,
//! including threat detection, containment, and system protection.

pub mod core;
pub mod commands;
pub mod modules;

// Re-export main types
pub use core::AegisSecurityCore;
pub use modules::*;