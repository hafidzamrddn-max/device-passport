'use client';

import React, { useState, useEffect } from 'react';
import { Plus, ShieldCheck, AlertTriangle, List, LayoutGrid, Search, ArrowRight, CheckCircle2, Download, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { DeviceCard } from '@/components/DeviceCard';
import { AddDeviceModal } from '@/components/AddDeviceModal';
import { Device } from '@/types/device';
import { getDevices, saveDevice, deleteDevice } from '@/lib/storage';
import { useAuth } from '@/hooks/useAuth';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export default function Dashboard() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
            serialNumber: '8615360***6001',
            owner: 'kreshna@dulang.id',
            imageUrl: 'https://images.unsplash.com/photo-1610792516307-ea5acd3c3900?auto=format&fit=crop&q=80&w=300',
            maintenanceStatus: 'Healthy',
            maintenanceLogs: [
              { date: '12/01/2021', description: 'cracked screen replaced with an original screen part' },
              { date: '05/03/2021', description: 'drained battery replaced with a new battery model 2138238-hgh' },
              { date: '05/10/2021', description: 'Microphone and speaker muted problems fixed by cleaning the particular components' }
            ],
            purchaseHistory: [
              { date: '10/01/2021', seller: 'Official Samsung Store' }
            ],
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

  const exportFullRegistryPDF = () => {
    const doc = new jsPDF() as any;
    doc.setFontSize(22);
    doc.text('DULANG ASSET REGISTRY REPORT', 20, 20);
    
    const tableData = devices.map(d => [
      d.name,
      d.serialNumber,
      d.owner,
      d.maintenanceStatus,
      (d.maintenanceLogs || []).length.toString()
    ]);

    doc.autoTable({
      head: [['Asset Name', 'Serial Number', 'Owner', 'Status', 'Log Count']],
      body: tableData,
      startY: 30,
    });

    doc.save(`Dulang_Full_Registry_${new Date().toLocaleDateString()}.pdf`);
  };

  if (!isMounted || !isAuthenticated) return null;

  const filteredDevices = devices.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              Coordinated, end-to-end execution for asset decommissioning, value recovery, and responsible liquidation.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="btn-primary"
              >
                Add New Asset
              </button>
              <button 
                onClick={exportFullRegistryPDF}
                className="px-8 py-3 rounded-md border border-gray-200 font-bold hover:bg-gray-50 transition-all uppercase tracking-wider text-xs flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Export Registry
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#f8f9fa] p-8 rounded-2xl border border-gray-100 space-y-2">
              <div className="text-4xl font-bold text-[#2e7d32]">{devices.length}</div>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-500">Total Registered</div>
            </div>
            <div className="bg-[#f8f9fa] p-8 rounded-2xl border border-gray-100 space-y-2">
              <div className="text-4xl font-bold text-[#2e7d32]">{devices.filter(d => d.maintenanceStatus === 'Healthy').length}</div>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-500">Systems Healthy</div>
            </div>
            <div className="bg-[#f8f9fa] p-8 rounded-2xl border border-gray-100 space-y-2 col-span-2">
              <div className="text-4xl font-bold text-[#fbc02d]">{devices.filter(d => d.maintenanceStatus !== 'Healthy').length}</div>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-500">Attention Required</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Registry Section */}
      <section className="bg-[#f8f9fa] py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <h2 className="text-3xl font-bold text-black tracking-tight">Active Passport Registry</h2>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by name or serial number..." 
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
                <p className="text-gray-500 font-medium">No assets found matching your registry search.</p>
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
