"use client";

import { useState, useEffect, useCallback } from "react";

export function useTheme() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      const stored = window.localStorage.getItem("edu_vision_theme");
      if (stored) {
        return stored === "dark";
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const root = window.document.documentElement;
      if (isDark) {
        root.classList.add("dark");
        window.localStorage.setItem("edu_vision_theme", "dark");
      } else {
        root.classList.remove("dark");
        window.localStorage.setItem("edu_vision_theme", "light");
      }
    } catch (e) {
      console.error("Failed to apply theme to document root:", e);
    }
  }, [isDark]);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  return { isDark, setIsDark, toggleTheme };
}
