"use client";

import React from "react";
import { 
  Building, 
  Users, 
  ArrowLeftRight, 
  UserPlus, 
  UserMinus, 
  ShieldAlert, 
  UserCheck, 
  Award, 
  Briefcase, 
  UserCog, 
  Heart, 
  BookOpen, 
  Layers, 
  Accessibility, 
  Hammer, 
  Home, 
  Wrench, 
  Trophy,
  LayoutDashboard,
  Menu,
  X,
  Sparkles,
  ArrowLeft,
  GraduationCap,
  ArrowRightLeft,
  Activity,
  Eye
} from "lucide-react";
import { GeometricLogo } from "../components/GeometricLogo";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isDark: boolean;
  onExit: () => void;
  selectedTool?: "primary_data" | "early_childhood" | string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  mobileMenuOpen,
  setMobileMenuOpen,
  isDark,
  onExit,
  selectedTool
}) => {
  const isEce = selectedTool === "early_childhood";

  const getExitLabel = () => {
    switch (selectedTool) {
      case "early_childhood":
        return "Exit ECCE Hub";
      case "primary_data":
        return "Exit Primary Hub";
      case "junior_secondary":
        return "Exit Junior Hub";
      case "unified_private":
        return "Exit Unified Hub";
      case "sped_data":
        return "Exit SPED Hub";
      default:
        return "Exit Primary Hub";
    }
  };

  const primaryMenuItems = [
    { id: "dashboard", label: "Dashboard overview", icon: LayoutDashboard },
    { id: "school", label: "School Info", icon: Building },
    { id: "students", label: "Students Registry", icon: Users },
    { id: "transfers", label: selectedTool === "sped_data" ? "Transition to Primary" : "Transfers", icon: ArrowLeftRight },
    { id: "re_entrants", label: "Re-entrants", icon: UserPlus },
    { id: "dropouts", label: "Dropouts", icon: UserMinus },
    { id: "abused_students", label: "Abused Students", icon: ShieldAlert },
    { id: "teachers", label: "Teaching Staff", icon: UserCheck },
    { id: "support", label: "Support Staff", icon: UserCog },
    { id: "cse", label: "CSE & Life Skills", icon: Heart },
    { id: "textbooks", label: "Textbooks Inventory", icon: BookOpen },
    { id: "furniture", label: "Furniture Count", icon: Layers },
    { id: "equipment", label: "Equipment Status", icon: Wrench },
    { id: "equipment_disability", label: "Disability Equipment", icon: Accessibility },
    { id: "facilities", label: "Facilities Overview", icon: Hammer },
    { id: "boarding", label: "Boarding Facilities", icon: Home },
    { id: "recreational", label: "Recreational Tracks", icon: Trophy }
  ];

  const eceMenuItems = [
    { id: "ece_dashboard", label: "ECCE Dashboard overview", icon: LayoutDashboard },
    { id: "ece_school", label: "School Info", icon: Building },
    { id: "ece_students", label: "Students Registry", icon: Users },
    { id: "ece_transfers", label: "Transfers Registry", icon: ArrowLeftRight },
    { id: "ece_dropouts", label: "Dropouts Registry", icon: UserMinus },
    { id: "ece_re_entrants", label: "Re-entrants Registry", icon: UserPlus },
    { id: "ece_graduates", label: "Pre-Primary Graduation", icon: GraduationCap },
    { id: "ece_teachers", label: "Teaching Staff", icon: Briefcase },
    { id: "ece_teacher_movement", label: "Teacher Movement", icon: ArrowRightLeft },
    { id: "ece_special_programme", label: "Special Programme", icon: Award },
    { id: "ece_abused_students", label: "Abused Students", icon: ShieldAlert },
    { id: "ece_accidents", label: "Accidents", icon: Activity },
    { id: "ece_support", label: "Support Staff", icon: Users },
    { id: "ece_facilities", label: "School Facilities", icon: Hammer },
    { id: "ece_monitoring", label: "Monitoring & Supervision", icon: Eye },
    { id: "ece_cse", label: "CSE & Life Skills", icon: Heart },
  ];

  const menuItems = isEce ? eceMenuItems : primaryMenuItems;

  return (
    <>
      {/* Mobile Toggle Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-prussian text-white sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <GeometricLogo size={24} onDarkBg />
          <span className="font-bold text-sm tracking-tight">Edu-VISION</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 hover:bg-white/10 rounded transition-colors focus:outline-none"
          id="btn-mobile-menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Sidebar */}
      <aside
        id="app-sidebar"
        className={`bg-prussian text-slate-100 flex-shrink-0 flex flex-col p-5 transition-all duration-300 border-r border-[#001c3d] overflow-y-auto ${
          mobileMenuOpen 
            ? "block fixed inset-x-0 bottom-0 top-[52px] z-45 w-full" 
            : "hidden md:flex md:w-64 md:h-screen md:sticky md:top-0 md:z-40"
        }`}
      >
        {/* Brand Banner (Hidden on desktop if redundant, keeping it clean) */}
        <div className="hidden md:flex items-center gap-3 mb-6 pb-4 border-b border-[#001c3d]">
          <GeometricLogo size={36} onDarkBg />
          <div>
            <h1 className="text-base font-extrabold text-white tracking-tight leading-none flex items-center gap-1">
              Edu-<span className="text-sea">VISION</span>
            </h1>
            <p className="text-[9px] uppercase font-mono tracking-wider text-slate-300 font-semibold mt-0.5">
              Statistics Portal
            </p>
          </div>
        </div>

        {/* Exit / Switch Tools Link */}
        <button
          onClick={onExit}
          id="btn-sidebar-exit"
          className="flex items-center justify-center gap-2 bg-amber-600/10 hover:bg-amber-600/20 text-amber-400 hover:text-amber-300 px-4 py-2 rounded text-xs font-bold transition-all duration-150 mb-6 cursor-pointer border border-amber-500/30 hover:border-amber-500/60 shadow-lg shadow-amber-950/20"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
          <span>{getExitLabel()}</span>
        </button>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 space-y-4">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-widest block mb-2 px-1">
              Main Board
            </span>
            <ul className="space-y-1">
              {menuItems.slice(0, 1).map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    id={`sidebar-tab-${item.id}`}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded text-xs font-bold transition-all text-left ${
                      activeTab === item.id
                        ? "bg-sea/25 text-white border-l-4 border-sea pl-2.5"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-widest block mb-2 px-1 text-left">
              {isEce ? "ECCE Core Workspaces" : "Operational Registries"}
            </span>
            <ul className="space-y-1">
              {menuItems.slice(1).map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    id={`sidebar-tab-${item.id}`}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded text-xs font-bold transition-all text-left ${
                      activeTab === item.id
                        ? "bg-sea/25 text-white border-l-4 border-sea pl-2.5"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Footer Audit Signature */}
        <div className="pt-4 border-t border-[#001c3d] text-[9.5px] uppercase font-mono text-slate-400 leading-tight">
          <div>Clearance: <strong className="text-white">G-8 Auditor</strong></div>
          <div className="mt-1">Node: <strong className="text-slate-300">BW-EDU-CORE</strong></div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
