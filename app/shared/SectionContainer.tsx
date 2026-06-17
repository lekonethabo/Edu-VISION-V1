"use client";

import React from "react";

interface SectionContainerProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  id?: string;
}

export const SectionContainer: React.FC<SectionContainerProps> = ({
  title,
  description,
  action,
  children,
  id = ""
}) => {
  const containerId = id || title.toLowerCase().replace(/\s+/g, "-");
  return (
    <div
      id={`section-${containerId}`}
      className="bg-white dark:bg-ink border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden"
    >
      {/* Header Area */}
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-prussian dark:text-slate-100 uppercase tracking-tight">
            {title}
          </h2>
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {description}
            </p>
          )}
        </div>
        {action && <div className="sm:self-center flex-shrink-0">{action}</div>}
      </div>

      {/* Main Content Area */}
      <div className="p-6">{children}</div>
    </div>
  );
};

export default SectionContainer;
