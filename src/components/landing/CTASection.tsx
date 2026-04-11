'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="relative py-24 bg-slate-900 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-slate-900 to-cyan-600/20" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Icon */}
          <motion.div
            animate={{ 
              boxShadow: [
                '0 0 40px rgba(59,130,246,0.3)',
                '0 0 80px rgba(59,130,246,0.5)',
                '0 0 40px rgba(59,130,246,0.3)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mx-auto mb-8"
          >
            <Shield className="w-10 h-10 text-white" />
          </motion.div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Ready to Secure{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Your Future?
            </span>
          </h2>

          {/* Description */}
          <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
            Join thousands of security teams who have upgraded to predictive protection. 
            Start your free trial today and experience the future of cybersecurity.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
            {['14-day free trial', 'No credit card required', 'Cancel anytime'].map((benefit) => (
              <div key={benefit} className="flex items-center gap-2 text-slate-300">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-emerald-400" />
                </div>
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:scale-105"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800/50 px-8 py-6 text-lg rounded-xl"
            >
              Schedule Demo
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
