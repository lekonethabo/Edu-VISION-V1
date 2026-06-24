"use client";

import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { 
  Save, 
  Trash2, 
  AlertCircle,
  Trophy,
  Search,
  ChevronLeft,
  ChevronRight,
  Database,
  Layers
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { motion, AnimatePresence } from "motion/react";

type FormState = Record<string, number>;

interface RecreationalRecord {
  id: string; // Entry ID
  dateSubmitted: string;
  items: Record<string, number>;
  otherSpecifyText: string;
  isAccessible: boolean;
  accessibilityNotes: string;
  totalQuantity: number;
}

const SPORTS_FACILITIES = [
  { id: "swimmingPool", label: "Swimming Pool" },
  { id: "soccerPitch", label: "Soccer Pitch" },
  { id: "softballPitch", label: "Softball Pitch" },
  { id: "gymnasium", label: "Gymnasium" },
  { id: "playground", label: "Playground" },
  { id: "athleticsTrack", label: "Athletics Track" },
  { id: "tennisCourt", label: "Tennis Court / Pitch" },
  { id: "volleyballPitch", label: "Volleyball Pitch" },
  { id: "netballPitch", label: "Netball Pitch" },
  { id: "basketballCourt", label: "Basketball Court / Pitch" },
  { id: "other", label: "Other Specify Areas", isOther: true },
];

const getInitialFormState = (): FormState => {
  const state: FormState = {};
  SPORTS_FACILITIES.forEach(item => {
    state[item.id] = 0;
  });
  return state;
};

export const RecreationalFacilitiesRegistry: React.FC = () => {
  const {
    items: savedRecords,
    setData: setSavedRecords,
  } = useLocalStorage<RecreationalRecord>("recreational_registry_data", []);

  const [formState, setFormState] = useState<FormState>(getInitialFormState());
  const [otherSpecifyText, setOtherSpecifyText] = useState("");
  const [isAccessible, setIsAccessible] = useState<boolean>(false);
  const [accessibilityNotes, setAccessibilityNotes] = useState("");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const { totalFacilities, countSportsFields, countIndoor } = useMemo(() => {
    let indoor = 0;
    let fields = 0;
    let total = 0;

    SPORTS_FACILITIES.forEach(item => {
      const val = formState[item.id] || 0;
      if (["gymnasium", "swimmingPool"].includes(item.id)) {
        indoor += val;
      } else {
        fields += val;
      }
    });

    total = Object.values(formState).reduce((acc, curr) => acc + (curr || 0), 0);

    return { totalFacilities: total, countSportsFields: fields, countIndoor: indoor };
  }, [formState]);

  const handleInputChange = (id: string, value: number) => {
    setFormState(prev => ({ ...prev, [id]: isNaN(value) ? 0 : Math.max(0, value) }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const dateSubmitted = format(new Date(), "yyyy-MM-dd HH:mm");
    
    if (totalFacilities === 0 && !isAccessible) {
      triggerToast("No recreational facilities entered to save.", "error");
      return;
    }

    const newRecord: RecreationalRecord = {
      id: `REC-${Math.floor(Math.random() * 90000) + 10000}`,
      dateSubmitted,
      items: { ...formState },
      otherSpecifyText,
      isAccessible,
      accessibilityNotes,
      totalQuantity: totalFacilities
    };

    setSavedRecords(prev => [newRecord, ...prev]);
    setFormState(getInitialFormState());
    setOtherSpecifyText("");
    setIsAccessible(false);
    setAccessibilityNotes("");
    triggerToast("Recreational facilities recorded successfully.", "success");
    setCurrentPage(1);
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear the playground form?")) {
      setFormState(getInitialFormState());
      setOtherSpecifyText("");
      setIsAccessible(false);
      setAccessibilityNotes("");
      triggerToast("Form structures wiped.", "success");
    }
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm("Are you sure you want to delete this recreational log?")) {
      setSavedRecords(prev => prev.filter(r => r.id !== id));
      triggerToast("Recreational logging record deleted.", "success");
    }
  };

  const filteredRecords = useMemo(() => {
    if (!searchQuery) return savedRecords;
    const query = searchQuery.toLowerCase();
    return savedRecords.filter(r => 
      r.id.toLowerCase().includes(query) ||
      r.dateSubmitted.includes(searchQuery) ||
      (r.isAccessible && "yes".includes(query)) ||
      (!r.isAccessible && "no".includes(query))
    );
  }, [searchQuery, savedRecords]);

  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredRecords.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredRecords, currentPage]);

  const totalPages = Math.ceil(filteredRecords.length / rowsPerPage) || 1;

  return (
    <div className="space-y-6" id="primary-recreational-facilities-registry">
      {/* Toast Alert Banner */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-xl border flex items-start gap-3 text-xs font-bold shadow-lg ${
              toast.type === "success" 
                ? "bg-[#00A3A3]/10 border-[#00A3A3]/40 text-[#00a3a3] dark:bg-[#001428]/95 dark:border-[#00A3A3]/50" 
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
                <Trophy className="w-4 h-4 text-[#00A3A3]" />
                RECREATIONAL & EXTRA-CURRICULAR SPORTS FIELDS
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Log pitches, swimming pools, sport courts, and physical accessibility compliance parameters.
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
                <Save className="w-4 h-4 text-sea" />
                <span>Save Recreational Logs</span>
              </button>
            </div>
          </div>

          {/* 4 Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-sans">Total Facilities registered</span>
              <span className="text-2xl font-black text-prussian dark:text-slate-200 block font-mono mt-0.5">{totalFacilities}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-sans">Outdoor Fields / Pitches</span>
              <span className="text-2xl font-black text-prussian dark:text-slate-200 block font-mono mt-0.5">{countSportsFields}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-sans">Indoor & Complex items</span>
              <span className="text-2xl font-black text-prussian dark:text-slate-200 block font-mono mt-0.5">{countIndoor}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 p-4 rounded-xl font-sans">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-sans">Disability Access Approved</span>
              <span className={`text-xl font-black font-mono mt-1 block ${isAccessible ? 'text-[#00a3a3]' : 'text-slate-400'}`}>
                {isAccessible ? "YES APPROVED" : "NOT SPECIFIED"}
              </span>
            </div>
          </div>

          {/* Main Grid content list */}
          <div className="bg-slate-50/50 dark:bg-[#000d1a] border border-slate-200/80 dark:border-slate-805 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-black text-[#002652] dark:text-[#00A3A3] tracking-widest uppercase flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800/60 font-sans">
              <span className="w-1 h-3 bg-[#00A3A3] rounded-sm"></span>
              Sports & Recreational Facilities
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SPORTS_FACILITIES.map(item => {
                const value = formState[item.id] || 0;
                return (
                  <div 
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white dark:bg-[#001020] border border-slate-100 dark:border-slate-800/60 rounded-lg gap-4"
                  >
                    <div className="flex-1 space-y-2 font-sans">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">{item.label}</span>
                      {item.isOther && (
                        <input
                          type="text"
                          placeholder="Please specify specific fields here..."
                          value={otherSpecifyText}
                          onChange={(e) => setOtherSpecifyText(e.target.value)}
                          className="w-full max-w-sm px-3 py-1.5 text-xs bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-700 rounded focus:border-sea focus:outline-none transition-colors"
                        />
                      )}
                    </div>

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
                );
              })}
            </div>
          </div>

          {/* Section 2: Accessibility notes */}
          <div className="bg-slate-50/50 dark:bg-[#000d1a] border border-slate-200/80 dark:border-slate-805 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-black text-[#002652] dark:text-[#00A3A3] tracking-widest uppercase flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800/60 font-sans">
              <span className="w-1 h-3 bg-[#ffd700] rounded-sm"></span>
              Accessibility Log
            </h3>

            <div className="p-4 bg-white dark:bg-[#001020] border border-slate-100 dark:border-slate-800/60 rounded-xl space-y-4 font-sans">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Are recreation options or equipment optimized for disabled students with special barriers?
                </label>
                
                {/* Custom switch */}
                <button 
                  type="button"
                  onClick={() => setIsAccessible(!isAccessible)}
                  className={`relative w-16 h-8 rounded-full transition-colors flex-shrink-0 cursor-pointer ${isAccessible ? 'bg-[#00a3a3]' : 'bg-slate-300 dark:bg-slate-800'}`}
                >
                  <span className={`absolute top-1 left-1 w-6 h-6 bg-white dark:bg-[#001020] rounded-full transition-transform ${isAccessible ? 'translate-x-8' : 'translate-x-0'} shadow-sm`} />
                  <span className={`absolute top-1/2 -translate-y-1/2 text-[10px] font-bold ${isAccessible ? 'left-3 text-white' : 'right-2 text-slate-500'}`}>
                    {isAccessible ? "YES" : "NO"}
                  </span>
                </button>
              </div>

              {isAccessible && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 transition-all">
                  <label className="text-[11px] font-bold text-[#002652] dark:text-[#00a3a3] block mb-2 font-sans tracking-wide">
                    PLEASE SPECIFY ACCESSIBLE FEATURES AND ADAPTIVE SYSTEMS INSTALLED:
                  </label>
                  <textarea 
                    value={accessibilityNotes}
                    onChange={(e) => setAccessibilityNotes(e.target.value)}
                    placeholder="E.g. ramps, visual signaling pathways, wide gateways..."
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs rounded-xl focus:border-sea focus:outline-none transition-colors min-h-[90px] resize-y font-mono"
                  />
                </div>
              )}
            </div>
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
              <span>Save Sports Facility Log</span>
            </button>
          </div>
        </form>
      </div>

      {/* History Log Table */}
      <div className="pt-4">
        <h3 className="text-sm font-black text-[#002652] dark:text-snow uppercase tracking-wider mb-3 flex items-center gap-2 font-sans">
          <Database className="w-4 h-4 text-[#00A3A3]" />
          SAVED RECREATIONAL CAPACITIES HISTORICAL RETRIEVAL
        </h3>

        <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800/80 rounded-xl overflow-hidden shadow-sm font-sans">
          <div className="p-4 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-850">
            <div className="relative w-full max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input 
                type="text" 
                placeholder="Search logs or Yes/No..." 
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
                  <th className="px-5 py-3 text-center">Swim</th>
                  <th className="px-5 py-3 text-center">Soccer Pitch</th>
                  <th className="px-5 py-3 text-center">Gymnasium</th>
                  <th className="px-5 py-3 text-center">Playground</th>
                  <th className="px-5 py-3 text-center">Athletic Track</th>
                  <th className="px-5 py-3 text-center">Disabled Access</th>
                  <th className="px-5 py-3 text-center">Total Quantity</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {paginatedRecords.length > 0 ? paginatedRecords.map((rec) => {
                  return (
                    <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="px-5 py-3 font-mono font-bold text-sea">{rec.id}</td>
                      <td className="px-5 py-3 text-slate-600 dark:text-slate-400 font-sans">{rec.dateSubmitted}</td>
                      <td className="px-5 py-3 text-center font-mono">{rec.items.swimmingPool || 0}</td>
                      <td className="px-5 py-3 text-center font-mono">{rec.items.soccerPitch || 0}</td>
                      <td className="px-5 py-3 text-center font-mono">{rec.items.gymnasium || 0}</td>
                      <td className="px-5 py-3 text-center font-mono">{rec.items.playground || 0}</td>
                      <td className="px-5 py-3 text-center font-mono">{rec.items.athleticsTrack || 0}</td>
                      <td className="px-5 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${rec.isAccessible ? 'bg-emerald-100 text-emerald-800 dark:bg-slate-800 dark:text-emerald-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-900 dark:text-slate-600'}`}>
                          {rec.isAccessible ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-center font-mono font-bold text-prussian dark:text-snow">{rec.totalQuantity}</td>
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
                    <td colSpan={10} className="px-5 py-8 text-center text-slate-400 italic">
                      No recreational facility records logged in local storage.
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

export default RecreationalFacilitiesRegistry;
