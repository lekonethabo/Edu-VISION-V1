"use client";

import { useState, useCallback } from "react";

export function useLocalStorage<T>(
  _keySuffix: string,
  initialValues: T[]
) {
  // Legacy hook signature preserved to avoid refactors across the app.
  // Persistence has been removed so state is managed in-memory only.
  const [data, setData] = useState<T[]>(initialValues);

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
