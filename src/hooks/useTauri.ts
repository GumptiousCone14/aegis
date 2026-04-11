'use client';
import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';

export function useTauriStatus() {
  const [status, setStatus] = useState('Initializing...');
  const [isTauri, setIsTauri] = useState(false);

  useEffect(() => {
    // Check if running in Tauri
    if (typeof window !== 'undefined' && (window as any).__TAURI__) {
      setIsTauri(true);
      invoke('get_system_status')
        .then((res: any) => setStatus(res))
        .catch((err: any) => setStatus('Error: ' + err));
    } else {
      setStatus('Protected (Browser Demo)');
    }
  }, []);

  const triggerScan = async (type: string) => {
    if (isTauri) {
      return await invoke('trigger_scan', { scanType: type });
    }
    return `Started ${type} scan (Browser Demo)`;
  };

  return { status, triggerScan, isTauri };
}
