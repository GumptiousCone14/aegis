'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Layers, Globe, Cpu, Activity } from 'lucide-react';

const layers = [
  {
    icon: Globe,
    name: 'Meta-AI Layer',
    description: 'Learns attacker strategies & tactics',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30'
  },
  {
    icon: Layers,
    name: 'System AI Layer',
    description: 'OS-wide behavior analysis & correlation',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30'
  },
  {
    icon: Cpu,
    name: 'Micro-AI Layer',
    description: 'Per-process analysis & containment',
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30'
  },
  {
    icon: Activity,
    name: 'Network AI Layer',
    description: 'Traffic analysis & threat detection',
    color: 'from-orange-500 to-amber-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30'
  }
];

export default function ArchitectureSection() {
  return (
    <section id="architecture" className="relative py-24 bg-slate-900 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-cyan-400 text-sm font-semibold tracking-wider uppercase mb-4 block">
              Multi-Layer Intelligence
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Four AI Layers,{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                One Shield
              </span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Our revolutionary multi-layer AI architecture provides defense-in-depth, 
              where each layer specializes in a different aspect of threat detection and 
              prevention. Together, they form an impenetrable security mesh.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-400 font-bold">1</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Local Processing</h4>
                  <p className="text-slate-400 text-sm">All AI analysis occurs on-device, ensuring your data never leaves your system.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-cyan-400 font-bold">2</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Federated Learning</h4>
                  <p className="text-slate-400 text-sm">Anonymous threat intelligence sharing improves global protection without compromising privacy.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-emerald-400 font-bold">3</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Zero Trust</h4>
                  <p className="text-slate-400 text-sm">Nothing is trusted by default. Every process, connection, and file is verified continuously.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Architecture diagram */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="space-y-4">
              {layers.map((layer, index) => (
                <motion.div
                  key={layer.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className={`p-5 rounded-2xl ${layer.bgColor} border ${layer.borderColor} backdrop-blur-sm`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${layer.color} flex items-center justify-center`}>
                        <layer.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{layer.name}</h4>
                        <p className="text-slate-400 text-sm">{layer.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Connector arrow */}
                  {index < layers.length - 1 && (
                    <div className="flex justify-center py-2">
                      <ArrowDown className="w-5 h-5 text-slate-600" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Side decoration */}
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-gradient-to-b from-purple-500 via-blue-500 to-orange-500 rounded-full opacity-30" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
