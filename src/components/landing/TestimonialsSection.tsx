'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    content: "Aegis Security detected and blocked a zero-day ransomware attack that bypassed our previous enterprise AV. The predictive capabilities are game-changing.",
    author: "Sarah Chen",
    role: "CISO, TechCorp Global",
    avatar: "SC",
    rating: 5
  },
  {
    content: "We reduced false positives by 99% after switching. Our SOC team can finally focus on real threats instead of chasing phantom alerts.",
    author: "Michael Torres",
    role: "Security Director, FinanceHub",
    avatar: "MT",
    rating: 5
  },
  {
    content: "The self-healing feature saved us during a supply chain attack. Aegis automatically rolled back the compromised files before we even knew there was an issue.",
    author: "Emily Watson",
    role: "IT Manager, Healthcare Plus",
    avatar: "EW",
    rating: 5
  }
];

const awards = [
  { name: 'Cybersecurity Innovation', year: '2024' },
  { name: 'Privacy by Design Cert', year: '2024' },
  { name: 'Enterprise Excellence', year: '2024' },
  { name: 'AI Security Leader', year: '2024' }
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative py-24 bg-slate-950 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(6,182,212,0.05),transparent_50%)]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 text-sm font-semibold tracking-wider uppercase mb-4 block">
            Trusted by Security Teams
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What Our{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Customers Say
            </span>
          </h2>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 hover:border-slate-700/50 transition-all"
            >
              {/* Quote icon */}
              <Quote className="w-10 h-10 text-blue-500/20 absolute top-4 right-4" />
              
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                ))}
              </div>

              {/* Content */}
              <p className="text-slate-300 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-white font-medium">{testimonial.author}</div>
                  <div className="text-slate-400 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Awards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-slate-500 text-sm mb-6">Awards & Recognition</p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
            {awards.map((award) => (
              <div key={award.name} className="flex items-center gap-2 text-slate-400">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500" />
                <span className="text-sm font-medium">{award.name}</span>
                <span className="text-xs text-slate-500">{award.year}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
