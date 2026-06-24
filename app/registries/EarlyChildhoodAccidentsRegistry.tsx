"use client";

import React, { useState, useMemo, useEffect } from "react";
import { AlertCircle, User, Activity, AlertTriangle, Stethoscope } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useFilters } from "@/hooks/useFilters";
import { SectionContainer } from "../shared/SectionContainer";
import { FilterBar } from "../shared/FilterBar";
import { DataTable, ColumnConfig } from "../shared/DataTable";
import { FormModal } from "../shared/FormModal";
import { AddButton } from "../shared/ActionButtons";

interface ECStudent {
  id: string;
  nationalIdPassport: string;
  surname?: string;
  firstNames?: string;
  nationality: string;
  sex: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
}

export interface ECAccident {
  id: string;
  nationalIdPassport: string;
  surname: string;
  studentNames: string;
  sex: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  categoryLevel: string;
  typeOfAccident1: string;
  accident1Outcome: string;
  typeOfAccident2: string;
  accident2Outcome: string;
  typeOfAccident3: string;
  accident3Outcome: string;
  lastUpdated: string;
}

const SEX_OPTIONS = ["Male", "Female"];
const CATEGORY_OPTIONS = [
  "Baby Care",
  "Day Care/Nursery",
  "Pre-primary (Excluding Reception)",
  "Reception"
];

const ACCIDENT_TYPE_1_OPTIONS = [
  "Choking",
  "Drowning",
  "Electrocution",
  "Falls/ Slip",
  "Fire",
  "Play ground/ Sports Accident",
  "Poisoning",
  "Road Traffic Accident",
  "Struck by Objects",
  "Other"
];

const ACCIDENT_OUTCOME_1_OPTIONS = [
  "Abrasion",
  "Burns",
  "Concussion",
  "Cuts/ Bruises",
  "Death",
  "Dislocation",
  "Fracture",
  "Strains & Sprains",
  "Other"
];

const ACCIDENT_TYPE_2_OPTIONS = [...ACCIDENT_TYPE_1_OPTIONS, "None"];
const ACCIDENT_OUTCOME_2_OPTIONS = ["N/A", ...ACCIDENT_OUTCOME_1_OPTIONS];

export const EarlyChildhoodAccidentsRegistry: React.FC = () => {
  const { items, addItem, updateItem, deleteItem } = useLocalStorage<ECAccident>(
    "edu_vision_ec_accidents",
    []
  );

  const { items: students } = useLocalStorage<ECStudent>("edu_vision_ec_students", []);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedAccident, setSelectedAccident] = useState<ECAccident | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const {
    searchQuery,
    setSearchQuery,
    activeFilters,
    setFilterVal,
    clearFilters,
    filteredItems
  } = useFilters<ECAccident>(items, ["nationalIdPassport", "surname", "studentNames"]);

  if (activeFilters.categoryLevel === undefined) {
    setFilterVal("categoryLevel", "");
  }
  if (activeFilters.typeOfAccident1 === undefined) {
    setFilterVal("typeOfAccident1", "");
  }

  const triggerAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const getAge = (year: string) => {
    if (!year) return "N/A";
    return (new Date().getFullYear() - parseInt(year)).toString();
  };

  const stats = useMemo(() => {
    let males = 0;
    let females = 0;
    const accidentTypes: Record<string, number> = {};
    const accidentOutcomes: Record<string, number> = {};

    items.forEach(a => {
      if (a.sex === "Male") males++;
      if (a.sex === "Female") females++;

      const countAccident = (type: string, outcome: string) => {
        if (type && type !== "None") {
          accidentTypes[type] = (accidentTypes[type] || 0) + 1;
        }
        if (outcome && outcome !== "N/A") {
          accidentOutcomes[outcome] = (accidentOutcomes[outcome] || 0) + 1;
        }
      };

      countAccident(a.typeOfAccident1, a.accident1Outcome);
      countAccident(a.typeOfAccident2, a.accident2Outcome);
      countAccident(a.typeOfAccident3, a.accident3Outcome);
    });

    const topType = Object.keys(accidentTypes).length > 0
      ? Object.keys(accidentTypes).reduce((a, b) => accidentTypes[a] > accidentTypes[b] ? a : b)
      : "None";

    const topOutcome = Object.keys(accidentOutcomes).length > 0
      ? Object.keys(accidentOutcomes).reduce((a, b) => accidentOutcomes[a] > accidentOutcomes[b] ? a : b)
      : "None";

    return {
      total: items.length,
      males,
      females,
      topType,
      topOutcome
    };
  }, [items]);

  const defaultFormState: Partial<ECAccident> = {
    nationalIdPassport: "",
    surname: "",
    studentNames: "",
    sex: "",
    dobDay: "",
    dobMonth: "",
    dobYear: "",
    categoryLevel: "Pre-primary (Excluding Reception)",
    typeOfAccident1: "Falls/ Slip",
    accident1Outcome: "Abrasion",
    typeOfAccident2: "None",
    accident2Outcome: "N/A",
    typeOfAccident3: "None",
    accident3Outcome: "N/A"
  };

  const [formData, setFormData] = useState<Partial<ECAccident>>(defaultFormState);

  const handleOpenAdd = () => {
    setSelectedAccident(null);
    setFormData(defaultFormState);
    setModalOpen(true);
  };

  const handleOpenEdit = (accident: ECAccident) => {
    setSelectedAccident(accident);
    setFormData({ ...accident });
    setModalOpen(true);
  };

  const handleOpenDelete = (accident: ECAccident) => {
    setSelectedAccident(accident);
    setDeleteOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nationalIdPassport || !formData.surname || !formData.studentNames || !formData.typeOfAccident1) {
      triggerAlert("Please fill in all required fields.", "error");
      return;
    }

    const dataToSave: ECAccident = {
      ...(formData as ECAccident),
      lastUpdated: new Date().toISOString()
    };

    if (selectedAccident) {
      updateItem(dataToSave);
      triggerAlert("Accident record updated.", "success");
    } else {
      addItem({ ...dataToSave, id: `acc-${Date.now()}` });
      triggerAlert("Accident logged successfully.", "success");
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedAccident) {
      deleteItem(selectedAccident.id);
      triggerAlert("Accident record deleted.", "success");
      setDeleteOpen(false);
    }
  };

  const handleFieldChange = (field: keyof ECAccident, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === "nationalIdPassport" && value.length > 4) {
        const existingStudent = students.find(s => s.nationalIdPassport === value);
        if (existingStudent && !selectedAccident) {
          updated.surname = existingStudent.surname || prev.surname;
          updated.studentNames = existingStudent.firstNames || prev.studentNames;
          updated.sex = existingStudent.sex || prev.sex;
          updated.dobDay = existingStudent.dobDay || prev.dobDay;
          updated.dobMonth = existingStudent.dobMonth || prev.dobMonth;
          updated.dobYear = existingStudent.dobYear || prev.dobYear;
          setTimeout(() => triggerAlert("Student found. Profile details synchronized.", "success"), 50);
        }
      }
      return updated;
    });
  };

  const columns: ColumnConfig<ECAccident>[] = [
    { header: "#", accessorKey: "id", render: (item) => (filteredItems.findIndex(i => i.id === item.id) + 1).toString() },
    { header: "NATIONAL ID/ PASSPORT", accessorKey: "nationalIdPassport" },
    { header: "SURNAME", accessorKey: "surname" },
    { header: "STUDENT NAMES", accessorKey: "studentNames" },
    { header: "SEX", accessorKey: "sex" },
    { header: "CATEGORY/ LEVEL", accessorKey: "categoryLevel" },
    { header: "TYPE OF ACCIDENT 1", accessorKey: "typeOfAccident1" },
    { header: "OUTCOME 1", accessorKey: "accident1Outcome", render: (item) => (
      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
        item.accident1Outcome === "Death" ? "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400" :
        "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400"
      }`}>
        {item.accident1Outcome}
      </span>
    )}
  ];

  return (
    <SectionContainer
      title="Accidents Registry"
      description="Record and monitor student accidents and injuries within the school premises."
      action={
        <AddButton 
          onClick={handleOpenAdd} 
          label="Log Accident" 
        />
      }
    >
      {alert && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs font-bold shadow-sm ${
          alert.type === "success" 
            ? "bg-[#00A3A3]/10 border-[#00A3A3]/30 text-[#00A3A3]" 
            : "bg-rose-500/10 border-rose-500/30 text-rose-500"
        }`}>
          <AlertCircle className="w-4 h-4" />
          <span>{alert.message}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-[#000A14] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-500 rounded-xl">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Accidents</span>
            <span className="text-2xl font-black text-amber-600 dark:text-amber-500">{stats.total}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#000A14] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <User className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">By Gender</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-100">{stats.males}M / {stats.females}F</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#000A14] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Top Case Type</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-100 truncate w-32 md:w-full">{stats.topType}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#000A14] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Top Outcome</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-100 truncate w-32 md:w-full">{stats.topOutcome}</span>
          </div>
        </div>
      </div>

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by ID or Name..."
        filters={[
          {
            key: "categoryLevel",
            label: "Category/Level",
            value: activeFilters.categoryLevel as string,
            options: CATEGORY_OPTIONS,
            allLabel: "All Categories/Levels",
            onChange: (val) => setFilterVal("categoryLevel", val)
          },
          {
            key: "typeOfAccident1",
            label: "Accident Type 1",
            value: activeFilters.typeOfAccident1 as string,
            options: ACCIDENT_TYPE_1_OPTIONS,
            allLabel: "All Accident Types",
            onChange: (val) => setFilterVal("typeOfAccident1", val)
          }
        ]}
        onClear={clearFilters}
      />

      <DataTable
        data={filteredItems}
        columns={columns}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        emptyMessage="No accident records found."
      />

      {/* Add/Edit Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedAccident ? "Update Accident Record" : "Log Accident"}
        onSubmit={handleSave}
        submitLabel={selectedAccident ? "Save Changes" : "Log Accident"}
      >
        <div className="space-y-6">
          {/* Section 1: Student Information */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-[#002652] dark:text-[#00A3A3] border-b border-slate-200 dark:border-slate-800 pb-2">
              Section 1: Student Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">NATIONAL ID/ PASSPORT *</label>
                <input
                  type="text"
                  required
                  value={formData.nationalIdPassport || ""}
                  onChange={(e) => handleFieldChange("nationalIdPassport", e.target.value)}
                  placeholder="ID to auto-fill..."
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">SURNAME *</label>
                <input
                  type="text"
                  required
                  value={formData.surname || ""}
                  onChange={(e) => handleFieldChange("surname", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">STUDENT NAMES *</label>
                <input
                  type="text"
                  required
                  value={formData.studentNames || ""}
                  onChange={(e) => handleFieldChange("studentNames", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">SEX</label>
                <select
                  value={formData.sex || ""}
                  onChange={(e) => handleFieldChange("sex", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  <option value="">-- Select --</option>
                  {SEX_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">CATEGORY/ LEVEL</label>
                <select
                  value={formData.categoryLevel || ""}
                  onChange={(e) => handleFieldChange("categoryLevel", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  <option value="">-- Select --</option>
                  {CATEGORY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">DOB DAY</label>
                <input
                  type="text"
                  placeholder="DD"
                  value={formData.dobDay || ""}
                  onChange={(e) => handleFieldChange("dobDay", e.target.value.replace(/\D/g, "").slice(0, 2))}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">DOB MONTH</label>
                <input
                  type="text"
                  placeholder="MM"
                  value={formData.dobMonth || ""}
                  onChange={(e) => handleFieldChange("dobMonth", e.target.value.replace(/\D/g, "").slice(0, 2))}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">DOB YEAR</label>
                <input
                  type="text"
                  placeholder="YYYY"
                  value={formData.dobYear || ""}
                  onChange={(e) => handleFieldChange("dobYear", e.target.value.replace(/\D/g, "").slice(0, 4))}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
            </div>
            {formData.dobYear && (
               <div className="text-xs font-bold text-[#00A3A3] bg-[#00A3A3]/10 p-2 rounded-lg border border-[#00A3A3]/30">
                  Computed Age: {getAge(formData.dobYear)} years
               </div>
            )}
          </div>

          {/* Section 2: Accident 1 Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-amber-600 dark:text-amber-500 border-b border-amber-200 dark:border-amber-900/50 pb-2">
              Section 2: Accident 1 Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-amber-50/50 dark:bg-amber-950/20 p-4 rounded-xl border border-amber-100 dark:border-amber-900/50">
              <div>
                <label className="block text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 tracking-wider mb-1">TYPE OF ACCIDENT 1 *</label>
                <select
                  required
                  value={formData.typeOfAccident1 || ""}
                  onChange={(e) => handleFieldChange("typeOfAccident1", e.target.value)}
                  className="w-full text-xs p-2.5 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  <option value="">-- Select --</option>
                  {ACCIDENT_TYPE_1_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 tracking-wider mb-1">ACCIDENT 1 OUTCOME *</label>
                <select
                  required
                  value={formData.accident1Outcome || ""}
                  onChange={(e) => handleFieldChange("accident1Outcome", e.target.value)}
                  className="w-full text-xs p-2.5 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  <option value="">-- Select --</option>
                  {ACCIDENT_OUTCOME_1_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Accident 2 Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-amber-600/70 dark:text-amber-500/70 border-b border-amber-200/50 dark:border-amber-900/30 pb-2">
              Section 3: Accident 2 Details (Optional)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">TYPE OF ACCIDENT 2</label>
                <select
                  value={formData.typeOfAccident2 || ""}
                  onChange={(e) => handleFieldChange("typeOfAccident2", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  {ACCIDENT_TYPE_2_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">ACCIDENT 2 OUTCOME</label>
                <select
                  value={formData.accident2Outcome || ""}
                  onChange={(e) => handleFieldChange("accident2Outcome", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  {ACCIDENT_OUTCOME_2_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Accident 3 Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-amber-600/70 dark:text-amber-500/70 border-b border-amber-200/50 dark:border-amber-900/30 pb-2">
              Section 4: Accident 3 Details (Optional)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">TYPE OF ACCIDENT 3</label>
                <select
                  value={formData.typeOfAccident3 || ""}
                  onChange={(e) => handleFieldChange("typeOfAccident3", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  {ACCIDENT_TYPE_2_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">ACCIDENT 3 OUTCOME</label>
                <select
                  value={formData.accident3Outcome || ""}
                  onChange={(e) => handleFieldChange("accident3Outcome", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  {ACCIDENT_OUTCOME_2_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
          </div>

        </div>
      </FormModal>

      {/* Delete Confirmation */}
      <FormModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Confirm Deletion"
        onSubmit={(e) => { e.preventDefault(); handleDelete(); }}
        submitLabel="Confirm Delete"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Are you sure you want to permanently delete the accident record for student ID <strong>{selectedAccident?.nationalIdPassport}</strong>? 
            This action cannot be undone.
          </p>
        </div>
      </FormModal>
    </SectionContainer>
  );
};
