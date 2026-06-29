import React from 'react';
import { AlertTriangle, FileText, CheckCircle } from 'lucide-react';

interface AlertItemProps {
  type: 'danger' | 'warning' | 'info' | 'success';
  title: string;
  desc: string;
  time: string;
}

export const AlertItem: React.FC<AlertItemProps> = ({ type, title, desc, time }) => {
  const styles = {
    danger: "border-rose-200 bg-rose-50 dark:border-rose-900/30 dark:bg-rose-950/10 text-rose-700 dark:text-rose-400",
    warning: "border-amber-200 bg-amber-50 dark:border-amber-900/30 dark:bg-amber-950/10 text-amber-700 dark:text-amber-400",
    info: "border-blue-200 bg-blue-50 dark:border-blue-900/30 dark:bg-blue-950/10 text-blue-700 dark:text-blue-400",
    success: "border-emerald-200 bg-emerald-50 dark:border-emerald-900/30 dark:bg-emerald-950/10 text-emerald-700 dark:text-emerald-400",
  };

  const icons = {
    danger: <AlertTriangle className="w-4 h-4 text-rose-500" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-500" />,
    info: <FileText className="w-4 h-4 text-blue-500" />,
    success: <CheckCircle className="w-4 h-4 text-emerald-500" />
  };

  return (
    <div className={`p-3 rounded-xl border ${styles[type]} flex gap-3`}>
      <div className="mt-0.5">{icons[type]}</div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h4 className="text-xs font-bold">{title}</h4>
          <span className="text-[9px] font-bold uppercase opacity-60">{time}</span>
        </div>
        <p className="text-[10px] font-medium opacity-80 mt-1 leading-snug">{desc}</p>
      </div>
    </div>
  );
};
