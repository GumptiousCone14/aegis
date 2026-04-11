'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Ban, 
  Archive,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Cpu
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Log = {
    id: string,
    threatName: string,
    description: string,
    timestamp: string,
    actionType: 'quarantine' | 'block' | 'patch' | 'isolate',
    status: 'success' | 'pending' | 'failed' | 'confirmed',
    automated: boolean,
    userConfirmed: boolean,
    aiConfidence: number,
    actions: string[]
};

type ResponseLogProps = {
  logs: Log[];
};

const actionIcons = {
  quarantine: Archive,
  block: Ban,
  patch: Shield,
  isolate: AlertTriangle
};

const statusColors = {
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  failed: 'bg-red-500/10 text-red-400 border-red-500/30',
  confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/30'
};

export default function ResponseLog({ logs }: ResponseLogProps) {
  return (
    <div className="space-y-3">
      {logs.map((log, index) => {
        const ActionIcon = actionIcons[log.actionType] || Shield;
        
        return (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{once: true}}
            transition={{ delay: index * 0.05 }}
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                log.status === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-slate-800 border border-slate-700'
              }`}>
                <ActionIcon className={`w-5 h-5 ${
                  log.status === 'success' ? 'text-emerald-400' : 'text-slate-400'
                }`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-white font-semibold">{log.threatName}</h4>
                  <Badge className={statusColors[log.status]}>
                    {log.status.toUpperCase()}
                  </Badge>
                  {log.automated && (
                    <Badge className="bg-blue-500/10 text-blue-400">
                      <Cpu className="w-3 h-3 mr-1" />
                      AUTO
                    </Badge>
                  )}
                  {log.userConfirmed && (
                    <Badge className="bg-purple-500/10 text-purple-400">
                      <User className="w-3 h-3 mr-1" />
                      CONFIRMED
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-slate-400 mb-2">{log.description}</p>

                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{log.timestamp}</span>
                  </div>
                  <div>Action: {log.actionType.toUpperCase()}</div>
                  <div>Confidence: {log.aiConfidence}%</div>
                </div>

                {log.actions && log.actions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800">
                    <div className="text-xs text-slate-500 mb-1">Actions Taken:</div>
                    <div className="space-y-1">
                      {log.actions.map((action, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span>{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
