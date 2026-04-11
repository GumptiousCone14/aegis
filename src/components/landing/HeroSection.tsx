'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Brain, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      {/* Animated orbs */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-sm text-blue-300 font-medium">Now with Advanced AI Threat Prevention</span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
        >
          <span className="text-white">Security That</span>
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Thinks Ahead
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          Traditional antivirus is reactive. Aegis Security is autonomous and predictive—
          it understands intent, not just files. Protect your systems before threats materialize.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href="/dashboard">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:scale-105"
            >
              Start Free Trial
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Button 
            size="lg" 
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-800/50 px-8 py-6 text-lg rounded-xl"
          >
            <Play className="mr-2 h-5 w-5" />
            Watch Demo
          </Button>
        </motion.div>

        {/* Animated Shield Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative mx-auto w-64 h-64 md:w-80 md:h-80"
        >
          {/* Outer rings */}
          <motion.div 
            className="absolute inset-0 rounded-full border border-blue-500/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute inset-4 rounded-full border border-cyan-500/20"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute inset-8 rounded-full border border-blue-500/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Center shield */}
          <div className="absolute inset-12 flex items-center justify-center">
            <motion.div
              animate={{ 
                boxShadow: [
                  '0 0 40px rgba(59,130,246,0.3)',
                  '0 0 80px rgba(59,130,246,0.5)',
                  '0 0 40px rgba(59,130,246,0.3)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-full h-full rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 flex items-center justify-center"
            >
              <Shield className="w-20 h-20 md:w-24 md:h-24 text-blue-400" strokeWidth={1.5} />
            </motion.div>
          </div>

          {/* Floating icons */}
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-4 right-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700/50"
          >
            <Brain className="w-6 h-6 text-cyan-400" />
          </motion.div>
          <motion.div
            animate={{ y: [5, -5, 5] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute bottom-4 left-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700/50"
          >
            <Zap className="w-6 h-6 text-yellow-400" />
          </motion.div>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 pt-8 border-t border-slate-800"
        >
          <p className="text-sm text-slate-500 mb-6">Trusted by security teams at</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-50">
            {['Microsoft', 'Google', 'Amazon', 'Meta', 'Netflix'].map((company) => (
              <span key={company} className="text-slate-400 text-lg font-semibold tracking-wider">
                {company}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
