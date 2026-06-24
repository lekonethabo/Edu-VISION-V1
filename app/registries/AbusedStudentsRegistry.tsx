"use client";

import React, { useState, useMemo } from "react";
import { AlertCircle, ShieldAlert, Users } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useFilters } from "@/hooks/useFilters";
import { INITIAL_ABUSED_STUDENTS } from "../constants";
import { SectionContainer } from "../shared/SectionContainer";
import { FilterBar } from "../shared/FilterBar";
import { DataTable, ColumnConfig } from "../shared/DataTable";
import { FormModal } from "../shared/FormModal";
import { AddButton } from "../shared/ActionButtons";

import primaryConfig from "./configs/abused_primary.json";
import juniorConfig from "./configs/abused_junior_secondary.json";
import earlyConfig from "./configs/abused_early_childhood.json";
import spedConfig from "./configs/abused_sped.json";
import unifiedConfig from "./configs/abused_unified.json";

const JSON_CONFIGS: Record<string, any> = {
  PRIMARY: primaryConfig,
  JUNIOR: juniorConfig,
  EARLY: earlyConfig,
  SPED: spedConfig,
  UNIFIED: unifiedConfig,
};

type ToolLevel = "PRIMARY" | "JUNIOR" | "EARLY" | "SPED" | "UNIFIED";

export interface JsonField {
  name: string;
  column: string;
  input_type: "text" | "select" | "number" | "multi-select";
  options?: string[];
  validation?: any;
}

export interface JsonConfig {
  form_title: string;
  fields: JsonField[];
}

export interface DynamicAbusedStudent {
  id: string; // The primary ID mapping
  [key: string]: any;
}

// Map the old mock data format to the excel column-based schema
const mappedInitialPrimary = INITIAL_ABUSED_STUDENTS.map((item: any) => {
  if (item["B"]) return item; // Already mapped
  
  // Convert old boolean flags to array
  const abuseTypes: string[] = [];
  if (item.abuseBullying === "Yes") abuseTypes.push("BULLYING");
  if (item.abuseCorporal === "Yes") abuseTypes.push("ABUSE OF CORPORAL PUNISHMENT");
  if (item.abuseHarassment === "Yes") abuseTypes.push("SEXUAL HARASSMENT");
  if (item.abuseSexual === "Yes") abuseTypes.push("SEXUAL ABUSE");
  if (item.abuseViolence === "Yes") abuseTypes.push("VIOLENCE");

  return {
    id: item.id || item["A"],
    "A": item.id || item["A"],
    "B": item.surname || item["B"],
    "C": item.first || item["C"],
    "D": item.nat || item["D"],
    "E": item.sex || item["E"],
    "F": item.reportDay || item.dobDay || item["F"],
    "G": item.reportMonth || item.dobMonth || item["G"],
    "H": item.reportYear || item.dobYear || item["H"],
    "I": item.std || item["I"],
    "J": item.typesOfAbuse || item["J"],
    "K": abuseTypes
  };
});

export const AbusedStudentsRegistry: React.FC<{ toolType?: ToolLevel }> = ({
  toolType = "PRIMARY",
}) => {
  const [activeTool, setActiveTool] = useState<ToolLevel>(toolType);
  const config = JSON_CONFIGS[activeTool] as JsonConfig;
  const storageKey = activeTool.toLowerCase() + "_abused_students";

  return (
    <DynamicAbusedRegistryWrapper
      key={activeTool}
      activeTool={activeTool}
      config={config}
      storageKey={storageKey}
      onChangeTool={setActiveTool}
    />
  );
};

const DynamicAbusedRegistryWrapper: React.FC<{
  activeTool: ToolLevel;
  config: JsonConfig;
  storageKey: string;
  onChangeTool: (tool: ToolLevel) => void;
}> = ({ activeTool, config, storageKey, onChangeTool }) => {
  const { items, addItem, updateItem, deleteItem } = useLocalStorage<DynamicAbusedStudent>(
    storageKey,
    activeTool === "PRIMARY" ? mappedInitialPrimary : []
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [dossierOpen, setDossierOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<DynamicAbusedStudent | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [formData, setFormData] = useState<Partial<DynamicAbusedStudent>>({});

  const triggerAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  // Identify index properties
  const idCol = config.fields.find(f => f.name.toUpperCase().includes("NATIONAL ID") || f.column === "A")?.column || "A";
  const surnameCol = config.fields.find(f => f.name.toUpperCase().includes("SURNAME") || f.column === "B")?.column || "B";
  const namesCol = config.fields.find(f => f.name.toUpperCase().includes("NAMES") || f.column === "C")?.column || "C";
  const sexCol = config.fields.find(f => f.name.toUpperCase().includes("SEX") || f.name.toUpperCase().includes("GENDER") || f.column === "E")?.column || "E";
  const abuseCol = config.fields.find(f => f.name.toUpperCase().includes("ABUSE") && (f.input_type === "multi-select" || f.column === "K" || f.column === "J"))?.column || "K";

  const sexOptions = config.fields.find(f => f.column === sexCol)?.options || ["Male", "Female", "Other"];

  // Filters hook setup
  const {
    searchQuery,
    setSearchQuery,
    activeFilters,
    setFilterVal,
    clearFilters,
    filteredItems
  } = useFilters<DynamicAbusedStudent>(items, [idCol, surnameCol, namesCol], {
    [sexCol]: "All"
  });

  const filterConfigs = [
    {
      key: sexCol,
      label: "Gender",
      value: activeFilters[sexCol] || "All",
      options: sexOptions,
      onChange: (val: string) => setFilterVal(sexCol, val)
    }
  ];

  // Table Columns config dynamically loaded
  const columns: ColumnConfig<DynamicAbusedStudent>[] = useMemo(() => {
    const cols: ColumnConfig<DynamicAbusedStudent>[] = [];

    cols.push({
      header: "National ID",
      accessorKey: idCol as any,
      className: "font-mono font-bold text-sea"
    });

    cols.push({
      header: "Full Name",
      render: (r) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-slate-100 truncate uppercase block">
            {r[surnameCol]}
          </span>
          <span className="text-slate-500 dark:text-slate-400 text-xs block truncate max-w-[200px]">
            {r[namesCol]}
          </span>
        </div>
      )
    });

    config.fields.forEach(f => {
      if ([idCol, surnameCol, namesCol].includes(f.column)) return;
      
      // Skip dates breakdown if necessary, or render as plain
      if (f.name.toUpperCase().includes("DATE") && (f.name.toUpperCase().includes("MONTH") || f.name.toUpperCase().includes("YEAR"))) {
        return;
      }

      cols.push({
        header: f.name.toUpperCase().includes("DAY") ? f.name.replace(/[-(\s]*DAY[-)\s]*/gi, " Date") : f.name,
        render: (r) => {
          if (f.name.toUpperCase().includes("DAY")) {
            const prefix = f.name.toUpperCase().split("DAY")[0];
            const monthField = config.fields.find(m => m.name.toUpperCase().startsWith(prefix) && m.name.toUpperCase().includes("MONTH"));
            const yearField = config.fields.find(y => y.name.toUpperCase().startsWith(prefix) && y.name.toUpperCase().includes("YEAR"));
            if (monthField && yearField) {
              const d = r[f.column];
              const m = r[monthField.column];
              const y = r[yearField.column];
              if (d && m && y) {
                return <span className="font-mono text-sm">{`${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`}</span>;
              }
            }
          }

          if (f.input_type === "multi-select") {
            const selections = r[f.column];
            if (!selections || !Array.isArray(selections) || selections.length === 0) {
               return <span className="text-slate-400 dark:text-slate-500 text-[10px] italic">None flagged</span>;
            }
            return (
              <div className="flex flex-wrap gap-1 max-w-[220px]">
                {selections.map((t: string) => (
                  <span
                    key={t}
                    className="px-1.5 py-0.5 rounded-sm text-[9px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 uppercase tracking-tight whitespace-nowrap"
                  >
                    {t}
                  </span>
                ))}
              </div>
            );
          }

          return (
            <span className="text-sm text-slate-600 dark:text-slate-300">
              {r[f.column] || "—"}
            </span>
          );
        }
      });
    });

    return cols;
  }, [config, idCol, surnameCol, namesCol]);

  // Form Submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData[idCol] || !formData[surnameCol] || !formData[namesCol]) {
      triggerAlert("National ID, Surname, and Student Full Names are required.", "error");
      return;
    }

    const compiled: DynamicAbusedStudent = {
      id: formData[idCol],
      ...formData,
      [surnameCol]: String(formData[surnameCol]).toUpperCase()
    };

    const exists = items.some(item => item.id === compiled.id);

    if (selectedIncident) {
      updateItem(compiled);
      triggerAlert("Incident profile updated successfully.", "success");
    } else {
      if (exists) {
        triggerAlert(`An incident record with ID ${compiled.id} already exists.`, "error");
        return;
      }
      addItem(compiled);
      triggerAlert(`Logged new child protection report for ${compiled[surnameCol]}.`, "success");
    }

    setModalOpen(false);
    setSelectedIncident(null);
    setFormData({});
  };

  const handleEditClick = (r: DynamicAbusedStudent) => {
    setSelectedIncident(r);
    setFormData(r);
    setModalOpen(true);
  };

  const handleDeleteClick = (r: DynamicAbusedStudent) => {
    setSelectedIncident(r);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedIncident) {
      deleteItem(selectedIncident.id);
      triggerAlert(`Successfully removed report for ${selectedIncident[surnameCol]}.`, "success");
      setDeleteOpen(false);
      setSelectedIncident(null);
    }
  };

  const total = items.length;
  const boys = items.filter(i => String(i[sexCol]).toUpperCase() === "MALE").length;
  const girls = items.filter(i => String(i[sexCol]).toUpperCase() === "FEMALE").length;

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
        title={config.form_title}
        description="Encrypted administrative registry cataloging student physical violence, bullying, or negligence reports."
        action={
          <AddButton
            label="Log Abuse Incident"
            onClick={() => {
              setSelectedIncident(null);
              const initData: any = {};
              config.fields.forEach(f => {
                if (f.input_type === "multi-select") {
                  initData[f.column] = [];
                } else if (f.options && f.options.length > 0) {
                  initData[f.column] = f.options[0];
                } else {
                  initData[f.column] = "";
                }
              });
              setFormData(initData);
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

      {/* Form modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedIncident ? `Edit Incident: ${selectedIncident[surnameCol]}` : `Record Child Protection Report`}
        onSubmit={handleSubmit}
        size="2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {config.fields.map(field => {
            if (field.input_type === "multi-select") {
              return (
                <div key={field.column} className="col-span-1 md:col-span-2 border-t border-slate-250 dark:border-slate-800 pt-4 mt-2">
                  <h4 className="text-xs font-black uppercase tracking-widest text-prussian dark:text-sea mb-3">
                    {field.name}
                  </h4>
                  <div className="flex flex-wrap gap-4">
                    {field.options?.map(opt => {
                      const currentVals = (formData[field.column] as string[]) || [];
                      const isChecked = currentVals.includes(opt);
                      return (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded border border-slate-200 dark:border-slate-800">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const newVals = e.target.checked
                                ? [...currentVals, opt]
                                : currentVals.filter(v => v !== opt);
                              setFormData(p => ({ ...p, [field.column]: newVals }));
                            }}
                            className="text-sea rounded focus:ring-sea"
                          />
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-tight">{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            }

            const isDayField = field.name.toUpperCase().includes("DAY");
            if (isDayField) {
              const prefix = field.name.toUpperCase().split("DAY")[0];
              const monthField = config.fields.find(f => f.name.toUpperCase().startsWith(prefix) && f.name.toUpperCase().includes("MONTH"));
              const yearField = config.fields.find(f => f.name.toUpperCase().startsWith(prefix) && f.name.toUpperCase().includes("YEAR"));

              if (monthField && yearField) {
                return (
                  <div key={`${field.column}-group`} className="col-span-1 md:col-span-2 bg-slate-50/50 dark:bg-slate-900/30 p-4 border border-slate-100 dark:border-slate-800/80 rounded-lg">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                      {prefix.replace(/[-(\s]+$/, "") || "Date"} *
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-0.5">Day</label>
                        <select
                          required
                          value={formData[field.column] || ""}
                          onChange={(e) => setFormData(p => ({ ...p, [field.column]: Number(e.target.value) || e.target.value }))}
                          className="w-full text-sm p-2.5 bg-white dark:bg-[#00050c] border border-slate-200 dark:border-slate-800 rounded focus:ring-1 focus:ring-sea text-slate-800 dark:text-slate-100"
                        >
                          <option value="">DD</option>
                          {Array.from({ length: 31 }, (_, i) => String(i + 1)).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-0.5">Month</label>
                        <select
                          required
                          value={formData[monthField.column] || ""}
                          onChange={(e) => setFormData(p => ({ ...p, [monthField.column]: Number(e.target.value) || e.target.value }))}
                          className="w-full text-sm p-2.5 bg-white dark:bg-[#00050c] border border-slate-200 dark:border-slate-800 rounded focus:ring-1 focus:ring-sea text-slate-800 dark:text-slate-100"
                        >
                          <option value="">MM</option>
                          {Array.from({ length: 12 }, (_, i) => String(i + 1)).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-0.5">Year</label>
                        <select
                          required
                          value={formData[yearField.column] || ""}
                          onChange={(e) => setFormData(p => ({ ...p, [yearField.column]: Number(e.target.value) || e.target.value }))}
                          className="w-full text-sm p-2.5 bg-white dark:bg-[#00050c] border border-slate-200 dark:border-slate-800 rounded focus:ring-1 focus:ring-sea text-slate-800 dark:text-slate-100"
                        >
                          <option value="">YYYY</option>
                          {Array.from({ length: 2027 - 1900 }, (_, i) => String(2026 - i)).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                );
              }
            }

            const isMonthOrYearField = field.name.toUpperCase().includes("MONTH") || field.name.toUpperCase().includes("YEAR");
            if (isMonthOrYearField) {
              const prefix = field.name.toUpperCase().includes("MONTH") ? field.name.toUpperCase().split("MONTH")[0] : field.name.toUpperCase().split("YEAR")[0];
              const dayField = config.fields.find(f => f.name.toUpperCase().startsWith(prefix) && f.name.toUpperCase().includes("DAY"));
              if (dayField) return null;
            }

            return (
              <div key={field.column}>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  {field.name} {field.validation?.allow_blank === false ? "*" : ""}
                </label>
                {field.input_type === "select" ? (
                  <select
                    required={field.validation?.allow_blank === false}
                    value={formData[field.column] || ""}
                    onChange={(e) => setFormData(p => ({ ...p, [field.column]: e.target.value }))}
                    className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-sea"
                  >
                    <option value="">-- Choose Option --</option>
                    {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input
                    type={field.input_type === "number" ? "number" : "text"}
                    required={field.validation?.allow_blank === false}
                    disabled={!!selectedIncident && field.column === idCol}
                    value={formData[field.column] || ""}
                    onChange={(e) => setFormData(p => ({ ...p, [field.column]: field.input_type === "number" ? Number(e.target.value) : e.target.value }))}
                    placeholder={` ${field.name}`}
                    className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-sea outline-hidden"
                  />
                )}
              </div>
            );
          })}
        </div>
      </FormModal>

      {/* Delete Confirmation Modal */}
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
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Delete Incidental record?</h4>
          <p className="text-xs text-slate-500 mt-2">
            Are you sure you want to permanently delete this incident record for <strong>{selectedIncident?.[surnameCol]}</strong>? This action will overwrite database metrics.
          </p>
        </div>
      </FormModal>
    </div>
  );
};

export default AbusedStudentsRegistry;

