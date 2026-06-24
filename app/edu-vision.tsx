"use client";

import React, { useState } from "react";
import Sidebar from "./layouts/Sidebar";
import Header from "./layouts/Header";
import { LandingPage } from "./auth/LandingPage";
import { SplashScreen } from "./components/SplashScreen";
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
import { EarlyChildhoodDashboard } from "./dashboard/EarlyChildhoodDashboard";
import { EarlyChildhoodStudentsRegistry } from "./registries/EarlyChildhoodStudentsRegistry";
import { EarlyChildhoodTransfersRegistry } from "./registries/EarlyChildhoodTransfersRegistry";
import { EarlyChildhoodGraduationRegistry } from "./registries/EarlyChildhoodGraduationRegistry";
import { EarlyChildhoodTeachingStaffRegistry } from "./registries/EarlyChildhoodTeachingStaffRegistry";
import { EarlyChildhoodSupportStaffRegistry } from "./registries/EarlyChildhoodSupportStaffRegistry";
import { TeacherMovementRegistry } from "./registries/TeacherMovementRegistry";
import { TeachersSpecialProgrammeRegistry } from "./registries/TeachersSpecialProgrammeRegistry";
import { EarlyChildhoodAccidentsRegistry } from "./registries/EarlyChildhoodAccidentsRegistry";
import { SchoolFacilitiesRegistry } from "./registries/SchoolFacilitiesRegistry";
import { MonitoringSupervisionRegistry } from "./registries/MonitoringSupervisionRegistry";
import { ComprehensiveSexualityEducationRegistry } from "./registries/ComprehensiveSexualityEducationRegistry";
import { TextbooksRegistry } from "./resources/TextbooksRegistry";
import { FurnitureRegistry } from "./resources/FurnitureRegistry";
import { EquipmentRegistry } from "./resources/EquipmentRegistry";
import { EquipmentDisabilityRegistry } from "./resources/EquipmentDisabilityRegistry";
import { BoardingFacilitiesRegistry } from "./resources/BoardingFacilitiesRegistry";
import { RecreationalFacilitiesRegistry } from "./resources/RecreationalFacilitiesRegistry";
import { FacilitiesRegistry } from "./facilities/FacilitiesRegistry";
import { AiAuditPanel } from "./analytics/AiAuditPanel";
import { Sparkles, Library } from "lucide-react";
import { ToolsHub } from "./dashboard/ToolsHub";

export const EduVisionPortal: React.FC = () => {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isToolLaunched, setIsToolLaunched] = useState<boolean>(false);
  const [selectedTool, setSelectedTool] = useState<"primary_data" | "early_childhood" | string | null>(null);
  const [userRole, setUserRole] = useState<string>("");
  const [userName, setUserName] = useState("");
  const [activeTab, setActiveTab2] = useState<string>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(false);

  const handleLogin = (role: string, name: string) => {
    setUserRole(role);
    setUserName(name);
    setIsAuthenticated(true);
    setIsToolLaunched(false);
    setSelectedTool(null);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsToolLaunched(false);
    setSelectedTool(null);
    setActiveTab2("dashboard");
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (!isAuthenticated) {
    return <LandingPage onLogin={handleLogin} />;
  }

  if (!isToolLaunched) {
    return (
      <ToolsHub
        userName={userName}
        userRole={userRole}
        isDark={isDark}
        setIsDark={setIsDark}
        onLaunchTool={(toolId, tabId) => {
          if (toolId && tabId) {
            setSelectedTool(toolId);
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
      case "ece_dashboard":
        return <EarlyChildhoodDashboard />;
      case "ece_school":
        return <SchoolInfoRegistry toolType="EARLY" />;// Removed EarlyChildhoodSchoolInfo as requested and mapped to consolidated component
      case "ece_students":
        return <EarlyChildhoodStudentsRegistry />;
      case "ece_transfers":
        return <EarlyChildhoodTransfersRegistry />;
      case "ece_dropouts":
        return <DropoutsRegistry toolType="EARLY" />;
      case "ece_re_entrants":
        return <ReEntrantsRegistry toolType="EARLY" />;
      case "ece_graduates":
        return <EarlyChildhoodGraduationRegistry />;
      case "ece_teachers":
        return <EarlyChildhoodTeachingStaffRegistry />;
      case "ece_support":
        return <EarlyChildhoodSupportStaffRegistry />;
      case "ece_teacher_movement":
        return <TeacherMovementRegistry />;
      case "ece_special_programme":
        return <TeachersSpecialProgrammeRegistry />;
      case "ece_abused_students":
        return <AbusedStudentsRegistry toolType="EARLY" />;
      case "ece_accidents":
        return <EarlyChildhoodAccidentsRegistry />;
      case "ece_facilities":
        return <SchoolFacilitiesRegistry />;
      case "ece_monitoring":
        return <MonitoringSupervisionRegistry />;
      case "ece_cse":
        return <ComprehensiveSexualityEducationRegistry />;
      case "school":
        let mappingSchool: any = {
          "primary_data": "PRIMARY",
          "junior_secondary": "JUNIOR",
          "early_childhood": "EARLY",
          "unified_private": "UNIFIED",
          "sped_data": "SPED"
        };
        const resolvedSchoolType = selectedTool ? (mappingSchool[selectedTool] || "PRIMARY") : "PRIMARY";
        return <SchoolInfoRegistry key={`school-${resolvedSchoolType}`} toolType={resolvedSchoolType} />;
      case "students":
        let mapping: any = {
          "primary_data": "PRIMARY",
          "junior_secondary": "JUNIOR",
          "early_childhood": "EARLY",
          "unified_private": "UNIFIED",
          "sped_data": "SPED"
        };
        const resolvedToolType = selectedTool ? (mapping[selectedTool] || "PRIMARY") : "PRIMARY";
        return <StudentsRegistry key={`students-${resolvedToolType}`} toolType={resolvedToolType} />;
      case "transfers":
        let mappingTransfers: any = {
          "primary_data": "PRIMARY",
          "junior_secondary": "JUNIOR",
          "early_childhood": "EARLY",
          "unified_private": "UNIFIED",
          "sped_data": "SPED"
        };
        const resolvedTransfersType = selectedTool ? (mappingTransfers[selectedTool] || "PRIMARY") : "PRIMARY";
        return <TransfersRegistry key={`transfers-${resolvedTransfersType}`} toolType={resolvedTransfersType} />;
      case "re_entrants":
        let mappingReEntrants: any = {
          "primary_data": "PRIMARY",
          "junior_secondary": "JUNIOR",
          "early_childhood": "EARLY",
          "unified_private": "UNIFIED",
          "sped_data": "SPED"
        };
        const resolvedReEntrantsType = selectedTool ? (mappingReEntrants[selectedTool] || "PRIMARY") : "PRIMARY";
        return <ReEntrantsRegistry key={`re_entrants-${resolvedReEntrantsType}`} toolType={resolvedReEntrantsType} />;
      case "dropouts":
        let mappingDropouts: any = {
          "primary_data": "PRIMARY",
          "junior_secondary": "JUNIOR",
          "early_childhood": "EARLY",
          "unified_private": "UNIFIED",
          "sped_data": "SPED"
        };
        const resolvedDropoutsType = selectedTool ? (mappingDropouts[selectedTool] || "PRIMARY") : "PRIMARY";
        return <DropoutsRegistry key={`dropouts-${resolvedDropoutsType}`} toolType={resolvedDropoutsType} />;
      case "abused_students":
        let mappingAbused: any = {
          "primary_data": "PRIMARY",
          "junior_secondary": "JUNIOR",
          "early_childhood": "EARLY",
          "unified_private": "UNIFIED",
          "sped_data": "SPED"
        };
        const resolvedAbusedType = selectedTool ? (mappingAbused[selectedTool] || "PRIMARY") : "PRIMARY";
        return <AbusedStudentsRegistry key={`abused-${resolvedAbusedType}`} toolType={resolvedAbusedType} />;
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
        selectedTool={selectedTool || undefined}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 md:h-screen md:overflow-y-auto">
        <Header 
          userName={userName}
          userRole={userRole}
          isDark={isDark}
          setIsDark={setIsDark}
          activeTab={activeTab}
          onLogout={handleLogout}
          onExit={() => setIsToolLaunched(false)}
        />

        {/* Inner page panel viewport */}
        <main className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl w-full mx-auto pb-16">
          
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
