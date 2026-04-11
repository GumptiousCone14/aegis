// Network Shield Module
//
// Monitors network traffic and provides VPN capabilities.

use std::net::IpAddr;
use serde::{Serialize, Deserialize};
use std::sync::Arc;
use tokio::sync::Mutex;
use async_trait::async_trait;
use log;

#[async_trait]
pub trait NetworkShield: Send + Sync {
    async fn enable_vpn(&self) -> Result<(), Box<dyn std::error::Error + Send + Sync>>;
    async fn disable_vpn(&self) -> Result<(), Box<dyn std::error::Error + Send + Sync>>;
    async fn get_blocked_connections(&self) -> Vec<BlockedConnection>;
}

pub struct NetworkShieldImpl {
    pub vpn_enabled: Arc<Mutex<bool>>,
    pub blocked_ips: Arc<Mutex<Vec<IpAddr>>>,
    pub connection_log: Arc<Mutex<Vec<NetworkEvent>>>,
}

impl NetworkShieldImpl {
    pub fn new() -> Self {
        Self {
            vpn_enabled: Arc::new(Mutex::new(false)),
            blocked_ips: Arc::new(Mutex::new(Vec::new())),
            connection_log: Arc::new(Mutex::new(Vec::new())),
        }
    }
}

#[async_trait]
impl NetworkShield for NetworkShieldImpl {
    async fn enable_vpn(&self) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let mut vpn = self.vpn_enabled.lock().await;
        if *vpn {
            return Ok(()); // Already enabled
        }

        // Implement VPN tunnel creation using WireGuard or system VPN
        #[cfg(target_os = "linux")]
        {
            let output = std::process::Command::new("wg-quick")
                .arg("up")
                .arg("wg0")
                .output()
                .map_err(|e| format!("Failed to execute wg-quick: {}", e))?;
            if !output.status.success() {
                return Err(format!("Failed to start VPN: {}", String::from_utf8_lossy(&output.stderr)).into());
            }
        }
        #[cfg(target_os = "macos")]
        {
            let output = std::process::Command::new("wg-quick")
                .arg("up")
                .arg("wg0")
                .output()
                .map_err(|e| format!("Failed to execute wg-quick: {}", e))?;
            if !output.status.success() {
                return Err(format!("Failed to start VPN: {}", String::from_utf8_lossy(&output.stderr)).into());
            }
        }
        #[cfg(target_os = "windows")]
        {
            let output = std::process::Command::new("rasdial")
                .arg("SentinelVPN")
                .output()
                .map_err(|e| format!("Failed to execute rasdial: {}", e))?;
            if !output.status.success() {
                return Err(format!("Failed to start VPN: {}", String::from_utf8_lossy(&output.stderr)).into());
            }
        }

        *vpn = true;
        log::info!("VPN tunnel enabled");
        Ok(())
    }

    async fn disable_vpn(&self) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let mut vpn = self.vpn_enabled.lock().await;
        if !*vpn {
            return Ok(()); // Already disabled
        }

        // Tear down VPN tunnel
        #[cfg(target_os = "linux")]
        {
            let output = std::process::Command::new("wg-quick")
                .arg("down")
                .arg("wg0")
                .output()
                .map_err(|e| format!("Failed to execute wg-quick: {}", e))?;
            if !output.status.success() {
                return Err(format!("Failed to stop VPN: {}", String::from_utf8_lossy(&output.stderr)).into());
            }
        }
        #[cfg(target_os = "macos")]
        {
            let output = std::process::Command::new("wg-quick")
                .arg("down")
                .arg("wg0")
                .output()
                .map_err(|e| format!("Failed to execute wg-quick: {}", e))?;
            if !output.status.success() {
                return Err(format!("Failed to stop VPN: {}", String::from_utf8_lossy(&output.stderr)).into());
            }
        }
        #[cfg(target_os = "windows")]
        {
            let output = std::process::Command::new("rasdial")
                .arg("/disconnect")
                .output()
                .map_err(|e| format!("Failed to execute rasdial: {}", e))?;
            if !output.status.success() {
                return Err(format!("Failed to stop VPN: {}", String::from_utf8_lossy(&output.stderr)).into());
            }
        }

        *vpn = false;
        log::info!("VPN tunnel disabled");
        Ok(())
    }

    async fn get_blocked_connections(&self) -> Vec<BlockedConnection> {
        let blocked = self.blocked_ips.lock().await;
        let log = self.connection_log.lock().await;

        blocked.iter().filter_map(|ip| {
            // Find recent blocked events for this IP
            log.iter().rev().find(|event| {
                event.packet.src_ip == *ip || event.packet.dst_ip == *ip
            }).map(|event| BlockedConnection {
                ip: *ip,
                reason: event.analysis.detected_threats.first()
                    .map(|t| t.threat_type.clone())
                    .unwrap_or_else(|| "Manual block".to_string()),
                timestamp: event.timestamp,
            })
        }).collect()
    }
}

impl NetworkShieldImpl {
    async fn detect_c2_communication(&self, packet: &NetworkPacket) -> bool {
        if packet.payload.len() < 100 && packet.payload.len() > 10 {
            if packet.protocol == "HTTPS" && [443, 8443, 4443].contains(&packet.dst_port) {
                return true;
            }
        }
        false
    }

    async fn detect_dns_tunneling(&self, packet: &NetworkPacket) -> bool {
        if packet.protocol == "DNS" {
            if let Some(query) = packet.dns_query.as_ref() {
                if query.len() > 100 {
                    return true;
                }
                if query.contains("==") || query.chars().any(|c| !c.is_alphanumeric() && c != '.' && c != '-') {
                    return true;
                }
            }
        }
        false
    }

    async fn detect_mitm_attack(&self, packet: &NetworkPacket) -> bool {
        if packet.protocol == "HTTPS" {
            if packet.tls_info.as_ref().map(|tls| !tls.certificate_valid).unwrap_or(false) {
                return true;
            }
        }
        false
    }

    async fn detect_port_scan(&self, packet: &NetworkPacket) -> bool {
        if packet.protocol == "TCP" && packet.flags.contains(&"SYN".to_string()) {
            let log = self.connection_log.lock().await;
            let recent_packets: Vec<_> = log.iter().rev().take(10).collect();

            let sequential_ports = recent_packets.windows(2).any(|window| {
                let prev = &window[0].packet;
                let curr = &window[1].packet;
                prev.src_ip == curr.src_ip &&
                prev.dst_ip == curr.dst_ip &&
                (curr.dst_port as i32 - prev.dst_port as i32).abs() <= 5
            });

            if sequential_ports {
                return true;
            }
        }
        false
    }

    #[cfg(target_os = "windows")]
    async fn add_windows_firewall_rule(&self, src_ip: IpAddr, dst_ip: IpAddr, port: u16, allow: bool) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let action = if allow { "allow" } else { "block" };
        let output = std::process::Command::new("netsh")
            .args(&["advfirewall", "firewall", "add", "rule", &format!("name=aegis_security_{}_{}", src_ip, port), "dir=in", &format!("action={}", action), &format!("remoteip={}", src_ip), &format!("localport={}", port), "protocol=TCP"])
            .output()
            .map_err(|e| format!("Failed to execute netsh: {}", e))?;
        if !output.status.success() {
            return Err(format!("Failed to add firewall rule: {}", String::from_utf8_lossy(&output.stderr)).into());
        }
        log::debug!("Windows firewall rule: {} -> {}:{} ({})", src_ip, dst_ip, port, if allow { "allow" } else { "block" });
        Ok(())
    }

    #[cfg(target_os = "linux")]
    async fn add_linux_iptables_rule(&self, src_ip: IpAddr, dst_ip: IpAddr, port: u16, allow: bool) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let target = if allow { "ACCEPT" } else { "DROP" };
        let output = std::process::Command::new("iptables")
            .args(&["-A", "INPUT", "-s", &src_ip.to_string(), "-d", &dst_ip.to_string(), "-p", "tcp", "--dport", &port.to_string(), "-j", target])
            .output()
            .map_err(|e| format!("Failed to execute iptables: {}", e))?;
        if !output.status.success() {
            return Err(format!("Failed to add iptables rule: {}", String::from_utf8_lossy(&output.stderr)).into());
        }
        log::debug!("Linux iptables rule: {} -> {}:{} ({})", src_ip, dst_ip, port, if allow { "allow" } else { "block" });
        Ok(())
    }

    #[cfg(target_os = "macos")]
    async fn add_macos_pf_rule(&self, src_ip: IpAddr, dst_ip: IpAddr, port: u16, allow: bool) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let action = if allow { "pass" } else { "block" };
        let rule = format!("{} in from {} to {} port {}", action, src_ip, dst_ip, port);
        let mut child = std::process::Command::new("pfctl")
            .args(&["-a", "aegis_security", "-f", "-"])
            .stdin(std::process::Stdio::piped())
            .spawn()
            .map_err(|e| format!("Failed to spawn pfctl: {}", e))?;
        {
            use std::io::Write;
            child.stdin.as_mut().unwrap().write_all(rule.as_bytes())?;
        }
        let output = child.wait()?;
        if !output.success() {
            return Err("Failed to add pf rule".into());
        }
        log::debug!("macOS pf rule: {} -> {}:{} ({})", src_ip, dst_ip, port, if allow { "allow" } else { "block" });
        Ok(())
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NetworkPacket {
    pub src_ip: IpAddr,
    pub dst_ip: IpAddr,
    pub src_port: u16,
    pub dst_port: u16,
    pub protocol: String,
    pub flags: Vec<String>,
    pub payload: Vec<u8>,
    pub dns_query: Option<String>,
    pub tls_info: Option<TlsInfo>,
    pub timestamp: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NetworkAnalysis {
    pub is_malicious: bool,
    pub risk_score: f32,
    pub detected_threats: Vec<DetectedThreat>,
    pub recommended_action: NetworkAction,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum NetworkAction {
    Allow,
    Block,
    Monitor,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DetectedThreat {
    pub threat_type: String,
    pub confidence: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BlockedConnection {
    pub ip: IpAddr,
    pub reason: String,
    pub timestamp: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NetworkEvent {
    timestamp: chrono::DateTime<chrono::Utc>,
    packet: NetworkPacket,
    analysis: NetworkAnalysis,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TlsInfo {
    pub certificate_valid: bool,
    pub cipher_suite: String,
    pub version: String,
}