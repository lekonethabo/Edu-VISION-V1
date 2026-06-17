"use client";

import React, { useState, useMemo } from "react";
import { AlertCircle, User, Users, GraduationCap, Info } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useFilters } from "@/hooks/useFilters";
import { SectionContainer } from "../shared/SectionContainer";
import { FilterBar } from "../shared/FilterBar";
import { DataTable, ColumnConfig } from "../shared/DataTable";
import { FormModal } from "../shared/FormModal";
import { AddButton } from "../shared/ActionButtons";

export interface ECGraduate {
  id: string;
  nationalIdPassport: string;
  surname: string;
  studentNames: string;
  sex: "Male" | "Female" | "";
  
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  
  specialEducationNeed: "Yes" | "No" | "";
  graduated: "Yes" | "No" | "";
  
  lastUpdated: string;
}

const SEX_OPTIONS = ["Male", "Female"];
const YES_NO_OPTIONS = ["Yes", "No"];

export const EarlyChildhoodGraduationRegistry: React.FC = () => {
  const { items, addItem, updateItem, deleteItem } = useLocalStorage<ECGraduate>(
    "edu_vision_ec_graduates",
    []
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedGraduate, setSelectedGraduate] = useState<ECGraduate | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const {
    searchQuery,
    setSearchQuery,
    activeFilters,
    setFilterVal,
    clearFilters,
    filteredItems
  } = useFilters<ECGraduate>(items, ["nationalIdPassport", "surname", "studentNames"]);

  if (activeFilters.sex === undefined) {
    setFilterVal("sex", "");
  }
  if (activeFilters.specialEducationNeed === undefined) {
    setFilterVal("specialEducationNeed", "");
  }

  const getComputedAge = (dobYear: string) => {
    if (!dobYear) return 0;
    const currentYear = new Date().getFullYear();
    return Math.max(0, currentYear - parseInt(dobYear));
  };

  const getFormattedDOB = (d: string, m: string, y: string) => {
    if (!d || !m || !y) return "N/A";
    return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
  };

  const triggerAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const stats = useMemo(() => {
    let males = 0;
    let females = 0;
    let withSen = 0;
    let totalGraduated = 0;

    items.forEach(g => {
      if (g.graduated === "Yes") {
        totalGraduated++;
        if (g.sex === "Male") males++;
        if (g.sex === "Female") females++;
        if (g.specialEducationNeed === "Yes") withSen++;
      }
    });

    return {
      totalGraduated,
      males,
      females,
      withSen
    };
  }, [items]);

  const defaultFormState: Partial<ECGraduate> = {
    nationalIdPassport: "",
    surname: "",
    studentNames: "",
    sex: "",
    dobDay: "",
    dobMonth: "",
    dobYear: "",
    specialEducationNeed: "No",
    graduated: "Yes"
  };

  const [formData, setFormData] = useState<Partial<ECGraduate>>(defaultFormState);

  const handleOpenAdd = () => {
    setSelectedGraduate(null);
    setFormData(defaultFormState);
    setModalOpen(true);
  };

  const handleOpenEdit = (graduate: ECGraduate) => {
    setSelectedGraduate(graduate);
    setFormData({ ...graduate });
    setModalOpen(true);
  };

  const handleOpenDelete = (graduate: ECGraduate) => {
    setSelectedGraduate(graduate);
    setDeleteOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nationalIdPassport || !formData.surname || !formData.studentNames || !formData.graduated) {
      triggerAlert("Please fill in all required fields.", "error");
      return;
    }

    const dataToSave: ECGraduate = {
      ...(formData as ECGraduate),
      lastUpdated: new Date().toISOString()
    };

    if (selectedGraduate) {
      updateItem(dataToSave);
      triggerAlert(`Graduate record updated.`, "success");
    } else {
      addItem({ ...dataToSave, id: `grad-${Date.now()}` });
      triggerAlert(`Graduate record added successfully.`, "success");
    }

    setModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedGraduate) {
      deleteItem(selectedGraduate.id);
      triggerAlert(`Graduate record deleted.`, "success");
      setDeleteOpen(false);
    }
  };

  const handleFieldChange = (field: keyof ECGraduate, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNumberInput = (field: keyof ECGraduate, value: string, maxLen?: number) => {
    let numVal = value.replace(/\D/g, "");
    if (maxLen && numVal.length > maxLen) {
      numVal = numVal.slice(0, maxLen);
    }
    setFormData(prev => ({ ...prev, [field]: numVal }));
  }

  const columns: ColumnConfig<ECGraduate>[] = [
    { header: "#", accessorKey: "id", render: (item) => (filteredItems.findIndex(i => i.id === item.id) + 1).toString() },
    { header: "NATIONAL ID/ PASSPORT", accessorKey: "nationalIdPassport" },
    { header: "SURNAME", accessorKey: "surname" },
    { header: "STUDENT NAMES", accessorKey: "studentNames" },
    { header: "SEX", accessorKey: "sex" },
    { header: "AGE", accessorKey: "dobYear", render: (s) => getComputedAge(s.dobYear).toString() },
    { header: "SPECIAL EDUCATION NEED", accessorKey: "specialEducationNeed" },
    { 
      header: "GRADUATED", 
      accessorKey: "graduated",
      render: (s) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${s.graduated === "Yes" ? "bg-[#00A3A3]/20 text-[#00A3A3]" : "bg-rose-500/10 text-rose-500"}`}>
          {s.graduated}
        </span>
      )
    }
  ];

  return (
    <SectionContainer
      title="Pre-Primary Graduation Registry"
      description="Manage records of toddlers completing early childhood education."
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
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Graduates</span>
            <span className="text-2xl font-black text-[#002652] dark:text-slate-100">{stats.totalGraduated}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#000A14] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Male Graduates</span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{stats.males}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#000A14] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-pink-500/10 text-pink-600 dark:text-pink-400 rounded-xl">
            <User className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Female Graduates</span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{stats.females}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#000A14] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-[#97620C]/10 text-[#97620C] rounded-xl">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">With SEN</span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{stats.withSen}</span>
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
              key: "sex",
              label: "Sex",
              value: activeFilters.sex as string,
              options: ["All Genders", ...SEX_OPTIONS],
              onChange: (val) => setFilterVal("sex", val)
            },
            {
              key: "specialEducationNeed",
              label: "SEN",
              value: activeFilters.specialEducationNeed as string,
              options: ["All Status", ...YES_NO_OPTIONS],
              onChange: (val) => setFilterVal("specialEducationNeed", val)
            }
          ]}
          onClear={clearFilters}
        />
        <AddButton 
          onClick={handleOpenAdd} 
          label="Log Graduate" 
          className="bg-[#00A3A3] hover:bg-[#002652] text-white" 
        />
      </div>

      <DataTable
        data={filteredItems}
        columns={columns}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        emptyMessage="No graduation records found."
      />

      {/* Add/Edit Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedGraduate ? "Update Graduate Record" : "Log Graduation Event"}
        onSubmit={handleSave}
        submitLabel={selectedGraduate ? "Save Changes" : "Confirm Graduation"}
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
            </div>
          </div>

          {/* Section 2: Date of Birth */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
                <h4 className="text-xs font-black uppercase text-[#002652] dark:text-[#00A3A3]">
                Section 2: Date of Birth
                </h4>
                <div className="bg-[#002652]/10 text-[#002652] dark:bg-[#00A3A3]/20 dark:text-[#00A3A3] px-3 py-1 rounded-full text-[10px] font-bold">
                    Computed Age: {getComputedAge(formData.dobYear || "")} yrs | DOB: {getFormattedDOB(formData.dobDay || "", formData.dobMonth || "", formData.dobYear || "")}
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">DAY *</label>
                <input
                  type="text"
                  required
                  placeholder="DD"
                  value={formData.dobDay}
                  onChange={(e) => handleNumberInput("dobDay", e.target.value, 2)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">MONTH *</label>
                <input
                  type="text"
                  required
                  placeholder="MM"
                  value={formData.dobMonth}
                  onChange={(e) => handleNumberInput("dobMonth", e.target.value, 2)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">YEAR *</label>
                <input
                  type="text"
                  required
                  placeholder="YYYY"
                  value={formData.dobYear}
                  onChange={(e) => handleNumberInput("dobYear", e.target.value, 4)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Graduation Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-[#002652] dark:text-[#00A3A3] border-b border-slate-200 dark:border-slate-800 pb-2">
              Section 3: Graduation Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">SPECIAL EDUCATION NEED</label>
                <select
                  value={formData.specialEducationNeed}
                  onChange={(e) => handleFieldChange("specialEducationNeed", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  <option value="">-- Select --</option>
                  {YES_NO_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">GRADUATED *</label>
                <select
                  value={formData.graduated}
                  onChange={(e) => handleFieldChange("graduated", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  <option value="">-- Select --</option>
                  {YES_NO_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
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
            Are you sure you want to delete the graduation record for <strong>{selectedGraduate?.studentNames} {selectedGraduate?.surname}</strong>? 
            This action cannot be undone.
          </p>
        </div>
      </FormModal>
    </SectionContainer>
  );
};
