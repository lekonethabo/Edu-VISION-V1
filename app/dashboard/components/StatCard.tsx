import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, color, trend }) => {
  const colorMap: Record<string, string> = {
    rose: "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/50",
    emerald: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50",
    blue: "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/50",
    amber: "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50",
    purple: "bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/50",
    sea: "bg-teal-50 dark:bg-teal-950/20 text-[#00A3A3] border-teal-100 dark:border-teal-900/50",
  };

  const isPositive = trend && trend.includes('+');
  const isNegative = trend && trend.includes('-');

  return (
    <div className={`p-5 rounded-2xl border ${colorMap[color]} flex flex-col justify-between relative overflow-hidden`}>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <span className="p-2.5 rounded-xl bg-white/50 dark:bg-black/20 shadow-xs backdrop-blur-sm">
          {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "w-5 h-5" })}
        </span>
        {trend && (
          <span className={`text-[10px] font-bold px-2 py-1 rounded-lg bg-white/50 dark:bg-black/20 ${isPositive ? 'text-emerald-600' : isNegative ? 'text-rose-600' : 'text-slate-500'}`}>
            {trend}
          </span>
        )}
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-black uppercase tracking-wider opacity-80 mb-1">{title}</p>
        <h3 className="text-2xl font-mono font-bold tracking-tight mb-1">{value}</h3>
        <p className="text-[10px] font-semibold opacity-70 truncate">{subtitle}</p>
      </div>
      {/* Decorative background element */}
      <div className="absolute -bottom-4 -right-4 opacity-10 transform scale-150 pointer-events-none">
        {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "w-24 h-24" })}
      </div>
    </div>
  );
};
