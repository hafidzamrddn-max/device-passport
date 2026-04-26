'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { DeviceCard } from '@/components/DeviceCard';
import { Device } from '@/types/device';
import { getDevices } from '@/lib/storage';
import { ArrowLeft, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';

function DevicePassportContent() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [device, setDevice] = useState<Device | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPortable, setIsPortable] = useState(false);

  useEffect(() => {
    if (!id) return;

    const storedDevices = getDevices();
    const found = storedDevices.find(d => d.id === id);

    if (found) {
      setDevice(found);
      setIsLoading(false);
    } else {
      const vData = searchParams.get('v');

      if (vData) {
        try {
          const decodedStr = atob(decodeURIComponent(vData));
          const [name, sn, status] = decodedStr.split('|');
          
          const portableDevice: Device = {
            id: id as string,
            name: name || "Asset Passport",
            brand: "-",
            model: "-",
            serialNumber: sn || "-",
            category: "Others",
            currentLocation: "External Scan",
            maintenanceStatus: (status as any) || "Healthy",
            owner: "Enterprise Registry",
            maintenanceLogs: [],
            locationHistory: [],
            purchaseHistory: [],
            createdAt: new Date().toISOString()
          };
          setDevice(portableDevice);
          setIsPortable(true);
        } catch (e) {
          console.error("Failed to decode tiny data", e);
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
    <div className="bg-[#f8f9fa] min-h-[calc(100vh-80px)] py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        {isPortable && (
          <div className="p-5 bg-white border border-[#2e7d32]/10 rounded-2xl flex items-center gap-4 text-[#2e7d32] text-[10px] font-bold shadow-sm uppercase tracking-widest">
            <div className="w-8 h-8 bg-[#e8f5e9] rounded-full flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span>Digital Asset Identity Verified via QR Passport</span>
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
  );
}

export default function DevicePassportPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-[#2e7d32] animate-spin" />
        </div>
      }>
        <DevicePassportContent />
      </Suspense>
    </main>
  );
}
