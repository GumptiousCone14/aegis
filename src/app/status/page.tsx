'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

const services = [
  { name: 'API - North America', status: 'Operational' },
  { name: 'API - Europe', status: 'Operational' },
  { name: 'API - Asia', status: 'Degraded Performance' },
  { name: 'Authentication Service', status: 'Operational' },
  { name: 'AI Analysis Engine', status: 'Operational' },
  { name: 'Data Ingestion', status: 'Operational' },
  { name: 'Dashboard & UI', status: 'Operational' },
  { name: 'Automated Response System', status: 'Partial Outage' },
  { name: 'Reporting Service', status: 'Operational' },
];

const incidents = [
  {
    date: 'July 23, 2024',
    title: 'Partial Outage of Automated Response System',
    updates: [
      { timestamp: '10:30 PST', description: 'A fix has been implemented and we are monitoring the results.', status: 'Monitoring' },
      { timestamp: '10:05 PST', description: 'We have identified the root cause and are working on a fix.', status: 'Identified' },
      { timestamp: '09:45 PST', description: 'We are investigating reports of failures in the automated response system.', status: 'Investigating' },
    ]
  },
  {
    date: 'July 22, 2024',
    title: 'Degraded Performance for Asian API Gateway',
    updates: [
        { timestamp: '18:00 PST', description: 'The issue has been resolved. All systems are now operational.', status: 'Resolved' },
        { timestamp: '17:30 PST', description: 'We are continuing to monitor the situation and have seen performance improvements.', status: 'Monitoring' },
        { timestamp: '17:00 PST', description: 'We are investigating reports of increased latency for our API in the Asia region.', status: 'Investigating' },
    ]
  },
  {
    date: 'July 20, 2024',
    title: 'Brief Dashboard Unavailability',
    updates: [
        { timestamp: '02:15 PST', description: 'This incident has been resolved.', status: 'Resolved' },
        { timestamp: '02:00 PST', description: 'We experienced a brief period of dashboard unavailability. The issue has been identified and resolved.', status: 'Resolved' },
    ]
  }
];

const statusConfig: Record<string, { icon: React.ElementType, color: string, badge: string }> = {
  'Operational': { icon: CheckCircle, color: 'text-emerald-400', badge: 'bg-emerald-500/10 text-emerald-400' },
  'Degraded Performance': { icon: AlertTriangle, color: 'text-yellow-400', badge: 'bg-yellow-500/10 text-yellow-400' },
  'Partial Outage': { icon: AlertTriangle, color: 'text-orange-400', badge: 'bg-orange-500/10 text-orange-400' },
  'Major Outage': { icon: XCircle, color: 'text-red-400', badge: 'bg-red-500/10 text-red-400' },
};

export default function StatusPage() {
    const overallStatus = services.some(s => s.status !== 'Operational') 
    ? (services.some(s => s.status === 'Major Outage' || s.status === 'Partial Outage') ? 'Partial Outage' : 'Degraded Performance') 
    : 'Operational';
  
    const OverallStatusIcon = statusConfig[overallStatus]?.icon || CheckCircle;
    const overallStatusColor = statusConfig[overallStatus]?.color || 'text-emerald-400';

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />
      <main className="flex-grow py-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Overall Status */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-12 p-6 rounded-2xl flex items-center gap-4 ${statusConfig[overallStatus]?.badge} border border-slate-700`}
          >
            <OverallStatusIcon className={`w-10 h-10 ${overallStatusColor}`} />
            <div>
              <h1 className="text-2xl font-bold">{overallStatus === 'Operational' ? 'All Systems Operational' : 'Some Systems Experiencing Issues'}</h1>
              <p className="text-slate-400">{overallStatus === 'Operational' ? 'All services are running smoothly.' : 'We are investigating the issues and will provide updates below.'}</p>
            </div>
          </motion.div>

          {/* Services List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold mb-6">Current Status</h2>
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6 space-y-4">
                {services.map(service => {
                  const config = statusConfig[service.status];
                  const Icon = config.icon;
                  return (
                    <div key={service.name} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
                      <span className="font-medium">{service.name}</span>
                      <div className={`flex items-center gap-2 ${config.color}`}>
                        <Icon className="w-5 h-5" />
                        <span className="font-semibold">{service.status}</span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>

          {/* Past Incidents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-semibold mb-6">Past Incidents</h2>
            <Accordion type="single" collapsible className="w-full">
              {incidents.map((incident, index) => (
                <AccordionItem value={`item-${index}`} key={index} className="border-slate-800">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex justify-between items-center w-full">
                      <span className="font-medium text-lg">{incident.title}</span>
                      <span className="text-slate-400 text-sm">{incident.date}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-4 bg-slate-900 rounded-b-lg">
                    <div className="space-y-4">
                      {incident.updates.map((update, updateIndex) => (
                        <div key={updateIndex} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full bg-blue-500 mt-1" />
                            {updateIndex < incident.updates.length - 1 && <div className="w-0.5 flex-grow bg-slate-700 my-1" />}
                          </div>
                          <div>
                            <p className="text-slate-400 text-sm">{update.timestamp}</p>
                            <p className="text-slate-300">{update.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
