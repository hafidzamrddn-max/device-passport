'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, RadialBarChart, RadialBar } from 'recharts';
import { Download, Mail, Filter, RefreshCw, Smartphone, MapPin, ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Send, Check, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getDevices } from '@/lib/storage';
import { Device, DeviceCategory } from '@/types/device';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ReportsPage() {
  const { isAuthenticated } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

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
    { name: 'Healthy', value: devices.filter(d => d.maintenanceStatus === 'Healthy').length, fill: '#2e7d32' },
    { name: 'Warning', value: devices.filter(d => d.maintenanceStatus === 'Warning').length, fill: '#fbc02d' },
    { name: 'Critical', value: devices.filter(d => d.maintenanceStatus === 'Critical').length, fill: '#d32f2f' },
  ];

  const locationData = Object.entries(
    devices.reduce((acc, d) => {
      const loc = d.currentLocation || 'Unknown';
      acc[loc] = (acc[loc] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, count]) => ({ name, count }));

  const COLORS = ['#2e7d32', '#064e3b', '#4caf50', '#81c784', '#a5d6a7'];

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(devices, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "dulang_asset_report.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSending(true);
    // Simulate real email sending
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setTimeout(() => setIsSent(false), 3000);
      setEmail('');
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <section className="bg-[#f8f9fa] py-16 px-6 min-h-[calc(100vh-80px)]">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-black tracking-tight">Executive Dashboard</h1>
              <p className="text-gray-500 font-medium uppercase tracking-[0.2em] text-[10px]">Real-time Asset Intelligence & Analytics</p>
            </div>
            <div className="flex gap-4">
              <button onClick={handleDownload} className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-widest hover:border-black transition-all">
                <Download className="w-4 h-4" /> Download JSON
              </button>
            </div>
          </div>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Assets', val: devices.length, icon: Smartphone, color: 'text-black' },
              { label: 'System Healthy', val: `${statusData[0].value}`, icon: CheckCircle2, color: 'text-[#2e7d32]' },
              { label: 'Action Required', val: statusData[1].value + statusData[2].value, icon: AlertTriangle, color: 'text-[#fbc02d]' },
              { label: 'Active Locations', val: locationData.length, icon: MapPin, color: 'text-gray-400' }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                <stat.icon className={cn("w-6 h-6", stat.color)} />
                <div className="text-3xl font-bold text-black">{stat.val}</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Category Pie */}
            <div className="lg:col-span-1 bg-white p-10 rounded-3xl border border-gray-100 shadow-sm space-y-8">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 text-center">Category Distribution</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                {categoryData.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-[10px] font-bold uppercase text-gray-500">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Bar */}
            <div className="lg:col-span-2 bg-white p-10 rounded-3xl border border-gray-100 shadow-sm space-y-8">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Asset Density by Location</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={locationData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                    <Tooltip cursor={{ fill: '#f8f9fa' }} />
                    <Bar dataKey="count" fill="#2e7d32" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Email Report Section */}
          <div className="bg-[#2e7d32] rounded-3xl p-12 text-white overflow-hidden relative">
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Send Automated Report</h2>
                <p className="opacity-70 font-medium leading-relaxed">
                  Dispatch a comprehensive asset audit directly to management. Our system compiles health metrics, location density, and historical tracking into a professional format.
                </p>
              </div>
              <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-md border border-white/10">
                <form onSubmit={handleSendEmail} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-70">Recipient Email</label>
                    <input 
                      type="email" 
                      placeholder="manager@dulang.id"
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-4 px-6 outline-none focus:bg-white/20 transition-all placeholder:text-white/30 font-medium"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button 
                    disabled={isSending || isSent}
                    className={cn(
                      "w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all",
                      isSent ? "bg-white text-[#2e7d32]" : "bg-white text-[#2e7d32] hover:bg-gray-100"
                    )}
                  >
                    {isSending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : isSent ? (
                      <><Check className="w-5 h-5" /> REPORT SENT!</>
                    ) : (
                      <><Send className="w-5 h-5" /> DISPATCH REPORT</>
                    )}
                  </button>
                </form>
              </div>
            </div>
            {/* Decoration */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          </div>

        </div>
      </section>
    </main>
  );
}
