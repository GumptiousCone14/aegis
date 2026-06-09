'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Network, 
  Activity, 
  AlertTriangle, 
  Shield,
  Radio,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import StatusCard from '@/components/app/StatusCard';
import TrafficChart from '@/components/network/TrafficChart';
import ConnectionItem from '@/components/network/ConnectionItem';
import ThreatDetailModal from '@/components/network/ThreatDetailModal';
import AlertBanner from '@/components/alerts/AlertBanner';
import { invoke } from '@tauri-apps/api/core';

interface NetworkConnection {
  id: number;
  domain: string;
  ip: string;
  protocol: string;
  port: string;
  country: string;
  threatLevel: 'critical' | 'high' | 'medium' | 'safe';
  bytesIn: string;
  bytesOut: string;
  duration: string;
  threatDescription?: string;
  tags?: string[];
  aiAnalysis: {
    confidence: number;
    indicators: Array<{ text: string; detected: boolean }>;
  };
}

interface NetworkTrafficData {
  time: string;
  inbound: number;
  outbound: number;
  suspicious: number;
}

interface NetworkStats {
  activeConnections: number;
  totalBandwidth: string;
  threatsBlocked: number;
  suspiciousIPs: number;
}

interface NetworkAlert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'info';
  title: string;
  message: string;
  dismissed: boolean;
  actions: Array<{
    label: string;
    primary?: boolean;
    onClick: () => void;
  }>;
}

export default function NetworkMonitor() {
  const [selectedConnection, setSelectedConnection] = useState<NetworkConnection | null>(null);
  const [filterThreatLevel, setFilterThreatLevel] = useState('all');
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [connections, setConnections] = useState<NetworkConnection[]>([]);
  const [trafficData, setTrafficData] = useState<NetworkTrafficData[]>([]);
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [networkAlerts, setNetworkAlerts] = useState<NetworkAlert[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (typeof window !== 'undefined' && (window as any).__TAURI__) {
          const [conns, traffic, statsRes] = await Promise.all([
            invoke<NetworkConnection[]>('get_network_connections'),
            invoke<NetworkTrafficData[]>('get_network_traffic'),
            invoke<NetworkStats>('get_network_stats')
          ]);
          setConnections(conns);
          setTrafficData(traffic);
          setStats(statsRes);

          // Generate alerts for critical/high connections
          const alerts: NetworkAlert[] = conns
            .filter(conn => conn.threatLevel === 'critical' || conn.threatLevel === 'high')
            .slice(0, 2)
            .map((conn, idx) => ({
              id: `net-${idx + 1}`,
              severity: conn.threatLevel as any,
              title: `${conn.threatLevel.charAt(0).toUpperCase() + conn.threatLevel.slice(1)} Threat Detected`,
              message: `Connection to ${conn.domain} blocked (${conn.aiAnalysis?.confidence || 0}% AI confidence)`,
              dismissed: false,
              actions: [
                {
                  label: 'View Details',
                  primary: true,
                  onClick: () => setSelectedConnection(conn)
                }
              ]
            }));
          setNetworkAlerts(alerts);
        }
      } catch (err) {
        console.error('Failed to load network data:', err);
      }
    };
    loadData();
    // Could set up polling for real-time updates
  }, []);

  const handleDismissAlert = (alertId: string | number) => {
    setNetworkAlerts(alerts => alerts.map(a => 
      a.id === alertId ? { ...a, dismissed: true } : a
    ));
  };

  const filteredConnections = connections.filter(conn => 
    filterThreatLevel === 'all' || conn.threatLevel === filterThreatLevel
  );

  const threatStats = {
    critical: connections.filter(c => c.threatLevel === 'critical').length,
    high: connections.filter(c => c.threatLevel === 'high').length,
    medium: connections.filter(c => c.threatLevel === 'medium').length,
    safe: connections.filter(c => c.threatLevel === 'safe').length,
  };

  return (
    <div className="p-8">
      <AlertBanner alerts={networkAlerts} onDismiss={handleDismissAlert} />
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Network Monitor</h1>
          <p className="text-slate-400">Real-time network traffic analysis and threat detection</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">
            <Radio className={`w-4 h-4 ${isMonitoring ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span className="text-sm text-slate-400">
              {isMonitoring ? 'Live Monitoring' : 'Paused'}
            </span>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsMonitoring(!isMonitoring)}
            className="border-slate-700"
          >
            {isMonitoring ? 'Pause' : 'Resume'}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatusCard
          icon={Network}
          title="Active Connections"
          value={stats?.activeConnections.toString() || '0'}
          subtitle="Currently monitored"
          color="blue"
        />
        <StatusCard
          icon={Activity}
          title="Total Bandwidth"
          value={stats?.totalBandwidth || '0 KB/s'}
          subtitle="Current throughput"
          color="purple"
        />
        <StatusCard
          icon={AlertTriangle}
          title="Threats Blocked"
          value={stats?.threatsBlocked.toString() || '0'}
          subtitle="Last 24 hours"
          color="red"
        />
        <StatusCard
          icon={Shield}
          title="Suspicious IPs"
          value={stats?.suspiciousIPs.toString() || '0'}
          subtitle="Under monitoring"
          color="amber"
        />
      </div>

      {/* Traffic Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-6 rounded-2xl bg-slate-900 border border-slate-800"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Network Traffic</h3>
            <p className="text-sm text-slate-400">Real-time bandwidth monitoring</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-slate-400">Inbound</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-cyan-500" />
              <span className="text-slate-400">Outbound</span>
            </div>
          </div>
        </div>
        <div className="h-64">
          <TrafficChart data={trafficData} type="area" />
        </div>
      </motion.div>

      {/* Threat Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-6 rounded-2xl bg-slate-900 border border-slate-800"
      >
        <h3 className="text-lg font-semibold text-white mb-6">Threat Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
            <div className="text-2xl font-bold text-red-400 mb-1">{threatStats.critical}</div>
            <div className="text-sm text-slate-400">Critical</div>
          </div>
          <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30">
            <div className="text-2xl font-bold text-orange-400 mb-1">{threatStats.high}</div>
            <div className="text-sm text-slate-400">High</div>
          </div>
          <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
            <div className="text-2xl font-bold text-yellow-400 mb-1">{threatStats.medium}</div>
            <div className="text-sm text-slate-400">Medium</div>
          </div>
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <div className="text-2xl font-bold text-emerald-400 mb-1">{threatStats.safe}</div>
            <div className="text-sm text-slate-400">Safe</div>
          </div>
        </div>
      </motion.div>

      {/* Connections List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Active Connections</h3>
          <div className="flex gap-3">
            <Select value={filterThreatLevel} onValueChange={setFilterThreatLevel}>
              <SelectTrigger className="w-48 bg-slate-800 border-slate-700">
                <SelectValue placeholder="Filter by threat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Connections</SelectItem>
                <SelectItem value="critical">Critical Only</SelectItem>
                <SelectItem value="high">High Only</SelectItem>
                <SelectItem value="medium">Medium Only</SelectItem>
                <SelectItem value="safe">Safe Only</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredConnections.map((connection, index) => (
            <motion.div
              key={connection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ConnectionItem 
                connection={connection} 
                onClick={setSelectedConnection}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Threat Detail Modal */}
      {selectedConnection && (
        <ThreatDetailModal
          connection={selectedConnection}
          onClose={() => setSelectedConnection(null)}
        />
      )}
    </div>
  );
}
