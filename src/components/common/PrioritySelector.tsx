"use client";
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Flag } from 'lucide-react';
import { PriorityLevel } from '@/types/common';

interface PrioritySelectorProps {
  value: PriorityLevel;
  onChange: (value: PriorityLevel) => void;
  label?: string;
}

const priorities: { value: PriorityLevel; label: string; color: string; bg: string }[] = [
  { value: 'low', label: 'Baja', color: 'text-teal-400', bg: 'bg-teal-500/10' },
  { value: 'medium', label: 'Media', color: 'text-sky-400', bg: 'bg-sky-500/10' },
  { value: 'high', label: 'Alta', color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { value: 'urgent', label: 'Crítica', color: 'text-red-400', bg: 'bg-red-500/10' },
];

export function PrioritySelector({ value, onChange, label = "Prioridad" }: PrioritySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentPriority = priorities.find(p => p.value === value) || priorities[1];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      {label && (
        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-uzala-purple ml-1">
          <Flag size={12} /> {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-3.5 glass bg-white/5 border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-uzala-purple/30 transition-all"
      >
        <div className="flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full ${currentPriority.bg.replace('/10', '')}`} />
          <span className="font-bold">{currentPriority.label}</span>
        </div>
        <ChevronDown size={16} className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="absolute z-[160] left-0 right-0 mt-2 p-2 glass border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden"
          >
            <div className="flex flex-col gap-1">
              {priorities.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => {
                    onChange(p.value);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    value === p.value 
                      ? 'bg-uzala-purple/20 text-white' 
                      : 'hover:bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${p.bg.replace('/10', '')}`} />
                    <span className="font-bold text-xs">{p.label}</span>
                  </div>
                  {value === p.value && <div className="w-1.5 h-1.5 rounded-full bg-uzala-purple" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
