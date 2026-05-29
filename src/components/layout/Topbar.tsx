"use client";
import { useState } from 'react';
import { Bell, Menu } from 'lucide-react';
import { useReminders } from '@/hooks/useReminders';
import { ReminderDropdown } from '@/components/reminders/ReminderDropdown';
import { useNavigation } from '@/context/NavigationContext';
import { UzalaWordmark } from '@/components/brand/UzalaWordmark';

export function Topbar() {
  const { setIsMobileMenuOpen } = useNavigation();
  const { reminders } = useReminders();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const pendingCount = reminders.filter(r => r.status === 'pending').length;

  return (
    <header className="h-14 bg-[#050508] border-b border-[#2A2A3C] flex items-center justify-between px-4 md:px-6 z-40 sticky top-0">
      {/* Mobile header */}
      <div className="flex items-center justify-between w-full md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors rounded-xl"
        >
          <Menu size={22} />
        </button>

        <UzalaWordmark size="sm" />

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors relative rounded-xl"
          >
            <Bell size={22} />
            {pendingCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#8A2BE2] rounded-full border border-[#050508]" />
            )}
          </button>
          <ReminderDropdown
            isOpen={isDropdownOpen}
            onClose={() => setIsDropdownOpen(false)}
          />
        </div>
      </div>

      {/* Desktop header */}
      <div className="hidden md:flex items-center justify-between w-full">
        <UzalaWordmark size="md" />
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="p-2 text-gray-400 hover:text-white transition-colors relative rounded-xl hover:bg-white/5"
          >
            <Bell size={20} />
            {pendingCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#8A2BE2] rounded-full border border-[#050508]" />
            )}
          </button>
          <ReminderDropdown
            isOpen={isDropdownOpen}
            onClose={() => setIsDropdownOpen(false)}
          />
        </div>
      </div>
    </header>
  );
}
