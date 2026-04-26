'use client';

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Battery, Wifi, Monitor, Trash2, ShieldCheck, AlertCircle, Info, Plus, Speaker, Cpu, Camera, Globe, ExternalLink, CheckCircle2, Download } from 'lucide-react';
import { Device, MaintenanceLog } from '@/types/device';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { updateDevice } from '@/lib/storage';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DeviceCardProps {
  device: Device;
  onDelete: (id: string) => void;
  isDetailView?: boolean;
}

export const DeviceCard = ({ device, onDelete, isDetailView = false }: DeviceCardProps) => {
  const [showLogForm, setShowLogForm] = useState(false);
  const [logs, setLogs] = useState<MaintenanceLog[]>(device.maintenanceLogs || []);
  const [newLog, setNewLog] = useState({ date: new Date().toLocaleDateString('en-GB'), description: '' });
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Healthy': return 'text-[#2e7d32]';
      case 'Warning': return 'text-[#fbc02d]';
      case 'Critical': return 'text-[#d32f2f]';
      default: return 'text-black';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'Healthy': return 'bg-[#e8f5e9]';
      case 'Warning': return 'bg-[#fffde7]';
      case 'Critical': return 'bg-[#ffebee]';
      default: return 'bg-gray-100';
    }
  };

  const handleAddLog = () => {
    if (!newLog.description) return;
    const updatedLogs = [newLog, ...logs];
    updateDevice(device.id, { maintenanceLogs: updatedLogs });
    setLogs(updatedLogs);
    setNewLog({ date: new Date().toLocaleDateString('en-GB'), description: '' });
    setShowLogForm(false);
  };

  const exportPDF = () => {
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(22);
      doc.setTextColor(46, 125, 50); // Dulang Green
      doc.text('DULANG DEVICE PASSPORT', 20, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('DIGITAL ASSET RECORD & VERIFICATION', 20, 28);
      
      doc.setDrawColor(238, 238, 238);
      doc.line(20, 35, 190, 35);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Asset Name: ${device.name}`, 20, 45);
      doc.text(`Brand/Model: ${device.brand} ${device.model}`, 20, 52);
      doc.text(`Serial Number: ${device.serialNumber}`, 20, 59);
      doc.text(`Owner: ${device.owner}`, 20, 66);
      doc.text(`Status: ${device.maintenanceStatus}`, 20, 73);

      const tableData = logs.map(log => [log.date, log.description]);
      autoTable(doc, {
        head: [['Date', 'Maintenance Description']],
        body: tableData,
        startY: 85,
        theme: 'striped',
        headStyles: { fillColor: [46, 125, 50] },
      });

      doc.save(`${device.name.replace(/\s+/g, '_')}_Passport.pdf`);
    } catch (err) {
      console.error("PDF Export Error:", err);
      alert("Failed to generate PDF. Please check the console for details.");
    }
  };

  const passportUrl = origin ? `${origin}/device/${device.id}` : '';

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-8 md:p-12">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* LEFT: IDENTITY */}
          <div className="lg:w-2/5 space-y-10">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 shrink-0 overflow-hidden">
                {device.imageUrl ? (
                  <img src={device.imageUrl} alt={device.name} className="w-full h-full object-cover" />
                ) : (
                  <Monitor className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-black leading-tight">{device.name}</h3>
                <p className="text-sm font-semibold text-[#2e7d32] uppercase tracking-wider">{device.brand} • {device.model}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-8 gap-x-8">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Mfg Date</p>
                <p className="text-sm font-bold text-gray-900">Oct 10, 2020</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">IMEI / Serial</p>
                <p className="text-sm font-mono font-bold text-gray-900">{device.serialNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Owner</p>
                <p className="text-sm font-bold text-gray-900 truncate">{device.owner}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</p>
                <div className={cn("inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter", getStatusBg(device.maintenanceStatus), getStatusColor(device.maintenanceStatus))}>
                  {device.maintenanceStatus}
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-xl space-y-4 border border-gray-100">
              <div className="flex justify-between items-center">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">System Metrics</h4>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    exportPDF();
                  }}
                  className="flex items-center gap-1 text-[10px] font-bold text-[#2e7d32] hover:underline"
                >
                  <Download className="w-3 h-3" /> EXPORT PDF
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[Battery, Cpu, Wifi].map((Icon, i) => (
                  <div key={i} className="bg-white p-3 rounded-lg flex flex-col items-center gap-2 border border-gray-100 shadow-sm">
                    <Icon className="w-4 h-4 text-gray-400" />
                    <CheckCircle2 className="w-3 h-3 text-[#2e7d32]" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: RECORDS */}
          <div className="lg:w-3/5 lg:border-l lg:border-gray-100 lg:pl-16 space-y-10">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-bold text-black">Maintenance Records</h4>
              {!isDetailView && (
                <button 
                  onClick={() => onDelete(device.id)}
                  className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="space-y-6">
              {logs.length > 0 ? (
                logs.map((log, i) => (
                  <div key={i} className="flex gap-6 pb-6 border-b border-gray-50 last:border-0">
                    <div className="text-xs font-bold text-gray-400 whitespace-nowrap pt-1">{log.date}</div>
                    <div className="text-sm text-gray-700 leading-relaxed font-medium">{log.description}</div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 italic">No records found for this asset.</p>
              )}
            </div>

            {showLogForm ? (
              <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
                <textarea 
                  placeholder="Describe the maintenance performed..." 
                  className="w-full bg-white border border-gray-200 rounded-lg p-4 text-sm outline-none focus:border-[#2e7d32] min-h-[100px]"
                  value={newLog.description}
                  onChange={(e) => setNewLog({ ...newLog, description: e.target.value })}
                />
                <div className="flex gap-3">
                  <button onClick={handleAddLog} className="bg-[#2e7d32] text-white text-xs font-bold px-6 py-2 rounded">SUBMIT</button>
                  <button onClick={() => setShowLogForm(false)} className="text-gray-500 text-xs font-bold px-4 py-2 hover:bg-gray-200 rounded">CANCEL</button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setShowLogForm(true)}
                className="flex items-center gap-2 text-xs font-bold text-[#2e7d32] hover:underline"
              >
                <Plus className="w-4 h-4" /> Add Record
              </button>
            )}

            <div className="pt-10 flex items-end justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Asset QR Passport</p>
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#2e7d32]">
                  <ShieldCheck className="w-3 h-3" /> DIGITAL VERIFICATION ACTIVE
                </div>
              </div>
              <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                {passportUrl ? (
                  <a href={passportUrl} target="_blank" rel="noopener noreferrer">
                    <QRCodeSVG value={passportUrl} size={80} level="H" />
                  </a>
                ) : (
                  <div className="w-20 h-20 bg-gray-50 animate-pulse rounded" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
