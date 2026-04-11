'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  AlertTriangle, 
  Shield, 
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Server
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const threatLevelConfig = {
  critical: { 
    color: 'text-red-500', 
    bg: 'bg-red-500/10', 
    border: 'border-red-500/30',
    badge: 'bg-red-500/10 text-red-400'
  },
  high: { 
    color: 'text-orange-500', 
    bg: 'bg-orange-500/10', 
    border: 'border-orange-500/30',
    badge: 'bg-orange-500/10 text-orange-400'
  },
  medium: { 
    color: 'text-yellow-500', 
    bg: 'bg-yellow-500/10', 
    border: 'border-yellow-500/30',
    badge: 'bg-yellow-500/10 text-yellow-400'
  },
  safe: { 
    color: 'text-emerald-500', 
    bg: 'bg-emerald-500/10', 
    border: 'border-emerald-500/30',
    badge: 'bg-emerald-500/10 text-emerald-400'
  }
};

export default function ConnectionItem({ connection, onClick }: {connection: any, onClick: (connection: any) => void}) {
  const threat = threatLevelConfig[connection.threatLevel as keyof typeof threatLevelConfig] || threatLevelConfig.safe;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.01 }}
      onClick={() => onClick && onClick(connection)}
      className={`p-4 rounded-xl border ${threat.border} ${threat.bg} backdrop-blur-sm cursor-pointer transition-all hover:shadow-lg`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-lg ${threat.bg} border ${threat.border} flex items-center justify-center flex-shrink-0`}>
          {connection.threatLevel === 'safe' ? (
            <Shield className={`w-5 h-5 ${threat.color}`} />
          ) : (
            <AlertTriangle className={`w-5 h-5 ${threat.color}`} />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-semibold flex items-center gap-2">
                {connection.domain}
                {connection.country && (
                  <span className="text-xs text-slate-500">
                    ({connection.country})
                  </span>
                )}
              </h4>
              <p className="text-sm text-slate-400 mt-1 font-mono">{connection.ip}</p>
            </div>
            <Badge className={threat.badge}>
              {connection.threatLevel.toUpperCase()}
            </Badge>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-xs">
            <div className="flex items-center gap-2">
              <Server className="w-3 h-3 text-slate-500" />
              <span className="text-slate-400">{connection.protocol}</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-3 h-3 text-slate-500" />
              <span className="text-slate-400">{connection.port}</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowDownRight className="w-3 h-3 text-blue-400" />
              <span className="text-slate-400">{connection.bytesIn}</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpRight className="w-3 h-3 text-cyan-400" />
              <span className="text-slate-400">{connection.bytesOut}</span>
            </div>
          </div>

          {/* Threat Description */}
          {connection.threatDescription && (
            <div className={`mt-3 p-2 rounded-lg ${threat.bg} border ${threat.border}`}>
              <p className="text-sm text-slate-300">{connection.threatDescription}</p>
            </div>
          )}

          {/* Tags */}
          {connection.tags && connection.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {connection.tags.map((tag: string, index: number) => (
                <span 
                  key={index}
                  className="px-2 py-1 rounded-md bg-slate-800/50 text-slate-400 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
