'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Device } from '@/types/device';
import { getDevices } from '@/lib/storage';
import { DeviceCard } from '@/components/DeviceCard';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function DevicePassportPage() {
  const params = useParams();
  const router = useRouter();
  const [device, setDevice] = useState<Device | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const devices = getDevices();
    const found = devices.find((d) => d.id === params.id);
    if (found) {
      setDevice(found);
    }
  }, [params.id]);

  if (!isMounted) return null;

  if (!device) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-white">
        <div className="text-center space-y-6">
          <div className="text-4xl font-black italic tracking-tighter text-black mb-8">DULANG</div>
          <h1 className="text-2xl font-bold text-gray-900">Asset Not Found</h1>
          <p className="text-gray-500">The requested device passport does not exist in the current registry.</p>
          <button onClick={() => router.push('/')} className="btn-primary">Return to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f9fa] p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-black italic tracking-tighter text-black">DULANG</div>
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-black transition-colors uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </button>
        </div>

        <div className="bg-white p-8 md:p-16 rounded-3xl border border-gray-100 shadow-xl space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e8f5e9] text-[#2e7d32] rounded-full text-[10px] font-bold uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3" /> Digitally Verified Passport
            </div>
            <h1 className="text-4xl font-bold text-black tracking-tight">Official Asset Record</h1>
          </div>
          
          <DeviceCard device={device} onDelete={() => {}} isDetailView />
        </div>

        <footer className="text-center text-gray-400 text-[10px] uppercase tracking-[0.3em] font-bold py-12">
          Dulang Enterprise Registry • Secure Asset Lifecycle Tracking
        </footer>
      </div>
    </main>
  );
}
