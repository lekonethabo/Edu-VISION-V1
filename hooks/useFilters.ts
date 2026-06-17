"use client";

import { useState, useMemo } from "react";

export function useFilters<T>(
  items: T[],
  searchFields: (keyof T)[],
  initialFilters: Partial<Record<keyof T, string>> = {}
) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Partial<Record<keyof T, string>>>(initialFilters);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. Search Query Filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesSearch = searchFields.some((field) => {
          const value = item[field];
          if (value === null || value === undefined) return false;
          if (Array.isArray(value)) {
            return value.some(v => String(v).toLowerCase().includes(query));
          }
          return String(value).toLowerCase().includes(query);
        });
        if (!matchesSearch) return false;
      }

      // 2. Dropdown / Active Filters
      for (const key in activeFilters) {
        const filterVal = activeFilters[key];
        if (filterVal && filterVal !== "All" && filterVal !== "") {
          const value = item[key];
          
          if (Array.isArray(value)) {
            if (!value.includes(filterVal)) return false;
          } else if (String(value) !== filterVal) {
            return false;
          }
        }
      }

      return true;
    });
  }, [items, searchFields, searchQuery, activeFilters]);

  const setFilterVal = (key: keyof T, val: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const clearFilters = () => {
    setSearchQuery("");
    setActiveFilters({});
  };

  return {
    searchQuery,
    setSearchQuery,
    activeFilters,
    setFilterVal,
    clearFilters,
    filteredItems,
  };
}
