'use client';

import { Device } from '@/types/device';

const getStorageKey = () => {
  if (typeof window === 'undefined') return 'device_passport_data';
  const apiKey = localStorage.getItem('gemini_api_key');
  if (!apiKey) return 'device_passport_data';
  
  // Create a simple hash of the API key to use as a unique storage bucket
  let hash = 0;
  for (let i = 0; i < apiKey.length; i++) {
    hash = ((hash << 5) - hash) + apiKey.charCodeAt(i);
    hash |= 0;
  }
  return `device_passport_data_${Math.abs(hash)}`;
};

export const getDevices = (): Device[] => {
  if (typeof window === 'undefined') return [];
  const key = getStorageKey();
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

export const saveDevice = (device: Device) => {
  const key = getStorageKey();
  const devices = getDevices();
  const updated = [...devices, device];
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
