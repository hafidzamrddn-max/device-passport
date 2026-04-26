'use client';

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Battery, Wifi, Trash2, ShieldCheck, Plus, Cpu, CheckCircle2, MapPin, Tag, Printer, Smartphone, Car, Building2, Box, Armchair, ExternalLink } from 'lucide-react';
import { Device, MaintenanceLog, LocationRecord, DeviceCategory } from '@/types/device';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { updateDevice } from '@/lib/storage';
import Link from 'next/link';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CategoryIcon = ({ category, className }: { category: DeviceCategory, className?: string }) => {
  switch (category) {
    case 'Electronic': return <Smartphone className={className} />;
    case 'Furniture': return <Armchair className={className} />;
    case 'Vehicles': return <Car className={className} />;
    case 'Infrastructure': return <Building2 className={className} />;
    default: return <Box className={className} />;
  }
};

interface DeviceCardProps {
  device: Device;
  onDelete: (id: string) => void;
  isDetailView?: boolean;
}

export const DeviceCard = ({ device, onDelete, isDetailView = false }: DeviceCardProps) => {
  const [activeTab, setActiveTab] = useState<'maintenance' | 'location'>('maintenance');
  const [showForm, setShowForm] = useState(false);
  const [logs, setLogs] = useState<MaintenanceLog[]>(device.maintenanceLogs || []);
  const [locations, setLocations] = useState<LocationRecord[]>(device.locationHistory || []);
  const [newVal, setNewVal] = useState('');
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0]);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const handleAddRecord = () => {
    if (!newVal) return;
    const dateObj = new Date(customDate);
    const displayDate = dateObj.toLocaleDateString('en-GB');
    
    if (activeTab === 'maintenance') {
      const updated = [{ date: displayDate, description: newVal }, ...logs];
      updateDevice(device.id, { maintenanceLogs: updated });
      setLogs(updated);
    } else {
      const updated = [{ date: displayDate, location: newVal }, ...locations];
      updateDevice(device.id, { locationHistory: updated, currentLocation: newVal });
      setLocations(updated);
    }
    
    setNewVal('');
    setCustomDate(new Date().toISOString().split('T')[0]);
    setShowForm(false);
  };

  const tinyData = `${device.name.substring(0,10)}|${device.serialNumber.substring(0,10)}|${device.maintenanceStatus}`;
  const passportPath = `/device/${device.id}?v=${encodeURIComponent(btoa(tinyData))}`;
  const qrUrl = origin ? `${origin}${passportPath}` : '';

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500">
      <div className="p-8 md:p-12">
        <div className="flex flex-col lg:flex-row gap-16">
          
          <div className="lg:w-2/5 space-y-10">
            <div className="flex items-start gap-8">
              <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shrink-0 text-emerald-500">
                <CategoryIcon category={device.category} className="w-10 h-10" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full text-[10px] font-black text-emerald-600 uppercase tracking-widest w-fit border border-emerald-100">
                  <Tag className="w-3 h-3" /> {device.category}
                </div>
                <h3 className="text-3xl font-bold text-slate-900 leading-tight tracking-tight">{device.name}</h3>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{device.brand} • {device.model}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-10 gap-x-12">
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Hub Location</p>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <span>{device.currentLocation || 'Unknown'}</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Identity SN</p>
                <p className="text-sm font-mono font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded w-fit">{device.serialNumber}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">System Status</p>
                <div className="flex items-center gap-2">
                  <div className={cn("w-2.5 h-2.5 rounded-full", device.maintenanceStatus === 'Healthy' ? "bg-emerald-500" : device.maintenanceStatus === 'Warning' ? "bg-amber-500" : "bg-rose-500")} />
                  <span className="text-xs font-black uppercase text-slate-700 tracking-wider">{device.maintenanceStatus}</span>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50/50 rounded-3xl space-y-6 border border-slate-100 print:bg-white print:border-none print:p-0">
              <div className="flex justify-between items-center print-hidden">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Nodes</h4>
                <button onClick={() => window.print()} className="flex items-center gap-2 text-[10px] font-black text-emerald-600 px-4 py-2 rounded-full border border-emerald-100 bg-white hover:bg-emerald-600 hover:text-white transition-all">
                  <Printer className="w-3 h-3" /> PRINT PASSPORT
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[Battery, Cpu, Wifi].map((Icon, i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl flex flex-col items-center gap-3 border border-slate-100 shadow-sm">
                    <Icon className="w-5 h-5 text-slate-300" />
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:w-3/5 lg:border-l lg:border-slate-100 lg:pl-16 space-y-10">
            <div className="flex justify-between items-center border-b border-slate-100">
              <div className="flex gap-10">
                <button onClick={() => setActiveTab('maintenance')} className={cn("text-xs font-black uppercase tracking-[0.2em] transition-all pb-6 -mb-[1px]", activeTab === 'maintenance' ? "text-emerald-600 border-b-2 border-emerald-600" : "text-slate-400 hover:text-slate-900")}>Maintenance</button>
                <button onClick={() => setActiveTab('location')} className={cn("text-xs font-black uppercase tracking-[0.2em] transition-all pb-6 -mb-[1px]", activeTab === 'location' ? "text-emerald-600 border-b-2 border-emerald-600" : "text-slate-400 hover:text-slate-900")}>Tracking</button>
              </div>
              {!isDetailView && <button onClick={() => onDelete(device.id)} className="p-2 text-slate-200 hover:text-rose-500 transition-colors print-hidden"><Trash2 className="w-5 h-5" /></button>}
            </div>

            <div className="space-y-8 h-80 overflow-y-auto custom-scrollbar pr-6">
              {activeTab === 'maintenance' ? (
                logs.length > 0 ? logs.map((log, i) => (
                  <div key={i} className="flex gap-8 pb-8 border-b border-slate-50 last:border-0">
                    <div className="text-[10px] font-black text-slate-300 whitespace-nowrap pt-1 uppercase tracking-widest">{log.date}</div>
                    <div className="text-sm text-slate-700 leading-relaxed font-bold">{log.description}</div>
                  </div>
                )) : <p className="text-xs text-gray-400 italic">No logs recorded.</p>
              ) : (
                locations.length > 0 ? locations.map((loc, i) => (
                  <div key={i} className="flex gap-8 pb-8 border-b border-slate-50 last:border-0">
                    <div className="text-[10px] font-black text-slate-300 whitespace-nowrap pt-1 uppercase tracking-widest">{loc.date}</div>
                    <div className="flex items-center gap-3 text-sm text-slate-800 font-black"><MapPin className="w-4 h-4 text-slate-300" /> {loc.location}</div>
                  </div>
                )) : <p className="text-xs text-gray-400 italic">No history found.</p>
              )}
            </div>

            <div className="pt-10 flex items-end justify-between border-t border-slate-100 mt-6">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Asset QR Passport</p>
                <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500">
                  <ShieldCheck className="w-4 h-4" /> ENCRYPTED IDENTITY ACTIVE
                </div>
              </div>
              
              <Link href={passportPath} className="p-5 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl relative group/qr print-hidden">
                <div className="absolute inset-0 bg-emerald-500/0 group-hover/qr:bg-emerald-500/5 transition-all rounded-[2.5rem] flex items-center justify-center">
                  <ExternalLink className="w-6 h-6 text-emerald-500 opacity-0 group-hover/qr:opacity-100 transition-all scale-50 group-hover/qr:scale-100" />
                </div>
                {qrUrl ? <QRCodeSVG value={qrUrl} size={90} level="L" /> : <div className="w-20 h-20 bg-slate-50 animate-pulse rounded-2xl" />}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
