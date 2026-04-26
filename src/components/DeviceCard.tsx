'use client';

import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Battery, Wifi, Monitor, Trash2, ShieldCheck, AlertCircle, Info, Plus, Speaker, Cpu, Camera, Globe, ExternalLink, CheckCircle2, MapPin, Tag, History, Download, Calendar, Printer, Smartphone, Car, Building2, Box, Armchair } from 'lucide-react';
import { Device, MaintenanceLog, LocationRecord, DeviceCategory } from '@/types/device';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { updateDevice } from '@/lib/storage';

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

  // TINY QR DATA: Only the bare essentials to keep it scannable
  // Format: n|s|st (Name|Serial|Status)
  const tinyData = `${device.name.substring(0,10)}|${device.serialNumber.substring(0,10)}|${device.maintenanceStatus}`;
  const qrUrl = origin ? `${origin}/device/${device.id}?v=${encodeURIComponent(btoa(tinyData))}` : '';

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="p-8 md:p-12">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* LEFT: IDENTITY */}
          <div className="lg:w-2/5 space-y-10">
            <div className="flex items-start gap-8">
              <div className="w-20 h-20 bg-[#f8f9fa] rounded-2xl flex items-center justify-center border border-gray-100 shrink-0 text-[#2e7d32]">
                <CategoryIcon category={device.category} className="w-10 h-10" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-3 py-1 bg-[#e8f5e9] rounded-full text-[10px] font-bold text-[#2e7d32] uppercase tracking-widest w-fit">
                  <Tag className="w-3 h-3" /> {device.category}
                </div>
                <h3 className="text-3xl font-bold text-black leading-tight tracking-tight">{device.name}</h3>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{device.brand} • {device.model}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-10 gap-x-12">
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Current Location</p>
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                  <MapPin className="w-4 h-4 text-[#2e7d32]" />
                  <span>{device.currentLocation || 'Unknown'}</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">IMEI / Serial</p>
                <p className="text-sm font-mono font-bold text-gray-900 bg-gray-50 px-2 py-1 rounded w-fit">{device.serialNumber}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Owner</p>
                <p className="text-sm font-bold text-gray-900 truncate">{device.owner}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</p>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-2.5 h-2.5 rounded-full shadow-sm",
                    device.maintenanceStatus === 'Healthy' ? "bg-green-500" : 
                    device.maintenanceStatus === 'Warning' ? "bg-yellow-500" : "bg-red-500"
                  )} />
                  <span className="text-xs font-bold uppercase text-gray-700 tracking-wider">{device.maintenanceStatus}</span>
                </div>
              </div>
            </div>

            <div className="p-8 bg-[#f8f9fa] rounded-3xl space-y-6 border border-gray-100 print:bg-white print:border-none print:p-0">
              <div className="flex justify-between items-center print:hidden">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Verification Metrics</h4>
                <button 
                  onClick={() => window.print()}
                  className="flex items-center gap-2 text-[10px] font-bold text-[#2e7d32] hover:bg-[#2e7d32] hover:text-white px-4 py-2 rounded-full transition-all border border-[#2e7d32]/20"
                >
                  <Printer className="w-3 h-3" /> PRINT PASSPORT
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[Battery, Cpu, Wifi].map((Icon, i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl flex flex-col items-center gap-3 border border-gray-100 shadow-sm">
                    <Icon className="w-5 h-5 text-gray-300" />
                    <CheckCircle2 className="w-4 h-4 text-[#2e7d32]" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: RECORDS */}
          <div className="lg:w-3/5 lg:border-l lg:border-gray-100 lg:pl-16 space-y-10">
            <div className="flex justify-between items-center border-b border-gray-100">
              <div className="flex gap-10">
                <button 
                  onClick={() => setActiveTab('maintenance')}
                  className={cn("text-xs font-bold uppercase tracking-widest transition-all pb-6 -mb-[1px]", activeTab === 'maintenance' ? "text-[#2e7d32] border-b-2 border-[#2e7d32]" : "text-gray-400 hover:text-black")}
                >
                  Maintenance Logs
                </button>
                <button 
                  onClick={() => setActiveTab('location')}
                  className={cn("text-xs font-bold uppercase tracking-widest transition-all pb-6 -mb-[1px]", activeTab === 'location' ? "text-[#2e7d32] border-b-2 border-[#2e7d32]" : "text-gray-400 hover:text-black")}
                >
                  Tracking History
                </button>
              </div>
              {!isDetailView && (
                <button 
                  onClick={() => onDelete(device.id)}
                  className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="space-y-8 h-80 overflow-y-auto custom-scrollbar pr-6">
              {activeTab === 'maintenance' ? (
                logs.length > 0 ? logs.map((log, i) => (
                  <div key={i} className="flex gap-8 pb-8 border-b border-gray-50 last:border-0 group">
                    <div className="text-[10px] font-bold text-gray-300 whitespace-nowrap pt-1 uppercase tracking-widest group-hover:text-[#2e7d32] transition-colors">{log.date}</div>
                    <div className="text-sm text-gray-700 leading-relaxed font-semibold">{log.description}</div>
                  </div>
                )) : <p className="text-xs text-gray-400 italic">No maintenance logs recorded.</p>
              ) : (
                locations.length > 0 ? locations.map((loc, i) => (
                  <div key={i} className="flex gap-8 pb-8 border-b border-gray-50 last:border-0 group">
                    <div className="text-[10px] font-bold text-gray-300 whitespace-nowrap pt-1 uppercase tracking-widest group-hover:text-[#2e7d32] transition-colors">{loc.date}</div>
                    <div className="flex items-center gap-3 text-sm text-gray-800 font-bold">
                      <MapPin className="w-4 h-4 text-gray-400" /> {loc.location}
                    </div>
                  </div>
                )) : <p className="text-xs text-gray-400 italic">No location history found.</p>
              )}
            </div>

            {showForm ? (
              <div className="p-8 bg-[#f8f9fa] rounded-3xl border border-gray-100 space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Entry Details</label>
                    <input 
                      placeholder={activeTab === 'maintenance' ? "Describe maintenance..." : "Enter new location..."}
                      className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm outline-none focus:border-[#2e7d32] shadow-sm"
                      value={newVal}
                      onChange={(e) => setNewVal(e.target.value)}
                    />
                  </div>
                  <div className="w-full md:w-48 space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</label>
                    <input 
                      type="date"
                      className="w-full bg-white border border-gray-200 rounded-xl p-4 text-[11px] font-bold outline-none focus:border-[#2e7d32] shadow-sm"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={handleAddRecord} className="flex-1 bg-[#2e7d32] text-white text-[10px] font-bold py-4 rounded-xl uppercase tracking-widest shadow-lg shadow-[#2e7d32]/20">SAVE RECORD</button>
                  <button onClick={() => setShowForm(false)} className="px-8 py-4 text-gray-500 text-[10px] font-bold hover:bg-gray-200 rounded-xl uppercase tracking-widest transition-colors">CANCEL</button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setShowForm(true)}
                className="flex items-center gap-3 text-xs font-bold text-[#2e7d32] bg-[#e8f5e9] px-6 py-3 rounded-full hover:bg-[#2e7d32] hover:text-white transition-all uppercase tracking-widest print:hidden shadow-sm"
              >
                <Plus className="w-4 h-4" /> {activeTab === 'maintenance' ? 'Add Log' : 'Update Location'}
              </button>
            )}

            <div className="pt-10 flex items-end justify-between border-t border-gray-50 mt-6">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">Identity QR Passport</p>
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#2e7d32]">
                  <ShieldCheck className="w-4 h-4" /> DIGITAL VERIFICATION ACTIVE
                </div>
              </div>
              <div className="p-5 bg-white border border-gray-100 rounded-3xl shadow-lg">
                {qrUrl ? (
                  <QRCodeSVG 
                    value={qrUrl} 
                    size={90} 
                    level="L" // Lowest level for simplest pattern
                    includeMargin={false}
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-50 animate-pulse rounded" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
