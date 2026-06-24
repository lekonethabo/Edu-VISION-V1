"use client";

import React, { useState, useMemo } from "react";
import { AlertCircle, Users, GraduationCap, Calendar, FileText } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useFilters } from "@/hooks/useFilters";
import { INITIAL_RE_ENTRANTS } from "../constants";
import { SectionContainer } from "../shared/SectionContainer";
import { FilterBar } from "../shared/FilterBar";
import { DataTable, ColumnConfig } from "../shared/DataTable";
import { FormModal } from "../shared/FormModal";
import { AddButton } from "../shared/ActionButtons";

import primaryConfig from "./configs/re_entrant_primary.json";
import juniorConfig from "./configs/re_entrant_junior_secondary.json";
import earlyConfig from "./configs/re_entrant_early_childhood.json";
import spedConfig from "./configs/re_entrant_sped.json";
import unifiedConfig from "./configs/re_entrant_unified.json";

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
  input_type: "text" | "select" | "number";
  options?: string[];
  validation?: any;
}

export interface JsonConfig {
  form_title: string;
  fields: JsonField[];
}

export interface DynamicReEntrant {
  id: string; // The primary ID mapping (Column A)
  [key: string]: any;
}

// Map the old mock data format (with named keys) to the excel column-based schema
const mappedInitialPrimary = INITIAL_RE_ENTRANTS.map((item: any) => {
  if (item["B"]) return item; // Already mapped
  return {
    id: item.id || item["A"],
    "A": item.id || item["A"],
    "B": item.surname || item["B"],
    "C": item.first || item["C"],
    "D": item.nat || item["D"],
    "E": item.sex || item["E"],
    "F": item.reEnterDay || item["F"],
    "G": item.reEnterMonth || item["G"],
    "H": item.reEnterYear || item["H"],
    "I": item.std || item["I"],
    "J": item.reasonDropped || item["J"],
    "K": item.yearDroppedOut || item["K"]
  };
});

export const ReEntrantsRegistry: React.FC<{ toolType?: ToolLevel }> = ({
  toolType = "PRIMARY",
}) => {
  const [activeTool, setActiveTool] = useState<ToolLevel>(toolType);
  const config = JSON_CONFIGS[activeTool] as JsonConfig;
  const storageKey = activeTool.toLowerCase() + "_re_entrants";

  return (
    <DynamicReEntrantsRegistryWrapper
      key={activeTool}
      activeTool={activeTool}
      config={config}
      storageKey={storageKey}
      onChangeTool={setActiveTool}
    />
  );
};

const DynamicReEntrantsRegistryWrapper: React.FC<{
  activeTool: ToolLevel;
  config: JsonConfig;
  storageKey: string;
  onChangeTool: (tool: ToolLevel) => void;
}> = ({ activeTool, config, storageKey, onChangeTool }) => {
  const { items, addItem, updateItem, deleteItem } = useLocalStorage<DynamicReEntrant>(
    storageKey,
    activeTool === "PRIMARY" ? mappedInitialPrimary : []
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [dossierOpen, setDossierOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedReEntrant, setSelectedReEntrant] = useState<DynamicReEntrant | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [formData, setFormData] = useState<Partial<DynamicReEntrant>>({});

  const triggerAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  // Identify index properties
  const idCol = config.fields.find(f => f.name.toUpperCase().includes("NATIONAL ID") || f.column === "A")?.column || "A";
  const surnameCol = config.fields.find(f => f.name.toUpperCase().includes("SURNAME") || f.column === "B")?.column || "B";
  const namesCol = config.fields.find(f => f.name.toUpperCase().includes("NAMES") || f.column === "C")?.column || "C";
  const sexCol = config.fields.find(f => f.name.toUpperCase().includes("SEX") || f.name.toUpperCase().includes("GENDER") || f.column === "E")?.column || "E";
  
  const levelCol = config.fields.find(f => 
    ["STANDARD", "FORM", "LEVEL", "CATEGORY/ LEVEL"].some(keyword => f.name.toUpperCase().includes(keyword)) || f.column === "I" || f.column === "L"
  )?.column || "I";

  const levelOptions = config.fields.find(f => f.column === levelCol)?.options || [];
  const sexOptions = config.fields.find(f => f.column === sexCol)?.options || ["Male", "Female", "Other"];

  // Filters hook setup
  const {
    searchQuery,
    setSearchQuery,
    activeFilters,
    setFilterVal,
    clearFilters,
    filteredItems
  } = useFilters<DynamicReEntrant>(items, [idCol, surnameCol, namesCol], {
    [levelCol]: "All",
    [sexCol]: "All"
  });

  const filterConfigs = [
    {
      key: levelCol,
      label: config.fields.find(f => f.column === levelCol)?.name || "Level",
      value: activeFilters[levelCol] || "All",
      options: levelOptions,
      onChange: (val: string) => setFilterVal(levelCol, val)
    },
    {
      key: sexCol,
      label: "Gender",
      value: activeFilters[sexCol] || "All",
      options: sexOptions,
      onChange: (val: string) => setFilterVal(sexCol, val)
    }
  ];

  // Table Columns config dynamically loaded
  const columns: ColumnConfig<DynamicReEntrant>[] = useMemo(() => {
    const cols: ColumnConfig<DynamicReEntrant>[] = [];

    // 1. Primary ID Col
    cols.push({
      header: "National ID",
      accessorKey: idCol as any,
      className: "font-mono font-bold text-sea"
    });

    // 2. Name representation
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

    // 3. Other fields mapping except name components
    config.fields.forEach(f => {
      if ([idCol, surnameCol, namesCol].includes(f.column)) return;
      
      // Skip dates elements since we are displaying compiled dates or skipping day/month breakdown
      if (f.name.toUpperCase().includes("DATE") && (f.name.toUpperCase().includes("MONTH") || f.name.toUpperCase().includes("YEAR"))) {
        return;
      }

      cols.push({
        header: f.name.toUpperCase().includes("DAY") ? f.name.replace(/[-(\s]*DAY[-)\s]*/gi, " Date") : f.name,
        render: (r) => {
          // If it is a DAY column, let's locate month and year columns and render compiled date
          if (f.name.toUpperCase().includes("DAY")) {
            const prefix = f.name.toUpperCase().split("DAY")[0];
            const monthField = config.fields.find(
              m => m.name.toUpperCase().startsWith(prefix) && m.name.toUpperCase().includes("MONTH")
            );
            const yearField = config.fields.find(
              y => y.name.toUpperCase().startsWith(prefix) && y.name.toUpperCase().includes("YEAR")
            );
            
            if (monthField && yearField) {
              const d = r[f.column];
              const m = r[monthField.column];
              const y = r[yearField.column];
              if (d && m && y) {
                return <span className="font-mono text-sm">{`${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`}</span>;
              }
            }
          }

          return (
            <span className={f.column === levelCol ? "font-bold text-slate-800 dark:text-slate-200" : "text-sm text-slate-600 dark:text-slate-300"}>
              {r[f.column] || "—"}
            </span>
          );
        }
      });
    });

    return cols;
  }, [config, idCol, surnameCol, namesCol, levelCol]);

  // Form Submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData[idCol] || !formData[surnameCol] || !formData[namesCol]) {
      triggerAlert("National ID, Surname, and Student Full Names are required.", "error");
      return;
    }

    const compiled: DynamicReEntrant = {
      id: formData[idCol],
      ...formData,
      [surnameCol]: String(formData[surnameCol]).toUpperCase()
    };

    const exists = items.some(item => item.id === compiled.id);

    if (selectedReEntrant) {
      updateItem(compiled);
      triggerAlert("Re-entrant profile updated successfully.", "success");
    } else {
      if (exists) {
        triggerAlert(`A re-entrant record with ID ${compiled.id} already exists.`, "error");
        return;
      }
      addItem(compiled);
      triggerAlert(`Added new returning re-entrant ${compiled[surnameCol]}.`, "success");
    }

    setModalOpen(false);
    setSelectedReEntrant(null);
    setFormData({});
  };

  const handleEditClick = (r: DynamicReEntrant) => {
    setSelectedReEntrant(r);
    setFormData(r);
    setModalOpen(true);
  };

  const handleViewClick = (r: DynamicReEntrant) => {
    setSelectedReEntrant(r);
    setDossierOpen(true);
  };

  const handleDeleteClick = (r: DynamicReEntrant) => {
    setSelectedReEntrant(r);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedReEntrant) {
      deleteItem(selectedReEntrant.id);
      triggerAlert(`Successfully removed re-entrant record for ${selectedReEntrant[surnameCol]}.`, "success");
      setDeleteOpen(false);
      setSelectedReEntrant(null);
    }
  };

  // Stats Counters
  const total = items.length;
  const boys = items.filter(i => String(i[sexCol]).toUpperCase() === "MALE").length;
  const girls = items.filter(i => String(i[sexCol]).toUpperCase() === "FEMALE").length;
  const categoriesCount = new Set(items.map(i => i[levelCol]).filter(Boolean)).size;

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

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Re-Entries</p>
              <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100">{total}</h3>
            </div>
            <div className="p-2 bg-sea/10 rounded-lg text-sea">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Boys Re-entered</p>
              <h3 className="text-3xl font-black text-blue-600 dark:text-blue-400">{boys}</h3>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/40 rounded-lg text-blue-600 dark:text-blue-400">
              <span className="font-bold text-sm">M</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Girls Re-entered</p>
              <h3 className="text-3xl font-black text-rose-600 dark:text-rose-400">{girls}</h3>
            </div>
            <div className="p-2 bg-rose-50 dark:bg-rose-900/40 rounded-lg text-rose-600 dark:text-rose-450">
              <span className="font-bold text-sm">F</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Class Placements</p>
              <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100">{categoriesCount} / {levelOptions.length || 7}</h3>
            </div>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/40 rounded-lg text-emerald-600 dark:text-emerald-400">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <SectionContainer
        title={config.form_title}
        description="Comprehensive dashboard tracking the dynamic scholastic returns and re-integration trajectories of previous dropouts."
        action={
          <div className="flex items-center gap-3">
            <AddButton
              label="Log Re-Entry"
              onClick={() => {
                setSelectedReEntrant(null);
                const initData: any = {};
                config.fields.forEach(f => {
                  if (f.options && f.options.length > 0) {
                    initData[f.column] = f.options[0];
                  } else {
                    initData[f.column] = "";
                  }
                });
                // Seed some defaults for date fields where standard numeric options apply
                config.fields.forEach(f => {
                  if (f.name.toUpperCase().includes("YEAR") && !initData[f.column]) initData[f.column] = 2025;
                  if (f.name.toUpperCase().includes("MONTH") && !initData[f.column]) initData[f.column] = 1;
                  if (f.name.toUpperCase().includes("DAY") && !initData[f.column]) initData[f.column] = 15;
                });
                setFormData(initData);
                setModalOpen(true);
              }}
            />
          </div>
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
          onView={handleViewClick}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          emptyMessage="No re-entrant student files matched active filters."
        />
      </SectionContainer>

      {/* Form modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedReEntrant ? `Edit Re-entrant: ${selectedReEntrant[surnameCol]}` : `Log New Re-entrant Profile`}
        onSubmit={handleSubmit}
        size="2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {config.fields.map(field => {
            // Group Day, Month, Year fields
            const isDayField = field.name.toUpperCase().includes("DAY");
            if (isDayField) {
              const prefix = field.name.toUpperCase().split("DAY")[0];
              const monthField = config.fields.find(
                f => f.name.toUpperCase().startsWith(prefix) && f.name.toUpperCase().includes("MONTH")
              );
              const yearField = config.fields.find(
                f => f.name.toUpperCase().startsWith(prefix) && f.name.toUpperCase().includes("YEAR")
              );

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
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              [field.column]: Number(e.target.value) || e.target.value,
                            }))
                          }
                          className="w-full text-sm p-2.5 bg-white dark:bg-[#00050c] border border-slate-200 dark:border-slate-800 rounded focus:ring-1 focus:ring-sea outline-hidden text-slate-800 dark:text-slate-100"
                        >
                          <option value="">DD</option>
                          {Array.from({ length: 31 }, (_, i) => String(i + 1)).map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-0.5">Month</label>
                        <select
                          required
                          value={formData[monthField.column] || ""}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              [monthField.column]: Number(e.target.value) || e.target.value,
                            }))
                          }
                          className="w-full text-sm p-2.5 bg-white dark:bg-[#00050c] border border-slate-200 dark:border-slate-800 rounded focus:ring-1 focus:ring-sea outline-hidden text-slate-800 dark:text-slate-100"
                        >
                          <option value="">MM</option>
                          {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-0.5">Year</label>
                        <select
                          required
                          value={formData[yearField.column] || ""}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              [yearField.column]: Number(e.target.value) || e.target.value,
                            }))
                          }
                          className="w-full text-sm p-2.5 bg-white dark:bg-[#00050c] border border-slate-200 dark:border-slate-800 rounded focus:ring-1 focus:ring-sea outline-hidden text-slate-800 dark:text-slate-100"
                        >
                          <option value="">YYYY</option>
                          {Array.from({ length: 2027 - 1950 }, (_, i) => String(2026 - i)).map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                );
              }
            }

            const isMonthOrYearField = field.name.toUpperCase().includes("MONTH") || field.name.toUpperCase().includes("YEAR");
            if (isMonthOrYearField) {
              const prefix = field.name.toUpperCase().includes("MONTH") 
                ? field.name.toUpperCase().split("MONTH")[0]
                : field.name.toUpperCase().split("YEAR")[0];
              const dayField = config.fields.find(
                f => f.name.toUpperCase().startsWith(prefix) && f.name.toUpperCase().includes("DAY")
              );
              if (dayField) return null;
            }

            // Normal rendering
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
                    {field.options?.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.input_type === "number" ? "number" : "text"}
                    required={field.validation?.allow_blank === false}
                    disabled={!!selectedReEntrant && field.column === idCol}
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

      {/* Dossier info Modal */}
      <FormModal
        isOpen={dossierOpen}
        onClose={() => setDossierOpen(false)}
        title="Re-integration Dossier Tracker"
        onSubmit={(e) => {
          e.preventDefault();
          setDossierOpen(false);
        }}
        submitLabel="Completed Review"
      >
        {selectedReEntrant && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 p-4 border dark:border-slate-850 rounded-xl">
              <div className="w-12 h-12 rounded bg-sea/10 flex items-center justify-center text-sea font-black text-xl shadow-md">
                {String(selectedReEntrant[surnameCol]).charAt(0)}
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 uppercase">
                  {selectedReEntrant[surnameCol]}, {selectedReEntrant[namesCol]}
                </h4>
                <p className="text-xs font-mono text-sea mt-0.5">ID: {selectedReEntrant[idCol]}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300">
              {config.fields.map(field => {
                // Formatting display for date elements
                if (field.name.toUpperCase().includes("DATE") && (field.name.toUpperCase().includes("MONTH") || field.name.toUpperCase().includes("YEAR"))) {
                  return null;
                }
                const label = field.name.toUpperCase().includes("DAY") ? field.name.replace(/[-(\s]*DAY[-)\s]*/gi, " Date") : field.name;
                let displayVal = selectedReEntrant[field.column] || "—";

                if (field.name.toUpperCase().includes("DAY")) {
                  const prefix = field.name.toUpperCase().split("DAY")[0];
                  const mField = config.fields.find(m => m.name.toUpperCase().startsWith(prefix) && m.name.toUpperCase().includes("MONTH"));
                  const yField = config.fields.find(y => y.name.toUpperCase().startsWith(prefix) && y.name.toUpperCase().includes("YEAR"));
                  const d = selectedReEntrant[field.column];
                  const m = mField ? selectedReEntrant[mField.column] : null;
                  const y = yField ? selectedReEntrant[yField.column] : null;
                  if (d && m && y) {
                    displayVal = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                  }
                }

                return (
                  <div key={field.column} className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">{label}</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-100 uppercase">{String(displayVal)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </FormModal>

      {/* Delete Confirmation Modal */}
      <FormModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Confirm File Removal"
        onSubmit={(e) => {
          e.preventDefault();
          confirmDelete();
        }}
        submitLabel="Permanently Delete File"
        cancelLabel="Keep File"
      >
        <div className="text-center py-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Remove Student Re-integration Profile?</h4>
          <p className="text-xs text-slate-500 mt-2">
            Are you sure you want to permanently delete the re-entrant file for <strong>{selectedReEntrant?.[surnameCol]}</strong>? This operational action is irreversible.
          </p>
        </div>
      </FormModal>
    </div>
  );
};

export default ReEntrantsRegistry;
