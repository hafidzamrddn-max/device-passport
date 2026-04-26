'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Printer, Download, RefreshCw, Smartphone, MapPin, ShieldCheck, CheckCircle2, AlertTriangle, FileText, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getDevices } from '@/lib/storage';
import { Device } from '@/types/device';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type for autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

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

  const handlePrintFullReport = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(46, 125, 50);
    doc.text('DULANG ASSET REGISTRY REPORT', 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Total Managed Assets: ${devices.length}`, 14, 35);
    
    // Table
    const tableData = devices.map(d => [
      d.name,
      d.brand,
      d.serialNumber,
      d.category,
      d.currentLocation,
      d.maintenanceStatus
    ]);

    doc.autoTable({
      startY: 45,
      head: [['Asset Name', 'Brand', 'Serial Number', 'Category', 'Location', 'Status']],
      body: tableData,
      headStyles: { fillStyle: 'f3f3f3', textColor: [0, 0, 0], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 249, 250] },
      styles: { fontSize: 8, cellPadding: 4 },
      margin: { top: 45 }
    });

    doc.save('dulang_full_asset_report.pdf');
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
              <p className="text-gray-500 font-medium uppercase tracking-[0.2em] text-[10px]">Registry Analytics ({devices.length} Assets)</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={handlePrintFullReport}
                className="flex items-center gap-2 px-8 py-4 bg-[#2e7d32] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#1b5e20] transition-all shadow-lg shadow-[#2e7d32]/20"
              >
                <FileText className="w-4 h-4" /> Export Full PDF Report
              </button>
            </div>
          </div>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Assets', val: devices.length, icon: Smartphone, color: 'text-black' },
              { label: 'System Healthy', val: statusData[0].value, icon: CheckCircle2, color: 'text-[#2e7d32]' },
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

          {/* Recent Activity List */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-10 border-b border-gray-50 flex justify-between items-center">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Recent Asset Additions</h2>
              <RefreshCw className="w-4 h-4 text-gray-300" />
            </div>
            <div className="divide-y divide-gray-50">
              {devices.slice(0, 5).map((device, i) => (
                <div key={i} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 group-hover:bg-white transition-colors">
                      <Smartphone className="w-6 h-6 text-gray-300" />
                    </div>
                    <div>
                      <h3 className="font-bold text-black">{device.name}</h3>
                      <p className="text-xs text-gray-400 font-medium">{device.serialNumber} • {device.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Location</div>
                      <div className="text-sm font-bold text-gray-700">{device.currentLocation}</div>
                    </div>
                    <div className={cn(
                      "px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest",
                      device.maintenanceStatus === 'Healthy' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                    )}>
                      {device.maintenanceStatus}
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-200 group-hover:text-black transition-colors" />
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
