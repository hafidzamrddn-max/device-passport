'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Users, Building2, ShieldCheck } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';

export default function OrganizationPage() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return null;
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <section className="bg-[#f8f9fa] py-24 px-6 min-h-[calc(100vh-80px)]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div>
            <h1 className="text-3xl font-bold text-black tracking-tight mb-2">Organization Structure</h1>
            <p className="text-gray-500 font-medium uppercase tracking-[0.2em] text-[10px]">Team & Permissions</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-2xl border border-gray-100 space-y-6 shadow-sm">
              <div className="flex items-center gap-4">
                <Building2 className="w-8 h-8 text-[#2e7d32]" />
                <h3 className="text-xl font-bold text-black">Company Profile</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-gray-50 pb-4">
                  <span className="text-sm text-gray-500">Name</span>
                  <span className="text-sm font-bold text-black">Dulang Internal Org</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-4">
                  <span className="text-sm text-gray-500">Industry</span>
                  <span className="text-sm font-bold text-black">Asset Decommissioning</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-2xl border border-gray-100 space-y-6 shadow-sm">
              <div className="flex items-center gap-4">
                <Users className="w-8 h-8 text-[#2e7d32]" />
                <h3 className="text-xl font-bold text-black">Team Members</h3>
              </div>
              <div className="space-y-4 text-center py-4">
                <p className="text-sm text-gray-400 italic">User management is restricted to organization admins.</p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-[#e8f5e9] rounded-2xl border border-[#2e7d32]/10 flex items-center gap-4">
            <ShieldCheck className="w-6 h-6 text-[#2e7d32]" />
            <div>
              <p className="text-xs font-bold text-[#2e7d32] uppercase">Enterprise Security Active</p>
              <p className="text-[10px] text-[#2e7d32]/70 uppercase tracking-widest font-bold">Role-based access control enabled</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
