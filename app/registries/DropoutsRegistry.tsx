"use client";

import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Dropout } from "../types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useFilters } from "@/hooks/useFilters";
import { INITIAL_DROPOUTS } from "../constants";
import { SectionContainer } from "../shared/SectionContainer";
import { FilterBar } from "../shared/FilterBar";
import { DataTable, ColumnConfig } from "../shared/DataTable";
import { FormModal } from "../shared/FormModal";
import { AddButton } from "../shared/ActionButtons";

const REASON_OPTIONS = [
  "Abused by Parent(s)",
  "Abused by Teacher(s)",
  "Bullying",
  "Child Labor",
  "Corporal Punishment",
  "Desertion",
  "Expulsion",
  "Fees",
  "Illness",
  "Marriage",
  "Poor Performance",
  "Pregnancy",
  "Religion",
  "Substance Abuse",
  "Truancy",
  "Other"
];

const DEATH_CAUSE_OPTIONS = [
  "N/A",
  "Road Accident",
  "Fire",
  "Drowning",
  "Food poisoning",
  "Chemical ingestion",
  "Illness",
  "Homicide",
  "Suicide",
  "Other"
];

export const DropoutsRegistry: React.FC = () => {
  const { items, addItem, updateItem, deleteItem } = useLocalStorage<Dropout>(
    "dropouts",
    INITIAL_DROPOUTS
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDropout, setSelectedDropout] = useState<Dropout | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [formData, setFormData] = useState<Partial<Dropout>>({});

  const {
    searchQuery,
    setSearchQuery,
    activeFilters,
    setFilterVal,
    clearFilters,
    filteredItems
  } = useFilters<Dropout>(
    items,
    ["id", "surname", "first", "reason"],
    { reason: "All", std: "All" }
  );

  const triggerAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const filterConfigs = [
    {
      key: "reason",
      label: "Reason",
      value: activeFilters.reason || "All",
      options: REASON_OPTIONS,
      onChange: (val: string) => setFilterVal("reason", val)
    },
    {
      key: "std",
      label: "Standard",
      value: activeFilters.std || "All",
      options: ["Std 1", "Std 2", "Std 3", "Std 4", "Std 5", "Std 6", "Std 7"],
      onChange: (val: string) => setFilterVal("std", val)
    }
  ];

  const columns: ColumnConfig<Dropout>[] = [
    { header: "National ID", accessorKey: "id", className: "font-mono font-bold text-sea" },
    {
      header: "Full Name",
      render: (d) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-slate-100 truncate uppercase block">{d.surname}</span>
          <span className="text-slate-500 dark:text-slate-400 text-xs block">{d.first}</span>
        </div>
      )
    },
    { header: "Gender", accessorKey: "sex", className: "font-semibold" },
    { header: "Standard Grade", accessorKey: "std" },
    {
      header: "Primary Reason",
      render: (d) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-golden/10 text-golden uppercase">
          {d.reason}
        </span>
      )
    },
    { header: "Date Dropout", accessorKey: "date", className: "font-mono" },
    { header: "Special Needs (SPED)", accessorKey: "specialNeeds", className: "font-medium" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.surname || !formData.first) {
      triggerAlert("National ID / Passport, Surname and First Names are essential.", "error");
      return;
    }

    // Split date to Y/M/D elements for analytical reports
    let dDay: number | "" = "";
    let dMonth: number | "" = "";
    let dYear: number | "" = "";
    if (formData.date) {
      const parts = formData.date.split("-");
      if (parts.length === 3) {
        dYear = parseInt(parts[0], 10) || "";
        dMonth = parseInt(parts[1], 10) || "";
        dDay = parseInt(parts[2], 10) || "";
      }
    }

    const compiled: Dropout = {
      id: formData.id,
      surname: String(formData.surname).toUpperCase(),
      first: formData.first || "",
      nat: formData.nat || "Botswana",
      sex: (formData.sex as any) || "Male",
      dropoutDay: dDay || 10,
      dropoutMonth: dMonth || 4,
      dropoutYear: dYear || 2024,
      date: formData.date || "2024-04-10",
      std: formData.std || "Std 1",
      reason: formData.reason || "Desertion",
      deathCause: formData.deathCause || "N/A",
      specialNeeds: (formData.specialNeeds as any) || "No"
    };

    if (selectedDropout) {
      updateItem(compiled);
      triggerAlert(`Dropout profile for ${compiled.id} updated.`, "success");
    } else {
      addItem(compiled);
      triggerAlert(`Registered dropout file for student ${compiled.surname}.`, "success");
    }

    setModalOpen(false);
    setSelectedDropout(null);
    setFormData({});
  };

  const handleEditClick = (d: Dropout) => {
    setSelectedDropout(d);
    setFormData(d);
    setModalOpen(true);
  };

  const handleDeleteClick = (d: Dropout) => {
    setSelectedDropout(d);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedDropout) {
      deleteItem(selectedDropout.id);
      triggerAlert(`Successfully removed ${selectedDropout.id} from dropout files.`, "success");
      setDeleteOpen(false);
      setSelectedDropout(null);
    }
  };

  return (
    <div className="space-y-6">
      {alert && (
        <div className={`p-4 rounded border flex items-center gap-3 text-sm font-medium ${
          alert.type === "success" ? "bg-sea/10 border-sea text-sea" : "bg-golden/10 border-golden text-golden"
        }`}>
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{alert.message}</span>
        </div>
      )}

      <SectionContainer
        title="Student Dropouts Tracker"
        description="Comprehensive monitoring of student desertions, medical withdrawals, pregnancy exclusions, or structural dropouts for audit."
        action={
          <AddButton
            label="Record Student Dropout"
            onClick={() => {
              setSelectedDropout(null);
              setFormData({ 
                id: "", 
                surname: "", 
                first: "", 
                nat: "Botswana", 
                sex: "Male", 
                reason: "Desertion", 
                std: "Std 1", 
                date: "2024-04-16", 
                specialNeeds: "No", 
                deathCause: "N/A" 
              });
              setModalOpen(true);
            }}
          />
        }
      >
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filterConfigs}
          onClear={clearFilters}
        />

        <DataTable
          columns={columns}
          data={filteredItems}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          emptyMessage="No desertion or dropout listings matching active filters."
        />
      </SectionContainer>

      {/* Form Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedDropout ? "Edit Dropout Incident Record" : "Log Student Dropout Incident"}
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Student National ID *</label>
            <input
              type="text"
              required
              disabled={!!selectedDropout}
              value={formData.id || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
              placeholder="e.g. 110719001"
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-prussian"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Primary Withdrawal Reason</label>
            <select
              value={formData.reason || "Desertion"}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-prussian"
            >
              {REASON_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Surname *</label>
            <input
              type="text"
              required
              value={formData.surname || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, surname: e.target.value }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded uppercase text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-prussian"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Firstnames *</label>
            <input
              type="text"
              required
              value={formData.first || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, first: e.target.value }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-prussian"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Nationality *</label>
            <input
              type="text"
              required
              value={formData.nat || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, nat: e.target.value }))}
              placeholder="e.g. Botswana"
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-prussian"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Standard Grade</label>
            <select
              value={formData.std || "Std 1"}
              onChange={(e) => setFormData(prev => ({ ...prev, std: e.target.value }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-prussian"
            >
              {["Std 1", "Std 2", "Std 3", "Std 4", "Std 5", "Std 6", "Std 7"].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Dropout Incident Date</label>
            <input
              type="date"
              value={formData.date || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-prussian"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Does pupil have diagnosed SEN Disabilities?</label>
            <select
              value={formData.specialNeeds || "No"}
              onChange={(e) => setFormData(prev => ({ ...prev, specialNeeds: e.target.value as any }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-prussian"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Gender</label>
            <select
              value={formData.sex || "Male"}
              onChange={(e) => setFormData(prev => ({ ...prev, sex: e.target.value as any }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-prussian"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Death Cause (Specify if Death occurred)</label>
            <select
              value={formData.deathCause || "N/A"}
              onChange={(e) => setFormData(prev => ({ ...prev, deathCause: e.target.value }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-prussian"
            >
              {DEATH_CAUSE_OPTIONS.map(dc => (
                <option key={dc} value={dc}>{dc}</option>
              ))}
            </select>
          </div>
        </div>
      </FormModal>

      {/* Delete Modal */}
      <FormModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Confirm Incident deletion"
        onSubmit={(e) => {
          e.preventDefault();
          confirmDelete();
        }}
        submitLabel="Delete record"
        cancelLabel="Discard"
      >
        <div className="text-center py-4">
          <AlertCircle className="w-12 h-12 text-golden mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Delete Dropout Row?</h4>
          <p className="text-xs text-slate-500 mt-2">
            Are you sure you want to remove the incident record for <strong>{selectedDropout?.surname}</strong>?
          </p>
        </div>
      </FormModal>
    </div>
  );
};

export default DropoutsRegistry;
