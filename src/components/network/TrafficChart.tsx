'use client';

import React from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-slate-400 text-xs mb-2">{payload[0].payload.time}</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-white text-sm">Inbound: {payload[0].value} MB/s</span>
            </div>
            {payload[1] && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-500" />
                <span className="text-white text-sm">Outbound: {payload[1].value} MB/s</span>
              </div>
            )}
            {payload[0].payload.suspicious > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-red-400 text-sm">Threats: {payload[0].payload.suspicious}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

export default function TrafficChart({ data, type = 'line' }: {data: any[], type?: 'line' | 'area'}) {
  if (type === 'area') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorOutbound" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: 12 }} />
          <YAxis stroke="#64748b" style={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="inbound" 
            stroke="#3b82f6" 
            fillOpacity={1} 
            fill="url(#colorInbound)"
            strokeWidth={2}
          />
          <Area 
            type="monotone" 
            dataKey="outbound" 
            stroke="#06b6d4" 
            fillOpacity={1} 
            fill="url(#colorOutbound)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: 12 }} />
        <YAxis stroke="#64748b" style={{ fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="inbound" 
          stroke="#3b82f6" 
          strokeWidth={2}
          dot={false}
        />
        <Line 
          type="monotone" 
          dataKey="outbound" 
          stroke="#06b6d4" 
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
