"use client";

import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { 
  Save, 
  Trash2, 
  AlertCircle,
  Laptop,
  Search,
  ChevronLeft,
  ChevronRight,
  Database,
  Layers,
  Sparkles
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { motion, AnimatePresence } from "motion/react";

interface EquipmentState {
  working: number;
  notWorking: number;
  customLabel?: string;
  selected?: boolean;
}

type FormState = Record<string, EquipmentState>;

interface EquipmentRecord {
  id: string; // Entry ID
  dateSubmitted: string;
  equipmentId: string;
  equipmentName: string;
  working: number;
  notWorking: number;
  total: number;
  functionalRate: number;
  category: string;
}

// Categories Definition
const EQUIPMENT_CATEGORIES = [
  {
    id: "cat_1",
    title: "Section 1: Vehicles & IT Equipment",
    items: [
      { id: "vehicles", label: "Vehicles" },
      { id: "comp_admin", label: "Computers/Laptops - Administrative Use" },
      { id: "comp_teach", label: "Computers/Laptops - Teaching & Learning" },
      { id: "comp_net_admin", label: "Computers Connected to Internet - Administrative Use" },
      { id: "comp_net_teach", label: "Computers Connected to Internet - Teaching & Learning" },
      { id: "tablets", label: "Tablets" },
    ]
  },
  {
    id: "cat_2",
    title: "Section 2: Communication & Office Equipment",
    items: [
      { id: "telephone", label: "Telephone (including mobile phones)" },
      { id: "radio", label: "Radio" },
      { id: "tv", label: "Television" },
      { id: "dvd", label: "Video Machine/DVD Player" },
      { id: "printer", label: "Printer" },
      { id: "photocopier", label: "Photocopying Machine" },
      { id: "fax", label: "Fax Machine" },
    ]
  },
  {
    id: "cat_3",
    title: "Section 3: Digital & AV Equipment",
    items: [
      { id: "camera", label: "Digital Camera" },
      { id: "scanner", label: "Scanner" },
      { id: "projector", label: "Projector" },
      { id: "decoder", label: "Decoder" },
    ]
  },
  {
    id: "cat_4",
    title: "Section 4: Appliances & Other",
    items: [
      { id: "fridge", label: "Fridge" },
      { id: "other", label: "Other Equipment (Specify)", isOther: true },
    ]
  }
];

const getInitialFormState = (): FormState => {
  const state: FormState = {};
  EQUIPMENT_CATEGORIES.forEach(cat => {
    cat.items.forEach(item => {
      state[item.id] = { working: 0, notWorking: 0, selected: false };
      if (item.isOther) {
        state[item.id].customLabel = "";
      }
    });
  });
  return state;
};

export const EquipmentRegistry: React.FC = () => {
  const {
    items: savedRecords,
    setData: setSavedRecords,
  } = useLocalStorage<EquipmentRecord>("equipment_registry_v3_data", []);

  const [formState, setFormState] = useState<FormState>(getInitialFormState());
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Compute Overall Totals
  const { summaryWorking, summaryNotWorking, summaryTotal, summaryRate } = useMemo(() => {
    let working = 0;
    let notWorking = 0;
    Object.values(formState).forEach(val => {
      working += (val.working || 0);
      notWorking += (val.notWorking || 0);
    });
    const total = working + notWorking;
    const rate = total > 0 ? Math.round((working / total) * 100) : 0;
    return { summaryWorking: working, summaryNotWorking: notWorking, summaryTotal: total, summaryRate: rate };
  }, [formState]);

  // Handle Input Change
  const handleInputChange = (id: string, field: "working" | "notWorking", value: number) => {
    setFormState(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: isNaN(value) ? 0 : Math.max(0, value)
      }
    }));
  };

  const handleCustomLabelChange = (id: string, text: string) => {
    setFormState(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        customLabel: text
      }
    }));
  };

  // Bulk select toggling
  const handleSelectAllCategory = (catItems: {id: string}[], isChecked: boolean) => {
    const nextState = { ...formState };
    catItems.forEach(item => {
      nextState[item.id] = { ...nextState[item.id], selected: isChecked };
    });
    setFormState(nextState);
  };

  const handleItemSelectToggle = (id: string) => {
    setFormState(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        selected: !prev[id].selected
      }
    }));
  };

  const applyBulkAction = (action: "working" | "notWorking") => {
    const nextState = { ...formState };
    let updatedCount = 0;
    Object.keys(nextState).forEach(key => {
      if (nextState[key].selected) {
        updatedCount++;
        if (action === "working") {
          nextState[key].working = (nextState[key].working || 0) + (nextState[key].notWorking || 0);
          nextState[key].notWorking = 0;
        } else {
          nextState[key].notWorking = (nextState[key].working || 0) + (nextState[key].notWorking || 0);
          nextState[key].working = 0;
        }
        nextState[key].selected = false; // clear selection
      }
    });

    if (updatedCount === 0) {
      triggerToast("Please highlight checkboxes first to apply bulk changes.", "error");
      return;
    }
    setFormState(nextState);
    triggerToast(`Bulk status reset applied to ${updatedCount} items.`, "success");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecords: EquipmentRecord[] = [];
    const dateSubmitted = format(new Date(), "yyyy-MM-dd HH:mm");
    
    EQUIPMENT_CATEGORIES.forEach(cat => {
      cat.items.forEach(item => {
        const entry = formState[item.id];
        const total = (entry.working || 0) + (entry.notWorking || 0);
        
        if (total > 0) {
          const finalName = item.isOther && entry.customLabel ? entry.customLabel : item.label;
          const fxRate = total > 0 ? Math.round((entry.working / total) * 100) : 0;
          
          newRecords.push({
            id: `EQ-${Math.floor(Math.random() * 90000) + 10000}`,
            dateSubmitted,
            equipmentId: item.id,
            equipmentName: finalName,
            working: entry.working || 0,
            notWorking: entry.notWorking || 0,
            total,
            functionalRate: fxRate,
            category: cat.title.split(":")[0], 
          });
        }
      });
    });

    if (newRecords.length === 0) {
      triggerToast("No equipment values registered to save.", "error");
      return;
    }

    setSavedRecords(prev => [...newRecords, ...prev]);
    setFormState(getInitialFormState());
    triggerToast(`Successfully committed ${newRecords.length} functional equipment logs.`, "success");
    setCurrentPage(1);
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear current equipment edits?")) {
      setFormState(getInitialFormState());
      triggerToast("Form values cleared.", "success");
    }
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm("Are you sure you want to delete this historical equipment log?")) {
      setSavedRecords(prev => prev.filter(r => r.id !== id));
      triggerToast("Equipment item log deleted.", "success");
    }
  };

  const filteredRecords = useMemo(() => {
    if (!searchQuery) return savedRecords;
    const query = searchQuery.toLowerCase();
    return savedRecords.filter(r => 
      r.equipmentName.toLowerCase().includes(query) ||
      r.id.toLowerCase().includes(query) ||
      r.category.toLowerCase().includes(query)
    );
  }, [searchQuery, savedRecords]);

  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredRecords.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredRecords, currentPage]);

  const totalPages = Math.ceil(filteredRecords.length / rowsPerPage) || 1;

  return (
    <div className="space-y-6" id="primary-equipment-registry">
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
                <Laptop className="w-4 h-4 text-[#00A3A3]" />
                EQUIPMENT & ASSETS DATA ARCHIVE
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium font-sans">
                Log the counts of working vs. non-working digital appliances, technology suites, and institutional vehicles.
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
                <span>Save Equipment Quantities</span>
              </button>
            </div>
          </div>

          {/* 4 Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-sans">Active functional units</span>
              <span className="text-xl font-black text-emerald-600 block font-mono mt-0.5">{summaryWorking}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-sans">Damaged or broken units</span>
              <span className="text-xl font-black text-rose-500 block font-mono mt-0.5">{summaryNotWorking}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-sans">Total elements count</span>
              <span className="text-xl font-black text-[#002652] dark:text-slate-300 block font-mono mt-0.5">{summaryTotal}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-sans">Overall Health Coefficient</span>
              <span className="text-xl font-black text-[#00A3A3] block font-mono mt-0.5">{summaryRate}%</span>
            </div>
          </div>

          {/* Bulk Tools Toolbar */}
          <div className="p-3 bg-slate-50 dark:bg-[#000d1a] border border-slate-200/80 dark:border-slate-800/60 rounded-xl flex flex-wrap items-center justify-between gap-3 font-sans">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
              Bulk Switch Tools for Toggled Checkboxes:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => applyBulkAction("working")}
                className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded text-[11px] font-bold transition-all"
              >
                Set Highlighted as Working
              </button>
              <button
                type="button"
                onClick={() => applyBulkAction("notWorking")}
                className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded text-[11px] font-bold transition-all"
              >
                Set Highlighted as Damaged
              </button>
            </div>
          </div>

          {/* Categories Grid list */}
          <div className="space-y-6">
            {EQUIPMENT_CATEGORIES.map(category => {
              const allChecked = category.items.every(item => formState[item.id]?.selected);
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
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={allChecked} 
                        onChange={(e) => handleSelectAllCategory(category.items, e.target.checked)}
                        className="rounded"
                      />
                      Select Group
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.items.map(item => {
                      const value = formState[item.id] || { working: 0, notWorking: 0, selected: false };
                      return (
                        <div 
                          key={item.id}
                          className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white dark:bg-[#001020] border rounded-lg gap-4 transition-all ${
                            value.selected ? "border-[#00A3A3]" : "border-slate-100 dark:border-slate-805"
                          }`}
                        >
                          <div className="flex-1 flex items-start gap-2.5 font-sans">
                            <input 
                              type="checkbox" 
                              checked={!!value.selected} 
                              onChange={() => handleItemSelectToggle(item.id)}
                              className="mt-0.5 rounded cursor-pointer"
                            />
                            <div className="space-y-1.5">
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">{item.label}</span>
                              {item.isOther && (
                                <input
                                  type="text"
                                  placeholder="Specify custom equipment label..."
                                  value={value.customLabel || ""}
                                  onChange={(e) => handleCustomLabelChange(item.id, e.target.value)}
                                  className="w-full max-w-sm px-3 py-1 text-xs bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-700 rounded focus:border-sea focus:outline-none transition-colors"
                                />
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900/40 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-800">
                              <span className="text-[9px] font-bold text-emerald-600">WORKING</span>
                              <input
                                type="number"
                                min="0"
                                value={value.working}
                                onChange={(e) => handleInputChange(item.id, "working", parseInt(e.target.value) || 0)}
                                className="w-10 bg-transparent text-center text-xs font-mono font-bold focus:outline-none dark:text-slate-100"
                                onFocus={(e) => e.target.select()}
                              />
                            </div>
                            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900/40 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-800">
                              <span className="text-[9px] font-bold text-rose-500">BROKEN</span>
                              <input
                                type="number"
                                min="0"
                                value={value.notWorking}
                                onChange={(e) => handleInputChange(item.id, "notWorking", parseInt(e.target.value) || 0)}
                                className="w-10 bg-transparent text-center text-xs font-mono font-bold focus:outline-none dark:text-slate-100"
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
              className="px-6 py-2 bg-prussian hover:bg-[#001c3d] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4 text-[#00A3A3]" />
              <span>Save Equipment Records</span>
            </button>
          </div>
        </form>
      </div>

      {/* History Log Table */}
      <div className="pt-4">
        <h3 className="text-sm font-black text-[#002652] dark:text-snow uppercase tracking-wider mb-3 flex items-center gap-2 font-sans">
          <Database className="w-4 h-4 text-[#00A3A3]" />
          SAVED INSTITUTIONAL EQUIPMENT RECORDS HISTORIAL TIMELINE
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
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-705 rounded focus:border-sea focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 font-semibold text-[11px]">
                  <th className="px-5 py-3 text-left">Log ID</th>
                  <th className="px-5 py-3 text-left">Date Submitted</th>
                  <th className="px-5 py-3 text-left">Section Grade</th>
                  <th className="px-5 py-3 text-left">Equipment Name</th>
                  <th className="px-5 py-3 text-center">Working</th>
                  <th className="px-5 py-3 text-center">Not Working</th>
                  <th className="px-5 py-3 text-center font-bold">Total quantity</th>
                  <th className="px-5 py-3 text-center">Functional Rate</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {paginatedRecords.length > 0 ? paginatedRecords.map((rec) => {
                  return (
                    <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="px-5 py-3 font-mono font-bold text-sea">{rec.id}</td>
                      <td className="px-5 py-3 text-slate-600 dark:text-slate-400 font-sans">{rec.dateSubmitted}</td>
                      <td className="px-5 py-3 text-slate-500">{rec.category}</td>
                      <td className="px-5 py-3 font-semibold text-slate-800 dark:text-slate-200">{rec.equipmentName}</td>
                      <td className="px-5 py-3 text-center font-mono text-emerald-600 font-bold">{rec.working}</td>
                      <td className="px-5 py-3 text-center font-mono text-rose-500">{rec.notWorking}</td>
                      <td className="px-5 py-3 text-center font-mono font-bold text-slate-900 dark:text-slate-200">{rec.total}</td>
                      <td className="px-5 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          rec.functionalRate >= 80 ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400" :
                          rec.functionalRate >= 50 ? "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400" :
                          "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400"
                        }`}>
                          {rec.functionalRate}%
                        </span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <button 
                          onClick={() => handleDeleteRecord(rec.id)} 
                          className="text-rose-400 hover:text-rose-600 p-1" 
                          title="Delete Logs Detail"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={9} className="px-5 py-8 text-center text-slate-400 italic">
                      No matching saved equipment assets logged in data index.
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

export default EquipmentRegistry;
