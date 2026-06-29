import React from 'react';
import { motion } from 'motion/react';

interface ProgressBarProps {
  label: string;
  value: number;
  color: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ label, value, color }) => (
  <div>
    <div className="flex justify-between items-center mb-1.5">
      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{label}</span>
      <span className="text-[11px] font-mono font-bold text-slate-500">{value}%</span>
    </div>
    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full rounded-full ${color}`} 
      />
    </div>
  </div>
);
