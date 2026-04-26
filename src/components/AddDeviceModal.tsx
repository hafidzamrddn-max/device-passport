'use client';

import React, { useState } from 'react';
import { X, Smartphone, User, Hash, Settings, Info, ChevronRight, Image as ImageIcon, Wand2 } from 'lucide-react';
import { Device, MaintenanceStatus } from '@/types/device';

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (device: Device) => void;
}

export const AddDeviceModal = ({ isOpen, onClose, onAdd }: AddDeviceModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    serialNumber: '',
    owner: '',
    maintenanceStatus: 'Healthy' as MaintenanceStatus,
    imageUrl: '',
  });

  const [autoGenImage, setAutoGenImage] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalImageUrl = formData.imageUrl;
    if (autoGenImage) {
      // Use loremflickr for better dynamic keyword matching
      const keywords = `${formData.brand},${formData.model},${formData.name}`.replace(/\s+/g, ',').toLowerCase();
      finalImageUrl = `https://loremflickr.com/600/600/${keywords}`;
    }

    const newDevice: Device = {
      ...formData,
      imageUrl: finalImageUrl || 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&q=80&w=600',
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      maintenanceLogs: [
        { date: new Date().toLocaleDateString('en-GB'), description: 'Asset registered in registry' }
      ],
      purchaseHistory: [
        { date: new Date().toLocaleDateString('en-GB'), seller: 'Verified Vendor' }
      ],
    };
    onAdd(newDevice);
    onClose();
    setFormData({
      name: '',
      brand: '',
      model: '',
      serialNumber: '',
      owner: '',
      maintenanceStatus: 'Healthy',
      imageUrl: '',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-y-auto custom-scrollbar">
          {/* Left Side: Info */}
          <div className="bg-[#2e7d32] p-12 text-white md:w-2/5 space-y-6 sticky top-0">
            <h2 className="text-3xl font-bold leading-tight">Asset Registration</h2>
            <p className="text-sm opacity-80 leading-relaxed">
              Register your end-of-use assets to start the value recovery and management process.
            </p>
            <div className="pt-8 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl border border-white/10">
                <Wand2 className="w-6 h-6" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest">AI Image Gen</p>
                  <p className="text-[10px] opacity-70">Auto-match asset visuals from global registry</p>
                </div>
              </div>
              <ul className="space-y-4">
                {['Identity verification', 'Lifecycle tracking', 'Value assessment'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
                    <ChevronRight className="w-4 h-4" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="p-12 md:w-3/5">
            <div className="flex justify-end mb-4">
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Asset Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Dell Latitude 7420"
                    className="w-full border-b-2 border-gray-100 py-2 text-sm outline-none focus:border-[#2e7d32] transition-colors"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Brand</label>
                    <input
                      required
                      type="text"
                      className="w-full border-b-2 border-gray-100 py-2 text-sm outline-none focus:border-[#2e7d32]"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Model</label>
                    <input
                      required
                      type="text"
                      className="w-full border-b-2 border-gray-100 py-2 text-sm outline-none focus:border-[#2e7d32]"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Serial Number</label>
                    <input
                      required
                      type="text"
                      className="w-full border-b-2 border-gray-100 py-2 text-sm outline-none focus:border-[#2e7d32]"
                      value={formData.serialNumber}
                      onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</label>
                    <select
                      className="w-full border-b-2 border-gray-100 py-2 text-sm outline-none focus:border-[#2e7d32] bg-transparent"
                      value={formData.maintenanceStatus}
                      onChange={(e) => setFormData({ ...formData, maintenanceStatus: e.target.value as MaintenanceStatus })}
                    >
                      <option value="Healthy">Healthy</option>
                      <option value="Warning">Warning</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Asset Visual</label>
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                      <button 
                        type="button"
                        onClick={() => setAutoGenImage(true)}
                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${autoGenImage ? 'bg-white shadow-sm text-[#2e7d32]' : 'text-gray-400'}`}
                      >
                        AUTO
                      </button>
                      <button 
                        type="button"
                        onClick={() => setAutoGenImage(false)}
                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${!autoGenImage ? 'bg-white shadow-sm text-[#2e7d32]' : 'text-gray-400'}`}
                      >
                        MANUAL
                      </button>
                    </div>
                  </div>

                  {!autoGenImage ? (
                    <div className="space-y-1">
                      <input
                        type="url"
                        placeholder="Paste image URL here..."
                        className="w-full border-b-2 border-gray-100 py-2 text-sm outline-none focus:border-[#2e7d32]"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      />
                    </div>
                  ) : (
                    <div className="p-4 bg-[#e8f5e9] rounded-xl flex items-center gap-4 border border-[#2e7d32]/10">
                      <ImageIcon className="w-5 h-5 text-[#2e7d32]" />
                      <p className="text-[10px] font-bold text-[#2e7d32]/80 uppercase">AI will automatically find a match based on brand & model</p>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Current Owner</label>
                  <input
                    required
                    type="text"
                    className="w-full border-b-2 border-gray-100 py-2 text-sm outline-none focus:border-[#2e7d32]"
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-primary h-14"
              >
                Register Asset
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
