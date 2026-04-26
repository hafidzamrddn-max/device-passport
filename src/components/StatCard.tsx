import React from 'react';
import { LucideIcon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  colorClass?: string;
}

export const StatCard = ({ title, value, icon: Icon, colorClass }: StatCardProps) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-brand-border flex items-center justify-between group hover:border-brand-accent/30 transition-all duration-300 shadow-sm">
      <div>
        <p className="text-brand-text-muted text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-3xl font-serif font-bold text-brand-text-main">{value}</h3>
      </div>
      <div className={cn(
        "p-3 rounded-xl bg-slate-50 border border-brand-border transition-transform group-hover:scale-110",
        colorClass
      )}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};
