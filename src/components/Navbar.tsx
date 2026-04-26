'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, User as UserIcon } from 'lucide-react';
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
    { name: 'Dashboard', href: '/' },
    { name: 'Assets', href: '/assets' },
    { name: 'Reports', href: '/reports' },
    { name: 'Organization', href: '/organization' },
  ];

  return (
    <nav className="border-b border-gray-100 bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="text-3xl font-black italic tracking-tighter text-black hover:opacity-80 transition-opacity">
            DULANG
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
            {navItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href}
                className={cn(
                  "hover:text-black cursor-pointer transition-colors pb-7 mt-7",
                  pathname === item.href ? "text-black border-b-2 border-[#2e7d32]" : "border-b-2 border-transparent"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          {onAddClick && (
            <button 
              onClick={onAddClick}
              className="btn-primary"
            >
              Add Asset
            </button>
          )}
          <button 
            onClick={logout}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};
