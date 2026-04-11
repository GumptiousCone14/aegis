// AI Service Manager
// Automatically starts and manages the Python AI Engine server

use std::process::{Child, Command};
use std::sync::{Arc, Mutex};
use std::time::Duration;
use tokio::time::sleep;
use log::{info, error};

pub struct AiServiceManager {
    process: Arc<Mutex<Option<Child>>>,
    server_path: String,
    is_running: Arc<Mutex<bool>>,
}

impl AiServiceManager {
    pub fn new() -> Self {
        #[cfg(target_os = "windows")]
        let server_path = "ai\\start_ai_server.bat".to_string();
        
        #[cfg(not(target_os = "windows"))]
        let server_path = "ai/start_ai_server.sh".to_string();

        Self {
            process: Arc::new(Mutex::new(None)),
            server_path,
            is_running: Arc::new(Mutex::new(false)),
        }
    }

    pub async fn start(&self) -> Result<(), Box<dyn std::error::Error>> {
        let mut is_running = self.is_running.lock().unwrap();
        if *is_running {
            info!("AI Engine server is already running");
            return Ok(());
        }

        info!("Starting AI Engine server...");

        #[cfg(target_os = "windows")]
        let child = Command::new("cmd")
            .args(&["/C", "start", "/B", &self.server_path])
            .spawn()?;

        #[cfg(not(target_os = "windows"))]
        let child = Command::new("bash")
            .arg(&self.server_path)
            .spawn()?;

        *self.process.lock().unwrap() = Some(child);
        *is_running = true;

        info!("AI Engine server started");

        // Wait for server to be ready
        self.wait_for_ready().await?;

        Ok(())
    }

    async fn wait_for_ready(&self) -> Result<(), Box<dyn std::error::Error>> {
        info!("Waiting for AI Engine server to be ready...");
        
        for i in 1..=30 {
            sleep(Duration::from_millis(500)).await;
            
            // Try to connect to the WebSocket server
            match tokio_tungstenite::connect_async("ws://localhost:8765").await {
                Ok((mut ws, _)) => {
                    info!("AI Engine server is ready!");
                    
                    // Send ping to verify
                    use futures_util::SinkExt;
                    use tokio_tungstenite::tungstenite::Message;
                    
                    let ping_msg = serde_json::json!({
                        "type": "ping"
                    });
                    
                    let _ = ws.send(Message::Text(ping_msg.to_string())).await;
                    return Ok(());
                }
                Err(_) if i < 30 => {
                    // Keep waiting
                    continue;
                }
                Err(e) => {
                    error!("Failed to connect to AI Engine server after 15 seconds: {}", e);
                    return Err(format!("AI Engine server failed to start: {}", e).into());
                }
            }
        }

        Err("Timeout waiting for AI Engine server".into())
    }

    pub fn stop(&self) -> Result<(), Box<dyn std::error::Error>> {
        let mut process = self.process.lock().unwrap();
        let mut is_running = self.is_running.lock().unwrap();

        if let Some(mut child) = process.take() {
            info!("Stopping AI Engine server...");
            child.kill()?;
            child.wait()?;
            *is_running = false;
            info!("AI Engine server stopped");
        }

        Ok(())
    }

    pub fn is_running(&self) -> bool {
        *self.is_running.lock().unwrap()
    }

    pub async fn restart(&self) -> Result<(), Box<dyn std::error::Error>> {
        info!("Restarting AI Engine server...");
        self.stop()?;
        sleep(Duration::from_secs(2)).await;
        self.start().await?;
        Ok(())
    }

    pub async fn health_check(&self) -> bool {
        if !self.is_running() {
            return false;
        }

        // Try to ping the server
        match tokio_tungstenite::connect_async("ws://localhost:8765").await {
            Ok((mut ws, _)) => {
                use futures_util::{SinkExt, StreamExt};
                use tokio_tungstenite::tungstenite::Message;
                
                let ping_msg = serde_json::json!({
                    "type": "ping"
                });
                
                if ws.send(Message::Text(ping_msg.to_string())).await.is_ok() {
                    // Wait for pong response
                    if let Some(Ok(Message::Text(response))) = ws.next().await {
                        if let Ok(data) = serde_json::from_str::<serde_json::Value>(&response) {
                            return data.get("type") == Some(&serde_json::json!("pong"));
                        }
                    }
                }
                false
            }
            Err(_) => false,
        }
    }
}

impl Drop for AiServiceManager {
    fn drop(&mut self) {
        let _ = self.stop();
    }
}
