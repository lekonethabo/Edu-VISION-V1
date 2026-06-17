"use client";

import React, { useState } from "react";
import { AlertCircle, ShieldAlert } from "lucide-react";
import { AbusedStudent } from "../types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useFilters } from "@/hooks/useFilters";
import { INITIAL_ABUSED_STUDENTS } from "../constants";
import { SectionContainer } from "../shared/SectionContainer";
import { FilterBar } from "../shared/FilterBar";
import { DataTable, ColumnConfig } from "../shared/DataTable";
import { FormModal } from "../shared/FormModal";
import { AddButton } from "../shared/ActionButtons";

const SOCIAL_STATUS_OPTIONS = ["Ordinary", "Orphan", "Needy", "Orphan & Needy", "Vulnerable"];

export const AbusedStudentsRegistry: React.FC = () => {
  const { items, addItem, updateItem, deleteItem } = useLocalStorage<AbusedStudent>(
    "abused_students",
    INITIAL_ABUSED_STUDENTS
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<AbusedStudent | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [formData, setFormData] = useState<Partial<AbusedStudent>>({});

  const {
    searchQuery,
    setSearchQuery,
    activeFilters,
    setFilterVal,
    clearFilters,
    filteredItems
  } = useFilters<AbusedStudent>(
    items,
    ["id", "surname", "first", "typesOfAbuse"],
    { typesOfAbuse: "All" }
  );

  const triggerAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const filterConfigs = [
    {
      key: "typesOfAbuse",
      label: "Social Status",
      value: activeFilters.typesOfAbuse || "All",
      options: SOCIAL_STATUS_OPTIONS,
      onChange: (val: string) => setFilterVal("typesOfAbuse", val)
    }
  ];

  const columns: ColumnConfig<AbusedStudent>[] = [
    { header: "National ID", accessorKey: "id", className: "font-mono font-bold text-sea" },
    {
      header: "Full Name",
      render: (a) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-slate-100 truncate uppercase block">{a.surname}</span>
          <span className="text-slate-500 dark:text-slate-400 text-xs block">{a.first}</span>
        </div>
      )
    },
    { header: "Gender", accessorKey: "sex", className: "font-semibold" },
    { header: "Standard Grade", accessorKey: "std" },
    {
      header: "Student Social Status",
      render: (a) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase">
          {a.typesOfAbuse || "Ordinary"}
        </span>
      )
    },
    {
      header: "Abuse Types Flagged",
      render: (a) => {
        const types: string[] = [];
        if (a.abuseBullying === "Yes") types.push("Bullying");
        if (a.abuseCorporal === "Yes") types.push("Corporal Punishment");
        if (a.abuseHarassment === "Yes") types.push("Sexual Harassment");
        if (a.abuseSexual === "Yes") types.push("Sexual Abuse");
        if (a.abuseViolence === "Yes") types.push("Violence");

        return (
          <div className="flex flex-wrap gap-1 max-w-[220px]">
            {types.length > 0 ? (
              types.map((t) => (
                <span
                  key={t}
                  className="px-1.5 py-0.5 rounded-sm text-[9px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 uppercase tracking-tight whitespace-nowrap"
                >
                  {t}
                </span>
              ))
            ) : (
              <span className="text-slate-400 dark:text-slate-500 text-[10px] italic">None flagged</span>
            )}
          </div>
        );
      }
    },
    { header: "Report Date", accessorKey: "dateReported", className: "font-mono" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.surname || !formData.first) {
      triggerAlert("National ID / Passport, Surname and First Names are essential.", "error");
      return;
    }

    const compiled: AbusedStudent = {
      id: formData.id,
      surname: String(formData.surname).toUpperCase(),
      first: formData.first || "",
      nat: formData.nat || "Botswana",
      sex: formData.sex || "Female",
      reportDay: formData.reportDay || 10,
      reportMonth: formData.reportMonth || 5,
      reportYear: formData.reportYear || 2024,
      dateReported: formData.dateReported || "2024-05-10",
      std: formData.std || "Std 1",
      typesOfAbuse: formData.typesOfAbuse || "Ordinary",
      abuseBullying: formData.abuseBullying || "No",
      abuseCorporal: formData.abuseCorporal || "No",
      abuseHarassment: formData.abuseHarassment || "No",
      abuseSexual: formData.abuseSexual || "No",
      abuseViolence: formData.abuseViolence || "No"
    };

    if (selectedIncident) {
      updateItem(compiled);
      triggerAlert(`Incident profile for ${compiled.id} updated.`, "success");
    } else {
      addItem(compiled);
      triggerAlert(`Logged new child protection report for student ${compiled.surname}.`, "success");
    }

    setModalOpen(false);
    setSelectedIncident(null);
    setFormData({});
  };

  const handleEditClick = (a: AbusedStudent) => {
    setSelectedIncident(a);
    setFormData(a);
    setModalOpen(true);
  };

  const handleDeleteClick = (a: AbusedStudent) => {
    setSelectedIncident(a);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedIncident) {
      deleteItem(selectedIncident.id);
      triggerAlert(`Successfully removed ${selectedIncident.id} from ledger.`, "success");
      setDeleteOpen(false);
      setSelectedIncident(null);
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

      {/* Security alert header */}
      <div className="p-3 bg-red-100/40 text-red-800 dark:bg-rose-950/20 dark:text-rose-400 border border-red-200 dark:border-rose-900 rounded flex gap-2.5 items-center text-xs font-semibold">
        <ShieldAlert className="w-4 h-4 flex-shrink-0 text-red-600 dark:text-rose-500 animate-pulse" />
        <span>CONFIDENTIAL ACCESS CONTROLLED: Child protection reports and abuse logs contain highly sensitive, regulated records. Securely report incidents immediately.</span>
      </div>

      <SectionContainer
        title="Child Welfare Protection Registry"
        description="Encrypted administrative registry cataloging student physical violence, bullying, or negligence reports."
        action={
          <AddButton
            label="Log Abuse Incident"
            onClick={() => {
              setSelectedIncident(null);
              setFormData({ 
                sex: "Female", 
                typesOfAbuse: "Ordinary", 
                std: "Std 1", 
                dateReported: new Date().toISOString().split("T")[0],
                abuseBullying: "No",
                abuseCorporal: "No",
                abuseHarassment: "No",
                abuseSexual: "No",
                abuseViolence: "No"
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
          emptyMessage="No confidential protection logs registered under active filter set."
        />
      </SectionContainer>

      {/* Form Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedIncident ? "Edit Abuse incident File" : "Record Child Protection Report"}
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Student National ID *</label>
            <input
              type="text"
              required
              disabled={!!selectedIncident}
              value={formData.id || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
              placeholder="e.g. 083820022"
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Student Social Status</label>
            <select
              value={formData.typesOfAbuse || "Ordinary"}
              onChange={(e) => setFormData(prev => ({ ...prev, typesOfAbuse: e.target.value as any }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-800 dark:text-slate-100"
            >
              {SOCIAL_STATUS_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Surname *</label>
            <input
              type="text"
              required
              value={formData.surname || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, surname: e.target.value }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded uppercase text-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Firstnames *</label>
            <input
              type="text"
              required
              value={formData.first || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, first: e.target.value }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Standard Grade Assigned</label>
            <select
              value={formData.std || "Std 1"}
              onChange={(e) => setFormData(prev => ({ ...prev, std: e.target.value }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-800 dark:text-slate-100"
            >
              {["Std 1", "Std 2", "Std 3", "Std 4", "Std 5", "Std 6", "Std 7"].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Incident Report Date</label>
            <input
              type="date"
              value={formData.dateReported || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, dateReported: e.target.value }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Gender</label>
            <select
              value={formData.sex || "Female"}
              onChange={(e) => setFormData(prev => ({ ...prev, sex: e.target.value as any }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-800 dark:text-slate-100"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="col-span-1 md:col-span-2 border-t border-slate-250 dark:border-slate-800 pt-4 mt-2">
            <h4 className="text-xs font-black uppercase tracking-widest text-prussian dark:text-sea mb-3">
              Confidential Abuse Types (Yes/No evaluation)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Bullying</label>
                <select
                  value={formData.abuseBullying || "No"}
                  onChange={(e) => setFormData(prev => ({ ...prev, abuseBullying: e.target.value as any }))}
                  className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-prussian"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Abuse of Corp.</label>
                <select
                  value={formData.abuseCorporal || "No"}
                  onChange={(e) => setFormData(prev => ({ ...prev, abuseCorporal: e.target.value as any }))}
                  className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-prussian"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Sex. Harassment</label>
                <select
                  value={formData.abuseHarassment || "No"}
                  onChange={(e) => setFormData(prev => ({ ...prev, abuseHarassment: e.target.value as any }))}
                  className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-prussian"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Sexual Abuse</label>
                <select
                  value={formData.abuseSexual || "No"}
                  onChange={(e) => setFormData(prev => ({ ...prev, abuseSexual: e.target.value as any }))}
                  className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-prussian"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Violence</label>
                <select
                  value={formData.abuseViolence || "No"}
                  onChange={(e) => setFormData(prev => ({ ...prev, abuseViolence: e.target.value as any }))}
                  className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-prussian"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </FormModal>

      {/* Delete Modal */}
      <FormModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete child assistance log"
        onSubmit={(e) => {
          e.preventDefault();
          confirmDelete();
        }}
        submitLabel="Delete record"
        cancelLabel="Discard"
      >
        <div className="text-center py-4">
          <AlertCircle className="w-12 h-12 text-golden mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Delete Incidental record?</h4>
          <p className="text-xs text-slate-500 mt-2">
            Are you sure you want to delete this incident record? This action will overwrite database metrics.
          </p>
        </div>
      </FormModal>
    </div>
  );
};

export default AbusedStudentsRegistry;
