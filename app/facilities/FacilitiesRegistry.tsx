"use client";

import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { 
  Save, 
  Trash2, 
  AlertCircle,
  Hammer,
  Search,
  ChevronLeft,
  ChevronRight,
  Database,
  Layers,
  Sparkles,
  Home,
  CheckSquare
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { motion, AnimatePresence } from "motion/react";

type FormState = Record<string, number>;

interface FacilityRecord {
  id: string; // Entry ID
  dateSubmitted: string;
  items: Record<string, number>;
  otherSpecifyText: string;
  totalQuantity: number;
}

interface CategoryItem {
  id: string;
  label: string;
  isOther?: boolean;
}

interface Category {
  id: string;
  title: string;
  items: CategoryItem[];
}

const CATEGORIES: Category[] = [
  {
    id: "cat_1",
    title: "Section 1: Learning Spaces",
    items: [
      { id: "classrooms", label: "Classrooms" },
      { id: "classroomsWc", label: "Classrooms Accessible by Wheelchair" },
      { id: "spedUnits", label: "Special Education Units (SPED Classrooms)" },
      { id: "agricLabs", label: "Agric Labs" },
      { id: "scienceLabs", label: "Science Labs" },
      { id: "homeEcLabs", label: "Home Economics Labs" },
      { id: "artLabs", label: "Art Labs" },
      { id: "dtLabs", label: "D&T Labs" },
      { id: "computerLabs", label: "Computer Labs" },
      { id: "labsWc", label: "Labs Accessible by Wheelchair" },
    ]
  },
  {
    id: "cat_2",
    title: "Section 2: Halls & Common Spaces",
    items: [
      { id: "library", label: "Library" },
      { id: "resourceRoom", label: "Resource Room" },
      { id: "counselingRoom", label: "Counseling Room" },
      { id: "multipurposeHall", label: "Multipurpose Hall" },
      { id: "assemblyHall", label: "Assembly Hall" },
      { id: "diningHall", label: "Dining Hall" },
      { id: "hallsWc", label: "Halls Accessible by Wheelchair" },
    ]
  },
  {
    id: "cat_3",
    title: "Section 3: Kitchen & Toilets",
    items: [
      { id: "kitchen", label: "Kitchen" },
      { id: "pitBoys", label: "Pit Latrine – Boys" },
      { id: "pitGirls", label: "Pit Latrine – Girls" },
      { id: "flushBoys", label: "Flush Toilets – Boys" },
      { id: "flushGirls", label: "Flush Toilets – Girls" },
      { id: "toiletsPwd", label: "Toilets for People with Disability" },
      { id: "toiletsWc", label: "Toilets Accessible by Wheelchair" },
      { id: "toiletsTeachers", label: "Toilets for Teachers" },
      { id: "toiletsTeachersPwd", label: "Toilets for Teachers with Disability" },
      { id: "toiletsTeachersWc", label: "Toilets for Teachers Accessible by Wheelchair" },
    ]
  },
  {
    id: "cat_4",
    title: "Section 4: Accessibility & Safety",
    items: [
      { id: "handRails", label: "Hand Rails" },
      { id: "noticeBoards", label: "Notice Boards" },
      { id: "ramps", label: "Ramps" },
      { id: "schoolGarden", label: "School Garden" },
    ]
  },
  {
    id: "cat_5",
    title: "Section 5: Administration & Staff Housings",
    items: [
      { id: "adminBlock", label: "Admin Block" },
      { id: "staffRoom", label: "Staff Room(s)" },
      { id: "staffOffices", label: "Staff Offices" },
      { id: "adminWc", label: "Administrative Offices Accessible by Wheelchair" },
      { id: "staffHouse1", label: "1 Bedroom Staff House" },
      { id: "staffHouse2", label: "2 Bedroom Staff House" },
      { id: "staffHouse3", label: "3 Bedroom Staff House" },
      { id: "staffHouse4", label: "4 Bedroom Staff House" },
    ]
  },
  {
    id: "cat_6",
    title: "Section 6: Other Facilities",
    items: [
      { id: "other", label: "Other Facility (Specify)", isOther: true },
    ]
  }
];

const getInitialFormState = (): FormState => {
  const state: FormState = {};
  CATEGORIES.forEach(cat => {
    cat.items.forEach(item => {
      state[item.id] = 0;
    });
  });
  return state;
};

export const FacilitiesRegistry: React.FC = () => {
  const {
    items: savedRecords,
    setData: setSavedRecords,
    deleteItem,
  } = useLocalStorage<FacilityRecord>("facilities_registry_v3_data", []);

  const [formState, setFormState] = useState<FormState>(getInitialFormState());
  const [otherSpecifyText, setOtherSpecifyText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Compute Overall Totals
  const { totalFacilities, countLearning, countSanitation, countAccessibility } = useMemo(() => {
    let learning = 0;
    let sanitation = 0;
    let access = 0;
    let total = 0;

    CATEGORIES[0].items.forEach(item => { learning += (formState[item.id] || 0); });
    
    CATEGORIES[2].items.forEach(item => { 
      if (item.id.includes("pit") || item.id.includes("flush") || item.id.includes("toilets")) {
        sanitation += (formState[item.id] || 0); 
      }
    });

    CATEGORIES.forEach(cat => {
      cat.items.forEach(item => {
        if (item.id.includes("Wc") || item.id === "ramps" || item.id === "handRails") {
          access += (formState[item.id] || 0);
        }
      });
    });

    total = Object.values(formState).reduce((acc, curr) => acc + (curr || 0), 0);

    return { totalFacilities: total, countLearning: learning, countSanitation: sanitation, countAccessibility: access };
  }, [formState]);

  // Handle Input Change
  const handleInputChange = (id: string, value: number) => {
    setFormState(prev => ({
      ...prev,
      [id]: isNaN(value) ? 0 : Math.max(0, value)
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalFacilities === 0) {
      triggerToast("No facility counts entered to save.", "error");
      return;
    }

    const dateSubmitted = format(new Date(), "yyyy-MM-dd HH:mm");
    
    const newRecord: FacilityRecord = {
      id: `FAC-${Math.floor(Math.random() * 90000) + 10000}`,
      dateSubmitted,
      items: { ...formState },
      otherSpecifyText,
      totalQuantity: totalFacilities
    };

    setSavedRecords(prev => [newRecord, ...prev]);
    setFormState(getInitialFormState());
    setOtherSpecifyText("");
    triggerToast(`Successfully recorded campus facilities data.`, "success");
    setCurrentPage(1);
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear the facilities records?")) {
      setFormState(getInitialFormState());
      setOtherSpecifyText("");
      triggerToast("Form indicators reset.", "success");
    }
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm("Are you sure you want to delete this historical facility record?")) {
      setSavedRecords(prev => prev.filter(r => r.id !== id));
      triggerToast("Facilities log entry deleted.", "success");
    }
  };

  // Filter lists
  const filteredRecords = useMemo(() => {
    if (!searchQuery) return savedRecords;
    const query = searchQuery.toLowerCase();
    return savedRecords.filter(r => 
      r.id.toLowerCase().includes(query) ||
      r.dateSubmitted.includes(query)
    );
  }, [searchQuery, savedRecords]);

  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredRecords.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredRecords, currentPage]);

  const totalPages = Math.ceil(filteredRecords.length / rowsPerPage) || 1;

  return (
    <div className="space-y-6 animate-fade-in" id="primary-facilities-registry">
      {/* Toast Alert Banner */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-xl border flex items-start gap-3 text-xs font-bold shadow-lg ${
              toast.type === "success" 
                ? "bg-[#00A3A3]/10 border-[#00A3A3]/40 text-[#00A3A3] dark:bg-[#001428]/95 dark:border-[#00a3a3]/50" 
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

      <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800/80 rounded-xl p-6 shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Action Header */}
          <div className="flex flex-wrap justify-between items-center pb-4 border-b border-slate-150 dark:border-slate-800/60 gap-4">
            <div>
              <h2 className="text-sm font-black text-[#002652] dark:text-[#00A3A3] uppercase tracking-wider flex items-center gap-1.5 font-sans">
                <Hammer className="w-4 h-4 text-[#00A3A3]" />
                FACILITIES & INFRASTRUCTURE DATA ARCHIVE
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium font-sans">
                Register administrative blocks, sanitations, learning spaces, and housing accessibility constraints.
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
                className="px-5 py-2 bg-[#002652] hover:bg-[#001c3d] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4 text-[#00A3A3]" />
                <span>Save Facilities Records</span>
              </button>
            </div>
          </div>

          {/* 4 Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-sans">Recorded structural units</span>
              <span className="text-xl font-black text-[#002652] dark:text-snow block font-mono mt-0.5">{totalFacilities}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-sans">Learning Classrooms & Labs</span>
              <span className="text-xl font-black text-amber-500 block font-mono mt-0.5">{countLearning}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-sans">Sanitation & Washrooms</span>
              <span className="text-xl font-black text-emerald-600 block font-mono mt-0.5">{countSanitation}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-sans">WC Accessible safeguards</span>
              <span className="text-xl font-black text-[#00A3A3] block font-mono mt-0.5">{countAccessibility}</span>
            </div>
          </div>

          {/* Categories Grid list */}
          <div className="space-y-6">
            {CATEGORIES.map(category => {
              return (
                <div 
                  key={category.id} 
                  className="bg-slate-50/50 dark:bg-[#000d1a] border border-slate-200/80 dark:border-slate-805 rounded-xl overflow-hidden p-5 space-y-4"
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800/60 font-sans">
                    <h3 className="text-xs font-black text-[#002652] dark:text-[#00A3A3] tracking-widest uppercase flex items-center gap-2">
                      <span className="w-1 h-3 bg-[#00A3A3] rounded-sm"></span>
                      {category.title}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.items.map(item => {
                      const value = formState[item.id] || 0;
                      return (
                        <div 
                          key={item.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white dark:bg-[#001020] border border-slate-100 dark:border-slate-805 rounded-lg gap-4 transition-all hover:border-[#00a3a3]/30"
                        >
                          <div className="flex-1 flex items-start gap-2.5 font-sans">
                            <div className="space-y-1.5">
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">{item.label}</span>
                              {item.isOther && (
                                <input
                                  type="text"
                                  placeholder="Specify custom facility label..."
                                  value={otherSpecifyText}
                                  onChange={(e) => setOtherSpecifyText(e.target.value)}
                                  className="w-full max-w-sm px-3 py-1 text-xs bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-700 rounded focus:border-sea focus:outline-none transition-colors dark:text-white"
                                />
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900/40 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-800">
                              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">Count</span>
                              <input
                                type="number"
                                min="0"
                                value={value}
                                onChange={(e) => handleInputChange(item.id, parseInt(e.target.value) || 0)}
                                className="w-12 bg-transparent text-center text-sm font-mono font-bold focus:outline-none dark:text-slate-100"
                                onFocus={(e) => e.target.select()}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 font-sans">
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
              className="px-6 py-2 bg-[#002652] hover:bg-[#001c3d] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4 text-[#00A3A3]" />
              <span>Save Facilities Records</span>
            </button>
          </div>
        </form>
      </div>

      {/* History Log Table */}
      <div className="pt-4">
        <h3 className="text-sm font-black text-[#002652] dark:text-snow uppercase tracking-wider mb-3 flex items-center gap-2 font-sans">
          <Database className="w-4 h-4 text-[#00A3A3]" />
          SAVED INSTITUTIONAL FACILITIES RECORDS HISTORICAL TIMELINE
        </h3>

        <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800/80 rounded-xl overflow-hidden shadow-sm font-sans">
          <div className="p-4 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#001428]/10 dark:border-slate-850">
            <div className="relative w-full max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input 
                type="text" 
                placeholder="Search index logs..." 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-755 rounded focus:border-[#00a3a3] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 font-semibold text-[11px]">
                  <th className="px-5 py-3 text-left">Log ID</th>
                  <th className="px-5 py-3 text-left">Date Submitted</th>
                  <th className="px-5 py-3 text-center">Classrooms</th>
                  <th className="px-5 py-3 text-center">Labs</th>
                  <th className="px-5 py-3 text-center">Library</th>
                  <th className="px-5 py-3 text-center">Toilets</th>
                  <th className="px-5 py-3 text-center">Ramps</th>
                  <th className="px-5 py-3 text-center">Staff Houses</th>
                  <th className="px-5 py-3 text-center font-bold">Total quantity</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {paginatedRecords.length > 0 ? paginatedRecords.map((rec) => {
                  const classRooms = (rec.items.classrooms || 0) + (rec.items.classroomsWc || 0) + (rec.items.spedUnits || 0);
                  const labs = (rec.items.agricLabs || 0) + (rec.items.scienceLabs || 0) + (rec.items.homeEcLabs || 0) + (rec.items.artLabs || 0) + (rec.items.dtLabs || 0) + (rec.items.computerLabs || 0) + (rec.items.labsWc || 0);
                  const library = rec.items.library || 0;
                  const toilets = (rec.items.pitBoys || 0) + (rec.items.pitGirls || 0) + (rec.items.flushBoys || 0) + (rec.items.flushGirls || 0) + (rec.items.toiletsPwd || 0) + (rec.items.toiletsWc || 0) + (rec.items.toiletsTeachers || 0) + (rec.items.toiletsTeachersPwd || 0) + (rec.items.toiletsTeachersWc || 0);
                  const ramps = rec.items.ramps || 0;
                  const staffHouses = (rec.items.staffHouse1 || 0) + (rec.items.staffHouse2 || 0) + (rec.items.staffHouse3 || 0) + (rec.items.staffHouse4 || 0);

                  return (
                    <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="px-5 py-3 font-mono font-bold text-sea">{rec.id}</td>
                      <td className="px-5 py-3 text-slate-600 dark:text-slate-400 font-sans">{rec.dateSubmitted}</td>
                      <td className="px-5 py-3 text-center font-mono text-slate-800 dark:text-slate-300">{classRooms}</td>
                      <td className="px-5 py-3 text-center font-mono text-slate-800 dark:text-slate-300">{labs}</td>
                      <td className="px-5 py-3 text-center font-mono text-slate-800 dark:text-slate-300">{library}</td>
                      <td className="px-5 py-3 text-center font-mono text-slate-800 dark:text-slate-300">{toilets}</td>
                      <td className="px-5 py-3 text-center font-mono text-slate-800 dark:text-slate-300">{ramps}</td>
                      <td className="px-5 py-3 text-center font-mono text-slate-800 dark:text-slate-300">{staffHouses}</td>
                      <td className="px-5 py-3 text-center font-mono font-bold text-[#002652] dark:text-[#00A3A3]">{rec.totalQuantity}</td>
                      <td className="px-5 py-3 text-center">
                        <button 
                          onClick={() => handleDeleteRecord(rec.id)} 
                          className="text-rose-400 hover:text-rose-600 p-1 font-bold cursor-pointer" 
                          title="Delete Logs Detail"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={10} className="px-5 py-8 text-center text-slate-400 italic">
                      No matching saved facility elements logged in data index.
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

export default FacilitiesRegistry;
