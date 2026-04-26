'use client';

import { Device } from '@/types/device';

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

// USER PROFILE LOGIC
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
