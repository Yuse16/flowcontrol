import { ReactNode } from 'react';

interface StatWidgetProps {
  title: string;
  value: string | number;
  trend: string;
  trendUp: boolean;
  icon: ReactNode;
  colorClass?: string;
}

export function StatWidget({ title, value, trend, trendUp, icon, colorClass = "text-primary" }: StatWidgetProps) {
  return (
    <div className="relative bg-white dark:bg-[#171717] p-5 rounded-2xl border border-gray-100 dark:border-[#1f1f1f] shadow-sm hover:shadow-md transition-all group overflow-hidden" data-design-id="stat-widget-minimal">
      <div className="flex justify-between items-start mb-3">
        <div className={`w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-[#6366f1]`}>
          {icon}
        </div>
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${trendUp ? 'bg-green-50 text-green-500 border border-green-100' : 'bg-red-50 text-red-500 border border-red-100'}`}>
          {trend}
        </span>
      </div>
      
      <div className="relative z-10">
        <h3 className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">{title}</h3>
        <p className="text-2xl font-bold text-[#111827] dark:text-white mt-0.5 tracking-tight">{value}</p>
      </div>
    </div>
  );
}
