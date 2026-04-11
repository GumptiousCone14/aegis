'use client';
import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';

export interface SystemStats {
  threats_blocked: number;
  files_scanned: number;
  cpu_usage: number;
  memory_usage: number;
  active_connections: number;
  blocked_packets: number;
  vpn_active: boolean;
  threat_level: string;
}

export function useSystemStats() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      if (typeof window !== 'undefined' && (window as any).__TAURI__) {
        const res = await invoke<SystemStats>('get_system_stats');
        setStats(res);
      } else {
        // Mock data for browser dev
        setStats({
          threats_blocked: 247,
          files_scanned: 1200000,
          cpu_usage: 1.8,
          memory_usage: 45.2,
          active_connections: 12,
          blocked_packets: 1420,
          vpn_active: true,
          threat_level: 'Low'
        });
      }
    } catch (err: any) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return { stats, loading, error, refresh: fetchStats };
}
