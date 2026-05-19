"use client";
import { useState } from 'react';
import { Search, Bell, Clock, Plus, ChevronDown } from 'lucide-react';
import { useTheme } from '@/context/ThemeProvider';
import { useReminders } from '@/hooks/useReminders';
import { ReminderModal } from '@/components/reminders/ReminderModal';
import { ReminderDropdown } from '@/components/reminders/ReminderDropdown';

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const { setModalOpen, reminders } = useReminders();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const pendingCount = reminders.filter(r => r.status === 'pending').length;

  return (
    <header className="h-14 bg-white dark:bg-[#0a0a0a] border-b border-[#f3f4f6] dark:border-[#1f1f1f] flex items-center justify-between px-6 z-40 sticky top-0">
      
      {/* Top Global Search - Minimalist */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-lg group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-16 py-2 rounded-xl bg-gray-50 dark:bg-[#171717] border-transparent text-[#111827] dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-[#1f1f1f] focus:ring-2 focus:ring-primary/10 transition-all text-[13px] font-medium"
            placeholder="Buscar..."
          />
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <span className="text-[9px] font-bold text-gray-400 bg-white dark:bg-black px-1.5 py-0.5 rounded border border-border">⌘K</span>
          </div>
        </div>
      </div>

      {/* Right Side Actions - Minimalist */}
      <div className="flex items-center gap-5">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="p-1.5 text-gray-400 hover:text-primary transition-all relative"
          >
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full border border-white dark:border-[#0a0a0a]" />
          </button>
          <ReminderDropdown 
            isOpen={isDropdownOpen} 
            onClose={() => setIsDropdownOpen(false)} 
          />
        </div>

        {/* Timer Icon */}
        <button className="p-1.5 text-gray-400 hover:text-primary transition-all">
          <Clock size={18} />
        </button>

        {/* New Activity Button - Small & Elegant */}
        <button 
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all font-bold text-[11px] shadow-sm shadow-primary/20"
        >
          <Plus size={14} strokeWidth={3} />
          <span>Nuevo</span>
        </button>
      </div>
    </header>
  );
}
