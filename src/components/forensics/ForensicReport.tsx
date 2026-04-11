'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileWarning, 
  Network,
  AlertTriangle,
  Target,
  Shield,
  ChevronDown,
  ChevronUp,
  Download,
  Share,
  Clock,
  MapPin,
  Fingerprint
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const severityColors: {[key: string]: string} = {
  critical: 'bg-red-500/10 text-red-400 border-red-500/30',
  high: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
};

export default function ForensicReport({ report, onExport }: {report: any, onExport: (report: any) => void}) {
  const [expandedSections, setExpandedSections] = useState({
    attribution: true,
    attackVector: true,
    timeline: false,
    remediation: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const TypeIcon = report.type === 'file' ? FileWarning : Network;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-slate-900 border border-slate-800"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center ${severityColors[report.severity]}`}>
            <TypeIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">{report.title}</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={severityColors[report.severity]}>
                {report.severity.toUpperCase()} SEVERITY
              </Badge>
              <Badge className="bg-slate-800 text-slate-300">
                {report.type === 'file' ? 'File Threat' : 'Network Threat'}
              </Badge>
              <Badge className="bg-blue-500/10 text-blue-400">
                AI Confidence: {report.aiConfidence}%
              </Badge>
            </div>
            <p className="text-slate-400">{report.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onExport(report)}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Quick Facts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">Detected</span>
          </div>
          <p className="text-white font-semibold">{report.timestamp}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">Origin</span>
          </div>
          <p className="text-white font-semibold">{report.origin}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Fingerprint className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">Threat ID</span>
          </div>
          <p className="text-white font-semibold font-mono text-sm">{report.id}</p>
        </div>
      </div>

      {/* AI Attribution */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection('attribution')}
          className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors border border-slate-700"
        >
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-blue-400" />
            <h4 className="text-lg font-semibold text-white">AI-Driven Attribution</h4>
          </div>
          {expandedSections.attribution ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>
        {expandedSections.attribution && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mt-2 p-4 rounded-xl bg-slate-800/30 border border-slate-700"
          >
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-semibold text-slate-300 mb-2">Malware Family</h5>
                <p className="text-white">{report.attribution.family}</p>
              </div>
              <div>
                <h5 className="text-sm font-semibold text-slate-300 mb-2">Threat Actor</h5>
                <p className="text-white">{report.attribution.actor}</p>
              </div>
              <div>
                <h5 className="text-sm font-semibold text-slate-300 mb-2">Campaign</h5>
                <p className="text-white">{report.attribution.campaign}</p>
              </div>
              <div>
                <h5 className="text-sm font-semibold text-slate-300 mb-2">Known TTPs (MITRE ATT&CK)</h5>
                <div className="flex flex-wrap gap-2 mt-2">
                  {report.attribution.ttps.map((ttp: string, idx: number) => (
                    <Badge key={idx} className="bg-purple-500/10 text-purple-400">
                      {ttp}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Attack Vector Analysis */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection('attackVector')}
          className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors border border-slate-700"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            <h4 className="text-lg font-semibold text-white">Attack Vector Analysis</h4>
          </div>
          {expandedSections.attackVector ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>
        {expandedSections.attackVector && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mt-2 p-4 rounded-xl bg-slate-800/30 border border-slate-700"
          >
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-semibold text-slate-300 mb-2">Entry Point</h5>
                <p className="text-white">{report.attackVector.entryPoint}</p>
              </div>
              <div>
                <h5 className="text-sm font-semibold text-slate-300 mb-2">Exploitation Method</h5>
                <p className="text-white">{report.attackVector.method}</p>
              </div>
              <div>
                <h5 className="text-sm font-semibold text-slate-300 mb-2">Indicators of Compromise (IoCs)</h5>
                <div className="space-y-2 mt-2">
                  {report.attackVector.iocs.map((ioc: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-900/50 border border-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">{ioc.type}</span>
                        <code className="text-xs text-cyan-400 font-mono">{ioc.value}</code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Timeline */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection('timeline')}
          className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors border border-slate-700"
        >
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h4 className="text-lg font-semibold text-white">Attack Timeline</h4>
          </div>
          {expandedSections.timeline ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>
        {expandedSections.timeline && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mt-2 p-4 rounded-xl bg-slate-800/30 border border-slate-700"
          >
            <div className="space-y-3">
              {report.timeline.map((event: any, idx: number) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    {idx < report.timeline.length - 1 && <div className="w-0.5 h-full bg-slate-700 mt-1" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="text-sm text-slate-400 mb-1">{event.time}</div>
                    <div className="text-white">{event.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Remediation */}
      <div>
        <button
          onClick={() => toggleSection('remediation')}
          className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors border border-slate-700"
        >
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h4 className="text-lg font-semibold text-white">Recommended Remediation</h4>
          </div>
          {expandedSections.remediation ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>
        {expandedSections.remediation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mt-2 p-4 rounded-xl bg-slate-800/30 border border-slate-700"
          >
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-semibold text-slate-300 mb-2">Immediate Actions</h5>
                <ul className="space-y-2">
                  {report.remediation.immediate.map((action: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-white">
                      <span className="text-emerald-400 mt-1">✓</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="text-sm font-semibold text-slate-300 mb-2">Long-term Mitigation</h5>
                <ul className="space-y-2">
                  {report.remediation.longTerm.map((action: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-white">
                      <span className="text-blue-400 mt-1">→</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
