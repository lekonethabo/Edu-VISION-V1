"use client";

import React, { useEffect, useMemo, useState } from "react";
import { DataTable, ColumnConfig } from "../shared/DataTable";
import { FormModal } from "../shared/FormModal";
import { AddButton } from "../shared/ActionButtons";

export type SetupItemType = "district" | "education_region" | "region" | "subregion";

export interface LookupOption {
  id: string;
  name: string;
  code?: string | null;
  regionId?: string;
  relationName?: string;
}

const DEFAULT_FORM_STATE = {
  id: "",
  name: "",
  code: "",
  relationId: "",
};

const TYPE_LABELS: Record<SetupItemType, string> = {
  district: "District",
  education_region: "Education Region",
  region: "Region",
  subregion: "Subregion",
};

export const EMISSetupRegistry: React.FC = () => {
  const [itemType, setItemType] = useState<SetupItemType>("district");
  const [items, setItems] = useState<LookupOption[]>([]);
  const [relatedRegions, setRelatedRegions] = useState<LookupOption[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LookupOption | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({ ...DEFAULT_FORM_STATE });
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const triggerToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const fetchData = async (type: SetupItemType) => {
    try {
      const result = await fetch(`/api/emissetup?type=${type}`);
      const payload = await result.json();
      if (payload.success) {
        setItems(payload.data || []);
      } else {
        throw new Error(payload.error || "Failed to load items.");
      }

      if (type === "subregion") {
        const regionsResult = await fetch(`/api/emissetup?type=region`);
        const regionsPayload = await regionsResult.json();
        setRelatedRegions(regionsPayload.success ? regionsPayload.data : []);
      }
    } catch (error) {
      console.error(error);
      triggerToast("Unable to load setup options.", "error");
    }
  };

  useEffect(() => {
    fetchData(itemType);
  }, [itemType]);

  const columns: ColumnConfig<LookupOption>[] = useMemo(() => {
    const baseColumns: ColumnConfig<LookupOption>[] = [
      { header: "Name", accessorKey: "name" },
      { header: "Code", accessorKey: "code" },
    ];

    if (itemType === "subregion") {
      baseColumns.push({ header: "Parent Region", accessorKey: "relationName" });
    }

    return baseColumns;
  }, [itemType]);

  const handleTypeChange = (type: SetupItemType) => {
    setItemType(type);
    setSelectedItem(null);
    setFormData({ ...DEFAULT_FORM_STATE });
  };

  const handleOpenCreate = () => {
    setSelectedItem(null);
    setFormData({ ...DEFAULT_FORM_STATE });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      triggerToast("Name is required.", "error");
      return;
    }

    const payload = {
      type: itemType,
      id: selectedItem?.id,
      name: formData.name.trim(),
      code: formData.code?.trim() || null,
      relationId: formData.relationId || null,
    };

    const action = selectedItem ? "/api/emissetup/update" : "/api/emissetup/create";

    try {
      const response = await fetch(action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to save record.");
      }
      triggerToast("Saved successfully.", "success");
      setModalOpen(false);
      fetchData(itemType);
    } catch (error) {
      console.error(error);
      triggerToast("Unable to save setup item.", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this option?")) return;
    try {
      const response = await fetch("/api/emissetup/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: itemType, id }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error || "Failed to delete.");
      triggerToast("Deleted successfully.", "success");
      fetchData(itemType);
    } catch (error) {
      console.error(error);
      triggerToast("Unable to delete setup item.", "error");
    }
  };

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">EMIS System Setup</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">Manage dropdown options for system-wide administrative values like districts, regions, education regions, and subregions.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(TYPE_LABELS) as SetupItemType[]).map((type) => (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition ${itemType === type ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300 hover:bg-slate-200"}`}
            >
              {TYPE_LABELS[type]}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase">{TYPE_LABELS[itemType]} Options</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Add, edit and remove values used across dropdown menus in the portal.</p>
          </div>
          <AddButton label={`Add ${TYPE_LABELS[itemType]}`} onClick={handleOpenCreate} />
        </div>

        <DataTable
          columns={columns}
          data={items.map((row) => ({
            ...row,
            relationName: row.relationName || "",
          }))}
          onEdit={(row) => {
            setSelectedItem(row);
            setFormData({
              id: row.id,
              name: row.name,
              code: row.code || "",
              relationId: row.regionId || "",
            });
            setModalOpen(true);
          }}
          onDelete={(row) => handleDelete(row.id)}
          emptyMessage={`No ${TYPE_LABELS[itemType]} records found.`}
        />
      </div>

      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`${selectedItem ? "Edit" : "Add"} ${TYPE_LABELS[itemType]}`}
        onSubmit={handleSubmit}
        submitLabel={selectedItem ? "Update" : "Create"}
        cancelLabel="Discard"
        size="lg"
      >
        <div className="grid grid-cols-1 gap-4">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            {TYPE_LABELS[itemType]} Name
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#001428] px-4 py-3 text-sm text-slate-900 dark:text-white"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Optional Code
            <input
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#001428] px-4 py-3 text-sm text-slate-900 dark:text-white"
            />
          </label>

          {itemType === "subregion" && (
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Parent Region
              <select
                value={formData.relationId}
                onChange={(e) => setFormData({ ...formData, relationId: e.target.value })}
                className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#001428] px-4 py-3 text-sm text-slate-900 dark:text-white"
              >
                <option value="">Select region</option>
                {relatedRegions.map((region) => (
                  <option key={region.id} value={region.id}>{region.name}</option>
                ))}
              </select>
            </label>
          )}
        </div>
      </FormModal>

      {toast && (
        <div className={`fixed bottom-6 right-6 p-4 rounded-3xl text-sm shadow-xl border ${toast.type === "success" ? "bg-emerald-600 text-white border-emerald-500" : "bg-rose-600 text-white border-rose-500"}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};
