'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Download,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ThreatItem from '@/components/app/ThreatItem';

const allThreats = [
  {
    id: 1,
    name: 'Trojan.Win32.Generic',
    path: 'C:\\Users\\Downloads\\suspicious.exe',
    severity: 'critical' as 'critical' | 'medium' | 'low',
    status: 'blocked' as 'blocked' | 'quarantined' | 'monitoring',
    type: 'Trojan',
    timestamp: '5 minutes ago',
    description: 'Attempted to modify system registry and establish persistence'
  },
  {
    id: 2,
    name: 'Ransomware.Lockbit',
    path: 'C:\\Temp\\encrypt.dll',
    severity: 'critical' as 'critical' | 'medium' | 'low',
    status: 'quarantined' as 'blocked' | 'quarantined' | 'monitoring',
    type: 'Ransomware',
    timestamp: '1 hour ago',
    description: 'Mass file encryption attempt detected and prevented'
  },
  {
    id: 3,
    name: 'Adware.BrowserHijacker',
    path: 'C:\\Program Files\\Extension\\inject.js',
    severity: 'medium' as 'critical' | 'medium' | 'low',
    status: 'blocked' as 'blocked' | 'quarantined' | 'monitoring',
    type: 'Adware',
    timestamp: '3 hours ago',
    description: 'Browser modification attempt blocked'
  },
  {
    id: 4,
    name: 'Spyware.Keylogger',
    path: 'C:\\Windows\\System32\\logger.sys',
    severity: 'high' as 'high' | 'medium' | 'low',
    status: 'quarantined' as 'blocked' | 'quarantined' | 'monitoring',
    type: 'Spyware',
    timestamp: '5 hours ago',
    description: 'Keystroke logging malware detected in system directory'
  },
  {
    id: 5,
    name: 'PUA.Bundleware',
    path: 'C:\\Users\\AppData\\Local\\bundled.exe',
    severity: 'low' as 'critical' | 'medium' | 'low',
    status: 'monitoring' as 'blocked' | 'quarantined' | 'monitoring',
    type: 'PUA',
    timestamp: '1 day ago',
    description: 'Potentially unwanted application detected'
  },
  {
    id: 6,
    name: 'Backdoor.RemoteAccess',
    path: 'C:\\ProgramData\\remote.dll',
    severity: 'critical' as 'critical' | 'medium' | 'low',
    status: 'quarantined' as 'blocked' | 'quarantined' | 'monitoring',
    type: 'Backdoor',
    timestamp: '2 days ago',
    description: 'Remote access trojan attempting to establish command and control connection'
  },
  {
    id: 7,
    name: 'Rootkit.HiddenProcess',
    path: 'C:\\Windows\\Drivers\\hidden.sys',
    severity: 'high' as 'high' | 'medium' | 'low',
    status: 'blocked' as 'blocked' | 'quarantined' | 'monitoring',
    type: 'Rootkit',
    timestamp: '3 days ago',
    description: 'Kernel-level rootkit attempting to hide malicious processes'
  },
  {
    id: 8,
    name: 'Miner.CryptoJacker',
    path: 'C:\\Users\\AppData\\Roaming\\miner.exe',
    severity: 'medium' as 'critical' | 'medium' | 'low',
    status: 'quarantined' as 'blocked' | 'quarantined' | 'monitoring',
    type: 'Cryptominer',
    timestamp: '5 days ago',
    description: 'Unauthorized cryptocurrency mining software detected'
  }
];

export default function Threats() {
  const [threats, setThreats] = useState(allThreats);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleAction = (threat:any, action:any) => {
    if (action === 'delete') {
      setThreats(threats.filter(t => t.id !== threat.id));
    } else if (action === 'details') {
      console.log('Show details for:', threat);
    }
  };

  const filteredThreats = threats.filter(threat => {
    const matchesSearch = threat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         threat.path.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || threat.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || threat.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const stats = {
    total: threats.length,
    critical: threats.filter(t => t.severity === 'critical').length,
    quarantined: threats.filter(t => t.status === 'quarantined').length,
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Threat History</h1>
        <p className="text-slate-400">View and manage detected threats</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-slate-900 border border-slate-800"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-400 mb-1">Total Threats</div>
              <div className="text-3xl font-bold text-white">{stats.total}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-slate-900 border border-slate-800"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-400 mb-1">Critical Threats</div>
              <div className="text-3xl font-bold text-red-400">{stats.critical}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-slate-900 border border-slate-800"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-400 mb-1">Quarantined</div>
              <div className="text-3xl font-bold text-yellow-400">{stats.quarantined}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-slate-900 border border-slate-800 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <Input
              placeholder="Search threats by name or path..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white"
            />
          </div>
          
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-full md:w-48 bg-slate-800 border-slate-700">
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

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48 bg-slate-800 border-slate-700">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
              <SelectItem value="quarantined">Quarantined</SelectItem>
              <SelectItem value="monitoring">Monitoring</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="md:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Threats List */}
      <div className="space-y-4">
        {filteredThreats.length > 0 ? (
          filteredThreats.map((threat, index) => (
            <motion.div
              key={threat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ThreatItem threat={threat} />
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-12 rounded-2xl bg-slate-900/50 border border-slate-800 text-center"
          >
            <AlertTriangle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-400 mb-2">No threats found</h3>
            <p className="text-slate-500">No threats match your current filters</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
