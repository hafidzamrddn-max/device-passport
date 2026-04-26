'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  CartesianGrid
} from 'recharts';
import { 
  Smartphone, MapPin, CheckCircle2, AlertTriangle, 
  Activity, Layers, Zap, ChevronRight, Printer
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getDevices } from '@/lib/storage';
import { Device } from '@/types/device';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ReportsPage() {
  const { isAuthenticated } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (isAuthenticated) {
      setDevices(getDevices());
    }
  }, [isAuthenticated]);

  if (!isMounted || !isAuthenticated) return null;

  // DATA PREPARATION
  const categoryData = Object.entries(
    devices.reduce((acc, d) => {
      acc[d.category] = (acc[d.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const statusData = [
    { name: 'Healthy', value: devices.filter(d => d.maintenanceStatus === 'Healthy').length, fill: '#10b981' },
    { name: 'Warning', value: devices.filter(d => d.maintenanceStatus === 'Warning').length, fill: '#f59e0b' },
    { name: 'Critical', value: devices.filter(d => d.maintenanceStatus === 'Critical').length, fill: '#ef4444' },
  ];

  const locationData = Object.entries(
    devices.reduce((acc, d) => {
      const loc = d.currentLocation || 'Unknown';
      acc[loc] = (acc[loc] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 5);

  const COLORS = ['#10b981', '#6366f1', '#f43f5e', '#f59e0b', '#0ea5e9'];

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <section className="bg-[#f8fafc] py-16 px-6 min-h-[calc(100vh-80px)]">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#10b981]">
                <Activity className="w-3 h-3" /> System Intelligence
              </div>
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Fleet Analytics</h1>
              <p className="text-slate-500 font-medium text-sm">Monitoring {devices.length} enterprise assets across {locationData.length} active hubs.</p>
            </div>
            <div className="flex gap-4 print-hidden">
              <button 
                onClick={handlePrint}
                className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
              >
                <Printer className="w-4 h-4" /> Print Dashboard Report
              </button>
            </div>
          </div>

          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Inventory', val: devices.length, icon: Smartphone, color: 'bg-indigo-50 text-indigo-600' },
              { label: 'Asset Health', val: devices.length > 0 ? `${Math.round((statusData[0].value / devices.length) * 100)}%` : '0%', icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
              { label: 'System Warnings', val: statusData[1].value + statusData[2].value, icon: AlertTriangle, color: 'bg-amber-50 text-amber-600' },
              { label: 'Asset Clusters', val: locationData.length, icon: Layers, color: 'bg-sky-50 text-sky-600' }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.color)}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">{stat.val}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900">Health Composition</h2>
              <div className="h-64 flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value" stroke="none">
                      {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {statusData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="text-[10px] font-bold uppercase text-slate-500">{item.name}</span>
                    <span className="text-xs font-bold text-slate-900">{item.value} Assets</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900">Top Strategic Hubs</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={locationData} layout="vertical" margin={{ left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} width={100} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="count" radius={[0, 10, 10, 0]} barSize={32}>
                      {locationData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-10 border-b border-slate-50 bg-slate-50/50">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900">Maintenance Priority Feed</h2>
            </div>
            <div className="divide-y divide-slate-50">
              {devices.filter(d => d.maintenanceStatus !== 'Healthy').slice(0, 6).map((device, i) => (
                <div key={i} className="p-8 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border", device.maintenanceStatus === 'Warning' ? "bg-amber-50 border-amber-100 text-amber-500" : "bg-rose-50 border-rose-100 text-rose-500")}>
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{device.name}</h3>
                      <p className="text-xs text-slate-400 font-medium">ID: {device.serialNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Status</div>
                    <div className={cn("text-xs font-bold", device.maintenanceStatus === 'Warning' ? "text-amber-500" : "text-rose-500")}>{device.maintenanceStatus.toUpperCase()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
