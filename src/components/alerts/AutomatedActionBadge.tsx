'use client';
import React from 'react';
import { Shield, Zap, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AutomatedActionBadge({ action, status = 'active' }: { action: any, status?: string}) {
  if (!action) return null;

  const statusConfig = {
    active: {
      icon: Zap,
      text: 'Auto-Protected',
      className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    },
    pending: {
      icon: Clock,
      text: 'Pending Confirmation',
      className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
    },
    blocked: {
      icon: Shield,
      text: 'Auto-Blocked',
      className: 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
  const Icon = config.icon;

  return (
    <Badge className={`${config.className} border`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.text}
    </Badge>
  );
}
