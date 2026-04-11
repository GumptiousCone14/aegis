'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Bell, 
  Database, 
  Wifi,
  Activity,
  Lock,
  Download,
  Info,
  Loader2,
  CreditCard,
  Cpu,
  Globe,
  CheckCircle2,
  X
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useSystemInfo } from '@/hooks/useSystemInfo';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { invoke } from '@tauri-apps/api/core';
import { useEffect } from 'react';

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

  const { info, checkForUpdates } = useSystemInfo();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'searching' | 'downloading' | 'installing'>('idle');
  const [hasUpdated, setHasUpdated] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        if (typeof window !== 'undefined' && (window as any).__TAURI__) {
          const savedSettings = await invoke<any>('get_settings');
          setSettings(prev => ({ ...prev, ...savedSettings }));
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      }
    };
    loadSettings();
  }, []);

  const handleUpdateCheck = async () => {
    setIsUpdating(true);
    setUpdateStatus('searching');
    
    // Artificial delays for "cool" factor
    await new Promise(r => setTimeout(r, 1500));
    setUpdateStatus('downloading');
    
    const result = await checkForUpdates();
    
    if (result.success) {
      setUpdateStatus('installing');
      await new Promise(r => setTimeout(r, 1000));
      setUpdateStatus('idle');
      setIsUpdating(false);
      setHasUpdated(true);
      setTimeout(() => setHasUpdated(false), 5000);
      toast({
        title: "System Updated",
        description: "Latest threat definitions have been installed.",
      });
    } else {
      setUpdateStatus('idle');
      setIsUpdating(false);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: result.message,
      });
    }
  };

  const handleLicenseDetails = () => {
    setShowLicenseModal(true);
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'Loading...';
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return dateStr;
    }
  };

  const toggleSetting = async (key: keyof typeof settings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    
    try {
      if (typeof window !== 'undefined' && (window as any).__TAURI__) {
        await invoke('update_settings', { settings: newSettings });
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save settings to backend",
      });
    }
  };

  const handleSliderChange = async (key: keyof typeof settings, value: number) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    try {
      if (typeof window !== 'undefined' && (window as any).__TAURI__) {
        await invoke('update_settings', { settings: newSettings });
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  };

  const handleSelectChange = async (key: keyof typeof settings, value: string) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    try {
      if (typeof window !== 'undefined' && (window as any).__TAURI__) {
        await invoke('update_settings', { settings: newSettings });
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
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
              onValueChange={(value) => handleSliderChange('cpuUsageLimit', value[0])}
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
              onValueChange={(value) => handleSliderChange('alertMinConfidence', value[0])}
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
            <Select value={settings.emailDigest} onValueChange={(value) => handleSelectChange('emailDigest', value)}>
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
              onValueChange={(value) => handleSliderChange('autoResponseMinConfidence', value[0])}
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
        className={`mt-6 p-6 rounded-2xl transition-all duration-700 border ${
          hasUpdated 
          ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
          : 'bg-slate-900/50 border-slate-800'
        }`}
      >
        <div className="flex items-center gap-3 mb-4">
          <Info className="w-5 h-5 text-slate-400" />
          <h3 className="text-lg font-semibold text-white">System Information</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between py-2 border-b border-slate-800">
            <span className="text-slate-400">Version</span>
            <span className="text-white font-medium">{info?.version || '1.0.0'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-800">
            <span className="text-slate-400">Last Update</span>
            <span className="text-white font-medium">{formatDate(info?.last_update)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-800">
            <span className="text-slate-400">Database Version</span>
            <span className="text-white font-medium">{info?.database_version || 'Loading...'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-800">
            <span className="text-slate-400">License</span>
            <span className="text-emerald-400 font-medium">{info?.license || 'Professional'}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <div className="flex gap-3">
            <Button 
              className={`flex-1 transition-all duration-300 ${
                isUpdating 
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed border-blue-500/20' 
                : 'bg-white text-black hover:bg-slate-200 shadow-lg shadow-white/5'
              }`}
              onClick={handleUpdateCheck}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <div className="flex items-center gap-3">
                  <div className="relative w-5 h-5">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 rounded-full border-2 border-blue-500/20 border-t-blue-500"
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-[-4px] rounded-full border-2 border-cyan-500/10 border-b-cyan-500"
                    />
                  </div>
                  <span className="capitalize font-bold tracking-tight text-blue-400">{updateStatus}...</span>
                </div>
              ) : hasUpdated ? (
                <div className="flex items-center gap-2 text-emerald-500">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Up to Date</span>
                </div>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Check for Updates
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 border-slate-700 hover:bg-slate-800 text-white transition-all duration-300"
              onClick={handleLicenseDetails}
            >
              <Lock className="w-4 h-4 mr-2" />
              License Details
            </Button>
          </div>

        </div>
      </motion.div>

      {/* License Modal */}
      <AnimatePresence>
        {showLicenseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLicenseModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-600/10 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">License Details</h2>
                    <p className="text-sm text-slate-400">Manage your subscription</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowLicenseModal(false)}
                  className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8">
                <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <Shield className="w-24 h-24" />
                  </div>
                  <div className="relative z-10">
                    <div className="text-blue-100 text-sm font-medium mb-1 uppercase tracking-wider">Current Plan</div>
                    <div className="text-3xl font-bold text-white mb-4">{info?.license || 'Professional Plus'}</div>
                    <div className="flex items-center gap-2 text-blue-200 bg-black/20 self-start px-3 py-1 rounded-full text-xs border border-white/10">
                      <CheckCircle2 className="w-3 h-3" />
                      Active Subscribtion
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-200">Devices</span>
                    </div>
                    <span className="text-white font-semibold">5 / 5 Devices</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-200">Billing Cycle</span>
                    </div>
                    <span className="text-white font-semibold">Annual</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <Cpu className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-200">Support</span>
                    </div>
                    <span className="text-emerald-400 font-semibold">24/7 Priority</span>
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <Button className="flex-1 bg-white text-black hover:bg-slate-200">
                    Renew License
                  </Button>
                  <Button variant="outline" className="flex-1 border-slate-700 hover:bg-slate-800 text-white">
                    Contact Support
                  </Button>
                </div>
              </div>
              
              <div className="p-4 bg-slate-950 border-t border-slate-800 text-center">
                <p className="text-xs text-slate-500 font-medium tracking-tight">
                  License key: AEGS-XXXX-XXXX-2026
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
