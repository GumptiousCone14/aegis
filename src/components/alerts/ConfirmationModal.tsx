'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Shield, X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ConfirmationModal({ action, onConfirm, onCancel, isOpen }: {action: any, onConfirm: () => void, onCancel: () => void, isOpen: boolean}) {
  if (!isOpen || !action) return null;

  const severityColors: {[key: string]: string} = {
    critical: 'from-red-600 to-rose-600',
    high: 'from-orange-600 to-amber-600',
    medium: 'from-yellow-600 to-orange-600'
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg rounded-2xl bg-slate-900 border-2 border-red-500/30 shadow-2xl"
        >
          {/* Header */}
          <div className={`p-6 border-b border-slate-800 bg-gradient-to-r ${severityColors[action.severity]}/10`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${severityColors[action.severity]} flex items-center justify-center`}>
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">Critical Action Required</h3>
                <p className="text-sm text-slate-400">Confirm automated threat response</p>
              </div>
              <button onClick={onCancel} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-2">Threat Details</h4>
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                <div className="text-white font-semibold mb-1">{action.threatName}</div>
                <div className="text-sm text-slate-400">{action.description}</div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-2">Proposed Actions</h4>
              <div className="space-y-2">
                {action.actions.map((act: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <p className="text-sm text-amber-300">
                <strong>Warning:</strong> These actions will be executed immediately and cannot be easily reversed. Please review carefully.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-slate-800 flex gap-3 justify-end">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              onClick={onConfirm}
              className="bg-gradient-to-r from-red-600 to-rose-600"
            >
              <Shield className="w-4 h-4 mr-2" />
              Confirm & Execute
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
