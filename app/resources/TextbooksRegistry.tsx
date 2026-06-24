"use client";

import React, { useState, useEffect, useMemo } from "react";
import { AlertCircle, BookOpen, Save, Trash2, ListTree, Calculator, Edit, CheckCircle2, Download, Copy, RefreshCcw, Layers } from "lucide-react";
import { Textbook, Student } from "../types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useFilters } from "@/hooks/useFilters";
import { INITIAL_TEXTBOOKS, INITIAL_STUDENTS } from "../constants";
import { SectionContainer } from "../shared/SectionContainer";
import { FilterBar } from "../shared/FilterBar";
import { DataTable, ColumnConfig } from "../shared/DataTable";
import { FormModal } from "../shared/FormModal";
import { AddButton } from "../shared/ActionButtons";

const SUBJECT_OPTIONS_1_4 = [
  "English", "Setswana", "Mathematics", "Guidance & Counselling", "CAPA", 
  "Environmental Science", "Cultural Studies"
];

const SUBJECT_OPTIONS_5_7 = [
  "English", "Setswana", "Mathematics", "Guidance & Counselling", "CAPA", 
  "Science", "Social Studies", "Agriculture", "Religious & Moral Education"
];

const ALL_SUBJECTS = Array.from(new Set([...SUBJECT_OPTIONS_1_4, ...SUBJECT_OPTIONS_5_7]));

const STANDARD_OPTIONS = [
  "Std1", "Std2", "Std3", "Std4", 
  "Std5", "Std6", "Std7"
];

const getValidSubjects = (std: string) => {
  if (["Std1", "Std2", "Std3", "Std4"].includes(std)) return SUBJECT_OPTIONS_1_4;
  return SUBJECT_OPTIONS_5_7;
};

export const TextbooksRegistry: React.FC = () => {
  const { items, addItem, updateItem, deleteItem } = useLocalStorage<Textbook>("textbooks", INITIAL_TEXTBOOKS);
  const { items: students } = useLocalStorage<Student>("students", INITIAL_STUDENTS);

  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [matrix, setMatrix] = useState<Record<string, Record<string, number>>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [contextMenu, setContextMenu] = useState<{x: number, y: number, std: string, sub: string} | null>(null);

  const [activeTab, setActiveTab] = useState<string>("All");

  const {
    searchQuery, setSearchQuery, activeFilters, setFilterVal, clearFilters, filteredItems
  } = useFilters<Textbook>(items, ["subject", "std"], { subject: "All", std: "All" });

  const stdRolls = useMemo(() => {
    const rolls: Record<string, number> = {};
    STANDARD_OPTIONS.forEach(std => rolls[std] = 0);
    students.forEach(s => {
      const normStd = s.std.replace(/\s+/g, '').replace('Standard', 'Std');
      if (rolls[normStd] !== undefined) rolls[normStd]++;
    });
    return rolls;
  }, [students]);

  useEffect(() => {
    if (items.length > 0 && !isLoaded) {
       const initMatrix: Record<string, Record<string, number>> = {};
       STANDARD_OPTIONS.forEach(std => {
          initMatrix[std] = {};
          ALL_SUBJECTS.forEach(sub => { initMatrix[std][sub] = 0; });
       });
       items.forEach(item => {
          if (initMatrix[item.std] && initMatrix[item.std][item.subject] !== undefined) {
              if (getValidSubjects(item.std).includes(item.subject)) {
                 initMatrix[item.std][item.subject] = item.quantity || 0;
              }
          }
       });
       // eslint-disable-next-line react-hooks/set-state-in-effect
       setMatrix(initMatrix);
       setIsLoaded(true);
    } else if (items.length === 0 && !isLoaded) {
       const initMatrix: Record<string, Record<string, number>> = {};
       STANDARD_OPTIONS.forEach(std => {
          initMatrix[std] = {};
          ALL_SUBJECTS.forEach(sub => { initMatrix[std][sub] = 0; });
       });
       setMatrix(initMatrix);
       setIsLoaded(true);
    }
  }, [items, isLoaded]);

  const triggerAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleSaveAll = () => {
    setIsSubmitting(true);
    const now = new Date().toISOString().split("T")[0];
    let updates = 0;
    
    STANDARD_OPTIONS.forEach(std => {
        getValidSubjects(std).forEach(sub => {
            const existing = items.find(i => i.std === std && i.subject === sub);
            const qty = matrix[std]?.[sub] || 0;
            if(existing) {
                if(existing.quantity !== qty) {
                    updateItem({ ...existing, quantity: qty, lastModified: now });
                    updates++;
                }
            } else {
                addItem({
                   id: `TX-${Date.now().toString(36).slice(-4)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
                   std, subject: sub, quantity: qty, dateEntered: now, lastModified: now
                });
                updates++;
            }
        });
    });
    
    setIsSubmitting(false);
    triggerAlert(`Successfully synchronized ${updates} matrix variables to the Registry database.`, "success");
  };

  const handleClearAll = () => {
    const newMatrix = { ...matrix };
    STANDARD_OPTIONS.forEach(std => {
       getValidSubjects(std).forEach(sub => { newMatrix[std][sub] = 0; });
    });
    setMatrix(newMatrix);
    triggerAlert("Matrix reset to zero states.", "success");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if(e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            handleSaveAll();
        }
        if(e.ctrlKey && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            handleClearAll();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matrix, items]);

  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, []);

  const handleMatrixChange = (std: string, sub: string, val: number) => {
    setMatrix(prev => ({
        ...prev,
        [std]: {
            ...prev[std],
            [sub]: val < 0 ? 0 : val
        }
    }));
  };

  const getRowTotal = (std: string) => {
    let sum = 0;
    if(matrix[std]) getValidSubjects(std).forEach(sub => sum += matrix[std][sub] || 0);
    return sum;
  };

  const getColTotal = (sub: string) => {
    let sum = 0;
    STANDARD_OPTIONS.forEach(std => { if(getValidSubjects(std).includes(sub) && matrix[std]) sum += matrix[std][sub] || 0; });
    return sum;
  };

  const grandTotal = STANDARD_OPTIONS.reduce((acc, std) => acc + getRowTotal(std), 0);
  const standardsCompleted = STANDARD_OPTIONS.filter(std => matrix[std] && getValidSubjects(std).every(sub => (matrix[std][sub] || 0) > 0)).length;
  const subjectsCompleted = ALL_SUBJECTS.filter(sub => STANDARD_OPTIONS.filter(std => getValidSubjects(std).includes(sub)).every(std => (matrix[std]?.[sub] || 0) > 0)).length;
  const avgPerStandard = Math.round(grandTotal / (STANDARD_OPTIONS.length || 1));

  const highestStd = STANDARD_OPTIONS.reduce((a, b) => getRowTotal(a) > getRowTotal(b) ? a : b, STANDARD_OPTIONS[0]);
  const highestSub = ALL_SUBJECTS.reduce((a, b) => getColTotal(a) > getColTotal(b) ? a : b, ALL_SUBJECTS[0]);
  const lowestSub = ALL_SUBJECTS.reduce((a, b) => getColTotal(a) < getColTotal(b) ? a : b, ALL_SUBJECTS[0]);

  const getCellColor = (val: number) => {
    if (val === 0) return "bg-rose-50 text-rose-600 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 focus:ring-rose-400";
    if (val <= 50) return "bg-amber-50 text-amber-700 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 focus:ring-amber-400";
    if (val <= 100) return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 focus:ring-emerald-400";
    return "bg-blue-50 text-blue-700 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 focus:ring-blue-400";
  };

  const handleContextMenu = (e: React.MouseEvent, std: string, sub: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, std, sub });
  };

  const copyValue = () => contextMenu && navigator.clipboard.writeText(String(matrix[contextMenu.std][contextMenu.sub]));
  const pasteValue = async () => {
    if(contextMenu) {
        try {
            const text = await navigator.clipboard.readText();
            const val = parseInt(text, 10);
            if(!isNaN(val)) handleMatrixChange(contextMenu.std, contextMenu.sub, val);
        } catch(e) {}
    }
  };
  const setToZero = () => contextMenu && handleMatrixChange(contextMenu.std, contextMenu.sub, 0);
  const fillDown = () => {
    if(contextMenu) {
        const val = matrix[contextMenu.std][contextMenu.sub];
        const newMatrix = { ...matrix };
        const startIndex = STANDARD_OPTIONS.indexOf(contextMenu.std);
        for(let i = startIndex; i < STANDARD_OPTIONS.length; i++) {
           if(getValidSubjects(STANDARD_OPTIONS[i]).includes(contextMenu.sub)) {
               newMatrix[STANDARD_OPTIONS[i]][contextMenu.sub] = val;
           }
        }
        setMatrix(newMatrix);
    }
  };
  const fillRight = () => {
    if(contextMenu) {
        const val = matrix[contextMenu.std][contextMenu.sub];
        const newMatrix = { ...matrix };
        const validSubjects = getValidSubjects(contextMenu.std);
        const startIndex = validSubjects.indexOf(contextMenu.sub);
        if(startIndex > -1) {
            for(let i = startIndex; i < validSubjects.length; i++) {
               newMatrix[contextMenu.std][validSubjects[i]] = val;
            }
            setMatrix(newMatrix);
        }
    }
  };

  const filterConfigs = [
    { key: "std", label: "Standard", value: activeFilters.std || "All", options: STANDARD_OPTIONS, onChange: (v: string) => setFilterVal("std", v) },
    { key: "subject", label: "Subject", value: activeFilters.subject || "All", options: ALL_SUBJECTS, onChange: (v: string) => setFilterVal("subject", v) },
  ];

  const columns: ColumnConfig<Textbook>[] = [
    { header: "Entry ID", accessorKey: "id", className: "font-mono font-bold text-slate-400" },
    { header: "Standard Grade", accessorKey: "std", className: "font-medium" },
    { header: "Subject Sector", accessorKey: "subject", className: "font-semibold text-prussian dark:text-sea" },
    { header: "Net Quantity", accessorKey: "quantity", className: "font-mono font-bold text-center" },
    { header: "Student Roll", render: (tx: Textbook) => <span className="font-mono text-center text-slate-500 block">{stdRolls[tx.std] || 0}</span> },
    { header: "Deficit/Surplus", render: (tx: Textbook) => {
       const qt = typeof tx.quantity === 'number' && !isNaN(tx.quantity) ? tx.quantity : 0;
       const roll = stdRolls[tx.std] || 0;
       const diff = qt - roll;
       return (
         <span className={`font-mono font-bold text-center block ${diff >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
           {diff > 0 ? `+${diff}` : diff}
         </span>
       );
    }},
    { header: "Date Entered", accessorKey: "dateEntered", className: "text-slate-500 font-mono text-xs" },
    { header: "Last Revised", accessorKey: "lastModified", className: "text-slate-500 font-mono text-xs" }
  ];

  const totalFields = STANDARD_OPTIONS.reduce((acc, std) => acc + getValidSubjects(std).length, 0);
  let filledFields = 0;
  if (isLoaded) {
    STANDARD_OPTIONS.forEach(std => {
      getValidSubjects(std).forEach(sub => {
        if((matrix[std]?.[sub] || 0) > 0) filledFields++;
      });
    });
  }

  return (
    <div className="space-y-6" id="textbooks-inventory">
      {alert && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 text-sm font-medium ${
          alert.type === "success" ? "bg-emerald-50/50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800/60 dark:text-emerald-300" : "bg-rose-50/50 border-rose-200 text-rose-800 dark:bg-rose-900/20 dark:border-rose-800/60 dark:text-rose-300"
        }`}>
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{alert.message}</span>
        </div>
      )}

      {/* Header Summary Section */}
      <div>
        <h2 className="text-2xl font-black text-prussian dark:text-slate-100 uppercase tracking-tight flex items-center gap-2 mb-2">
          <BookOpen className="w-6 h-6 text-golden" />
          Prescribed Textbooks Register
        </h2>
        <p className="text-sm text-slate-500 mb-6">Track textbook quantities by standard grade and formal subject clusters.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-ink border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Textbooks</h4>
            <p className="text-3xl font-black text-prussian dark:text-slate-100 font-mono">{grandTotal}</p>
          </div>
          <div className="bg-white dark:bg-ink border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Standards Completed</h4>
            <p className="text-3xl font-black text-sea font-mono">{standardsCompleted} <span className="text-sm text-slate-400 font-sans tracking-normal">/ 7</span></p>
          </div>
          <div className="bg-white dark:bg-ink border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Subjects Completed</h4>
            <p className="text-3xl font-black text-golden font-mono">{subjectsCompleted} <span className="text-sm text-slate-400 font-sans tracking-normal">/ 9</span></p>
          </div>
          <div className="bg-white dark:bg-ink border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Avg Per Standard</h4>
            <p className="text-3xl font-black text-slate-600 dark:text-slate-300 font-mono">{avgPerStandard}</p>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mb-2 flex items-center justify-between text-xs font-semibold">
           <span className="text-slate-500">{filledFields} of {totalFields} fields completed</span>
           <span className="text-sea">{Math.round((filledFields / totalFields) * 100)}%</span>
        </div>
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
           <div className="h-full bg-gradient-to-r from-[#00A3A3] to-[#97620C] transition-all" style={{ width: `${(filledFields / totalFields) * 100}%`}}></div>
        </div>
      </div>

      {/* Matrix Form Area */}
      <div className="bg-white dark:bg-ink border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden mb-8">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/20 flex flex-wrap gap-4 items-center justify-between">
           <div className="flex bg-slate-200/50 dark:bg-slate-800 p-1 rounded-lg">
             <button onClick={() => setActiveTab("All")} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'All' ? 'bg-white dark:bg-slate-700 shadow-sm text-prussian dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>All</button>
             {STANDARD_OPTIONS.map(std => (
                <button key={std} onClick={() => setActiveTab(std)} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === std ? 'bg-white dark:bg-slate-700 shadow-sm text-prussian dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>{std}</button>
             ))}
           </div>
           
           <div className="flex gap-2">
             <button onClick={handleClearAll} className="px-4 py-2 border border-slate-200 hover:border-rose-400 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:hover:bg-rose-900/30 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold transition-colors">Clear All</button>
             <button onClick={handleSaveAll} disabled={isSubmitting} className="flex flex-center gap-2 items-center px-5 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-sea dark:hover:bg-[#008989] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors">
               <Save className="w-4 h-4" /> {isSubmitting ? "Saving..." : "Save Textbook Records"}
             </button>
           </div>
        </div>
        
        <div className="overflow-x-auto pb-4">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 box-shadow-sm">
                <th className="p-3 text-[10px] uppercase font-black text-slate-500 tracking-wider sticky left-0 bg-slate-50 dark:bg-slate-900 z-10 border-r border-slate-200 dark:border-slate-800">Standard</th>
                {ALL_SUBJECTS.map(sub => (
                  <th key={sub} className="p-3 text-[10px] uppercase font-bold text-prussian dark:text-slate-300 text-center tracking-wider max-w-[120px]" title={sub}>
                    {sub}
                  </th>
                ))}
                <th className="p-3 text-[10px] uppercase font-black text-slate-500 tracking-wider text-center bg-slate-100 dark:bg-slate-800">Row Total</th>
              </tr>
            </thead>
            <tbody>
              {isLoaded && STANDARD_OPTIONS.filter(std => activeTab === 'All' || activeTab === std).map((std) => (
                <tr key={std} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors group">
                  <td className="p-3 text-xs font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap sticky left-0 bg-white dark:bg-ink group-hover:bg-slate-50 dark:group-hover:bg-slate-900/10 border-r border-slate-100 dark:border-slate-800">
                    {std}
                  </td>
                  {ALL_SUBJECTS.map(sub => {
                    if (!getValidSubjects(std).includes(sub)) {
                        return (
                          <td key={sub} className="p-2 align-middle">
                            <div className="w-12 mx-auto block text-center text-xs p-2 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 text-slate-300 dark:text-slate-700 select-none">
                              -
                            </div>
                          </td>
                        );
                    }
                    const val = matrix[std]?.[sub] || 0;
                    return (
                      <td key={sub} className="p-2 align-middle">
                        <input 
                          type="number"
                          value={val.toString()}
                          onChange={(e) => handleMatrixChange(std, sub, parseInt(e.target.value) || 0)}
                          onContextMenu={(e) => handleContextMenu(e, std, sub)}
                          className={`w-12 mx-auto block text-center text-xs p-2 rounded-md border font-mono outline-none transition-all ${getCellColor(val)} hover:border-sea focus:border-sea`}
                        />
                      </td>
                    );
                  })}
                  <td className="p-3 text-sm font-black text-slate-500 font-mono text-center bg-slate-50/50 dark:bg-slate-900/10">
                    {getRowTotal(std)}
                  </td>
                </tr>
              ))}
              
              {/* Grand Total Row */}
              {activeTab === 'All' && (
                <tr className="bg-slate-100 dark:bg-slate-900 font-black border-t-2 border-slate-300 dark:border-slate-700">
                  <td className="p-3 text-xs uppercase tracking-wider text-prussian dark:text-slate-100 sticky left-0 bg-slate-100 dark:bg-slate-900 border-r border-slate-300 dark:border-slate-700">Column Total</td>
                  {ALL_SUBJECTS.map(sub => (
                    <td key={sub} className="p-3 text-sm text-center font-mono text-sea">
                      {getColTotal(sub)}
                    </td>
                  ))}
                  <td className="p-3 text-lg font-mono text-golden text-center">{grandTotal}</td>
                </tr>
              )}
            </tbody>
          </table>
          <p className="text-[10px] text-slate-400 mt-2 ml-4">Right-click any cell to copy, paste, reset, or fill values.</p>
        </div>

        {/* Matrix Footer Highlights */}
        <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-ink grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="flex gap-3 items-center">
             <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600"><Layers className="w-5 h-5"/></div>
             <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Highest Standard</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{highestStd} <span className="font-mono text-xs text-slate-500 ml-1">({getRowTotal(highestStd)})</span></p>
             </div>
           </div>
           <div className="flex gap-3 items-center">
             <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600"><BookOpen className="w-5 h-5"/></div>
             <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Highest Subject</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{highestSub} <span className="font-mono text-xs text-slate-500 ml-1">({getColTotal(highestSub)})</span></p>
             </div>
           </div>
           <div className="flex gap-3 items-center">
             <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600"><AlertCircle className="w-5 h-5"/></div>
             <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Lowest Subject</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{lowestSub} <span className="font-mono text-xs text-slate-500 ml-1">({getColTotal(lowestSub)})</span></p>
             </div>
           </div>
        </div>
      </div>

      {/* Bottom Table View */}
      <SectionContainer
        title="Saved Registry Archives"
        description="Database tabular view of synchronized quantities."
        action={
           <button onClick={() => {
              const csvContent = "data:text/csv;charset=utf-8," 
                  + ["Entry ID,Standard,Subject,Quantity,Date Entered"].join(",") + "\n"
                  + items.map(e => `${e.id},${e.std},${e.subject},${e.quantity},${e.dateEntered}`).join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", "textbooks_registry.csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
           }} className="flex items-center gap-2 px-4 py-2 border border-slate-300 outline hover:bg-slate-50 hover:text-slate-700 dark:border-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-colors">
              <Download className="w-4 h-4"/> Export CSV
           </button>
        }
      >
        <FilterBar
          searchPlaceholder="Search entry ID..."
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filterConfigs}
          onClear={clearFilters}
        />
        <DataTable
          columns={columns}
          data={filteredItems}
          emptyMessage="No catalogued materials matched specified filters."
        />
      </SectionContainer>

      {/* Context Menu Popup */}
      {contextMenu && (
        <div 
          className="fixed z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden py-1 min-w-[160px] text-xs font-medium text-slate-700 dark:text-slate-300"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
           <button onClick={() => { copyValue(); setContextMenu(null); }} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between">Copy Value <Copy className="w-3.5 h-3.5"/></button>
           <button onClick={() => { pasteValue(); setContextMenu(null); }} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between">Paste Value</button>
           <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
           <button onClick={() => { setToZero(); setContextMenu(null); }} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-rose-600 flex items-center justify-between">Reset to 0 <RefreshCcw className="w-3.5 h-3.5"/></button>
           <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
           <button onClick={() => { fillDown(); setContextMenu(null); }} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-sea">Fill Down &#8595;</button>
           <button onClick={() => { fillRight(); setContextMenu(null); }} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-sea">Fill Right &#8594;</button>
        </div>
      )}
    </div>
  );
};

export default TextbooksRegistry;
