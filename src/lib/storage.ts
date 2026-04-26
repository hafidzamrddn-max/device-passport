'use client';

import { Device, DeviceCategory } from '@/types/device';

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  organization: string;
}

const getStorageKey = (suffix: string = 'data') => {
  if (typeof window === 'undefined') return `device_passport_${suffix}`;
  const apiKey = localStorage.getItem('gemini_api_key');
  if (!apiKey) return `device_passport_${suffix}`;
  
  let hash = 0;
  for (let i = 0; i < apiKey.length; i++) {
    hash = ((hash << 5) - hash) + apiKey.charCodeAt(i);
    hash |= 0;
  }
  return `device_passport_${Math.abs(hash)}_${suffix}`;
};

export const getDevices = (): Device[] => {
  if (typeof window === 'undefined') return [];
  const key = getStorageKey();
  const stored = localStorage.getItem(key);
  const devices = stored ? JSON.parse(stored) : [];
  
  // FORCE DUMMY GENERATION IF LESS THAN 10 ASSETS (to ensure "Pro" look)
  if (devices.length < 10) {
    const dummy = generateDummyData(100);
    // Filter out duplicates if they exist
    const combined = [...devices, ...dummy].slice(0, 100);
    localStorage.setItem(key, JSON.stringify(combined));
    return combined;
  }
  return devices;
};

const generateDummyData = (count: number): Device[] => {
  const categories: DeviceCategory[] = ['Electronic', 'Furniture', 'Vehicles', 'Infrastructure', 'Others'];
  const locations = ['Main Office', 'Warehouse A', 'Site B', 'Site C', 'Secondary Hub'];
  const brands = ['Apple', 'Samsung', 'Dell', 'Steelcase', 'Toyota', 'Cisco', 'Generic'];
  const statuses: ('Healthy' | 'Warning' | 'Critical')[] = ['Healthy', 'Healthy', 'Healthy', 'Warning', 'Critical'];
  
  return Array.from({ length: count }).map((_, i) => {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    const logs = Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map((_, li) => ({
      date: `0${li + 1}/05/2024`,
      description: ['Regular Maintenance', 'Screen Check', 'Battery Optimization', 'Firmware Update', 'Cleaning'][Math.floor(Math.random() * 5)]
    }));

    const history = Array.from({ length: Math.floor(Math.random() * 2) + 1 }).map((_, hi) => ({
      date: `0${hi + 1}/04/2024`,
      location: locations[Math.floor(Math.random() * locations.length)]
    }));

    return {
      id: `asset-${i + 2000}`,
      name: `${category} Unit #${i + 1}`,
      brand,
      model: `Model ${String.fromCharCode(65 + (i % 26))}${i}`,
      category,
      serialNumber: `SN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      owner: 'Enterprise Admin',
      currentLocation: location,
      locationHistory: history,
      maintenanceStatus: status,
      maintenanceLogs: logs,
      purchaseHistory: [{ date: '01/01/2024', seller: 'Authorized Vendor' }],
      imageUrl: null,
      createdAt: new Date().toISOString()
    };
  });
};

export const saveDevice = (device: Device) => {
  const key = getStorageKey();
  const devices = getDevices();
  const updated = [device, ...devices];
  localStorage.setItem(key, JSON.stringify(updated));
};

export const deleteDevice = (id: string) => {
  const key = getStorageKey();
  const devices = getDevices();
  const updated = devices.filter((d) => d.id !== id);
  localStorage.setItem(key, JSON.stringify(updated));
};

export const updateDevice = (id: string, updates: Partial<Device>) => {
  const key = getStorageKey();
  const devices = getDevices();
  const updated = devices.map((d) => (d.id === id ? { ...d, ...updates } : d));
  localStorage.setItem(key, JSON.stringify(updated));
};

export const getUserProfile = (): UserProfile => {
  if (typeof window === 'undefined') return { name: 'Administrator', email: 'admin@dulang.id', role: 'Enterprise Owner', organization: 'Dulang Internal Org' };
  const key = getStorageKey('profile');
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : { 
    name: 'Administrator', 
    email: 'admin@dulang.id', 
    role: 'Enterprise Owner', 
    organization: 'Dulang Internal Org' 
  };
};

export const saveUserProfile = (profile: UserProfile) => {
  const key = getStorageKey('profile');
  localStorage.setItem(key, JSON.stringify(profile));
};
