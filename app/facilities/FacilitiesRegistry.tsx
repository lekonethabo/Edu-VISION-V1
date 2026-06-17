"use client";

import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { 
  Save, Eraser, Download,
  Search, ChevronLeft, ChevronRight,
  AlertTriangle, CheckCircle2,
  Trash2, Hammer
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type FormState = Record<string, number>;

interface FacilityRecord {
  id: string; // Entry ID
  dateSubmitted: string;
  items: Record<string, number>;
  otherSpecifyText: string;
  totalQuantity: number;
}

const CATEGORIES = [
  {
    id: "cat_1",
    title: "Section 1: Learning Spaces",
    accent: "bg-sea",
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
    accent: "bg-golden",
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
    accent: "bg-prussian",
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
    accent: "bg-sea",
    items: [
      { id: "handRails", label: "Hand Rails" },
      { id: "noticeBoards", label: "Notice Boards" },
      { id: "ramps", label: "Ramps" },
      { id: "schoolGarden", label: "School Garden" },
    ]
  },
  {
    id: "cat_5",
    title: "Section 5: Administration & Staff",
    accent: "bg-golden",
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
    accent: "bg-prussian",
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
  } = useLocalStorage<FacilityRecord>("facilities_registry_data", []);

  const [formState, setFormState] = useState<FormState>(getInitialFormState());
  const [otherSpecifyText, setOtherSpecifyText] = useState("");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const [alert, setAlert] = useState<{ message: string; type: "success" | "warning" } | null>(null);

  const triggerAlert = (message: string, type: "success" | "warning") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const { totalFacilities, countLearning, countSanitation, countAccessibility } = useMemo(() => {
    let learning = 0;
    let sanitation = 0;
    let access = 0;
    let total = 0;

    CATEGORIES[0].items.forEach(item => { learning += formState[item.id] || 0; });
    
    // Sanitary section is cat_3
    CATEGORIES[2].items.forEach(item => { 
        if (item.id.includes("pit") || item.id.includes("flush") || item.id.includes("toilets")) {
            sanitation += formState[item.id] || 0; 
        }
    });

    // Accessibility features: classroomsWc, labsWc, hallsWc, toiletsWc, ramps, handRails, etc.
    // Generally Section 4 handles main accessibility and those with "Wc"
    CATEGORIES.forEach(cat => {
        cat.items.forEach(item => {
            if (item.id.includes("Wc") || item.id === "ramps" || item.id === "handRails") {
                access += formState[item.id] || 0;
            }
        });
    });

    total = Object.values(formState).reduce((acc, curr) => acc + (curr || 0), 0);

    return { totalFacilities: total, countLearning: learning, countSanitation: sanitation, countAccessibility: access };
  }, [formState]);

  const handleInputChange = (id: string, value: number) => {
    setFormState(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    const dateSubmitted = format(new Date(), "yyyy-MM-dd HH:mm");
    
    if (totalFacilities === 0) {
      triggerAlert("No facilities entered to save.", "warning");
      return;
    }

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
    triggerAlert("Successfully saved facility records.", "success");
    setCurrentPage(1);
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear all form fields?")) {
      setFormState(getInitialFormState());
      setOtherSpecifyText("");
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
            <Hammer className="w-6 h-6 text-sea" />
            Facilities
          </h1>
          <p className="text-snow/80 text-sm mt-1 font-medium max-w-xl">
            Register all standard educational structural buildings and spaces on campus.
          </p>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#001020] border border-prussian dark:border-slate-700 rounded-xl p-5 shadow-sm">
           <span className="text-xs font-bold text-prussian dark:text-white uppercase tracking-widest block mb-1">Total Facilities</span>
           <span className="text-3xl font-black text-prussian dark:text-white font-mono">{totalFacilities}</span>
        </div>
        <div className="bg-white dark:bg-[#001020] border border-prussian dark:border-slate-700 rounded-xl p-5 shadow-sm">
           <span className="text-xs font-bold text-prussian dark:text-white uppercase tracking-widest block mb-1">Learning Spaces</span>
           <span className="text-3xl font-black text-prussian dark:text-white font-mono">{countLearning}</span>
        </div>
        <div className="bg-white dark:bg-[#001020] border border-prussian dark:border-slate-700 rounded-xl p-5 shadow-sm">
           <span className="text-xs font-bold text-prussian dark:text-white uppercase tracking-widest block mb-1">Sanitation</span>
           <span className="text-3xl font-black text-prussian dark:text-white font-mono">{countSanitation}</span>
        </div>
        <div className="bg-white dark:bg-[#001020] border border-prussian dark:border-slate-700 rounded-xl p-5 shadow-sm">
           <span className="text-xs font-bold text-prussian dark:text-white uppercase tracking-widest block mb-1">Accessibility Features</span>
           <span className="text-3xl font-black text-prussian dark:text-white font-mono">{countAccessibility}</span>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {category.items.map(item => (
                  <div 
                    key={item.id} 
                    className="flex flex-col md:flex-row md:items-center bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm transition-all hover:border-prussian dark:border-slate-700 group gap-4 justify-between"
                  >
                    <div className="flex-1 space-y-2">
                      <span className="text-sm font-bold text-prussian dark:text-white block">{item.label}</span>
                      {("isOther" in item && item.isOther) && (
                        <input
                          type="text"
                          placeholder="Specify facility..."
                          value={otherSpecifyText}
                          onChange={(e) => setOtherSpecifyText(e.target.value)}
                          className="w-full px-3 py-1.5 text-sm border border-slate-200 dark:border-slate-800 rounded-lg focus:border-sea focus:outline-none transition-colors"
                        />
                      )}
                    </div>
                    
                    <div className="bg-snow dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-center min-w-[100px]">
                      <input 
                        type="number" min="0" 
                        value={formState[item.id]?.toString() || "0"}
                        onChange={(e) => handleInputChange(item.id, parseInt(e.target.value) || 0)}
                        className="w-full max-w-[80px] px-2 py-1 text-center text-xl font-bold border-b-2 border-prussian dark:border-slate-700 bg-white dark:bg-[#001020] focus:border-sea focus:outline-none transition-colors"
                        onFocus={e => e.target.select()}
                      />
                    </div>
                  </div>
                ))}
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
             <Save className="w-4 h-4" /> Save Facilities Records
           </button>
        </div>
      </div>

      {/* Data Table Section */}
      <div className="pt-8">
        <div className="flex flex-col gap-1 mb-4">
          <h3 className="text-lg font-black text-prussian dark:text-white uppercase tracking-tight">Saved Facilities Records</h3>
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
                   <th className="px-4 py-3 font-bold text-center">Classrooms</th>
                   <th className="px-4 py-3 font-bold text-center">Labs</th>
                   <th className="px-4 py-3 font-bold text-center">Library</th>
                   <th className="px-4 py-3 font-bold text-center">Halls</th>
                   <th className="px-4 py-3 font-bold text-center">Toilets</th>
                   <th className="px-4 py-3 font-bold text-center">Ramps</th>
                   <th className="px-4 py-3 font-bold text-center">Staff Houses</th>
                   <th className="px-4 py-3 font-bold text-center">Total</th>
                   <th className="px-4 py-3 text-center font-bold">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-prussian/10 text-ink dark:text-slate-300">
                 {paginatedRecords.length > 0 ? paginatedRecords.map((rec, i) => {
                   
                   const classRooms = (rec.items.classrooms || 0) + (rec.items.classroomsWc || 0) + (rec.items.spedUnits || 0);
                   const labs = (rec.items.agricLabs || 0) + (rec.items.scienceLabs || 0) + (rec.items.homeEcLabs || 0) + (rec.items.artLabs || 0) + (rec.items.dtLabs || 0) + (rec.items.computerLabs || 0) + (rec.items.labsWc || 0);
                   const library = rec.items.library || 0;
                   const halls = (rec.items.multipurposeHall || 0) + (rec.items.assemblyHall || 0) + (rec.items.diningHall || 0) + (rec.items.hallsWc || 0);
                   const toilets = (rec.items.pitBoys || 0) + (rec.items.pitGirls || 0) + (rec.items.flushBoys || 0) + (rec.items.flushGirls || 0) + (rec.items.toiletsPwd || 0) + (rec.items.toiletsWc || 0) + (rec.items.toiletsTeachers || 0) + (rec.items.toiletsTeachersPwd || 0) + (rec.items.toiletsTeachersWc || 0);
                   const ramps = rec.items.ramps || 0;
                   const staffHouses = (rec.items.staffHouse1 || 0) + (rec.items.staffHouse2 || 0) + (rec.items.staffHouse3 || 0) + (rec.items.staffHouse4 || 0);

                   return (
                   <tr key={rec.id} className={`${i % 2 === 0 ? 'bg-white dark:bg-[#001020]' : 'bg-snow dark:bg-slate-900'}`}>
                     <td className="px-4 py-3 font-mono text-xs font-bold">{rec.id}</td>
                     <td className="px-4 py-3 text-xs text-ink dark:text-slate-300/70">{rec.dateSubmitted}</td>
                     <td className="px-4 py-3 text-center text-xs font-mono">{classRooms}</td>
                     <td className="px-4 py-3 text-center text-xs font-mono">{labs}</td>
                     <td className="px-4 py-3 text-center text-xs font-mono">{library}</td>
                     <td className="px-4 py-3 text-center text-xs font-mono">{halls}</td>
                     <td className="px-4 py-3 text-center text-xs font-mono">{toilets}</td>
                     <td className="px-4 py-3 text-center text-xs font-mono">{ramps}</td>
                     <td className="px-4 py-3 text-center text-xs font-mono">{staffHouses}</td>
                     <td className="px-4 py-3 text-center font-mono font-bold text-prussian dark:text-white">{rec.totalQuantity}</td>
                     <td className="px-4 py-3 text-center">
                       <div className="flex items-center justify-center gap-2">
                          <button onClick={() => deleteItem(rec.id)} className="text-rose-400 hover:text-rose-600 p-1" title="Delete"><Trash2 className="w-4 h-4" /></button>
                       </div>
                     </td>
                   </tr>
                 )
                }) : (
                   <tr>
                     <td colSpan={11} className="px-4 py-8 text-center text-ink dark:text-slate-300/50 text-sm">
                        No facilities records found.
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

export default FacilitiesRegistry;
