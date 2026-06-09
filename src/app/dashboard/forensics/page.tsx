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

  // Placeholder: In a production system, forensic reports would be generated from scan data.
  // For now, display an empty state.
  const [forensicReports] = useState<Array<any>>([]);

  // Stats derived from empty list will be zeros; could be dynamic later.
  const stats = {
    totalReports: forensicReports.length,
    criticalThreats: 0,
    avgConfidence: forensicReports.length > 0 
      ? Math.round(forensicReports.reduce((acc, r) => acc + (r.aiConfidence || 0), 0) / forensicReports.length)
      : 0,
    attributedAttacks: 0
  };

  const handleExport = (report: any) => {
    if (!report) return;
    const dataStr = JSON.stringify(report, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forensic-report-${report.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
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

          {/* Reports List or Empty State */}
          {filteredReports.length > 0 ? (
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
          ) : (
            <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800">
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-400 mb-2">No Forensic Reports</h3>
              <p className="text-slate-500">Forensic reports will appear here after a full system scan and analysis.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="vulnerabilities">
          <VulnerabilityScanner />
        </TabsContent>

        <TabsContent value="assistant">
          <AIAssistant />
        </TabsContent>
      </Tabs>
    </div>
  );
}
