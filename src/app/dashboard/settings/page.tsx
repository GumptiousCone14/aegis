'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Bell, 
  Database, 
  Wifi,
  Activity,
  Lock,
  Download,
  Info
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Settings() {
  const [settings, setSettings] = useState({
    realTimeProtection: true,
    autoUpdates: true,
    cloudProtection: true,
    behavioralAnalysis: true,
    ransomwareProtection: true,
    notifications: true,
    scanOnDownload: true,
    quarantineAuto: true,
    cpuUsageLimit: 20,
    scanSchedule: 'daily',
    // Alert settings
    alertInApp: true,
    alertEmail: true,
    alertCriticalOnly: false,
    alertMinConfidence: 80,
    emailDigest: 'daily',
    // Automated Response settings
    autoQuarantine: true,
    autoBlockNetwork: true,
    requireConfirmation: true,
    autoResponseMinConfidence: 90
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const settingsSections = [
    {
      title: 'Protection',
      icon: Shield,
      color: 'from-blue-600 to-cyan-600',
      items: [
        {
          key: 'realTimeProtection',
          label: 'Real-time Protection',
          description: 'Continuously monitor system for threats',
          critical: true
        },
        {
          key: 'behavioralAnalysis',
          label: 'AI Behavioral Analysis',
          description: 'Use AI to detect suspicious behavior patterns'
        },
        {
          key: 'ransomwareProtection',
          label: 'Ransomware Shield',
          description: 'Advanced protection against ransomware attacks'
        },
        {
          key: 'scanOnDownload',
          label: 'Scan Downloads',
          description: 'Automatically scan all downloaded files'
        }
      ]
    },
    {
      title: 'Cloud & Network',
      icon: Wifi,
      color: 'from-purple-600 to-pink-600',
      items: [
        {
          key: 'cloudProtection',
          label: 'Cloud Protection',
          description: 'Use cloud threat intelligence for faster detection'
        },
        {
          key: 'autoUpdates',
          label: 'Automatic Updates',
          description: 'Keep threat definitions up to date automatically'
        }
      ]
    },
    {
      title: 'Alert Settings',
      icon: Bell,
      color: 'from-emerald-600 to-teal-600',
      items: [
        {
          key: 'alertInApp',
          label: 'In-App Alerts',
          description: 'Show real-time banner notifications for threats',
          critical: true
        },
        {
          key: 'alertEmail',
          label: 'Email Alerts',
          description: 'Send email notifications for critical threats'
        },
        {
          key: 'alertCriticalOnly',
          label: 'Critical Threats Only',
          description: 'Only alert for critical and high-severity threats'
        }
      ]
    },
    {
      title: 'Automated Response',
      icon: Shield,
      color: 'from-purple-600 to-pink-600',
      items: [
        {
          key: 'autoQuarantine',
          label: 'Auto-Quarantine Files',
          description: 'Automatically quarantine high-confidence file threats',
          critical: true
        },
        {
          key: 'autoBlockNetwork',
          label: 'Auto-Block Network Threats',
          description: 'Automatically block malicious network connections'
        },
        {
          key: 'requireConfirmation',
          label: 'Require User Confirmation',
          description: 'Ask for approval before executing critical actions'
        }
      ]
    },
    {
      title: 'Quarantine',
      icon: Database,
      color: 'from-orange-600 to-amber-600',
      items: [
        {
          key: 'quarantineAuto',
          label: 'Auto-Quarantine',
          description: 'Automatically quarantine detected threats'
        }
      ]
    }
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Configure your security preferences</p>
      </div>

      {/* Performance Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-6 rounded-2xl bg-slate-900 border border-slate-800"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Performance</h3>
            <p className="text-sm text-slate-400">Adjust system resource usage</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-white font-medium mb-1">CPU Usage Limit</div>
                <div className="text-sm text-slate-400">Maximum CPU usage during scans</div>
              </div>
              <span className="text-2xl font-bold text-white">{settings.cpuUsageLimit}%</span>
            </div>
            <Slider
              value={[settings.cpuUsageLimit]}
              onValueChange={(value) => setSettings(prev => ({ ...prev, cpuUsageLimit: value[0] }))}
              max={100}
              step={5}
              className="w-full"
            />
          </div>
        </div>
      </motion.div>

      {/* AI Alert Thresholds */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-6 rounded-2xl bg-slate-900 border border-slate-800"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Alert Thresholds</h3>
            <p className="text-sm text-slate-400">Configure AI confidence requirements</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-white font-medium mb-1">Minimum AI Confidence</div>
                <div className="text-sm text-slate-400">Only alert when AI confidence exceeds this threshold</div>
              </div>
              <span className="text-2xl font-bold text-white">{settings.alertMinConfidence}%</span>
            </div>
            <Slider
              value={[settings.alertMinConfidence]}
              onValueChange={(value) => setSettings(prev => ({ ...prev, alertMinConfidence: value[0] }))}
              max={100}
              min={50}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>50% (More alerts)</span>
              <span>100% (Fewer, high-confidence alerts)</span>
            </div>
          </div>

          <div>
            <div className="text-white font-medium mb-3">Email Digest Frequency</div>
            <Select value={settings.emailDigest} onValueChange={(value) => setSettings(prev => ({ ...prev, emailDigest: value }))}>
              <SelectTrigger className="bg-slate-800 border-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time (immediate)</SelectItem>
                <SelectItem value="hourly">Hourly summary</SelectItem>
                <SelectItem value="daily">Daily digest</SelectItem>
                <SelectItem value="weekly">Weekly summary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Automated Response Thresholds */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-6 rounded-2xl bg-slate-900 border border-slate-800"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Automated Response Configuration</h3>
            <p className="text-sm text-slate-400">Configure AI-driven threat response automation</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-white font-medium mb-1">Auto-Response AI Confidence Threshold</div>
                <div className="text-sm text-slate-400">Minimum confidence required for automated actions</div>
              </div>
              <span className="text-2xl font-bold text-white">{settings.autoResponseMinConfidence}%</span>
            </div>
            <Slider
              value={[settings.autoResponseMinConfidence]}
              onValueChange={(value) => setSettings(prev => ({ ...prev, autoResponseMinConfidence: value[0] }))}
              max={100}
              min={70}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>70% (More automation)</span>
              <span>100% (Only highest confidence)</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
            <p className="text-sm text-blue-300">
              <strong>Note:</strong> Automated responses will only trigger for threats meeting both the severity (Critical/High) and confidence threshold criteria.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingsSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center`}>
                <section.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{section.title}</h3>
              </div>
            </div>

            <div className="space-y-4">
              {section.items.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium">{item.label}</span>
                      {item.critical && (
                        <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-xs font-medium">
                          Critical
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400">{item.description}</p>
                  </div>
                  <Switch
                    checked={settings[item.key as keyof typeof settings]}
                    onCheckedChange={() => toggleSetting(item.key as keyof typeof settings)}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* System Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 p-6 rounded-2xl bg-slate-900/50 border border-slate-800"
      >
        <div className="flex items-center gap-3 mb-4">
          <Info className="w-5 h-5 text-slate-400" />
          <h3 className="text-lg font-semibold text-white">System Information</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between py-2 border-b border-slate-800">
            <span className="text-slate-400">Version</span>
            <span className="text-white font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-800">
            <span className="text-slate-400">Last Update</span>
            <span className="text-white font-medium">Today, 10:30 AM</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-800">
            <span className="text-slate-400">Database Version</span>
            <span className="text-white font-medium">2024.01.16.01</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-800">
            <span className="text-slate-400">License</span>
            <span className="text-emerald-400 font-medium">Professional</span>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Check for Updates
          </Button>
          <Button variant="outline" className="flex-1">
            <Lock className="w-4 h-4 mr-2" />
            License Details
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
