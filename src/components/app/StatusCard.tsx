'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

type StatusCardProps = {
  icon: LucideIcon;
  title: string;
  value: string;
  subtitle: string;
  color?: 'blue' | 'emerald' | 'red' | 'purple' | 'amber';
  trend?: {
    positive: boolean;
    value: string;
  };
};

export default function StatusCard({ icon: Icon, title, value, subtitle, color = 'blue', trend }: StatusCardProps) {
  const colorClasses = {
    blue: 'from-blue-600 to-cyan-600',
    emerald: 'from-emerald-600 to-teal-600',
    red: 'from-red-600 to-rose-600',
    purple: 'from-purple-600 to-pink-600',
    amber: 'from-amber-600 to-orange-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{once: true}}
      className="relative p-6 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden group hover:border-slate-700 transition-all"
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-5 group-hover:opacity-10 transition-opacity`} />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && (
            <span className={`text-xs px-2 py-1 rounded-full ${
              trend.positive 
                ? 'bg-emerald-500/10 text-emerald-400' 
                : 'bg-red-500/10 text-red-400'
            }`}>
              {trend.value}
            </span>
          )}
        </div>
        
        <div className="text-sm text-slate-400 mb-1">{title}</div>
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        {subtitle && <div className="text-xs text-slate-500">{subtitle}</div>}
      </div>
    </motion.div>
  );
}
