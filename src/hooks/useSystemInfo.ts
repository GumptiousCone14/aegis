'use client';
import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';

export interface SystemInfo {
  version: string;
  last_update: string;
  database_version: string;
  license: string;
  build_number: string;
  update_available: boolean;
}

export function useSystemInfo() {
  const [info, setInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInfo = async () => {
    try {
      if (typeof window !== 'undefined' && (window as any).__TAURI__) {
        const res = await invoke<SystemInfo>('get_system_info');
        setInfo(res);
      } else {
        // Mock data for browser dev
        setInfo({
          version: '1.0.0',
          last_update: new Date().toISOString(),
          database_version: '2024.01.16.01',
          license: 'Professional',
          build_number: 'LOCAL-DEV',
          update_available: false,
        });
      }
    } catch (err: any) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  const checkForUpdates = async () => {
    try {
      if (typeof window !== 'undefined' && (window as any).__TAURI__) {
        await invoke('update_definitions');
        await fetchInfo();
        return { success: true, message: 'Updated successfully' };
      }
      return { success: true, message: 'Simulated update' };
    } catch (err: any) {
      return { success: false, message: err.toString() };
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  return { info, loading, error, refresh: fetchInfo, checkForUpdates };
}
