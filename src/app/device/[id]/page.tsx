'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { DeviceCard } from '@/components/DeviceCard';
import { Device } from '@/types/device';
import { getDevices } from '@/lib/storage';
import { ArrowLeft, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';

export default function DevicePassportPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [device, setDevice] = useState<Device | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPortable, setIsPortable] = useState(false);

  useEffect(() => {
    if (!id) return;

    // 1. Try local storage first
    const storedDevices = getDevices();
    const found = storedDevices.find(d => d.id === id);

    if (found) {
      setDevice(found);
      setIsLoading(false);
    } else {
      // 2. Check for portable data in URL (for scans from other devices)
      const pData = searchParams.get('p');
      if (pData) {
        try {
          const decoded = JSON.parse(atob(decodeURIComponent(pData)));
          const portableDevice: Device = {
            id: id as string,
            name: decoded.n,
            brand: decoded.b,
            model: decoded.m,
            serialNumber: decoded.s,
            category: decoded.c,
            currentLocation: decoded.l,
            maintenanceStatus: decoded.st,
            imageUrl: decoded.img,
            owner: decoded.o,
            maintenanceLogs: [],
            locationHistory: [],
            purchaseHistory: [],
            createdAt: new Date().toISOString()
          };
          setDevice(portableDevice);
          setIsPortable(true);
        } catch (e) {
          console.error("Failed to decode portable data", e);
        }
      }
      setIsLoading(false);
    }
  }, [id, searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#2e7d32] animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="bg-[#f8f9fa] min-h-[calc(100vh-80px)] py-12 px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>

          {isPortable && (
            <div className="p-4 bg-[#e8f5e9] border border-[#2e7d32]/20 rounded-2xl flex items-center gap-3 text-[#2e7d32] text-xs font-bold shadow-sm">
              <ShieldCheck className="w-5 h-5" />
              <span>SECURE PORTABLE PASSPORT: You are viewing a verified digital asset identity via QR scan.</span>
            </div>
          )}

          {device ? (
            <DeviceCard device={device} onDelete={() => {}} isDetailView={true} />
          ) : (
            <div className="bg-white p-24 rounded-3xl border border-gray-100 shadow-xl text-center space-y-6">
              <AlertCircle className="w-16 h-16 text-gray-200 mx-auto" />
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-black">Asset Not Found</h2>
                <p className="text-gray-500 max-w-sm mx-auto">This asset might have been deleted or the secure link is invalid. Please contact the administrator.</p>
              </div>
              <button onClick={() => router.push('/')} className="btn-primary">Return Home</button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
