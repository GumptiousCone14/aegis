
import React from 'react';
import Link from 'next/link';
import { Shield, Twitter, Linkedin, Github, Mail } from 'lucide-react';

const footerLinks = {
  Product: ['Features', 'Pricing', 'Enterprise', 'Security', 'Roadmap'],
  Resources: ['Documentation', 'API Reference', 'Community', 'Blog', 'Status'],
  Company: ['About', 'Careers', 'Press', 'Partners', 'Contact'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR', 'Compliance']
};

const linkToUrlMap: { [key: string]: string } = {
  'Features': '/features',
  'Pricing': '/pricing',
  'Enterprise': '/enterprise',
  'Security': '/security',
  'Roadmap': '/roadmap',
  'Documentation': '/docs',
  'API Reference': '/docs',
  'Community': '/community',
  'Blog': '/blog',
  'Status': '/status',
  'About': '/about',
  'Careers': '/careers',
  'Press': '/press',
  'Partners': '/partners',
  'Contact': '/contact',
  'Privacy Policy': '/privacy',
  'Terms of Service': '/terms',
  'Cookie Policy': '/cookies',
  'GDPR': '/gdpr',
  'Compliance': '/compliance'
};

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Aegis Security</span>
            </div>
            <p className="text-slate-400 text-sm mb-6 max-w-xs">
              Revolutionary AI-powered security. Prevention through prediction. 
              Transforming cybersecurity from reactive defense to predictive prevention.
            </p>
            {/* Social links */}
            <div className="flex gap-4">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a 
                  key={i}
                  href="#" 
                  className="w-10 h-10 rounded-lg bg-slate-800/50 hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <Link 
                      href={linkToUrlMap[link] || '#'}
                      className="text-slate-400 hover:text-white text-sm transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="py-8 border-y border-slate-800 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-white font-semibold mb-1">Stay updated</h4>
              <p className="text-slate-400 text-sm">Get the latest security insights delivered to your inbox.</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Aegis Security. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/status" className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>All systems operational</span>
            </Link>
            <span>SOC 2 Type II</span>
            <span>ISO 27001</span>
            <span>GDPR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
