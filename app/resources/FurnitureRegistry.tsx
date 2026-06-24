"use client";

import React, { useState, useMemo } from "react";
import { 
  AlertCircle, 
  Layers, 
  MonitorPlay, 
  Save, 
  Download, 
  RotateCcw, 
  Box, 
  GraduationCap, 
  Users,
  Search,
  Trash2,
  Table,
  CheckSquare,
  Database
} from "lucide-react";
import { Furniture } from "../types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { INITIAL_FURNITURE } from "../constants";
import { motion, AnimatePresence } from "motion/react";

export const FurnitureRegistry: React.FC = () => {
  const { items, addItem, updateItem, deleteItem } = useLocalStorage<Furniture>(
    "furniture",
    INITIAL_FURNITURE
  );

  const [formData, setFormData] = useState<Partial<Furniture>>({
    desk1: 0, desk2: 0, desk3: 0, pupilsTables: 0, pupilsChairs: 0,
    teachersTables: 0, teachersChairs: 0, cupboardsLockers: 0,
    fixedChalkBoard: 0, whiteBoards: 0, movableChalkBoard: 0, smartboards: 0
  });

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  
  // Table search and sort
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Furniture | null; direction: "asc" | "desc" }>({ key: "dateSubmitted", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Calculations
  const calcStudentFurniture = (data: Partial<Furniture>) => 
    (data.desk1 || 0) + (data.desk2 || 0) + (data.desk3 || 0) + (data.pupilsTables || 0) + (data.pupilsChairs || 0);
  
  const calcStaffFurniture = (data: Partial<Furniture>) => 
    (data.teachersTables || 0) + (data.teachersChairs || 0);

  const calcStorage = (data: Partial<Furniture>) => 
    (data.cupboardsLockers || 0);

  const calcTeachingAids = (data: Partial<Furniture>) => 
    (data.fixedChalkBoard || 0) + (data.whiteBoards || 0) + (data.movableChalkBoard || 0) + (data.smartboards || 0);

  const calcTotal = (data: Partial<Furniture>) => 
    calcStudentFurniture(data) + calcStaffFurniture(data) + calcStorage(data) + calcTeachingAids(data);

  // Stats from saved registry
  const totals = useMemo(() => {
    let studentSum = 0;
    let staffSum = 0;
    let storageSum = 0;
    let teachingSum = 0;

    items.forEach(item => {
      studentSum += calcStudentFurniture(item);
      staffSum += calcStaffFurniture(item);
      storageSum += calcStorage(item);
      teachingSum += calcTeachingAids(item);
    });

    return {
      studentSum, staffSum, storageSum, teachingSum, 
      total: studentSum + staffSum + storageSum + teachingSum
    };
  }, [items]);

  const formDataStudent = calcStudentFurniture(formData);
  const formDataStaff = calcStaffFurniture(formData);
  const formDataStorage = calcStorage(formData);
  const formDataTeachingAids = calcTeachingAids(formData);
  const formDataTotal = calcTotal(formData);

  const nonZeroFieldsCount = Object.keys(formData).filter(key => 
    !["id", "dateSubmitted"].includes(key) && (formData[key as keyof Furniture] as number) > 0
  ).length;

  const handleInputChange = (field: keyof Furniture, value: string) => {
    const num = value === "" ? 0 : parseInt(value, 10);
    setFormData(prev => ({
      ...prev,
      [field]: isNaN(num) ? 0 : num
    }));
  };

  const setAllZeroes = () => {
    setFormData(prev => {
      const reset: Partial<Furniture> = { ...prev };
      [
        "desk1", "desk2", "desk3", "pupilsTables", "pupilsChairs", 
        "teachersTables", "teachersChairs", "cupboardsLockers", 
        "fixedChalkBoard", "whiteBoards", "movableChalkBoard", "smartboards"
      ].forEach(k => {
        const key = k as keyof Omit<Furniture, "id" | "dateSubmitted">;
        if (reset[key] === undefined) reset[key] = 0;
      });
      return reset;
    });
    triggerToast("All undefined fields padded to 0.", "success");
  };

  const clearForm = () => {
    setFormData({
      desk1: 0, desk2: 0, desk3: 0, pupilsTables: 0, pupilsChairs: 0,
      teachersTables: 0, teachersChairs: 0, cupboardsLockers: 0,
      fixedChalkBoard: 0, whiteBoards: 0, movableChalkBoard: 0, smartboards: 0
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto fill zeros if undefined
    const keys: (keyof Omit<Furniture, "id" | "dateSubmitted">)[] = [
      "desk1", "desk2", "desk3", "pupilsTables", "pupilsChairs", 
      "teachersTables", "teachersChairs", "cupboardsLockers", 
      "fixedChalkBoard", "whiteBoards", "movableChalkBoard", "smartboards"
    ];
    
    const cleaned: Partial<Furniture> = {};
    keys.forEach(k => {
      cleaned[k] = (formData[k] as number) || 0;
    });

    const isAllZeroes = Object.values(cleaned).every(v => v === 0);
    if (isAllZeroes) {
      triggerToast("Please input quantities for furniture items first.", "error");
      return;
    }

    if (formData.id) {
      updateItem({
        ...formData,
        ...cleaned,
        dateSubmitted: formData.dateSubmitted || new Date().toISOString().split('T')[0]
      } as Furniture);
      triggerToast("Classroom furniture record updated successfully.", "success");
    } else {
      addItem({
        ...cleaned,
        id: `FN-${Date.now().toString(36).slice(-4)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        dateSubmitted: new Date().toISOString().split('T')[0]
      } as Furniture);
      triggerToast("New furniture inventory record added to archive.", "success");
    }
    
    // Reset after submit
    clearForm();
    setCurrentPage(1);
  };

  const exportSummary = () => {
    if (items.length === 0) {
      triggerToast("No inventory records found to export.", "error");
      return;
    }
    const headers = [
      "Entry ID", "Date Submitted", 
      "Desk 1 Pupil", "Desk 2 Pupils", "Desk 3 Pupils", "Pupils Tables", "Pupils Chairs",
      "Teachers Tables", "Teachers Chairs", "Cupboards/Lockers",
      "Fixed Chalk Board", "White Boards", "Movable Chalk Board", "Smartboards",
      "Total Items"
    ];
    const rows = items.map(fn => [
      fn.id, fn.dateSubmitted,
      fn.desk1, fn.desk2, fn.desk3, fn.pupilsTables, fn.pupilsChairs,
      fn.teachersTables, fn.teachersChairs, fn.cupboardsLockers,
      fn.fixedChalkBoard, fn.whiteBoards, fn.movableChalkBoard, fn.smartboards,
      calcTotal(fn)
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `furniture_records_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("Export completed successfully.", "success");
  };

  const loadRecord = (record: Furniture) => {
    setFormData(record);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    triggerToast(`Loaded record ${record.id} into editor grid.`, "success");
  };

  // Sorting and Filtering
  const filteredData = useMemo(() => {
    let result = [...items];
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.id.toLowerCase().includes(q) || 
        item.dateSubmitted.includes(q)
      );
    }
    
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key!] > b[sortConfig.key!]) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    
    return result;
  }, [items, searchQuery, sortConfig]);

  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;

  const requestSort = (key: keyof Furniture) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="space-y-6 animate-fade-in" id="primary-furniture-registry">
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Action Header */}
          <div className="flex flex-wrap justify-between items-center pb-4 border-b border-slate-150 dark:border-slate-800/60 gap-4">
            <div>
              <h2 className="text-sm font-black text-[#002652] dark:text-[#00A3A3] uppercase tracking-wider flex items-center gap-1.5 font-sans">
                <Box className="w-4 h-4 text-[#00A3A3]" />
                CLASSROOM FURNITURE DATA CAPTURE
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium font-sans">
                Collect, modify, and export inventories for student chairs, double desks, smartboards, and wardrobes.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  clearForm();
                  triggerToast("Form input cleared.", "success");
                }}
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
                <span>Save Furniture Entry</span>
              </button>
            </div>
          </div>

          {/* 4 Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-sans">Total Furniture Items</span>
              <span className="text-xl font-black text-[#002652] dark:text-snow block font-mono mt-0.5">{formDataTotal}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-sans">Student desks & chairs</span>
              <span className="text-xl font-black text-emerald-600 block font-mono mt-0.5">{formDataStudent}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-sans">Staff seats & tables</span>
              <span className="text-xl font-black text-amber-500 block font-mono mt-0.5">{formDataStaff}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-sans">Boards & Teaching aids</span>
              <span className="text-xl font-black text-[#00A3A3] block font-mono mt-0.5">{formDataTeachingAids}</span>
            </div>
          </div>

          {/* Completeness Tracker */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-1.5 bg-slate-100 dark:bg-[#000d1a] rounded overflow-hidden">
              <div className="h-full bg-[#00A3A3] transition-all duration-500" style={{ width: `${(nonZeroFieldsCount / 12) * 100}%`}}></div>
            </div>
            <span className="text-xs font-bold text-slate-500 font-mono tracking-tight">{nonZeroFieldsCount} of 12 checkpoints filled</span>
          </div>

          {/* Category split grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Category container: Pupil furniture & Cabinets */}
            <div className="space-y-6">
              <div className="bg-slate-50/50 dark:bg-[#000d1a] border border-slate-200/80 dark:border-slate-805 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-805 font-sans">
                  <h3 className="text-xs font-black text-[#002652] dark:text-[#00A3A3] tracking-widest uppercase flex items-center gap-2">
                    <span className="w-1 h-3 bg-emerald-500 rounded-sm"></span>
                    Student Furniture Options
                  </h3>
                </div>

                <div className="space-y-3">
                  {[
                    { id: "desk1", label: "Sitting 1 Pupil Desk (Standard Class)" },
                    { id: "desk2", label: "Sitting 2 Pupils Desk (Double)" },
                    { id: "desk3", label: "Sitting 3+ Pupils Desk (Plural)" },
                    { id: "pupilsTables", label: "Pupils' Tables" },
                    { id: "pupilsChairs", label: "Pupils' Chairs" }
                  ].map(item => {
                    const value = formData[item.id as keyof Furniture] || 0;
                    return (
                      <div 
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-white dark:bg-[#001020] border border-slate-100 dark:border-slate-805 rounded-lg gap-4"
                      >
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-sans">{item.label}</span>
                        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900/40 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-800">
                          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">Count</span>
                          <input
                            type="number"
                            min="0"
                            value={value}
                            onChange={(e) => handleInputChange(item.id as keyof Furniture, e.target.value)}
                            className="w-12 bg-transparent text-center text-sm font-mono font-bold focus:outline-none dark:text-slate-100"
                            onFocus={(e) => e.target.select()}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-slate-50/50 dark:bg-[#000d1a] border border-slate-200/80 dark:border-slate-805 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-805 font-sans">
                  <h3 className="text-xs font-black text-[#002652] dark:text-[#00A3A3] tracking-widest uppercase flex items-center gap-2">
                    <span className="w-1 h-3 bg-blue-500 rounded-sm"></span>
                    Storage & Cabinets
                  </h3>
                </div>

                <div className="flex items-center justify-between p-3 bg-white dark:bg-[#001020] border border-slate-100 dark:border-slate-805 rounded-lg gap-4">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-sans">Cupboards, Wardrobes & Lockers</span>
                  <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900/40 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-800">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">Count</span>
                    <input
                      type="number"
                      min="0"
                      value={formData.cupboardsLockers || 0}
                      onChange={(e) => handleInputChange("cupboardsLockers", e.target.value)}
                      className="w-12 bg-transparent text-center text-sm font-mono font-bold focus:outline-none dark:text-slate-100"
                      onFocus={(e) => e.target.select()}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Category container: Staff & boards */}
            <div className="space-y-6">
              <div className="bg-slate-50/50 dark:bg-[#000d1a] border border-slate-200/80 dark:border-slate-805 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-805 font-sans">
                  <h3 className="text-xs font-black text-[#002652] dark:text-[#00A3A3] tracking-widest uppercase flex items-center gap-2">
                    <span className="w-1 h-3 bg-amber-500 rounded-sm"></span>
                    Staff & Teacher Furniture
                  </h3>
                </div>

                <div className="space-y-3">
                  {[
                    { id: "teachersTables", label: "Teachers' Writing Tables" },
                    { id: "teachersChairs", label: "Teachers' Cabin Seats" }
                  ].map(item => {
                    const value = formData[item.id as keyof Furniture] || 0;
                    return (
                      <div 
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-white dark:bg-[#001020] border border-slate-100 dark:border-slate-805 rounded-lg gap-4"
                      >
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-sans">{item.label}</span>
                        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900/40 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-800">
                          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">Count</span>
                          <input
                            type="number"
                            min="0"
                            value={value}
                            onChange={(e) => handleInputChange(item.id as keyof Furniture, e.target.value)}
                            className="w-12 bg-transparent text-center text-sm font-mono font-bold focus:outline-none dark:text-slate-100"
                            onFocus={(e) => e.target.select()}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-slate-50/50 dark:bg-[#000d1a] border border-slate-200/80 dark:border-slate-805 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-805 font-sans">
                  <h3 className="text-xs font-black text-[#002652] dark:text-[#00A3A3] tracking-widest uppercase flex items-center gap-2">
                    <span className="w-1 h-3 bg-purple-500 rounded-sm"></span>
                    Teaching Boards & Aids
                  </h3>
                </div>

                <div className="space-y-3">
                  {[
                    { id: "fixedChalkBoard", label: "Class Fixed Chalk Board" },
                    { id: "whiteBoards", label: "Standard Dry-erase White Boards" },
                    { id: "movableChalkBoard", label: "Movable Interactive Easel Chalk Boards" },
                    { id: "smartboards", label: "Digital Smartboards" }
                  ].map(item => {
                    const value = formData[item.id as keyof Furniture] || 0;
                    return (
                      <div 
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-white dark:bg-[#001020] border border-slate-100 dark:border-slate-805 rounded-lg gap-4"
                      >
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-sans">{item.label}</span>
                        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900/40 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-800">
                          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">Count</span>
                          <input
                            type="number"
                            min="0"
                            value={value}
                            onChange={(e) => handleInputChange(item.id as keyof Furniture, e.target.value)}
                            className="w-12 bg-transparent text-center text-sm font-mono font-bold focus:outline-none dark:text-slate-100"
                            onFocus={(e) => e.target.select()}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          <div className="flex flex-wrap gap-4 pt-6 border-t border-slate-200 dark:border-slate-800 font-sans">
            <button 
              type="submit" 
              className="px-6 py-2 bg-[#002652] hover:bg-[#001c3d] text-white rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4 text-[#00A3A3]" />
              Save Classroom Inventory
            </button>
            <button 
              type="button" 
              onClick={() => {
                clearForm();
                triggerToast("Form cleared to standard defaults.", "success");
              }} 
              className="px-4 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-[#001428] text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-2 cursor-pointer text-xs font-bold rounded-lg"
            >
              <RotateCcw className="w-4 h-4 text-slate-400" />
              Reset
            </button>
            <button 
              type="button" 
              onClick={exportSummary} 
              className="px-4 py-2 bg-white dark:bg-black/30 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-2 cursor-pointer text-xs font-bold rounded-lg"
            >
              <Download className="w-4 h-4 text-emerald-500" />
              Export CSV Schema
            </button>
            <button 
              type="button" 
              onClick={setAllZeroes} 
              className="px-4 py-2 bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-[#002652] dark:text-[#00A3A3] transition-colors text-xs font-bold rounded-lg ml-auto cursor-pointer"
            >
              Autopad Undefined Fields with 0
            </button>
          </div>
        </form>
      </div>

      {/* Extrapolated Registry Table */}
      <div className="pt-4">
        <h3 className="text-sm font-black text-[#002652] dark:text-snow uppercase tracking-wider mb-3 flex items-center gap-2 font-sans">
          <Database className="w-4 h-4 text-[#00A3A3]" />
          SAVED CLASSROOM INVENTORY LOGS HISTORY
        </h3>

        <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800/80 rounded-xl shadow-sm overflow-hidden font-sans">
          <div className="p-4 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#001428]/10 dark:border-slate-850">
            <div className="relative w-full max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input 
                type="text" 
                placeholder="Search classroom inventories..." 
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
                  <th className="px-5 py-3 text-left">Record ID</th>
                  <th className="px-5 py-3 text-left">Date Submitted</th>
                  <th className="px-2 py-3 text-center">Desk 1</th>
                  <th className="px-2 py-3 text-center">Desk 2</th>
                  <th className="px-2 py-3 text-center">Desk 3</th>
                  <th className="px-2 py-3 text-center">Tables</th>
                  <th className="px-2 py-3 text-center">Chairs</th>
                  <th className="px-2 py-3 text-center">Cupboards</th>
                  <th className="px-2 py-3 text-center">Teachers T.</th>
                  <th className="px-2 py-3 text-center">Teachers C.</th>
                  <th className="px-2 py-3 text-center">White boards</th>
                  <th className="px-2 py-3 text-center border-r border-slate-200 dark:border-slate-800">Smartboards</th>
                  <th className="px-5 py-3 text-center font-bold text-[#002652] dark:text-[#00A3A3]">Total Quantity</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {paginatedRecords.length > 0 ? paginatedRecords.map((fn) => {
                  return (
                    <tr 
                      key={fn.id} 
                      className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors group cursor-pointer" 
                      onClick={() => loadRecord(fn)}
                    >
                      <td className="px-5 py-3 font-mono font-bold text-sea">{fn.id}</td>
                      <td className="px-5 py-3 text-slate-600 dark:text-slate-400 font-sans">{fn.dateSubmitted}</td>
                      <td className="px-2 py-3 text-center font-mono text-slate-700 dark:text-slate-300">{fn.desk1 || 0}</td>
                      <td className="px-2 py-3 text-center font-mono text-slate-700 dark:text-slate-300">{fn.desk2 || 0}</td>
                      <td className="px-2 py-3 text-center font-mono text-slate-700 dark:text-slate-300">{fn.desk3 || 0}</td>
                      <td className="px-2 py-3 text-center font-mono text-slate-700 dark:text-slate-300">{fn.pupilsTables || 0}</td>
                      <td className="px-2 py-3 text-center font-mono text-slate-700 dark:text-slate-300">{fn.pupilsChairs || 0}</td>
                      <td className="px-2 py-3 text-center font-mono text-slate-700 dark:text-slate-300">{fn.cupboardsLockers || 0}</td>
                      <td className="px-2 py-3 text-center font-mono text-slate-700 dark:text-slate-300">{fn.teachersTables || 0}</td>
                      <td className="px-2 py-3 text-center font-mono text-slate-700 dark:text-slate-300">{fn.teachersChairs || 0}</td>
                      <td className="px-2 py-3 text-center font-mono text-slate-700 dark:text-slate-300">{fn.whiteBoards || 0}</td>
                      <td className="px-2 py-3 text-center font-mono text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800">{fn.smartboards || 0}</td>
                      <td className="px-5 py-3 text-center font-mono font-bold text-[#002652] dark:text-[#00A3A3]">{calcTotal(fn)}</td>
                      <td className="px-5 py-3 text-center">
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            if (window.confirm("Are you sure you want to delete this furniture record?")) {
                              deleteItem(fn.id); 
                              triggerToast("Record deleted successfully.", "success"); 
                            }
                          }}
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
                    <td colSpan={14} className="px-5 py-8 text-center text-slate-400 italic">
                      No matching furniture logs recorded yet.
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

export default FurnitureRegistry;
