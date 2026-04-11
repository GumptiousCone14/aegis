'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Filter,
  Download,
  Settings,
  CheckCircle2,
  AlertTriangle
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
import AlertItem from '@/components/alerts/AlertItem';
import Link from 'next/link';

export default function Alerts() {
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'network',
      severity: 'critical',
      status: 'active',
      title: 'C2 Communication Detected',
      message: 'Suspicious beaconing pattern detected to known APT28 infrastructure',
      details: 'Multiple encrypted connections to malicious-server.tk (185.220.101.45) with regular 15-second intervals. AI behavioral analysis indicates command and control communication with 94% confidence.',
      timestamp: '2 minutes ago',
      aiConfidence: 94
    },
    {
      id: 2,
      type: 'file',
      severity: 'critical',
      status: 'active',
      title: 'Ransomware Detected',
      message: 'AI identified ransomware behavior in suspicious executable',
      details: 'File "system_update.exe" is attempting to encrypt user files with rapid access patterns. Behavioral analysis detected file enumeration and encryption indicators matching known ransomware families.',
      timestamp: '5 minutes ago',
      aiConfidence: 96
    },
    {
      id: 3,
      type: 'network',
      severity: 'high',
      status: 'active',
      title: 'DNS Tunneling Detected',
      message: 'Unusual DNS query pattern suggests data exfiltration',
      details: 'High frequency DNS queries (500+/min) to update-service.xyz with high entropy subdomains. Pattern matches DNS tunneling signatures with 87% confidence.',
      timestamp: '12 minutes ago',
      aiConfidence: 87
    },
    {
      id: 4,
      type: 'file',
      severity: 'high',
      status: 'resolved',
      title: 'Trojan Quarantined',
      message: 'Banking trojan successfully isolated',
      details: 'Detected and quarantined banking trojan attempting to inject into browser processes. Threat neutralized before credential theft could occur.',
      timestamp: '1 hour ago',
      aiConfidence: 91
    },
    {
      id: 5,
      type: 'system',
      severity: 'medium',
      status: 'active',
      title: 'Suspicious Registry Modification',
      message: 'Unauthorized changes to system startup registry keys',
      details: 'Unknown process modified HKEY_LOCAL_MACHINE\\Software\\Microsoft\\Windows\\CurrentVersion\\Run to establish persistence. Potential malware installation detected.',
      timestamp: '2 hours ago',
      aiConfidence: 78
    },
    {
      id: 6,
      type: 'network',
      severity: 'medium',
      status: 'dismissed',
      title: 'Typosquatting Domain Accessed',
      message: 'Connection to domain mimicking legitimate service',
      details: 'Access to cdn.bootstrap-resources.com detected. Domain closely resembles legitimate CDN but uses recently issued certificate.',
      timestamp: '3 hours ago',
      aiConfidence: 71
    }
  ]);

  const filteredAlerts = alerts.filter(alert => {
    const severityMatch = filterSeverity === 'all' || alert.severity === filterSeverity;
    const statusMatch = filterStatus === 'all' || alert.status === filterStatus;
    const typeMatch = filterType === 'all' || alert.type === filterType;
    return severityMatch && statusMatch && typeMatch;
  });

  const stats = {
    activeAlerts: alerts.filter(a => a.status === 'active').length,
    resolvedToday: alerts.filter(a => a.status === 'resolved').length,
    criticalAlerts: alerts.filter(a => a.severity === 'critical' && a.status === 'active').length,
    avgConfidence: Math.round(alerts.reduce((acc, a) => acc + (a.aiConfidence || 0), 0) / alerts.length)
  };

  const handleAlertAction = (alert: any, action: string) => {
    if (action === 'resolve') {
      setAlerts(alerts.map(a => 
        a.id === alert.id ? { ...a, status: 'resolved' } : a
      ));
    } else if (action === 'dismiss') {
      setAlerts(alerts.map(a => 
        a.id === alert.id ? { ...a, status: 'dismissed' } : a
      ));
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Security Alerts</h1>
          <p className="text-slate-400">AI-powered threat notifications and alert management</p>
        </div>
        <div className="flex gap-3">
          <Link href='/dashboard/settings'>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Configure Alerts
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatusCard
          icon={AlertTriangle}
          title="Active Alerts"
          value={stats.activeAlerts.toString()}
          subtitle="Require attention"
          color="red"
        />
        <StatusCard
          icon={CheckCircle2}
          title="Resolved Today"
          value={stats.resolvedToday.toString()}
          subtitle="Threats neutralized"
          color="emerald"
        />
        <StatusCard
          icon={Bell}
          title="Critical Alerts"
          value={stats.criticalAlerts.toString()}
          subtitle="High priority"
          color="amber"
        />
        <StatusCard
          icon={Bell}
          title="AI Confidence"
          value={`${stats.avgConfidence}%`}
          subtitle="Average detection accuracy"
          color="blue"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-400">Filter:</span>
        </div>
        <Select value={filterSeverity} onValueChange={setFilterSeverity}>
          <SelectTrigger className="w-40 bg-slate-800 border-slate-700">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severity</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40 bg-slate-800 border-slate-700">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="dismissed">Dismissed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-40 bg-slate-800 border-slate-700">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="file">File Threats</SelectItem>
            <SelectItem value="network">Network Threats</SelectItem>
            <SelectItem value="system">System Changes</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <AlertItem alert={alert} onAction={handleAlertAction} />
            </motion.div>
          ))
        ) : (
          <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Alerts Found</h3>
            <p className="text-slate-400">Your system is secure. No alerts match the current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
