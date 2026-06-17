"use client";

import React, { useState, useMemo, useEffect } from "react";
import { AlertCircle, UserMinus, User, PieChart, Info } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useFilters } from "@/hooks/useFilters";
import { SectionContainer } from "../shared/SectionContainer";
import { FilterBar } from "../shared/FilterBar";
import { DataTable, ColumnConfig } from "../shared/DataTable";
import { FormModal } from "../shared/FormModal";
import { AddButton } from "../shared/ActionButtons";
import { ECStudent } from "./EarlyChildhoodStudentsRegistry";

export interface ECDropout {
  id: string;
  nationalIdPassport: string;
  surname: string;
  studentNames: string;
  nationality: string;
  sex: string;
  
  dateDroppedOutDay: string;
  dateDroppedOutMonth: string;
  dateDroppedOutYear: string;
  categoryLevel: string;
  
  reasonsForDroppingOut: string;
  specifyCauseOfDeath: string;
  
  specialEducationNeeds: string;
  typeOfSpecialEducationNeeds: string;
  typeOfSupportReceived: string;
  
  lastUpdated: string;
}

const CATEGORY_LEVEL_OPTIONS = ["Baby Care", "Day Care/Nursery", "Pre-primary (Excluding Reception)", "Reception"];
const SEX_OPTIONS = ["Male", "Female"];
const NATIONALITY_OPTIONS = [
  "Botswana", "Eswatini", "Lesotho", "Namibia", "South Africa", "Zambia", "Zimbabwe", "India", "United Kingdom", "United Republic of Tanzania", "United States of America", "People's Republic of China", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia (Plurinational State of)", "Bosnia and Herzegovina", "Brazil", "British Virgin Islands", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China, Hong Kong Special Administrative Region", "China, Macao Special Administrative Region", "Colombia", "Comoros", "Congo", "Cook Islands", "Costa Rica", "Côte d'Ivoire", "Croatia", "Cuba", "Curaçao", "Cyprus", "Czechia", "Democratic People's Republic of Korea", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", "Iceland", "Indonesia", "Iran (Islamic Republic of)", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Lao People's Democratic Republic", "Latin America and the Caribbean not specified", "Latvia", "Lebanon", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia (Federated States of)", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Republic of Korea", "Republic of Moldova", "Romania", "Russian Federation", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Sint Maarten (Dutch part)", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syrian Arab Republic", "Tajikistan", "Thailand", "Timor-Leste", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela (Bolivarian Republic of)", "Viet Nam", "Yemen"
];
const REASONS_OPTIONS = [
  "Fees", "Illness", "Bullying", "Religion", "Truancy", "Dissertion", "Other", "Death"
];
const CAUSE_OF_DEATH_OPTIONS = [
  "N/A", "Road Accident", "Fire", "Drowning", "Food Poisoning", "Chemical Ingestion", "Illness", "Homicide", "Suicide", "Falls/ Slip", "Electrocution", "Choking", "Struck by Objects", "Play ground/ Sports Accident", "Other"
];
const YES_NO_OPTIONS = ["Yes", "No"];
const SEND_TYPE_OPTIONS = [
  "N/A", "Attention deficit disorder", "Autism", "Behaviour disorder", "Blind", "Cerebral Palsy", "Deaf", "Epilepsy", "Hearing", "Intellectual Disability", "Physical (hunchback)", "Reading, writing, spelling disorder", "Speech or communication", "Visual", "Others"
];
const SEND_SUPPORT_OPTIONS = [
  "N/A", "Braille instruction", "Canes, Walkers", "Counseling", "Glasses/lenses", "Hearing Aids", "Occupational therapy", "Physical therapy", "Prosthetics/Artificial Limbs", "Sign language instruction", "Speech therapy", "Wheel Chair", "None"
];

export const EarlyChildhoodDropoutsRegistry: React.FC = () => {
  const { items, addItem, updateItem, deleteItem } = useLocalStorage<ECDropout>(
    "edu_vision_ec_dropouts",
    []
  );

  const { items: studentsList } = useLocalStorage<ECStudent>("edu_vision_ec_students", []);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDropout, setSelectedDropout] = useState<ECDropout | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const {
    searchQuery,
    setSearchQuery,
    activeFilters,
    setFilterVal,
    clearFilters,
    filteredItems
  } = useFilters<ECDropout>(items, ["nationalIdPassport", "surname", "studentNames"]);

  if (activeFilters.categoryLevel === undefined) {
    setFilterVal("categoryLevel", "");
  }
  if (activeFilters.reasonsForDroppingOut === undefined) {
    setFilterVal("reasonsForDroppingOut", "");
  }

  const triggerAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const getFormattedDate = (d: string, m: string, y: string) => {
    if (!d || !m || !y) return "N/A";
    return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
  };

  const stats = useMemo(() => {
    let males = 0;
    let females = 0;
    let withSen = 0;
    const categoryCounts: Record<string, number> = {};

    items.forEach(d => {
      if (d.sex === "Male") males++;
      if (d.sex === "Female") females++;
      if (d.specialEducationNeeds === "Yes") withSen++;
      categoryCounts[d.categoryLevel] = (categoryCounts[d.categoryLevel] || 0) + 1;
    });

    const topCategory = Object.keys(categoryCounts).length > 0 
      ? Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a] > categoryCounts[b] ? a : b)
      : "None";

    return {
      total: items.length,
      males,
      females,
      topCategory,
      withSen
    };
  }, [items]);

  const defaultFormState: Partial<ECDropout> = {
    nationalIdPassport: "",
    surname: "",
    studentNames: "",
    nationality: "Botswana",
    sex: "",
    dateDroppedOutDay: "",
    dateDroppedOutMonth: "",
    dateDroppedOutYear: "2025",
    categoryLevel: "Pre-primary (Excluding Reception)",
    reasonsForDroppingOut: "Other",
    specifyCauseOfDeath: "N/A",
    specialEducationNeeds: "No",
    typeOfSpecialEducationNeeds: "N/A",
    typeOfSupportReceived: "N/A"
  };

  const [formData, setFormData] = useState<Partial<ECDropout>>(defaultFormState);

  // Auto-populate based on National ID
  useEffect(() => {
    if (formData.nationalIdPassport && formData.nationalIdPassport.length > 3) {
      const foundStudent = studentsList.find(s => s.nationalIdPassport === formData.nationalIdPassport);
      if (foundStudent && foundStudent.surname !== formData.surname) {
        setFormData(prev => ({
          ...prev,
          surname: foundStudent.surname,
          studentNames: foundStudent.studentNames,
          nationality: foundStudent.nationality,
          sex: foundStudent.sex
        }));
        triggerAlert("Student details merged from registry.", "success");
      }
    }
  }, [formData.nationalIdPassport, studentsList]);

  const handleOpenAdd = () => {
    setSelectedDropout(null);
    setFormData(defaultFormState);
    setModalOpen(true);
  };

  const handleOpenEdit = (dropout: ECDropout) => {
    setSelectedDropout(dropout);
    setFormData({ ...dropout });
    setModalOpen(true);
  };

  const handleOpenDelete = (dropout: ECDropout) => {
    setSelectedDropout(dropout);
    setDeleteOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nationalIdPassport || !formData.surname || !formData.studentNames || !formData.reasonsForDroppingOut) {
      triggerAlert("Please fill in all required fields.", "error");
      return;
    }

    const dataToSave: ECDropout = {
      ...(formData as ECDropout),
      lastUpdated: new Date().toISOString()
    };

    if (dataToSave.reasonsForDroppingOut !== "Death") {
      dataToSave.specifyCauseOfDeath = "N/A";
    }
    
    if (dataToSave.specialEducationNeeds === "No") {
      dataToSave.typeOfSpecialEducationNeeds = "N/A";
      dataToSave.typeOfSupportReceived = "N/A";
    }

    if (selectedDropout) {
      updateItem(dataToSave);
      triggerAlert(`Dropout record updated.`, "success");
    } else {
      addItem({ ...dataToSave, id: `dr-${Date.now()}` });
      triggerAlert(`Dropout record added successfully.`, "success");
    }

    setModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedDropout) {
      deleteItem(selectedDropout.id);
      triggerAlert(`Dropout record deleted.`, "success");
      setDeleteOpen(false);
    }
  };

  const handleFieldChange = (field: keyof ECDropout, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNumberInput = (field: keyof ECDropout, value: string, maxLen?: number) => {
    let numVal = value.replace(/\D/g, "");
    if (maxLen && numVal.length > maxLen) {
      numVal = numVal.slice(0, maxLen);
    }
    setFormData(prev => ({ ...prev, [field]: numVal }));
  }

  const columns: ColumnConfig<ECDropout>[] = [
    { header: "#", accessorKey: "id", render: (item) => (filteredItems.findIndex(i => i.id === item.id) + 1).toString() },
    { header: "NATIONAL ID/ PASSPORT", accessorKey: "nationalIdPassport" },
    { header: "SURNAME", accessorKey: "surname" },
    { header: "STUDENT NAMES", accessorKey: "studentNames" },
    { header: "SEX", accessorKey: "sex" },
    { header: "CATEGORY/ LEVEL", accessorKey: "categoryLevel" },
    { header: "DATE DROPPED OUT", accessorKey: "dateDroppedOutYear", render: (s) => getFormattedDate(s.dateDroppedOutDay, s.dateDroppedOutMonth, s.dateDroppedOutYear) },
    { header: "REASON", accessorKey: "reasonsForDroppingOut" }
  ];

  return (
    <SectionContainer
      title="Early Childhood Dropouts Registry"
      description="Track early leavers, absences, and specialized reasons for leaving the cohort."
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
            <UserMinus className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Dropouts</span>
            <span className="text-2xl font-black text-[#002652] dark:text-slate-100">{stats.total}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#000A14] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-pink-500/10 text-pink-600 dark:text-pink-400 rounded-xl">
            <User className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">By Gender</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-100">{stats.males}M / {stats.females}F</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#000A14] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Top Category</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-100">{stats.topCategory}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#000A14] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-[#97620C]/10 text-[#97620C] rounded-xl">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">With SEN</span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{stats.withSen}</span>
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
              key: "categoryLevel",
              label: "Category/Level",
              value: activeFilters.categoryLevel as string,
              options: ["All Levels", ...CATEGORY_LEVEL_OPTIONS],
              onChange: (val) => setFilterVal("categoryLevel", val)
            },
            {
              key: "reasonsForDroppingOut",
              label: "Reason",
              value: activeFilters.reasonsForDroppingOut as string,
              options: ["All Reasons", ...REASONS_OPTIONS],
              onChange: (val) => setFilterVal("reasonsForDroppingOut", val)
            }
          ]}
          onClear={clearFilters}
        />
        <AddButton 
          onClick={handleOpenAdd} 
          label="Log Dropout" 
          className="bg-[#00A3A3] hover:bg-[#002652] text-white" 
        />
      </div>

      <DataTable
        data={filteredItems}
        columns={columns}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        emptyMessage="No dropout records found."
      />

      {/* Add/Edit Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedDropout ? "Update Dropout Record" : "Log Dropout Event"}
        onSubmit={handleSave}
        submitLabel={selectedDropout ? "Save Changes" : "Confirm Record"}
      >
        <div className="space-y-6">
          {/* Section 1: Student Information */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-[#002652] dark:text-[#00A3A3] border-b border-slate-200 dark:border-slate-800 pb-2">
              Section 1: Student Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">NATIONAL ID/ PASSPORT *</label>
                <input
                  type="text"
                  required
                  value={formData.nationalIdPassport}
                  onChange={(e) => handleFieldChange("nationalIdPassport", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">NATIONALITY</label>
                <select
                  value={formData.nationality}
                  onChange={(e) => handleFieldChange("nationality", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  {NATIONALITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">SURNAME *</label>
                <input
                  type="text"
                  required
                  value={formData.surname}
                  onChange={(e) => handleFieldChange("surname", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">STUDENT NAMES *</label>
                <input
                  type="text"
                  required
                  value={formData.studentNames}
                  onChange={(e) => handleFieldChange("studentNames", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">SEX</label>
                <select
                  value={formData.sex}
                  onChange={(e) => handleFieldChange("sex", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  <option value="">-- Select --</option>
                  {SEX_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Dropout Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-[#002652] dark:text-[#00A3A3] border-b border-slate-200 dark:border-slate-800 pb-2">
              Section 2: Dropout Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">CATEGORY/ LEVEL DROPPED OUT</label>
                <select
                  value={formData.categoryLevel}
                  onChange={(e) => handleFieldChange("categoryLevel", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  {CATEGORY_LEVEL_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">DATE DAY</label>
                <input
                  type="text"
                  placeholder="DD"
                  value={formData.dateDroppedOutDay}
                  onChange={(e) => handleNumberInput("dateDroppedOutDay", e.target.value, 2)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">DATE MONTH</label>
                <input
                  type="text"
                  placeholder="MM"
                  value={formData.dateDroppedOutMonth}
                  onChange={(e) => handleNumberInput("dateDroppedOutMonth", e.target.value, 2)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">DATE YEAR</label>
                <input
                  type="text"
                  placeholder="YYYY"
                  value={formData.dateDroppedOutYear}
                  onChange={(e) => handleNumberInput("dateDroppedOutYear", e.target.value, 4)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Reasons */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-[#002652] dark:text-[#00A3A3] border-b border-slate-200 dark:border-slate-800 pb-2">
              Section 3: Reasons
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">REASONS FOR DROPPING OUT *</label>
                <select
                  value={formData.reasonsForDroppingOut}
                  onChange={(e) => handleFieldChange("reasonsForDroppingOut", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  <option value="">-- Select --</option>
                  {REASONS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              {formData.reasonsForDroppingOut === "Death" && (
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">IF DEATH SPECIFY CAUSE</label>
                  <select
                    value={formData.specifyCauseOfDeath}
                    onChange={(e) => handleFieldChange("specifyCauseOfDeath", e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                  >
                    {CAUSE_OF_DEATH_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Special Education */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-[#002652] dark:text-[#00A3A3] border-b border-slate-200 dark:border-slate-800 pb-2">
              Section 4: Special Education
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">SPECIAL EDUCATION NEEDS</label>
                <select
                  value={formData.specialEducationNeeds}
                  onChange={(e) => handleFieldChange("specialEducationNeeds", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  <option value="">-- Select --</option>
                  {YES_NO_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

              {formData.specialEducationNeeds === "Yes" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">TYPE OF SPECIAL EDUCATION NEEDS</label>
                    <select
                      value={formData.typeOfSpecialEducationNeeds}
                      onChange={(e) => handleFieldChange("typeOfSpecialEducationNeeds", e.target.value)}
                      className="w-full text-xs p-2.5 bg-white dark:bg-[#000A14] border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                    >
                      {SEND_TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">IF SEN TYPE OF SUPPORT RECEIVED</label>
                    <select
                      value={formData.typeOfSupportReceived}
                      onChange={(e) => handleFieldChange("typeOfSupportReceived", e.target.value)}
                      className="w-full text-xs p-2.5 bg-white dark:bg-[#000A14] border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                    >
                      {SEND_SUPPORT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
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
            Are you sure you want to delete the dropouts record for <strong>{selectedDropout?.studentNames} {selectedDropout?.surname}</strong>? 
            This action cannot be undone.
          </p>
        </div>
      </FormModal>
    </SectionContainer>
  );
};
