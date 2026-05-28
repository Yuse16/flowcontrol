"use client";
import { useState } from 'react';
import { Search, Bell, Clock, Plus, ChevronDown } from 'lucide-react';
import { useTheme } from '@/context/ThemeProvider';
import { useReminders } from '@/hooks/useReminders';
import { ReminderModal } from '@/components/reminders/ReminderModal';
import { ReminderDropdown } from '@/components/reminders/ReminderDropdown';
import { useNavigation } from '@/context/NavigationContext';
import { Menu } from 'lucide-react';

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const { setModalOpen, reminders } = useReminders();
  const { setIsMobileMenuOpen } = useNavigation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const pendingCount = reminders.filter(r => r.status === 'pending').length;

  return (
    <header className="h-14 bg-white dark:bg-[#0a0a0a] border-b border-[#f3f4f6] dark:border-[#1f1f1f] flex items-center justify-between px-4 md:px-6 z-40 sticky top-0 transition-colors">
      
      {/* Top Global Search & Mobile Menu - Minimalist */}
      <div className="flex items-center gap-3 flex-1">
        
        {/* Mobile Hamburger Menu */}
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden p-2 -ml-2 text-gray-400 hover:text-[#111827] dark:hover:text-white transition-colors rounded-xl hover:bg-gray-50 dark:hover:bg-white/5"
        >
          <Menu size={20} />
        </button>

        <div className="relative w-full max-w-md md:max-w-lg group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-[#6366f1] transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-9 md:pl-10 pr-12 md:pr-16 py-2 rounded-xl bg-gray-50 dark:bg-[#171717] border-transparent text-[#111827] dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-[#1f1f1f] focus:ring-2 focus:ring-[#6366f1]/20 transition-all text-[13px] font-medium"
            placeholder="Buscar..."
          />
          <div className="absolute inset-y-0 right-2 md:right-3 flex items-center pointer-events-none hidden sm:flex">
            <span className="text-[9px] font-bold text-gray-400 bg-white dark:bg-[#0a0a0a] px-1.5 py-0.5 rounded border border-gray-200 dark:border-[#262626] shadow-sm">⌘K</span>
          </div>
        </div>
      </div>

      {/* Right Side Actions - Minimalist */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="p-1.5 text-gray-400 hover:text-[#6366f1] transition-all relative rounded-lg hover:bg-gray-50 dark:hover:bg-white/5"
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
        <button className="hidden sm:flex p-1.5 text-gray-400 hover:text-[#6366f1] transition-all rounded-lg hover:bg-gray-50 dark:hover:bg-white/5">
          <Clock size={18} />
        </button>

        {/* New Activity Button - Small & Elegant */}
        <button 
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-[#6366f1] text-white rounded-xl hover:bg-[#4f46e5] transition-all font-bold text-[11px] shadow-md shadow-[#6366f1]/20 ml-1"
        >
          <Plus size={14} strokeWidth={3} />
          <span className="hidden sm:inline">Nuevo</span>
        </button>
      </div>
    </header>
  );
}
