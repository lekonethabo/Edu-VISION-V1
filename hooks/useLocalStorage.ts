"use client";

import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(
  keySuffix: string,
  initialValues: T[]
) {
  const key = `edu_vision_${keySuffix}`;
  const [data, setData] = useState<T[]>(() => {
    // Return early if not on client side to avoid SSR mismatch
    if (typeof window === "undefined") {
      return initialValues;
    }
    try {
      const stored = window.localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Local storage read error for core key:", key, e);
    }
    return initialValues;
  });

  // Keep state and localstorage updated together
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error("Local storage write error for key:", key, e);
    }
  }, [key, data]);

  const items = data;

  const addItem = useCallback((item: T) => {
    setData((prev) => [item, ...prev]);
  }, []);

  const updateItem = useCallback((updated: T) => {
    setData((prev) => prev.map((item) => ((item as any).id === (updated as any).id ? updated : item)));
  }, []);

  const deleteItem = useCallback((id: string) => {
    setData((prev) => prev.filter((item) => (item as any).id !== id));
  }, []);

  const resetAll = useCallback(() => {
    setData(initialValues);
  }, [initialValues]);

  return {
    items,
    setData,
    addItem,
    updateItem,
    deleteItem,
    resetAll,
  };
}
