'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Shield, 
  Clock, 
  CheckCircle2,
  XCircle,
  FileWarning
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Threat = {
  id: number;
  name: string;
  path: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'blocked' | 'quarantined' | 'monitoring';
  type: string;
  timestamp: string;
  description: string;
};

type ThreatItemProps = {
  threat: Threat;
  onAction?: (threat: Threat, action: string) => void;
};

const severityConfig = {
  critical: { 
    color: 'text-red-500', 
    bg: 'bg-red-500/10', 
    border: 'border-red-500/30',
    icon: XCircle 
  },
  high: { 
    color: 'text-orange-500', 
    bg: 'bg-orange-500/10', 
    border: 'border-orange-500/30',
    icon: AlertTriangle 
  },
  medium: { 
    color: 'text-yellow-500', 
    bg: 'bg-yellow-500/10', 
    border: 'border-yellow-500/30',
    icon: FileWarning 
  },
  low: { 
    color: 'text-blue-500', 
    bg: 'bg-blue-500/10', 
    border: 'border-blue-500/30',
    icon: Shield 
  }
};

const statusConfig = {
  blocked: { text: 'Blocked', color: 'bg-emerald-500/10 text-emerald-400', icon: CheckCircle2 },
  quarantined: { text: 'Quarantined', color: 'bg-blue-500/10 text-blue-400', icon: Shield },
  monitoring: { text: 'Monitoring', color: 'bg-yellow-500/10 text-yellow-400', icon: Clock },
};

export default function ThreatItem({ threat, onAction }: ThreatItemProps) {
  const severity = severityConfig[threat.severity] || severityConfig.medium;
  const status = statusConfig[threat.status] || statusConfig.blocked;
  const SeverityIcon = severity.icon;
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={`p-4 rounded-xl border ${severity.border} ${severity.bg} backdrop-blur-sm`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-lg ${severity.bg} border ${severity.border} flex items-center justify-center flex-shrink-0`}>
          <SeverityIcon className={`w-5 h-5 ${severity.color}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h4 className="text-white font-semibold">{threat.name}</h4>
              <p className="text-sm text-slate-400 mt-1">{threat.path}</p>
            </div>
            <Badge className={status.color}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {status.text}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {threat.timestamp}
            </span>
            <span>Type: {threat.type}</span>
            <span className={severity.color}>Severity: {threat.severity.toUpperCase()}</span>
          </div>

          {threat.description && (
            <p className="text-sm text-slate-400 mb-3">{threat.description}</p>
          )}

          {/* Actions */}
          {onAction && (
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                className="text-xs"
                onClick={() => onAction(threat, 'details')}
              >
                View Details
              </Button>
              {threat.status === 'quarantined' && (
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-xs text-red-400 border-red-500/30 hover:bg-red-500/10"
                  onClick={() => onAction(threat, 'delete')}
                >
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
