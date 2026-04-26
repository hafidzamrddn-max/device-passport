'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { DeviceCard } from '@/components/DeviceCard';
import { AddDeviceModal } from '@/components/AddDeviceModal';
import { Device } from '@/types/device';
import { getDevices, saveDevice, deleteDevice } from '@/lib/storage';
import { Search, LayoutGrid } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function AssetsPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setIsMounted(true);
    if (isAuthenticated) {
      setDevices(getDevices());
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

  const filteredDevices = devices.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-white">
      <Navbar onAddClick={() => setIsModalOpen(true)} />
      
      <section className="bg-[#f8f9fa] py-24 px-6 min-h-[calc(100vh-80px)]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold text-black tracking-tight mb-2">Asset Inventory</h1>
              <p className="text-gray-500 font-medium uppercase tracking-[0.2em] text-[10px]">Registry Management</p>
            </div>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Filter by serial or name..." 
                className="w-full bg-white border border-gray-200 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-[#2e7d32] transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-12">
            {filteredDevices.length > 0 ? (
              filteredDevices.map((device) => (
                <DeviceCard 
                  key={device.id} 
                  device={device} 
                  onDelete={handleDeleteDevice}
                />
              ))
            ) : (
              <div className="bg-white border border-dashed border-gray-300 rounded-3xl py-32 text-center">
                <p className="text-gray-500 font-medium">No assets found in the registry.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <AddDeviceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddDevice} 
      />
    </main>
  );
}
