"use client";

import React, { useState, useMemo } from "react";
import { 
  Save, 
  Trash2, 
  AlertCircle, 
  Eye,
  Activity,
  UserCheck,
  Search,
  Database,
  ShieldCheck,
  BarChart3
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { SectionContainer } from "../shared/SectionContainer";
import { motion, AnimatePresence } from "motion/react";

export interface MonitoringSupervisionData {
  A: number; // ECCE - HOME ECONOMICS OFFICER
  B: number; // ECCE - HEALTH EDUCATION OFFICER
  C: number; // ECCE - PRE-PRIMARY OFFICER
  D: number; // ECCE - SPECIAL EDUCATION OFFICER
  E: number; // ECCE - CURRICULUM OFFICER
  F: number; // ECCE - OTHER MCWBE OFFICER

  G: number; // ECCE - NURSE
  H: number; // ECCE - SOCIAL WORKER
  I: number; // ECCE - HEALTH INSPECTOR

  J: number; // ECCE - BUILDINGS CONTROL OFFICER
  K: number; // ECCE - PLANNING OFFICER
  L: number; // ECCE - BYE LAW
  M: number; // ECCE - FIRE

  N: number; // ECCE - OTHER MLGTA
  O: number; // ECCE - OTHER 1
  P: number; // ECCE - OTHER 2
}

interface SavedMonitoringRecord {
  id: string;
  dateSubmitted: string;
  data: MonitoringSupervisionData;
  totalVisits: number;
}

const DEFAULT_MONITORING_DATA: MonitoringSupervisionData = {
  A: 0, B: 0, C: 0, D: 0, E: 0, F: 0,
  G: 0, H: 0, I: 0,
  J: 0, K: 0, L: 0, M: 0,
  N: 0, O: 0, P: 0
};

export const MonitoringSupervisionRegistry: React.FC = () => {
  const { items: savedRecords, setData: setSavedRecords } = useLocalStorage<SavedMonitoringRecord>(
    "ec_monitoring_list_v2",
    []
  );

  const [formData, setFormData] = useState<MonitoringSupervisionData>({ ...DEFAULT_MONITORING_DATA });
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Search queue and pagination controls
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleFieldChange = (key: keyof MonitoringSupervisionData, val: string) => {
    const numericVal = val === "" ? 0 : parseInt(val, 10);
    setFormData(prev => ({
      ...prev,
      [key]: isNaN(numericVal) ? 0 : Math.max(0, numericVal)
    }));
  };

  const calculateTotalVisits = (data: MonitoringSupervisionData) => {
    return Object.values(data).reduce((acc, curr) => acc + (curr || 0), 0);
  };

  const currentTotalVisits = useMemo(() => calculateTotalVisits(formData), [formData]);

  const countEceVisits = [
    formData.A, formData.B, formData.C, formData.D, formData.E, formData.F
  ].reduce((acc, curr) => acc + (curr || 0), 0);

  const countHealthVisits = [
    formData.G, formData.H, formData.I
  ].reduce((acc, curr) => acc + (curr || 0), 0);

  const countRegulatoryVisits = [
    formData.J, formData.K, formData.L, formData.M, formData.N
  ].reduce((acc, curr) => acc + (curr || 0), 0);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentTotalVisits === 0) {
      triggerToast("Please register at least one (nonzero) supervision visit before saving.", "error");
      return;
    }

    const timestamp = new Date().toLocaleString();
    const newRecord: SavedMonitoringRecord = {
      id: `SUP-${Math.floor(Math.random() * 90000) + 10000}`,
      dateSubmitted: timestamp,
      data: { ...formData },
      totalVisits: currentTotalVisits
    };

    setSavedRecords(prev => [newRecord, ...prev]);
    setFormData({ ...DEFAULT_MONITORING_DATA });
    triggerToast("Monitoring supervision audit log saved successfully.", "success");
    setCurrentPage(1);
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to reset all visit values?")) {
      setFormData({ ...DEFAULT_MONITORING_DATA });
      triggerToast("Monitoring and supervision values cleared.", "success");
    }
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm("Are you sure you want to delete this supervision audit entry?")) {
      setSavedRecords(prev => prev.filter(r => r.id !== id));
      triggerToast("Supervision audit entry deleted successfully.", "success");
    }
  };

  // Filtered entries
  const filteredRecords = useMemo(() => {
    if (!searchQuery) return savedRecords;
    const query = searchQuery.toLowerCase();
    return savedRecords.filter(r => 
      r.id.toLowerCase().includes(query) ||
      r.dateSubmitted.toLowerCase().includes(query)
    );
  }, [searchQuery, savedRecords]);

  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredRecords.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredRecords, currentPage]);

  const totalPages = Math.ceil(filteredRecords.length / rowsPerPage) || 1;

  // Render Section Field
  const renderField = (label: string, fieldKey: keyof MonitoringSupervisionData) => {
    return (
      <div 
        key={fieldKey}
        className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-805 rounded-lg gap-4 hover:border-sea/30 transition-all group"
      >
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block max-w-sm font-sans">
          {label}
        </span>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            value={formData[fieldKey]}
            onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
            className="w-24 px-3 py-1.5 text-center text-xs font-mono font-bold bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-700 rounded focus:border-sea focus:outline-none transition-colors dark:text-slate-100 placeholder-slate-400"
            onFocus={(e) => e.target.select()}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6" id="ece-monitoring-supervision-registry">
      {/* Toast Alert Banner */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-xl border flex items-start gap-3.5 text-xs font-bold shadow-lg ${
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

      <SectionContainer
        title="Monitoring & Supervision Registry"
        description="Official log tracking regulatory compliance visits, quality audits, and inspections from education and healthcare authorities."
      >
        <form onSubmit={handleSave} className="space-y-8">
          {/* Action Header */}
          <div className="flex flex-wrap justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
            <div>
              <h3 className="text-sm font-black text-[#002652] dark:text-[#00A3A3] uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#00A3A3]" />
                SUPERVISION & REGULATORY AUDITS
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Log authorized inspections and school audits from the preceding academic year.
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
                <span>Save Registry</span>
              </button>
            </div>
          </div>

          {/* Metric widgets */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-[#001020] border border-slate-200 dark:border-slate-800 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total logged visits</span>
              <span className="text-2xl font-black text-prussian dark:text-slate-200 block font-mono mt-1">{currentTotalVisits}</span>
            </div>
            <div className="bg-slate-50 dark:bg-[#001020] border border-slate-200 dark:border-slate-800 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">ECCE Officer Visits</span>
              <span className="text-2xl font-black text-prussian dark:text-slate-200 block font-mono mt-1">{countEceVisits}</span>
            </div>
            <div className="bg-slate-50 dark:bg-[#001020] border border-slate-200 dark:border-slate-800 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Health/Social Visits</span>
              <span className="text-2xl font-black text-prussian dark:text-slate-200 block font-mono mt-1">{countHealthVisits}</span>
            </div>
            <div className="bg-slate-50 dark:bg-[#001020] border border-slate-200 dark:border-slate-800 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Structural & Fire Inspections</span>
              <span className="text-2xl font-black text-prussian dark:text-slate-200 block font-mono mt-1">{countRegulatoryVisits}</span>
            </div>
          </div>

          {/* SECTION 1: Ece officer visits */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-[#002652] dark:text-[#00A3A3] tracking-widest uppercase flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800/60 font-sans">
              <span className="w-1.5 h-3 bg-[#00A3A3] rounded-sm"></span>
              ECCE Officer Visits
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField("Home Economics Officer visits", "A")}
              {renderField("Health Education Officer visits", "B")}
              {renderField("Pre-Primary Officer visits", "C")}
              {renderField("Special Education Officer visits", "D")}
              {renderField("Curriculum Officer visits", "E")}
              {renderField("Other MCWBE Department visits", "F")}
            </div>
          </div>

          {/* SECTION 2: Health & Social Services */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-[#002652] dark:text-[#00A3A3] tracking-widest uppercase flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800/60 font-sans">
              <span className="w-1.5 h-3 bg-[#00A3A3] rounded-sm"></span>
              Health & Social Services
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField("Community Health Nurse / Clinical visits", "G")}
              {renderField("Social Worker visits", "H")}
              {renderField("Government Health Inspector audits", "I")}
            </div>
          </div>

          {/* SECTION 3: Structural and Fire Audits */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-[#002652] dark:text-[#00A3A3] tracking-widest uppercase flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800/60 font-sans">
              <span className="w-1.5 h-3 bg-[#00A3A3] rounded-sm"></span>
              Regulatory and Structural Inspections
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField("Buildings Control Officer visits", "J")}
              {renderField("Planning Officer architectural visits", "K")}
              {renderField("Bye-Law Enforcement Department audits", "L")}
              {renderField("Fire & Emergency Services inspections", "M")}
            </div>
          </div>

          {/* SECTION 4: Administrative visits */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-[#002652] dark:text-[#00A3A3] tracking-widest uppercase flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800/60 font-sans">
              <span className="w-1.5 h-3 bg-[#00A3A3] rounded-sm"></span>
              Other Inspections and Administrative Visits
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField("Other MLG&D Inspector audits", "N")}
              {renderField("Other Specified Authority visit 1", "O")}
              {renderField("Other Specified Authority visit 2", "P")}
            </div>
          </div>

          {/* action footer */}
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
              className="px-5 py-2 bg-prussian hover:bg-[#001c3d] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4 text-[#00A3A3]" />
              <span>Save Monitoring Log</span>
            </button>
          </div>
        </form>
      </SectionContainer>

      {/* Audit History Log Table */}
      <div className="pt-4">
        <h3 className="text-sm font-black text-[#002652] dark:text-snow uppercase tracking-wider mb-3 flex items-center gap-2">
          <Database className="w-4 h-4 text-[#00A3A3]" />
          SAVED SUPERVISION LOG RECORDS
        </h3>

        <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800/80 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-805">
            <div className="relative w-full max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input 
                type="text" 
                placeholder="Search audit IDs..." 
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
                  <th className="px-5 py-3 text-left">Audit ID</th>
                  <th className="px-5 py-3 text-left">Date Recorded</th>
                  <th className="px-5 py-3 text-center">ECCE Officer Visits</th>
                  <th className="px-5 py-3 text-center">Health/Social Visits</th>
                  <th className="px-5 py-3 text-center">Inspection Audits</th>
                  <th className="px-5 py-3 text-center">Other Admin</th>
                  <th className="px-5 py-3 text-center">Total Registered Visits</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {paginatedRecords.length > 0 ? paginatedRecords.map((rec) => {
                  const s = rec.data;
                  const eceCount = [s.A, s.B, s.C, s.D, s.E, s.F].reduce((a, b) => a + (b || 0), 0);
                  const healthCount = [s.G, s.H, s.I].reduce((a, b) => a + (b || 0), 0);
                  const inspectorCount = [s.J, s.K, s.L, s.M, s.N].reduce((a, b) => a + (b || 0), 0);
                  const otherCount = [s.O, s.P].reduce((a, b) => a + (b || 0), 0);

                  return (
                    <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="px-5 py-3 font-mono font-bold text-sea">{rec.id}</td>
                      <td className="px-5 py-3 text-slate-600 dark:text-slate-400">{rec.dateSubmitted}</td>
                      <td className="px-5 py-3 text-center font-mono font-semibold">{eceCount}</td>
                      <td className="px-5 py-3 text-center font-mono text-slate-500">{healthCount}</td>
                      <td className="px-5 py-3 text-center font-mono text-slate-500">{inspectorCount}</td>
                      <td className="px-5 py-3 text-center font-mono text-slate-500">{otherCount}</td>
                      <td className="px-5 py-3 text-center font-mono font-bold text-prussian dark:text-snow">{rec.totalVisits}</td>
                      <td className="px-5 py-3 text-center">
                        <button 
                          onClick={() => handleDeleteRecord(rec.id)} 
                          className="text-rose-400 hover:text-rose-600 p-1" 
                          title="Delete Audit log"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={8} className="px-5 py-8 text-center text-slate-400 italic">
                      No supervision visit records found.
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

export default MonitoringSupervisionRegistry;
