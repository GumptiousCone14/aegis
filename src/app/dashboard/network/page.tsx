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

export default function NetworkMonitor() {
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [filterThreatLevel, setFilterThreatLevel] = useState('all');
  const [isMonitoring, setIsMonitoring] = useState(true);

  // Mock real-time traffic data
  const [trafficData, setTrafficData] = useState([
    { time: '00:00', inbound: 2.4, outbound: 1.8, suspicious: 0 },
    { time: '00:05', inbound: 3.2, outbound: 2.1, suspicious: 1 },
    { time: '00:10', inbound: 2.8, outbound: 2.5, suspicious: 0 },
    { time: '00:15', inbound: 4.1, outbound: 3.2, suspicious: 2 },
    { time: '00:20', inbound: 3.5, outbound: 2.8, suspicious: 0 },
    { time: '00:25', inbound: 5.2, outbound: 4.1, suspicious: 3 },
    { time: '00:30', inbound: 4.8, outbound: 3.9, suspicious: 1 },
  ]);

  // Mock network stats
  const [stats, setStats] = useState({
    activeConnections: 47,
    totalBandwidth: '8.7 MB/s',
    threatsBlocked: 12,
    suspiciousIPs: 5
  });

  // Mock connections data
  const [connections, setConnections] = useState([
    {
      id: 1,
      domain: 'malicious-server.tk',
      ip: '185.220.101.45',
      protocol: 'HTTPS',
      port: '443',
      country: 'Russia',
      threatLevel: 'critical',
      bytesIn: '2.4 MB',
      bytesOut: '156 KB',
      duration: '5m 23s',
      threatDescription: 'Known C2 server detected. Irregular beacon intervals (avg 15s) indicate command and control communication. Connection attempting to exfiltrate encrypted data.',
      tags: ['C2 Communication', 'Data Exfiltration', 'Known Malicious IP', 'APT28'],
      aiAnalysis: {
        confidence: 94,
        indicators: [
          { text: 'Regular beacon pattern detected (15-30 second intervals)', detected: true },
          { text: 'Encrypted payload with non-standard cipher', detected: true },
          { text: 'IP matches known APT28 infrastructure', detected: true },
          { text: 'Domain registered in last 30 days', detected: true },
          { text: 'Traffic volume suggests data exfiltration', detected: true }
        ]
      }
    },
    {
      id: 2,
      domain: 'update-service.xyz',
      ip: '203.0.113.78',
      protocol: 'HTTP',
      port: '8080',
      country: 'China',
      threatLevel: 'high',
      bytesIn: '450 KB',
      bytesOut: '3.8 MB',
      duration: '12m 15s',
      threatDescription: 'Suspicious DNS tunneling detected. High frequency of DNS queries with encoded data in subdomain names. Likely data exfiltration attempt.',
      tags: ['DNS Tunneling', 'Data Exfiltration', 'Suspicious TLD', 'High Entropy'],
      aiAnalysis: {
        confidence: 87,
        indicators: [
          { text: 'Abnormal DNS query frequency (500+ queries/min)', detected: true },
          { text: 'High entropy in subdomain names', detected: true },
          { text: 'Unusual TXT record responses', detected: true },
          { text: 'Domain registered via privacy service', detected: true },
          { text: 'No legitimate WHOIS information', detected: true }
        ]
      }
    },
    {
      id: 3,
      domain: 'cdn.bootstrap-resources.com',
      ip: '172.67.145.23',
      protocol: 'HTTPS',
      port: '443',
      country: 'USA',
      threatLevel: 'medium',
      bytesIn: '1.2 MB',
      bytesOut: '45 KB',
      duration: '2m 08s',
      threatDescription: 'Domain mimics legitimate CDN service. SSL certificate issued recently with short validity period. Potential phishing or malware distribution site.',
      tags: ['Typosquatting', 'Suspicious Certificate', 'Recent Domain'],
      aiAnalysis: {
        confidence: 71,
        indicators: [
          { text: 'Domain similar to legitimate service (Levenshtein distance: 2)', detected: true },
          { text: 'SSL certificate issued 3 days ago', detected: true },
          { text: 'Self-signed certificate chain', detected: true },
          { text: 'No previous connection history', detected: false },
          { text: 'Domain age less than 30 days', detected: true }
        ]
      }
    },
    {
      id: 4,
      domain: 'api.cloudflare.com',
      ip: '104.16.132.229',
      protocol: 'HTTPS',
      port: '443',
      country: 'USA',
      threatLevel: 'safe',
      bytesIn: '89 KB',
      bytesOut: '12 KB',
      duration: '45s',
      threatDescription: null,
      tags: ['Verified Service', 'Trusted CDN'],
      aiAnalysis: {
        confidence: 98,
        indicators: [
          { text: 'Domain verified via certificate pinning', detected: false },
          { text: 'Valid extended validation SSL certificate', detected: false },
          { text: 'Matches known legitimate service patterns', detected: false },
          { text: 'Regular connection frequency', detected: false },
          { text: 'IP belongs to verified network (AS13335)', detected: false }
        ]
      }
    },
    {
      id: 5,
      domain: 'analytics-tracker.info',
      ip: '198.51.100.45',
      protocol: 'HTTPS',
      port: '443',
      country: 'Germany',
      threatLevel: 'medium',
      bytesIn: '234 KB',
      bytesOut: '892 KB',
      duration: '8m 42s',
      threatDescription: 'Unusual outbound data volume for analytics service. Pattern suggests potential data harvesting beyond normal tracking. Multiple privacy flags raised.',
      tags: ['Excessive Tracking', 'Privacy Risk', 'Fingerprinting'],
      aiAnalysis: {
        confidence: 68,
        indicators: [
          { text: 'Data transmission exceeds typical analytics volume', detected: true },
          { text: 'Canvas fingerprinting attempts detected', detected: true },
          { text: 'Access to clipboard API detected', detected: true },
          { text: 'Domain not on any tracking protection lists', detected: false },
          { text: 'Multiple tracking parameters in requests', detected: true }
        ]
      }
    }
  ]);

  const filteredConnections = connections.filter(conn => 
    filterThreatLevel === 'all' || conn.threatLevel === filterThreatLevel
  );

  const threatStats = {
    critical: connections.filter(c => c.threatLevel === 'critical').length,
    high: connections.filter(c => c.threatLevel === 'high').length,
    medium: connections.filter(c => c.threatLevel === 'medium').length,
    safe: connections.filter(c => c.threatLevel === 'safe').length,
  };

  const [networkAlerts, setNetworkAlerts] = useState([
    {
      id: 'net-1',
      severity: 'critical',
      title: 'C2 Server Blocked',
      message: 'Connection to malicious-server.tk blocked (94% AI confidence)',
      dismissed: false,
      actions: [
        {
          label: 'Details',
          primary: true,
          onClick: () => setSelectedConnection(connections[0])
        }
      ]
    },
    {
      id: 'net-2',
      severity: 'high',
      title: 'DNS Tunneling Detected',
      message: 'Suspicious DNS activity to update-service.xyz (87% confidence)',
      dismissed: false,
      actions: [
        {
          label: 'Investigate',
          primary: true,
          onClick: () => setSelectedConnection(connections[1])
        }
      ]
    }
  ]);

  const handleDismissAlert = (alertId: string) => {
    setNetworkAlerts(alerts => alerts.map(a => 
      a.id === alertId ? { ...a, dismissed: true } : a
    ));
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
          value={stats.activeConnections.toString()}
          subtitle="Currently monitored"
          color="blue"
        />
        <StatusCard
          icon={Activity}
          title="Total Bandwidth"
          value={stats.totalBandwidth}
          subtitle="Current throughput"
          color="purple"
          trend={{ positive: true, value: '+12%' }}
        />
        <StatusCard
          icon={AlertTriangle}
          title="Threats Blocked"
          value={stats.threatsBlocked.toString()}
          subtitle="Last 24 hours"
          color="red"
        />
        <StatusCard
          icon={Shield}
          title="Suspicious IPs"
          value={stats.suspiciousIPs.toString()}
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
