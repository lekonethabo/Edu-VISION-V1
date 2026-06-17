"use client";

import React from "react";
import { Sun, Moon, Sparkles, LogOut, Shield, Globe, Bell } from "lucide-react";

interface HeaderProps {
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  userName: string;
  userRole: string;
}

export const Header: React.FC<HeaderProps> = ({
  isDark,
  setIsDark,
  userName,
  userRole
}) => {
  return (
    <header
      id="app-header"
      className="bg-prussian text-snow px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 md:sticky md:top-0 z-30 shadow-md"
    >
      {/* Logo & Subtitle */}
      <div className="flex items-center gap-3 self-start sm:self-auto">
      </div>

      {/* Utility Actions */}
      <div className="flex items-center gap-4 self-end sm:self-auto">
        {/* Connection Indicator */}
        <div className="flex items-center gap-1.5 bg-sea text-snow text-[10px] font-bold uppercase py-1 px-3 rounded-full shadow-sm">
          <span className={`w-2 h-2 bg-white rounded-full ${isDark ? '' : 'animate-pulse'}`} />
          <span>Sync Node Live</span>
        </div>

        {/* Theme Switcher */}
        <button
          onClick={() => setIsDark(!isDark)}
          id="btn-toggle-darkmode"
          className="p-2 rounded bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer border border-white/10"
          title="Toggle Color Theme"
          type="button"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-snow" />}
        </button>

        {/* Notification Bell */}
        <button className="p-2 rounded bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer border border-white/10 relative">
          <Bell className="w-4 h-4 text-snow" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border border-prussian"></span>
        </button>

        {/* User Info & Action */}
        <div className="flex items-center gap-3 pl-4 border-l border-white/20">
          <div className="w-8 h-8 rounded-full bg-golden flex items-center justify-center text-white font-bold text-xs uppercase">
            {userName.substring(0, 2)}
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-xs font-bold text-snow uppercase tracking-tight">
              Welcome, {userName.split(' ')[0] || userName}
            </p>
          </div>
          <button className="p-2 ml-1 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer border border-rose-500/30" title="Logout">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
