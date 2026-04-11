'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Zap, 
  HardDrive, 
  FolderOpen,
  Play,
  Pause,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const scanTypes = [
  {
    id: 'quick',
    icon: Zap,
    name: 'Quick Scan',
    description: 'Scan critical system areas and active processes',
    duration: '2-5 minutes',
    color: 'from-blue-600 to-cyan-600'
  },
  {
    id: 'full',
    icon: HardDrive,
    name: 'Full System Scan',
    description: 'Deep scan of all files and directories',
    duration: '30-60 minutes',
    color: 'from-purple-600 to-pink-600'
  },
  {
    id: 'custom',
    icon: FolderOpen,
    name: 'Custom Scan',
    description: 'Select specific folders or drives to scan',
    duration: 'Varies',
    color: 'from-emerald-600 to-teal-600'
  }
];

export default function Scan() {
  const [scanStatus, setScanStatus] = useState('idle'); // idle, scanning, paused, complete
  const [selectedScanType, setSelectedScanType] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [scanStats, setScanStats] = useState({
    filesScanned: 0,
    threatsFound: 0,
    timeElapsed: '0:00',
    currentFile: ''
  });

  const startScan = (type: string) => {
    setSelectedScanType(type);
    setScanStatus('scanning');
    setProgress(0);
    
    // Simulate scanning
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setScanStatus('complete');
      }
      setProgress(currentProgress);
      setScanStats({
        filesScanned: Math.floor(currentProgress * 100),
        threatsFound: Math.floor(Math.random() * 3),
        timeElapsed: `${Math.floor(currentProgress / 10)}:${String(Math.floor((currentProgress % 10) * 6)).padStart(2, '0')}`,
        currentFile: `C:\\Users\\Documents\\file_${Math.floor(currentProgress * 10)}.exe`
      });
    }, 500);
  };

  const pauseScan = () => {
    setScanStatus('paused');
  };

  const resumeScan = () => {
    setScanStatus('scanning');
  };

  const cancelScan = () => {
    setScanStatus('idle');
    setProgress(0);
    setSelectedScanType(null);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Scan System</h1>
        <p className="text-slate-400">Choose a scan type to protect your system</p>
      </div>

      <AnimatePresence mode="wait">
        {scanStatus === 'idle' ? (
          // Scan Type Selection
          <motion.div
            key="selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="grid md:grid-cols-3 gap-6">
              {scanTypes.map((scanType) => (
                <motion.div
                  key={scanType.id}
                  whileHover={{ scale: 1.02 }}
                  className="relative p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
                  onClick={() => startScan(scanType.id)}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${scanType.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <scanType.icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-2">{scanType.name}</h3>
                  <p className="text-slate-400 text-sm mb-4">{scanType.description}</p>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-blue-500/50" />
                    <span>Est. time: {scanType.duration}</span>
                  </div>

                  {/* Hover effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${scanType.color} opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`} />
                </motion.div>
              ))}
            </div>

            {/* Last Scan Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-8 p-6 rounded-2xl bg-slate-900/50 border border-slate-800"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-semibold mb-1">Last Scan Results</h4>
                  <p className="text-slate-400 text-sm">Full System Scan completed 2 hours ago</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-emerald-400 mb-1">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-semibold">No threats found</span>
                  </div>
                  <p className="text-slate-500 text-sm">1,243,567 files scanned</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          // Scanning Progress
          <motion.div
            key="scanning"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-3xl mx-auto"
          >
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800">
              {/* Scan Type Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${scanTypes.find(t => t.id === selectedScanType)?.color} flex items-center justify-center`}>
                  {selectedScanType && React.createElement(scanTypes.find(t => t.id === selectedScanType)!.icon, { className: 'w-8 h-8 text-white' })}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{scanTypes.find(t => t.id === selectedScanType)?.name}</h3>
                  <p className="text-slate-400">
                    {scanStatus === 'complete' ? 'Scan completed' : scanStatus === 'paused' ? 'Scan paused' : 'Scanning in progress...'}
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-400 text-sm">Progress</span>
                  <span className="text-white font-semibold">{Math.floor(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="p-4 rounded-xl bg-slate-800/50">
                  <div className="text-2xl font-bold text-white mb-1">{scanStats.filesScanned.toLocaleString()}</div>
                  <div className="text-sm text-slate-400">Files Scanned</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/50">
                  <div className="text-2xl font-bold text-white mb-1">{scanStats.threatsFound}</div>
                  <div className="text-sm text-slate-400">Threats Found</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/50">
                  <div className="text-2xl font-bold text-white mb-1">{scanStats.timeElapsed}</div>
                  <div className="text-sm text-slate-400">Time Elapsed</div>
                </div>
              </div>

              {/* Current File */}
              {scanStatus === 'scanning' && (
                <div className="mb-8 p-4 rounded-xl bg-slate-800/30 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-slate-500 mb-1">Currently scanning</div>
                      <div className="text-sm text-slate-300 truncate">{scanStats.currentFile}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Message */}
              {scanStatus === 'complete' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-8 p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-emerald-400 font-semibold mb-1">Scan Complete</h4>
                      <p className="text-slate-300 text-sm">
                        {scanStats.threatsFound > 0 
                          ? `${scanStats.threatsFound} threat(s) detected and quarantined` 
                          : 'No threats detected. Your system is secure.'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                {scanStatus === 'scanning' && (
                  <>
                    <Button onClick={pauseScan} variant="outline" className="flex-1">
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                    <Button onClick={cancelScan} variant="outline" className="flex-1">
                      Stop
                    </Button>
                  </>
                )}
                {scanStatus === 'paused' && (
                  <>
                    <Button onClick={resumeScan} className="flex-1 bg-blue-600 hover:bg-blue-500">
                      <Play className="w-4 h-4 mr-2" />
                      Resume
                    </Button>
                    <Button onClick={cancelScan} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </>
                )}
                {scanStatus === 'complete' && (
                  <Button onClick={cancelScan} className="w-full bg-blue-600 hover:bg-blue-500">
                    Start New Scan
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
