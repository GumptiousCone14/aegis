'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  AlertTriangle, 
  Shield, 
  MapPin,
  Clock,
  Server,
  Activity,
  Brain,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ThreatDetailModal({ connection, onClose }: {connection: any, onClose: () => void}) {
  if (!connection) return null;

  const threatColors: {[key: string]: string} = {
    critical: 'text-red-400',
    high: 'text-orange-400',
    medium: 'text-yellow-400',
    safe: 'text-emerald-400'
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-auto bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl"
        >
          {/* Header */}
          <div className={`sticky top-0 z-10 p-6 bg-slate-900 border-b border-slate-800 flex items-start justify-between`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl bg-${connection.threatLevel === 'safe' ? 'emerald' : 'red'}-500/10 border border-${connection.threatLevel === 'safe' ? 'emerald' : 'red'}-500/30 flex items-center justify-center`}>
                {connection.threatLevel === 'safe' ? (
                  <Shield className={`w-6 h-6 ${threatColors[connection.threatLevel]}`} />
                ) : (
                  <AlertTriangle className={`w-6 h-6 ${threatColors[connection.threatLevel]}`} />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{connection.domain}</h2>
                <p className="text-slate-400 font-mono">{connection.ip}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Threat Level */}
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold">Threat Assessment</h3>
                <Badge className={`bg-${connection.threatLevel === 'safe' ? 'emerald' : 'red'}-500/10 text-${connection.threatLevel === 'safe' ? 'emerald' : 'red'}-400`}>
                  {connection.threatLevel.toUpperCase()}
                </Badge>
              </div>
              {connection.threatDescription && (
                <p className="text-slate-300 text-sm leading-relaxed">{connection.threatDescription}</p>
              )}
            </div>

            {/* AI Analysis */}
            {connection.aiAnalysis && (
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-5 h-5 text-blue-400" />
                  <h3 className="text-white font-semibold">AI Behavioral Analysis</h3>
                </div>
                <div className="space-y-2 text-sm">
                  {connection.aiAnalysis.indicators.map((indicator: any, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      {indicator.detected ? (
                        <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      )}
                      <span className="text-slate-300">{indicator.text}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-lg bg-slate-900/50">
                  <div className="text-xs text-slate-400 mb-1">Confidence Score</div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${connection.aiAnalysis.confidence}%` }}
                        className={`h-full bg-gradient-to-r ${
                          connection.aiAnalysis.confidence > 80 
                            ? 'from-red-500 to-rose-500' 
                            : connection.aiAnalysis.confidence > 50
                            ? 'from-yellow-500 to-orange-500'
                            : 'from-emerald-500 to-teal-500'
                        }`}
                      />
                    </div>
                    <span className="text-white font-semibold">{connection.aiAnalysis.confidence}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Connection Details */}
            <div>
              <h3 className="text-white font-semibold mb-3">Connection Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                    <Server className="w-4 h-4" />
                    <span>Protocol</span>
                  </div>
                  <div className="text-white font-semibold">{connection.protocol}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                    <Activity className="w-4 h-4" />
                    <span>Port</span>
                  </div>
                  <div className="text-white font-semibold">{connection.port}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                    <MapPin className="w-4 h-4" />
                    <span>Location</span>
                  </div>
                  <div className="text-white font-semibold">{connection.country || 'Unknown'}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                    <Clock className="w-4 h-4" />
                    <span>Duration</span>
                  </div>
                  <div className="text-white font-semibold">{connection.duration}</div>
                </div>
              </div>
            </div>

            {/* Traffic Stats */}
            <div>
              <h3 className="text-white font-semibold mb-3">Traffic Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <div className="text-sm text-slate-400 mb-1">Data Received</div>
                  <div className="text-2xl font-bold text-blue-400">{connection.bytesIn}</div>
                </div>
                <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                  <div className="text-sm text-slate-400 mb-1">Data Sent</div>
                  <div className="text-2xl font-bold text-cyan-400">{connection.bytesOut}</div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {connection.tags && connection.tags.length > 0 && (
              <div>
                <h3 className="text-white font-semibold mb-3">Threat Indicators</h3>
                <div className="flex flex-wrap gap-2">
                  {connection.tags.map((tag: string, index: number) => (
                    <span 
                      key={index}
                      className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-sm border border-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-slate-800">
              <Button 
                variant="outline" 
                className="flex-1 border-slate-700"
                onClick={onClose}
              >
                Close
              </Button>
              {connection.threatLevel !== 'safe' && (
                <>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    Block Connection
                  </Button>
                  <Button 
                    className="flex-1 bg-blue-600 hover:bg-blue-500"
                  >
                    Add to Firewall
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
