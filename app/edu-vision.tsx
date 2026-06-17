"use client";

import React, { useState } from "react";
import Sidebar from "./layouts/Sidebar";
import Header from "./layouts/Header";
import { LandingPage } from "./auth/LandingPage";
import { DashboardOverview } from "./dashboard/DashboardOverview";
import { SchoolInfoRegistry } from "./registries/SchoolInfoRegistry";
import { StudentsRegistry } from "./registries/StudentsRegistry";
import { TeachersRegistry } from "./registries/TeachersRegistry";
import { TransfersRegistry } from "./registries/TransfersRegistry";
import { DropoutsRegistry } from "./registries/DropoutsRegistry";
import { ReEntrantsRegistry } from "./registries/ReEntrantsRegistry";
import { AbusedStudentsRegistry } from "./registries/AbusedStudentsRegistry";
import { SupportStaffRegistry } from "./registries/SupportStaffRegistry";
import { CseAuditRegistry } from "./registries/CseAuditRegistry";
import { TextbooksRegistry } from "./resources/TextbooksRegistry";
import { FurnitureRegistry } from "./resources/FurnitureRegistry";
import { EquipmentRegistry } from "./resources/EquipmentRegistry";
import { EquipmentDisabilityRegistry } from "./resources/EquipmentDisabilityRegistry";
import { BoardingFacilitiesRegistry } from "./resources/BoardingFacilitiesRegistry";
import { RecreationalFacilitiesRegistry } from "./resources/RecreationalFacilitiesRegistry";
import { FacilitiesRegistry } from "./facilities/FacilitiesRegistry";
import { AiAuditPanel } from "./analytics/AiAuditPanel";
import { Sparkles, Library } from "lucide-react";
import { LogoSplashScreen } from "./components/LogoSplashScreen";
import { ToolsHub } from "./dashboard/ToolsHub";

export const EduVisionPortal: React.FC = () => {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isToolLaunched, setIsToolLaunched] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>("School Administrator");
  const [userName, setUserName] = useState("K. NGWAKO (EMIS)");
  const [activeTab, setActiveTab2] = useState<string>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(false);

  const handleLogin = (role: string, name: string) => {
    setUserRole(role);
    setUserName(name);
    setIsAuthenticated(true);
    setIsToolLaunched(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsToolLaunched(false);
    setActiveTab2("dashboard");
  };

  if (showSplash) {
    return <LogoSplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (!isAuthenticated) {
    return <LandingPage onLogin={handleLogin} />;
  }

  if (!isToolLaunched) {
    return (
      <ToolsHub
        userName={userName}
        userRole={userRole}
        onLaunchTool={(tabId) => {
          if (tabId) {
            setActiveTab2(tabId);
            setIsToolLaunched(true);
          }
        }}
        onLogout={handleLogout}
      />
    );
  }

  // View resolution mapping
  const renderViewContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview onDrillDown={setActiveTab2} />;
      case "school":
        return <SchoolInfoRegistry />;
      case "students":
        return <StudentsRegistry />;
      case "transfers":
        return <TransfersRegistry />;
      case "re_entrants":
        return <ReEntrantsRegistry />;
      case "dropouts":
        return <DropoutsRegistry />;
      case "abused_students":
        return <AbusedStudentsRegistry />;
      case "teachers":
        return <TeachersRegistry />;
      case "support":
        return <SupportStaffRegistry />;
      case "cse":
        return <CseAuditRegistry />;
      case "textbooks":
        return <TextbooksRegistry />;
      case "furniture":
        return <FurnitureRegistry />;
      case "equipment":
        return <EquipmentRegistry />;
      case "equipment_disability":
        return <EquipmentDisabilityRegistry />;
      case "boarding":
        return <BoardingFacilitiesRegistry />;
      case "recreational":
        return <RecreationalFacilitiesRegistry />;
      case "facilities":
        return <FacilitiesRegistry />;
      case "ai_audit":
        return <AiAuditPanel />;
      default:
        return <DashboardOverview onDrillDown={setActiveTab2} />;
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? "dark bg-ink text-slate-100" : "bg-snow text-slate-900"} flex flex-col md:flex-row font-sans`}>
      
      {/* Sidebar navigation panel */}
      <Sidebar
        activeTab={activeTab === "ai_audit" ? "dashboard" : activeTab}
        setActiveTab={setActiveTab2}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        isDark={isDark}
        onExit={() => setIsToolLaunched(false)}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 md:h-screen md:overflow-y-auto">
        <Header 
          userName={userName}
          userRole={userRole}
          isDark={isDark}
          setIsDark={setIsDark}
        />

        {/* Inner page panel viewport */}
        <main className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl w-full mx-auto pb-16">
          
          {/* Persistent AI Auditor floating alert when not on AI page */}
          {activeTab !== "ai_audit" && (
            <div className="p-4 bg-linear-to-r from-[#002652] to-[#00A3A3] text-white rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/10 rounded-xl">
                  <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                </div>
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-sea block">Intelligent Copilot Assistant</span>
                  <span className="text-xs text-slate-100">Instantly inspect and audit standard textbooks deficit, pupil-teacher classroom density or inclusive SEND facilities.</span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab2("ai_audit")}
                className="px-4.5 py-2.5 bg-sea hover:bg-slate-100 hover:text-prussian font-bold text-[11px] uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0 text-white"
              >
                <span>Launch EMIS AI Auditor</span>
              </button>
            </div>
          )}

          {/* Render Active Registry View Component */}
          <div className="fade-in-up duration-250">
            {renderViewContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EduVisionPortal;
