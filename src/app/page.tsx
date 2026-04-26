'use client';

import React, { useState, useEffect } from 'react';
import { Plus, ShieldCheck, AlertTriangle, List, LayoutGrid, Search, ArrowRight, CheckCircle2, Download, Sparkles, Tag, MapPin } from 'lucide-react';
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
      if (stored.length === 0) {
        const mockDevices: Device[] = [
          {
            id: 'mock-1',
            name: 'Samsung Galaxy S20 FE',
            brand: 'Samsung',
            model: 'Mobile Android Device',
            category: 'Electronic',
            serialNumber: '8615360***6001',
            owner: 'kreshna@dulang.id',
            currentLocation: 'Main Office',
            locationHistory: [{ date: '10/01/2021', location: 'Main Office' }],
            imageUrl: 'https://images.unsplash.com/photo-1610792516307-ea5acd3c3900?w=600&auto=format&fit=crop',
            maintenanceStatus: 'Healthy',
            maintenanceLogs: [
              { date: '12/01/2021', description: 'cracked screen replaced' },
              { date: '05/03/2021', description: 'battery replaced' }
            ],
            purchaseHistory: [{ date: '10/01/2021', seller: 'Samsung Store' }],
            createdAt: new Date().toISOString(),
          }
        ];
        mockDevices.forEach(d => saveDevice(d));
        setDevices(mockDevices);
      } else {
        setDevices(stored);
      }
    }
  }, [isAuthenticated]);

  const handleAddDevice = (device: Device) => {
    saveDevice(device);
    setDevices([...devices, device]);
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
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e8f5e9] text-[#2e7d32] rounded-full text-[10px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3 h-3" /> AI Automation Active
            </div>
            <h1 className="section-title">Smart Device Passport Registry</h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
              Track asset movement, monitor health, and engage with AI-driven analytics to maximize lifecycle value.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button onClick={() => setIsModalOpen(true)} className="btn-primary">Add New Asset</button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#f8f9fa] p-8 rounded-2xl border border-gray-100 space-y-2">
              <div className="text-4xl font-bold text-[#2e7d32]">{devices.length}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Assets</div>
            </div>
            <div className="bg-[#f8f9fa] p-8 rounded-2xl border border-gray-100 space-y-2">
              <div className="text-4xl font-bold text-[#2e7d32]">{devices.filter(d => d.maintenanceStatus === 'Healthy').length}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Healthy Systems</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Registry Section */}
      <section className="bg-[#f8f9fa] py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="space-y-6 w-full">
              <h2 className="text-3xl font-bold text-black tracking-tight">Active Passport Registry</h2>
              <div className="flex flex-wrap gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border",
                      selectedCategory === cat ? "bg-[#2e7d32] text-white border-[#2e7d32] shadow-lg shadow-[#2e7d32]/20" : "bg-white text-gray-500 border-gray-100 hover:border-gray-200"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative w-full md:w-96 shrink-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search name or serial..." 
                className="w-full bg-white border border-gray-200 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-[#2e7d32] transition-all shadow-sm font-medium"
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
              <div className="bg-white border border-dashed border-gray-300 rounded-3xl py-32 text-center">
                <p className="text-gray-500 font-medium">No assets found in this category.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <AddDeviceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddDevice} />
    </main>
  );
}
