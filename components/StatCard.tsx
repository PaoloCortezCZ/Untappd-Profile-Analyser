import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  subValue?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color = "text-amber-500", subValue }) => {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-lg flex items-center justify-between transition-colors duration-300">
      <div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">{value}</h3>
        {subValue && <p className="text-slate-500 text-xs mt-1">{subValue}</p>}
      </div>
      <div className={`p-3 rounded-full bg-slate-100 dark:bg-slate-700/50 ${color}`}>
        <Icon size={28} />
      </div>
    </div>
  );
};

export default StatCard;