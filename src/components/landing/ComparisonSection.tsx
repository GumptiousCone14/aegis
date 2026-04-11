'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Minus } from 'lucide-react';

const comparisonData = [
  { feature: 'Known Malware Detection', traditional: '95-99%', aegis: '99.9%', improvement: '+0.9%' },
  { feature: 'Zero-Day Attacks', traditional: '10-30%', aegis: '94%', improvement: '+64-84%' },
  { feature: 'Fileless Malware', traditional: '5-15%', aegis: '97%', improvement: '+82-92%' },
  { feature: 'Ransomware Prevention', traditional: '85-95%', aegis: '99.7%', improvement: '+4.7-14.7%' },
  { feature: 'APT Attack Detection', traditional: '20-40%', aegis: '91%', improvement: '+51-71%' },
  { feature: 'CPU Overhead', traditional: '5-15%', aegis: '<2%', improvement: '-80%' },
  { feature: 'Memory Usage', traditional: '100-500MB', aegis: '45MB', improvement: '-90%' },
  { feature: 'False Positive Rate', traditional: '0.1-1.0%', aegis: '0.001%', improvement: '-99%' },
];

const featureComparison = [
  { feature: 'Behavioral Analysis', traditional: true, aegis: true },
  { feature: 'Intent-Based Detection', traditional: false, aegis: true },
  { feature: 'Predictive Prevention', traditional: false, aegis: true },
  { feature: 'Self-Healing', traditional: false, aegis: true },
  { feature: 'Local AI Processing', traditional: false, aegis: true },
  { feature: 'Attack Attribution', traditional: 'partial', aegis: true },
];

export default function ComparisonSection() {
  return (
    <section id="comparison" className="relative py-24 bg-slate-950">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-emerald-400 text-sm font-semibold tracking-wider uppercase mb-4 block">
            The Clear Difference
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Traditional AV vs{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Aegis Security
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            See how our AI-powered approach dramatically outperforms traditional 
            signature-based antivirus solutions.
          </p>
        </motion.div>

        {/* Metrics comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="py-4 px-6 text-left text-slate-400 font-medium">Metric</th>
                  <th className="py-4 px-6 text-center text-slate-400 font-medium">Traditional AV</th>
                  <th className="py-4 px-6 text-center text-white font-medium bg-blue-500/10 rounded-t-xl">Aegis Security</th>
                  <th className="py-4 px-6 text-center text-emerald-400 font-medium">Improvement</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr 
                    key={row.feature} 
                    className="border-b border-slate-800/50 hover:bg-slate-900/50 transition-colors"
                  >
                    <td className="py-4 px-6 text-white font-medium">{row.feature}</td>
                    <td className="py-4 px-6 text-center text-slate-400">{row.traditional}</td>
                    <td className="py-4 px-6 text-center text-white font-semibold bg-blue-500/5">{row.aegis}</td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium">
                        {row.improvement}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Feature comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* Traditional AV */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
            <h3 className="text-xl font-semibold text-slate-400 mb-6">Traditional Antivirus</h3>
            <ul className="space-y-4">
              {featureComparison.map((item) => (
                <li key={item.feature} className="flex items-center gap-3">
                  {item.traditional === true ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-emerald-400" />
                    </div>
                  ) : item.traditional === 'partial' ? (
                    <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <Minus className="w-4 h-4 text-yellow-400" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                      <X className="w-4 h-4 text-red-400" />
                    </div>
                  )}
                  <span className="text-slate-400">{item.feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Aegis Security */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              Aegis Security
              <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">Recommended</span>
            </h3>
            <ul className="space-y-4">
              {featureComparison.map((item) => (
                <li key={item.feature} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-white">{item.feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
