"use client";

import React, { useState } from "react";
import { Sun, Moon, LogOut, Bell, LayoutDashboard, Clock, ShieldAlert } from "lucide-react";
import { GeometricLogo } from "../components/GeometricLogo";

interface HeaderProps {
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  userName: string;
  userRole: string;
  activeTab?: string;
  onLogout?: () => void;
  onExit?: () => void;
}

const NOTIFICATIONS = [
  { id: 1, message: "Standard 1-7 primary dataset backup success.", time: "10 mins ago" },
  { id: 2, message: "New textbook audit thresholds set for Std 5.", time: "1 hour ago" },
  { id: 3, message: "SPED therapist physical allocation form updated.", time: "Yesterday" }
];

export const Header: React.FC<HeaderProps> = ({
  isDark,
  setIsDark,
  userName,
  userRole,
  activeTab = "dashboard",
  onLogout,
  onExit,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const getActiveTabLabel = (tab: string): string => {
    switch (tab) {
      case "dashboard": return "EMIS Executive Dashboard";
      case "school": return "School Profile Registry";
      case "students": return "Students Directory";
      case "transfers": return "Inter-school Transfers Control";
      case "re_entrants": return "Re-entrants Registry";
      case "dropouts": return "Dropouts Registry";
      case "abused_students": return "Protection & Abuse Reports";
      case "teachers": return "Pedagogical Staff Registry";
      case "support": return "Support Staff Registry";
      case "cse": return "Comprehensive Sexuality Education Registry";
      case "textbooks": return "Textbook Inventory & Deficits";
      case "furniture": return "Furniture Assets Registry";
      case "equipment": return "Standard Teaching Equipment";
      case "equipment_disability": return "Special Education Needs (SEND) Resources";
      case "boarding": return "Boarding & Accommodation Services";
      case "recreational": return "Recreational & Sports Facilities";
      case "facilities": return "School Infrastructure & Facilities";
      case "ai_audit": return "EMIS Intelligent Auditor";
      default: return "Active Registry Workspace";
    }
  };

  return (
    <header
      id="app-header"
      className="bg-white dark:bg-[#001020] border-b border-slate-250/70 dark:border-slate-800 text-slate-800 dark:text-white px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 md:sticky md:top-0 z-30 shadow-xs"
    >
      {/* Brand Context Indicator */}
      <div className="flex items-center gap-3.5 self-start sm:self-auto">
        <div className="flex-shrink-0">
          <GeometricLogo size={42} onDarkBg={isDark} />
        </div>
        <div>
          <h1 className="text-base font-black text-[#002652] dark:text-white uppercase tracking-tight flex items-center gap-1.5 leading-none">
            {getActiveTabLabel(activeTab)}
          </h1>
          <p className="text-[10px] font-bold text-[#00A3A3] uppercase tracking-widest font-mono mt-1">
            Edu-VISION Workspace Active
          </p>
        </div>
      </div>

      {/* Utility Actions & Synchronization Hub */}
      <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
        {/* Connection Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 text-[10px] font-bold uppercase py-1.5 px-3.5 rounded-xl border border-emerald-200/55 dark:border-emerald-900/40">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          <span className="w-2 h-2 bg-emerald-500 rounded-full absolute" />
          <span className="ml-1.5">NODE SYNC ACTIVE</span>
        </div>

        {/* Theme Switcher */}
        <button
          onClick={() => setIsDark(!isDark)}
          id="btn-toggle-darkmode"
          className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer border border-slate-250/30 dark:border-slate-800 text-slate-600 dark:text-slate-350"
          title="Toggle Color Theme"
          type="button"
        >
          {isDark ? (
            <Sun className="w-4.5 h-4.5 text-amber-500 animate-spin-slow" />
          ) : (
            <Moon className="w-4.5 h-4.5 text-slate-600" />
          )}
        </button>

        {/* Notification Bell with Dropdown Drawer */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer border border-slate-250/30 dark:border-slate-800 relative"
            title="Notifications"
          >
            <Bell className="w-4.5 h-4.5 text-slate-600 dark:text-slate-350" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
          </button>

          {/* Scoped Dropdown matching ToolsHub theme */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#001428] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-55 p-4 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-xs font-black uppercase text-[#002652] dark:text-slate-200">
                  System Logs
                </span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-bold text-slate-450 hover:text-slate-605 cursor-pointer"
                >
                  Close
                </button>
              </div>
              <div className="space-y-2">
                {NOTIFICATIONS.map((n) => (
                  <div
                    key={n.id}
                    className="text-xs p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800/80"
                  >
                    <p className="font-semibold text-slate-700 dark:text-slate-300">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block font-mono">
                      {n.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-[#00A3A3] text-white flex items-center justify-center font-black text-sm uppercase shadow-xs">
            {userName.slice(0, 2)}
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-xs font-black block text-[#002652] dark:text-white uppercase leading-none">
              {userName}
            </span>
            <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 block mt-1">
              {userRole}
            </span>
          </div>
        </div>

        {/* Exit to Hub Button */}
        {onExit && (
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 text-[#002652] dark:text-slate-200 font-bold text-xs uppercase cursor-pointer border border-slate-250/20 transition-all"
            title="Return to central hub selecting tool"
          >
            <LayoutDashboard className="w-4 h-4 text-[#00A3A3]" />
            <span className="hidden md:inline">Hub</span>
          </button>
        )}

        {/* Sign Out Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-950/40 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 font-bold text-xs uppercase cursor-pointer transition-all"
            title="Perform complete system sign out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Sign Out</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
