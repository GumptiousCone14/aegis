// Database Layer
//
// Handles threat logging and metadata storage.

use async_trait::async_trait;
use rusqlite::Connection;
use std::sync::Arc;
use tokio::sync::Mutex;
use chrono::{DateTime, Utc};

#[async_trait]
pub trait Database: Send + Sync {
    async fn log_threat(&self, threat: &Threat) -> Result<(), Box<dyn std::error::Error + Send + Sync>>;
    async fn get_threats(&self) -> Result<Vec<Threat>, Box<dyn std::error::Error + Send + Sync>>;
}

pub struct DatabaseImpl {
    conn: Arc<Mutex<Connection>>,
}

impl DatabaseImpl {
    pub fn new() -> Self {
        let conn: Connection = Connection::open("aegis_security.db").expect("Failed to open database");
        // Create tables
        conn.execute(
            "CREATE TABLE IF NOT EXISTS threats (
                id INTEGER PRIMARY KEY,
                process_id INTEGER,
                threat_type TEXT,
                confidence REAL,
                timestamp TEXT
            )",
            [],
        ).expect("Failed to create threats table");

        conn.execute(
            "CREATE TABLE IF NOT EXISTS metadata (
                key TEXT PRIMARY KEY,
                value TEXT
            )",
            [],
        ).expect("Failed to create metadata table");

        // Set default database version if not exists
        let _: Result<usize, _> = conn.execute(
            "INSERT OR IGNORE INTO metadata (key, value) VALUES ('database_version', '2024.01.16.01')",
            [],
        );

        Self {
            conn: Arc::new(Mutex::new(conn)),
        }
    }

    pub async fn get_version(&self) -> Result<String, Box<dyn std::error::Error + Send + Sync>> {
        let conn = self.conn.lock().await;
        let version = conn.query_row(
            "SELECT value FROM metadata WHERE key = 'database_version'",
            [],
            |row| row.get(0)
        ).unwrap_or_else(|_| "2024.01.10.01".to_string());
        Ok(version)
    }

    pub async fn set_version(&self, version: &str) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let conn = self.conn.lock().await;
        conn.execute(
            "INSERT OR REPLACE INTO metadata (key, value) VALUES ('database_version', ?1)",
            rusqlite::params![version],
        )?;
        Ok(())
    }
}

#[async_trait]
impl Database for DatabaseImpl {
    async fn log_threat(&self, threat: &Threat) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let conn = self.conn.lock().await;
        conn.execute(
            "INSERT INTO threats (process_id, threat_type, confidence, timestamp) VALUES (?1, ?2, ?3, ?4)",
            rusqlite::params![threat.process_id, threat.threat_type, threat.confidence, threat.timestamp.to_rfc3339()],
        )?;
        Ok(())
    }

    async fn get_threats(&self) -> Result<Vec<Threat>, Box<dyn std::error::Error + Send + Sync>> {
        let conn = self.conn.lock().await;
        let mut stmt = conn.prepare("SELECT process_id, threat_type, confidence, timestamp FROM threats")?;
        let threat_iter = stmt.query_map([], |row: &rusqlite::Row| {
            Ok(Threat {
                process_id: row.get(0)?,
                threat_type: row.get(1)?,
                confidence: row.get(2)?,
                timestamp: DateTime::parse_from_rfc3339(&row.get::<_, String>(3)?).unwrap_or_else(|_| chrono::Utc::now().into()).into(),
            })
        })?;

        let mut threats = Vec::new();
        for threat in threat_iter {
            threats.push(threat?);
        }
        Ok(threats)
    }
}

#[derive(Debug, Clone)]
pub struct Threat {
    pub process_id: u32,
    pub threat_type: String,
    pub confidence: f32,
    pub timestamp: DateTime<Utc>,
}