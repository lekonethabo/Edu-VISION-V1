"use client";

import React from "react";
import { Search, X } from "lucide-react";

export interface FilterSelectConfig {
  key: string;
  label: string;
  value: string;
  options: string[] | { label: string; value: string }[];
  onChange: (value: string) => void;
}

interface FilterBarProps {
  searchPlaceholder?: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filters?: FilterSelectConfig[];
  onClear?: () => void;
  id?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchPlaceholder = "Search records...",
  searchQuery,
  onSearchChange,
  filters = [],
  onClear,
  id = "filter-bar"
}) => {
  return (
    <div
      id={id}
      className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800/50 mb-6"
    >
      {/* Search Input Block */}
      <div className="relative flex-1 max-w-md">
        <label htmlFor={`search-input-${id}`} className="sr-only">
          {searchPlaceholder}
        </label>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          id={`search-input-${id}`}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="block w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded focus:outline-none focus:ring-1 focus:ring-prussian focus:border-prussian dark:text-slate-100 placeholder-slate-400"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdowns Block */}
      <div className="flex flex-wrap items-center gap-3">
        {filters.map((f) => {
          const selectId = `filter-select-${f.key}-${id}`;
          return (
            <div key={f.key} className="flex flex-col sm:flex-row sm:items-center gap-1.5">
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {f.label}:
              </span>
              <select
                id={selectId}
                value={f.value}
                onChange={(e) => f.onChange(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-prussian dark:text-slate-100"
              >
                <option value="All">All {f.label}s</option>
                {f.options.map((option) => {
                  const optVal = typeof option === "string" ? option : option.value;
                  const optLabel = typeof option === "string" ? option : option.label;
                  return (
                    <option key={optVal} value={optVal}>
                      {optLabel}
                    </option>
                  );
                })}
              </select>
            </div>
          );
        })}

        {/* Clear Filters Button */}
        {onClear && (searchQuery || filters.some((f) => f.value && f.value !== "All")) && (
          <button
            onClick={onClear}
            className="text-xs font-semibold text-golden hover:underline focus:outline-none"
            type="button"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
