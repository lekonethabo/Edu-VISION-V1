"use client";

import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { 
  Save, 
  Trash2, 
  AlertCircle,
  Accessibility,
  Search,
  ChevronLeft,
  ChevronRight,
  Database,
  Layers
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { motion, AnimatePresence } from "motion/react";

type FormState = Record<string, number>;

interface EquipmentRecord {
  id: string; // Entry ID
  dateSubmitted: string;
  items: Record<string, number>;
  otherSpecifyText: string;
  totalQuantity: number;
}

const CATEGORIES = [
  {
    id: "cat_1",
    title: "Group 1: Reading & Learning Aids",
    accent: "border-[#00a3a3] text-[#00a3a3]",
    items: [
      { id: "brailleBooks", label: "Braille Books" },
      { id: "audioBooks", label: "Audio Books" },
      { id: "brailleTypewriter", label: "Braille Typewriter" },
      { id: "writingFrames", label: "Writing Frames" },
      { id: "augmentativeDevices", label: "Augmentative Communication Devices" },
    ]
  },
  {
    id: "cat_2",
    title: "Group 2: Computer & Technology",
    accent: "border-[#ffd700] text-[#ffd700]",
    items: [
      { id: "computersPupils", label: "Computers for Pupils" },
      { id: "computerScreens", label: "Computer Screens" },
      { id: "hearingLoop", label: "Hearing Loop" },
    ]
  },
  {
    id: "cat_3",
    title: "Group 3: Furniture & Assistive Devices",
    accent: "border-sea text-sea",
    items: [
      { id: "modifiedDesks", label: "Suitably Modified Desks" },
      { id: "modifiedChairs", label: "Suitably Modified Chairs" },
      { id: "grippingDevices", label: "Assistive Devices for Gripping" },
      { id: "hearingAids", label: "Hearing Aids" },
    ]
  },
  {
    id: "cat_4",
    title: "Group 4: Other Equipment",
    accent: "border-slate-400 text-slate-400",
    items: [
      { id: "other", label: "Other Specify Assistive Units", isOther: true },
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

export const EquipmentDisabilityRegistry: React.FC = () => {
  const {
    items: savedRecords,
    setData: setSavedRecords,
  } = useLocalStorage<EquipmentRecord>("equipment_disability_data", []);

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

  const { totalItems, countReading, countComputer, countAssistive } = useMemo(() => {
    let reading = 0;
    let computer = 0;
    let assistive = 0;
    let total = 0;

    CATEGORIES[0].items.forEach(item => { reading += formState[item.id] || 0; });
    CATEGORIES[1].items.forEach(item => { computer += formState[item.id] || 0; });
    CATEGORIES[2].items.forEach(item => { assistive += formState[item.id] || 0; });
    
    total = Object.values(formState).reduce((acc, curr) => acc + (curr || 0), 0);

    return { totalItems: total, countReading: reading, countComputer: computer, countAssistive: assistive };
  }, [formState]);

  const handleInputChange = (id: string, value: number) => {
    setFormState(prev => ({ ...prev, [id]: isNaN(value) ? 0 : Math.max(0, value) }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const dateSubmitted = format(new Date(), "yyyy-MM-dd HH:mm");
    
    if (totalItems === 0) {
      triggerToast("No equipment items entered to save. Enter values into input fields.", "error");
      return;
    }

    const newRecord: EquipmentRecord = {
      id: `EQD-${Math.floor(Math.random() * 90000) + 10000}`,
      dateSubmitted,
      items: { ...formState },
      otherSpecifyText,
      totalQuantity: totalItems
    };

    setSavedRecords(prev => [newRecord, ...prev]);
    setFormState(getInitialFormState());
    setOtherSpecifyText("");
    triggerToast("Disability assistive equipment registry saved successfully.", "success");
    setCurrentPage(1);
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear this assistive form?")) {
      setFormState(getInitialFormState());
      setOtherSpecifyText("");
      triggerToast("Form indicators cleared back to 0.", "success");
    }
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm("Are you sure you want to delete this disability support record?")) {
      setSavedRecords(prev => prev.filter(r => r.id !== id));
      triggerToast("Assistive logging record deleted.", "success");
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
    <div className="space-y-6" id="primary-equipment-disability-registry">
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

      <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800/80 rounded-xl p-6 shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Action Header */}
          <div className="flex flex-wrap justify-between items-center pb-4 border-b border-slate-150 dark:border-slate-800/60 gap-4">
            <div>
              <h2 className="text-sm font-black text-[#002652] dark:text-[#00A3A3] uppercase tracking-wider flex items-center gap-1.5">
                <Accessibility className="w-4 h-4 text-[#00a3a3]" />
                ASSISTIVE EQUIPMENT & ACCESSIBILITY LAWS
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium font-sans">
                Log braille books, computer screens, specific assistive chairs, and modified learning devices inside the institution.
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
                <span>Save Equipment Records</span>
              </button>
            </div>
          </div>

          {/* 4 Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-sans">Total disability items</span>
              <span className="text-2xl font-black text-prussian dark:text-slate-200 block font-mono mt-0.5">{totalItems}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-sans">Reading & Learning Aids</span>
              <span className="text-2xl font-black text-prussian dark:text-slate-200 block font-mono mt-0.5">{countReading}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-sans">Computer Technologies</span>
              <span className="text-2xl font-black text-prussian dark:text-slate-200 block font-mono mt-0.5">{countComputer}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-sans">Assistive Furniture</span>
              <span className="text-2xl font-black text-prussian dark:text-slate-200 block font-mono mt-0.5">{countAssistive}</span>
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
                    const value = formState[item.id] || 0;
                    return (
                      <div 
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white dark:bg-[#001020] border border-slate-100 dark:border-slate-805 rounded-lg gap-4"
                      >
                        <div className="flex-1 space-y-2">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">{item.label}</span>
                          {(item as any).isOther && (
                            <input
                              type="text"
                              placeholder="Please specify specific equipment details here..."
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
              <span>Save Assistive Records</span>
            </button>
          </div>
        </form>
      </div>

      {/* History Log Table */}
      <div className="pt-4">
        <h3 className="text-sm font-black text-[#002652] dark:text-snow uppercase tracking-wider mb-3 flex items-center gap-2">
          <Database className="w-4 h-4 text-[#00A3A3]" />
          SAVED ASSISTIVE INVENTORY HISTORY LOGS
        </h3>

        <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800/80 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-850">
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
                  <th className="px-5 py-3 text-center">Total Items</th>
                  <th className="px-5 py-3 text-left">Items Overview Summary</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {paginatedRecords.length > 0 ? paginatedRecords.map((rec) => {
                  const details = Object.entries(rec.items)
                    .filter(([_, val]) => val > 0)
                    .map(([key, val]) => {
                      const lbl = CATEGORIES.flatMap(c => c.items).find(itm => itm.id === key)?.label;
                      const finalLbl = key === 'other' && rec.otherSpecifyText ? `Other (${rec.otherSpecifyText})` : lbl;
                      return `${finalLbl}: ${val}`;
                    })
                    .join(', ');

                  return (
                    <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="px-5 py-3 font-mono font-bold text-sea">{rec.id}</td>
                      <td className="px-5 py-3 text-slate-600 dark:text-slate-400 font-sans">{rec.dateSubmitted}</td>
                      <td className="px-5 py-3 text-center font-mono font-bold text-prussian dark:text-snow">{rec.totalQuantity}</td>
                      <td className="px-5 py-3 max-w-sm truncate text-slate-500 font-sans" title={details}>
                        {details || "No indicators logged"}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <button 
                          onClick={() => handleDeleteRecord(rec.id)} 
                          className="text-rose-400 hover:text-rose-600 p-1" 
                          title="Delete Logs"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-slate-400 italic">
                      No disability equipment records logged in local storage.
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

export default EquipmentDisabilityRegistry;
