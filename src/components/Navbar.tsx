'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Smartphone, PieChart, Users, Settings, LogOut, Plus, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NavbarProps {
  onAddClick?: () => void;
}

export const Navbar = ({ onAddClick }: NavbarProps) => {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Smartphone },
    { name: 'Assets', path: '/assets', icon: Search },
    { name: 'Reports', path: '/reports', icon: PieChart },
    { name: 'Organization', path: '/organization', icon: Users },
  ];

  return (
    <nav className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-50 no-print">
      <div className="flex items-center gap-12">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-xl italic">D</span>
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900 group-hover:text-emerald-500 transition-colors">DULANG</span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                pathname === item.path 
                  ? "bg-slate-50 text-slate-900" 
                  : "text-slate-400 hover:text-slate-900 hover:bg-slate-50/50"
              )}
            >
              <item.icon className={cn("w-4 h-4", pathname === item.path ? "text-emerald-500" : "text-slate-300")} />
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {onAddClick && (
          <button 
            onClick={onAddClick}
            className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100"
          >
            <Plus className="w-4 h-4" /> Add Asset
          </button>
        )}
        <div className="w-px h-6 bg-slate-100 mx-2" />
        <button 
          onClick={logout}
          className="p-2.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
};
