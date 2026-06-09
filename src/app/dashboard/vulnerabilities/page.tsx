'use client';
import React from 'react';
import VulnerabilityScanner from '@/components/forensics/VulnerabilityScanner';

export default function VulnerabilitiesPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Vulnerabilities</h1>
        <p className="text-slate-400">System vulnerability scanning results and mitigation advice</p>
      </div>
      <VulnerabilityScanner />
    </div>
  );
}
