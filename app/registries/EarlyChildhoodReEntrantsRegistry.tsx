"use client";

import React, { useState, useMemo, useEffect } from "react";
import { AlertCircle, UserCheck, User, Users, RefreshCw } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useFilters } from "@/hooks/useFilters";
import { SectionContainer } from "../shared/SectionContainer";
import { FilterBar } from "../shared/FilterBar";
import { DataTable, ColumnConfig } from "../shared/DataTable";
import { FormModal } from "../shared/FormModal";
import { AddButton } from "../shared/ActionButtons";
import { ECStudent } from "./EarlyChildhoodStudentsRegistry";

export interface ECReEntrant {
  id: string;
  nationalIdPassport: string;
  surname: string;
  studentNames: string;
  nationality: string;
  sex: "Male" | "Female" | "";
  
  dateReEnteredDay: string;
  dateReEnteredMonth: string;
  dateReEnteredYear: string;
  categoryLevelReEntered: string;
  
  yearOfDroppingOut: string;
  reasonsForDroppingOut: string;
  
  lastUpdated: string;
}

const CATEGORY_LEVEL_OPTIONS = ["Baby", "Middle", "Pre-Unit"];
const SEX_OPTIONS = ["Male", "Female"];
const NATIONALITY_OPTIONS = ["Citizen", "Non-Citizen"];
const REASONS_OPTIONS = [
  "Illness", 
  "Death", 
  "Financial Constraints", 
  "Lack of Interest", 
  "Disability",
  "Unknown",
  "Other"
];

export const EarlyChildhoodReEntrantsRegistry: React.FC = () => {
  const { items, addItem, updateItem, deleteItem } = useLocalStorage<ECReEntrant>(
    "edu_vision_ec_re_entrants",
    []
  );

  const { items: studentsList } = useLocalStorage<ECStudent>("edu_vision_ec_students", []);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedReEntrant, setSelectedReEntrant] = useState<ECReEntrant | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const {
    searchQuery,
    setSearchQuery,
    activeFilters,
    setFilterVal,
    clearFilters,
    filteredItems
  } = useFilters<ECReEntrant>(items, ["nationalIdPassport", "surname", "studentNames"]);

  if (activeFilters.categoryLevelReEntered === undefined) {
    setFilterVal("categoryLevelReEntered", "");
  }
  if (activeFilters.reasonsForDroppingOut === undefined) {
    setFilterVal("reasonsForDroppingOut", "");
  }

  const triggerAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const getFormattedDate = (d: string, m: string, y: string) => {
    if (!d || !m || !y) return "N/A";
    return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
  };

  const stats = useMemo(() => {
    let males = 0;
    let females = 0;
    const categoryCounts: Record<string, number> = {};

    items.forEach(d => {
      if (d.sex === "Male") males++;
      if (d.sex === "Female") females++;
      categoryCounts[d.categoryLevelReEntered] = (categoryCounts[d.categoryLevelReEntered] || 0) + 1;
    });

    const topCategory = Object.keys(categoryCounts).length > 0 
      ? Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a] > categoryCounts[b] ? a : b)
      : "None";

    return {
      total: items.length,
      males,
      females,
      topCategory,
      returningRate: "100%" // Placeholder as per design guide context
    };
  }, [items]);

  const defaultFormState: Partial<ECReEntrant> = {
    nationalIdPassport: "",
    surname: "",
    studentNames: "",
    nationality: "Citizen",
    sex: "",
    dateReEnteredDay: "",
    dateReEnteredMonth: "",
    dateReEnteredYear: "",
    categoryLevelReEntered: "Pre-Unit",
    yearOfDroppingOut: "",
    reasonsForDroppingOut: "Unknown"
  };

  const [formData, setFormData] = useState<Partial<ECReEntrant>>(defaultFormState);

  // Auto-populate based on National ID
  useEffect(() => {
    if (formData.nationalIdPassport && formData.nationalIdPassport.length > 3) {
      const foundStudent = studentsList.find(s => s.nationalIdPassport === formData.nationalIdPassport);
      if (foundStudent && foundStudent.surname !== formData.surname) {
        setFormData(prev => ({
          ...prev,
          surname: foundStudent.surname,
          studentNames: foundStudent.studentNames,
          nationality: foundStudent.nationality,
          sex: foundStudent.sex
        }));
        triggerAlert("Student details merged from registry.", "success");
      }
    }
  }, [formData.nationalIdPassport, studentsList]);

  const handleOpenAdd = () => {
    setSelectedReEntrant(null);
    setFormData(defaultFormState);
    setModalOpen(true);
  };

  const handleOpenEdit = (reEntrant: ECReEntrant) => {
    setSelectedReEntrant(reEntrant);
    setFormData({ ...reEntrant });
    setModalOpen(true);
  };

  const handleOpenDelete = (reEntrant: ECReEntrant) => {
    setSelectedReEntrant(reEntrant);
    setDeleteOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nationalIdPassport || !formData.surname || !formData.studentNames || !formData.reasonsForDroppingOut) {
      triggerAlert("Please fill in all required fields.", "error");
      return;
    }

    const dataToSave: ECReEntrant = {
      ...(formData as ECReEntrant),
      lastUpdated: new Date().toISOString()
    };

    if (selectedReEntrant) {
      updateItem(dataToSave);
      triggerAlert(`Re-entrant record updated.`, "success");
    } else {
      addItem({ ...dataToSave, id: `rent-${Date.now()}` });
      triggerAlert(`Re-entrant record added successfully.`, "success");
    }

    setModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedReEntrant) {
      deleteItem(selectedReEntrant.id);
      triggerAlert(`Re-entrant record deleted.`, "success");
      setDeleteOpen(false);
    }
  };

  const handleFieldChange = (field: keyof ECReEntrant, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNumberInput = (field: keyof ECReEntrant, value: string, maxLen?: number) => {
    let numVal = value.replace(/\D/g, "");
    if (maxLen && numVal.length > maxLen) {
      numVal = numVal.slice(0, maxLen);
    }
    setFormData(prev => ({ ...prev, [field]: numVal }));
  }

  const columns: ColumnConfig<ECReEntrant>[] = [
    { header: "#", accessorKey: "id", render: (item) => (filteredItems.findIndex(i => i.id === item.id) + 1).toString() },
    { header: "NATIONAL ID/ PASSPORT", accessorKey: "nationalIdPassport" },
    { header: "SURNAME", accessorKey: "surname" },
    { header: "STUDENT NAMES", accessorKey: "studentNames" },
    { header: "SEX", accessorKey: "sex" },
    { header: "CATEGORY/ LEVEL", accessorKey: "categoryLevelReEntered" },
    { header: "DATE RE-ENTERED", accessorKey: "dateReEnteredYear", render: (s) => getFormattedDate(s.dateReEnteredDay, s.dateReEnteredMonth, s.dateReEnteredYear) },
    { header: "YEAR DROPPED OUT", accessorKey: "yearOfDroppingOut" },
    { header: "REASON", accessorKey: "reasonsForDroppingOut" }
  ];

  return (
    <SectionContainer
      title="Early Childhood Re-entrants Registry"
      description="Manage records of returning students and track early childhood retention."
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
          <div className="p-3 bg-[#002652]/10 text-[#002652] dark:text-sky-400 rounded-xl">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Re-entrants</span>
            <span className="text-2xl font-black text-[#002652] dark:text-slate-100">{stats.total}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#000A14] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-pink-500/10 text-pink-600 dark:text-pink-400 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">By Gender</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-100">{stats.males}M / {stats.females}F</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#000A14] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Top Category</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-100">{stats.topCategory}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#000A14] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-[#97620C]/10 text-[#97620C] rounded-xl">
            <User className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Returning Rate</span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{stats.returningRate}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#000A14] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 mb-6">
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by ID or Name..."
          filters={[
            {
              key: "categoryLevelReEntered",
              label: "Category/Level",
              value: activeFilters.categoryLevelReEntered as string,
              options: ["All Levels", ...CATEGORY_LEVEL_OPTIONS],
              onChange: (val) => setFilterVal("categoryLevelReEntered", val)
            },
            {
              key: "reasonsForDroppingOut",
              label: "Reason",
              value: activeFilters.reasonsForDroppingOut as string,
              options: ["All Reasons", ...REASONS_OPTIONS],
              onChange: (val) => setFilterVal("reasonsForDroppingOut", val)
            }
          ]}
          onClear={clearFilters}
        />
        <AddButton 
          onClick={handleOpenAdd} 
          label="Log Re-entrant" 
          className="bg-[#00A3A3] hover:bg-[#002652] text-white" 
        />
      </div>

      <DataTable
        data={filteredItems}
        columns={columns}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        emptyMessage="No re-entrant records found."
      />

      {/* Add/Edit Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedReEntrant ? "Update Re-entrant Record" : "Log Re-entrant Event"}
        onSubmit={handleSave}
        submitLabel={selectedReEntrant ? "Save Changes" : "Confirm Record"}
      >
        <div className="space-y-6">
          {/* Section 1: Student Information */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-[#002652] dark:text-[#00A3A3] border-b border-slate-200 dark:border-slate-800 pb-2">
              Section 1: Student Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">NATIONAL ID/ PASSPORT *</label>
                <input
                  type="text"
                  required
                  value={formData.nationalIdPassport}
                  onChange={(e) => handleFieldChange("nationalIdPassport", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">NATIONALITY</label>
                <select
                  value={formData.nationality}
                  onChange={(e) => handleFieldChange("nationality", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  {NATIONALITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">SURNAME *</label>
                <input
                  type="text"
                  required
                  value={formData.surname}
                  onChange={(e) => handleFieldChange("surname", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">STUDENT NAMES *</label>
                <input
                  type="text"
                  required
                  value={formData.studentNames}
                  onChange={(e) => handleFieldChange("studentNames", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">SEX</label>
                <select
                  value={formData.sex}
                  onChange={(e) => handleFieldChange("sex", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  <option value="">-- Select --</option>
                  {SEX_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Re-entry Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-[#002652] dark:text-[#00A3A3] border-b border-slate-200 dark:border-slate-800 pb-2">
              Section 2: Re-entry Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">CATEGORY/ LEVEL RE-ENTERED</label>
                <select
                  value={formData.categoryLevelReEntered}
                  onChange={(e) => handleFieldChange("categoryLevelReEntered", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  {CATEGORY_LEVEL_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">RE-ENTRY DAY</label>
                <input
                  type="text"
                  placeholder="DD"
                  value={formData.dateReEnteredDay}
                  onChange={(e) => handleNumberInput("dateReEnteredDay", e.target.value, 2)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">RE-ENTRY MONTH</label>
                <input
                  type="text"
                  placeholder="MM"
                  value={formData.dateReEnteredMonth}
                  onChange={(e) => handleNumberInput("dateReEnteredMonth", e.target.value, 2)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">RE-ENTRY YEAR</label>
                <input
                  type="text"
                  placeholder="YYYY"
                  value={formData.dateReEnteredYear}
                  onChange={(e) => handleNumberInput("dateReEnteredYear", e.target.value, 4)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Dropout History */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-[#002652] dark:text-[#00A3A3] border-b border-slate-200 dark:border-slate-800 pb-2">
              Section 3: Dropout History
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">YEAR OF DROPPING OUT</label>
                <input
                  type="text"
                  placeholder="YYYY"
                  value={formData.yearOfDroppingOut}
                  onChange={(e) => handleNumberInput("yearOfDroppingOut", e.target.value, 4)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">REASONS FOR DROPPING OUT *</label>
                <select
                  value={formData.reasonsForDroppingOut}
                  onChange={(e) => handleFieldChange("reasonsForDroppingOut", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  <option value="">-- Select --</option>
                  {REASONS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
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
            Are you sure you want to delete the re-entrant record for <strong>{selectedReEntrant?.studentNames} {selectedReEntrant?.surname}</strong>? 
            This action cannot be undone.
          </p>
        </div>
      </FormModal>
    </SectionContainer>
  );
};
