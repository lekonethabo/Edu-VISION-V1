"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  AlertCircle,
  School,
  Activity,
  Network,
  Zap,
  Globe,
  Trash2,
  FileText
} from "lucide-react";
import { useFilters } from "@/hooks/useFilters";
import {
  getSchoolsAction,
  addSchoolAction,
  updateSchoolAction,
  deleteSchoolAction
} from "./schoolActions";
import { SectionContainer } from "../shared/SectionContainer";
import { FilterBar } from "../shared/FilterBar";
import { DataTable, ColumnConfig } from "../shared/DataTable";
import { FormModal } from "../shared/FormModal";
import { AddButton } from "../shared/ActionButtons";

import primaryConfig from "./configs/school_primary.json";
import juniorConfig from "./configs/school_junior_secondary.json";
import earlyConfig from "./configs/school_early_childhood.json";
import spedConfig from "./configs/school_sped.json";
import unifiedConfig from "./configs/school_unified.json";

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
  default?: string;
}

export interface JsonConfig {
  form_title: string;
  fields: JsonField[];
}

export interface DynamicSchool {
  id: string; // The primary ID mapping (School Registration Number)
  [key: string]: any;
}

const getFieldSection = (fieldName: string): string => {
  const name = fieldName.toUpperCase();
  
  // Section 1: Basic Institutional & Administrative Information
  if (
    name.includes("SCHOOL NAME") ||
    name.includes("DISTRICT") ||
    name.includes("EDUCATION REGION") ||
    name.includes("SUB-REGION") ||
    name.includes("VILLAGE/ CITY/ TOWN") ||
    name.includes("CITY/TOWN/ VILLAGE") ||
    name.includes("EXTENSION/ WARD") ||
    name.includes("EXTENSION/WARD") ||
    name.includes("TYPE OF SCHOOL") ||
    name.includes("TYPE OF CENTRE/ SCHOOL") ||
    name.includes("SCHOOL REGISTRATION NUMBER") ||
    name.includes("CENTRE REGISTRATION NUMBER") ||
    name.includes("CENTRE REGISTRATION STATUS") ||
    name.includes("LEVEL") ||
    name.includes("YEAR OF ESTABLISHMENT") ||
    name.includes("STATUS OF PREMISES") ||
    name.includes("TYPE OF PREMISES") ||
    name.includes("SERVICE PROVIDED") ||
    name.includes("OWNERSHIP") ||
    name.includes("SCHOOL FEES")
  ) {
    return "Section 1: Basic Institutional & Administrative Information";
  }
  
  // Section 2: Streams, Classrooms & Enrollment Organization
  if (
    name.includes("STREAMS") ||
    name.includes("STANDARD") ||
    name.includes("FORM ") ||
    name.includes("MULTIGRADE") ||
    name.includes("ENROLMENT") ||
    name.includes("STIMULATION") ||
    name.includes("ACADEMIC STREAMS") ||
    name.includes("TRANSITION STREAMS")
  ) {
    return "Section 2: Streams, Classrooms & Enrollment Organization";
  }

  // Section 4: Contact & Communication Details
  if (
    name.includes("TELEPHONE") ||
    name.includes("FAX") ||
    name.includes("EMAIL")
  ) {
    return "Section 4: Contact & Communication Details";
  }

  // Section 3: Institutional Services, Infrastructure & Utilities
  return "Section 3: Institutional Services, Infrastructure & Utilities";
};

export const SchoolInfoRegistry: React.FC<{ toolType?: ToolLevel }> = ({
  toolType = "PRIMARY",
}) => {
  const [activeTool, setActiveTool] = useState<ToolLevel>(toolType);
  const config = JSON_CONFIGS[activeTool] as JsonConfig;
  const storageKey = activeTool.toLowerCase() + "_school_info";

  return (
    <DynamicSchoolInfoRegistryWrapper
      key={activeTool}
      activeTool={activeTool}
      config={config}
      storageKey={storageKey}
      onChangeTool={setActiveTool}
    />
  );
};

const DynamicSchoolInfoRegistryWrapper: React.FC<{
  activeTool: ToolLevel;
  config: JsonConfig;
  storageKey: string;
  onChangeTool: (tool: ToolLevel) => void;
}> = ({ activeTool, config, storageKey, onChangeTool }) => {
  // 1. Database Persistence
  const [items, setItems] = useState<DynamicSchool[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);

  const fetchSchools = async () => {
    setIsDataLoading(true);
    const result = await getSchoolsAction(activeTool);
    if (result.success && result.data) {
      setItems(result.data);
    } else {
      triggerAlert(result.error || "Failed to load school profiles.", "error");
    }
    setIsDataLoading(false);
  };

  useEffect(() => {
    fetchSchools();
  }, [activeTool]);

  // 2. UI States
  const [modalOpen, setModalOpen] = useState(false);
  const [dossierOpen, setDossierOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<DynamicSchool | null>(
    null,
  );
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // 3. Form Field State
  const [formData, setFormData] = useState<Partial<DynamicSchool>>({});

  // Trigger alert notifications helper
  const triggerAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000); // Adheres to 5.0 seconds (5000ms) toast threshold from AGENTS.md
  };

  // Find column maps from config fields
  const nameCol =
    config.fields.find((f) => f.name.includes("SCHOOL NAME"))?.column || "A";
  const regCol =
    config.fields.find((f) => f.name.includes("REGISTRATION NUMBER"))?.column || "H";
  const districtCol =
    config.fields.find((f) => f.name.includes("DISTRICT"))?.column || "B";
  const regionCol =
    config.fields.find((f) => f.name.includes("REGION") && !f.name.includes("SUB"))?.column || "C";
  const boardingCol =
    config.fields.find((f) => f.name.includes("BOARDING"))?.column || "Q";
  const electricityCol =
    config.fields.find((f) => f.name.includes("ELECTRICITY"))?.column || "Z";
  const waterCol =
    config.fields.find((f) => f.name.includes("WATER"))?.column || "AA";
  const internetCol =
    config.fields.find(
      (f) => f.name.includes("INTERNET INFRASTRUCTURE") || f.name.includes("TYPE OF INTERNET CONNECTION")
    )?.column || "S";

  // 4. Listing Filters via useFilters hook
  const {
    searchQuery,
    setSearchQuery,
    activeFilters,
    setFilterVal,
    clearFilters,
    filteredItems,
  } = useFilters<DynamicSchool>(items, [nameCol, regCol], {
    district: "All",
    region: "All",
  });

  const districtOptions = useMemo(() => {
    return Array.from(new Set(items.map((i) => i[districtCol]).filter(Boolean)));
  }, [items, districtCol]);

  const regionOptions = useMemo(() => {
    return Array.from(new Set(items.map((i) => i[regionCol]).filter(Boolean)));
  }, [items, regionCol]);

  const filterConfigs = [
    {
      key: "district",
      label: "District",
      value: activeFilters.district || "All",
      options: districtOptions,
      onChange: (val: string) => setFilterVal("district", val),
    },
    {
      key: "region",
      label: "Region",
      value: activeFilters.region || "All",
      options: regionOptions,
      onChange: (val: string) => setFilterVal("region", val),
    },
  ];

  // Table Columns Setup dynamically generated from JSON
  const columns: ColumnConfig<DynamicSchool>[] = useMemo(() => {
    const cols: ColumnConfig<DynamicSchool>[] = [];

    // School Name (Column A)
    cols.push({
      header: "School Name",
      accessorKey: nameCol as keyof DynamicSchool,
      className: "font-bold text-slate-900 dark:text-slate-100 uppercase",
    });

    // Registration number
    cols.push({
      header: "Registration Number",
      accessorKey: regCol as keyof DynamicSchool,
      className: "font-mono font-bold text-sea",
    });

    // District
    cols.push({
      header: "District",
      accessorKey: districtCol as keyof DynamicSchool,
      className: "text-slate-750 dark:text-slate-350",
    });

    // Region
    cols.push({
      header: "Education Region",
      accessorKey: regionCol as keyof DynamicSchool,
      className: "text-slate-750 dark:text-slate-350",
    });

    return cols;
  }, [nameCol, regCol, districtCol, regionCol]);

  // Handle Add/Edit Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData[nameCol] || !formData[regCol]) {
      triggerAlert(
        "School Name and School Registration Number are required.",
        "error",
      );
      return;
    }

    const compiled: DynamicSchool = { id: formData[regCol], ...formData };

    if (selectedSchool) {
      const res = await updateSchoolAction(compiled, activeTool);
      if (res.success) {
        triggerAlert(`Record for ${compiled[nameCol]} updated successfully.`, "success");
        fetchSchools();
      } else {
        triggerAlert(res.error || "Failed to update record.", "error");
      }
    } else {
      const res = await addSchoolAction(compiled, activeTool);
      if (res.success) {
        triggerAlert(`New institutional profile for ${compiled[nameCol]} registered.`, "success");
        fetchSchools();
      } else {
        triggerAlert(res.error || "Failed to register school.", "error");
      }
    }

    setModalOpen(false);
    setSelectedSchool(null);
    setFormData({});
  };

  const handleEditClick = (sc: DynamicSchool) => {
    setSelectedSchool(sc);
    setFormData(sc);
    setModalOpen(true);
  };

  const handleViewClick = (sc: DynamicSchool) => {
    setSelectedSchool(sc);
    setDossierOpen(true);
  };

  const handleDeleteClick = (sc: DynamicSchool) => {
    setSelectedSchool(sc);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedSchool) {
      const res = await deleteSchoolAction(selectedSchool.id);
      if (res.success) {
        triggerAlert(`Institutional profile for ${selectedSchool[nameCol]} deleted.`, "success");
        fetchSchools();
      } else {
        triggerAlert(res.error || "Failed to delete school profile.", "error");
      }
      setDeleteOpen(false);
      setSelectedSchool(null);
    }
  };

  // Stats
  const total = items.length;
  
  const bpcPower = items.filter((i) => {
    const val = String(i[electricityCol] || "").toLowerCase();
    return val.includes("grid") || val.includes("bpc");
  }).length;

  const connectedWifi = items.filter((i) => {
    const val = String(i[internetCol] || "").toLowerCase();
    return val !== "none" && val !== "" && val !== "n/a";
  }).length;

  const boardingSchools = items.filter((i) => {
    const val = String(i[boardingCol] || "").toLowerCase();
    return val === "yes";
  }).length;

  return (
    <div className="space-y-6 animate-fade-in" id="school-info-registry-section">
      {alert && (
        <div
          id="school-info-toast-alert"
          className={`p-4 rounded-xl border flex items-center gap-3 text-xs font-semibold ${
            alert.type === "success" 
              ? "bg-sea/10 border-sea/30 text-sea" 
              : "bg-golden/10 border-golden/30 text-golden"
          }`}
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
                Total Registries
              </p>
              <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100">
                {total}
              </h3>
            </div>
            <div className="p-2 bg-sea/10 rounded-lg text-sea">
              <School className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Grid Power (BPC)
              </p>
              <h3 className="text-3xl font-black text-amber-600 dark:text-amber-400">
                {bpcPower}
              </h3>
            </div>
            <div className="p-2 bg-amber-50 dark:bg-amber-900/40 rounded-lg text-amber-600 dark:text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Active Internet
              </p>
              <h3 className="text-3xl font-black text-cyan-600 dark:text-cyan-400">
                {connectedWifi}
              </h3>
            </div>
            <div className="p-2 bg-cyan-50 dark:bg-cyan-900/40 rounded-lg text-cyan-600 dark:text-cyan-400">
              <Network className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Boarding Units
              </p>
              <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {boardingSchools}
              </h3>
            </div>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/40 rounded-lg text-emerald-600 dark:text-emerald-400">
              <Globe className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <SectionContainer
        title={config.form_title}
        description="National statutory institutional profile registry powered by unified architecture."
        action={
          <div className="flex items-center gap-3">
            <AddButton
              label="Add New School"
              onClick={() => {
                setSelectedSchool(null);
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
          searchPlaceholder="Search School ID or Name..."
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
          emptyMessage="No institutional profiles match active filter scopes."
        />
      </SectionContainer>

      {/* Add / Edit Form Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedSchool ? `Modify Profile: ${selectedSchool[nameCol]}` : "Register Institutional Profile"}
        onSubmit={handleSubmit}
        size="3xl"
      >
        <div className="space-y-6">
          {[
            "Section 1: Basic Institutional & Administrative Information",
            "Section 2: Streams, Classrooms & Enrollment Organization",
            "Section 3: Institutional Services, Infrastructure & Utilities",
            "Section 4: Contact & Communication Details",
          ].map((sectionName) => {
            const secFields = config.fields.filter(
              (f) => getFieldSection(f.name) === sectionName
            );
            if (secFields.length === 0) return null;

            return (
              <div key={sectionName} className="space-y-4">
                <h3 className="block text-xs font-black uppercase tracking-wider text-prussian dark:text-sea border-b border-slate-200 dark:border-slate-800 pb-2.5 mt-2">
                  {sectionName}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {secFields.map((field) => (
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
                          className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded focus:ring-1 focus:ring-sea outline-none text-slate-900 dark:text-white"
                        >
                          <option value="">-- Select Option --</option>
                          {field.options?.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.input_type === "number" ? "number" : "text"}
                          required={field.validation?.allow_blank === false}
                          disabled={!!selectedSchool && field.column === regCol}
                          value={formData[field.column] ?? ""}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              [field.column]: field.input_type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value,
                            }))
                          }
                          className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded focus:ring-1 focus:ring-sea outline-none text-slate-900 dark:text-white"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </FormModal>

      {/* Dossier Modal */}
      <FormModal
        isOpen={dossierOpen}
        onClose={() => setDossierOpen(false)}
        title={`${selectedSchool ? selectedSchool[nameCol] : "School"} - Profile Dossier`}
        onSubmit={(e) => {
          e.preventDefault();
          setDossierOpen(false);
        }}
        submitLabel="Close"
        cancelLabel="Print Dossier"
      >
        {selectedSchool && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 p-4 border dark:border-slate-800 rounded">
              <div className="w-12 h-12 rounded bg-prussian flex items-center justify-center text-white font-black text-xl shadow-md">
                {String(selectedSchool[nameCol] || "S").charAt(0)}
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 uppercase">
                  {selectedSchool[nameCol]}
                </h4>
                <p className="text-xs font-mono text-sea mt-0.5">
                  Reg No: {selectedSchool[regCol]}
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
                    {selectedSchool[field.column] !== undefined && selectedSchool[field.column] !== null
                      ? String(selectedSchool[field.column])
                      : "N/A"}
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
          <Trash2 className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            De-register Institutional Instance?
          </h4>
          <p className="text-xs text-slate-500 mt-2">
            Are you sure you want to permanently delete school profile listing: <strong className="text-slate-850 dark:text-slate-200">{selectedSchool?.[nameCol]}</strong>?
          </p>
        </div>
      </FormModal>
    </div>
  );
};

export default SchoolInfoRegistry;
