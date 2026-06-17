"use client";

import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { 
  Save, Eraser, Download, Printer, FileText, 
  Search, ChevronLeft, ChevronRight,
  AlertTriangle, CheckCircle2, History,
  Trash2, View, Home
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

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
    accent: "bg-sea",
    items: [
      { id: "hostels", label: "Hostels" },
      { id: "domRooms", label: "Dom Rooms" },
      { id: "beds", label: "Beds" },
    ]
  },
  {
    id: "cat_2",
    title: "Group 2: Sanitation",
    accent: "bg-golden",
    items: [
      { id: "flushToilets", label: "Flush Toilets" },
      { id: "pitLatrines", label: "Pit Latrines" },
      { id: "toiletsPwd", label: "Toilet for Disabilities" },
    ]
  },
  {
    id: "cat_3",
    title: "Group 3: Hygiene Facilities",
    accent: "bg-prussian",
    items: [
      { id: "showers", label: "Showers" },
      { id: "washingBasins", label: "Washing Basins" },
      { id: "washingTroughs", label: "Washing Troughs" },
    ]
  },
  {
    id: "cat_4",
    title: "Group 4: Utilities & Accessibility",
    accent: "bg-sea",
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
    deleteItem,
  } = useLocalStorage<BoardingRecord>("boarding_registry_data", []);

  const [formState, setFormState] = useState<FormState>(getInitialFormState());
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const [alert, setAlert] = useState<{ message: string; type: "success" | "warning" } | null>(null);

  const triggerAlert = (message: string, type: "success" | "warning") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const { summaryMale, summaryFemale, summaryTotal, summaryRatio } = useMemo(() => {
    let male = 0;
    let female = 0;
    Object.values(formState).forEach(val => {
      male += (val.male || 0);
      female += (val.female || 0);
    });
    const total = male + female;
    
    // Simplest ratio calculation format M:F
    let ratioStr = "0:0";
    if (male > 0 && female === 0) ratioStr = "1:0";
    else if (male === 0 && female > 0) ratioStr = "0:1";
    else if (male > 0 && female > 0) {
      // Find Greatest Common Divisor
      const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
      const div = gcd(male, female);
      ratioStr = `${male / div}:${female / div}`;
      // formatting slightly better for huge numbers
      if (male / div > 20 || female / div > 20) {
         ratioStr = `${Math.round((male/female)*10)/10}:1`;
      }
    }

    return { summaryMale: male, summaryFemale: female, summaryTotal: total, summaryRatio: ratioStr };
  }, [formState]);

  const handleInputChange = (id: string, field: keyof BoardingState, value: any) => {
    setFormState(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    const dateSubmitted = format(new Date(), "yyyy-MM-dd HH:mm");
    
    // Check if at least one field is filled
    const hasData = Object.values(formState).some(val => val.male > 0 || val.female > 0);
    if (!hasData) {
      triggerAlert("No boarding facilities entered to save.", "warning");
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
    triggerAlert("Successfully saved boarding facility records.", "success");
    setCurrentPage(1);
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear all form fields?")) {
      setFormState(getInitialFormState());
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
    <div className="space-y-6 max-w-7xl mx-auto px-2 pb-16">
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
            <Home className="w-6 h-6 text-sea" />
            Boarding Facilities
          </h1>
          <p className="text-snow/80 text-sm mt-1 font-medium max-w-xl">
            Register all accommodation, sanitation, and hygiene facilities currently at the institution.
          </p>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#001020] border border-prussian dark:border-slate-700 rounded-xl p-5 shadow-sm">
           <span className="text-xs font-bold text-prussian dark:text-white uppercase tracking-widest block mb-1">Total Male</span>
           <span className="text-3xl font-black text-prussian dark:text-white font-mono">{summaryMale}</span>
        </div>
        <div className="bg-white dark:bg-[#001020] border border-prussian dark:border-slate-700 rounded-xl p-5 shadow-sm">
           <span className="text-xs font-bold text-prussian dark:text-white uppercase tracking-widest block mb-1">Total Female</span>
           <span className="text-3xl font-black text-prussian dark:text-white font-mono">{summaryFemale}</span>
        </div>
        <div className="bg-white dark:bg-[#001020] border border-prussian dark:border-slate-700 rounded-xl p-5 shadow-sm">
           <span className="text-xs font-bold text-prussian dark:text-white uppercase tracking-widest block mb-1">Total Facilities</span>
           <span className="text-3xl font-black text-prussian dark:text-white font-mono">{summaryTotal}</span>
        </div>
        <div className="bg-white dark:bg-[#001020] border border-prussian dark:border-slate-700 rounded-xl p-5 shadow-sm">
           <span className="text-xs font-bold text-prussian dark:text-white uppercase tracking-widest block mb-1">Male:Female Ratio</span>
           <span className="text-3xl font-black text-prussian dark:text-white font-mono">{summaryRatio}</span>
        </div>
      </div>

      {/* Main Categories Form */}
      <div className="space-y-8">
        {CATEGORIES.map(category => (
          <div key={category.id} className="bg-white dark:bg-[#001020] border border-prussian dark:border-slate-700 shadow-sm rounded-xl overflow-hidden">
            {/* Sec Header */}
            <div className={`p-4 ${category.accent} text-snow flex items-center gap-3`}>
              <h2 className="font-black uppercase tracking-wider text-sm">{category.title}</h2>
            </div>

            {/* List Body */}
            <div className="p-5 md:p-6 bg-snow dark:bg-slate-900">
              <div className="grid grid-cols-1 gap-5">
                {category.items.map(item => {
                  const s = formState[item.id];
                  return (
                    <div 
                      key={item.id} 
                      className="flex flex-col md:flex-row md:items-center bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm transition-all hover:border-prussian dark:border-slate-700 group gap-4"
                    >
                      <div className="flex-1">
                        <span className="text-sm font-bold text-prussian dark:text-white block">{item.label}</span>
                      </div>
                      
                      <div className="flex gap-4 md:w-1/2">
                        <div className="bg-snow dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800 flex-1 flex flex-col items-center justify-center">
                          <label className="text-[10px] font-bold text-prussian dark:text-white uppercase tracking-wider mb-1">
                            Male
                          </label>
                          <input 
                            type="number" min="0" 
                            value={s.male?.toString() || "0"}
                            onChange={(e) => handleInputChange(item.id, "male", parseInt(e.target.value) || 0)}
                            className="w-full max-w-[80px] px-2 py-1 text-center text-sm font-bold border-b-2 border-prussian dark:border-slate-700 bg-white dark:bg-[#001020] focus:border-sea focus:outline-none transition-colors"
                            onFocus={e => e.target.select()}
                          />
                        </div>
                        <div className="bg-snow dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800 flex-1 flex flex-col items-center justify-center">
                          <label className="text-[10px] font-bold text-prussian dark:text-white uppercase tracking-wider mb-1">
                            Female
                          </label>
                          <input 
                            type="number" min="0" 
                            value={s.female?.toString() || "0"}
                            onChange={(e) => handleInputChange(item.id, "female", parseInt(e.target.value) || 0)}
                            className="w-full max-w-[80px] px-2 py-1 text-center text-sm font-bold border-b-2 border-prussian dark:border-slate-700 bg-white dark:bg-[#001020] focus:border-sea focus:outline-none transition-colors"
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
        ))}
      </div>

      {/* Main Actions Panel */}
      <div className="flex flex-col sm:flex-row justify-end items-center bg-white dark:bg-[#001020] border border-prussian dark:border-slate-700 rounded-xl p-4 shadow-sm gap-4">
        <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full sm:w-auto justify-end">
           <button onClick={handleClear} className="w-full sm:w-auto px-5 py-2.5 bg-golden text-snow rounded-xl text-xs font-bold uppercase tracking-wider transition-colors hover:bg-prussian flex items-center justify-center gap-2 shadow-sm">
             <Eraser className="w-4 h-4" /> Clear Form
           </button>
           <button className="w-full sm:w-auto px-5 py-2.5 bg-sea text-snow rounded-xl text-xs font-bold uppercase tracking-wider transition-colors hover:bg-prussian flex items-center justify-center gap-2 shadow-sm">
             <Download className="w-4 h-4" /> Export CSV
           </button>
           <button onClick={handleSave} className="w-full sm:w-auto px-6 py-2.5 bg-prussian text-snow rounded-xl text-xs font-bold uppercase tracking-wider transition-colors hover:bg-sea flex items-center justify-center gap-2 shadow-md">
             <Save className="w-4 h-4" /> Save Records
           </button>
        </div>
      </div>

      {/* Data Table Section */}
      <div className="pt-8">
        <div className="flex flex-col gap-1 mb-4">
          <h3 className="text-lg font-black text-prussian dark:text-white uppercase tracking-tight">Saved Boarding Records</h3>
        </div>
        
        <div className="bg-white dark:bg-[#001020] border border-prussian dark:border-slate-700 shadow-sm rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-prussian dark:border-slate-700/10 bg-snow dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <div className="relative max-w-sm w-full">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink dark:text-slate-300/40" />
               <input 
                 type="text" 
                 placeholder="Search entries..." 
                 value={searchQuery}
                 onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                 className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-[#001020] border border-prussian dark:border-slate-700/20 rounded-lg focus:border-sea focus:outline-none transition-colors"
               />
             </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
               <thead>
                 <tr className="bg-prussian text-snow text-[10px] uppercase tracking-wider">
                   <th className="px-4 py-3 font-bold">Entry ID</th>
                   <th className="px-4 py-3 font-bold">Date</th>
                   <th className="px-4 py-3 font-bold text-center">Hostels</th>
                   <th className="px-4 py-3 font-bold text-center">Dom Rooms</th>
                   <th className="px-4 py-3 font-bold text-center">Beds</th>
                   <th className="px-4 py-3 font-bold text-center">Flush Toilets</th>
                   <th className="px-4 py-3 font-bold text-center">Pit Latrines</th>
                   <th className="px-4 py-3 font-bold text-center">Pwd Toilets</th>
                   <th className="px-4 py-3 font-bold text-center">Showers</th>
                   <th className="px-4 py-3 font-bold text-center">Total</th>
                   <th className="px-4 py-3 text-center font-bold">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-prussian/10 text-ink dark:text-slate-300">
                 {paginatedRecords.length > 0 ? paginatedRecords.map((rec, i) => (
                   <tr key={rec.id} className={`${i % 2 === 0 ? 'bg-white dark:bg-[#001020]' : 'bg-snow dark:bg-slate-900'}`}>
                     <td className="px-4 py-3 font-mono text-xs font-bold">{rec.id}</td>
                     <td className="px-4 py-3 text-xs text-ink dark:text-slate-300/70">{rec.dateSubmitted}</td>
                     <td className="px-4 py-3 text-center text-xs font-mono">{rec.hostels?.male || 0}/{rec.hostels?.female || 0}</td>
                     <td className="px-4 py-3 text-center text-xs font-mono">{rec.domRooms?.male || 0}/{rec.domRooms?.female || 0}</td>
                     <td className="px-4 py-3 text-center text-xs font-mono">{rec.beds?.male || 0}/{rec.beds?.female || 0}</td>
                     <td className="px-4 py-3 text-center text-xs font-mono">{rec.flushToilets?.male || 0}/{rec.flushToilets?.female || 0}</td>
                     <td className="px-4 py-3 text-center text-xs font-mono">{rec.pitLatrines?.male || 0}/{rec.pitLatrines?.female || 0}</td>
                     <td className="px-4 py-3 text-center text-xs font-mono">{rec.toiletsPwd?.male || 0}/{rec.toiletsPwd?.female || 0}</td>
                     <td className="px-4 py-3 text-center text-xs font-mono">{rec.showers?.male || 0}/{rec.showers?.female || 0}</td>
                     <td className="px-4 py-3 text-center font-mono font-bold text-prussian dark:text-white">{rec.total}</td>
                     <td className="px-4 py-3 text-center">
                       <div className="flex items-center justify-center gap-2">
                          <button onClick={() => deleteItem(rec.id)} className="text-rose-400 hover:text-rose-600 p-1" title="Delete"><Trash2 className="w-4 h-4" /></button>
                       </div>
                     </td>
                   </tr>
                 )) : (
                   <tr>
                     <td colSpan={11} className="px-4 py-8 text-center text-ink dark:text-slate-300/50 text-sm">
                        No boarding records found.
                     </td>
                   </tr>
                 )}
               </tbody>
            </table>
          </div>
          
          {totalPages > 1 && (
            <div className="px-5 py-3 bg-snow dark:bg-slate-900 border-t border-prussian dark:border-slate-700/10 flex items-center justify-between">
              <span className="text-xs text-ink dark:text-slate-300/60 font-medium">Page {currentPage} of {totalPages}</span>
              <div className="flex items-center gap-1">
                 <button 
                   disabled={currentPage === 1}
                   onClick={() => setCurrentPage(p => p - 1)}
                   className="p-1.5 rounded bg-white dark:bg-[#001020] text-prussian dark:text-white border border-slate-200 dark:border-slate-800 hover:border-prussian dark:border-slate-700 disabled:opacity-50 transition-colors"
                 >
                   <ChevronLeft className="w-4 h-4" />
                 </button>
                 <button 
                   disabled={currentPage === totalPages}
                   onClick={() => setCurrentPage(p => p + 1)}
                   className="p-1.5 rounded bg-white dark:bg-[#001020] text-prussian dark:text-white border border-slate-200 dark:border-slate-800 hover:border-prussian dark:border-slate-700 disabled:opacity-50 transition-colors"
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

export default BoardingFacilitiesRegistry;
