"use client";

import React, { useState, useMemo, useEffect } from "react";
import { AlertCircle, User, Users, GraduationCap, Briefcase } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useFilters } from "@/hooks/useFilters";
import { SectionContainer } from "../shared/SectionContainer";
import { FilterBar } from "../shared/FilterBar";
import { DataTable, ColumnConfig } from "../shared/DataTable";
import { FormModal } from "../shared/FormModal";
import { AddButton } from "../shared/ActionButtons";

interface ECTeachingStaff {
  id: string;
  nationalIdPassport: string;
  surname: string;
  firstNames: string;
  nationality: string;
  sex: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
}

export interface ECTeachersSpecialProgramme {
  id: string;
  nationalIdPassport: string;
  surname: string;
  firstName: string; // From JSON
  nationality: string;
  sex: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  contractType: string;
  qualifiedInSpecialEducation: string;
  lastUpdated: string;
}

const SPECIALIZATIONS = [
  "Visual Impairment",
  "Hearing Impairment",
  "Learning Disabilities",
  "Intellectual Disabilities",
  "Multiple Disabilities"
];

const CONTRACT_OPTIONS = [
  "Permanent & Pensionable Teacher",
  "Contract",
  "Temporary - Vacant Post",
  "Temporary - Study Leave",
  "Temporary - School Expansion",
  "Temporary - Relief",
  "Internship"
];

const SEX_OPTIONS = ["Male", "Female"];

export const TeachersSpecialProgrammeRegistry: React.FC = () => {
  const { items, addItem, updateItem, deleteItem } = useLocalStorage<ECTeachersSpecialProgramme>(
    "edu_vision_ec_teachers_special_programme",
    []
  );

  const { items: staffItems } = useLocalStorage<ECTeachingStaff>("edu_vision_ec_teaching_staff", []);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<ECTeachersSpecialProgramme | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const {
    searchQuery,
    setSearchQuery,
    activeFilters,
    setFilterVal,
    clearFilters,
    filteredItems
  } = useFilters<ECTeachersSpecialProgramme>(items, ["nationalIdPassport", "surname", "firstName"]);

  if (activeFilters.sex === undefined) {
    setFilterVal("sex", "");
  }
  if (activeFilters.contractType === undefined) {
    setFilterVal("contractType", "");
  }
  if (activeFilters.qualifiedInSpecialEducation === undefined) {
    setFilterVal("qualifiedInSpecialEducation", "");
  }

  const triggerAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const stats = useMemo(() => {
    let males = 0;
    let females = 0;
    let contractTypes: Record<string, number> = {};
    let specializations: Record<string, number> = {};

    items.forEach(s => {
      if (s.sex === "Male") males++;
      if (s.sex === "Female") females++;

      if (s.contractType) {
        contractTypes[s.contractType] = (contractTypes[s.contractType] || 0) + 1;
      }
      
      if (s.qualifiedInSpecialEducation) {
        specializations[s.qualifiedInSpecialEducation] = (specializations[s.qualifiedInSpecialEducation] || 0) + 1;
      }
    });

    const topSpecialization = Object.keys(specializations).length > 0
      ? Object.keys(specializations).reduce((a, b) => specializations[a] > specializations[b] ? a : b)
      : "None";

    const topContract = Object.keys(contractTypes).length > 0
      ? Object.keys(contractTypes).reduce((a, b) => contractTypes[a] > contractTypes[b] ? a : b)
      : "None";

    return {
      total: items.length,
      males,
      females,
      topSpecialization,
      topContract
    };
  }, [items]);

  const defaultFormState: Partial<ECTeachersSpecialProgramme> = {
    nationalIdPassport: "",
    surname: "",
    firstName: "",
    nationality: "Botswana",
    sex: "",
    dobDay: "",
    dobMonth: "",
    dobYear: "",
    contractType: "Permanent & Pensionable Teacher",
    qualifiedInSpecialEducation: "Learning Disabilities",
  };

  const [formData, setFormData] = useState<Partial<ECTeachersSpecialProgramme>>(defaultFormState);

  const handleOpenAdd = () => {
    setSelectedStaff(null);
    setFormData(defaultFormState);
    setModalOpen(true);
  };

  const handleOpenEdit = (staff: ECTeachersSpecialProgramme) => {
    setSelectedStaff(staff);
    setFormData({ ...staff });
    setModalOpen(true);
  };

  const handleOpenDelete = (staff: ECTeachersSpecialProgramme) => {
    setSelectedStaff(staff);
    setDeleteOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nationalIdPassport || !formData.surname || !formData.firstName || !formData.qualifiedInSpecialEducation) {
      triggerAlert("Please fill in all required fields.", "error");
      return;
    }

    const dataToSave: ECTeachersSpecialProgramme = {
      ...(formData as ECTeachersSpecialProgramme),
      lastUpdated: new Date().toISOString()
    };

    if (selectedStaff) {
      updateItem(dataToSave);
      triggerAlert("SPED Teacher updated.", "success");
    } else {
      addItem({ ...dataToSave, id: `sped-${Date.now()}` });
      triggerAlert("SPED Teacher added successfully.", "success");
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedStaff) {
      deleteItem(selectedStaff.id);
      triggerAlert("SPED Teacher removed.", "success");
      setDeleteOpen(false);
    }
  };

  const handleFieldChange = (field: keyof ECTeachersSpecialProgramme, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === "nationalIdPassport" && value.length > 4) {
        const existingStaff = staffItems.find(s => s.nationalIdPassport === value);
        if (existingStaff && !selectedStaff) {
          updated.surname = existingStaff.surname || prev.surname;
          updated.firstName = existingStaff.firstNames || prev.firstName;
          updated.nationality = existingStaff.nationality || prev.nationality;
          updated.sex = existingStaff.sex || prev.sex;
          updated.dobDay = existingStaff.dobDay || prev.dobDay;
          updated.dobMonth = existingStaff.dobMonth || prev.dobMonth;
          updated.dobYear = existingStaff.dobYear || prev.dobYear;
          setTimeout(() => triggerAlert("Teacher found. Profile details synchronized.", "success"), 50);
        }
      }
      return updated;
    });
  };

  const columns: ColumnConfig<ECTeachersSpecialProgramme>[] = [
    { header: "#", accessorKey: "id", render: (item) => (filteredItems.findIndex(i => i.id === item.id) + 1).toString() },
    { header: "NATIONAL ID/ PASSPORT", accessorKey: "nationalIdPassport" },
    { header: "SURNAME", accessorKey: "surname" },
    { header: "FIRST NAME", accessorKey: "firstName" },
    { header: "SEX", accessorKey: "sex" },
    { header: "CONTRACT TYPE", accessorKey: "contractType" },
    { header: "QUALIFICATION (SPED)", accessorKey: "qualifiedInSpecialEducation" }
  ];

  return (
    <SectionContainer
      title="Teachers Special Programme Registry"
      description="Manage early childhood educators with special education qualifications."
      action={
        <AddButton 
          onClick={handleOpenAdd} 
          label="Add SPED Teacher" 
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
          <div className="p-3 bg-[#002652]/10 text-[#002652] dark:text-sky-400 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Enrolled</span>
            <span className="text-2xl font-black text-[#002652] dark:text-slate-100">{stats.total}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#000A14] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-[#00A3A3]/10 text-[#00A3A3] rounded-xl">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Top Specialization</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-100 truncate w-32 md:w-full">{stats.topSpecialization}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#000A14] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-pink-500/10 text-pink-600 dark:text-pink-400 rounded-xl">
            <User className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">By Gender</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-100">{stats.males}M / {stats.females}F</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#000A14] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-[#97620C]/10 text-[#97620C] rounded-xl">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Top Contract Type</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-100 truncate w-32 md:w-full">{stats.topContract}</span>
          </div>
        </div>
      </div>

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by ID or Name..."
        filters={[
          {
            key: "sex",
            label: "Sex",
            value: activeFilters.sex as string,
            options: SEX_OPTIONS,
            allLabel: "All Genders",
            onChange: (val) => setFilterVal("sex", val)
          },
          {
            key: "qualifiedInSpecialEducation",
            label: "Specialization",
            value: activeFilters.qualifiedInSpecialEducation as string,
            options: SPECIALIZATIONS,
            allLabel: "All Specializations",
            onChange: (val) => setFilterVal("qualifiedInSpecialEducation", val)
          },
          {
            key: "contractType",
            label: "Contract Type",
            value: activeFilters.contractType as string,
            options: CONTRACT_OPTIONS,
            allLabel: "All Contract Types",
            onChange: (val) => setFilterVal("contractType", val)
          }
        ]}
        onClear={clearFilters}
      />

      <DataTable
        data={filteredItems}
        columns={columns}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        emptyMessage="No Special Programme records found."
      />

      {/* Add/Edit Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedStaff ? "Update SPED Record" : "Enroll SPED Teacher"}
        onSubmit={handleSave}
        submitLabel={selectedStaff ? "Save Changes" : "Confirm Enrollment"}
      >
        <div className="space-y-6">
          {/* Section 1: Personal Information */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-[#002652] dark:text-[#00A3A3] border-b border-slate-200 dark:border-slate-800 pb-2">
              Section 1: Personal Information
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
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">FIRST NAME *</label>
                <input
                  type="text"
                  required
                  value={formData.firstName || ""}
                  onChange={(e) => handleFieldChange("firstName", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">NATIONALITY</label>
                <input
                  type="text"
                  value={formData.nationality || ""}
                  onChange={(e) => handleFieldChange("nationality", e.target.value)}
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
          </div>

          {/* Section 2: Programme Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-[#002652] dark:text-[#00A3A3] border-b border-slate-200 dark:border-slate-800 pb-2">
              Section 2: Programme Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">CONTRACT TYPE</label>
                <select
                  value={formData.contractType || ""}
                  onChange={(e) => handleFieldChange("contractType", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  <option value="">-- Select --</option>
                  {CONTRACT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">QUALIFIED IN (SPED) *</label>
                <select
                  required
                  value={formData.qualifiedInSpecialEducation || ""}
                  onChange={(e) => handleFieldChange("qualifiedInSpecialEducation", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  <option value="">-- Select --</option>
                  {SPECIALIZATIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
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
        title="Confirm Removal"
        onSubmit={(e) => { e.preventDefault(); handleDelete(); }}
        submitLabel="Confirm Remove"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Are you sure you want to remove the special programme record for <strong>{selectedStaff?.firstName} {selectedStaff?.surname}</strong>? 
            This action cannot be undone.
          </p>
        </div>
      </FormModal>
    </SectionContainer>
  );
};
