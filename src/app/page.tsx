'use client';

import React, { useState, useEffect } from 'react';
import { Plus, ShieldCheck, AlertTriangle, List, LayoutGrid, Search, ArrowRight, CheckCircle2, Download, Sparkles, Tag, MapPin, Activity } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { DeviceCard } from '@/components/DeviceCard';
import { AddDeviceModal } from '@/components/AddDeviceModal';
import { Device, DeviceCategory } from '@/types/device';
import { getDevices, saveDevice, deleteDevice } from '@/lib/storage';
import { useAuth } from '@/hooks/useAuth';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Dashboard() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DeviceCategory | 'All'>('All');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setIsMounted(true);
    if (isAuthenticated) {
      const stored = getDevices();
      setDevices(stored);
    }
  }, [isAuthenticated]);

  const handleAddDevice = (device: Device) => {
    saveDevice(device);
    setDevices([device, ...devices]);
  };

  const handleDeleteDevice = (id: string) => {
    deleteDevice(id);
    setDevices(devices.filter(d => d.id !== id));
  };

  if (!isMounted || !isAuthenticated) return null;

  const filteredDevices = devices.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || d.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories: (DeviceCategory | 'All')[] = ['All', 'Electronic', 'Furniture', 'Vehicles', 'Infrastructure', 'Others'];

  return (
    <main className="min-h-screen bg-white">
      <Navbar onAddClick={() => setIsModalOpen(true)} />

      {/* Hero / Header Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
              <Activity className="w-3.5 h-3.5" /> Fleet Intelligence Active
            </div>
            <h1 className="text-6xl font-bold text-slate-900 tracking-tight leading-[1.1]">Asset Identity <br/><span className="text-emerald-500">Registry</span></h1>
            <p className="text-lg text-slate-500 leading-relaxed max-w-xl font-medium">
              Enterprise-grade lifecycle tracking. Monitor health, location history, and maximize asset recovery value.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button onClick={() => setIsModalOpen(true)} className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">Register New Asset</button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-3 group hover:border-indigo-100 transition-all">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-4xl font-bold text-slate-900 tracking-tight">{devices.length}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Managed</div>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-3 group hover:border-emerald-100 transition-all">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="text-4xl font-bold text-slate-900 tracking-tight">{devices.filter(d => d.maintenanceStatus === 'Healthy').length}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Optimal Systems</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Registry Section */}
      <section className="bg-slate-50/50 py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="space-y-6 w-full">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Active Passport Registry</h2>
              <div className="flex flex-wrap gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border",
                      selectedCategory === cat ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200" : "bg-white text-slate-500 border-slate-100 hover:border-slate-200"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative w-full md:w-96 shrink-0">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input 
                type="text" 
                placeholder="Search name or serial..." 
                className="w-full bg-white border border-slate-100 rounded-2xl py-5 pl-14 pr-6 outline-none focus:border-emerald-500 transition-all shadow-sm font-medium text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-12">
            {filteredDevices.length > 0 ? (
              filteredDevices.map((device) => (
                <DeviceCard key={device.id} device={device} onDelete={handleDeleteDevice} />
              ))
            ) : (
              <div className="bg-white border border-dashed border-slate-200 rounded-[2.5rem] py-32 text-center">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No assets found in registry</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <AddDeviceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddDevice} />
    </main>
  );
}
