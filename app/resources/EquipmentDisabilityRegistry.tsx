"use client";

import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { 
  Save, Eraser, Download,
  Search, ChevronLeft, ChevronRight,
  AlertTriangle, CheckCircle2,
  Trash2, Accessibility
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

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
    accent: "bg-sea",
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
    accent: "bg-prussian",
    items: [
      { id: "computersPupils", label: "Computers for Pupils" },
      { id: "computerScreens", label: "Computer Screens" },
      { id: "hearingLoop", label: "Hearing Loop" },
    ]
  },
  {
    id: "cat_3",
    title: "Group 3: Furniture & Assistive Devices",
    accent: "bg-golden",
    items: [
      { id: "modifiedDesks", label: "Suitably Modified Desks" },
      { id: "modifiedChairs", label: "Suitably Modified Chairs" },
      { id: "grippingDevices", label: "Assistive Devices for Gripping (e.g. Pens)" },
      { id: "hearingAids", label: "Hearing Aids" },
    ]
  },
  {
    id: "cat_4",
    title: "Group 4: Other Equipment",
    accent: "bg-sea",
    items: [
      { id: "other", label: "Other (Specify)", isOther: true },
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
    deleteItem,
  } = useLocalStorage<EquipmentRecord>("equipment_disability_data", []);

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
    setFormState(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    const dateSubmitted = format(new Date(), "yyyy-MM-dd HH:mm");
    
    if (totalItems === 0) {
      triggerAlert("No equipment items entered to save.", "warning");
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
    triggerAlert("Successfully saved disability equipment records.", "success");
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
            <Accessibility className="w-6 h-6 text-sea" />
            Equipment for Disability
          </h1>
          <p className="text-snow/80 text-sm mt-1 font-medium max-w-xl">
            Register assistive equipment and devices supporting students with disabilities.
          </p>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#001020] border border-prussian dark:border-slate-700 rounded-xl p-5 shadow-sm">
           <span className="text-xs font-bold text-prussian dark:text-white uppercase tracking-widest block mb-1">Total Items</span>
           <span className="text-3xl font-black text-prussian dark:text-white font-mono">{totalItems}</span>
        </div>
        <div className="bg-white dark:bg-[#001020] border border-prussian dark:border-slate-700 rounded-xl p-5 shadow-sm">
           <span className="text-xs font-bold text-prussian dark:text-white uppercase tracking-widest block mb-1">Reading Aids</span>
           <span className="text-3xl font-black text-prussian dark:text-white font-mono">{countReading}</span>
        </div>
        <div className="bg-white dark:bg-[#001020] border border-prussian dark:border-slate-700 rounded-xl p-5 shadow-sm">
           <span className="text-xs font-bold text-prussian dark:text-white uppercase tracking-widest block mb-1">Computers</span>
           <span className="text-3xl font-black text-prussian dark:text-white font-mono">{countComputer}</span>
        </div>
        <div className="bg-white dark:bg-[#001020] border border-prussian dark:border-slate-700 rounded-xl p-5 shadow-sm">
           <span className="text-xs font-bold text-prussian dark:text-white uppercase tracking-widest block mb-1">Assistive Devices</span>
           <span className="text-3xl font-black text-prussian dark:text-white font-mono">{countAssistive}</span>
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
                      {(item as any).isOther && (
                        <input
                          type="text"
                          placeholder="Specify equipment..."
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
             <Save className="w-4 h-4" /> Save Equipment Records
           </button>
        </div>
      </div>

      {/* Data Table Section */}
      <div className="pt-8">
        <div className="flex flex-col gap-1 mb-4">
          <h3 className="text-lg font-black text-prussian dark:text-white uppercase tracking-tight">Saved Equipment Records</h3>
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
                   <th className="px-4 py-3 font-bold">Total Items</th>
                   <th className="px-4 py-3 font-bold">Summary</th>
                   <th className="px-4 py-3 text-center font-bold">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-prussian/10 text-ink dark:text-slate-300">
                 {paginatedRecords.length > 0 ? paginatedRecords.map((rec, i) => {
                   const details = Object.entries(rec.items)
                     .filter(([_, val]) => val > 0)
                     .map(([key, val]) => {
                        const lbl = CATEGORIES.flatMap(c => c.items).find(itm => itm.id === key)?.label;
                        const finalLbl = key === 'other' && rec.otherSpecifyText ? `Other (${rec.otherSpecifyText})` : lbl;
                        return `${finalLbl}: ${val}`;
                     })
                     .join(', ');
                     
                   return (
                   <tr key={rec.id} className={`${i % 2 === 0 ? 'bg-white dark:bg-[#001020]' : 'bg-snow dark:bg-slate-900'}`}>
                     <td className="px-4 py-3 font-mono text-xs font-bold">{rec.id}</td>
                     <td className="px-4 py-3 text-xs text-ink dark:text-slate-300/70">{rec.dateSubmitted}</td>
                     <td className="px-4 py-3 text-xs font-mono font-bold">{rec.totalQuantity}</td>
                     <td className="px-4 py-3 text-xs text-ink dark:text-slate-300/80 truncate max-w-xs" title={details}>{details || 'No items'}</td>
                     <td className="px-4 py-3 text-center">
                       <div className="flex items-center justify-center gap-2">
                          <button onClick={() => deleteItem(rec.id)} className="text-rose-400 hover:text-rose-600 p-1" title="Delete"><Trash2 className="w-4 h-4" /></button>
                       </div>
                     </td>
                   </tr>
                 )
                }) : (
                   <tr>
                     <td colSpan={5} className="px-4 py-8 text-center text-ink dark:text-slate-300/50 text-sm">
                        No equipment records found.
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

export default EquipmentDisabilityRegistry;
