"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Baby, 
  School, 
  GraduationCap, 
  Building, 
  Accessibility, 
  Bell, 
  LogOut, 
  Search, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  Clock, 
  ArrowRight,
  ChevronRight,
  X,
  Sun,
  Moon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GeometricLogo } from "../components/GeometricLogo";

interface ToolsHubProps {
  userName: string;
  userRole: string;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  onLaunchTool: (toolId: string, tabId: string) => void;
  onLogout: () => void;
}

export interface ToolCard {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
  status: "Online" | "Offline Standby" | "Maintenance";
  actionText: string;
  targetTab: string;
  colorClass: string;
  bgGradient: string;
}

// Static notification logs
const NOTIFICATIONS = [
  { id: 1, message: "Standard 1-7 primary dataset backup success.", time: "10 mins ago" },
  { id: 2, message: "New textbook audit thresholds set for Std 5.", time: "1 hour ago" },
  { id: 3, message: "SPED therapist physical allocation form updated.", time: "Yesterday" }
];

// Raw Tools definition matching remaining items
const ALL_TOOLS: ToolCard[] = [
  {
    id: "early_childhood",
    title: "Early Childhood Data Collection",
    icon: Baby,
    description: "Pre-primary nurseries census tracking. Monitors toddler growth indices, early classroom ratios, and community health allocations.",
    status: "Online",
    actionText: "Launch Registry",
    targetTab: "ece_dashboard",
    colorClass: "text-[#97620C] bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50",
    bgGradient: "from-amber-50 to-amber-100/50 dark:from-amber-950/10 dark:to-amber-950/20"
  },
  {
    id: "primary_data",
    title: "Primary Data Collection",
    icon: School,
    description: "Authorized standard enrolment levels (Std 1-7). Fully operational system for audit verification, student records, transfers, and resource tracking.",
    status: "Online",
    actionText: "Launch Registry",
    targetTab: "dashboard",
    colorClass: "text-blue-600 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50",
    bgGradient: "from-blue-50 to-blue-100/50 dark:from-blue-950/10 dark:to-blue-950/20"
  },
  {
    id: "junior_secondary",
    title: "Junior Secondary Data Collection",
    icon: GraduationCap,
    description: "JS1-JS3 records hub. Comprehensive logs tracking secondary transition, core skills matrices, school staff appointments and boarding occupancy rates.",
    status: "Online",
    actionText: "Launch Registry",
    targetTab: "dashboard",
    colorClass: "text-purple-600 bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/50",
    bgGradient: "from-purple-50 to-purple-100/50 dark:from-purple-950/10 dark:to-purple-950/20"
  },
  {
    id: "unified_private",
    title: "Unified Private Secondary Tool",
    icon: Building,
    description: "Licensing registries, regulatory compliance monitors, and staff certification databases for private high schools and alternative non-state systems.",
    status: "Online",
    actionText: "Launch Registry",
    targetTab: "dashboard",
    colorClass: "text-slate-600 bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800",
    bgGradient: "from-slate-50 to-slate-100/50 dark:from-slate-800/20 dark:to-slate-800/35"
  },
  {
    id: "sped_data",
    title: "SPED Data Collection Tool",
    icon: Accessibility,
    description: "Special Education Needs (SEN) active tracker. Records assistive physical therapy allocations, specialised equipment levels, and therapist deployments.",
    status: "Online",
    actionText: "Launch Registry",
    targetTab: "dashboard",
    colorClass: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50",
    bgGradient: "from-emerald-50 to-emerald-100/50 dark:from-emerald-950/10 dark:to-emerald-950/20"
  }
];

export const ToolsHub: React.FC<ToolsHubProps> = ({
  userName,
  userRole,
  isDark,
  setIsDark,
  onLaunchTool,
  onLogout,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"All" | "Online">("All");
  const [showNotifications, setShowNotifications] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "info" | "success" | "warning" } | null>(null);
  const [activeModal, setActiveModal] = useState<ToolCard | null>(null);

  // Determine standard greeting directly on render
  const greeting = useMemo(() => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good morning";
    if (hours < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const triggerToast = (message: string, type: "info" | "success" | "warning" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleLaunch = (tool: ToolCard) => {
    if (tool.status !== "Online") {
      setActiveModal(tool);
    } else {
      triggerToast(`Initializing ${tool.title} registry workspace... Access granted.`, "success");
      // Delayed navigate for elegant transitions & readability
      setTimeout(() => {
        onLaunchTool(tool.id, tool.targetTab);
      }, 2000);
    }
  };

  const handleRequestClearance = (tool: ToolCard) => {
    setActiveModal(null);
    triggerToast(`Clearance request submitted for ${tool.title} registry cluster!`, "info");
  };

  // Filtering tools
  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter(tool => {
      const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === "All" || tool.status === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);

  return (
    <div className={`min-h-screen ${isDark ? "dark bg-[#00050c] text-white" : "bg-slate-50 text-slate-900"} p-4 md:p-8 space-y-8 font-sans transition-all duration-300`}>
      
      {/* Toast Alert Box */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`fixed bottom-6 right-6 p-4 rounded-2xl shadow-2xl border flex items-center gap-3 text-sm font-semibold z-50 max-w-sm backdrop-blur-md ${
              toast.type === "success" 
                ? "bg-slate-900/95 dark:bg-[#001428]/95 text-white border-emerald-500/50" 
                : toast.type === "warning" 
                ? "bg-slate-900/95 dark:bg-[#001428]/95 text-white border-amber-500/50" 
                : "bg-slate-900/95 dark:bg-[#001428]/95 text-white border-blue-550/50"
            }`}
          >
            {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
            {toast.type === "warning" && <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 animate-pulse" />}
            {toast.type === "info" && <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />}
            
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase font-mono leading-none mb-1">
                {toast.type === "success" ? "Success" : toast.type === "warning" ? "Notice" : "Information"}
              </span>
              <span className="text-slate-100 text-xs tracking-tight">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Panel */}
      <header className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-[#001020] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm gap-6">
        <div className="flex items-center gap-4 self-start md:self-auto">
          <div className="flex-shrink-0">
            <GeometricLogo size={48} onDarkBg={isDark} />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#002652] dark:text-white uppercase tracking-tight flex items-center gap-2">
              Edu-VISION Data Hub
            </h1>
            <p className="text-xs font-semibold text-[#00A3A3] uppercase tracking-wider font-mono">
              Centralized Management Systems
            </p>
          </div>
        </div>

        {/* Action Widgets */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
          
          {/* Connection Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 text-[10px] font-bold uppercase py-1.5 px-3.5 rounded-xl border border-emerald-200/55 dark:border-emerald-900/40 relative">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            <span className="w-2 h-2 bg-emerald-500 rounded-full absolute" />
            <span className="ml-1.5">NODE SYNC ACTIVE</span>
          </div>

          {/* Theme Switcher */}
          <button
            onClick={() => setIsDark(!isDark)}
            id="btn-toggle-darkmode-hub"
            className="p-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer border border-slate-250/30 dark:border-slate-800 text-slate-600 dark:text-slate-350"
            title="Toggle Color Theme"
            type="button"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-500" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>
          
          {/* Notification Button */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-350" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full" />
            </button>

            {/* Notification Dropdown Drawer */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#001428] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-55 p-4 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-xs font-black uppercase text-[#002652] dark:text-slate-200">System Logs</span>
                  <button onClick={() => setShowNotifications(false)} className="text-xs font-bold text-slate-400 hover:text-slate-600">Close</button>
                </div>
                <div className="space-y-2">
                  {NOTIFICATIONS.map(n => (
                    <div key={n.id} className="text-xs p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800/80">
                      <p className="font-semibold text-slate-700 dark:text-slate-300">{n.message}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block font-mono">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-[#00A3A3] text-white flex items-center justify-center font-black text-sm uppercase shadow-sm">
              {userName.slice(0, 2)}
            </div>
            <div className="hidden sm:block">
              <span className="text-xs font-black block text-[#002652] dark:text-white uppercase leading-tight">{userName}</span>
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block">{userRole}</span>
            </div>
          </div>

          {/* Logout Button */}
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 hover:bg-rose-50 dark:border-rose-950/40 dark:hover:bg-rose-950/20 text-rose-600 font-bold text-xs uppercase cursor-pointer transition-all ml-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* System Status Banner */}
      <div className="bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-250 dark:border-emerald-900/60 rounded-xl p-3 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-emerald-800 dark:text-emerald-400">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full absolute" />
          <span className="ml-2">ALL SYSTEMS OPERATIONAL</span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="font-mono text-slate-550">G-8 EMIS NODE ONLINE</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500 font-mono">
          <Clock className="w-3.5 h-3.5 text-[#00A3A3]" />
          <span>Last sync: 2 mins ago</span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span>Role: {userRole}</span>
        </div>
      </div>

      {/* Welcome & Overview Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Welcome Block */}
        <div className="lg:col-span-2 space-y-2">
          <h2 className="text-2xl md:text-3xl font-black text-[#002652] dark:text-white tracking-tight leading-tight">
            {greeting}, {userName}!
          </h2>
          <p className="text-sm font-semibold text-slate-500">
            Select a data collection tool to begin capturing school data
          </p>
        </div>

        {/* 3 Quick Stats Cards */}
        <div className="grid grid-cols-3 gap-4 lg:col-span-3">
          <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/40 rounded-xl text-blue-600 dark:text-blue-400">
              <Activity className="w-5 h-5 lg:w-6 lg:h-6" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Submitted Today</p>
              <h3 className="text-lg lg:text-2xl font-mono font-bold text-slate-800 dark:text-slate-100">24 Forms</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-[#00A3A3]/10 rounded-xl text-[#00A3A3]">
              <Sliders className="w-5 h-5 lg:w-6 lg:h-6" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Active Tools</p>
              <h3 className="text-lg lg:text-2xl font-mono font-bold text-slate-800 dark:text-slate-100">6 registries</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/40 rounded-xl text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5 lg:w-6 lg:h-6" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Completion Rate</p>
              <h3 className="text-lg lg:text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400">78%</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Filter Bar */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-[#001020] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          
          {/* Tabs Filter */}
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-lg w-full md:w-auto">
            {["All", "Online"].map(type => (
              <button
                key={type}
                onClick={() => setActiveFilter(type as any)}
                className={`flex-1 md:flex-none px-4 py-1.5 rounded-md text-xs font-bold transition-all uppercase tracking-tight cursor-pointer ${
                  activeFilter === type 
                    ? "bg-blue-600 text-white shadow-xs" 
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input 
              type="text" 
              placeholder="Filter registries by title/keywords..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-blue-550 transition-all"
            />
          </div>
        </div>

        {/* 4-Column Tool Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map(tool => {
            const IconComp = tool.icon;
            return (
              <div 
                key={tool.id}
                onClick={() => handleLaunch(tool)}
                className="bg-white dark:bg-[#001020] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 hover:translate-y-[-4px] hover:shadow-lg rounded-2xl p-6 transition-all duration-300 relative group flex flex-col justify-between h-auto cursor-pointer"
              >
                {/* Card Top: Gradient + Icon + Title */}
                <div className="space-y-4 text-slate-900 dark:text-slate-100">
                  <div className={`p-3.5 rounded-2xl inline-block ${tool.colorClass}`}>
                    <IconComp className="w-7 h-7 text-current" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                      {tool.title}
                    </h3>
                    
                    {/* Status badge */}
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <span className={`w-2 h-2 rounded-full ${
                        tool.status === "Online" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                      }`} />
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        tool.status === "Online" ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"
                      }`}>
                        {tool.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {tool.description}
                  </p>
                </div>

                {/* Card Bottom: Action Button */}
                <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-900 flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-wider font-extrabold text-slate-400 dark:text-slate-500">
                    ID: {tool.id.toUpperCase()}
                  </span>
                  
                  <span className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-300 font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                    {tool.actionText}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Segment: Activity Logs */}
      <section className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-[#00A3A3]" />
          <h3 className="font-black text-xs uppercase tracking-widest text-[#002652] dark:text-white">Active Node Operations Log</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-500">
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-1">
            <span className="font-black block text-slate-800 dark:text-slate-350 uppercase">Audit Verification Queue</span>
            <p className="text-[11px] leading-relaxed">Cluster logged: 24 secondary standards successfully submitted to G-8 Hub verification ledger.</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-1">
            <span className="font-black block text-slate-800 dark:text-slate-350 uppercase">Sync Replication Task</span>
            <p className="text-[11px] leading-relaxed">Completed 100% replication of textbooks count matrices. Replication stamp check: BW-TX-048.</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-1">
            <span className="font-black block text-emerald-700 dark:text-emerald-500 uppercase">System Integrity Status</span>
            <p className="text-[11px] leading-relaxed text-slate-450">Active replication nodes are fully synced. Safe buffer redundancy level: 99.98%.</p>
          </div>
        </div>
      </section>

      {/* Standby Clearance Request Dialog Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative space-y-4">
            
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full transition-colors text-slate-450 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3">
              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-500 rounded-full inline-block">
                <AlertTriangle className="w-8 h-8 animate-pulse" />
              </div>
              
              <div>
                <h4 className="text-base font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">{activeModal.title}</h4>
                <span className="text-xs bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 font-bold px-2.5 py-0.5 rounded-full mt-1.5 inline-block">
                  Standby Mode Active
                </span>
              </div>

              <p className="text-xs text-slate-550 leading-relaxed">
                This registry instance is loaded as a read-only offline standby. You can submit a clearance request to synchronized live cluster clusters.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button 
                onClick={() => handleRequestClearance(activeModal)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase rounded-xl tracking-wider transition-colors cursor-pointer"
              >
                Request Cluster Sync
              </button>
              
              <button 
                onClick={() => setActiveModal(null)}
                className="w-full py-2.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 text-slate-600 dark:text-slate-350 text-xs font-bold uppercase rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
