"use client";

import React, { useState, useMemo, useEffect } from "react";
import { AlertCircle, UserMinus, UserPlus, ArrowLeftRight, Activity } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useFilters } from "@/hooks/useFilters";
import { SectionContainer } from "../shared/SectionContainer";
import { FilterBar } from "../shared/FilterBar";
import { DataTable, ColumnConfig } from "../shared/DataTable";
import { FormModal } from "../shared/FormModal";
import { AddButton } from "../shared/ActionButtons";
import { ECStudent } from "./EarlyChildhoodStudentsRegistry";

export interface ECTransfer {
  id: string;
  nationalIdPassport: string;
  surname: string;
  studentNames: string;
  nationality: string;
  sex: "Male" | "Female" | "";
  
  categoryLevel: string;
  transferStatus: "Transfer In" | "Transfer Out" | "";
  dateOfTransferDay: string;
  dateOfTransferMonth: string;
  dateOfTransferYear: string;
  
  previousSchool: string;
  
  lastUpdated: string;
}

const CATEGORY_LEVEL_OPTIONS = ["Baby", "Middle", "Pre-Unit"];
const SEX_OPTIONS = ["Male", "Female"];
const NATIONALITY_OPTIONS = ["Citizen", "Non-Citizen"];
const TRANSFER_STATUS_OPTIONS = ["Transfer In", "Transfer Out"];

export const EarlyChildhoodTransfersRegistry: React.FC = () => {
  const { items, addItem, updateItem, deleteItem } = useLocalStorage<ECTransfer>(
    "edu_vision_ec_transfers",
    []
  );

  const { items: studentsList } = useLocalStorage<ECStudent>("edu_vision_ec_students", []);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<ECTransfer | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const {
    searchQuery,
    setSearchQuery,
    activeFilters,
    setFilterVal,
    clearFilters,
    filteredItems
  } = useFilters<ECTransfer>(items, ["nationalIdPassport", "surname", "studentNames"]);

  // Set default filters safely
  if (activeFilters.categoryLevel === undefined) {
    setFilterVal("categoryLevel", "");
  }
  if (activeFilters.transferStatus === undefined) {
    setFilterVal("transferStatus", "");
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
    let transferIn = 0;
    let transferOut = 0;

    items.forEach(t => {
      if (t.transferStatus === "Transfer In") transferIn++;
      if (t.transferStatus === "Transfer Out") transferOut++;
    });

    return {
      total: items.length,
      transferIn,
      transferOut,
      netChange: transferIn - transferOut
    };
  }, [items]);

  const defaultFormState: Partial<ECTransfer> = {
    nationalIdPassport: "",
    surname: "",
    studentNames: "",
    nationality: "Citizen",
    sex: "",
    categoryLevel: "Pre-Unit",
    transferStatus: "Transfer In",
    dateOfTransferDay: "",
    dateOfTransferMonth: "",
    dateOfTransferYear: "",
    previousSchool: ""
  };

  const [formData, setFormData] = useState<Partial<ECTransfer>>(defaultFormState);

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
    setSelectedTransfer(null);
    setFormData(defaultFormState);
    setModalOpen(true);
  };

  const handleOpenEdit = (transfer: ECTransfer) => {
    setSelectedTransfer(transfer);
    setFormData({ ...transfer });
    setModalOpen(true);
  };

  const handleOpenDelete = (transfer: ECTransfer) => {
    setSelectedTransfer(transfer);
    setDeleteOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nationalIdPassport || !formData.surname || !formData.studentNames || !formData.transferStatus) {
      triggerAlert("Please fill in all required fields.", "error");
      return;
    }

    const dataToSave: ECTransfer = {
      ...(formData as ECTransfer),
      lastUpdated: new Date().toISOString()
    };

    if (dataToSave.transferStatus !== "Transfer In") {
      dataToSave.previousSchool = "";
    }

    if (selectedTransfer) {
      updateItem(dataToSave);
      triggerAlert(`Transfer record updated.`, "success");
    } else {
      addItem({ ...dataToSave, id: `tr-${Date.now()}` });
      triggerAlert(`Transfer record added successfully.`, "success");
    }

    setModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedTransfer) {
      deleteItem(selectedTransfer.id);
      triggerAlert(`Transfer record deleted.`, "success");
      setDeleteOpen(false);
    }
  };

  const handleFieldChange = (field: keyof ECTransfer, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNumberInput = (field: keyof ECTransfer, value: string, maxLen?: number) => {
    let numVal = value.replace(/\D/g, "");
    if (maxLen && numVal.length > maxLen) {
      numVal = numVal.slice(0, maxLen);
    }
    setFormData(prev => ({ ...prev, [field]: numVal }));
  }

  const columns: ColumnConfig<ECTransfer>[] = [
    { header: "#", accessorKey: "id", render: (item) => (filteredItems.findIndex(i => i.id === item.id) + 1).toString() },
    { header: "NATIONAL ID/ PASSPORT", accessorKey: "nationalIdPassport" },
    { header: "SURNAME", accessorKey: "surname" },
    { header: "STUDENT NAMES", accessorKey: "studentNames" },
    { header: "CATEGORY/ LEVEL", accessorKey: "categoryLevel" },
    { 
      header: "TRANSFER STATUS", 
      accessorKey: "transferStatus",
      render: (s) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${s.transferStatus === "Transfer In" ? "bg-[#00A3A3]/20 text-[#00A3A3]" : "bg-amber-500/10 text-amber-500"}`}>
          {s.transferStatus}
        </span>
      )
    },
    { header: "DATE OF TRANSFER", accessorKey: "dateOfTransferYear", render: (s) => getFormattedDate(s.dateOfTransferDay, s.dateOfTransferMonth, s.dateOfTransferYear) },
    { header: "PREVIOUS SCHOOL", accessorKey: "previousSchool" }
  ];

  return (
    <SectionContainer
      title="Early Childhood Transfers Registry"
      description="Manage records of toddlers transferring in and out of the centre."
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
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Transfers</span>
            <span className="text-2xl font-black text-[#002652] dark:text-slate-100">{stats.total}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#000A14] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Transfer In</span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{stats.transferIn}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#000A14] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
            <UserMinus className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Transfer Out</span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{stats.transferOut}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#000A14] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-[#97620C]/10 text-[#97620C] rounded-xl">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Net Change</span>
            <span className={`text-2xl font-black ${stats.netChange >= 0 ? "text-[#00A3A3]" : "text-amber-500"}`}>
              {stats.netChange > 0 ? "+" : ""}{stats.netChange}
            </span>
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
              key: "categoryLevel",
              label: "Category/Level",
              value: activeFilters.categoryLevel as string,
              options: ["All Levels", ...CATEGORY_LEVEL_OPTIONS],
              onChange: (val) => setFilterVal("categoryLevel", val)
            },
            {
              key: "transferStatus",
              label: "Transfer Status",
              value: activeFilters.transferStatus as string,
              options: ["All Statuses", ...TRANSFER_STATUS_OPTIONS],
              onChange: (val) => setFilterVal("transferStatus", val)
            }
          ]}
          onClear={clearFilters}
        />
        <AddButton 
          onClick={handleOpenAdd} 
          label="Log Transfer" 
          className="bg-[#00A3A3] hover:bg-[#002652] text-white" 
        />
      </div>

      <DataTable
        data={filteredItems}
        columns={columns}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        emptyMessage="No transfer records found."
      />

      {/* Add/Edit Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedTransfer ? "Update Transfer Record" : "Log Transfer Event"}
        onSubmit={handleSave}
        submitLabel={selectedTransfer ? "Save Changes" : "Confirm Transfer"}
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

          {/* Section 2: Transfer Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-[#002652] dark:text-[#00A3A3] border-b border-slate-200 dark:border-slate-800 pb-2">
              Section 2: Transfer Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">CATEGORY/ LEVEL</label>
                <select
                  value={formData.categoryLevel}
                  onChange={(e) => handleFieldChange("categoryLevel", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  {CATEGORY_LEVEL_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">TRANSFER STATUS</label>
                <select
                  value={formData.transferStatus}
                  onChange={(e) => handleFieldChange("transferStatus", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  {TRANSFER_STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">TRANSFER DAY</label>
                <input
                  type="text"
                  placeholder="DD"
                  value={formData.dateOfTransferDay}
                  onChange={(e) => handleNumberInput("dateOfTransferDay", e.target.value, 2)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">TRANSFER MONTH</label>
                <input
                  type="text"
                  placeholder="MM"
                  value={formData.dateOfTransferMonth}
                  onChange={(e) => handleNumberInput("dateOfTransferMonth", e.target.value, 2)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">TRANSFER YEAR</label>
                <input
                  type="text"
                  placeholder="YYYY"
                  value={formData.dateOfTransferYear}
                  onChange={(e) => handleNumberInput("dateOfTransferYear", e.target.value, 4)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Previous School (Conditional) */}
          {formData.transferStatus === "Transfer In" && (
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase text-[#002652] dark:text-[#00A3A3] border-b border-slate-200 dark:border-slate-800 pb-2">
                Section 3: Previous School
              </h4>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">PREVIOUS SCHOOL, IF TRANSFERRED IN</label>
                <input
                  type="text"
                  value={formData.previousSchool}
                  onChange={(e) => handleFieldChange("previousSchool", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
            </div>
          )}
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
            Are you sure you want to delete the transfer record for <strong>{selectedTransfer?.studentNames} {selectedTransfer?.surname}</strong>? 
            This action cannot be undone.
          </p>
        </div>
      </FormModal>
    </SectionContainer>
  );
};
