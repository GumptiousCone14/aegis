'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  FileText,
  Brain,
  TrendingUp,
  Shield
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import StatusCard from '@/components/app/StatusCard';
import ForensicReport from '@/components/forensics/ForensicReport';
import AIAssistant from '@/components/forensics/AIAssistant';
import VulnerabilityScanner from '@/components/forensics/VulnerabilityScanner';

export default function Forensics() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');

  const [forensicReports] = useState([
    {
      id: 'FR-2026-001',
      type: 'network',
      severity: 'critical',
      title: 'APT28 C2 Communication',
      description: 'Advanced persistent threat attempting command and control establishment',
      timestamp: '2026-01-20 14:23:45 UTC',
      origin: 'Russia (185.220.101.45)',
      aiConfidence: 94,
      attribution: {
        family: 'APT28 / Fancy Bear',
        actor: 'Russian Military Intelligence (GRU Unit 26165)',
        campaign: 'Operation Ghost Network 2026',
        ttps: ['T1071.001', 'T1041', 'T1027', 'T1071.004', 'T1573']
      },
      attackVector: {
        entryPoint: 'Compromised browser extension installed via phishing email',
        method: 'Exploit of CVE-2025-1234 in web rendering engine to inject malicious code',
        iocs: [
          { type: 'Domain', value: 'malicious-server.tk' },
          { type: 'IP Address', value: '185.220.101.45' },
          { type: 'SSL Cert Hash', value: 'a8f7b3c2d1e4567890abcdef12345678' },
          { type: 'Beacon Interval', value: '15 seconds (±2s jitter)' }
        ]
      },
      timeline: [
        { time: '14:20:15', description: 'Initial connection attempt detected' },
        { time: '14:20:47', description: 'SSL handshake with suspicious certificate' },
        { time: '14:21:03', description: 'Regular beaconing pattern established' },
        { time: '14:23:12', description: 'Data exfiltration attempt detected (2.4 MB)' },
        { time: '14:23:45', description: 'Connection blocked by AI threat detection' }
      ],
      remediation: {
        immediate: [
          'Block IP 185.220.101.45 at firewall level',
          'Quarantine affected system for forensic analysis',
          'Reset credentials for potentially compromised accounts',
          'Scan network for additional infected hosts',
          'Review and remove malicious browser extension'
        ],
        longTerm: [
          'Implement DNS filtering to block known C2 domains',
          'Deploy network segmentation to limit lateral movement',
          'Enable email security with advanced phishing detection',
          'Conduct security awareness training on phishing tactics',
          'Implement certificate pinning for critical applications',
          'Deploy EDR solution on all endpoints'
        ]
      }
    },
    {
      id: 'FR-2026-002',
      type: 'file',
      severity: 'critical',
      title: 'Ransomware.Lockbit Encryption Attempt',
      description: 'Ransomware detected attempting mass file encryption with modern evasion techniques',
      timestamp: '2026-01-20 13:45:22 UTC',
      origin: 'Downloaded file (C:\\Users\\Downloads\\invoice_2026.exe)',
      aiConfidence: 96,
      attribution: {
        family: 'LockBit 4.0',
        actor: 'LockBit ransomware-as-a-service affiliate',
        campaign: 'Q1 2026 Financial Sector Campaign',
        ttps: ['T1486', 'T1490', 'T1489', 'T1083', 'T1070.004']
      },
      attackVector: {
        entryPoint: 'Malicious email attachment disguised as invoice PDF',
        method: 'Multi-stage loader with anti-analysis techniques and process hollowing',
        iocs: [
          { type: 'File Hash (SHA-256)', value: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
          { type: 'File Path', value: 'C:\\Users\\Downloads\\invoice_2026.exe' },
          { type: 'Registry Key', value: 'HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run' },
          { type: 'Mutex', value: 'Global\\LockBit_2026_Mutex' }
        ]
      },
      timeline: [
        { time: '13:42:10', description: 'File downloaded and executed by user' },
        { time: '13:42:15', description: 'Process injection into svchost.exe detected' },
        { time: '13:43:01', description: 'Rapid file access pattern detected (500+ files/sec)' },
        { time: '13:44:30', description: 'Encryption activity identified on user directory' },
        { time: '13:45:22', description: 'Process terminated and file quarantined by AI' }
      ],
      remediation: {
        immediate: [
          'Isolate affected system from network',
          'Terminate all suspicious processes',
          'Restore files from backup (if encrypted)',
          'Scan all systems for similar malware indicators',
          'Block file hash across all endpoints'
        ],
        longTerm: [
          'Implement email attachment sandboxing',
          'Deploy application whitelisting',
          'Enable controlled folder access',
          'Enforce least privilege access model',
          'Regular backup testing and verification',
          'Security awareness training on social engineering'
        ]
      }
    },
    {
      id: 'FR-2026-003',
      type: 'network',
      severity: 'high',
      title: 'DNS Tunneling Data Exfiltration',
      description: 'Covert channel established via DNS protocol for data exfiltration',
      timestamp: '2026-01-20 12:15:33 UTC',
      origin: 'China (203.0.113.78)',
      aiConfidence: 87,
      attribution: {
        family: 'DNSMessenger variant',
        actor: 'Unknown APT (likely financial espionage)',
        campaign: 'Operation DataSiphon',
        ttps: ['T1071.004', 'T1048.003', 'T1132.001', 'T1001.001']
      },
      attackVector: {
        entryPoint: 'Compromised third-party library in web application',
        method: 'DNS queries with base64-encoded data in subdomain labels',
        iocs: [
          { type: 'Domain', value: 'update-service.xyz' },
          { type: 'IP Address', value: '203.0.113.78' },
          { type: 'DNS Query Pattern', value: '[encoded_data].update-service.xyz' },
          { type: 'Query Frequency', value: '500+ queries/minute' }
        ]
      },
      timeline: [
        { time: '12:10:05', description: 'Unusual DNS query frequency detected' },
        { time: '12:11:20', description: 'High entropy in subdomain names identified' },
        { time: '12:13:45', description: 'Data encoding pattern recognized by AI' },
        { time: '12:15:10', description: 'Estimated 3.8 MB data exfiltrated' },
        { time: '12:15:33', description: 'DNS tunnel blocked by firewall rules' }
      ],
      remediation: {
        immediate: [
          'Block domain update-service.xyz at DNS level',
          'Identify source application or process',
          'Review DNS logs for similar patterns',
          'Assess what data may have been exfiltrated',
          'Patch or remove compromised library'
        ],
        longTerm: [
          'Implement DNS query rate limiting',
          'Deploy DNS security monitoring (DNSSec)',
          'Whitelist approved external DNS servers',
          'Monitor for high-entropy DNS queries',
          'Regular third-party dependency audits',
          'Implement data loss prevention (DLP) controls'
        ]
      }
    }
  ]);

  const filteredReports = forensicReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || report.type === filterType;
    const matchesSeverity = filterSeverity === 'all' || report.severity === filterSeverity;
    return matchesSearch && matchesType && matchesSeverity;
  });

  const handleExport = (report: any) => {
    console.log('Exporting report:', report.id);
    // In real implementation, this would generate a PDF or JSON export
  };

  const stats = {
    totalReports: forensicReports.length,
    criticalThreats: forensicReports.filter(r => r.severity === 'critical').length,
    avgConfidence: Math.round(forensicReports.reduce((acc, r) => acc + r.aiConfidence, 0) / forensicReports.length),
    attributedAttacks: forensicReports.filter(r => r.attribution.actor !== 'Unknown').length
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Forensic Analysis</h1>
        <p className="text-slate-400">AI-powered threat investigation and attribution</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatusCard
          icon={FileText}
          title="Forensic Reports"
          value={stats.totalReports.toString()}
          subtitle="Generated this month"
          color="blue"
        />
        <StatusCard
          icon={TrendingUp}
          title="Critical Threats"
          value={stats.criticalThreats.toString()}
          subtitle="Requiring investigation"
          color="red"
        />
        <StatusCard
          icon={Brain}
          title="AI Confidence"
          value={`${stats.avgConfidence}%`}
          subtitle="Average accuracy"
          color="purple"
        />
        <StatusCard
          icon={Search}
          title="Attributed Attacks"
          value={stats.attributedAttacks.toString()}
          subtitle="With known actors"
          color="emerald"
        />
      </div>

      {/* Main Content */}
      <Tabs defaultValue="reports" className="space-y-6">
        <TabsList className="bg-slate-900 border border-slate-800">
          <TabsTrigger value="reports" className="data-[state=active]:bg-slate-800">
            <FileText className="w-4 h-4 mr-2" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="vulnerabilities" className="data-[state=active]:bg-slate-800">
            <Shield className="w-4 h-4 mr-2" />
            Vulnerabilities
          </TabsTrigger>
          <TabsTrigger value="assistant" className="data-[state=active]:bg-slate-800">
            <Brain className="w-4 h-4 mr-2" />
            AI Assistant
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-800 border-slate-700 pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48 bg-slate-800 border-slate-700">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="file">File Threats</SelectItem>
                <SelectItem value="network">Network Threats</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger className="w-48 bg-slate-800 border-slate-700">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reports List */}
          <div className="space-y-6">
            {filteredReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ForensicReport report={report} onExport={handleExport} />
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vulnerabilities">
          <VulnerabilityScanner />
        </TabsContent>

        <TabsContent value="assistant">
          <AIAssistant threats={forensicReports} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
