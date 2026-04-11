'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle2, Activity } from 'lucide-react';
import { useTauriStatus } from '@/hooks/useTauri';

export default function ProtectionStatus({ isProtected = true, activeScans = 0, user = { name: 'Matthew', email: 'matthew@aegis.ai' } }) {
  const { status, triggerScan } = useTauriStatus();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 p-6 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 overflow-hidden w-full mb-8 shadow-2xl"
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1),transparent_70%)]" />
      
      {/* Animated rings */}
      {isProtected && (
        <>
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-blue-500/30"
          />
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.05, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-2 border-blue-500/20"
          />
        </>
      )}

      <div className="relative flex items-center gap-6">
        {/* Shield Icon */}
        <motion.div
          animate={isProtected ? {
            boxShadow: [
              '0 0 20px rgba(59,130,246,0.3)',
              '0 0 40px rgba(59,130,246,0.5)',
              '0 0 20px rgba(59,130,246,0.3)'
            ]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          className={`w-20 h-20 rounded-2xl flex items-center justify-center ${
            isProtected 
              ? 'bg-gradient-to-br from-blue-600 to-cyan-600' 
              : 'bg-slate-700'
          }`}
        >
          <Shield className="w-10 h-10 text-white" strokeWidth={2} />
        </motion.div>

        {/* Status Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-bold text-white uppercase tracking-tight">
              {status}
            </h3>
            {isProtected && (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            )}
          </div>
          {/* User Login Info */}
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-slate-500 font-medium">Account:</span>
            <span className="text-xs text-blue-400 font-bold">{user.name}</span>
            <span className="text-[10px] text-slate-600 px-1.5 py-0.5 rounded bg-white/5">{user.email}</span>
          </div>

          <p className="text-slate-400 mt-3 text-sm">
            {isProtected 
              ? 'Real-time protection is active and monitoring your system'
              : 'Your system is vulnerable. Enable protection immediately.'
            }
          </p>
          
          <div className="flex items-center gap-4 mt-3 text-sm">
            <span className="flex items-center gap-2 text-slate-400">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-white font-semibold">{activeScans}</span> active scans
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-400">All systems operational</span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
