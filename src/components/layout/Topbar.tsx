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
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="p-2 text-gray-400 hover:text-white transition-colors rounded-xl"
      >
        <Menu size={22} />
      </button>

      <div className="absolute inset-x-0 flex justify-center pointer-events-none md:static md:relative">
        <div className="pointer-events-auto">
          <UzalaWordmark size="sm" />
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="p-2 text-gray-400 hover:text-white transition-colors relative rounded-xl hover:bg-white/5"
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
    </header>
  );
}
