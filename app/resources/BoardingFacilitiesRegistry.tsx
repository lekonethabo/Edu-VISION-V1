"use client";

import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { 
  Save, 
  Trash2, 
  AlertCircle,
  Home,
  Search,
  ChevronLeft,
  ChevronRight,
  Database,
  Layers,
  Sparkles
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { motion, AnimatePresence } from "motion/react";

interface BoardingState {
  male: number;
  female: number;
}

type FormState = Record<string, BoardingState>;

interface BoardingRecord {
  id: string; // Entry ID
  dateSubmitted: string;
  hostels: { male: number; female: number };
  domRooms: { male: number; female: number };
  beds: { male: number; female: number };
  flushToilets: { male: number; female: number };
  pitLatrines: { male: number; female: number };
  toiletsPwd: { male: number; female: number };
  showers: { male: number; female: number };
  washingBasins: { male: number; female: number };
  washingTroughs: { male: number; female: number };
  geysers: { male: number; female: number };
  ramps: { male: number; female: number };
  total: number;
}

const CATEGORIES = [
  {
    id: "cat_1",
    title: "Group 1: Accommodation",
    accent: "border-[#00A3A3] text-[#00A3A3]",
    items: [
      { id: "hostels", label: "Hostels" },
      { id: "domRooms", label: "Dom Rooms" },
      { id: "beds", label: "Beds" },
    ]
  },
  {
    id: "cat_2",
    title: "Group 2: Sanitation",
    accent: "border-[#ffd700] text-[#ffd700]",
    items: [
      { id: "flushToilets", label: "Flush Toilets" },
      { id: "pitLatrines", label: "Pit Latrines" },
      { id: "toiletsPwd", label: "Toilet for Disabilities" },
    ]
  },
  {
    id: "cat_3",
    title: "Group 3: Hygiene Facilities",
    accent: "border-sea text-sea",
    items: [
      { id: "showers", label: "Showers" },
      { id: "washingBasins", label: "Washing Basins" },
      { id: "washingTroughs", label: "Washing Troughs" },
    ]
  },
  {
    id: "cat_4",
    title: "Group 4: Utilities & Accessibility",
    accent: "border-slate-400 text-slate-400",
    items: [
      { id: "geysers", label: "Geysers/Boilers" },
      { id: "ramps", label: "Ramps" },
    ]
  }
];

const getInitialFormState = (): FormState => {
  const state: FormState = {};
  CATEGORIES.forEach(cat => {
    cat.items.forEach(item => {
      state[item.id] = { male: 0, female: 0 };
    });
  });
  return state;
};

export const BoardingFacilitiesRegistry: React.FC = () => {
  const {
    items: savedRecords,
    setData: setSavedRecords,
  } = useLocalStorage<BoardingRecord>("boarding_registry_data", []);

  const [formState, setFormState] = useState<FormState>(getInitialFormState());
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const { summaryMale, summaryFemale, summaryTotal, summaryRatio } = useMemo(() => {
    let male = 0;
    let female = 0;
    Object.values(formState).forEach(val => {
      male += (val.male || 0);
      female += (val.female || 0);
    });
    const total = male + female;
    
    let ratioStr = "0:0";
    if (male > 0 && female === 0) ratioStr = "1:0";
    else if (male === 0 && female > 0) ratioStr = "0:1";
    else if (male > 0 && female > 0) {
      const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
      const div = gcd(male, female);
      ratioStr = `${male / div}:${female / div}`;
      if (male / div > 20 || female / div > 20) {
        ratioStr = `${Math.round((male/female)*10)/10}:1`;
      }
    }

    return { summaryMale: male, summaryFemale: female, summaryTotal: total, summaryRatio: ratioStr };
  }, [formState]);

  const handleInputChange = (id: string, field: keyof BoardingState, value: number) => {
    setFormState(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: isNaN(value) ? 0 : Math.max(0, value)
      }
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const dateSubmitted = format(new Date(), "yyyy-MM-dd HH:mm");
    
    const hasData = Object.values(formState).some(val => val.male > 0 || val.female > 0);
    if (!hasData) {
      triggerToast("No boarding facilities entered to save. All indicators are 0.", "error");
      return;
    }

    const newRecord: BoardingRecord = {
      id: `BDG-${Math.floor(Math.random() * 90000) + 10000}`,
      dateSubmitted,
      hostels: formState["hostels"],
      domRooms: formState["domRooms"],
      beds: formState["beds"],
      flushToilets: formState["flushToilets"],
      pitLatrines: formState["pitLatrines"],
      toiletsPwd: formState["toiletsPwd"],
      showers: formState["showers"],
      washingBasins: formState["washingBasins"],
      washingTroughs: formState["washingTroughs"],
      geysers: formState["geysers"],
      ramps: formState["ramps"],
      total: summaryTotal
    };

    setSavedRecords(prev => [newRecord, ...prev]);
    setFormState(getInitialFormState());
    triggerToast("Boarding facilities records updated successfully.", "success");
    setCurrentPage(1);
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clean layout values?")) {
      setFormState(getInitialFormState());
      triggerToast("Form structures cleared back to 0.", "success");
    }
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm("Are you sure you want to delete this historical boarding record?")) {
      setSavedRecords(prev => prev.filter(r => r.id !== id));
      triggerToast("Boarding facility logging deleted.", "success");
    }
  };

  const filteredRecords = useMemo(() => {
    if (!searchQuery) return savedRecords;
    return savedRecords.filter(r => 
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.dateSubmitted.includes(searchQuery)
    );
  }, [searchQuery, savedRecords]);

  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredRecords.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredRecords, currentPage]);

  const totalPages = Math.ceil(filteredRecords.length / rowsPerPage) || 1;

  return (
    <div className="space-y-6" id="primary-boarding-facilities-registry">
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

      {/* Styled Card Wrapper */}
      <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800/80 rounded-xl p-6 shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Action Header */}
          <div className="flex flex-wrap justify-between items-center pb-4 border-b border-slate-150 dark:border-slate-800/60 gap-4">
            <div>
              <h2 className="text-sm font-black text-[#002652] dark:text-[#00A3A3] uppercase tracking-wider flex items-center gap-1.5">
                <Home className="w-4 h-4 text-[#00A3A3]" />
                BOARDING & RESIDENTIAL INFRASTRUCTURE
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Log state-approved facilities, sanitation points, boilers, and ramps within boarding hostels.
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
                <span>Save Boarding Records</span>
              </button>
            </div>
          </div>

          {/* 4 Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-sans">Total Male capacity</span>
              <span className="text-2xl font-black text-prussian dark:text-slate-200 block font-mono mt-0.5">{summaryMale}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-sans">Total Female capacity</span>
              <span className="text-2xl font-black text-prussian dark:text-slate-200 block font-mono mt-0.5">{summaryFemale}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-sans">Aggregated units</span>
              <span className="text-2xl font-black text-prussian dark:text-slate-200 block font-mono mt-0.5">{summaryTotal}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-sans">Capacities Ratio</span>
              <span className="text-2xl font-black text-prussian dark:text-slate-200 block font-mono mt-0.5">{summaryRatio}</span>
            </div>
          </div>

          {/* Categories Grid list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {CATEGORIES.map(category => (
              <div 
                key={category.id} 
                className="bg-slate-50/50 dark:bg-[#000d1a] border border-slate-200/80 dark:border-slate-800/80 rounded-xl overflow-hidden p-5 space-y-4"
              >
                <h3 className="text-xs font-black text-[#002652] dark:text-[#00A3A3] tracking-widest uppercase flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800/60 font-sans">
                  <span className="w-1 h-3 bg-[#00A3A3] rounded-sm"></span>
                  {category.title}
                </h3>

                <div className="space-y-3.5">
                  {category.items.map(item => {
                    const values = formState[item.id] || { male: 0, female: 0 };
                    return (
                      <div 
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white dark:bg-[#001020] border border-slate-100 dark:border-slate-800/70 rounded-lg gap-4"
                      >
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">{item.label}</span>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900/40 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-800">
                            <span className="text-[9px] font-bold tracking-tight text-slate-400 uppercase">M</span>
                            <input
                              type="number"
                              min="0"
                              value={values.male}
                              onChange={(e) => handleInputChange(item.id, "male", parseInt(e.target.value) || 0)}
                              className="w-12 bg-transparent text-center text-xs font-mono font-bold focus:outline-none dark:text-slate-100"
                              onFocus={(e) => e.target.select()}
                            />
                          </div>
                          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900/40 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-800">
                            <span className="text-[9px] font-bold tracking-tight text-[#00a3a3] uppercase">F</span>
                            <input
                              type="number"
                              min="0"
                              value={values.female}
                              onChange={(e) => handleInputChange(item.id, "female", parseInt(e.target.value) || 0)}
                              className="w-12 bg-transparent text-center text-xs font-mono font-bold focus:outline-none dark:text-slate-100"
                              onFocus={(e) => e.target.select()}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
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
              className="px-6 py-2 bg-prussian hover:bg-[#001c3d] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4 text-[#00A3A3]" />
              <span>Save Record Logs</span>
            </button>
          </div>
        </form>
      </div>

      {/* History Log Table */}
      <div className="pt-4">
        <h3 className="text-sm font-black text-[#002652] dark:text-snow uppercase tracking-wider mb-3 flex items-center gap-2">
          <Database className="w-4 h-4 text-[#00A3A3]" />
          SAVED BOARDING HISTORICAL INDEX
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
                <tr className="bg-slate-100 dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 font-semibold text-[11px]">
                  <th className="px-5 py-3 text-left">Log ID</th>
                  <th className="px-5 py-3 text-left">Date Recorded</th>
                  <th className="px-5 py-3 text-center">Hostels (M/F)</th>
                  <th className="px-5 py-3 text-center">Dormitories (M/F)</th>
                  <th className="px-5 py-3 text-center">Beds capacity (M/F)</th>
                  <th className="px-5 py-3 text-center">Flush Toilets (M/F)</th>
                  <th className="px-5 py-3 text-center">Pwd Toilets (M/F)</th>
                  <th className="px-5 py-3 text-center">Total Elements</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {paginatedRecords.length > 0 ? paginatedRecords.map((rec) => {
                  return (
                    <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="px-5 py-3 font-mono font-bold text-sea">{rec.id}</td>
                      <td className="px-5 py-3 text-slate-600 dark:text-slate-400 font-sans">{rec.dateSubmitted}</td>
                      <td className="px-5 py-3 text-center font-mono">{rec.hostels?.male || 0}/{rec.hostels?.female || 0}</td>
                      <td className="px-5 py-3 text-center font-mono">{rec.domRooms?.male || 0}/{rec.domRooms?.female || 0}</td>
                      <td className="px-5 py-3 text-center font-mono">{rec.beds?.male || 0}/{rec.beds?.female || 0}</td>
                      <td className="px-5 py-3 text-center font-mono">{rec.flushToilets?.male || 0}/{rec.flushToilets?.female || 0}</td>
                      <td className="px-5 py-3 text-center font-mono text-slate-500">{rec.toiletsPwd?.male || 0}/{rec.toiletsPwd?.female || 0}</td>
                      <td className="px-5 py-3 text-center font-mono font-bold text-prussian dark:text-snow">{rec.total}</td>
                      <td className="px-5 py-3 text-center">
                        <button 
                          onClick={() => handleDeleteRecord(rec.id)} 
                          className="text-rose-400 hover:text-rose-600 p-1" 
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={9} className="px-5 py-8 text-center text-slate-400 italic">
                      No boarding records loaded in local storage data.
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

export default BoardingFacilitiesRegistry;
