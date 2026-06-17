"use client";

import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Transfer } from "../types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useFilters } from "@/hooks/useFilters";
import { INITIAL_TRANSFERS } from "../constants";
import { SectionContainer } from "../shared/SectionContainer";
import { FilterBar } from "../shared/FilterBar";
import { DataTable, ColumnConfig } from "../shared/DataTable";
import { FormModal } from "../shared/FormModal";
import { AddButton } from "../shared/ActionButtons";

export const TransfersRegistry: React.FC = () => {
  const { items, addItem, updateItem, deleteItem } = useLocalStorage<Transfer>(
    "transfers",
    INITIAL_TRANSFERS
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [formData, setFormData] = useState<Partial<Transfer>>({});

  const {
    searchQuery,
    setSearchQuery,
    activeFilters,
    setFilterVal,
    clearFilters,
    filteredItems
  } = useFilters<Transfer>(
    items,
    ["id", "surname", "first", "prev"],
    { status: "All", std: "All" }
  );

  const triggerAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const filterConfigs = [
    {
      key: "status",
      label: "Direction",
      value: activeFilters.status || "All",
      options: ["Transfer In", "Transfer Out"],
      onChange: (val: string) => setFilterVal("status", val)
    },
    {
      key: "std",
      label: "Standard",
      value: activeFilters.std || "All",
      options: ["Std 1", "Std 2", "Std 3", "Std 4", "Std 5", "Std 6", "Std 7"],
      onChange: (val: string) => setFilterVal("std", val)
    }
  ];

  const columns: ColumnConfig<Transfer>[] = [
    { header: "National ID", accessorKey: "id", className: "font-mono font-bold text-sea" },
    {
      header: "Full Name",
      render: (t) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-slate-100 truncate uppercase block">{t.surname}</span>
          <span className="text-slate-500 dark:text-slate-400 text-xs block">{t.first}</span>
        </div>
      )
    },
    { header: "Gender", accessorKey: "sex", className: "font-semibold" },
    { header: "Standard Grade", accessorKey: "std" },
    {
      header: "Directional Flag",
      render: (t) => (
        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
          t.status === "Transfer In" ? "bg-emerald-100 text-emerald-800" : "bg-orange-100 text-orange-850"
        }`}>
          {t.status}
        </span>
      )
    },
    { header: "Prev/Target School", accessorKey: "prev", className: "font-medium" },
    { header: "Transfer Date", accessorKey: "date", className: "font-mono" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.surname || !formData.first) {
      triggerAlert("Student National ID, Surname, and First names are required.", "error");
      return;
    }

    const compiled: Transfer = {
      id: formData.id,
      surname: String(formData.surname).toUpperCase(),
      first: formData.first || "",
      nat: formData.nat || "Botswana",
      sex: formData.sex || "Female",
      dobDay: formData.dobDay || 1,
      dobMonth: formData.dobMonth || 1,
      dobYear: formData.dobYear || 2015,
      std: formData.std || "Std 1",
      status: formData.status || "Transfer In",
      transferDay: formData.transferDay || 10,
      transferMonth: formData.transferMonth || 1,
      transferYear: formData.transferYear || 2024,
      date: formData.date || "2024-01-10",
      prev: formData.prev || "N/A"
    };

    if (selectedTransfer) {
      updateItem(compiled);
      triggerAlert(`Transfer record for ${compiled.id} updated.`, "success");
    } else {
      addItem(compiled);
      triggerAlert(`Added transfer record for ${compiled.surname}.`, "success");
    }

    setModalOpen(false);
    setSelectedTransfer(null);
    setFormData({});
  };

  const handleEditClick = (t: Transfer) => {
    setSelectedTransfer(t);
    setFormData(t);
    setModalOpen(true);
  };

  const handleDeleteClick = (t: Transfer) => {
    setSelectedTransfer(t);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedTransfer) {
      deleteItem(selectedTransfer.id);
      triggerAlert(`Completed removal of transfer file ${selectedTransfer.id}`, "success");
      setDeleteOpen(false);
      setSelectedTransfer(null);
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
        title="Student Transfers Registry"
        description="Core operative tracking systems detailing intra-regional and inter-district pupil transfers in & out of school nodes."
        action={
          <AddButton
            label="Record Transfer File"
            onClick={() => {
              setSelectedTransfer(null);
              setFormData({ sex: "Female", status: "Transfer In", std: "Std 1", date: "2024-01-09" });
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
          emptyMessage="No school pupil transfer records match specified filters."
        />
      </SectionContainer>

      {/* Form Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedTransfer ? "Edit Student Transfer File" : "Record Pupil Transfer Ledger"}
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Student National ID *</label>
            <input
              type="text"
              required
              disabled={!!selectedTransfer}
              value={formData.id || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
              placeholder="e.g. 382321228"
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Transfer Type / Status</label>
            <select
              value={formData.status || "Transfer In"}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
            >
              <option value="Transfer In">Transfer In (Incoming Student)</option>
              <option value="Transfer Out">Transfer Out (Outgoing Student)</option>
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
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Standard Grade</label>
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
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Previous / Target Institution</label>
            <input
              type="text"
              value={formData.prev || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, prev: e.target.value }))}
              placeholder="e.g. Kgomodiatshaba Primary"
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Transfer Date</label>
            <input
              type="date"
              value={formData.date || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
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

      {/* Delete Confirmation */}
      <FormModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Confirm Deletion of Transfer Registry File"
        onSubmit={(e) => {
          e.preventDefault();
          confirmDelete();
        }}
        submitLabel="Delete File"
        cancelLabel="Keep"
      >
        <div className="text-center py-4">
          <AlertCircle className="w-12 h-12 text-golden mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Confirm Ledger Row Deletion?</h4>
          <p className="text-xs text-slate-500 mt-2">
            Are you sure you want to delete the transfer entry for <strong>{selectedTransfer?.surname} ({selectedTransfer?.id})</strong>?
          </p>
        </div>
      </FormModal>
    </div>
  );
};

export default TransfersRegistry;
