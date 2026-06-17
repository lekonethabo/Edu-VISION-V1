"use client";

import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import { ReEntrant } from "../types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useFilters } from "@/hooks/useFilters";
import { INITIAL_RE_ENTRANTS } from "../constants";
import { SectionContainer } from "../shared/SectionContainer";
import { FilterBar } from "../shared/FilterBar";
import { DataTable, ColumnConfig } from "../shared/DataTable";
import { FormModal } from "../shared/FormModal";
import { AddButton } from "../shared/ActionButtons";

export const ReEntrantsRegistry: React.FC = () => {
  const { items, addItem, updateItem, deleteItem } = useLocalStorage<ReEntrant>(
    "re_entrants",
    INITIAL_RE_ENTRANTS
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedReEntrant, setSelectedReEntrant] = useState<ReEntrant | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [formData, setFormData] = useState<Partial<ReEntrant>>({});

  const {
    searchQuery,
    setSearchQuery,
    activeFilters,
    setFilterVal,
    clearFilters,
    filteredItems
  } = useFilters<ReEntrant>(
    items,
    ["id", "surname", "first", "reasonDropped"],
    { std: "All" }
  );

  const triggerAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const filterConfigs = [
    {
      key: "std",
      label: "Standard",
      value: activeFilters.std || "All",
      options: ["Std 1", "Std 2", "Std 3", "Std 4", "Std 5", "Std 6", "Std 7"],
      onChange: (val: string) => setFilterVal("std", val)
    }
  ];

  const columns: ColumnConfig<ReEntrant>[] = [
    { header: "National ID", accessorKey: "id", className: "font-mono font-bold text-sea" },
    {
      header: "Full Name",
      render: (r) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-slate-100 truncate uppercase block">{r.surname}</span>
          <span className="text-slate-500 dark:text-slate-400 text-xs block">{r.first}</span>
        </div>
      )
    },
    { header: "Gender", accessorKey: "sex", className: "font-semibold" },
    { header: "Current Standard", accessorKey: "std" },
    { header: "Date Re-entered", accessorKey: "date", className: "font-mono" },
    { header: "Yr Dropped Out", accessorKey: "yearDroppedOut", className: "text-center font-mono" },
    { header: "Former Drop Cause", accessorKey: "reasonDropped", className: "text-amber-800 dark:text-amber-400 font-semibold uppercase" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.surname || !formData.first) {
      triggerAlert("National ID / Passport, Surname and First Names are essential.", "error");
      return;
    }

    const compiled: ReEntrant = {
      id: formData.id,
      surname: String(formData.surname).toUpperCase(),
      first: formData.first || "",
      nat: formData.nat || "Botswana",
      sex: formData.sex || "Female",
      reEnterDay: formData.reEnterDay || 15,
      reEnterMonth: formData.reEnterMonth || 1,
      reEnterYear: formData.reEnterYear || 2025,
      date: formData.date || "2025-01-15",
      std: formData.std || "Std 1",
      reasonDropped: formData.reasonDropped || "Desertion",
      yearDroppedOut: Number(formData.yearDroppedOut) || 2024
    };

    if (selectedReEntrant) {
      updateItem(compiled);
      triggerAlert(`Re-Entrant record successfully updated.`, "success");
    } else {
      addItem(compiled);
      triggerAlert(`Created new re-integration file for ${compiled.surname}.`, "success");
    }

    setModalOpen(false);
    setSelectedReEntrant(null);
    setFormData({});
  };

  const handleEditClick = (r: ReEntrant) => {
    setSelectedReEntrant(r);
    setFormData(r);
    setModalOpen(true);
  };

  const handleDeleteClick = (r: ReEntrant) => {
    setSelectedReEntrant(r);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedReEntrant) {
      deleteItem(selectedReEntrant.id);
      triggerAlert(`Completed removal of re-entrant file ${selectedReEntrant.id}`, "success");
      setDeleteOpen(false);
      setSelectedReEntrant(null);
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
        title="Student Re-Entrants Ledger"
        description="Statutory dashboard documenting the scholastic re-integration of students returning to school following temporary dropout."
        action={
          <AddButton
            label="Log Re-Entry Student"
            onClick={() => {
              setSelectedReEntrant(null);
              setFormData({ sex: "Female", std: "Std 1", date: "2025-01-15", yearDroppedOut: 2024, reasonDropped: "Desertion" });
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
          emptyMessage="No re-entrant student files matched specify filters."
        />
      </SectionContainer>

      {/* Form Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedReEntrant ? "Edit Re-Entrant Record" : "Log Student Re-Integration"}
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Student National ID *</label>
            <input
              type="text"
              required
              disabled={!!selectedReEntrant}
              value={formData.id || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
              placeholder="e.g. 901112345"
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Former Drop Reason</label>
            <select
              value={formData.reasonDropped || "Desertion"}
              onChange={(e) => setFormData(prev => ({ ...prev, reasonDropped: e.target.value }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-prussian"
            >
              {[
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
              ].map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Surname *</label>
            <input
              type="text"
              required
              value={formData.surname || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, surname: e.target.value }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Firstnames *</label>
            <input
              type="text"
              required
              value={formData.first || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, first: e.target.value }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Standard Grade Assigned</label>
            <select
              value={formData.std || "Std 1"}
              onChange={(e) => setFormData(prev => ({ ...prev, std: e.target.value }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
            >
              {["Std 1", "Std 2", "Std 3", "Std 4", "Std 5", "Std 6", "Std 7"].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Re-Entry Effective Date</label>
            <input
              type="date"
              value={formData.date || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Year of Dropout</label>
            <input
              type="number"
              value={formData.yearDroppedOut || 2024}
              onChange={(e) => setFormData(prev => ({ ...prev, yearDroppedOut: Number(e.target.value) }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Gender</label>
            <select
              value={formData.sex || "Female"}
              onChange={(e) => setFormData(prev => ({ ...prev, sex: e.target.value as any }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
      </FormModal>

      {/* Delete Modal */}
      <FormModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Confirm Removal of Re-entrant row"
        onSubmit={(e) => {
          e.preventDefault();
          confirmDelete();
        }}
        submitLabel="Delete record"
        cancelLabel="Discard"
      >
        <div className="text-center py-4">
          <AlertCircle className="w-12 h-12 text-golden mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Delete Re-Entrant Row File?</h4>
          <p className="text-xs text-slate-500 mt-2">
            Are you sure you want to delete the file for <strong>{selectedReEntrant?.surname}</strong>?
          </p>
        </div>
      </FormModal>
    </div>
  );
};

export default ReEntrantsRegistry;
