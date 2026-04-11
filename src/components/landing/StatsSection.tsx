'use client';
import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { value: '99.9%', label: 'Malware Detection', suffix: '' },
  { value: '94', label: 'Zero-Day Prevention', suffix: '%' },
  { value: '<2', label: 'CPU Overhead', suffix: '%' },
  { value: '0.001', label: 'False Positive Rate', suffix: '%' },
];

export default function StatsSection() {
  return (
    <section className="relative py-20 bg-slate-900">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-transparent h-32" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-2">
                {stat.value}{stat.suffix}
              </div>
              <div className="text-slate-400 text-sm md:text-base">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
