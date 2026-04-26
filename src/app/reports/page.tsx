'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { BarChart3, FileText, Download } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';

export default function ReportsPage() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return null;
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <section className="bg-[#f8f9fa] py-24 px-6 min-h-[calc(100vh-80px)]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div>
            <h1 className="text-3xl font-bold text-black tracking-tight mb-2">Lifecycle Reports</h1>
            <p className="text-gray-500 font-medium uppercase tracking-[0.2em] text-[10px]">Data & Analytics</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Asset Distribution', icon: BarChart3, desc: 'Overview of asset types across locations' },
              { title: 'Maintenance Summary', icon: FileText, desc: 'Analysis of recent maintenance logs' },
              { title: 'Carbon Impact', icon: FileText, desc: 'Environmental metrics for recovered assets' }
            ].map((report, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 space-y-4 shadow-sm hover:shadow-md transition-all group">
                <report.icon className="w-8 h-8 text-[#2e7d32]" />
                <h3 className="text-xl font-bold text-black">{report.title}</h3>
                <p className="text-gray-500 text-sm">{report.desc}</p>
                <button className="flex items-center gap-2 text-xs font-bold text-[#2e7d32] group-hover:underline">
                  <Download className="w-4 h-4" /> EXPORT PDF
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white border border-dashed border-gray-300 rounded-3xl py-32 text-center">
            <p className="text-gray-500 font-medium">Detailed custom reports will appear here as data accumulates.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
