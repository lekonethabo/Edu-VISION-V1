"use client";

import React, { useState } from "react";
import { 
  AlertCircle, 
  School, 
  Save, 
  Bolt, 
  Droplets, 
  MapPin, 
  Globe, 
  Edit3, 
  Eye, 
  CheckCircle, 
  AlertTriangle, 
  Compass, 
  Network, 
  Activity, 
  Layers, 
  ShieldCheck, 
  PhoneCall, 
  BookOpen
} from "lucide-react";
import { SchoolInfo } from "../types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { INITIAL_SCHOOL_INFO } from "../constants";
import { SectionContainer } from "../shared/SectionContainer";

export const BOTSWANA_SUB_REGIONS = [
  "Bobirwa",
  "Boteti",
  "Charles Hill",
  "Chobe",
  "Francistown",
  "Gaborone",
  "Gantsi",
  "Goodhope",
  "Gumare",
  "Jwaneng/ Mabutsane",
  "Kanye",
  "Kgalagadi North",
  "Kgalagadi South",
  "Kgatleng",
  "Lentsweletau",
  "Letlhakeng",
  "Lobatse",
  "Mahalapye",
  "Maun",
  "Mogoditshane/ Thamaga",
  "Molepolole",
  "Moshupa",
  "North-East",
  "Palapye",
  "Sefhare",
  "Selibe Phikwe",
  "Serowe",
  "Shakawe",
  "Shoshong",
  "South East",
  "Tonota",
  "Tutume"
];

export const SchoolInfoRegistry: React.FC = () => {
  const { items, updateItem } = useLocalStorage<SchoolInfo>(
    "school_info",
    [INITIAL_SCHOOL_INFO]
  );

  const schoolData = items[0] || INITIAL_SCHOOL_INFO;
  const [formData, setFormData] = useState<SchoolInfo>({ ...schoolData });
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const triggerAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleFieldChange = (key: keyof SchoolInfo, val: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Sum of streams validation
    const sumStreams = 
      Number(formData.streamsStd1 || 0) +
      Number(formData.streamsStd2 || 0) +
      Number(formData.streamsStd3 || 0) +
      Number(formData.streamsStd4 || 0) +
      Number(formData.streamsStd5 || 0) +
      Number(formData.streamsStd6 || 0) +
      Number(formData.streamsStd7 || 0);

    // If total streams is set manually, let's sync or warn
    const typedTotal = Number(formData.totalStreams || 0);

    let updatedData = { ...formData };
    if (sumStreams !== typedTotal) {
      updatedData.totalStreams = sumStreams;
      updatedData.streamCheck = "Error / Review Needed";
    } else {
      updatedData.streamCheck = "Verified";
    }

    updateItem(updatedData);
    setFormData(updatedData);
    setIsEditMode(false);
    triggerAlert("Institutional registration parameters updated successfully with calculated streams.", "success");
  };

  const handleReset = () => {
    setFormData({ ...schoolData });
    setIsEditMode(false);
    triggerAlert("Changes discarded. Reverted to last saved institutional profile.", "error");
  };

  // Calculate streams sum dynamically for informational display
  const currentTotalStreams = 
    Number(formData.streamsStd1 || 0) +
    Number(formData.streamsStd2 || 0) +
    Number(formData.streamsStd3 || 0) +
    Number(formData.streamsStd4 || 0) +
    Number(formData.streamsStd5 || 0) +
    Number(formData.streamsStd6 || 0) +
    Number(formData.streamsStd7 || 0);

  return (
    <div className="space-y-6" id="school-info-registry-section">
      {/* Dynamic Alerts */}
      {alert && (
        <div 
          id="school-info-alert"
          className={`p-4.5 rounded-2xl border flex items-start gap-3.5 text-xs font-semibold ${
            alert.type === "success" 
              ? "bg-sea/10 border-sea text-sea" 
              : "bg-golden/10 border-golden text-golden"
          }`}
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block uppercase tracking-wider">
              {alert.type === "success" ? "Operation Succeeded" : "Notification"}
            </span>
            <span>{alert.message}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <SectionContainer
        title="EMIS School Registration Profile"
        description="Verify and update registered national identifiers, geographic boundaries, multigrade streams, supportive resources, and environmental utilities."
      >
        {/* Toggle Mode Switch Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-2 md:w-3.5 h-6 bg-prussian rounded-full" />
            <div>
              <h3 className="text-sm font-black text-prussian dark:text-sea uppercase tracking-wide">
                SCHOOL REGISTRATION NUMBER: {schoolData.regNum || "UNASSIGNED"}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Current State: <strong className="text-sea">{schoolData.registrationStatus || "Registered"}</strong>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {isEditMode ? (
              <>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 border border-slate-300 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-sm px-4 py-2 rounded transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-slate-400 active:scale-98 cursor-pointer"
                >
                  Discard Changes
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 bg-sea hover:bg-[#008a8a] text-white font-medium text-sm px-4 py-2 rounded shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-sea focus:ring-offset-2 active:scale-98 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditMode(true)}
                className="inline-flex items-center gap-2 bg-prussian hover:bg-[#001c3d] text-white font-medium text-sm px-4 py-2 rounded shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-prussian focus:ring-offset-2 active:scale-98 cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span>Modify Registration Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Display Layout */}
        {!isEditMode ? (
          /* ==========================================
             VIEW MODE: Beautiful high-density dashboard
             ========================================== */
          <div className="space-y-6 pt-4" id="school-info-view-dashboard">
            {/* Quick Status Highlight Widgets */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">TYPE OF SCHOOL</span>
                <span className="text-xs font-bold text-prussian dark:text-sea block">{schoolData.schoolType || "Government"}</span>
                <span className="text-[10px] text-slate-500 block">Official Category</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">DISTRICT</span>
                <span className="text-xs font-bold text-prussian dark:text-sea block truncate">{schoolData.district || "Kgalagadi"}</span>
                <span className="text-[10px] text-slate-500 block">{schoolData.village || "Hukuntsi"}</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">TOTAL NUMBER OF STREAMS</span>
                <span className="text-xs font-bold text-prussian dark:text-sea block">
                  {schoolData.totalStreams || 0} Registered
                </span>
                <span className="text-[10px] text-slate-500 block flex items-center gap-1">
                  <span className="text-slate-400">STREAM CHECK:</span>
                  {schoolData.streamCheck === "Verified" ? (
                    <>
                      <CheckCircle className="w-3 h-3 text-sea" />
                      <span className="text-sea">Verified</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3 h-3 text-golden" />
                      <span className="text-golden">Review Needed</span>
                    </>
                  )}
                </span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">SCHOOL HAS TRANSPORT FOR DISABLED</span>
                <span className="text-xs font-bold text-prussian dark:text-sea block">
                  SPED Unit: {schoolData.hasSpedUnit || "No"}
                </span>
                <span className="text-[10px] text-slate-500 block">Transport: {schoolData.hasTransportDisabled || "No"}</span>
              </div>
            </div>

            {/* Detailed Metadata Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card A: Institutional Identity & Coordinates */}
              <div className="p-5.5 bg-white dark:bg-ink rounded-2xl border border-slate-150 dark:border-slate-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-prussian dark:text-sea flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <Compass className="w-4 h-4 text-prussian dark:text-sea" />
                  <span>Administrative Coordinates & Location</span>
                </h4>
                <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 text-xs">
                  <div>
                    <span className="text-slate-400 block font-semibold text-[10.5px]">SCHOOL NAME</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{schoolData.name || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold text-[10.5px]">SCHOOL REGISTRATION NUMBER</span>
                    <span className="font-mono font-bold text-slate-850 dark:text-slate-200">{schoolData.regNum || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold text-[10.5px]">DISTRICT</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{schoolData.district || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold text-[10.5px]">EDUCATION REGION</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{schoolData.region || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold text-[10.5px]">SUB-REGION</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{schoolData.subRegion || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold text-[10.5px]">VILLAGE/ CITY/ TOWN</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{schoolData.village || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold text-[10.5px]">EXTENSION/ WARD</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{schoolData.extensionWard || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold text-[10.5px]">Email</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{schoolData.email || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold text-[10.5px]">TELEPHONE</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">{schoolData.tel || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold text-[10.5px]">FAX</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">{schoolData.fax || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Card B: Environmental Utilities & Access */}
              <div className="p-5.5 bg-white dark:bg-ink rounded-2xl border border-slate-150 dark:border-slate-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-prussian dark:text-sea flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <Bolt className="w-4 h-4 text-amber-500 animate-pulse" />
                  <span>Utilities, Power & Digital Infrastructure</span>
                </h4>
                <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 text-xs">
                  <div>
                    <span className="text-slate-400 block font-semibold text-[10.5px]">MAIN SOURCE_Electricity</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                      {schoolData.electricitySource || "None"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold text-[10.5px]">MAIN SOURCE_Water</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Droplets className="w-3.5 h-3.5 text-blue-500" />
                      {schoolData.waterSource || "None"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold text-[10.5px]">INTERNET INFRASTRUCTURE</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Network className="w-3.5 h-3.5 text-cyan-500" />
                      {schoolData.internetType || "None"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold text-[10.5px]">Internet Bandwidth Speed</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                      {schoolData.internetSpeed ? `${schoolData.internetSpeed} Mbps` : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold text-[10.5px]">Facility Router Coverage</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{schoolData.internetCoverage || "None"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold text-[10.5px]">SECURITY IN PLACE</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-sea" />
                      {schoolData.securityInPlace || "NONE"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card C: Stream Demographics Breakdown */}
              <div className="p-5.5 bg-white dark:bg-ink rounded-2xl border border-slate-150 dark:border-slate-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-prussian dark:text-sea flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <Layers className="w-4 h-4 text-prussian dark:text-sea" />
                  <span>Streams Registries (Std 1 - 7)</span>
                </h4>
                
                <div className="grid grid-cols-7 gap-2 text-center">
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                    const stdKey = `streamsStd${num}` as keyof SchoolInfo;
                    const val = schoolData[stdKey];
                    return (
                      <div key={num} className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="block text-[9px] font-bold text-slate-400 uppercase">Std {num}</span>
                        <span className="block text-[8px] text-slate-400 lowercase">streams</span>
                        <span className="text-sm font-black text-prussian dark:text-slate-200">{Number(val || 0)}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 bg-sea/5 dark:bg-slate-905/30 border border-sea/20 rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                    <span className="font-semibold text-[11px]">TOTAL NUMBER OF STREAMS:</span>
                    <span className="font-black text-sm text-prussian dark:text-sea">{schoolData.totalStreams || 0} Rooms</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400 text-[10px]">
                    <span>STREAM CHECK:</span>
                    <span className="font-bold">{schoolData.streamCheck || "Verified"}</span>
                  </div>
                </div>
              </div>

              {/* Card D: Operational Formats */}
              <div className="p-5.5 bg-white dark:bg-ink rounded-2xl border border-slate-150 dark:border-slate-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-prussian dark:text-sea flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <Activity className="w-4 h-4 text-prussian dark:text-sea" />
                  <span>Shift Formats, Boarding & Multigrades</span>
                </h4>
                <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 text-xs">
                  <div>
                    <span className="text-slate-400 block font-semibold text-[10.5px]">Shifting Classes Active?</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{schoolData.shifting || "No"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold text-[10.5px]">BOARDING</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{schoolData.boarding || "No"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold text-[10.5px]">MULTIGRADE CLASSES</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{schoolData.multigradeClasses || "No"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold text-[10.5px]">LIST OF MULTIGRADED CLASSES</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{schoolData.multigradeClassList || "None"}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block font-semibold text-[10.5px]">ENROLMENT IN EACH MULTIGRADED CLASS</span>
                    <span className="font-bold text-slate-850 dark:text-slate-200 block">{schoolData.multigradeEnrolment || "None"}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* ==========================================
             EDIT MODE: Categorized interactive forms
             ========================================== */
          <form onSubmit={handleSave} className="space-y-6 pt-4" id="school-info-form">
            
            {/* Category 1: General Info */}
            <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-prussian dark:text-sea flex items-center gap-2">
                <School className="w-4 h-4 text-sea" />
                <span>1. Core Institutional Identity</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider font-bold text-slate-500 mb-1">
                    SCHOOL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ""}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-hidden text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-prussian"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider font-bold text-slate-500 mb-1">
                    SCHOOL REGISTRATION NUMBER *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.regNum || ""}
                    onChange={(e) => handleFieldChange("regNum", e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-hidden font-mono text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider font-bold text-slate-500 mb-1">
                    TYPE OF SCHOOL
                  </label>
                  <select
                    value={formData.schoolType}
                    onChange={(e) => handleFieldChange("schoolType", e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-hidden text-slate-850 dark:text-slate-200"
                  >
                    <option value="Government">Government</option>
                    <option value="Private">Private</option>
                    <option value="Government Aided">Government Aided</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider font-bold text-slate-500 mb-1">
                    Status of Registration
                  </label>
                  <select
                    value={formData.registrationStatus}
                    onChange={(e) => handleFieldChange("registrationStatus", e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-hidden text-slate-850 dark:text-slate-200"
                  >
                    <option value="Registered">Registered fully</option>
                    <option value="Pending">Pending review</option>
                    <option value="Closed">Closed</option>
                    <option value="Provisionally Registered">Provisionally Registered</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Category 2: Geographic bounds & Contact details */}
            <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-prussian dark:text-sea flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sea" />
                <span>2. Locality Boundaries & Unified Contacts</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider font-bold text-slate-500 mb-1">DISTRICT</label>
                  <input
                    type="text"
                    value={formData.district || ""}
                    onChange={(e) => handleFieldChange("district", e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider font-bold text-slate-500 mb-1">EDUCATION REGION</label>
                  <input
                    type="text"
                    value={formData.region || ""}
                    onChange={(e) => handleFieldChange("region", e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider font-bold text-slate-500 mb-1">SUB-REGION</label>
                  <select
                    value={formData.subRegion || ""}
                    onChange={(e) => handleFieldChange("subRegion", e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-hidden text-slate-850 dark:text-slate-200"
                  >
                    <option value="">-- Choose Sub-Region --</option>
                    {BOTSWANA_SUB_REGIONS.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider font-bold text-slate-500 mb-1">VILLAGE/ CITY/ TOWN</label>
                  <input
                    type="text"
                    value={formData.village || ""}
                    onChange={(e) => handleFieldChange("village", e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider font-bold text-slate-500 mb-1">EXTENSION/ WARD</label>
                  <input
                    type="text"
                    value={formData.extensionWard || ""}
                    onChange={(e) => handleFieldChange("extensionWard", e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider font-bold text-slate-500 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider font-bold text-slate-500 mb-1">TELEPHONE *</label>
                  <input
                    type="text"
                    required
                    value={formData.tel || ""}
                    onChange={(e) => handleFieldChange("tel", e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider font-bold text-slate-500 mb-1">FAX</label>
                  <input
                    type="text"
                    value={formData.fax || ""}
                    onChange={(e) => handleFieldChange("fax", e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Category 3: Streams Breakdown */}
            <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-prussian dark:text-sea flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sea" />
                  <span>3. Classroom Streams Registries (Std 1 - 7)</span>
                </h4>
                <div className="text-[10px] bg-sea/15 text-sea px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                  Aggregating: {currentTotalStreams} Active Streams
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                  const key = `streamsStd${num}` as keyof SchoolInfo;
                  return (
                    <div key={num} className="p-3 bg-white dark:bg-ink rounded-2xl border border-slate-250 dark:border-slate-850 space-y-1 text-center">
                      <label className="block text-[8.5px] font-black text-slate-500 uppercase tracking-wide">Std {num} Room</label>
                      <label className="block text-[7.5px] font-black text-slate-400 uppercase tracking-wide">NUMBER OF STREAMS</label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={formData[key] ?? 0}
                        onChange={(e) => handleFieldChange(key, parseInt(e.target.value) || 0)}
                        className="w-full text-center text-xs p-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
                      />
                    </div>
                  );
                })}

                <div className="p-3 bg-white dark:bg-ink rounded-2xl border border-slate-250 dark:border-slate-850 space-y-1 text-center col-span-2 lg:col-span-1">
                  <label className="block text-[9.5px] font-black text-golden uppercase tracking-wide">TOTAL NUMBER OF STREAMS</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.totalStreams ?? 0}
                    onChange={(e) => handleFieldChange("totalStreams", parseInt(e.target.value) || 0)}
                    className="w-full text-center text-xs p-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded font-bold"
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-400 italic">
                * Note: If standard classrooms count sum does not match the reported total sum of streams, stream validation state changes automatically to &quot;Review Needed&quot; upon saving. Refer to national policy thresholds.
              </p>
            </div>

            {/* Category 4: Operations & Inclusive Education */}
            <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-prussian dark:text-sea flex items-center gap-2">
                <Activity className="w-4 h-4 text-sea" />
                <span>4. Operational Layouts & Inclusive Accommodations</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5">
                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider font-bold text-slate-500 mb-1">
                    SHIFTING
                  </label>
                  <select
                    value={formData.shifting}
                    onChange={(e) => handleFieldChange("shifting", e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-hidden text-slate-850 dark:text-slate-200"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider font-bold text-slate-500 mb-1">
                    BOARDING *
                  </label>
                  <select
                    value={formData.boarding}
                    onChange={(e) => handleFieldChange("boarding", e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-hidden text-slate-850 dark:text-slate-200"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider font-bold text-slate-500 mb-1">
                    MULTIGRADE CLASSES *
                  </label>
                  <select
                    value={formData.multigradeClasses}
                    onChange={(e) => handleFieldChange("multigradeClasses", e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-hidden text-slate-850 dark:text-slate-200"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider font-bold text-slate-500 mb-1">
                    LIST OF MULTIGRADED CLASSES
                  </label>
                  <input
                    type="text"
                    value={formData.multigradeClassList || ""}
                    onChange={(e) => handleFieldChange("multigradeClassList", e.target.value)}
                    placeholder="e.g. Standard 3 & 4 Social studies"
                    className="w-full text-xs p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider font-bold text-slate-500 mb-1">
                    ENROLMENT IN EACH MULTIGRADED CLASS
                  </label>
                  <input
                    type="text"
                    value={formData.multigradeEnrolment || ""}
                    onChange={(e) => handleFieldChange("multigradeEnrolment", e.target.value)}
                    placeholder="e.g. 15 Pupils total composite"
                    className="w-full text-xs p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider font-bold text-slate-500 mb-1">
                    SCHOOL HAS SPED UNIT
                  </label>
                  <select
                    value={formData.hasSpedUnit}
                    onChange={(e) => handleFieldChange("hasSpedUnit", e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-hidden text-slate-850 dark:text-slate-200"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider font-bold text-slate-500 mb-1">
                    SCHOOL HAS TRANSPORT FOR DISABLED
                  </label>
                  <select
                    value={formData.hasTransportDisabled}
                    onChange={(e) => handleFieldChange("hasTransportDisabled", e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-hidden text-slate-850 dark:text-slate-200"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider font-bold text-slate-500 mb-1">
                    SECURITY IN PLACE
                  </label>
                  <select
                    value={formData.securityInPlace}
                    onChange={(e) => handleFieldChange("securityInPlace", e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-hidden text-slate-850 dark:text-slate-200"
                  >
                    <option value="Internal">Internal</option>
                    <option value="Outsourced">Outsourced</option>
                    <option value="Internal and Outsourced">Internal and Outsourced</option>
                    <option value="NONE">NONE</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Category 5: Environmental power & connective links */}
            <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-prussian dark:text-sea flex items-center gap-2">
                <Bolt className="w-4 h-4 text-amber-500" />
                <span>5. Environmental Grids & Digital Coverage</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5">
                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider font-bold text-slate-500 mb-1">
                    MAIN SOURCE - Electricity
                  </label>
                  <select
                    value={formData.electricitySource}
                    onChange={(e) => handleFieldChange("electricitySource", e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-hidden text-slate-850 dark:text-slate-200"
                  >
                    <option value="Solar Power">Solar Power</option>
                    <option value="Grid Power (BPC)">Grid Power (BPC)</option>
                    <option value="Generator">Generator</option>
                    <option value="None">None</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider font-bold text-slate-550 mb-1">
                    MAIN SOURCE - Water
                  </label>
                  <select
                    value={formData.waterSource}
                    onChange={(e) => handleFieldChange("waterSource", e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-hidden text-slate-850 dark:text-slate-200"
                  >
                    <option value="Stand Pipe (WUC)">Stand Pipe (WUC)</option>
                    <option value="Borehole">Borehole</option>
                    <option value="Water Tanker">Water Tanker</option>
                    <option value="None">None</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider font-bold text-slate-550 mb-1">
                    INTERNET INFRASTRUCTURE
                  </label>
                  <select
                    value={formData.internetType}
                    onChange={(e) => handleFieldChange("internetType", e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-hidden text-slate-850 dark:text-slate-200"
                  >
                    <option value="LAN + Wi-Fi">LAN + Wi-Fi</option>
                    <option value="Wi-Fi">Wi-Fi</option>
                    <option value="LAN">LAN</option>
                    <option value="None">None</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider font-bold text-slate-500 mb-1">
                    Bandwidth speed capacity (Mbps)
                  </label>
                  <input
                    type="text"
                    value={formData.internetSpeed || ""}
                    onChange={(e) => handleFieldChange("internetSpeed", e.target.value)}
                    placeholder="e.g. 10 or 100"
                    className="w-full text-xs p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider font-bold text-slate-500 mb-1">
                    COVERAGE
                  </label>
                  <select
                    value={formData.internetCoverage}
                    onChange={(e) => handleFieldChange("internetCoverage", e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-hidden text-slate-850 dark:text-slate-200"
                  >
                    <option value="Full">Full</option>
                    <option value="Partial">Partial</option>
                    <option value="None">None</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sticky Actions Group */}
            <div className="flex justify-end gap-3.5 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              >
                Discard Parameters
              </button>
              <button
                type="submit"
                id="btn-save-school-info"
                className="flex items-center gap-1.5 px-6 py-3 rounded-xl text-white font-bold text-xs bg-sea hover:bg-sea/85 transition-colors shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Registry Parameters</span>
              </button>
            </div>

          </form>
        )}
      </SectionContainer>
    </div>
  );
};

export default SchoolInfoRegistry;
