'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Device } from '@/types/device';
import { getDevices } from '@/lib/storage';
import { DeviceCard } from '@/components/DeviceCard';
import { ArrowLeft } from 'lucide-react';

export default function DevicePassportPage() {
  const params = useParams();
  const router = useRouter();
  const [device, setDevice] = useState<Device | null>(null);

  useEffect(() => {
    const devices = getDevices();
    const found = devices.find((d) => d.id === params.id);
    if (found) {
      setDevice(found);
    }
  }, [params.id]);

  if (!device) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-brand-text-main mb-4">Device Not Found</h1>
          <button onClick={() => router.push('/')} className="btn-primary">Return to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-6 md:p-12 max-w-4xl mx-auto space-y-8">
      <button 
        onClick={() => router.push('/')}
        className="flex items-center gap-2 text-brand-text-muted hover:text-brand-text-main transition-colors font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </button>

      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-serif font-bold text-brand-text-main mb-8">Digital Identity Passport</h1>
        <DeviceCard device={device} onDelete={() => {}} isDetailView />
      </div>

      <footer className="pt-12 text-center text-brand-text-muted text-[10px] uppercase tracking-[0.2em]">
        Official Device Passport Registry • Secure Lifecycle Tracking
      </footer>
    </main>
  );
}
