"use client";

import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { 
  Save, Eraser, Download, Printer, FileText, 
  Search, ChevronLeft, ChevronRight, CheckSquare,
  AlertTriangle, CheckCircle2, History,
  Trash2, Edit, View, Activity, Info, Laptop
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { SectionContainer } from "../shared/SectionContainer";

// Types
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
    accent: "bg-sea",
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
    accent: "bg-golden",
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
    accent: "bg-sea",
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
    accent: "bg-prussian",
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
    deleteItem,
  } = useLocalStorage<EquipmentRecord>("equipment_registry_v3_data", []);

  const [formState, setFormState] = useState<FormState>(getInitialFormState());
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const [alert, setAlert] = useState<{ message: string; type: "success" | "warning" } | null>(null);

  const triggerAlert = (message: string, type: "success" | "warning") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
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
  const handleInputChange = (id: string, field: keyof EquipmentState, value: any) => {
    setFormState(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  // Bulk Edit Setup
  const handleSelectAllCategory = (catItems: {id: string}[], isChecked: boolean) => {
    const nextState = { ...formState };
    catItems.forEach(item => {
      nextState[item.id] = { ...nextState[item.id], selected: isChecked };
    });
    setFormState(nextState);
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
      triggerAlert("Select equipment items first to apply bulk changes.", "warning");
      return;
    }
    setFormState(nextState);
    triggerAlert(`Bulk action applied to ${updatedCount} items.`, "success");
  };

  // Save/Submit Form
  const handleSave = () => {
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
            category: cat.title.split(":")[0], // Just e.g. "Section 1"
          });
        }
      });
    });

    if (newRecords.length === 0) {
      triggerAlert("No equipment quantities entered to save.", "warning");
      return;
    }

    setSavedRecords(prev => [...newRecords, ...prev]);
    setFormState(getInitialFormState());
    triggerAlert(`Successfully saved ${newRecords.length} equipment records.`, "success");
    setCurrentPage(1); // jump to first page to see new items
  };

  // Clear Form
  const handleClear = () => {
    if (confirm("Are you sure you want to clear all form fields?")) {
      setFormState(getInitialFormState());
    }
  };

  // Import Previous (Mock)
  const handleImport = () => {
    if (savedRecords.length === 0) {
      triggerAlert("No previous submitted records found to import.", "warning");
      return;
    }
    const nextState = getInitialFormState();
    let imported = 0;
    savedRecords.forEach(rec => {
      if (nextState[rec.equipmentId]) {
        nextState[rec.equipmentId].working += rec.working;
        nextState[rec.equipmentId].notWorking += rec.notWorking;
        if (nextState[rec.equipmentId].customLabel !== undefined && rec.equipmentName !== "Other Equipment (Specify)") {
            nextState[rec.equipmentId].customLabel = rec.equipmentName;
        }
        imported++;
      }
    });
    setFormState(nextState);
    triggerAlert(`Imported ${imported} quantities from history.`, "success");
  };

  // Filtering for Table
  const filteredRecords = useMemo(() => {
    if (!searchQuery) return savedRecords;
    return savedRecords.filter(r => 
      r.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, savedRecords]);

  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredRecords.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredRecords, currentPage]);

  const totalPages = Math.ceil(filteredRecords.length / rowsPerPage);

  // Category Health Indicator
  const getCategoryHealth = (catItems: {id: string}[]) => {
    let w = 0;
    let nw = 0;
    catItems.forEach(item => {
      w += (formState[item.id]?.working || 0);
      nw += (formState[item.id]?.notWorking || 0);
    });
    const total = w + nw;
    if (total === 0) return { color: "text-slate-300", bg: "bg-slate-100", label: "No Data" };
    const rate = (w / total) * 100;
    if (rate >= 80) return { color: "text-sea", bg: "bg-sea/10", label: "Healthy" };
    if (rate >= 50) return { color: "text-golden", bg: "bg-golden/10", label: "Moderate" };
    return { color: "text-rose-500", bg: "bg-rose-50", label: "Critical" };
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 pb-16">
      
      {/* Alert Component */}
      {alert && (
        <div className={`p-4 rounded border flex items-center gap-3 text-sm font-bold shadow-sm ${
          alert.type === "success" ? "bg-sea/10 border-sea text-sea" : "bg-golden/10 border-golden text-golden"
        }`}>
          {alert.type === "success" ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
          <span>{alert.message}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-prussian rounded-2xl p-6 shadow-md text-snow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl tracking-tight font-black uppercase flex items-center gap-3">
            <Laptop className="w-6 h-6 text-sea" />
            Equipment Register
          </h1>
          <p className="text-snow/80 text-sm mt-1 font-medium max-w-xl">
            Include equipment purchased by PTA and other sources (record correct functional quantities per item).
          </p>
        </div>
        
        <div className="flex gap-2">
           <button onClick={handleImport} className="flex items-center gap-2 px-4 py-2 bg-sea hover:bg-snow dark:bg-slate-900 hover:text-prussian dark:text-white text-snow rounded-lg font-bold text-xs uppercase tracking-wider transition-colors shadow-sm">
             <History className="w-4 h-4" /> Import Data
           </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#001020] border border-prussian dark:border-slate-700/20 rounded-xl p-5 shadow-sm">
           <span className="text-xs font-bold text-prussian dark:text-white uppercase tracking-widest block mb-1">Total Equipment</span>
           <span className="text-3xl font-black text-prussian dark:text-white font-mono">{summaryTotal}</span>
        </div>
        <div className="bg-white dark:bg-[#001020] border border-sea/30 rounded-xl p-5 shadow-sm">
           <span className="text-xs font-bold text-sea uppercase tracking-widest block mb-1">Working</span>
           <span className="text-3xl font-black text-sea font-mono">{summaryWorking}</span>
        </div>
        <div className="bg-white dark:bg-[#001020] border border-rose-200 rounded-xl p-5 shadow-sm">
           <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block mb-1">Not Working</span>
           <span className="text-3xl font-black text-rose-600 font-mono">{summaryNotWorking}</span>
        </div>
        <div className="bg-white dark:bg-[#001020] border border-golden/30 rounded-xl p-5 shadow-sm">
           <span className="text-xs font-bold text-golden uppercase tracking-widest block mb-1">Functional Rate</span>
           <div className="flex items-baseline gap-1">
             <span className="text-3xl font-black text-golden font-mono">{summaryRate}</span>
             <span className="text-golden font-bold">%</span>
           </div>
        </div>
      </div>

      {/* Bulk Global Action Toolkit if items selected */}
      {Object.values(formState).some(s => s.selected) && (
        <div className="bg-golden/10 border border-golden rounded-xl p-3 flex items-center justify-between shadow-sm animate-in fade-in zoom-in-95">
          <span className="text-xs font-bold text-golden uppercase tracking-wider flex items-center gap-2">
             <CheckSquare className="w-4 h-4" /> 
             {Object.values(formState).filter(s => s.selected).length} Items Selected
          </span>
          <div className="flex gap-2">
            <button onClick={() => applyBulkAction("working")} className="px-3 py-1.5 bg-sea text-snow font-bold text-xs rounded shadow-sm hover:brightness-110">
              Set All to Working
            </button>
            <button onClick={() => applyBulkAction("notWorking")} className="px-3 py-1.5 bg-rose-600 text-snow font-bold text-xs rounded shadow-sm hover:brightness-110">
              Set All to Broken
            </button>
          </div>
        </div>
      )}

      {/* Main Categories Form */}
      <div className="space-y-8">
        {EQUIPMENT_CATEGORIES.map(category => {
          const health = getCategoryHealth(category.items);
          const allSelected = category.items.every(i => formState[i.id]?.selected);
          
          return (
          <div key={category.id} className="bg-white dark:bg-[#001020] border border-prussian dark:border-slate-700 shadow-sm rounded-xl overflow-hidden">
            {/* Sec Header */}
            <div className={`p-4 ${category.accent} text-snow flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={allSelected}
                  onChange={(e) => handleSelectAllCategory(category.items, e.target.checked)}
                  className="w-4 h-4 rounded border-snow bg-transparent focus:ring-snow"
                />
                <h2 className="font-black uppercase tracking-wider text-sm">{category.title}</h2>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${health.bg} ${health.color}`}>
                 <Activity className="w-3.5 h-3.5" />
                 {health.label} Status
              </div>
            </div>

            {/* List Body */}
            <div className="p-5 md:p-6 bg-snow dark:bg-slate-900">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {category.items.map(item => {
                  const s = formState[item.id];
                  return (
                    <div 
                      key={item.id} 
                      className={`flex flex-col bg-white dark:bg-[#001020] border ${s.selected ? 'border-sea ring-1 ring-sea/50' : 'border-slate-200 dark:border-slate-800'} rounded-xl p-4 shadow-sm transition-all hover:border-prussian dark:border-slate-700 group`}
                    >
                      <div className="flex items-start justify-between mb-3 gap-2">
                        <div className="flex items-start gap-2.5">
                           <input 
                             type="checkbox" 
                             checked={s.selected || false}
                             onChange={(e) => handleInputChange(item.id, "selected", e.target.checked)}
                             className="mt-0.5 w-4 h-4 text-sea rounded border-slate-300 focus:ring-sea"
                           />
                           <div>
                             <span className="text-sm font-bold text-prussian dark:text-white leading-tight block">{item.label}</span>
                             {item.isOther && (
                               <input 
                                 type="text" 
                                 placeholder="Type specific item name..."
                                 value={s.customLabel || ""}
                                 onChange={(e) => handleInputChange(item.id, "customLabel", e.target.value)}
                                 className="mt-2 w-full max-w-xs text-xs p-2 border border-slate-200 dark:border-slate-800 rounded focus:border-sea focus:outline-none"
                               />
                             )}
                           </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mt-auto">
                        <div className="bg-snow dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <label className="text-[10px] font-bold text-sea uppercase tracking-wider flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-sea inline-block"></span> Working
                          </label>
                          <input 
                            type="number" min="0" 
                            value={s.working?.toString() || "0"}
                            onChange={(e) => handleInputChange(item.id, "working", parseInt(e.target.value) || 0)}
                            className="w-16 text-center text-sm font-bold text-prussian dark:text-white border-b border-prussian dark:border-slate-700 focus:border-sea focus:outline-none bg-transparent"
                            onFocus={e => e.target.select()}
                          />
                        </div>
                        <div className="bg-snow dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <label className="text-[10px] font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span> Defective
                          </label>
                          <input 
                            type="number" min="0" 
                            value={s.notWorking?.toString() || "0"}
                            onChange={(e) => handleInputChange(item.id, "notWorking", parseInt(e.target.value) || 0)}
                            className="w-16 text-center text-sm font-bold text-prussian dark:text-white border-b border-prussian dark:border-slate-700 focus:border-sea focus:outline-none bg-transparent"
                            onFocus={e => e.target.select()}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )})}
      </div>

      {/* Main Actions Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-[#001020] border border-prussian dark:border-slate-700 rounded-xl p-4 shadow-sm gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Info className="w-5 h-5 text-prussian dark:text-white opacity-50 hidden sm:block" />
          <span className="text-xs text-ink dark:text-slate-300/70 font-medium whitespace-nowrap">Ensure all quantities are verified before saving.</span>
        </div>
        
        <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full sm:w-auto justify-end">
           <button onClick={handleClear} className="w-full sm:w-auto px-5 py-2.5 bg-golden text-snow rounded-xl text-xs font-bold uppercase tracking-wider transition-colors hover:bg-prussian flex items-center justify-center gap-2 shadow-sm">
             <Eraser className="w-4 h-4" /> Clear Form
           </button>
           <button className="w-full sm:w-auto px-5 py-2.5 bg-sea text-snow rounded-xl text-xs font-bold uppercase tracking-wider transition-colors hover:bg-prussian flex items-center justify-center gap-2 shadow-sm">
             <Download className="w-4 h-4" /> Export Summary
           </button>
           <button onClick={handleSave} className="w-full sm:w-auto px-6 py-2.5 bg-prussian text-snow rounded-xl text-xs font-bold uppercase tracking-wider transition-colors hover:bg-sea flex items-center justify-center gap-2 shadow-md">
             <Save className="w-4 h-4" /> Save Records
           </button>
        </div>
      </div>

      {/* Data Table Section */}
      <div className="pt-8">
        <div className="flex flex-col gap-1 mb-4">
          <h3 className="text-lg font-black text-prussian dark:text-white uppercase tracking-tight">Saved Equipment Registry</h3>
          <p className="text-xs text-ink dark:text-slate-300/70 font-medium">Historical submissions and recorded quantities.</p>
        </div>
        
        <div className="bg-white dark:bg-[#001020] border border-prussian dark:border-slate-700 shadow-sm rounded-2xl overflow-hidden">
          {/* Table Header Controls */}
          <div className="p-4 border-b border-prussian dark:border-slate-700/10 bg-snow dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <div className="relative max-w-sm w-full">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink dark:text-slate-300/40" />
               <input 
                 type="text" 
                 placeholder="Search equipment or ID..." 
                 value={searchQuery}
                 onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                 className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-[#001020] border border-prussian dark:border-slate-700/20 rounded-lg focus:border-prussian dark:border-slate-700 focus:outline-none transition-colors"
               />
             </div>
             
             <div className="flex gap-2">
                 <button className="p-2 border border-slate-200 dark:border-slate-800 text-slate-500 rounded bg-white dark:bg-[#001020] hover:bg-snow dark:bg-slate-900 hover:text-prussian dark:text-white transition-colors" title="Print List">
                   <Printer className="w-4 h-4" />
                 </button>
                 <button className="p-2 border border-slate-200 dark:border-slate-800 text-slate-500 rounded bg-white dark:bg-[#001020] hover:bg-snow dark:bg-slate-900 hover:text-prussian dark:text-white transition-colors" title="Export CSV">
                   <FileText className="w-4 h-4" />
                 </button>
             </div>
          </div>
          
          {/* Table proper */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
               <thead>
                 <tr className="bg-prussian text-snow text-xs uppercase tracking-wider">
                   <th className="px-5 py-4 font-bold">Entry ID</th>
                   <th className="px-5 py-4 font-bold">Date Submitted</th>
                   <th className="px-5 py-4 font-bold">Equipment Name</th>
                   <th className="px-5 py-4 font-bold text-center">Working</th>
                   <th className="px-5 py-4 font-bold text-center">Broken</th>
                   <th className="px-5 py-4 font-bold text-center">Total</th>
                   <th className="px-5 py-4 font-bold text-center">Health %</th>
                   <th className="px-5 py-4 text-center font-bold">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-prussian/10 text-ink dark:text-slate-300">
                 {paginatedRecords.length > 0 ? paginatedRecords.map((rec, i) => (
                   <tr key={rec.id} className={`${i % 2 === 0 ? 'bg-white dark:bg-[#001020]' : 'bg-snow dark:bg-slate-900'}`}>
                     <td className="px-5 py-3 font-mono text-xs font-bold text-slug">{rec.id}</td>
                     <td className="px-5 py-3 text-xs text-ink dark:text-slate-300/70">{rec.dateSubmitted}</td>
                     <td className="px-5 py-3 font-bold text-prussian dark:text-white max-w-[200px] truncate" title={rec.equipmentName}>{rec.equipmentName}</td>
                     <td className="px-5 py-3 text-center font-mono font-bold text-sea">{rec.working}</td>
                     <td className="px-5 py-3 text-center font-mono font-bold text-rose-500">{rec.notWorking}</td>
                     <td className="px-5 py-3 text-center font-mono font-bold text-prussian dark:text-white">{rec.total}</td>
                     <td className="px-5 py-3 text-center">
                       <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                         rec.functionalRate >= 80 ? 'bg-sea/10 text-sea' : 
                         rec.functionalRate >= 50 ? 'bg-golden/10 text-golden' : 
                         'bg-rose-50 text-rose-600'
                       }`}>
                         {rec.functionalRate}%
                       </span>
                     </td>
                     <td className="px-5 py-3 text-center">
                       <div className="flex items-center justify-center gap-2">
                          <button className="text-sea hover:text-prussian dark:text-white p-1" title="View"><View className="w-4 h-4" /></button>
                          <button onClick={() => deleteItem(rec.id)} className="text-rose-400 hover:text-rose-600 p-1" title="Delete"><Trash2 className="w-4 h-4" /></button>
                       </div>
                     </td>
                   </tr>
                 )) : (
                   <tr>
                     <td colSpan={8} className="px-5 py-12 text-center text-ink dark:text-slate-300/50 text-sm">
                        No equipment records found. Search or save new items above.
                     </td>
                   </tr>
                 )}
               </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-5 py-3 bg-snow dark:bg-slate-900 border-t border-prussian dark:border-slate-700/10 flex items-center justify-between">
              <span className="text-xs text-ink dark:text-slate-300/60 font-medium">Page {currentPage} of {totalPages}</span>
              <div className="flex items-center gap-1">
                 <button 
                   disabled={currentPage === 1}
                   onClick={() => setCurrentPage(p => p - 1)}
                   className="p-1.5 rounded bg-white dark:bg-[#001020] text-prussian dark:text-white border border-slate-200 dark:border-slate-800 hover:border-prussian dark:border-slate-700 disabled:opacity-50 disabled:hover:border-slate-200 dark:border-slate-800 transition-colors"
                 >
                   <ChevronLeft className="w-4 h-4" />
                 </button>
                 <button 
                   disabled={currentPage === totalPages}
                   onClick={() => setCurrentPage(p => p + 1)}
                   className="p-1.5 rounded bg-white dark:bg-[#001020] text-prussian dark:text-white border border-slate-200 dark:border-slate-800 hover:border-prussian dark:border-slate-700 disabled:opacity-50 disabled:hover:border-slate-200 dark:border-slate-800 transition-colors"
                 >
                   <ChevronRight className="w-4 h-4" />
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

