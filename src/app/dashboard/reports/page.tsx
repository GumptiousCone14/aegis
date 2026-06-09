'use client';

import React from 'react';
import { FileText } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Security Reports</h1>
        <p className="text-slate-400">Detailed security analytics and forensic documentation</p>
      </div>
      <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800">
        <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-400 mb-2">No Reports Available</h3>
        <p className="text-slate-500">Report generation will be available in a future update.</p>
      </div>
    </div>
  );
}
