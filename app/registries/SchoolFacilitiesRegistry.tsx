"use client";

import React, { useState, useMemo } from "react";
import { 
  Building, 
  Save, 
  Trash2, 
  AlertCircle,
  FileCheck,
  Package,
  Wrench,
  Search,
  ChevronLeft,
  ChevronRight,
  Database,
  ArrowRightCircle
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { SectionContainer } from "../shared/SectionContainer";
import { motion, AnimatePresence } from "motion/react";

export interface SchoolFacilitiesData {
  A: number; // PREMISES - NUMBER OF CLASSROOMS
  B: number; // PREMISES - PIT LATRINES (Staff)
  C: number; // PREMISES - PIT LATRINES (Pupils)
  D: number; // PREMISES - JUNIOR FLUSH TOILETS (Male)
  E: number; // PREMISES - JUNIOR FLUSH TOILETS (Female)
  F: number; // PREMISES - ADULT FLUSH TOILETS (Male)
  G: number; // PREMISES - ADULT FLUSH TOILETS (Female)
  H: number; // PREMISES - TOILETS FOR PEOPLE WITH DISABILITY (Adult)
  I: number; // PREMISES - TOILETS FOR PEOPLE WITH DISABILITY (Junior)
  J: number; // PREMISES - HALLS
  K: number; // PREMISES - OFFICE
  L: number; // PREMISES - KITCHEN
  M: number; // PREMISES - SICKBAY
  N: number; // PREMISES - STORE ROOM
  O: number; // PREMISES - RAMPS
  P: number; // PREMISES - OTHER PREMISES

  Q: number; // STORAGE SPACE FACILITIES - SHELVES
  R: number; // STORAGE SPACE FACILITIES - CUPBOARDS
  S: number; // STORAGE SPACE FACILITIES - CUBICLES
  T: number; // STORAGE SPACE FACILITIES - WALL HOOKS
  U: number; // STORAGE SPACE FACILITIES - OTHER STORAGE

  V: number; // FURNITURE ITEMS - JUNIOR CHAIRS
  W: number; // FURNITURE ITEMS - JUNIOR TABLES
  X: number; // FURNITURE ITEMS - OFFICE CHAIRS
  Y: number; // FURNITURE ITEMS - OFFICE TABLES
  Z: number; // FURNITURE ITEMS - SICK BAY BEDS
  AA: number; // FURNITURE ITEMS - OTHER FURNITURE

  AB: number; // EQUIPMENT IN GOOD WORKING CONDITION - TV
  AC: number; // EQUIPMENT IN GOOD WORKING CONDITION - COMPUTER
  AD: number; // EQUIPMENT IN GOOD WORKING CONDITION - FRIDGE
  AE: number; // EQUIPMENT IN GOOD WORKING CONDITION - HEATER
  AF: number; // EQUIPMENT IN GOOD WORKING CONDITION - FAN
  AG: number; // EQUIPMENT IN GOOD WORKING CONDITION - WASHING TUBS
  AH: number; // EQUIPMENT IN GOOD WORKING CONDITION - WASHING BASINS
  AI: number; // EQUIPMENT IN GOOD WORKING CONDITION - FIRST AID KIT
  AJ: number; // EQUIPMENT IN GOOD WORKING CONDITION - VIDEO/ DVD PLAYER
  AK: number; // EQUIPMENT IN GOOD WORKING CONDITION - STOVE
  AL: number; // EQUIPMENT IN GOOD WORKING CONDITION - AIR CONDITIONER
  AM: number; // EQUIPMENT IN GOOD WORKING CONDITION - FIRE EXTINGUISHER
  AN: number; // EQUIPMENT IN GOOD WORKING CONDITION - OTHER EQUIPMENT

  AO: number; // MATERIALS - MATTRESSES
  AP: number; // MATERIALS - WOOLEN CARPETS/ MATS (AT LEAST 2.8m X 3.7)
  AQ: number; // MATERIALS - BLANKETS
  AR: number; // MATERIALS - OTHER MATERIALS

  AS: number; // PLAY EQUIPMENT - SWINGS
  AT: number; // PLAY EQUIPMENT - SLIDES
  AU: number; // PLAY EQUIPMENT - PUSH TOYS
  AV: number; // PLAY EQUIPMENT - PULL TOYS
  AW: number; // PLAY EQUIPMENT - SEE-SAW
  AX: number; // PLAY EQUIPMENT - ROUND ABOUT
  AY: number; // PLAY EQUIPMENT - JUNGLE JIM
  AZ: number; // PLAY EQUIPMENT - CLIMBING FRAME
  BA: number; // PLAY EQUIPMENT - TRI-CYCLE
  BB: number; // PLAY EQUIPMENT - PLAY AREA
  BC: number; // PLAY EQUIPMENT - OTHER PLAY EQUIPMENT
}

interface SavedFacilityRecord {
  id: string;
  dateSubmitted: string;
  data: SchoolFacilitiesData;
  totalItems: number;
}

const DEFAULT_FACILITIES_DATA: SchoolFacilitiesData = {
  A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0, I: 0, J: 0, K: 0, L: 0, M: 0, N: 0, O: 0, P: 0,
  Q: 0, R: 0, S: 0, T: 0, U: 0,
  V: 0, W: 0, X: 0, Y: 0, Z: 0, AA: 0,
  AB: 0, AC: 0, AD: 0, AE: 0, AF: 0, AG: 0, AH: 0, AI: 0, AJ: 0, AK: 0, AL: 0, AM: 0, AN: 0,
  AO: 0, AP: 0, AQ: 0, AR: 0,
  AS: 0, AT: 0, AU: 0, AV: 0, AW: 0, AX: 0, AY: 0, AZ: 0, BA: 0, BB: 0, BC: 0
};

export const SchoolFacilitiesRegistry: React.FC = () => {
  const { items: savedRecords, setData: setSavedRecords } = useLocalStorage<SavedFacilityRecord>(
    "ec_facilities_list_v2",
    []
  );

  const [formData, setFormData] = useState<SchoolFacilitiesData>({ ...DEFAULT_FACILITIES_DATA });
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Search and Pagination for saved records
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleFieldChange = (key: keyof SchoolFacilitiesData, val: string) => {
    const numericVal = val === "" ? 0 : parseInt(val, 10);
    setFormData(prev => ({
      ...prev,
      [key]: isNaN(numericVal) ? 0 : Math.max(0, numericVal)
    }));
  };

  const calculateSum = (data: SchoolFacilitiesData) => {
    return Object.values(data).reduce((acc, curr) => acc + (curr || 0), 0);
  };

  const currentSumTotal = useMemo(() => calculateSum(formData), [formData]);

  const classroomCount = formData.A;
  const playgroundCount = [
    formData.AS, formData.AT, formData.AU, formData.AV, formData.AW, 
    formData.AX, formData.AY, formData.AZ, formData.BA, formData.BB, formData.BC
  ].reduce((acc, curr) => acc + (curr || 0), 0);

  const furnitureCount = [
    formData.V, formData.W, formData.X, formData.Y, formData.Z, formData.AA
  ].reduce((acc, curr) => acc + (curr || 0), 0);

  const sanitationCount = [
    formData.B, formData.C, formData.D, formData.E, formData.F, formData.G, formData.H, formData.I
  ].reduce((acc, curr) => acc + (curr || 0), 0);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentSumTotal === 0) {
      triggerToast("Cannot save an empty facility registry. Please enter values.", "error");
      return;
    }

    const timestamp = new Date().toLocaleString();
    const newRecord: SavedFacilityRecord = {
      id: `FAC-${Math.floor(Math.random() * 90000) + 10000}`,
      dateSubmitted: timestamp,
      data: { ...formData },
      totalItems: currentSumTotal
    };

    setSavedRecords(prev => [newRecord, ...prev]);
    setFormData({ ...DEFAULT_FACILITIES_DATA });
    triggerToast("Early Childhood School Facilities log saved successfully.", "success");
    setCurrentPage(1);
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear all form fields?")) {
      setFormData({ ...DEFAULT_FACILITIES_DATA });
      triggerToast("Form indicators cleared back to 0.", "success");
    }
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm("Are you sure you want to delete this historical facility record?")) {
      setSavedRecords(prev => prev.filter(r => r.id !== id));
      triggerToast("Facility record deleted successfully.", "success");
    }
  };

  // Filtered lists
  const filteredRecords = useMemo(() => {
    if (!searchQuery) return savedRecords;
    const query = searchQuery.toLowerCase();
    return savedRecords.filter(r => 
      r.id.toLowerCase().includes(query) ||
      r.dateSubmitted.toLowerCase().includes(query)
    );
  }, [searchQuery, savedRecords]);

  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredRecords.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredRecords, currentPage]);

  const totalPages = Math.ceil(filteredRecords.length / rowsPerPage) || 1;

  // Render Section Grid
  const renderField = (label: string, fieldKey: keyof SchoolFacilitiesData) => {
    return (
      <div 
        key={fieldKey}
        className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-lg gap-4 hover:border-sea/30 transition-all group"
      >
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block max-w-md">
          {label}
        </span>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            value={formData[fieldKey]}
            onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
            className="w-24 px-3 py-1.5 text-center text-xs font-mono font-bold bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-700 rounded focus:border-sea focus:outline-none transition-colors dark:text-slate-100 placeholder-slate-400"
            onFocus={(e) => e.target.select()}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6" id="ece-school-facilities-registry">
      {/* Toast Alert Banner */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-xl border flex items-start gap-3 text-xs font-bold shadow-lg ${
              toast.type === "success" 
                ? "bg-[#00A3A3]/10 border-[#00A3A3]/40 text-[#00A3A3] dark:bg-[#001428]/95 dark:border-[#00A3A3]/50" 
                : "bg-rose-500/10 border-rose-500/30 text-rose-500"
            }`}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div className="space-y-0.5">
              <span className="font-bold block uppercase tracking-wider">
                {toast.type === "success" ? "Notification" : "Alert"}
              </span>
              <span>{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SectionContainer
        title="School Facilities Registry"
        description="Comprehensive inventory log tracking physical infrastructure, storage spaces, furniture, play equipment, and classroom assets with zero field suffixes."
      >
        <form onSubmit={handleSave} className="space-y-8">
          {/* Action Header */}
          <div className="flex flex-wrap justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
            <div>
              <h3 className="text-sm font-black text-[#002652] dark:text-[#00A3A3] uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-4 h-4 text-[#00A3A3]" />
                FACILITY CAPACITIES & INVENTORY
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium font-sans">
                Verify physical criteria and compliance standards for ECCE premises.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-[#001428] text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-2 cursor-pointer text-xs font-bold rounded-lg"
              >
                <Trash2 className="w-4 h-4 text-rose-500" />
                <span>Clear Form</span>
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-prussian hover:bg-[#001c3d] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4 text-[#00A3A3]" />
                <span>Save Inventory</span>
              </button>
            </div>
          </div>

          {/* Core metrics summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-[#001020] border border-slate-200 dark:border-slate-800 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Number of Classrooms</span>
              <span className="text-2xl font-black text-prussian dark:text-slate-200 block font-mono mt-1">{classroomCount}</span>
            </div>
            <div className="bg-slate-50 dark:bg-[#001020] border border-slate-200 dark:border-slate-800 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Sanitation Facilities</span>
              <span className="text-2xl font-black text-prussian dark:text-slate-200 block font-mono mt-1">{sanitationCount}</span>
            </div>
            <div className="bg-slate-50 dark:bg-[#001020] border border-slate-200 dark:border-slate-800 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Furniture Assets</span>
              <span className="text-2xl font-black text-prussian dark:text-slate-200 block font-mono mt-1">{furnitureCount}</span>
            </div>
            <div className="bg-slate-50 dark:bg-[#001020] border border-slate-200 dark:border-slate-800 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Playground Equipment</span>
              <span className="text-2xl font-black text-prussian dark:text-slate-200 block font-mono mt-1">{playgroundCount}</span>
            </div>
          </div>

          {/* SECTION 1: Premises Infrastructure */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-[#002652] dark:text-[#00A3A3] tracking-widest uppercase flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800/60 font-sans">
              <span className="w-1.5 h-3 bg-[#00A3A3] rounded-sm"></span>
              Premises Infrastructure
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField("Number of Classrooms", "A")}
              {renderField("Pit Latrines for Staff members", "B")}
              {renderField("Pit Latrines for Pupils/Children", "C")}
              {renderField("Junior Flush Toilets (Male)", "D")}
              {renderField("Junior Flush Toilets (Female)", "E")}
              {renderField("Adult Flush Toilets (Male)", "F")}
              {renderField("Adult Flush Toilets (Female)", "G")}
              {renderField("Toilets for Adults with Physical Disabilities", "H")}
              {renderField("Toilets for Children/Juniors with Physical Disabilities", "I")}
              {renderField("Halls (Assembly or Activity Rooms)", "J")}
              {renderField("Administrative & Main Offices", "K")}
              {renderField("Kitchen or Food Preparation Area", "L")}
              {renderField("Sickbay or Emergency Healthcare Station", "M")}
              {renderField("Dedicated Store Rooms", "N")}
              {renderField("Accessibility Ramps installed", "O")}
              {renderField("Other Operational Premises", "P")}
            </div>
          </div>

          {/* SECTION 2: Storage spaces */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-[#002652] dark:text-[#00A3A3] tracking-widest uppercase flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800/60 font-sans">
              <span className="w-1.5 h-3 bg-[#00A3A3] rounded-sm"></span>
              Storage Space Facilities
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField("Shelves and Display racks", "Q")}
              {renderField("Lockable Cupboards", "R")}
              {renderField("Individual Cubicles", "S")}
              {renderField("Wall Hooks for Bags and Coats", "T")}
              {renderField("Other Storage Furniture", "U")}
            </div>
          </div>

          {/* SECTION 3: Furniture */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-[#002652] dark:text-[#00A3A3] tracking-widest uppercase flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800/60 font-sans">
              <span className="w-1.5 h-3 bg-[#00A3A3] rounded-sm"></span>
              Furniture Items
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField("Junior Chairs", "V")}
              {renderField("Junior Tables", "W")}
              {renderField("Office Chairs for Staff", "X")}
              {renderField("Office Tables / Desks", "Y")}
              {renderField("Sick Bay Beds", "Z")}
              {renderField("Other Furniture Items", "AA")}
            </div>
          </div>

          {/* SECTION 4: Equipment */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-[#002652] dark:text-[#00A3A3] tracking-widest uppercase flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800/60 font-sans">
              <span className="w-1.5 h-3 bg-[#00A3A3] rounded-sm"></span>
              Equipment in Good Working Condition
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField("Television Sets (TV)", "AB")}
              {renderField("Operational Computers", "AC")}
              {renderField("Food Refrigerators", "AD")}
              {renderField("Room Heaters", "AE")}
              {renderField("Ventilation Fans", "AF")}
              {renderField("Washing Tubs", "AG")}
              {renderField("Washing Basins", "AH")}
              {renderField("First Aid Kits", "AI")}
              {renderField("Video / DVD Players", "AJ")}
              {renderField("Cooking Stoves", "AK")}
              {renderField("Air Conditioners", "AL")}
              {renderField("Fire Extinguishers", "AM")}
              {renderField("Other Specialized Equipment", "AN")}
            </div>
          </div>

          {/* SECTION 5: Materials */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-[#002652] dark:text-[#00A3A3] tracking-widest uppercase flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800/60 font-sans">
              <span className="w-1.5 h-3 bg-[#00A3A3] rounded-sm"></span>
              Materials and Carpeting
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField("Sleeping Mattresses", "AO")}
              {renderField("Woolen Carpets / Mats (at least 2.8m x 3.7m)", "AP")}
              {renderField("Sleeping Blankets", "AQ")}
              {renderField("Other Soft Bedding / Materials", "AR")}
            </div>
          </div>

          {/* SECTION 6: Play Equipment */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-[#002652] dark:text-[#00A3A3] tracking-widest uppercase flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800/60 font-sans">
              <span className="w-1.5 h-3 bg-[#00A3A3] rounded-sm"></span>
              Play Area Equipment
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField("Outdoors Swings", "AS")}
              {renderField("Play Slides", "AT")}
              {renderField("Mobile Push Toys", "AU")}
              {renderField("Mobile Pull Toys", "AV")}
              {renderField("See-Saw structures", "AW")}
              {renderField("Round Abouts", "AX")}
              {renderField("Jungle Jim Climbing structure", "AY")}
              {renderField("General Climbing Frames", "AZ")}
              {renderField("Tri-Cycle units", "BA")}
              {renderField("Designated Fenced Play Area", "BB")}
              {renderField("Other Outdoor Play items", "BC")}
            </div>
          </div>

          {/* Submit block bottom */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-[#001428] text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-2 cursor-pointer text-xs font-bold rounded-lg"
            >
              <Trash2 className="w-4 h-4 text-rose-500" />
              <span>Clear Form</span>
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-prussian hover:bg-[#001c3d] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4 text-[#00A3A3]" />
              <span>Save Inventory Log</span>
            </button>
          </div>
        </form>
      </SectionContainer>

      {/* History Log Table */}
      <div className="pt-4">
        <h3 className="text-sm font-black text-[#002652] dark:text-snow uppercase tracking-wider mb-3 flex items-center gap-2">
          <Database className="w-4 h-4 text-[#00A3A3]" />
          SAVED FACILITIES HISTORICAL HISTORY
        </h3>

        <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800/80 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-805">
            <div className="relative w-full max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input 
                type="text" 
                placeholder="Search index logs..." 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-705 rounded focus:border-sea focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 font-semibold">
                  <th className="px-5 py-3 text-left">Log ID</th>
                  <th className="px-5 py-3 text-left">Date Recorded</th>
                  <th className="px-5 py-3 text-center">Classrooms</th>
                  <th className="px-5 py-3 text-center">Sanitation</th>
                  <th className="px-5 py-3 text-center">Playground Units</th>
                  <th className="px-5 py-3 text-center">Furniture Items</th>
                  <th className="px-5 py-3 text-center">Total Inventory</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {paginatedRecords.length > 0 ? paginatedRecords.map((rec) => {
                  const s = rec.data;
                  const classrooms = s.A || 0;
                  const san = [s.B, s.C, s.D, s.E, s.F, s.G, s.H, s.I].reduce((a, b) => a + (b || 0), 0);
                  const play = [s.AS, s.AT, s.AU, s.AV, s.AW, s.AX, s.AY, s.AZ, s.BA, s.BB, s.BC].reduce((a, b) => a + (b || 0), 0);
                  const furn = [s.V, s.W, s.X, s.Y, s.Z, s.AA].reduce((a, b) => a + (b || 0), 0);
                  
                  return (
                    <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="px-5 py-3 font-mono font-bold text-sea">{rec.id}</td>
                      <td className="px-5 py-3 max-w-xs truncate text-slate-600 dark:text-slate-400">{rec.dateSubmitted}</td>
                      <td className="px-5 py-3 text-center font-mono font-semibold">{classrooms}</td>
                      <td className="px-5 py-3 text-center font-mono text-slate-500">{san}</td>
                      <td className="px-5 py-3 text-center font-mono text-slate-500">{play}</td>
                      <td className="px-5 py-3 text-center font-mono text-slate-500">{furn}</td>
                      <td className="px-5 py-3 text-center font-mono font-bold text-prussian dark:text-snow">{rec.totalItems}</td>
                      <td className="px-5 py-3 text-center">
                        <button 
                          onClick={() => handleDeleteRecord(rec.id)} 
                          className="text-rose-400 hover:text-rose-600 p-1" 
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={8} className="px-5 py-8 text-center text-slate-400 italic">
                      No facility record log logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">Page {currentPage} of {totalPages}</span>
              <div className="flex items-center gap-1">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="p-1 px-2 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-black/30 text-slate-700 dark:text-slate-300 disabled:opacity-40"
                >
                  Prev
                </button>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="p-1 px-2 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-black/30 text-slate-700 dark:text-slate-300 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolFacilitiesRegistry;
