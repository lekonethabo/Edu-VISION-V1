"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  AlertCircle, 
  ShieldCheck, 
  HeartPulse, 
  Trash2, 
  CalendarCheck, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Eye, 
  Link,
  Search,
  CheckCircle2,
  BookmarkCheck
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { SectionContainer } from "../shared/SectionContainer";
import { FilterBar } from "../shared/FilterBar";
import { DataTable, ColumnConfig } from "../shared/DataTable";
import { FormModal } from "../shared/FormModal";
import { AddButton } from "../shared/ActionButtons";
import { motion, AnimatePresence } from "motion/react";

export interface ComprehensiveSexualityEducationData {
  A: string; // RULES_PHYSICAL SAFETY ("Yes" | "No" | "")
  B: string; // RULES_STIGMA & DISCRIMINATION ("Yes" | "No" | "")
  C: string; // RULES_SEXUAL HARASSMENT & ABUSE ("Yes" | "No" | "")

  D: string; // PHYSICAL SAFETY RULES_SHARING - TEACHERS
  E: string; // PHYSICAL SAFETY RULES_SHARING - NON-TEACHING
  F: string; // PHYSICAL SAFETY RULES_SHARING - PARENTS/ GUARDIAN
  G: string; // PHYSICAL SAFETY RULES_SHARING - SCHOOL BOARD/PTA

  H: string; // STIGMA & DISCRIMINATION RULES_SHARING - TEACHERS
  I: string; // STIGMA & DISCRIMINATION RULES_SHARING - NON-TEACHING
  J: string; // STIGMA & DISCRIMINATION RULES_SHARING - PARENTS/ GUARDIAN
  K: string; // STIGMA & DISCRIMINATION RULES_SHARING - SCHOOL BOARD/PTA

  L: string; // SEXUAL HARASSMENT RULES_SHARING - TEACHERS
  M: string; // SEXUAL HARASSMENT RULES_SHARING - NON-TEACHING
  N: string; // SEXUAL HARASSMENT RULES_SHARING - PARENTS/ GUARDIAN
  O: string; // SEXUAL HARASSMENT RULES_SHARING - SCHOOL BOARD/PTA

  P: string; // LIFE SKILLS ORIENTATION FOR PARENTS/ GUARDIANS

  Q: string; // WORKPLACE PROGRAMMES - INFORMATION AND TRAINING STAFF_HIV/AIDS
  R: string; // WORKPLACE PROGRAMMES - PREVENTION, CARE AND SUPPORT
  S: string; // WORKPLACE PROGRAMMES - GREVIANCE AND DISCIPLINARY PROCEDURE
  T: string; // WORKPLACE PROGRAMMES - HIV/AIDS PROGRAMME
  U: string; // WORKPLACE PROGRAMMES - ENFORCEMENT_GREVIANCE & DISCIPLINARY PROCEDURES
  V: string; // WORKPLACE PROGRAMMES - ENVIRONMENTAL AWARENESS
}

interface SavedCseRecord {
  id: string;
  dateSubmitted: string;
  data: ComprehensiveSexualityEducationData;
  policiesApproved: number;
  workplaceApproved: number;
}

const DEFAULT_CSE_DATA: ComprehensiveSexualityEducationData = {
  A: "No", B: "No", C: "No",
  D: "None", E: "None", F: "None", G: "None",
  H: "None", I: "None", J: "None", K: "None",
  L: "None", M: "None", N: "None", O: "None",
  P: "No",
  Q: "No", R: "No", S: "No", T: "No", U: "No", V: "No"
};

const YES_NO_OPTIONS = ["Yes", "No"];
const DISSEMINATION_OPTIONS = [
  { value: "None", label: "None (❌)" },
  { value: "Meeting", label: "Meeting (📋)" },
  { value: "Writing", label: "Writing (📝)" },
  { value: "Meeting & Writing", label: "Meeting & Writing (📋+📝)" },
  { value: "Other", label: "Other (🔧)" }
];

const ToggleSwitch = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
  const isYes = value === "Yes";
  return (
    <button
      type="button"
      onClick={() => onChange(isYes ? "No" : "Yes")}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A3A3] focus:ring-offset-2 ${
        isYes ? 'bg-[#00A3A3]' : 'bg-slate-300 dark:bg-slate-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isYes ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

const FormSection = ({ 
  title, 
  icon, 
  colorClass, 
  darkColorClass,
  children, 
  defaultOpen = true 
}: { 
  title: string, icon: React.ReactNode, colorClass: string, darkColorClass: string, children: React.ReactNode, defaultOpen?: boolean 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border rounded-xl mb-4 overflow-hidden shadow-sm ${colorClass} ${darkColorClass} transition-all`}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white/40 dark:bg-black/20 hover:bg-white/60 dark:hover:bg-black/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-white/80 dark:bg-black/40 rounded shadow-sm">
            {icon}
          </div>
          <h3 className="font-bold text-sm tracking-wide text-slate-800 dark:text-slate-100 uppercase">{title}</h3>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
      </button>
      
      {isOpen && (
        <div className="p-5 border-t border-black/5 dark:border-white/5">
          {children}
        </div>
      )}
    </div>
  );
};

const SharingDropdown = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm p-2.5 pl-3 pr-8 bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-[#00A3A3] focus:border-[#00A3A3] appearance-none shadow-sm cursor-pointer"
      >
        {DISSEMINATION_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
        <ChevronDown className="h-4 w-4" />
      </div>
    </div>
  </div>
);

export const ComprehensiveSexualityEducationRegistry: React.FC = () => {
  const { items: savedRecords, setData: setSavedRecords } = useLocalStorage<SavedCseRecord>(
    "ec_cse_list_v2",
    []
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<SavedCseRecord | null>(null);

  const [formData, setFormData] = useState<ComprehensiveSexualityEducationData>({ ...DEFAULT_CSE_DATA });
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRules, setFilterRules] = useState<"All" | "Yes" | "No">("All");

  const [isModified, setIsModified] = useState(false);

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const val = (key: keyof ComprehensiveSexualityEducationData, defaultVal: string = "No") => {
    return formData[key] || defaultVal;
  };

  const updateContent = (key: keyof ComprehensiveSexualityEducationData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setIsModified(true);
  };

  const activePoliciesCount = useMemo(() => {
    return [formData.A, formData.B, formData.C].filter(v => v === "Yes").length;
  }, [formData]);

  const activeWorkplaceCount = useMemo(() => {
    return [formData.Q, formData.R, formData.S, formData.T, formData.U, formData.V].filter(v => v === "Yes").length;
  }, [formData]);

  const activeSharingCount = useMemo(() => {
    return [
      formData.D, formData.E, formData.F, formData.G,
      formData.H, formData.I, formData.J, formData.K,
      formData.L, formData.M, formData.N, formData.O
    ].filter(v => v && v !== "None").length;
  }, [formData]);

  const scorePercentage = useMemo(() => {
    let pts = 0;
    if (formData.A === "Yes") pts++;
    if (formData.B === "Yes") pts++;
    if (formData.C === "Yes") pts++;
    if (formData.P === "Yes") pts++;
    
    const sharedMethodsCount = [
      formData.D, formData.E, formData.F, formData.G,
      formData.H, formData.I, formData.J, formData.K,
      formData.L, formData.M, formData.N, formData.O
    ].filter(v => v && v !== "None").length;

    pts += sharedMethodsCount;
    return Math.round((pts / 16) * 100) || 0;
  }, [formData]);

  const resetForm = () => {
    if (!selectedRecord) {
      setFormData({ ...DEFAULT_CSE_DATA });
    } else {
      setFormData(selectedRecord.data);
    }
    setIsModified(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setIsModified(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const timestamp = new Date().toLocaleString();
    const compiledRecord: SavedCseRecord = {
      id: selectedRecord?.id || `ECCE-CSE-${Math.floor(Math.random() * 90000) + 10000}`,
      dateSubmitted: selectedRecord?.dateSubmitted || timestamp,
      data: { ...formData },
      policiesApproved: activePoliciesCount,
      workplaceApproved: activeWorkplaceCount
    };

    if (selectedRecord) {
      setSavedRecords(prev => prev.map(r => r.id === selectedRecord.id ? compiledRecord : r));
      triggerToast("Compliance CSE Audit record updated successfully.", "success");
    } else {
      setSavedRecords(prev => [compiledRecord, ...prev]);
      triggerToast("New Compliance CSE Audit record saved successfully.", "success");
    }

    setModalOpen(false);
    setSelectedRecord(null);
    setFormData({ ...DEFAULT_CSE_DATA });
    setIsModified(false);
  };

  const handleEditClick = (rec: SavedCseRecord) => {
    setSelectedRecord(rec);
    setFormData(rec.data);
    setIsModified(false);
    setModalOpen(true);
  };

  const handleViewClick = (rec: SavedCseRecord) => {
    setSelectedRecord(rec);
    setViewOpen(true);
  };

  const handleDeleteClick = (rec: SavedCseRecord) => {
    setSelectedRecord(rec);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedRecord) {
      setSavedRecords(prev => prev.filter(r => r.id !== selectedRecord.id));
      triggerToast(`ECCE-CSE compliance record ${selectedRecord.id} permanently discarded.`, "success");
      setDeleteOpen(false);
      setSelectedRecord(null);
    }
  };

  const filteredData = useMemo(() => {
    let list = [...savedRecords];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(r => r.id.toLowerCase().includes(q) || r.dateSubmitted.toLowerCase().includes(q));
    }
    if (filterRules === "Yes") {
      list = list.filter(r => r.data.A === "Yes" || r.data.B === "Yes" || r.data.C === "Yes");
    } else if (filterRules === "No") {
      list = list.filter(r => r.data.A === "No" && r.data.B === "No" && r.data.C === "No");
    }
    return list;
  }, [savedRecords, searchQuery, filterRules]);

  // Map to core datatable column requirements
  const columns: ColumnConfig<SavedCseRecord>[] = [
    { header: "Entry ID", accessorKey: "id", className: "font-mono font-bold text-sea" },
    {
      header: "Physical Safety Rules",
      render: (c) => (
        <span className={`font-mono text-[10px] font-bold px-2 py-1 rounded-full ${c.data.A === "Yes" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}>
          {c.data.A}
        </span>
      )
    },
    {
      header: "Stigma Rules",
      render: (c) => (
        <span className={`font-mono text-[10px] font-bold px-2 py-1 rounded-full ${c.data.B === "Yes" ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}>
          {c.data.B}
        </span>
      )
    },
    {
      header: "Sexual Harassment Rules",
      render: (c) => (
        <span className={`font-mono text-[10px] font-bold px-2 py-1 rounded-full ${c.data.C === "Yes" ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}>
          {c.data.C}
        </span>
      )
    },
    {
      header: "Parent Orientation",
      render: (c) => (
        <span className={`font-mono text-[10px] font-bold px-2 py-1 rounded-full ${c.data.P === "Yes" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}>
          {c.data.P}
        </span>
      )
    },
    {
      header: "Workplace Programmes",
      render: (c) => {
        return <strong className="font-mono text-orange-600 dark:text-orange-400">{c.workplaceApproved}/6 Active</strong>;
      }
    },
    { header: "Date Submitted", accessorKey: "dateSubmitted", className: "font-mono text-xs text-slate-500" }
  ];

  return (
    <div className="space-y-6" id="ece-cse-compliance-registry">
      {/* Toast Alert Banner */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 p-4 rounded-xl border flex items-start gap-3 text-xs font-bold shadow-lg bg-slate-900/95 dark:bg-[#001428]/95 border-emerald-500/50 text-white min-w-[300px]"
          >
            <AlertCircle className={`w-5 h-5 flex-shrink-0 ${toast.type === "success" ? "text-[#00A3A3]" : "text-rose-500"}`} />
            <div className="space-y-0.5">
              <span className="font-bold block uppercase tracking-wider text-slate-300">
                {toast.type === "success" ? "Success Notification" : "System Alert"}
              </span>
              <span>{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 bg-blue-50 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700 rounded-xl text-sm leading-relaxed flex gap-4 items-start shadow-sm font-sans">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400">
          <ShieldCheck className="w-6 h-6 flex-shrink-0" />
        </div>
        <div className="pt-0.5">
          <span className="font-bold text-blue-900 dark:text-blue-300 block mb-1">ECCE Comprehensive Sexuality Education (CSE) & Safety Audit Node</span>
          <span className="text-slate-600 dark:text-slate-400">Allows early child learning administrators to document child protection rules, physical safeguarding methods, psychosocial family orientations, and wellness workplace policy compliance.</span>
        </div>
      </div>

      <SectionContainer
        title="ECCE Comprehensive CSE & Safety Audit"
        description="Official statutory audit records testing compliance with health guidelines, anti-discrimination provisions, and sexual abuse protocols in early childhood centers."
        action={
          <AddButton
            label="Log Annual Compliance"
            onClick={() => {
              setSelectedRecord(null);
              resetForm();
              setModalOpen(true);
            }}
          />
        }
      >
        <FilterBar
          searchPlaceholder="Search by compiled audit ID or recorded date..."
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={[
             {
               key: "rulesAvailable",
               label: "Rules Available?",
               value: filterRules,
               options: ["All", "Yes", "No"],
               onChange: (val) => setFilterRules(val as any)
             }
          ]}
          onClear={() => {
            setSearchQuery("");
            setFilterRules("All");
          }}
        />

        <DataTable
          columns={columns}
          data={filteredData}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onView={handleViewClick}
          emptyMessage="No ECCE annual compliance records registered."
        />
      </SectionContainer>

      {/* FORM MODAL WITH INTEGRATED Dropdowns & switches */}
      <FormModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={selectedRecord ? "Update ECCE Annual CSE Audit Docket" : "Create ECCE Annual CSE Audit Record"}
        onSubmit={handleSubmit}
        size="4xl"
        submitLabel="Save ECCE CSE Records"
        cancelLabel="Discard"
      >
        <div className="mb-6 flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm font-sans">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#002652] text-[10px] font-bold text-white">i</span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Indicators Completion Tracker</span>
          </div>
          <div className="text-xs text-slate-500 font-mono font-medium">
             Active Parameters: <strong className="text-[#00A3A3] dark:text-[#00A3A3]">{activePoliciesCount + activeSharingCount + activeWorkplaceCount} checkpoints active</strong>
          </div>
        </div>

        <div className="space-y-6 font-sans">
          <FormSection 
            title="Section 1: Rules & Regulations Availability" 
            icon={<ShieldCheck className="w-5 h-5 text-blue-600" />}
            colorClass="bg-[#E3F2FD]/40 border-blue-200"
            darkColorClass="dark:bg-blue-950/20 dark:border-blue-900"
          >
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex items-center gap-2">
              <Info className="w-4 h-4" /> Has the ECCE center documented guidelines on these issues?
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1 text-sm">Physical Safety Rules</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Guidelines protecting children from physical harm on center grounds.</p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{val("A")}</span>
                  <ToggleSwitch value={val("A")} onChange={(v) => updateContent("A", v)} />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1 text-sm">Stigma & Discrimination</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Provisions preventing social discrimination or health segregation.</p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{val("B")}</span>
                  <ToggleSwitch value={val("B")} onChange={(v) => updateContent("B", v)} />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1 text-sm">Sexual Harassment & Abuse</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Regulations concerning harassment prevention and rapid response.</p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{val("C")}</span>
                  <ToggleSwitch value={val("C")} onChange={(v) => updateContent("C", v)} />
                </div>
              </div>
            </div>
          </FormSection>

          <FormSection 
            title="Section 2: Rules Sharing Methods" 
            icon={<Link className="w-5 h-5 text-emerald-600" />}
            colorClass="bg-[#E8F5E9]/40 border-emerald-200"
            darkColorClass="dark:bg-emerald-950/20 dark:border-emerald-900"
          >
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 flex items-center gap-2">
               Configure the exact method used to distribute documented rules to stakeholders.
            </p>
            
            <div className="space-y-8">
              {val("A") === "Yes" ? (
                <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-emerald-100 dark:border-emerald-900/50 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 i-full bg-[#00A3A3]"></div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Physical Safety Rules Shared With:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SharingDropdown label="Teachers" onChange={(v) => updateContent("D", v)} value={val("D", "None")} />
                    <SharingDropdown label="Non-Teaching" onChange={(v) => updateContent("E", v)} value={val("E", "None")} />
                    <SharingDropdown label="Parents/Guardians" onChange={(v) => updateContent("F", v)} value={val("F", "None")} />
                    <SharingDropdown label="School Board/PTA" onChange={(v) => updateContent("G", v)} value={val("G", "None")} />
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-dashed border-slate-300 dark:border-slate-700 text-center text-slate-500 text-xs">
                  Physical Safety Rules not active (Enable in Section 1 to release sharing methods).
                </div>
              )}

              {val("B") === "Yes" ? (
                <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-emerald-100 dark:border-emerald-900/50 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 i-full bg-emerald-500"></div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Anti-Stigma & Discrimination Rules Shared With:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SharingDropdown label="Teachers" onChange={(v) => updateContent("H", v)} value={val("H", "None")} />
                    <SharingDropdown label="Non-Teaching" onChange={(v) => updateContent("I", v)} value={val("I", "None")} />
                    <SharingDropdown label="Parents/Guardians" onChange={(v) => updateContent("J", v)} value={val("J", "None")} />
                    <SharingDropdown label="School Board/PTA" onChange={(v) => updateContent("K", v)} value={val("K", "None")} />
                  </div>
                </div>
               ) : (
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-dashed border-slate-300 dark:border-slate-700 text-center text-slate-500 text-xs">
                  Stigma & Discrimination Rules not active.
                </div>
               )}

              {val("C") === "Yes" ? (
                <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-emerald-100 dark:border-emerald-900/50 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 i-full bg-rose-500"></div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Sexual Harassment & Abuse Rules Shared With:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SharingDropdown label="Teachers" onChange={(v) => updateContent("L", v)} value={val("L", "None")} />
                    <SharingDropdown label="Non-Teaching" onChange={(v) => updateContent("M", v)} value={val("M", "None")} />
                    <SharingDropdown label="Parents/Guardians" onChange={(v) => updateContent("N", v)} value={val("N", "None")} />
                    <SharingDropdown label="School Board/PTA" onChange={(v) => updateContent("O", v)} value={val("O", "None")} />
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-dashed border-slate-300 dark:border-slate-700 text-center text-slate-500 text-xs">
                  Sexual Harassment & Abuse Rules not active.
                </div>
              )}
            </div>
          </FormSection>

          <FormSection 
            title="Section 3: Parent / Guardian Orientation" 
            icon={<CalendarCheck className="w-5 h-5 text-purple-600" />}
            colorClass="bg-[#F3E5F5]/50 border-purple-200"
            darkColorClass="dark:bg-purple-950/20 dark:border-purple-900"
          >
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex items-center gap-2">
              <Info className="w-4 h-4" /> Are life skills orientation programs actively offered to parents/guardians?
            </p>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-purple-100 dark:border-purple-900/50 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Psychosocial Life Skills Orientation</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Enables families to better support early childhood sexuality and wellbeing education.</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono font-bold text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md">{val("P")}</span>
                <ToggleSwitch value={val("P")} onChange={(v) => updateContent("P", v)} />
              </div>
            </div>
          </FormSection>

          <FormSection 
            title="Section 4: Workplace Health & Safety Programs" 
            icon={<HeartPulse className="w-5 h-5 text-orange-600" />}
            colorClass="bg-[#FFF3E0]/70 border-orange-200"
            darkColorClass="dark:bg-orange-950/20 dark:border-orange-900"
          >
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex items-center gap-2">
              <Info className="w-4 h-4" /> Check the indicators of workplace programs deployed on-site for staff.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: "Q", title: "Information and Training on HIV/AIDS for Staff" },
                { key: "R", title: "Prevention, Care and Support Programmes" },
                { key: "S", title: "Grievance and Disciplinary Procedures (written policy)" },
                { key: "T", title: "HIV/AIDS Workplace Program" },
                { key: "U", title: "Enforcement of Grievance disciplinary codes" },
                { key: "V", title: "Environmental Awareness programs" },
              ].map(prog => (
                <div key={prog.key} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-orange-100 dark:border-orange-900/50 shadow-sm flex items-center justify-between group hover:border-[#00a3a3]/60 transition-colors">
                  <h4 className="font-semibold text-slate-850 dark:text-slate-200 text-xs pr-4">{prog.title}</h4>
                  <div className="flex-shrink-0 flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-400">{val(prog.key as keyof ComprehensiveSexualityEducationData)}</span>
                    <ToggleSwitch value={val(prog.key as keyof ComprehensiveSexualityEducationData)} onChange={(v) => updateContent(prog.key as keyof ComprehensiveSexualityEducationData, v)} />
                  </div>
                </div>
              ))}
            </div>
          </FormSection>

          <div className="bg-[#F5F5F5] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
            <h3 className="font-bold text-sm tracking-wide text-slate-800 dark:text-slate-100 uppercase mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-slate-500" /> Section 5: Score Overview
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Core Policies Created</span>
                <span className="font-mono text-xl font-black text-blue-600 dark:text-blue-400">{activePoliciesCount}/3</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Sharing Channels Active</span>
                <span className="font-mono text-xl font-black text-emerald-600 dark:text-[#00A3A3]">{activeSharingCount}</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Family Progs</span>
                <span className={`font-mono text-lg font-black mt-1 inline-block ${val("P") === "Yes" ? "text-purple-600 dark:text-purple-400" : "text-slate-400"}`}>
                  {val("P")}
                </span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Workplace Progs</span>
                <span className="font-mono text-xl font-black text-orange-600 dark:text-orange-400">{activeWorkplaceCount}/6</span>
              </div>
            </div>
          </div>
        </div>
      </FormModal>

      {/* DELETE MODAL */}
      <FormModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Discard ECCE compliance Audit record"
        onSubmit={(e) => {
          e.preventDefault();
          confirmDelete();
        }}
        submitLabel="Delete Audit Row"
        cancelLabel="Keep Record"
      >
        <div className="text-center py-4 font-sans">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3 animate-pulse" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Permanently Discard Audit row?</h4>
          <p className="text-xs text-slate-500 mt-2">
            Are you sure you want to delete early childhood sexuality compliance audits for docket <strong>{selectedRecord?.id}</strong>?
          </p>
        </div>
      </FormModal>

      {/* VIEW MODAL OVERVIEW */}
      <FormModal
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        title={`Annual ECCE CSE Audit Record DETAIL ID: ${selectedRecord?.id}`}
        onSubmit={(e) => { e.preventDefault(); setViewOpen(false); }}
        submitLabel="Dismiss"
      >
        {selectedRecord && (
          <div className="space-y-6 font-sans">
            <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-700">
               <div>
                 <p className="text-xs uppercase text-slate-500 font-bold">Audit Standard</p>
                 <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Botswana ECCE Protection Code</p>
               </div>
               <div className="text-right">
                 <p className="text-xs uppercase text-slate-500 font-bold">Date Stamped</p>
                 <p className="text-sm font-mono text-slate-600 dark:text-slate-400">{selectedRecord.dateSubmitted}</p>
               </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Documented Guidelines Availability</h4>
              <div className="grid grid-cols-3 gap-3">
                 <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-705">
                   <p className="text-[10px] text-slate-500 uppercase mb-1">Physical Safety</p>
                   <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${selectedRecord.data.A === 'Yes' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-slate-250 text-slate-600 dark:bg-slate-700 dark:text-slate-350'}`}>{selectedRecord.data.A}</span>
                 </div>
                 <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-705">
                   <p className="text-[10px] text-slate-500 uppercase mb-1">Stigma & Discrim.</p>
                   <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${selectedRecord.data.B === 'Yes' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-[#00A3A3]' : 'bg-slate-250 text-slate-600 dark:bg-slate-700 dark:text-slate-350'}`}>{selectedRecord.data.B}</span>
                 </div>
                 <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-705">
                   <p className="text-[10px] text-slate-500 uppercase mb-1">Harassment & Abuse</p>
                   <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${selectedRecord.data.C === 'Yes' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300' : 'bg-slate-250 text-slate-600 dark:bg-slate-700 dark:text-slate-350'}`}>{selectedRecord.data.C}</span>
                 </div>
              </div>
            </div>

            <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
               <h4 className="font-bold text-xs uppercase text-center text-slate-700 dark:text-slate-300 tracking-wider mb-2">Detailed Report Export</h4>
               <p className="text-xs text-center text-slate-500">To download full sharing procedures (Sections 2 to 4) and workplace details in CSV/Excel, use the export layout action toolbar in the admin timeline control center.</p>
            </div>
          </div>
        )}
      </FormModal>

    </div>
  );
};

export default ComprehensiveSexualityEducationRegistry;
