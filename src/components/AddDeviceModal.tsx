'use client';

import React, { useState } from 'react';
import { X, Smartphone, User, Hash, Settings, Info, ChevronRight, Image as ImageIcon, Wand2, MapPin, Tag } from 'lucide-react';
import { Device, MaintenanceStatus, DeviceCategory } from '@/types/device';

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (device: Device) => void;
}

const CATEGORY_IMAGES: Record<DeviceCategory, string> = {
  'Electronic': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop',
  'Furniture': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop',
  'Vehicles': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop',
  'Infrastructure': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop',
  'Others': 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=600&auto=format&fit=crop'
};

export const AddDeviceModal = ({ isOpen, onClose, onAdd }: AddDeviceModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    category: 'Electronic' as DeviceCategory,
    serialNumber: '',
    owner: '',
    currentLocation: '',
    maintenanceStatus: 'Healthy' as MaintenanceStatus,
    imageUrl: '',
  });

  const [autoGenImage, setAutoGenImage] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalImageUrl = formData.imageUrl;
    if (autoGenImage) {
      // Mapping categories to specific Unsplash keywords
      const categoryKeywords: Record<DeviceCategory, string> = {
        'Electronic': 'technology',
        'Furniture': 'office,furniture',
        'Vehicles': 'car,ev',
        'Infrastructure': 'architecture,industrial',
        'Others': 'object,minimal'
      };

      let keywords = categoryKeywords[formData.category];
      
      // Specific keyword overrides
      const nameLower = formData.name.toLowerCase();
      if (nameLower.includes('laptop')) keywords = 'macbook,laptop';
      if (nameLower.includes('phone')) keywords = 'iphone,smartphone';
      if (nameLower.includes('monitor')) keywords = 'display,setup';
      if (nameLower.includes('camera')) keywords = 'dslr,lens';

      // Append brand for more specificity
      finalImageUrl = `https://source.unsplash.com/featured/600x600/?${keywords},${formData.brand.toLowerCase()}`;
    }

    const newDevice: Device = {
      ...formData,
      imageUrl: finalImageUrl,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      locationHistory: [
        { date: new Date().toLocaleDateString('en-GB'), location: formData.currentLocation || 'Initial Registry' }
      ],
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
      category: 'Electronic',
      serialNumber: '',
      owner: '',
      currentLocation: '',
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
              Define category and location to enable precise lifecycle tracking and value recovery.
            </p>
            <div className="pt-8 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl border border-white/10">
                <Tag className="w-6 h-6" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest">Category-Based</p>
                  <p className="text-[10px] opacity-70">Automatic visual matching per category</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl border border-white/10">
                <MapPin className="w-6 h-6" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest">Location Tracking</p>
                  <p className="text-[10px] opacity-70">Monitor asset movement across facilities</p>
                </div>
              </div>
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
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</label>
                    <select
                      className="w-full border-b-2 border-gray-100 py-2 text-sm outline-none focus:border-[#2e7d32] bg-transparent"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as DeviceCategory })}
                    >
                      <option value="Electronic">Electronic</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Vehicles">Vehicles</option>
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Asset Name</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Dell Latitude"
                      className="w-full border-b-2 border-gray-100 py-2 text-sm outline-none focus:border-[#2e7d32]"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
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
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Current Location</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Warehouse A"
                      className="w-full border-b-2 border-gray-100 py-2 text-sm outline-none focus:border-[#2e7d32]"
                      value={formData.currentLocation}
                      onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Visual Identification</label>
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                      <button 
                        type="button"
                        onClick={() => setAutoGenImage(true)}
                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${autoGenImage ? 'bg-white shadow-sm text-[#2e7d32]' : 'text-gray-400'}`}
                      >
                        SMART MATCH
                      </button>
                      <button 
                        type="button"
                        onClick={() => setAutoGenImage(false)}
                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${!autoGenImage ? 'bg-white shadow-sm text-[#2e7d32]' : 'text-gray-400'}`}
                      >
                        MANUAL URL
                      </button>
                    </div>
                  </div>

                  {!autoGenImage ? (
                    <input
                      type="url"
                      placeholder="Paste image URL here..."
                      className="w-full border-b-2 border-gray-100 py-2 text-sm outline-none focus:border-[#2e7d32]"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    />
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-4 border border-gray-100">
                      <ImageIcon className="w-5 h-5 text-gray-400" />
                      <p className="text-[10px] font-bold text-gray-500 uppercase">Image will be automatically assigned based on category and model</p>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Responsible Owner</label>
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
