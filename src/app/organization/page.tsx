'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { User, Mail, ShieldCheck, Database, Calendar, Smartphone, Settings, X, Save, History } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getDevices, getUserProfile, saveUserProfile, UserProfile } from '@/lib/storage';

export default function OrganizationPage() {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState({ total: 0, healthy: 0, warning: 0 });
  const [profile, setProfile] = useState<UserProfile>({ name: '', email: '', role: '', organization: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile>({ name: '', email: '', role: '', organization: '' });

  useEffect(() => {
    if (isAuthenticated) {
      const devices = getDevices();
      setStats({
        total: devices.length,
        healthy: devices.filter(d => d.maintenanceStatus === 'Healthy').length,
        warning: devices.filter(d => d.maintenanceStatus !== 'Healthy').length
      });
      const userProfile = getUserProfile();
      setProfile(userProfile);
      setEditForm(userProfile);
    }
  }, [isAuthenticated]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    saveUserProfile(editForm);
    setProfile(editForm);
    setIsEditing(false);
  };

  if (!isAuthenticated) return null;

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <section className="bg-[#f8f9fa] py-24 px-6 min-h-[calc(100vh-80px)]">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
            <div className="h-32 bg-[#2e7d32]" />
            
            <div className="p-12 -mt-20">
              <div className="flex flex-col md:flex-row items-end gap-6 mb-12">
                <div className="w-32 h-32 bg-white rounded-2xl border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                  <User className="w-16 h-16 text-gray-300" />
                </div>
                <div className="pb-4 space-y-1">
                  <h1 className="text-3xl font-bold text-black tracking-tight">{profile.name || 'Administrator'}</h1>
                  <p className="text-gray-500 font-medium">{profile.role || 'Enterprise Owner'}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-6 md:col-span-1">
                  <div className="space-y-4">
                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Account Details</h2>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                        <Mail className="w-4 h-4 text-gray-400" /> {profile.email}
                      </div>
                      <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                        <Database className="w-4 h-4 text-gray-400" /> {profile.organization}
                      </div>
                      <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                        <ShieldCheck className="w-4 h-4 text-[#2e7d32]" /> Verified Administrator
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-50">
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 text-xs font-bold text-[#2e7d32] hover:underline uppercase tracking-widest"
                    >
                      <Settings className="w-4 h-4" /> Account Settings
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <Smartphone className="w-3 h-3" /> Managed Assets
                      </div>
                      <div className="text-4xl font-bold text-black">{stats.total}</div>
                    </div>
                    <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <History className="w-3 h-3" /> System Health
                      </div>
                      <div className="text-4xl font-bold text-[#2e7d32]">{stats.total > 0 ? Math.round((stats.healthy / stats.total) * 100) : 0}%</div>
                    </div>
                  </div>

                  <div className="p-8 bg-[#e8f5e9] rounded-2xl border border-[#2e7d32]/10 flex items-center gap-6">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-6 h-6 text-[#2e7d32]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-black uppercase tracking-tight">Identity Verification Active</h3>
                      <p className="text-xs text-[#2e7d32]/70 font-medium">Your account is currently linked to a unique Gemini API environment. All assets are isolated and secure.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Settings Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-black">Update Profile</h2>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-black">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400">Full Name</label>
                  <input 
                    required
                    className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-[#2e7d32]"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400">Email Address</label>
                  <input 
                    required
                    type="email"
                    className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-[#2e7d32]"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400">Professional Role</label>
                  <input 
                    required
                    className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-[#2e7d32]"
                    value={editForm.role}
                    onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400">Organization</label>
                  <input 
                    required
                    className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-[#2e7d32]"
                    value={editForm.organization}
                    onChange={(e) => setEditForm({...editForm, organization: e.target.value})}
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-[#2e7d32] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#1b5e20] transition-all"
              >
                <Save className="w-5 h-5" /> SAVE SETTINGS
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
