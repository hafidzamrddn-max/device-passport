'use client';

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Battery, Wifi, Monitor, Trash2, ShieldCheck, AlertCircle, Info, Plus, Speaker, Cpu, Camera, Globe, ExternalLink, CheckCircle2, MapPin, Tag, History, Download, Calendar } from 'lucide-react';
import { Device, MaintenanceLog, LocationRecord } from '@/types/device';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { updateDevice } from '@/lib/storage';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
    
    // Format date for display
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

  const passportUrl = origin ? `${origin}/device/${device.id}` : '';

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-8 md:p-12">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* LEFT: IDENTITY */}
          <div className="lg:w-2/5 space-y-10">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shrink-0 overflow-hidden">
                {device.imageUrl ? (
                  <img 
                    src={device.imageUrl} 
                    alt={device.name} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=600&auto=format&fit=crop';
                    }}
                  />
                ) : (
                  <Monitor className="w-8 h-8 text-gray-300" />
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-2 py-0.5 bg-gray-100 rounded text-[9px] font-bold text-gray-500 uppercase tracking-widest w-fit">
                  <Tag className="w-3 h-3" /> {device.category}
                </div>
                <h3 className="text-2xl font-bold text-black leading-tight">{device.name}</h3>
                <p className="text-sm font-semibold text-[#2e7d32] uppercase tracking-wider">{device.brand} • {device.model}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-8 gap-x-8">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Current Location</p>
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                  <MapPin className="w-3.5 h-3.5 text-[#2e7d32]" />
                  <span>{device.currentLocation || 'Unknown'}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">IMEI / Serial</p>
                <p className="text-sm font-mono font-bold text-gray-900">{device.serialNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Owner</p>
                <p className="text-sm font-bold text-gray-900 truncate">{device.owner}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</p>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    device.maintenanceStatus === 'Healthy' ? "bg-green-500" : 
                    device.maintenanceStatus === 'Warning' ? "bg-yellow-500" : "bg-red-500"
                  )} />
                  <span className="text-xs font-bold uppercase text-gray-700">{device.maintenanceStatus}</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-xl space-y-4 border border-gray-100 print:bg-white print:border-none print:p-0">
              <div className="flex justify-between items-center print:hidden">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">System Metrics</h4>
                <button 
                  onClick={() => window.print()}
                  className="flex items-center gap-1 text-[10px] font-bold text-[#2e7d32] hover:underline"
                >
                  <Download className="w-3 h-3" /> PRINT PASSPORT
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[Battery, Cpu, Wifi].map((Icon, i) => (
                  <div key={i} className="bg-white p-3 rounded-lg flex flex-col items-center gap-2 border border-gray-100">
                    <Icon className="w-4 h-4 text-gray-300" />
                    <CheckCircle2 className="w-3 h-3 text-[#2e7d32]" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: RECORDS */}
          <div className="lg:w-3/5 lg:border-l lg:border-gray-100 lg:pl-16 space-y-8">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <div className="flex gap-6">
                <button 
                  onClick={() => setActiveTab('maintenance')}
                  className={cn("text-sm font-bold uppercase tracking-widest transition-colors pb-4 -mb-4", activeTab === 'maintenance' ? "text-[#2e7d32] border-b-2 border-[#2e7d32]" : "text-gray-400 hover:text-black")}
                >
                  Maintenance
                </button>
                <button 
                  onClick={() => setActiveTab('location')}
                  className={cn("text-sm font-bold uppercase tracking-widest transition-colors pb-4 -mb-4", activeTab === 'location' ? "text-[#2e7d32] border-b-2 border-[#2e7d32]" : "text-gray-400 hover:text-black")}
                >
                  History
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

            <div className="space-y-6 h-64 overflow-y-auto custom-scrollbar pr-4">
              {activeTab === 'maintenance' ? (
                logs.length > 0 ? logs.map((log, i) => (
                  <div key={i} className="flex gap-6 pb-6 border-b border-gray-50 last:border-0">
                    <div className="text-[10px] font-bold text-gray-300 whitespace-nowrap pt-1 uppercase tracking-tighter">{log.date}</div>
                    <div className="text-sm text-gray-700 leading-relaxed font-medium">{log.description}</div>
                  </div>
                )) : <p className="text-xs text-gray-400 italic">No maintenance logs recorded.</p>
              ) : (
                locations.length > 0 ? locations.map((loc, i) => (
                  <div key={i} className="flex gap-6 pb-6 border-b border-gray-50 last:border-0">
                    <div className="text-[10px] font-bold text-gray-300 whitespace-nowrap pt-1 uppercase tracking-tighter">{loc.date}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 font-bold">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" /> {loc.location}
                    </div>
                  </div>
                )) : <p className="text-xs text-gray-400 italic">No location history found.</p>
              )}
            </div>

            {showForm ? (
              <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Description / Location</label>
                    <input 
                      placeholder={activeTab === 'maintenance' ? "Describe maintenance..." : "Enter new location..."}
                      className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-[#2e7d32]"
                      value={newVal}
                      onChange={(e) => setNewVal(e.target.value)}
                    />
                  </div>
                  <div className="w-full md:w-40 space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <input 
                        type="date"
                        className="w-full bg-white border border-gray-200 rounded-lg p-3 pl-9 text-[10px] font-bold outline-none focus:border-[#2e7d32]"
                        value={customDate}
                        onChange={(e) => setCustomDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleAddRecord} className="bg-[#2e7d32] text-white text-[10px] font-bold px-6 py-2 rounded uppercase tracking-widest">SAVE RECORD</button>
                  <button onClick={() => setShowForm(false)} className="text-gray-500 text-[10px] font-bold px-4 py-2 hover:bg-gray-200 rounded uppercase tracking-widest">CANCEL</button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 text-[10px] font-bold text-[#2e7d32] hover:underline uppercase tracking-widest"
              >
                <Plus className="w-4 h-4" /> {activeTab === 'maintenance' ? 'Add Log' : 'Update Location'}
              </button>
            )}

            <div className="pt-6 flex items-end justify-between border-t border-gray-50 mt-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">Asset QR Passport</p>
                <div className="flex items-center gap-2 text-[9px] font-bold text-[#2e7d32]">
                  <ShieldCheck className="w-3 h-3" /> DIGITAL VERIFICATION ACTIVE
                </div>
              </div>
              <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                {passportUrl ? (
                  <a href={passportUrl} target="_blank" rel="noopener noreferrer">
                    <QRCodeSVG value={passportUrl} size={80} level="H" />
                  </a>
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
