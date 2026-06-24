"use client";

import React, { useState, useMemo } from "react";
import {
  AlertCircle,
  FileText,
  Award,
  Layers,
  Users,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useFilters } from "@/hooks/useFilters";
import { SectionContainer } from "../shared/SectionContainer";
import { FilterBar } from "../shared/FilterBar";
import { DataTable, ColumnConfig } from "../shared/DataTable";
import { FormModal } from "../shared/FormModal";
import { AddButton } from "../shared/ActionButtons";

import primaryConfig from "./configs/student_primary.json";
import juniorConfig from "./configs/student_junior_secondary.json";
import earlyConfig from "./configs/student_early_childhood.json";
import spedConfig from "./configs/student_sped.json";
import unifiedConfig from "./configs/student_unified.json";

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
  input_type: "text" | "select";
  options?: string[];
  validation?: any;
  default?: string;
}

export interface JsonConfig {
  form_title: string;
  fields: JsonField[];
}

export interface DynamicStudent {
  id: string; // The primary ID mapping (Column A)
  [key: string]: any;
}

// Compute age from YYYY-MM-DD
function computeAge(dob: string): number {
  if (!dob) return 0;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export const StudentsRegistry: React.FC<{ toolType?: ToolLevel }> = ({
  toolType = "PRIMARY",
}) => {
  const [activeTool, setActiveTool] = useState<ToolLevel>(toolType);
  const config = JSON_CONFIGS[activeTool] as JsonConfig;
  const storageKey = activeTool.toLowerCase() + "_students";

  return (
    <DynamicStudentsRegistryWrapper
      key={activeTool}
      activeTool={activeTool}
      config={config}
      storageKey={storageKey}
      onChangeTool={setActiveTool}
    />
  );
};

const DynamicStudentsRegistryWrapper: React.FC<{
  activeTool: ToolLevel;
  config: JsonConfig;
  storageKey: string;
  onChangeTool: (tool: ToolLevel) => void;
}> = ({ activeTool, config, storageKey, onChangeTool }) => {
  // 1. Storage & Persistence
  const { items, addItem, updateItem, deleteItem } =
    useLocalStorage<DynamicStudent>(storageKey, []);

  // 2. UI States
  const [modalOpen, setModalOpen] = useState(false);
  const [dossierOpen, setDossierOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<DynamicStudent | null>(
    null,
  );
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // 3. Form Field State
  const [formData, setFormData] = useState<Partial<DynamicStudent>>({});

  // Trigger alert notifications helper
  const triggerAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  // Extract key columns
  const idCol =
    config.fields.find(
      (f) => f.name.includes("NATIONAL ID") || f.column === "A",
    )?.column || "A";
  const surnameCol =
    config.fields.find((f) => f.name.includes("SURNAME") || f.column === "B")
      ?.column || "B";
  const firstCol =
    config.fields.find((f) => f.name.includes("NAMES") || f.column === "C")
      ?.column || "C";
  const sexCol =
    config.fields.find((f) => f.name.includes("SEX") || f.column === "E")
      ?.column || "E";
  const levelCol =
    config.fields.find(
      (f) =>
        [
          "STANDARD",
          "FORM",
          "CATEGORY/ LEVEL",
          "SPED CATEGORY",
          "LEVEL",
        ].includes(f.name) || f.column === "I",
    )?.column || "I";
  const dobCol =
    config.fields.find(
      (f) => f.name.includes("DOB") || f.name.includes("DateOB"),
    )?.column || "T";
  const ageCol =
    config.fields.find((f) => f.name.includes("AGE"))?.column || "S";

  // 4. Listing Filters via useFilters hook
  const {
    searchQuery,
    setSearchQuery,
    activeFilters,
    setFilterVal,
    clearFilters,
    filteredItems,
  } = useFilters<DynamicStudent>(items, [idCol, surnameCol, firstCol], {
    level: "All",
    sex: "All",
  });

  const levelOptions =
    config.fields.find((f: JsonField) => f.column === levelCol)?.options || [];

  const filterConfigs = [
    {
      key: "level",
      label:
        config.fields.find((f: JsonField) => f.column === levelCol)?.name ||
        "Level",
      value: activeFilters.level || "All",
      options: levelOptions,
      onChange: (val: string) => setFilterVal("level", val),
    },
    {
      key: "sex",
      label: "Gender",
      value: activeFilters.sex || "All",
      options: ["Male", "Female"],
      onChange: (val: string) => setFilterVal("sex", val),
    },
  ];

  // Table Columns Setup dynamically generated from JSON
  const columns: ColumnConfig<DynamicStudent>[] = useMemo(() => {
    const cols: ColumnConfig<DynamicStudent>[] = [];

    // Add primary ID
    cols.push({
      header: "Registration ID",
      accessorKey: idCol as keyof DynamicStudent,
      className: "font-mono font-bold text-sea",
    });

    // Add Name
    cols.push({
      header: "Full Name",
      render: (st) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-slate-100 truncate uppercase block">
            {st[surnameCol]}
          </span>
          <span className="text-slate-500 dark:text-slate-400 text-xs block">
            {st[firstCol]}
          </span>
        </div>
      ),
    });

    // Other non-computed select/text fields except ID, Surname, First
    config.fields.forEach((f) => {
      if ([idCol, surnameCol, firstCol].includes(f.column)) return;
      if (f.column === "F" || f.column === "G" || f.column === "H") return; // skip exact dob components

      cols.push({
        header: f.name,
        render: (st) => (
          <span
            className={
              f.column === levelCol
                ? "font-bold text-slate-800 dark:text-slate-100"
                : "text-sm"
            }
          >
            {st[f.column]}
          </span>
        ),
      });
    });

    return cols;
  }, [config, idCol, surnameCol, firstCol, levelCol]);

  // Handle Add/Edit Formulation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData[idCol] || !formData[surnameCol] || !formData[firstCol]) {
      triggerAlert(
        "Identity details (ID, Surname, First Names) are required.",
        "error",
      );
      return;
    }

    const compiled: DynamicStudent = { id: formData[idCol], ...formData };

    // Clean up dependent SPED fields
    const spedTriggerField = config.fields.find(
      (f) =>
        f.name.toUpperCase().includes("SPECIAL EDUCATION NEED") &&
        !f.name.toUpperCase().includes("TYPE OF")
    );
    if (spedTriggerField && compiled[spedTriggerField.column] === "No") {
      config.fields.forEach((f) => {
        if (
          f.name.toUpperCase().includes("TYPE OF SPECIAL EDUCATION") ||
          f.name.toUpperCase().includes("SUPPORT SERVICE")
        ) {
          delete compiled[f.column];
        }
      });
    }

    // Compute DOB and Age
    if (compiled["F"] && compiled["G"] && compiled["H"]) {
      const dobStr = `${compiled["H"]}-${compiled["G"]}-${compiled["F"]}`;
      compiled[dobCol] = dobStr;
      compiled[ageCol] = computeAge(dobStr);
    }

    const exists = items.some((item) => item.id === compiled.id);
    if (selectedStudent) {
      updateItem(compiled);
      triggerAlert(`Record ${compiled.id} updated successfully.`, "success");
    } else {
      if (exists) {
        triggerAlert(
          `A student with ID ${compiled.id} already exists.`,
          "error",
        );
        return;
      }
      addItem(compiled);
      triggerAlert(`New profile ${compiled.id} registered.`, "success");
    }

    setModalOpen(false);
    setSelectedStudent(null);
    setFormData({});
  };

  const handleEditClick = (st: DynamicStudent) => {
    setSelectedStudent(st);
    setFormData(st);
    setModalOpen(true);
  };

  const handleViewClick = (st: DynamicStudent) => {
    setSelectedStudent(st);
    setDossierOpen(true);
  };

  const handleDeleteClick = (st: DynamicStudent) => {
    setSelectedStudent(st);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedStudent) {
      deleteItem(selectedStudent.id);
      triggerAlert(`Student ${selectedStudent.id} deleted.`, "success");
      setDeleteOpen(false);
      setSelectedStudent(null);
    }
  };

  // Stats
  const total = items.length;
  const boys = items.filter((i) => i[sexCol] === "Male").length;
  const girls = items.filter((i) => i[sexCol] === "Female").length;
  const levelsCount = new Set(items.map((i) => i[levelCol]).filter(Boolean))
    .size;

  return (
    <div className="space-y-6 animate-fade-in" id="students-registry-section">
      {alert && (
        <div
          className={`p-4 rounded border flex items-center gap-3 text-sm font-medium ${alert.type === "success" ? "bg-sea/10 border-sea text-sea" : "bg-golden/10 border-golden text-golden"}`}
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{alert.message}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Total Enrolments
              </p>
              <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100">
                {total}
              </h3>
            </div>
            <div className="p-2 bg-sea/10 rounded-lg text-sea">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Boys
              </p>
              <h3 className="text-3xl font-black text-blue-600 dark:text-blue-400">
                {boys}
              </h3>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/40 rounded-lg text-blue-600 dark:text-blue-400">
              <span className="font-bold text-sm">M</span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Girls
              </p>
              <h3 className="text-3xl font-black text-rose-600 dark:text-rose-400">
                {girls}
              </h3>
            </div>
            <div className="p-2 bg-rose-50 dark:bg-rose-900/40 rounded-lg text-rose-600 dark:text-rose-400">
              <span className="font-bold text-sm">F</span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Enrolment Categories
              </p>
              <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100">
                {levelsCount} / {levelOptions.length}
              </h3>
            </div>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/40 rounded-lg text-emerald-600 dark:text-emerald-400">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <SectionContainer
        title={config.form_title}
        description="Statutory student enrolment tracker powered by dynamic registry configurations."
        action={
          <div className="flex items-center gap-3">
            <AddButton
              label="Add New Student"
              onClick={() => {
                setSelectedStudent(null);
                const initData: any = {};
                config.fields.forEach((f) => {
                  if (f.default) initData[f.column] = f.default;
                  else if (
                    f.input_type === "select" &&
                    f.options &&
                    f.options.length > 0
                  )
                    initData[f.column] = f.options[0];
                });
                setFormData(initData);
                setModalOpen(true);
              }}
            />
          </div>
        }
      >
        <FilterBar
          searchPlaceholder="Search ID or Name..."
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
          emptyMessage="No profiles match active filters."
        />
      </SectionContainer>

      {/* Add / Edit Form Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedStudent ? "Edit Record" : "Register Profile"}
        onSubmit={handleSubmit}
        size="3xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {config.fields.map((field) => {
            // Skip computed fields
            if (
              field.column === ageCol ||
              field.column === dobCol ||
              field.name.toUpperCase().includes("BLANK")
            )
              return null;

            // Group Day (F), Month (G), and Year (H) into a single aligned row
            if (field.column === "G" || field.column === "H") {
              return null;
            }

            if (field.column === "F") {
              const monthField = config.fields.find((f) => f.column === "G");
              const yearField = config.fields.find((f) => f.column === "H");

              return (
                <div key="dob-group" className="col-span-1 md:col-span-2 bg-slate-50/50 dark:bg-slate-900/30 p-4 border border-slate-100 dark:border-slate-800/80 rounded-lg">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Date of Birth *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Day</label>
                      <select
                        required
                        value={formData["F"] || ""}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            "F": e.target.value,
                          }))
                        }
                        className="w-full text-sm p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded focus:ring-1 focus:ring-sea outline-none"
                      >
                        <option value="">DD</option>
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Month</label>
                      <select
                        required
                        value={formData["G"] || ""}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            "G": e.target.value,
                          }))
                        }
                        className="w-full text-sm p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded focus:ring-1 focus:ring-sea outline-none"
                      >
                        <option value="">MM</option>
                        {monthField?.options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Year</label>
                      <select
                        required
                        value={formData["H"] || ""}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            "H": e.target.value,
                          }))
                        }
                        className="w-full text-sm p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded focus:ring-1 focus:ring-sea outline-none"
                      >
                        <option value="">YYYY</option>
                        {yearField?.options?.map((opt) => (
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

            // Dynamic logic for SPECIAL EDUCATION NEEDS
            const spedTriggerField = config.fields.find(
              (f) =>
                f.name.toUpperCase().includes("SPECIAL EDUCATION NEED") &&
                !f.name.toUpperCase().includes("TYPE OF")
            );

            if (spedTriggerField && formData[spedTriggerField.column] === "No") {
              if (
                field.name.toUpperCase().includes("TYPE OF SPECIAL EDUCATION") ||
                field.name.toUpperCase().includes("SUPPORT SERVICE")
              ) {
                return null;
              }
            }

            return (
              <div key={field.column}>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  {field.name}{" "}
                  {field.validation?.allow_blank === false ? "*" : ""}
                </label>
                {field.input_type === "select" ? (
                  <select
                    required={field.validation?.allow_blank === false}
                    value={formData[field.column] || ""}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        [field.column]: e.target.value,
                      }))
                    }
                    className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded focus:ring-1 focus:ring-sea outline-none"
                  >
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required={field.validation?.allow_blank === false}
                    disabled={!!selectedStudent && field.column === idCol}
                    value={formData[field.column] || ""}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        [field.column]: e.target.value,
                      }))
                    }
                    className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded focus:ring-1 focus:ring-sea outline-none"
                  />
                )}
              </div>
            );
          })}
        </div>
      </FormModal>

      {/* Dossier Modal */}
      <FormModal
        isOpen={dossierOpen}
        onClose={() => setDossierOpen(false)}
        title="Dossier"
        onSubmit={(e) => {
          e.preventDefault();
          setDossierOpen(false);
        }}
        submitLabel="Close"
        cancelLabel="Print"
      >
        {selectedStudent && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 p-4 border dark:border-slate-800 rounded">
              <div className="w-12 h-12 rounded bg-prussian flex items-center justify-center text-white font-black text-xl shadow-md">
                {selectedStudent[surnameCol]?.charAt(0)}
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 uppercase">
                  {selectedStudent[surnameCol]}, {selectedStudent[firstCol]}
                </h4>
                <p className="text-xs font-mono text-sea mt-0.5">
                  ID: {selectedStudent[idCol]}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5 text-xs text-slate-700 dark:text-slate-300">
              {config.fields.map((field) => (
                <div
                  key={field.column}
                  className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded border border-slate-100 dark:border-slate-800"
                >
                  <span className="text-[10px] text-slate-400 font-mono block uppercase">
                    {field.name}:
                  </span>
                  <span className="font-bold text-xs">
                    {selectedStudent[field.column]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </FormModal>

      {/* Delete Confirmation */}
      <FormModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Confirm Deletion"
        onSubmit={(e) => {
          e.preventDefault();
          confirmDelete();
        }}
        submitLabel="Delete"
        cancelLabel="Cancel"
      >
        <div className="text-center py-4">
          <AlertCircle className="w-12 h-12 text-golden mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Are you sure?
          </h4>
          <p className="text-xs text-slate-500 mt-2">
            This action deletes{" "}
            <strong>
              {selectedStudent?.[surnameCol]} (ID: {selectedStudent?.[idCol]})
            </strong>{" "}
            permanently.
          </p>
        </div>
      </FormModal>
    </div>
  );
};

export default StudentsRegistry;
