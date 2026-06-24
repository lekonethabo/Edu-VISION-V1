"use client";

import React, { useState, useMemo } from "react";
import {
  AlertCircle,
  FileText,
  UserMinus,
  UserPlus,
  ArrowLeftRight,
  Activity,
  Heart,
  TrendingUp,
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useFilters } from "@/hooks/useFilters";
import { SectionContainer } from "../shared/SectionContainer";
import { FilterBar } from "../shared/FilterBar";
import { DataTable, ColumnConfig } from "../shared/DataTable";
import { FormModal } from "../shared/FormModal";
import { AddButton } from "../shared/ActionButtons";

import primaryConfig from "./configs/transfer_primary.json";
import juniorConfig from "./configs/transfer_junior_secondary.json";
import earlyConfig from "./configs/transfer_early_childhood.json";
import spedConfig from "./configs/transfer_sped.json";
import unifiedConfig from "./configs/transfer_unified.json";

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
  placeholder?: string;
  validation?: any;
}

export interface JsonConfig {
  form_title: string;
  fields: JsonField[];
}

export interface DynamicTransfer {
  id: string; // Col A
  [key: string]: any;
}

const getFieldSection = (fieldName: string): string => {
  const name = fieldName.toUpperCase();

  // Section 1: Demographics & Identification
  if (
    name.includes("NATIONAL ID") ||
    name.includes("SURNAME") ||
    name.includes("STUDENT NAMES") ||
    name.includes("NATIONALITY") ||
    name.includes("SEX") ||
    name.includes("DATE OF BIRTH") ||
    name.includes("DOB")
  ) {
    return "Section 1: Demographics & Identification";
  }

  // Section 2: Academic Status & Placement
  if (
    (name.includes("STANDARD") && !name.includes("TRANSIT") && !name.includes("CONVERSION")) ||
    name.includes("FORM") ||
    name.includes("CATEGORY/ LEVEL")
  ) {
    return "Section 2: Academic Status & Placement";
  }

  // Section 4: Special Support & Social Indicators (SPED)
  if (
    name.includes("SOCIAL STATUS") ||
    name.includes("SUPPORT FOR") ||
    name.includes("SPECIAL EDUCATION NEEDS") ||
    name.includes("SUPPORT SERVICES")
  ) {
    return "Section 4: Special Support & Social Indicators";
  }

  // Section 3: Transfer & Transition Logistics
  return "Section 3: Transfer & Transition Logistics";
};

export const TransfersRegistry: React.FC<{ toolType?: ToolLevel }> = ({
  toolType = "PRIMARY",
}) => {
  const config = JSON_CONFIGS[toolType] as JsonConfig;
  const storageKey = toolType.toLowerCase() + "_transfers";

  return (
    <DynamicTransfersRegistryWrapper
      key={toolType}
      activeTool={toolType}
      config={config}
      storageKey={storageKey}
    />
  );
};

const DynamicTransfersRegistryWrapper: React.FC<{
  activeTool: ToolLevel;
  config: JsonConfig;
  storageKey: string;
}> = ({ activeTool, config, storageKey }) => {
  // 1. Storage & Persistence
  const { items, addItem, updateItem, deleteItem } =
    useLocalStorage<DynamicTransfer>(storageKey, []);

  // Fetch student directory list for detail merging
  const studentStorageKey = activeTool.toLowerCase() + "_students";
  const { items: studentsList } = useLocalStorage<any>(studentStorageKey, []);

  // 2. UI States
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] =
    useState<DynamicTransfer | null>(null);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // 3. Form Field State
  const [formData, setFormData] = useState<Partial<DynamicTransfer>>({});

  // Trigger alert notifications helper
  const triggerAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  // Extract core positions
  const idCol = "A";
  const surnameCol = "B";
  const firstCol = "C";
  const natCol = "D";
  const sexCol = "E";
  const levelCol = activeTool === "SPED" ? "H" : "F";
  const statusCol = "G";

  // Helper to compile transfer date from separate sub-fields (H, I, J)
  const getTransferDate = (st: any) => {
    const d = st["H"];
    const m = st["I"];
    const y = st["J"];
    if (!d || !m || !y) return "N/A";
    return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
  };

  // 4. Listing Filters via useFilters hook
  const {
    searchQuery,
    setSearchQuery,
    activeFilters,
    setFilterVal,
    clearFilters,
    filteredItems,
  } = useFilters<DynamicTransfer>(items, [idCol, surnameCol, firstCol], {
    [sexCol]: "All",
    [levelCol]: "All",
    ...(activeTool !== "SPED" ? { [statusCol]: "All" } : {}),
  });

  // Calculate Operational Metrics & Statistics
  const stats = useMemo(() => {
    if (activeTool === "SPED") {
      let total = items.length;
      let std1 = items.filter((i) => i["H"] === "Standard 1").length;
      let otherStds = total - std1;

      // Find top Special Need Category
      const needsCounts: Record<string, number> = {};
      items.forEach((i) => {
        const need = i["K"];
        if (need) {
          needsCounts[need] = (needsCounts[need] || 0) + 1;
        }
      });
      let topNeed = "N/A";
      let maxCount = 0;
      Object.entries(needsCounts).forEach(([need, count]) => {
        if (count > maxCount) {
          maxCount = count;
          topNeed = need;
        }
      });

      return {
        total,
        std1,
        otherStds,
        topNeed,
      };
    } else {
      let total = items.length;
      let transferIn = items.filter((i) => i["G"] === "Transfer In").length;
      let transferOut = items.filter((i) => i["G"] === "Transfer Out").length;
      let netChange = transferIn - transferOut;

      return {
        total,
        transferIn,
        transferOut,
        netChange,
      };
    }
  }, [items, activeTool]);

  // Form Field options mapped dynamically
  const levelOptions = useMemo(() => {
    const fld = config.fields.find((f) => f.column === levelCol);
    return fld?.options || [];
  }, [config, levelCol]);

  const sexOptions = useMemo(() => {
    const fld = config.fields.find((f) => f.column === sexCol);
    return fld?.options || ["Male", "Female"];
  }, [config, sexCol]);

  const statusOptions = useMemo(() => {
    const fld = config.fields.find((f) => f.column === statusCol);
    return fld?.options || ["Transfer In", "Transfer Out"];
  }, [config, statusCol]);

  const filterConfigs = useMemo(() => {
    const configs = [
      {
        key: sexCol,
        label: "Gender",
        value: activeFilters[sexCol] || "All",
        options: sexOptions,
        onChange: (val: string) => setFilterVal(sexCol, val),
        allLabel: "All",
      },
      {
        key: levelCol,
        label: activeTool === "SPED" ? "Standard Transitioned" : activeTool === "JUNIOR" || activeTool === "UNIFIED" ? "Form" : "Standard",
        value: activeFilters[levelCol] || "All",
        options: levelOptions,
        onChange: (val: string) => setFilterVal(levelCol, val),
        allLabel: "All",
      },
    ];

    if (activeTool !== "SPED") {
      configs.push({
        key: statusCol,
        label: "Transfer Status",
        value: activeFilters[statusCol] || "All",
        options: statusOptions,
        onChange: (val: string) => setFilterVal(statusCol, val),
        allLabel: "All",
      });
    }

    return configs;
  }, [activeTool, activeFilters, sexCol, levelCol, statusCol, sexOptions, levelOptions, statusOptions, setFilterVal]);

  // Table Columns Setup dynamically generated
  const columns: ColumnConfig<DynamicTransfer>[] = useMemo(() => {
    const cols: ColumnConfig<DynamicTransfer>[] = [];

    // 1. National ID / Passport
    cols.push({
      header: "National ID",
      accessorKey: "A",
      className: "font-mono font-bold text-sea",
    });

    // 2. Full Name
    cols.push({
      header: "Full Name",
      render: (st) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-slate-100 truncate uppercase block">
            {st["B"]}
          </span>
          <span className="text-slate-500 dark:text-slate-400 text-xs block">
            {st["C"]}
          </span>
        </div>
      ),
    });

    // 3. Gender
    cols.push({
      header: "Gender",
      accessorKey: "E",
      className: "font-semibold text-slate-700 dark:text-slate-300",
    });

    // 4. Nationality
    cols.push({
      header: "Nationality",
      accessorKey: "D",
      className: "text-slate-600 dark:text-slate-400 text-sm",
    });

    if (activeTool === "SPED") {
      // 5. Standard Transited To
      cols.push({
        header: "Transited To",
        accessorKey: "H",
        className: "font-bold text-prussian dark:text-sea",
      });

      // 6. Special Needs
      cols.push({
        header: "Special Need",
        accessorKey: "K",
        className: "text-rose-600 dark:text-rose-400 font-medium text-xs",
        render: (st) => (
          <span className="truncate block max-w-[150px]" title={st["K"]}>
            {st["K"] || "N/A"}
          </span>
        ),
      });

      // 7. Year of Transition
      cols.push({
        header: "Transition Year",
        accessorKey: "G",
        className: "font-mono text-xs text-slate-500",
      });
    } else {
      // 5. Standard Grade / Form
      cols.push({
        header: activeTool === "JUNIOR" || activeTool === "UNIFIED" ? "Form" : "Standard",
        accessorKey: "F",
        className: "font-bold text-slate-800 dark:text-slate-100",
      });

      // 6. Status Direction
      cols.push({
        header: "Transfer Status",
        render: (st) => {
          const status = st["G"] || "Transfer In";
          return (
            <span
              className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                status === "Transfer In"
                  ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400"
                  : "bg-orange-100 dark:bg-orange-950/40 text-orange-850 dark:text-orange-400"
              }`}
            >
              {status}
            </span>
          );
        },
      });

      // 7. Date of Transfer
      cols.push({
        header: "Transfer Date",
        render: (st) => getTransferDate(st),
        className: "font-mono text-xs",
      });

      // 8. Previous School
      cols.push({
        header: "Prev / Target School",
        accessorKey: "K",
        className: "font-medium text-slate-600 dark:text-slate-400 text-xs",
      });
    }

    return cols;
  }, [activeTool]);

  // Smart change and details merging from students list
  const handleFieldChange = (column: string, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [column]: value };

      // Automatic details merge from Students Directory if NATIONAL ID column (A) is typed
      if (column === "A" && value.length >= 4) {
        const foundStudent = studentsList.find(
          (s: any) => String(s["A"]).trim().toUpperCase() === value.trim().toUpperCase()
        );
        if (foundStudent) {
          updated["B"] = foundStudent["B"] || ""; // Surname
          updated["C"] = foundStudent["C"] || ""; // Full names
          updated["D"] = foundStudent["D"] || "Botswana"; // Nationality
          updated["E"] = foundStudent["E"] || "Female"; // Sex
          setTimeout(
            () => triggerAlert("Student data merged from school directory.", "success"),
            50
          );
        }
      }
      return updated;
    });
  };

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData[idCol] || !formData[surnameCol] || !formData[firstCol]) {
      triggerAlert(
        "Student National ID, Surname, and names are required.",
        "error"
      );
      return;
    }

    const compiled: DynamicTransfer = {
      id: String(formData[idCol]).trim(),
    };

    config.fields.forEach((field) => {
      let val = formData[field.column];
      if (field.input_type === "number") {
        compiled[field.column] = val === "" || val === undefined ? "" : Number(val);
      } else {
        compiled[field.column] = val === undefined ? "" : String(val);
      }
    });

    if (selectedTransfer) {
      updateItem(compiled);
      triggerAlert(
        `Transfer updated for ${compiled[surnameCol]} (${compiled[idCol]}).`,
        "success"
      );
    } else {
      addItem(compiled);
      triggerAlert(
        `Registered transfer record for ${compiled[surnameCol]} successfully.`,
        "success"
      );
    }

    setModalOpen(false);
    setSelectedTransfer(null);
    setFormData({});
  };

  const handleEditClick = (st: DynamicTransfer) => {
    setSelectedTransfer(st);
    setFormData({ ...st });
    setModalOpen(true);
  };

  const handleDeleteClick = (st: DynamicTransfer) => {
    setSelectedTransfer(st);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedTransfer) {
      deleteItem(selectedTransfer.id);
      triggerAlert(
        `Deleted transfer ledger file: ${selectedTransfer[surnameCol]} (${selectedTransfer[idCol]}).`,
        "success"
      );
      setDeleteOpen(false);
      setSelectedTransfer(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Feedbacks */}
      {alert && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 text-xs font-bold shadow-sm ${
            alert.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
              : "bg-rose-500/10 border-rose-500/30 text-rose-500"
          }`}
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{alert.message}</span>
        </div>
      )}

      {/* Dynamic Statistics Block */}
      {activeTool === "SPED" ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-[#001020] p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
            <div className="p-3 bg-prussian/10 text-prussian dark:text-sky-400 rounded-xl">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Total Transitions
              </span>
              <span className="text-2xl font-black text-prussian dark:text-slate-100">
                {stats.total}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#001020] p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
            <div className="p-3 bg-[#00A3A3]/10 text-[#00A3A3] rounded-xl animate-pulse">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Standard 1 Entries
              </span>
              <span className="text-2xl font-black text-[#00A3A3] dark:text-slate-100">
                {stats.std1}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#001020] p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Std 2-7 Transitions
              </span>
              <span className="text-2xl font-black text-slate-800 dark:text-slate-100">
                {stats.otherStds}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#001020] p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 max-w-full">
            <div className="p-3 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl">
              <Heart className="w-5 h-5" />
            </div>
            <div className="truncate w-full">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Primary Need Category
              </span>
              <span
                className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase truncate block"
                title={stats.topNeed}
              >
                {stats.topNeed}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-[#001020] p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
            <div className="p-3 bg-prussian/10 text-prussian dark:text-sky-400 rounded-xl">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Total Logs
              </span>
              <span className="text-2xl font-black text-prussian dark:text-slate-100">
                {stats.total}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#001020] p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Transferred In
              </span>
              <span className="text-2xl font-black text-emerald-600 dark:text-slate-100">
                {stats.transferIn}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#001020] p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl">
              <UserMinus className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Transferred Out
              </span>
              <span className="text-2xl font-black text-slate-800 dark:text-slate-100">
                {stats.transferOut}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#001020] p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Net Pupil Change
              </span>
              <span
                className={`text-2xl font-black ${
                  (stats.netChange ?? 0) >= 0
                    ? "text-[#00A3A3]"
                    : "text-amber-500"
                }`}
              >
                {(stats.netChange ?? 0) > 0 ? "+" : ""}
                {stats.netChange ?? 0}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Section Container */}
      <SectionContainer
        title={config.form_title}
        description={`Configure database registries, track national movements, and manage enrollment conversions for your operational ${activeTool.toLowerCase()} administrative tool.`}
        action={
          <AddButton
            label={activeTool === "SPED" ? "Log Transition Event" : "Log New Transfer Event"}
            onClick={() => {
              setSelectedTransfer(null);
              // Setup default values based on active configuration
              const defValues: Record<string, any> = {};
              config.fields.forEach((f) => {
                if (f.column === "E") defValues["E"] = sexOptions[0] || "Female";
                if (f.column === "G" && activeTool !== "SPED") defValues["G"] = statusOptions[0] || "Transfer In";
                if (f.column === "F" && activeTool !== "SPED") defValues["F"] = levelOptions[0] || "";
                if (f.column === "H" && activeTool === "SPED") defValues["H"] = levelOptions[0] || "";
                if (f.column === "J" && f.input_type === "number") defValues["J"] = 2025; // Year defaults to 2025 as per assets
              });
              setFormData(defValues);
              setModalOpen(true);
            }}
          />
        }
      >
        {/* Global Filter Toolbar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by ID, Name or Surname..."
          filters={filterConfigs}
          onClear={clearFilters}
        />

        {/* Core Records Table */}
        <DataTable
          columns={columns}
          data={filteredItems}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          emptyMessage={`No documented transfer ledger events match the specified filtering parameters under ${activeTool.toLowerCase()} registers.`}
        />
      </SectionContainer>

      {/* Add / Edit Section-Based Form Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          selectedTransfer
            ? `Update ${config.form_title} Row`
            : `Log New ${config.form_title} Row`
        }
        onSubmit={handleSubmit}
        size="3xl"
      >
        <div className="space-y-6">
          {[
            "Section 1: Demographics & Identification",
            "Section 2: Academic Status & Placement",
            "Section 3: Transfer & Transition Logistics",
            "Section 4: Special Support & Social Indicators",
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
                            handleFieldChange(field.column, e.target.value)
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
                          type={
                            field.input_type === "number" ? "number" : "text"
                          }
                          required={field.validation?.allow_blank === false}
                          disabled={
                            !!selectedTransfer && field.column === idCol
                          }
                          placeholder={field.placeholder || ""}
                          value={formData[field.column] ?? ""}
                          onChange={(e) =>
                            handleFieldChange(
                              field.column,
                              field.input_type === "number"
                                ? e.target.value === ""
                                  ? ""
                                  : Number(e.target.value).toString()
                                : e.target.value
                            )
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

      {/* Delete Confirmation Modal */}
      <FormModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Confirm Deletion of Record"
        onSubmit={(e) => {
          e.preventDefault();
          confirmDelete();
        }}
        submitLabel="Delete Ledger Row"
        cancelLabel="Discard"
      >
        <div className="text-center py-4">
          <AlertCircle className="w-12 h-12 text-golden mx-auto mb-3 animate-bounce" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Permanently Delete Transfer Entry?
          </h4>
          <p className="text-xs text-slate-500 mt-2">
            Are you sure you want to delete the transfer record for{" "}
            <strong>
              {selectedTransfer?.[surnameCol]}, {selectedTransfer?.[firstCol]}
            </strong>{" "}
            (ID: {selectedTransfer?.[idCol]})? This action cannot be reverted.
          </p>
        </div>
      </FormModal>
    </div>
  );
};

export default TransfersRegistry;
