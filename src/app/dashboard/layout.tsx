"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Shield, 
  LayoutDashboard, 
  Search, 
  AlertTriangle, 
  Settings,
  ChevronRight,
  User,
  Activity,
  Bell,
  FileSearch
} from 'lucide-react';
import { Logo } from '@/components/icons/logo';

import ProtectionStatus from '@/components/app/ProtectionStatus';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Scan', icon: Search, href: '/dashboard/scan' },
    { name: 'Threats', icon: AlertTriangle, href: '/dashboard/threats' },
    { name: 'Network', icon: Activity, href: '/dashboard/network' },
    { name: 'Forensics', icon: FileSearch, href: '/dashboard/forensics' },
    { name: 'Alerts', icon: Bell, href: '/dashboard/alerts' },
    { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col sticky top-0 h-screen hidden md:flex">
        {/* Logo */}
        <div className="p-6 border-b border-slate-800 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
              <Logo className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-bold">Aegis Security</div>
              <div className="text-xs text-slate-400">v1.0.0</div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto scrollbar-hide">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-slate-800 shrink-0">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white font-semibold truncate uppercase tracking-wider text-[10px]">Matthew</div>
              <div className="text-[10px] text-slate-500 truncate lowercase">matthew@aegis.ai</div>
              <div className="text-xs text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Protected
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <ProtectionStatus />
        <div className="p-0">
          {children}
        </div>
      </main>
    </div>
  );
}
