"use client";

import React, { useState, useEffect } from "react";
import { AlertCircle, ShieldCheck, HeartPulse, Trash2, CalendarCheck, Info, ChevronDown, ChevronUp, Download, Eye, Link } from "lucide-react";
import { CseCategory } from "../types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useFilters } from "@/hooks/useFilters";
import { INITIAL_CSE } from "../constants";
import { SectionContainer } from "../shared/SectionContainer";
import { FilterBar } from "../shared/FilterBar";
import { DataTable, ColumnConfig } from "../shared/DataTable";
import { FormModal } from "../shared/FormModal";
import { AddButton } from "../shared/ActionButtons";

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
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
        isYes ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
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
    <div className={`border rounded-lg mb-4 overflow-hidden shadow-sm ${colorClass} ${darkColorClass} transition-all`}>
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
          className="w-full text-sm p-2.5 pl-3 pr-8 bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none shadow-sm"
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

export const CseAuditRegistry: React.FC = () => {
  const { items, addItem, updateItem, deleteItem } = useLocalStorage<CseCategory>(
    "cse_audit",
    INITIAL_CSE
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<CseCategory | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [formData, setFormData] = useState<Partial<CseCategory>>({});
  
  // Track modified fields for unsaved changes warning
  const [isModified, setIsModified] = useState(false);

  const {
    searchQuery,
    setSearchQuery,
    activeFilters,
    setFilterVal,
    clearFilters,
    filteredItems
  } = useFilters<CseCategory>(items, ["id", "academicYear", "recordedBy"], { rulesAvailable: "All" } as any);

  const triggerAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const val = (key: keyof CseCategory, defaultVal: string = "No") => formData[key] as string || defaultVal;
  
  const updateContent = (key: keyof CseCategory, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setIsModified(true);
  };

  const calculateYesCount = () => {
    return [
      val("rulesPhysicalSafety"),
      val("rulesStigmaDiscrimination"),
      val("rulesSexualHarassmentAbuse")
    ].filter(v => v === "Yes").length;
  };

  const calculateInformedStakeholders = () => {
    const fields: (keyof CseCategory)[] = [
      "sharingPhysicalStudents", "sharingPhysicalTeachers", "sharingPhysicalNonTeaching", "sharingPhysicalParents", "sharingPhysicalSchoolBoard",
      "sharingStigmaStudents", "sharingStigmaTeachers", "sharingStigmaNonTeaching", "sharingStigmaParents", "sharingStigmaSchoolBoard",
      "sharingHarassmentStudents", "sharingHarassmentTeachers", "sharingHarassmentNonTeaching", "sharingHarassmentParents", "sharingHarassmentSchoolBoard"
    ];
    let informed = 0;
    fields.forEach(f => {
      if (val(f, "None") !== "None") informed++;
    });
    return informed;
  };
  
  const calculateWorkplaceProgrammes = () => {
    return [
      val("workplaceHivTraining"),
      val("workplacePreventionCare"),
      val("workplaceGrievanceDiscipline"),
      val("workplaceHivProgramme"),
      val("workplaceEnforcementGrievance"),
      val("workplaceEnvironmentalAwareness")
    ].filter(v => v === "Yes").length;
  };

  const finalFiltered = filteredItems.filter(item => {
    const rulesAvail = (activeFilters as any).rulesAvailable;
    if (rulesAvail === "Yes") {
      return item.rulesPhysicalSafety === "Yes" || item.rulesStigmaDiscrimination === "Yes" || item.rulesSexualHarassmentAbuse === "Yes";
    }
    if (rulesAvail === "No") {
      return item.rulesPhysicalSafety === "No" && item.rulesStigmaDiscrimination === "No" && item.rulesSexualHarassmentAbuse === "No";
    }
    return true;
  });

  const columns: ColumnConfig<CseCategory>[] = [
    { header: "Entry ID", accessorKey: "id", className: "font-mono font-bold text-sea" },
    {
      header: "Physical Safety Rules",
      render: (c) => (
        <span className={`font-mono text-[10px] font-bold px-2 py-1 rounded-full ${c.rulesPhysicalSafety === "Yes" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}>
          {c.rulesPhysicalSafety}
        </span>
      )
    },
    {
      header: "Stigma Rules",
      render: (c) => (
        <span className={`font-mono text-[10px] font-bold px-2 py-1 rounded-full ${c.rulesStigmaDiscrimination === "Yes" ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}>
          {c.rulesStigmaDiscrimination}
        </span>
      )
    },
    {
      header: "Sexual Harassment Rules",
      render: (c) => (
        <span className={`font-mono text-[10px] font-bold px-2 py-1 rounded-full ${c.rulesSexualHarassmentAbuse === "Yes" ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}>
          {c.rulesSexualHarassmentAbuse}
        </span>
      )
    },
    {
      header: "Parent Orientation",
      render: (c) => (
        <span className={`font-mono text-[10px] font-bold px-2 py-1 rounded-full ${c.lifeSkillsOrientation === "Yes" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}>
          {c.lifeSkillsOrientation}
        </span>
      )
    },
    {
      header: "Workplace Programmes",
      render: (c) => {
        const count = [
            c.workplaceHivTraining, c.workplacePreventionCare, c.workplaceGrievanceDiscipline,
            c.workplaceHivProgramme, c.workplaceEnforcementGrievance, c.workplaceEnvironmentalAwareness
        ].filter(v => v === "Yes").length;
        
        return <strong className="font-mono text-orange-600 dark:text-orange-400">{count}/6 Active</strong>;
      }
    },
    { header: "Date Submitted", accessorKey: "lastUpdated", className: "font-mono text-xs text-slate-500" }
  ];

  const resetForm = () => {
    if (!selectedAudit) {
      setFormData({
        rulesPhysicalSafety: "No",
        rulesStigmaDiscrimination: "No",
        rulesSexualHarassmentAbuse: "No",
        sharingPhysicalStudents: "None",
        sharingPhysicalTeachers: "None",
        sharingPhysicalNonTeaching: "None",
        sharingPhysicalParents: "None",
        sharingPhysicalSchoolBoard: "None",
        sharingStigmaStudents: "None",
        sharingStigmaTeachers: "None",
        sharingStigmaNonTeaching: "None",
        sharingStigmaParents: "None",
        sharingStigmaSchoolBoard: "None",
        sharingHarassmentStudents: "None",
        sharingHarassmentTeachers: "None",
        sharingHarassmentNonTeaching: "None",
        sharingHarassmentParents: "None",
        sharingHarassmentSchoolBoard: "None",
        lifeSkillsOrientation: "No",
        workplaceHivTraining: "No",
        workplacePreventionCare: "No",
        workplaceGrievanceDiscipline: "No",
        workplaceHivProgramme: "No",
        workplaceEnforcementGrievance: "No",
        workplaceEnvironmentalAwareness: "No",
      });
    } else {
      setFormData(selectedAudit);
    }
    setIsModified(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setIsModified(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const compiled: CseCategory = {
      id: formData.id || `CSE-${new Date().getFullYear()}-${Math.floor(Math.random()*1000)}`,
      academicYear: formData.academicYear || new Date().getFullYear().toString(),
      rulesPhysicalSafety: formData.rulesPhysicalSafety as any || "No",
      rulesStigmaDiscrimination: formData.rulesStigmaDiscrimination as any || "No",
      rulesSexualHarassmentAbuse: formData.rulesSexualHarassmentAbuse as any || "No",
      
      sharingPhysicalStudents: formData.sharingPhysicalStudents as any || "None",
      sharingPhysicalTeachers: formData.sharingPhysicalTeachers as any || "None",
      sharingPhysicalNonTeaching: formData.sharingPhysicalNonTeaching as any || "None",
      sharingPhysicalParents: formData.sharingPhysicalParents as any || "None",
      sharingPhysicalSchoolBoard: formData.sharingPhysicalSchoolBoard as any || "None",
      
      sharingStigmaStudents: formData.sharingStigmaStudents as any || "None",
      sharingStigmaTeachers: formData.sharingStigmaTeachers as any || "None",
      sharingStigmaNonTeaching: formData.sharingStigmaNonTeaching as any || "None",
      sharingStigmaParents: formData.sharingStigmaParents as any || "None",
      sharingStigmaSchoolBoard: formData.sharingStigmaSchoolBoard as any || "None",
      
      sharingHarassmentStudents: formData.sharingHarassmentStudents as any || "None",
      sharingHarassmentTeachers: formData.sharingHarassmentTeachers as any || "None",
      sharingHarassmentNonTeaching: formData.sharingHarassmentNonTeaching as any || "None",
      sharingHarassmentParents: formData.sharingHarassmentParents as any || "None",
      sharingHarassmentSchoolBoard: formData.sharingHarassmentSchoolBoard as any || "None",
      
      lifeSkillsOrientation: formData.lifeSkillsOrientation as any || "No",
      workplaceHivTraining: formData.workplaceHivTraining as any || "No",
      workplacePreventionCare: formData.workplacePreventionCare as any || "No",
      workplaceGrievanceDiscipline: formData.workplaceGrievanceDiscipline as any || "No",
      workplaceHivProgramme: formData.workplaceHivProgramme as any || "No",
      workplaceEnforcementGrievance: formData.workplaceEnforcementGrievance as any || "No",
      workplaceEnvironmentalAwareness: formData.workplaceEnvironmentalAwareness as any || "No",
      recordedBy: formData.recordedBy || "Admin",
      lastUpdated: new Date().toISOString().split("T")[0]
    };

    if (selectedAudit) {
      updateItem(compiled);
      triggerAlert(`Records saved successfully!`, "success");
    } else {
      addItem(compiled);
      triggerAlert(`Records saved successfully!`, "success");
    }

    setModalOpen(false);
    setSelectedAudit(null);
    setFormData({});
    setIsModified(false);
  };

  const handleEditClick = (c: CseCategory) => {
    setSelectedAudit(c);
    setFormData(c);
    setIsModified(false);
    setModalOpen(true);
  };
  
  const handleViewClick = (c: CseCategory) => {
    setSelectedAudit(c);
    setViewOpen(true);
  };

  const handleDeleteClick = (c: CseCategory) => {
    setSelectedAudit(c);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedAudit) {
      deleteItem(selectedAudit.id);
      triggerAlert(`Audit file ${selectedAudit.id} permanently discarded.`, "success");
      setDeleteOpen(false);
      setSelectedAudit(null);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (modalOpen) {
        if (e.ctrlKey && e.key === 's') {
          e.preventDefault();
          handleSubmit(new Event('submit') as unknown as React.FormEvent);
        }
        if (e.ctrlKey && e.shiftKey && e.key === 'C') { // Note lowercase c for key match usually, but shift+c means 'C'
          e.preventDefault();
          resetForm();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen, formData]);

  return (
    <div className="space-y-6">
      {alert && (
        <div className={`p-4 rounded-lg border shadow-sm flex items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-4 ${
          alert.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-300" : "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/50 dark:border-red-800 dark:text-red-300"
        }`}>
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{alert.message}</span>
        </div>
      )}

      <div className="p-4 bg-blue-50 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700 rounded-xl text-sm leading-relaxed flex gap-4 items-start shadow-sm">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400">
          <ShieldCheck className="w-6 h-6 flex-shrink-0" />
        </div>
        <div className="pt-0.5">
          <span className="font-bold text-blue-900 dark:text-blue-300 block mb-1">Comprehensive Sexuality Education (CSE) & Safety Audit Node</span>
          <span className="text-slate-600 dark:text-slate-400">Provides mandatory annual review verification concerning workplace health, environmental safeguards, HIV guidance councils and physical/psychological protection directives distributed across school stakeholders.</span>
        </div>
      </div>

      <SectionContainer
        title="Comprehensive CSE & Safety Audit"
        description="Official statutory audit records testing compliance with health guidelines, anti-discrimination provisions, and sexual abuse protocols."
        action={
          <AddButton
            label="Log Annual Compliance"
            onClick={() => {
              setSelectedAudit(null);
              resetForm();
              setModalOpen(true);
            }}
          />
        }
      >
        <FilterBar
          searchPlaceholder="Search by academic compliance year or auditor..."
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={[
             {
               key: "rulesAvailable",
               label: "Rules Available?",
               value: (activeFilters as any).rulesAvailable || "All",
               options: ["All", "Yes", "No"],
               onChange: (val) => setFilterVal("rulesAvailable" as any, val)
             }
          ]}
          onClear={clearFilters}
        />

        <DataTable
          columns={columns}
          data={finalFiltered}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onView={handleViewClick}
          emptyMessage="No annual compliance records registered."
        />
      </SectionContainer>

      <FormModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={selectedAudit ? "Update Annual CSE Audit Docket" : "Create Annual CSE Audit Record"}
        onSubmit={handleSubmit}
        size="4xl"
        submitLabel="Save CSE Records"
        cancelLabel="Discard"
      >
        <div className="mb-6 flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-prussian text-[10px] font-bold text-white">i</span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Completion Tracker</span>
          </div>
          <div className="text-xs text-slate-500 font-mono font-medium">
             Fields Active: <strong className="text-indigo-600 dark:text-indigo-400">{calculateYesCount() + calculateInformedStakeholders() + calculateWorkplaceProgrammes()} inputs</strong>
          </div>
        </div>

        <div className="space-y-6">
          <FormSection 
            title="Section 1: Rules & Regulations Availability" 
            icon={<ShieldCheck className="w-5 h-5 text-blue-600" />}
            colorClass="bg-[#E3F2FD]/40 border-blue-200"
            darkColorClass="dark:bg-blue-950/20 dark:border-blue-900"
          >
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex items-center gap-2">
              <Info className="w-4 h-4" /> Does the school have documented rules for this category?
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1 text-sm">Physical Safety Rules</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Guidelines protecting students from physical harm on campus.</p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{val("rulesPhysicalSafety")}</span>
                  <ToggleSwitch value={val("rulesPhysicalSafety")} onChange={(v) => updateContent("rulesPhysicalSafety", v)} />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1 text-sm">Stigma & Discrimination</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Rules protecting against HIV or social discrimination.</p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{val("rulesStigmaDiscrimination")}</span>
                  <ToggleSwitch value={val("rulesStigmaDiscrimination")} onChange={(v) => updateContent("rulesStigmaDiscrimination", v)} />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1 text-sm">Sexual Harassment & Abuse</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Clear regulations addressing harassment and abuse.</p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{val("rulesSexualHarassmentAbuse")}</span>
                  <ToggleSwitch value={val("rulesSexualHarassmentAbuse")} onChange={(v) => updateContent("rulesSexualHarassmentAbuse", v)} />
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
               Select how each stakeholder group is informed about these rules.
            </p>
            
            <div className="space-y-8">
              {val("rulesPhysicalSafety") === "Yes" ? (
                <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-emerald-100 dark:border-emerald-900/50 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-400"></div>
                  <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Physical Safety Rules Shared With:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <SharingDropdown label="Students" onChange={(v) => updateContent("sharingPhysicalStudents", v)} value={val("sharingPhysicalStudents", "None")} />
                    <SharingDropdown label="Teachers" onChange={(v) => updateContent("sharingPhysicalTeachers", v)} value={val("sharingPhysicalTeachers", "None")} />
                    <SharingDropdown label="Non-Teaching Staff" onChange={(v) => updateContent("sharingPhysicalNonTeaching", v)} value={val("sharingPhysicalNonTeaching", "None")} />
                    <SharingDropdown label="Parents / Guardians" onChange={(v) => updateContent("sharingPhysicalParents", v)} value={val("sharingPhysicalParents", "None")} />
                    <SharingDropdown label="School Board / PTA" onChange={(v) => updateContent("sharingPhysicalSchoolBoard", v)} value={val("sharingPhysicalSchoolBoard", "None")} />
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-dashed border-slate-300 dark:border-slate-700 text-center text-slate-500 text-sm">
                  Physical Safety Rules not established (Requires creation in Section 1 to enable dissemination methods).
                </div>
              )}

              {val("rulesStigmaDiscrimination") === "Yes" ? (
                <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-emerald-100 dark:border-emerald-900/50 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-green-400"></div>
                  <h4 className="font-bold text-green-800 dark:text-green-300 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Stigma & Discrimination Rules Shared With:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <SharingDropdown label="Students" onChange={(v) => updateContent("sharingStigmaStudents", v)} value={val("sharingStigmaStudents", "None")} />
                    <SharingDropdown label="Teachers" onChange={(v) => updateContent("sharingStigmaTeachers", v)} value={val("sharingStigmaTeachers", "None")} />
                    <SharingDropdown label="Non-Teaching Staff" onChange={(v) => updateContent("sharingStigmaNonTeaching", v)} value={val("sharingStigmaNonTeaching", "None")} />
                    <SharingDropdown label="Parents / Guardians" onChange={(v) => updateContent("sharingStigmaParents", v)} value={val("sharingStigmaParents", "None")} />
                    <SharingDropdown label="School Board / PTA" onChange={(v) => updateContent("sharingStigmaSchoolBoard", v)} value={val("sharingStigmaSchoolBoard", "None")} />
                  </div>
                </div>
               ) : (
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-dashed border-slate-300 dark:border-slate-700 text-center text-slate-500 text-sm">
                  Stigma & Discrimination Rules not established.
                </div>
               )}

              {val("rulesSexualHarassmentAbuse") === "Yes" ? (
                <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-emerald-100 dark:border-emerald-900/50 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-rose-400"></div>
                  <h4 className="font-bold text-rose-800 dark:text-rose-300 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Sexual Harassment & Abuse Rules Shared With:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <SharingDropdown label="Students" onChange={(v) => updateContent("sharingHarassmentStudents", v)} value={val("sharingHarassmentStudents", "None")} />
                    <SharingDropdown label="Teachers" onChange={(v) => updateContent("sharingHarassmentTeachers", v)} value={val("sharingHarassmentTeachers", "None")} />
                    <SharingDropdown label="Non-Teaching Staff" onChange={(v) => updateContent("sharingHarassmentNonTeaching", v)} value={val("sharingHarassmentNonTeaching", "None")} />
                    <SharingDropdown label="Parents / Guardians" onChange={(v) => updateContent("sharingHarassmentParents", v)} value={val("sharingHarassmentParents", "None")} />
                    <SharingDropdown label="School Board / PTA" onChange={(v) => updateContent("sharingHarassmentSchoolBoard", v)} value={val("sharingHarassmentSchoolBoard", "None")} />
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-dashed border-slate-300 dark:border-slate-700 text-center text-slate-500 text-sm">
                  Sexual Harassment & Abuse Rules not established.
                </div>
              )}
            </div>
          </FormSection>

          <FormSection 
            title="Section 3: Parent / Guardian Programmes" 
            icon={<CalendarCheck className="w-5 h-5 text-purple-600" />}
            colorClass="bg-[#F3E5F5]/50 border-purple-200"
            darkColorClass="dark:bg-purple-950/20 dark:border-purple-900"
          >
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex items-center gap-2">
              <Info className="w-4 h-4" /> Are life skills orientation programmes offered to parents/guardians?
            </p>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-purple-100 dark:border-purple-900/50 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Life Skills Orientation for Parents / Guardians</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Official life-skills and psychosocial orientation modules extended to family units.</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono font-bold text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md">{val("lifeSkillsOrientation")}</span>
                <ToggleSwitch value={val("lifeSkillsOrientation")} onChange={(v) => updateContent("lifeSkillsOrientation", v)} />
              </div>
            </div>
          </FormSection>

          <FormSection 
            title="Section 4: Workplace Programmes" 
            icon={<HeartPulse className="w-5 h-5 text-orange-600" />}
            colorClass="bg-[#FFF3E0]/70 border-orange-200"
            darkColorClass="dark:bg-orange-950/20 dark:border-orange-900"
          >
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex items-center gap-2">
              <Info className="w-4 h-4" /> Does the school have these workplace programmes in place?
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: "workplaceHivTraining", title: "Information and Training on HIV/AIDS for Staff" },
                { key: "workplacePreventionCare", title: "Prevention, Care and Support Programmes" },
                { key: "workplaceGrievanceDiscipline", title: "Grievance and Disciplinary Procedures (written policy)" },
                { key: "workplaceHivProgramme", title: "HIV/AIDS Workplace Programme" },
                { key: "workplaceEnforcementGrievance", title: "Enforcement of Grievance & Disciplinary Procedures" },
                { key: "workplaceEnvironmentalAwareness", title: "Environmental Awareness Programmes" },
              ].map(prog => (
                <div key={prog.key} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-orange-100 dark:border-orange-900/50 shadow-sm flex items-center justify-between group hover:border-orange-300 transition-colors">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm pr-4">{prog.title}</h4>
                  <div className="flex-shrink-0 flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-400">{val(prog.key as keyof CseCategory)}</span>
                    <ToggleSwitch value={val(prog.key as keyof CseCategory)} onChange={(v) => updateContent(prog.key as keyof CseCategory, v)} />
                  </div>
                </div>
              ))}
            </div>
          </FormSection>

          <div className="bg-[#F5F5F5] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
            <h3 className="font-bold text-sm tracking-wide text-slate-800 dark:text-slate-100 uppercase mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-slate-500" /> Section 5: Summary Review
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Rules Created</span>
                <span className="font-mono text-2xl font-black text-blue-600 dark:text-blue-400">{calculateYesCount()}/3</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Groups Informed</span>
                <span className="font-mono text-2xl font-black text-emerald-600 dark:text-emerald-400">{calculateInformedStakeholders()}</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Parent Progs</span>
                <span className={`font-mono text-xl font-black mt-1 inline-block ${val("lifeSkillsOrientation") === "Yes" ? "text-purple-600 dark:text-purple-400" : "text-slate-400"}`}>
                  {val("lifeSkillsOrientation")}
                </span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Workplace Progs</span>
                <span className="font-mono text-2xl font-black text-orange-600 dark:text-orange-400">{calculateWorkplaceProgrammes()}/6</span>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button 
                type="button" 
                onClick={() => window.alert("Summary report export will be compiled and downloaded in PDF format.")}
                className="flex items-center gap-2 text-xs font-bold text-prussian dark:text-sea hover:underline px-4 py-2 border border-prussian dark:border-sea rounded-md transition-colors"
               >
                <Download className="w-4 h-4" /> Export Summary Report
              </button>
            </div>
          </div>
        </div>
      </FormModal>

      <FormModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Discard compliance Audit docket"
        onSubmit={(e) => {
          e.preventDefault();
          confirmDelete();
        }}
        submitLabel="Delete Audit Row"
        cancelLabel="Discard"
      >
        <div className="text-center py-4">
          <AlertCircle className="w-12 h-12 text-golden mx-auto mb-3 animate-pulse" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Permanently Discard Audit row?</h4>
          <p className="text-xs text-slate-500 mt-2">
            Are you sure you want to delete the sexuality education compliance details for academic year <strong>{selectedAudit?.academicYear}</strong>? This action overwrites statutory history.
          </p>
        </div>
      </FormModal>

      <FormModal
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        title={`Annual CSE Audit Record: ${selectedAudit?.academicYear}`}
        onSubmit={(e) => { e.preventDefault(); setViewOpen(false); }}
        submitLabel="Dismiss"
      >
        {selectedAudit && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-700">
               <div>
                 <p className="text-xs uppercase text-slate-500 font-bold">Auditor</p>
                 <p className="text-base font-semibold text-slate-800 dark:text-slate-200">{selectedAudit.recordedBy}</p>
               </div>
               <div className="text-right">
                 <p className="text-xs uppercase text-slate-500 font-bold">Last Updated</p>
                 <p className="text-sm font-mono text-slate-600 dark:text-slate-400">{selectedAudit.lastUpdated}</p>
               </div>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-3">Core Rules Availability</h4>
              <div className="grid grid-cols-3 gap-3">
                 <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                   <p className="text-[10px] text-slate-500 uppercase mb-1">Physical Safety</p>
                   <span className={`px-2 py-0.5 rounded text-xs font-bold ${selectedAudit.rulesPhysicalSafety === 'Yes' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>{selectedAudit.rulesPhysicalSafety}</span>
                 </div>
                 <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                   <p className="text-[10px] text-slate-500 uppercase mb-1">Stigma & Discrim.</p>
                   <span className={`px-2 py-0.5 rounded text-xs font-bold ${selectedAudit.rulesStigmaDiscrimination === 'Yes' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>{selectedAudit.rulesStigmaDiscrimination}</span>
                 </div>
                 <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                   <p className="text-[10px] text-slate-500 uppercase mb-1">Sex. Harassment</p>
                   <span className={`px-2 py-0.5 rounded text-xs font-bold ${selectedAudit.rulesSexualHarassmentAbuse === 'Yes' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>{selectedAudit.rulesSexualHarassmentAbuse}</span>
                 </div>
              </div>
            </div>

            <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
               <h4 className="font-bold text-sm mb-2 text-center text-slate-700 dark:text-slate-300">Detailed Review Export Notice</h4>
               <p className="text-xs text-center text-slate-500">The detailed view of parent and workplace programs is typically exported as part of the official PDF statutory report.</p>
            </div>
          </div>
        )}
      </FormModal>
    </div>
  );
};

export default CseAuditRegistry;
