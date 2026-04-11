'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Building2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';

const plans = [
  {
    name: 'Personal',
    icon: Shield,
    description: 'Perfect for individual users and home devices',
    monthlyPrice: 9,
    yearlyPrice: 89,
    features: [
      'AI-powered threat detection',
      'Real-time protection',
      'Ransomware shield',
      'Up to 3 devices',
      'Email support',
      'Basic reporting'
    ],
    color: 'from-slate-500 to-slate-600',
    buttonVariant: 'outline' as 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | null | undefined
  },
  {
    name: 'Professional',
    icon: Zap,
    description: 'For power users and small businesses',
    monthlyPrice: 19,
    yearlyPrice: 189,
    popular: true,
    features: [
      'Everything in Personal, plus:',
      'Behavioral DNA profiling',
      'Predictive attack simulation',
      'Self-healing OS layer',
      'Up to 10 devices',
      'Priority support',
      'Advanced analytics',
      'API access'
    ],
    color: 'from-blue-500 to-cyan-500',
    buttonVariant: 'default' as 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | null | undefined
  },
  {
    name: 'Enterprise',
    icon: Building2,
    description: 'For organizations requiring complete control',
    monthlyPrice: 49,
    yearlyPrice: 490,
    features: [
      'Everything in Professional, plus:',
      'Unlimited devices',
      'Attack attribution',
      'SIEM integration',
      'Centralized management',
      'Custom policies',
      'Dedicated support',
      'Compliance reporting',
      'On-premise option'
    ],
    color: 'from-purple-500 to-pink-500',
    buttonVariant: 'outline' as 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | null | undefined
  }
];

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <section id="pricing" className="relative py-24 bg-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.05),transparent_50%)]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-blue-400 text-sm font-semibold tracking-wider uppercase mb-4 block">
            Simple Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Protection Level
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
            Start with a 14-day free trial. No credit card required.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm ${!isYearly ? 'text-white' : 'text-slate-400'}`}>Monthly</span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-blue-600"
            />
            <span className={`text-sm ${isYearly ? 'text-white' : 'text-slate-400'}`}>
              Yearly
              <span className="ml-2 px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                Save 20%
              </span>
            </span>
          </div>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl ${
                plan.popular 
                  ? 'bg-gradient-to-b from-blue-500/20 to-cyan-500/10 border-2 border-blue-500/50' 
                  : 'bg-slate-800/50 border border-slate-700/50'
              } p-8`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="text-center mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${plan.color} flex items-center justify-center mx-auto mb-4`}>
                  <plan.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-sm">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-white">
                    ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-slate-400">/{isYearly ? 'year' : 'month'}</span>
                </div>
                {isYearly && (
                  <p className="text-sm text-slate-500 mt-1">
                    Billed annually (${Math.round(plan.yearlyPrice / 12)}/month)
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-emerald-400" />
                    </div>
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link href="/dashboard" className="block">
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white' 
                      : ''
                  }`}
                  variant={plan.buttonVariant}
                  size="lg"
                >
                  Start Free Trial
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Enterprise note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-slate-500 text-sm mt-8"
        >
          Need custom pricing for large deployments?{' '}
          <a href="#" className="text-blue-400 hover:text-blue-300 underline">
            Contact our sales team
          </a>
        </motion.p>
      </div>
    </section>
  );
}
