import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

export const threatChartData = [
  { date: "Mar 1", threats: 5 },
  { date: "Mar 2", threats: 3 },
  { date: "Mar 3", threats: 8 },
  { date: "Mar 4", threats: 4 },
  { date: "Mar 5", threats: 6 },
  { date: "Mar 6", threats: 2 },
  { date: "Mar 7", threats: 10 },
];

export const recentEvents = [
  {
    type: "Malicious Process",
    description: "svchost.exe identified as ransomware.",
    status: "Blocked",
    timestamp: "2 mins ago",
    icon: ShieldAlert,
    level: "critical",
  },
  {
    type: "Network Scan",
    description: "Port scan detected from 192.168.1.102.",
    status: "Monitored",
    timestamp: "15 mins ago",
    icon: AlertTriangle,
    level: "warning",
  },
  {
    type: "File Integrity",
    description: "system32/drivers.dll restored from backup.",
    status: "Resolved",
    timestamp: "1 hour ago",
    icon: ShieldCheck,
    level: "info",
  },
  {
    type: "Vulnerability Found",
    description: "Apache Struts RCE (CVE-2017-5638).",
    status: "Needs Patch",
    timestamp: "3 hours ago",
    icon: AlertTriangle,
    level: "warning",
  },
  {
    type: "Login Attempt",
    description: "Failed SSH login from 203.0.113.55.",
    status: "Blocked IP",
    timestamp: "5 hours ago",
    icon: ShieldAlert,
    level: "critical",
  },
];
