"use client";

import React, { useState, useMemo, useEffect } from "react";
import { AlertCircle, Users, ArrowRightLeft, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useFilters } from "@/hooks/useFilters";
import { SectionContainer } from "../shared/SectionContainer";
import { FilterBar } from "../shared/FilterBar";
import { DataTable, ColumnConfig } from "../shared/DataTable";
import { FormModal } from "../shared/FormModal";
import { AddButton } from "../shared/ActionButtons";

interface ECTeachingStaff {
  id: string;
  nationalIdPassport: string;
  surname: string;
  firstNames: string;
  nationality: string;
  sex: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
}

export interface ECTeacherMovement {
  id: string;
  nationalIdPassport: string;
  surname: string;
  firstNames: string;
  nationality: string;
  sex: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  staffPosition: string;
  contractType: string;
  reasonsForLeaving: string;
  deathReason: string;
  lastUpdated: string;
}

const SEX_OPTIONS = ["Male", "Female"];
const POSITION_OPTIONS = ["School Head", "Teacher"];
const CONTRACT_OPTIONS = [
  "Permanent & Pensionable Teacher",
  "Contract",
  "Temporary - Vacant Post",
  "Temporary - Study Leave",
  "Temporary - School Expansion",
  "Temporary - Relief",
  "Internship"
];
const REASONS_FOR_LEAVING = [
  "Contract Expiry",
  "Death",
  "Dismissal",
  "Joining other schools/centres",
  "Resignation",
  "Retirement",
  "Other"
];
const DEATH_REASONS = [
  "N/A",
  "Chemical Ingestion",
  "Drowning",
  "Fire",
  "Food Poisoning",
  "Homicide",
  "Illness",
  "Road Accident",
  "Suicide",
  "Other"
];

// Pre-defined nationalities block
const NATIONALITY_OPTIONS = [
  "Botswana", "Eswatini", "Lesotho", "Namibia", "South Africa", "Zambia", "Zimbabwe", "India", "United Kingdom", "United Republic of Tanzania", "United States of America", "People's Republic of China", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia (Plurinational State of)", "Bosnia and Herzegovina", "Brazil", "British Virgin Islands", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China, Hong Kong Special Administrative Region", "China, Macao Special Administrative Region", "Colombia", "Comoros", "Congo", "Cook Islands", "Costa Rica", "Côte d'Ivoire", "Croatia", "Cuba", "Curaçao", "Cyprus", "Czechia", "Democratic People's Republic of Korea", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", "Iceland", "Indonesia", "Iran (Islamic Republic of)", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Lao People's Democratic Republic", "Latin America and the Caribbean not specified", "Latvia", "Lebanon", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia (Federated States of)", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Republic of Korea", "Republic of Moldova", "Romania", "Russian Federation", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Sint Maarten (Dutch part)", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syrian Arab Republic", "Tajikistan", "Thailand", "Timor-Leste", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela (Bolivarian Republic of)", "Viet Nam", "Yemen"
];

export const TeacherMovementRegistry: React.FC = () => {
  const { items, addItem, updateItem, deleteItem } = useLocalStorage<ECTeacherMovement>(
    "edu_vision_ec_teacher_movement",
    []
  );

  const { items: staffItems } = useLocalStorage<ECTeachingStaff>("edu_vision_ec_teaching_staff", []);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<ECTeacherMovement | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const {
    searchQuery,
    setSearchQuery,
    activeFilters,
    setFilterVal,
    clearFilters,
    filteredItems
  } = useFilters<ECTeacherMovement>(items, ["nationalIdPassport", "surname", "firstNames"]);

  if (activeFilters.staffPosition === undefined) {
    setFilterVal("staffPosition", "");
  }
  if (activeFilters.reasonsForLeaving === undefined) {
    setFilterVal("reasonsForLeaving", "");
  }

  const triggerAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const stats = useMemo(() => {
    // Assuming all existing reasons are "Leaving"
    const totalMovements = items.length;
    const departures = items.length; // From options available
    const arrivals = 0; // Not represented in the current REASONS FOR LEAVING options
    const netChange = arrivals - departures;

    return {
      totalMovements,
      arrivals,
      departures,
      netChange
    };
  }, [items]);

  const defaultFormState: Partial<ECTeacherMovement> = {
    nationalIdPassport: "",
    surname: "",
    firstNames: "",
    nationality: "Botswana",
    sex: "",
    dobDay: "",
    dobMonth: "",
    dobYear: "",
    staffPosition: "Teacher",
    contractType: "Permanent & Pensionable Teacher",
    reasonsForLeaving: "Contract Expiry",
    deathReason: "N/A"
  };

  const [formData, setFormData] = useState<Partial<ECTeacherMovement>>(defaultFormState);

  // Auto-populate logic based on National ID
  useEffect(() => {
    if (formData.nationalIdPassport && formData.nationalIdPassport.length > 4) {
      const existingStaff = staffItems.find(s => s.nationalIdPassport === formData.nationalIdPassport);
      if (existingStaff && !selectedMovement) { // Don't override if editing
        setFormData(prev => ({
          ...prev,
          surname: existingStaff.surname || prev.surname,
          firstNames: existingStaff.firstNames || prev.firstNames,
          nationality: existingStaff.nationality || prev.nationality,
          sex: existingStaff.sex || prev.sex,
          dobDay: existingStaff.dobDay || prev.dobDay,
          dobMonth: existingStaff.dobMonth || prev.dobMonth,
          dobYear: existingStaff.dobYear || prev.dobYear,
        }));
      }
    }
  }, [formData.nationalIdPassport, staffItems, selectedMovement]);

  const handleOpenAdd = () => {
    setSelectedMovement(null);
    setFormData(defaultFormState);
    setModalOpen(true);
  };

  const handleOpenEdit = (movement: ECTeacherMovement) => {
    setSelectedMovement(movement);
    setFormData({ ...movement });
    setModalOpen(true);
  };

  const handleOpenDelete = (movement: ECTeacherMovement) => {
    setSelectedMovement(movement);
    setDeleteOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nationalIdPassport || !formData.surname || !formData.firstNames || !formData.staffPosition || !formData.reasonsForLeaving) {
      triggerAlert("Please fill in all required fields.", "error");
      return;
    }

    const dataToSave: ECTeacherMovement = {
      ...(formData as ECTeacherMovement),
      deathReason: formData.reasonsForLeaving === "Death" ? (formData.deathReason || "N/A") : "N/A",
      lastUpdated: new Date().toISOString()
    };

    if (selectedMovement) {
      updateItem(dataToSave);
      triggerAlert("Movement record updated.", "success");
    } else {
      addItem({ ...dataToSave, id: `move-${Date.now()}` });
      triggerAlert("Movement record added successfully.", "success");
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedMovement) {
      deleteItem(selectedMovement.id);
      triggerAlert("Movement record deleted.", "success");
      setDeleteOpen(false);
    }
  };

  const handleFieldChange = (field: keyof ECTeacherMovement, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const columns: ColumnConfig<ECTeacherMovement>[] = [
    { header: "#", accessorKey: "id", render: (item) => (filteredItems.findIndex(i => i.id === item.id) + 1).toString() },
    { header: "NATIONAL ID/ PASSPORT", accessorKey: "nationalIdPassport" },
    { header: "SURNAME", accessorKey: "surname" },
    { header: "FIRST NAMES", accessorKey: "firstNames" },
    { header: "SEX", accessorKey: "sex" },
    { header: "STAFF POSITION", accessorKey: "staffPosition" },
    { header: "REASON FOR LEAVING", accessorKey: "reasonsForLeaving" }
  ];

  return (
    <SectionContainer
      title="Teacher Movement (2025)"
      description="Record teaching staff departures, resignations, retirements, and movements."
    >
      {alert && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs font-bold shadow-sm ${
          alert.type === "success" 
            ? "bg-[#00A3A3]/10 border-[#00A3A3]/30 text-[#00A3A3]" 
            : "bg-rose-500/10 border-rose-500/30 text-rose-500"
        }`}>
          <AlertCircle className="w-4 h-4" />
          <span>{alert.message}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-[#000A14] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-[#002652]/10 text-[#002652] dark:text-sky-400 rounded-xl">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Movements</span>
            <span className="text-2xl font-black text-[#002652] dark:text-slate-100">{stats.totalMovements}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#000A14] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <ArrowDownRight className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Arrivals</span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{stats.arrivals}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#000A14] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Departures</span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{stats.departures}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#000A14] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-[#97620C]/10 text-[#97620C] rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Net Change</span>
            <span className={`text-2xl font-black ${stats.netChange >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>{stats.netChange > 0 ? `+${stats.netChange}` : stats.netChange}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#000A14] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 mb-6">
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by ID or Name..."
          filters={[
            {
              key: "staffPosition",
              label: "Position",
              value: activeFilters.staffPosition as string,
              options: ["All Positions", ...POSITION_OPTIONS],
              onChange: (val) => setFilterVal("staffPosition", val)
            },
            {
              key: "reasonsForLeaving",
              label: "Reason",
              value: activeFilters.reasonsForLeaving as string,
              options: ["All Reasons", ...REASONS_FOR_LEAVING],
              onChange: (val) => setFilterVal("reasonsForLeaving", val)
            }
          ]}
          onClear={clearFilters}
        />
        <AddButton 
          onClick={handleOpenAdd} 
          label="Add Movement" 
          className="bg-[#00A3A3] hover:bg-[#002652] text-white" 
        />
      </div>

      <DataTable
        data={filteredItems}
        columns={columns}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        emptyMessage="No teacher movement records found."
      />

      {/* Add/Edit Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedMovement ? "Update Movement Record" : "Log Teacher Movement"}
        onSubmit={handleSave}
        submitLabel={selectedMovement ? "Save Changes" : "Confirm Movement"}
      >
        <div className="space-y-6">
          {/* Section 1: Teacher Information */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-[#002652] dark:text-[#00A3A3] border-b border-slate-200 dark:border-slate-800 pb-2">
              Section 1: Teacher Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">NATIONAL ID/ PASSPORT *</label>
                <input
                  type="text"
                  required
                  value={formData.nationalIdPassport || ""}
                  onChange={(e) => handleFieldChange("nationalIdPassport", e.target.value)}
                  placeholder="Enter ID to auto-fill..."
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">SURNAME *</label>
                <input
                  type="text"
                  required
                  value={formData.surname || ""}
                  onChange={(e) => handleFieldChange("surname", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">FIRST NAMES *</label>
                <input
                  type="text"
                  required
                  value={formData.firstNames || ""}
                  onChange={(e) => handleFieldChange("firstNames", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">NATIONALITY</label>
                <select
                  value={formData.nationality || ""}
                  onChange={(e) => handleFieldChange("nationality", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  {NATIONALITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">SEX</label>
                <select
                  value={formData.sex || ""}
                  onChange={(e) => handleFieldChange("sex", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  <option value="">-- Select --</option>
                  {SEX_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">DOB DAY</label>
                <input
                  type="text"
                  placeholder="DD"
                  value={formData.dobDay || ""}
                  onChange={(e) => handleFieldChange("dobDay", e.target.value.replace(/\D/g, "").slice(0, 2))}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">DOB MONTH</label>
                <input
                  type="text"
                  placeholder="MM"
                  value={formData.dobMonth || ""}
                  onChange={(e) => handleFieldChange("dobMonth", e.target.value.replace(/\D/g, "").slice(0, 2))}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">DOB YEAR</label>
                <input
                  type="text"
                  placeholder="YYYY"
                  value={formData.dobYear || ""}
                  onChange={(e) => handleFieldChange("dobYear", e.target.value.replace(/\D/g, "").slice(0, 4))}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Movement Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-[#002652] dark:text-[#00A3A3] border-b border-slate-200 dark:border-slate-800 pb-2">
              Section 2: Movement Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">STAFF POSITION</label>
                <select
                  value={formData.staffPosition || ""}
                  onChange={(e) => handleFieldChange("staffPosition", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  <option value="">-- Select --</option>
                  {POSITION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">CONTRACT TYPE</label>
                <select
                  value={formData.contractType || ""}
                  onChange={(e) => handleFieldChange("contractType", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  <option value="">-- Select --</option>
                  {CONTRACT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">REASONS FOR LEAVING *</label>
                <select
                  required
                  value={formData.reasonsForLeaving || ""}
                  onChange={(e) => handleFieldChange("reasonsForLeaving", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  <option value="">-- Select --</option>
                  {REASONS_FOR_LEAVING.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Death Details (Conditional) */}
          {formData.reasonsForLeaving === "Death" && (
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase text-rose-500 border-b border-rose-200 dark:border-rose-900/50 pb-2">
                Section 3: Death Details
              </h4>
              <div className="bg-rose-50 dark:bg-rose-950/20 p-4 rounded-lg border border-rose-100 dark:border-rose-900/50">
                <label className="block text-[10px] uppercase font-bold text-rose-700 dark:text-rose-400 tracking-wider mb-1">IF DEATH Specify Reasons</label>
                <select
                  value={formData.deathReason || ""}
                  onChange={(e) => handleFieldChange("deathReason", e.target.value)}
                  className="w-full text-xs p-2.5 bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900 rounded-lg outline-none text-rose-700 dark:text-rose-400"
                >
                  <option value="">-- Select --</option>
                  {DEATH_REASONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>
      </FormModal>

      {/* Delete Confirmation */}
      <FormModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Confirm Deletion"
        onSubmit={(e) => { e.preventDefault(); handleDelete(); }}
        submitLabel="Confirm Delete"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Are you sure you want to delete the movement record for <strong>{selectedMovement?.firstNames} {selectedMovement?.surname}</strong>? 
            This action cannot be undone.
          </p>
        </div>
      </FormModal>
    </SectionContainer>
  );
};
