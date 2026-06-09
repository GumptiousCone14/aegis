'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function StatusPage() {
  const [status, setStatus] = useState<string>('Loading...');
  const [isTauri, setIsTauri] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      if (typeof window !== 'undefined' && (window as any).__TAURI__) {
        setIsTauri(true);
        try {
          const { invoke } = await import('@tauri-apps/api/core');
          const statusText = await invoke<string>('get_status');
          setStatus(statusText);
        } catch (err) {
          console.error('Failed to fetch status:', err);
          setStatus('Error retrieving status.');
        }
      } else {
        setStatus('This status page is available in the desktop application.');
      }
    };
    fetchStatus();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />
      <main className="flex-grow py-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Overall Status */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 p-6 rounded-2xl flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/30"
          >
            <CheckCircle className="w-10 h-10 text-emerald-400" />
            <div>
              <h1 className="text-2xl font-bold">
                {isTauri ? 'Aegis Security System Operational' : 'System Status'}
              </h1>
              <p className="text-slate-400">
                {status || 'Loading...'}
              </p>
            </div>
          </motion.div>

          {/* Detailed status would be added here in future */}
          {isTauri && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <h2 className="text-xl font-semibold mb-4">System Components</h2>
              <p className="text-slate-400">
                Real-time component health and metrics are available through the desktop dashboard.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
