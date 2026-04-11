'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Shield, 
  Network, 
  Clock, 
  Fingerprint, 
  RefreshCw,
  Eye,
  Lock,
  Cpu
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Behavioral DNA Profiling',
    description: 'Zero-signature detection through behavioral patterns. Identifies never-seen malware by analyzing process fingerprints and API call sequences.',
    color: 'from-blue-500 to-cyan-500',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-400'
  },
  {
    icon: Eye,
    title: 'Predictive Attack Simulation',
    description: 'Simulates 10-30 seconds ahead to predict attack outcomes. Pre-conviction blocking stops malware before execution completes.',
    color: 'from-purple-500 to-pink-500',
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-400'
  },
  {
    icon: Shield,
    title: 'AI Memory Shield',
    description: 'Real-time integrity monitoring prevents DLL injection, process hollowing, and buffer overflow attacks with continuous validation.',
    color: 'from-emerald-500 to-teal-500',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-400'
  },
  {
    icon: Network,
    title: 'Autonomous Network Defense',
    description: 'Intelligent traffic learning identifies C2 beaconing, DNS tunneling, and data exfiltration with auto-generated firewall rules.',
    color: 'from-orange-500 to-amber-500',
    iconBg: 'bg-orange-500/10',
    iconColor: 'text-orange-400'
  },
  {
    icon: RefreshCw,
    title: 'Self-Healing OS Layer',
    description: 'Automatic registry rollback, file integrity restoration, and permission normalization without user intervention.',
    color: 'from-cyan-500 to-blue-500',
    iconBg: 'bg-cyan-500/10',
    iconColor: 'text-cyan-400'
  },
  {
    icon: Clock,
    title: 'Anti-Ransomware Time Freeze',
    description: 'Instant system lockdown on encryption detection. File system freezing and rollback capability to pre-attack state.',
    color: 'from-red-500 to-rose-500',
    iconBg: 'bg-red-500/10',
    iconColor: 'text-red-400'
  },
  {
    icon: Fingerprint,
    title: 'AI Attack Attribution',
    description: 'Threat actor profiling identifies ransomware gangs and APT groups with confidence scoring and forensic reporting.',
    color: 'from-violet-500 to-purple-500',
    iconBg: 'bg-violet-500/10',
    iconColor: 'text-violet-400'
  },
  {
    icon: Lock,
    title: 'Privacy-First Design',
    description: 'All AI processing occurs locally on-device. Zero-trust architecture with transparent data collection policies.',
    color: 'from-slate-400 to-slate-500',
    iconBg: 'bg-slate-500/10',
    iconColor: 'text-slate-400'
  },
  {
    icon: Cpu,
    title: 'Hardware Integration',
    description: 'TPM 2.0 support with secure enclave operations. BIOS protection and kernel integrity validation at boot.',
    color: 'from-teal-500 to-emerald-500',
    iconBg: 'bg-teal-500/10',
    iconColor: 'text-teal-400'
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.05),transparent_70%)]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-blue-400 text-sm font-semibold tracking-wider uppercase mb-4 block">
            Enterprise-Grade Security
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Autonomous Protection,{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Zero Compromise
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Nine layers of AI-powered defense working in concert to predict, prevent, 
            and neutralize threats before they can cause harm.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group relative"
            >
              <div className="h-full p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 hover:border-slate-700/50 transition-all duration-300 hover:bg-slate-900/80">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover gradient */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
