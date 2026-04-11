'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Activity, 
  Cpu,
  Clock,
  Bell
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import StatusCard from '@/components/app/StatusCard';
import ProtectionStatus from '@/components/app/ProtectionStatus';
import ThreatItem from '@/components/app/ThreatItem';
import AlertBanner from '@/components/alerts/AlertBanner';
import Link from 'next/link';
import ResponseLog from '@/components/automatedResponse/ResponseLog';

export default function Dashboard() {
  const [stats] = useState({
    threatsBlocked: 247,
    filesScanned: '1.2M',
    cpuUsage: '1.8%',
    lastScan: '2 hours ago'
  });

  const [recentThreats] = useState([
    {
      id: 1,
      name: 'Trojan.Win32.Generic',
      path: 'C:\\Users\\Downloads\\suspicious.exe',
      severity: 'critical' as 'critical' | 'medium' | 'low',
      status: 'blocked' as 'blocked' | 'quarantined',
      type: 'Trojan',
      timestamp: '5 minutes ago',
      description: 'Attempted to modify system registry and establish persistence'
    },
    {
      id: 2,
      name: 'Ransomware.Lockbit',
      path: 'C:\\Temp\\encrypt.dll',
      severity: 'critical' as 'critical' | 'medium' | 'low',
      status: 'quarantined' as 'blocked' | 'quarantined',
      type: 'Ransomware',
      timestamp: '1 hour ago',
      description: 'Mass file encryption attempt detected and prevented'
    },
    {
      id: 3,
      name: 'Adware.BrowserHijacker',
      path: 'C:\\Program Files\\Extension\\inject.js',
      severity: 'medium' as 'critical' | 'medium' | 'low',
      status: 'blocked' as 'blocked' | 'quarantined',
      type: 'Adware',
      timestamp: '3 hours ago',
      description: 'Browser modification attempt blocked'
    }
  ]);

  const [systemHealth] = useState({
    cpu: 18,
    memory: 45,
    disk: 62,
    network: 'Normal'
  });

  const [activeAlerts, setActiveAlerts] = useState([
    {
      id: 1,
      severity: 'critical' as 'critical' | 'warning' | 'info',
      title: 'C2 Communication Detected',
      message: 'APT28 infrastructure connection blocked. Click for details.',
      dismissed: false,
      actions: [
        {
          label: 'View Details',
          primary: true,
          onClick: () => window.location.href = '/dashboard/network'
        },
        {
          label: 'Dismiss',
          onClick: (alert: {id: number}) => handleDismissAlert(alert.id)
        }
      ]
    }
  ]);

  const handleDismissAlert = (alertId: number) => {
    setActiveAlerts(alerts => alerts.map(a => 
      a.id === alertId ? { ...a, dismissed: true } : a
    ));
  };

  const [automatedResponses] = useState([
    {
      id: 'ar-001',
      threatName: 'Ransomware.Lockbit',
      description: 'File encryption attempt automatically quarantined',
      timestamp: '5 minutes ago',
      actionType: 'quarantine' as 'quarantine' | 'block',
      status: 'success' as 'success' | 'failed',
      automated: true,
      userConfirmed: false,
      aiConfidence: 96,
      actions: [
        'Process terminated (PID 4532)',
        'File quarantined to secure vault',
        'Registry changes reverted',
        'Network connections blocked'
      ]
    },
    {
      id: 'ar-002',
      threatName: 'APT28 C2 Communication',
      description: 'Malicious network connection blocked',
      timestamp: '12 minutes ago',
      actionType: 'block' as 'quarantine' | 'block',
      status: 'success' as 'success' | 'failed',
      automated: true,
      userConfirmed: true,
      aiConfidence: 94,
      actions: [
        'IP 185.220.101.45 added to blocklist',
        'Domain malicious-server.tk blocked',
        'Firewall rules updated',
        'Connection terminated'
      ]
    },
    {
      id: 'ar-003',
      threatName: 'CVE-2025-1234 Exploit',
      description: 'Vulnerability exploitation attempt detected and blocked',
      timestamp: '1 hour ago',
      actionType: 'block' as 'quarantine' | 'block',
      status: 'success' as 'success' | 'failed',
      automated: true,
      userConfirmed: false,
      aiConfidence: 92,
      actions: [
        'Exploit payload blocked',
        'Chrome process sandboxed',
        'Memory injection prevented'
      ]
    }
  ]);

  return (
    <div className="p-8">
      <AlertBanner alerts={activeAlerts} onDismiss={handleDismissAlert} />
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Real-time security monitoring and threat intelligence</p>
      </div>


      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatusCard
          icon={Shield}
          title="Threats Blocked Today"
          value={stats.threatsBlocked.toString()}
          subtitle="Last 24 hours"
          color="emerald"
          trend={{ positive: true, value: '+12%' }}
        />
        <StatusCard
          icon={Activity}
          title="Files Scanned"
          value={stats.filesScanned}
          subtitle="Total protected files"
          color="blue"
        />
        <StatusCard
          icon={Cpu}
          title="CPU Impact"
          value={stats.cpuUsage}
          subtitle="System overhead"
          color="purple"
          trend={{ positive: true, value: '-0.2%' }}
        />
        <StatusCard
          icon={Clock}
          title="Last Full Scan"
          value={stats.lastScan}
          subtitle="Scheduled: Daily at 2AM"
          color="amber"
        />
      </div>

      {/* System Health */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-slate-900 border border-slate-800"
        >
          <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">CPU Usage</span>
                <span className="text-sm text-white font-semibold">{systemHealth.cpu}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${systemHealth.cpu}%` }}
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-600"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Memory</span>
                <span className="text-sm text-white font-semibold">{systemHealth.memory}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${systemHealth.memory}%` }}
                  className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Disk Usage</span>
                <span className="text-sm text-white font-semibold">{systemHealth.disk}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${systemHealth.disk}%` }}
                  className="h-full bg-gradient-to-r from-emerald-600 to-teal-600"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Network Status</span>
                <span className="text-sm text-emerald-400 font-semibold">{systemHealth.network}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-slate-500">Protected</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Alerts Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <Bell className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Active Security Alerts</h3>
              <p className="text-sm text-slate-400">1 critical threat detected in the last hour</p>
            </div>
          </div>
          <Link href="/dashboard/alerts">
            <Button variant="outline" className="border-blue-500/30">
              View All Alerts
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Automated Response Log */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Automated Threat Responses</h3>
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            {automatedResponses.length} Actions Today
          </Badge>
        </div>
        <ResponseLog logs={automatedResponses.slice(0, 3)} />
      </div>

      {/* Recent Threats */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Threats</h3>
          <Link href="/dashboard/threats">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>
        <div className="space-y-4">
          {recentThreats.map((threat) => (
            <ThreatItem key={threat.id} threat={threat} />
          ))}
        </div>
      </div>
    </div>
  );
}
