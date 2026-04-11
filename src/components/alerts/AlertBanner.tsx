'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  X, 
  Shield,
  Bell,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type AlertAction = {
    label: string;
    primary?: boolean;
    onClick: (alert: Alert) => void;
  };
  
  type Alert = {
    id: number | string;
    severity: 'critical' | 'high' | 'medium' | 'info';
    title: string;
    message: string;
    dismissed: boolean;
    actions?: AlertAction[];
  };
  
  type AlertBannerProps = {
    alerts?: Alert[];
    onDismiss?: (alertId: number | string) => void;
    onViewDetails?: (alert: Alert) => void;
  };


const severityConfig = {
  critical: {
    bg: 'bg-red-500/10',
    border: 'border-red-500',
    icon: AlertTriangle,
    iconColor: 'text-red-400',
    textColor: 'text-red-400'
  },
  high: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500',
    icon: AlertTriangle,
    iconColor: 'text-orange-400',
    textColor: 'text-orange-400'
  },
  medium: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500',
    icon: Bell,
    iconColor: 'text-yellow-400',
    textColor: 'text-yellow-400'
  },
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500',
    icon: Info,
    iconColor: 'text-blue-400',
    textColor: 'text-blue-400'
  }
};

export default function AlertBanner({ alerts = [], onDismiss, onViewDetails }: AlertBannerProps) {
  const [visibleAlerts, setVisibleAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    setVisibleAlerts(alerts.filter(a => !a.dismissed));
  }, [alerts]);

  const handleDismiss = (alertId: number | string) => {
    setVisibleAlerts(prev => prev.filter(a => a.id !== alertId));
    if (onDismiss) onDismiss(alertId);
  };

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md">
      <AnimatePresence>
        {visibleAlerts.slice(0, 3).map((alert) => {
          const config = severityConfig[alert.severity] || severityConfig.info;
          const Icon = config.icon;

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              className={`p-4 rounded-xl ${config.bg} border-2 ${config.border} backdrop-blur-xl shadow-2xl`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg ${config.bg} border ${config.border} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${config.iconColor}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={`font-semibold ${config.textColor}`}>{alert.title}</h4>
                    <button
                      onClick={() => handleDismiss(alert.id)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-slate-300 mt-1">{alert.message}</p>
                  
                  {alert.actions && (
                    <div className="flex gap-2 mt-3">
                      {alert.actions.map((action, idx) => (
                        <Button
                          key={idx}
                          size="sm"
                          variant={action.primary ? "default" : "outline"}
                          onClick={() => action.onClick(alert)}
                          className="text-xs"
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      
      {visibleAlerts.length > 3 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-center text-sm text-slate-400"
        >
          +{visibleAlerts.length - 3} more alerts
        </motion.div>
      )}
    </div>
  );
}
