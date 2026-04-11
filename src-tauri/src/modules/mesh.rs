// Cross-Platform Security Mesh
//
// Enables communication between aegis_security instances across devices for
// threat intelligence sharing and coordinated security responses.

use async_trait::async_trait;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::Mutex;
use tokio::net::{TcpListener, TcpStream};
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use uuid::Uuid;

#[async_trait]
pub trait SecurityMesh: Send + Sync {
    async fn join_mesh(&self, mesh_id: &str) -> Result<(), Box<dyn std::error::Error + Send + Sync>>;
    async fn leave_mesh(&self) -> Result<(), Box<dyn std::error::Error + Send + Sync>>;
    async fn broadcast_threat(&self, threat: &ThreatIntel) -> Result<(), Box<dyn std::error::Error + Send + Sync>>;
    async fn request_intel(&self, query: &IntelQuery) -> Result<Vec<ThreatIntel>, Box<dyn std::error::Error + Send + Sync>>;
    async fn get_mesh_status(&self) -> MeshStatus;
}

pub struct MeshImpl {
    node_id: String,
    connected_peers: Arc<Mutex<HashMap<String, PeerConnection>>>,
    threat_database: Arc<Mutex<Vec<ThreatIntel>>>,
    listener: Arc<Mutex<Option<TcpListener>>>,
    mesh_config: MeshConfig,
}

impl MeshImpl {
    pub fn new() -> Self {
        let node_id = Uuid::new_v4().to_string();
        Self {
            node_id,
            connected_peers: Arc::new(Mutex::new(HashMap::new())),
            threat_database: Arc::new(Mutex::new(Vec::new())),
            listener: Arc::new(Mutex::new(None)),
            mesh_config: MeshConfig::default(),
        }
    }

    pub fn with_config(mesh_config: MeshConfig) -> Self {
        let node_id = Uuid::new_v4().to_string();
        Self {
            node_id,
            connected_peers: Arc::new(Mutex::new(HashMap::new())),
            threat_database: Arc::new(Mutex::new(Vec::new())),
            listener: Arc::new(Mutex::new(None)),
            mesh_config,
        }
    }
}

#[async_trait]
impl SecurityMesh for MeshImpl {
    async fn join_mesh(&self, mesh_id: &str) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        // Start listening for peer connections
        let listener = TcpListener::bind(&self.mesh_config.listen_addr).await?;
        let mut listener_guard = self.listener.lock().await;
        *listener_guard = Some(listener);

        // Connect to known peers
        for peer_addr in &self.mesh_config.known_peers {
            match self.connect_to_peer(peer_addr).await {
                Ok(connection) => {
                    let mut peers = self.connected_peers.lock().await;
                    peers.insert(peer_addr.to_string(), connection);
                    log::info!("Connected to mesh peer: {}", peer_addr);
                }
                Err(e) => {
                    log::warn!("Failed to connect to peer {}: {}", peer_addr, e);
                }
            }
        }

        // Start mesh maintenance tasks
        self.start_mesh_maintenance().await;

        log::info!("Joined security mesh: {}", mesh_id);
        Ok(())
    }

    async fn leave_mesh(&self) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        // Disconnect from all peers
        let mut peers = self.connected_peers.lock().await;
        for (addr, connection) in peers.drain() {
            let mut stream = connection.stream.lock().await;
            if let Err(e) = stream.shutdown().await {
                log::warn!("Error disconnecting from peer {}: {}", addr, e);
            }
        }

        // Stop listener
        let mut listener = self.listener.lock().await;
        *listener = None;

        log::info!("Left security mesh");
        Ok(())
    }

    async fn broadcast_threat(&self, threat: &ThreatIntel) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let message = MeshMessage::ThreatBroadcast(threat.clone());
        let serialized = serde_json::to_vec(&message)?;

        let peers = self.connected_peers.lock().await;
        for (addr, connection) in peers.iter() {
            if let Err(e) = self.send_to_peer(&connection.stream, &serialized).await {
                log::warn!("Failed to broadcast threat to peer {}: {}", addr, e);
            }
        }

        // Store in local database
        let mut database = self.threat_database.lock().await;
        database.push(threat.clone());

        log::info!("Broadcasted threat intelligence: {}", threat.threat_type);
        Ok(())
    }

    async fn request_intel(&self, query: &IntelQuery) -> Result<Vec<ThreatIntel>, Box<dyn std::error::Error + Send + Sync>> {
        let message = MeshMessage::IntelRequest(query.clone());
        let serialized = serde_json::to_vec(&message)?;

        let mut results = Vec::new();

        // Query local database first
        let database = self.threat_database.lock().await;
        for threat in database.iter() {
            if self.matches_query(threat, query) {
                results.push(threat.clone());
            }
        }

        // Query connected peers
        let peers = self.connected_peers.lock().await;
        for (addr, connection) in peers.iter() {
            match self.query_peer(&connection.stream, &serialized).await {
                Ok(peer_results) => {
                    results.extend(peer_results);
                }
                Err(e) => {
                    log::warn!("Failed to query peer {}: {}", addr, e);
                }
            }
        }

        // Remove duplicates and sort by timestamp
        results.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));
        results.dedup_by(|a, b| a.threat_id == b.threat_id);

        Ok(results)
    }

    async fn get_mesh_status(&self) -> MeshStatus {
        let peers = self.connected_peers.lock().await;
        let database = self.threat_database.lock().await;

        MeshStatus {
            node_id: self.node_id.clone(),
            connected_peers: peers.len(),
            total_threats: database.len(),
            mesh_active: self.listener.lock().await.is_some(),
            last_sync: chrono::Utc::now(), // Simplified
        }
    }
}

impl MeshImpl {
    async fn connect_to_peer(&self, addr: &str) -> Result<PeerConnection, Box<dyn std::error::Error + Send + Sync>> {
        let stream = TcpStream::connect(addr).await?;
        let connection = PeerConnection {
            stream: Arc::new(Mutex::new(stream)),
            last_seen: chrono::Utc::now(),
        };

        // Send handshake
        let handshake = MeshMessage::Handshake {
            node_id: self.node_id.clone(),
            version: env!("CARGO_PKG_VERSION").to_string(),
        };
        let serialized = serde_json::to_vec(&handshake)?;
        self.send_to_peer(&connection.stream, &serialized).await?;

        Ok(connection)
    }

    async fn send_to_peer(&self, stream: &Mutex<TcpStream>, data: &[u8]) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let mut stream = stream.lock().await;
        let len = data.len() as u32;
        stream.write_u32(len).await?;
        stream.write_all(data).await?;
        Ok(())
    }

    async fn query_peer(&self, stream: &Mutex<TcpStream>, query_data: &[u8]) -> Result<Vec<ThreatIntel>, Box<dyn std::error::Error + Send + Sync>> {
        self.send_to_peer(stream, query_data).await?;

        // Read response
        let mut stream = stream.lock().await;
        let len = stream.read_u32().await?;
        let mut buffer = vec![0; len as usize];
        stream.read_exact(&mut buffer).await?;

        let message: MeshMessage = serde_json::from_slice(&buffer)?;
        match message {
            MeshMessage::IntelResponse(threats) => Ok(threats),
            _ => Err("Unexpected response type".into()),
        }
    }

    fn matches_query(&self, threat: &ThreatIntel, query: &IntelQuery) -> bool {
        match query {
            IntelQuery::ByType(threat_type) => threat.threat_type == *threat_type,
            IntelQuery::BySeverity(min_severity) => threat.severity >= *min_severity,
            IntelQuery::ByTimeRange(start, end) => {
                threat.timestamp >= *start && threat.timestamp <= *end
            }
            IntelQuery::Recent(hours) => {
                let cutoff = chrono::Utc::now() - chrono::Duration::hours(*hours);
                threat.timestamp >= cutoff
            }
        }
    }

    async fn start_mesh_maintenance(&self) {
        let peers = Arc::clone(&self.connected_peers);
        let database = Arc::clone(&self.threat_database);

        tokio::spawn(async move {
            let mut interval = tokio::time::interval(std::time::Duration::from_secs(60));

            loop {
                interval.tick().await;

                // Clean up stale connections
                let mut peers_guard = peers.lock().await;
                let stale_peers: Vec<String> = peers_guard.iter()
                    .filter(|(_, conn)| {
                        chrono::Utc::now().signed_duration_since(conn.last_seen).num_minutes() > 5
                    })
                    .map(|(addr, _)| addr.clone())
                    .collect();

                for addr in stale_peers {
                    peers_guard.remove(&addr);
                    log::info!("Removed stale peer connection: {}", addr);
                }

                // Clean up old threat intelligence (keep last 1000 entries)
                let mut db_guard = database.lock().await;
                if db_guard.len() > 1000 {
                    db_guard.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));
                    db_guard.truncate(1000);
                    log::debug!("Cleaned up old threat intelligence");
                }
            }
        });
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MeshConfig {
    pub listen_addr: String,
    pub known_peers: Vec<String>,
    pub mesh_id: String,
    pub enable_encryption: bool,
    pub sync_interval: u64,
}

impl Default for MeshConfig {
    fn default() -> Self {
        Self {
            listen_addr: "0.0.0.0:8942".to_string(),
            known_peers: Vec::new(),
            mesh_id: "default-mesh".to_string(),
            enable_encryption: true,
            sync_interval: 300, // 5 minutes
        }
    }
}

#[derive(Debug)]
struct PeerConnection {
    stream: Arc<Mutex<TcpStream>>,
    last_seen: chrono::DateTime<chrono::Utc>,
}



#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ThreatIntel {
    pub threat_id: String,
    pub threat_type: String,
    pub severity: u8, // 1-10 scale
    pub description: String,
    pub indicators: Vec<String>,
    pub timestamp: chrono::DateTime<chrono::Utc>,
    pub source_node: String,
    pub confidence: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum IntelQuery {
    ByType(String),
    BySeverity(u8),
    ByTimeRange(chrono::DateTime<chrono::Utc>, chrono::DateTime<chrono::Utc>),
    Recent(i64), // hours
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MeshStatus {
    pub node_id: String,
    pub connected_peers: usize,
    pub total_threats: usize,
    pub mesh_active: bool,
    pub last_sync: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
enum MeshMessage {
    Handshake { node_id: String, version: String },
    ThreatBroadcast(ThreatIntel),
    IntelRequest(IntelQuery),
    IntelResponse(Vec<ThreatIntel>),
    Ping,
    Pong,
}