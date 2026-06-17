"use client";

import React, { useState, useMemo } from "react";
import { AlertCircle, Layers, MonitorPlay, Save, Download, RotateCcw, Box, GraduationCap, Users } from "lucide-react";
import { Furniture } from "../types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { INITIAL_FURNITURE } from "../constants";

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

  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);
  
  // Table search and sort
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Furniture | null; direction: "asc" | "desc" }>({ key: "dateSubmitted", direction: "desc" });

  const triggerAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
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
        if (!reset[key]) reset[key] = 0;
      });
      return reset;
    });
    triggerAlert("Empty fields filled with 0", "success");
  };

  const clearForm = () => {
    setFormData({
      desk1: 0, desk2: 0, desk3: 0, pupilsTables: 0, pupilsChairs: 0,
      teachersTables: 0, teachersChairs: 0, cupboardsLockers: 0,
      fixedChalkBoard: 0, whiteBoards: 0, movableChalkBoard: 0, smartboards: 0
    });
    triggerAlert("Form cleared", "success");
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

    if (formData.id) {
      updateItem({
        ...formData,
        ...cleaned,
        dateSubmitted: formData.dateSubmitted || new Date().toISOString().split('T')[0]
      } as Furniture);
      triggerAlert("Furniture record updated successfully", "success");
    } else {
      addItem({
        ...cleaned,
        id: `FN-${Date.now().toString(36).slice(-4)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        dateSubmitted: new Date().toISOString().split('T')[0]
      } as Furniture);
      triggerAlert("New furniture record saved", "success");
    }
    
    // Reset after submit
    clearForm();
  };

  const exportSummary = () => {
    if (items.length === 0) {
      triggerAlert("No records to export", "error");
      return;
    }
    const headers = [
      "Entry ID", "Date Submitted", 
      "Desk 1 Pupil", "Desk 2 Pupils", "Desk 3+ Pupils", "Pupils Tables", "Pupils Chairs",
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
    triggerAlert("Export downloaded successfully", "success");
  };

  const loadRecord = (record: Furniture) => {
    setFormData(record);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    triggerAlert("Record loaded for editing", "success");
  };

  // Sorting and Filtering
  const filteredData = useMemo(() => {
    let result = [...items];
    
    if (searchQuery) {
      result = result.filter(item => 
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.dateSubmitted.includes(searchQuery)
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

  const requestSort = (key: keyof Furniture) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="space-y-6">
      {/* Alert */}
      {alert && (
        <div className={`p-4 rounded border flex items-center gap-3 text-sm font-medium ${
          alert.type === "success" ? "bg-sea/10 border-sea text-sea" : "bg-golden/10 border-golden text-golden"
        }`}>
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{alert.message}</span>
        </div>
      )}

      {/* Header section */}
      <div>
        <h1 className="text-2xl font-black text-prussian dark:text-white uppercase tracking-tight">
          FURNITURE DATA CAPTURE FORM
        </h1>
        <p className="text-sm font-semibold text-slate-500 mt-1">
          Collect quantities for classroom furniture
        </p>
      </div>

      {/* 4 Summary Cards (from form state) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center gap-4 border-l-4 border-l-blue-600">
           <div className="p-3 bg-blue-50 dark:bg-blue-900/40 rounded-lg text-blue-600 dark:text-blue-400">
             <Layers className="w-6 h-6" />
           </div>
           <div>
             <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">TOTAL FURNITURE</p>
             <p className="text-3xl font-mono font-bold text-slate-800 dark:text-slate-100">{formDataTotal}</p>
           </div>
        </div>
        <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center gap-4 border-l-4 border-l-emerald-600">
           <div className="p-3 bg-emerald-50 dark:bg-emerald-900/40 rounded-lg text-emerald-600 dark:text-emerald-400">
             <GraduationCap className="w-6 h-6" />
           </div>
           <div>
             <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">STUDENT FURNITURE</p>
             <p className="text-3xl font-mono font-bold text-slate-800 dark:text-slate-100">{formDataStudent}</p>
           </div>
        </div>
        <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center gap-4 border-l-4 border-l-amber-500">
           <div className="p-3 bg-amber-50 dark:bg-amber-900/40 rounded-lg text-amber-600 dark:text-amber-500">
             <Users className="w-6 h-6" />
           </div>
           <div>
             <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">STAFF FURNITURE</p>
             <p className="text-3xl font-mono font-bold text-slate-800 dark:text-slate-100">{formDataStaff}</p>
           </div>
        </div>
        <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center gap-4 border-l-4 border-l-purple-500">
           <div className="p-3 bg-purple-50 dark:bg-purple-900/40 rounded-lg text-purple-600 dark:text-purple-400">
             <MonitorPlay className="w-6 h-6" />
           </div>
           <div>
             <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">TEACHING AIDS</p>
             <p className="text-3xl font-mono font-bold text-slate-800 dark:text-slate-100">{formDataTeachingAids}</p>
           </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-2">
        <div className="flex-1 h-1 bg-slate-100 dark:bg-slate-800 rounded overflow-hidden">
          <div className="h-full bg-blue-500 transition-all" style={{ width: `${(nonZeroFieldsCount / 12) * 100}%`}}></div>
        </div>
        <span className="text-xs font-bold text-slate-500">{nonZeroFieldsCount} of 12 fields completed</span>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            
            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-5 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
              <h3 className="font-black uppercase tracking-wider text-sm text-emerald-700 dark:text-emerald-400 mb-4 flex items-center justify-between">
                Student Furniture
                <span className="bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded text-xs">Total: {formDataStudent}</span>
              </h3>
              
              <div className="space-y-4">
                {[
                  { key: "desk1", label: "Desk Sitting 1 Pupil" },
                  { key: "desk2", label: "Desk Sitting 2 Pupils" },
                  { key: "desk3", label: "Desk Sitting 3+ Pupils" },
                  { key: "pupilsTables", label: "Pupils' Tables" },
                  { key: "pupilsChairs", label: "Pupils' Chairs" }
                ].map(field => (
                  <div key={field.key} className="flex justify-between items-center gap-4">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex-1">{field.label}</label>
                    <input 
                      type="number" min="0" 
                      value={formData[field.key as keyof Furniture]} 
                      onChange={(e) => handleInputChange(field.key as keyof Furniture, e.target.value)}
                      className={`w-24 text-center font-mono p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:bg-slate-900 ${
                        (formData[field.key as keyof Furniture] as number) === 0 ? "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/30 dark:border-amber-900/50 dark:text-amber-400" : "border-slate-300 dark:border-slate-700"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50/50 dark:bg-amber-950/20 p-5 rounded-xl border border-amber-100 dark:border-amber-900/50">
              <h3 className="font-black uppercase tracking-wider text-sm text-amber-700 dark:text-amber-500 mb-4 flex items-center justify-between">
                Staff Furniture
                <span className="bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded text-xs">Total Pt.1</span>
              </h3>
              
              <div className="space-y-4">
                  <div className="flex justify-between items-center gap-4">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex-1">Teachers&apos; Tables</label>
                    <input 
                      type="number" min="0" 
                      value={formData.teachersTables} 
                      onChange={(e) => handleInputChange("teachersTables", e.target.value)}
                      className={`w-24 text-center font-mono p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all dark:bg-slate-900 ${
                        formData.teachersTables === 0 ? "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/30 dark:border-amber-900/50 dark:text-amber-400" : "border-slate-300 dark:border-slate-700"
                      }`}
                    />
                  </div>
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-6">

            <div className="bg-amber-50/50 dark:bg-amber-950/20 p-5 rounded-xl border border-amber-100 dark:border-amber-900/50">
              <h3 className="font-black uppercase tracking-wider text-sm text-amber-700 dark:text-amber-500 mb-4 flex items-center justify-between">
                Staff Furniture (Continued)
                <span className="bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded text-xs">Total: {formDataStaff}</span>
              </h3>
              
              <div className="space-y-4">
                  <div className="flex justify-between items-center gap-4">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex-1">Teachers&apos; Chairs</label>
                    <input 
                      type="number" min="0" 
                      value={formData.teachersChairs} 
                      onChange={(e) => handleInputChange("teachersChairs", e.target.value)}
                      className={`w-24 text-center font-mono p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all dark:bg-slate-900 ${
                        formData.teachersChairs === 0 ? "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/30 dark:border-amber-900/50 dark:text-amber-400" : "border-slate-300 dark:border-slate-700"
                      }`}
                    />
                  </div>
              </div>
            </div>

            <div className="bg-blue-50/50 dark:bg-blue-950/20 p-5 rounded-xl border border-blue-100 dark:border-blue-900/50">
              <h3 className="font-black uppercase tracking-wider text-sm text-blue-700 dark:text-blue-400 mb-4 flex items-center justify-between">
                Storage
                <span className="bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 rounded text-xs">Total: {formDataStorage}</span>
              </h3>
              
              <div className="space-y-4">
                  <div className="flex justify-between items-center gap-4">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex-1">Cupboards / Lockers</label>
                    <input 
                      type="number" min="0" 
                      value={formData.cupboardsLockers} 
                      onChange={(e) => handleInputChange("cupboardsLockers", e.target.value)}
                      className={`w-24 text-center font-mono p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:bg-slate-900 ${
                        formData.cupboardsLockers === 0 ? "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/30 dark:border-amber-900/50 dark:text-amber-400" : "border-slate-300 dark:border-slate-700"
                      }`}
                    />
                  </div>
              </div>
            </div>

            <div className="bg-purple-50/50 dark:bg-purple-950/20 p-5 rounded-xl border border-purple-100 dark:border-purple-900/50">
              <h3 className="font-black uppercase tracking-wider text-sm text-purple-700 dark:text-purple-400 mb-4 flex items-center justify-between">
                Teaching Aids
                <span className="bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 rounded text-xs">Total: {formDataTeachingAids}</span>
              </h3>
              
              <div className="space-y-4">
                {[
                  { key: "fixedChalkBoard", label: "Fixed Chalk Board" },
                  { key: "whiteBoards", label: "White Boards" },
                  { key: "movableChalkBoard", label: "Movable Chalk Board" },
                  { key: "smartboards", label: "Smartboards" }
                ].map(field => (
                  <div key={field.key} className="flex justify-between items-center gap-4">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex-1">{field.label}</label>
                    <input 
                      type="number" min="0" 
                      value={formData[field.key as keyof Furniture]} 
                      onChange={(e) => handleInputChange(field.key as keyof Furniture, e.target.value)}
                      className={`w-24 text-center font-mono p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all dark:bg-slate-900 ${
                        (formData[field.key as keyof Furniture] as number) === 0 ? "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/30 dark:border-amber-900/50 dark:text-amber-400" : "border-slate-300 dark:border-slate-700"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
          <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow flex items-center gap-2 transition-all">
            <Save className="w-5 h-5" />
            Save Furniture Records
          </button>
          
          <button type="button" onClick={clearForm} className="px-6 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg transition-all flex items-center gap-2">
            <RotateCcw className="w-5 h-5" />
            Clear Form
          </button>
          
          <button type="button" onClick={exportSummary} className="px-6 py-2.5 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 font-bold rounded-lg transition-all flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Summary
          </button>
          
          <button type="button" onClick={setAllZeroes} className="px-6 py-2.5 text-blue-600 dark:text-blue-400 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 font-bold rounded-lg transition-all flex items-center gap-2 ml-auto">
            Fill Empty Fields with 0
          </button>
        </div>
      </form>

      {/* Extrapolated Registry Table */}
      <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden mt-8">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Box className="w-5 h-5 text-blue-500" />
            Saved Furniture Records
          </h2>
          <div className="flex gap-2 relative">
             <input 
               type="text" 
               placeholder="Search by ID or Date..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="p-2 border rounded-lg text-sm outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700" 
             />
          </div>
        </div>
        
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[max-content]">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/30 text-[10px] uppercase font-black tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <th className="p-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => requestSort("id")}>Entry ID {sortConfig.key === "id" && (sortConfig.direction === "asc" ? "↑" : "↓")}</th>
                <th className="p-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => requestSort("dateSubmitted")}>Date Submitted {sortConfig.key === "dateSubmitted" && (sortConfig.direction === "asc" ? "↑" : "↓")}</th>
                <th className="p-3 text-center border-l border-slate-100 dark:border-slate-800" title="Desk Sitting 1 Pupil">Desk 1</th>
                <th className="p-3 text-center" title="Desk Sitting 2 Pupils">Desk 2</th>
                <th className="p-3 text-center" title="Desk Sitting 3+ Pupils">Desk 3+</th>
                <th className="p-3 text-center" title="Pupils' Tables">P. Tables</th>
                <th className="p-3 text-center" title="Pupils' Chairs">P. Chairs</th>
                <th className="p-3 text-center border-l border-slate-100 dark:border-slate-800" title="Cupboards / Lockers">Cupboards</th>
                <th className="p-3 text-center border-l border-slate-100 dark:border-slate-800" title="Teachers' Tables">T. Tables</th>
                <th className="p-3 text-center" title="Teachers' Chairs">T. Chairs</th>
                <th className="p-3 text-center border-l border-slate-100 dark:border-slate-800" title="Fixed Chalk Board">Fixed B.</th>
                <th className="p-3 text-center" title="White Boards">White B.</th>
                <th className="p-3 text-center" title="Movable Chalk Board">Mov. B.</th>
                <th className="p-3 text-center" title="Smartboards">Smart B.</th>
                <th className="p-3 text-center bg-blue-50/50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400">Total Items</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? filteredData.map(fn => (
                <tr key={fn.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group cursor-pointer" onClick={() => loadRecord(fn)}>
                  <td className="p-3 font-mono text-xs font-bold text-slate-700 dark:text-slate-300">{fn.id}</td>
                  <td className="p-3 font-mono text-xs text-slate-500">{fn.dateSubmitted}</td>
                  <td className="p-3 text-center font-mono text-xs border-l border-slate-100/50 dark:border-slate-800/50">{fn.desk1}</td>
                  <td className="p-3 text-center font-mono text-xs">{fn.desk2}</td>
                  <td className="p-3 text-center font-mono text-xs">{fn.desk3}</td>
                  <td className="p-3 text-center font-mono text-xs">{fn.pupilsTables}</td>
                  <td className="p-3 text-center font-mono text-xs">{fn.pupilsChairs}</td>
                  <td className="p-3 text-center font-mono text-xs border-l border-slate-100/50 dark:border-slate-800/50">{fn.cupboardsLockers}</td>
                  <td className="p-3 text-center font-mono text-xs border-l border-slate-100/50 dark:border-slate-800/50">{fn.teachersTables}</td>
                  <td className="p-3 text-center font-mono text-xs">{fn.teachersChairs}</td>
                  <td className="p-3 text-center font-mono text-xs border-l border-slate-100/50 dark:border-slate-800/50">{fn.fixedChalkBoard}</td>
                  <td className="p-3 text-center font-mono text-xs">{fn.whiteBoards}</td>
                  <td className="p-3 text-center font-mono text-xs">{fn.movableChalkBoard}</td>
                  <td className="p-3 text-center font-mono text-xs">{fn.smartboards}</td>
                  <td className="p-3 text-center font-mono text-xs font-black bg-blue-50/30 dark:bg-blue-900/5 text-blue-600 dark:text-blue-400">{calcTotal(fn)}</td>
                  <td className="p-3">
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        if (window.confirm("Are you sure you want to delete this furniture record?")) {
                          deleteItem(fn.id); 
                          triggerAlert("Record deleted", "success"); 
                        }
                      }}
                      className="text-[10px] text-red-500 hover:text-red-700 font-bold uppercase tracking-wider px-2 py-1 bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                   <td colSpan={16} className="p-8 text-center text-slate-500 font-semibold">No records found. Fill the form to create a new one.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FurnitureRegistry;
