'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Shield, 
  Network,
  FileWarning,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const typeIcons = {
  file: FileWarning,
  network: Network,
  system: Shield,
};

const severityConfig = {
  critical: { 
    color: 'text-red-400', 
    bg: 'bg-red-500/10', 
    border: 'border-red-500/30',
    badge: 'bg-red-500/10 text-red-400'
  },
  high: { 
    color: 'text-orange-400', 
    bg: 'bg-orange-500/10', 
    border: 'border-orange-500/30',
    badge: 'bg-orange-500/10 text-orange-400'
  },
  medium: { 
    color: 'text-yellow-400', 
    bg: 'bg-yellow-500/10', 
    border: 'border-yellow-500/30',
    badge: 'bg-yellow-500/10 text-yellow-400'
  },
  low: { 
    color: 'text-blue-400', 
    bg: 'bg-blue-500/10', 
    border: 'border-blue-500/30',
    badge: 'bg-blue-500/10 text-blue-400'
  }
};

const statusConfig = {
  active: { icon: AlertTriangle, text: 'Active', color: 'text-red-400' },
  resolved: { icon: CheckCircle2, text: 'Resolved', color: 'text-emerald-400' },
  dismissed: { icon: XCircle, text: 'Dismissed', color: 'text-slate-400' },
};

export default function AlertItem({ alert, onAction }: {alert: any, onAction: (alert: any, action: string) => void}) {
  const severity = severityConfig[alert.severity as keyof typeof severityConfig] || severityConfig.medium;
  const status = statusConfig[alert.status as keyof typeof statusConfig] || statusConfig.active;
  const TypeIcon = typeIcons[alert.type as keyof typeof typeIcons] || AlertTriangle;
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl border ${severity.border} ${severity.bg} backdrop-blur-sm`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-lg ${severity.bg} border ${severity.border} flex items-center justify-center flex-shrink-0`}>
          <TypeIcon className={`w-5 h-5 ${severity.color}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1">
              <h4 className="text-white font-semibold">{alert.title}</h4>
              <p className="text-sm text-slate-400 mt-1">{alert.message}</p>
            </div>
            <div className="flex gap-2">
              <Badge className={severity.badge}>
                {alert.severity.toUpperCase()}
              </Badge>
              <Badge className="bg-slate-800 text-slate-300 flex items-center gap-1">
                <StatusIcon className="w-3 h-3" />
                {status.text}
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {alert.timestamp}
            </span>
            <span>Type: {alert.type}</span>
            {alert.aiConfidence && (
              <span>AI Confidence: {alert.aiConfidence}%</span>
            )}
          </div>

          {alert.details && (
            <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700 mb-3">
              <p className="text-sm text-slate-300">{alert.details}</p>
            </div>
          )}

          {onAction && alert.status === 'active' && (
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                className="text-xs"
                onClick={() => onAction(alert, 'view')}
              >
                View Details
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="text-xs"
                onClick={() => onAction(alert, 'resolve')}
              >
                Mark Resolved
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="text-xs text-slate-400"
                onClick={() => onAction(alert, 'dismiss')}
              >
                Dismiss
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
