"use client";

import React, { useState, useMemo } from "react";
import { AlertCircle, User, Users } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useFilters } from "@/hooks/useFilters";
import { SectionContainer } from "../shared/SectionContainer";
import { FilterBar } from "../shared/FilterBar";
import { DataTable, ColumnConfig } from "../shared/DataTable";
import { FormModal } from "../shared/FormModal";
import { AddButton } from "../shared/ActionButtons";

export interface ECStudent {
  id: string;
  nationalIdPassport: string;
  surname: string;
  studentNames: string;
  nationality: string;
  sex: "Male" | "Female";
  
  // Date of Birth
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  
  // Academic Information
  categoryLevel: string;
  attending: string;
  
  // Social Welfare
  studentSocialStatus: string;
  supportForOvc: string;
  
  // Special Education
  specialEducationNeedAndDisability: "Yes" | "No";
  typeOfSpecialEducationNeedsAndDisability: string;
  supportServiceToSend: string;
  
  lastUpdated: string;
}

const CATEGORY_LEVEL_OPTIONS = [
  "Baby Care",
  "Day Care/Nursery",
  "Pre-primary (Excluding Reception)",
  "Reception"
];
const ATTENDING_OPTIONS = ["Half day", "Full day", "Both"];
const SEX_OPTIONS = ["Male", "Female"];
const NATIONALITY_OPTIONS = [
  "Botswana", "Eswatini", "Lesotho", "Namibia", "South Africa", "Zambia", "Zimbabwe", "India", "United Kingdom", "United Republic of Tanzania", "United States of America", "People's Republic of China", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia (Plurinational State of)", "Bosnia and Herzegovina", "Brazil", "British Virgin Islands", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China, Hong Kong Special Administrative Region", "China, Macao Special Administrative Region", "Colombia", "Comoros", "Congo", "Cook Islands", "Costa Rica", "Côte d'Ivoire", "Croatia", "Cuba", "Curaçao", "Cyprus", "Czechia", "Democratic People's Republic of Korea", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", "Iceland", "Indonesia", "Iran (Islamic Republic of)", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Lao People's Democratic Republic", "Latin America and the Caribbean not specified", "Latvia", "Lebanon", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia (Federated States of)", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Republic of Korea", "Republic of Moldova", "Romania", "Russian Federation", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Sint Maarten (Dutch part)", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syrian Arab Republic", "Tajikistan", "Thailand", "Timor-Leste", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela (Bolivarian Republic of)", "Viet Nam", "Yemen"
];
const SOCIAL_OPTIONS = ["Ordinary", "Orphan", "Needy", "Orphan & Needy", "Vulnerable"];
const OVC_SUPPORT_OPTIONS = [
  "N/A",
  "Bursary",
  "Social",
  "Emotional/ Psychological",
  "Bursary + Social",
  "Bursary + Emotional/ Psychological",
  "Social + Emotional/ Psychological",
  "None"
];
const YES_NO_OPTIONS = ["Yes", "No"];
const SEND_TYPE_OPTIONS = [
  "N/A",
  "Attention deficit disorder",
  "Autism",
  "Behaviour disorder",
  "Blind",
  "Cerebral Palsy",
  "Deaf",
  "Epilepsy",
  "Hearing",
  "Intellectual Disability",
  "Physical (hunchback)",
  "Reading, writing, spelling disorder",
  "Speech or communication",
  "Visual",
  "Others"
];
const SEND_SERVICE_OPTIONS = [
  "N/A",
  "Braille instruction",
  "Canes, Walkers",
  "Counseling",
  "Glasses/lenses",
  "Hearing Aids",
  "Occupational therapy",
  "Physical therapy",
  "Prosthetics/Artificial Limbs",
  "Sign language instruction",
  "Speech therapy",
  "Wheel Chair",
  "None"
];

// Initial mock data
const INITIAL_EC_STUDENTS: ECStudent[] = [
  {
    id: "ec-1",
    nationalIdPassport: "EC-2024-001",
    surname: "Mokgosi",
    studentNames: "Lerato",
    nationality: "Botswana",
    sex: "Female",
    dobDay: "12",
    dobMonth: "05",
    dobYear: "2020",
    categoryLevel: "Pre-primary (Excluding Reception)",
    attending: "Full day",
    studentSocialStatus: "Ordinary",
    supportForOvc: "N/A",
    specialEducationNeedAndDisability: "No",
    typeOfSpecialEducationNeedsAndDisability: "N/A",
    supportServiceToSend: "N/A",
    lastUpdated: new Date().toISOString()
  },
  {
    id: "ec-2",
    nationalIdPassport: "EC-2024-002",
    surname: "Tau",
    studentNames: "Tshepo",
    nationality: "Botswana",
    sex: "Male",
    dobDay: "24",
    dobMonth: "11",
    dobYear: "2021",
    categoryLevel: "Day Care/Nursery",
    attending: "Full day",
    studentSocialStatus: "Needy",
    supportForOvc: "Social",
    specialEducationNeedAndDisability: "Yes",
    typeOfSpecialEducationNeedsAndDisability: "Speech or communication",
    supportServiceToSend: "Speech therapy",
    lastUpdated: new Date().toISOString()
  }
];

export const EarlyChildhoodStudentsRegistry: React.FC = () => {
  const { items, addItem, updateItem, deleteItem } = useLocalStorage<ECStudent>(
    "edu_vision_ec_students",
    INITIAL_EC_STUDENTS
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<ECStudent | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const {
    searchQuery,
    setSearchQuery,
    activeFilters,
    setFilterVal,
    clearFilters,
    filteredItems
  } = useFilters<ECStudent>(items, ["nationalIdPassport", "surname", "studentNames"]);

  // Set default filters
  if (activeFilters.categoryLevel === undefined) {
    setFilterVal("categoryLevel", "");
  }

  // Auto-calculate properties
  const getComputedAge = (dobYear: string) => {
    if (!dobYear) return 0;
    const currentYear = new Date().getFullYear();
    return Math.max(0, currentYear - parseInt(dobYear));
  };
  
  const getFormattedDOB = (d: string, m: string, y: string) => {
    if (!d || !m || !y) return "N/A";
    return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
  };

  const triggerAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  // Stats for cards
  const stats = useMemo(() => {
    const total = items.length;
    let boys = 0;
    let girls = 0;
    let totalAge = 0;
    let validAges = 0;

    items.forEach(student => {
      if (student.sex === "Male") boys++;
      if (student.sex === "Female") girls++;
      
      const age = getComputedAge(student.dobYear);
      if (age > 0) {
        totalAge += age;
        validAges++;
      }
    });

    return {
      total,
      boys,
      girls,
      avgAge: validAges > 0 ? (totalAge / validAges).toFixed(1) : "0"
    };
  }, [items]);

  // Form State
  const defaultFormState: Partial<ECStudent> = {
    nationalIdPassport: "",
    surname: "",
    studentNames: "",
    nationality: "Botswana",
    sex: "Female",
    dobDay: "",
    dobMonth: "",
    dobYear: "",
    categoryLevel: "Pre-primary (Excluding Reception)",
    attending: "Half day",
    studentSocialStatus: "Ordinary",
    supportForOvc: "N/A",
    specialEducationNeedAndDisability: "No",
    typeOfSpecialEducationNeedsAndDisability: "N/A",
    supportServiceToSend: "N/A"
  };

  const [formData, setFormData] = useState<Partial<ECStudent>>(defaultFormState);

  const handleOpenAdd = () => {
    setSelectedStudent(null);
    setFormData(defaultFormState);
    setModalOpen(true);
  };

  const handleOpenEdit = (student: ECStudent) => {
    setSelectedStudent(student);
    setFormData({ ...student });
    setModalOpen(true);
  };

  const handleOpenDelete = (student: ECStudent) => {
    setSelectedStudent(student);
    setDeleteOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!formData.nationalIdPassport || !formData.surname || !formData.studentNames || !formData.dobYear || !formData.dobMonth || !formData.dobDay) {
      triggerAlert("Please fill in all required fields.", "error");
      return;
    }

    // Prepare data
    const dataToSave: ECStudent = {
      ...(formData as ECStudent),
      lastUpdated: new Date().toISOString()
    };

    if (dataToSave.specialEducationNeedAndDisability === "No") {
      dataToSave.typeOfSpecialEducationNeedsAndDisability = "N/A";
      dataToSave.supportServiceToSend = "N/A";
    }

    if (selectedStudent) {
      updateItem(dataToSave);
      triggerAlert(`Record for ${dataToSave.studentNames} updated successfully.`, "success");
    } else {
      addItem({ ...dataToSave, id: `ec-${Date.now()}` });
      triggerAlert(`Record for ${dataToSave.studentNames} added successfully.`, "success");
    }

    setModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedStudent) {
      deleteItem(selectedStudent.id);
      triggerAlert(`Record for ${selectedStudent.studentNames} deleted.`, "success");
      setDeleteOpen(false);
    }
  };

  const handleFieldChange = (field: keyof ECStudent, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNumberInput = (field: keyof ECStudent, value: string, maxLen?: number) => {
      // Only keep digits
      let numVal = value.replace(/\D/g, "");
      if (maxLen && numVal.length > maxLen) {
          numVal = numVal.slice(0, maxLen);
      }
      setFormData(prev => ({ ...prev, [field]: numVal }));
  }

  const columns: ColumnConfig<ECStudent>[] = [
    { header: "#", accessorKey: "id", render: (item) => (filteredItems.findIndex(i => i.id === item.id) + 1).toString() },
    { header: "NATIONAL ID/ PASSPORT", accessorKey: "nationalIdPassport" },
    { header: "SURNAME", accessorKey: "surname" },
    { header: "STUDENT NAMES", accessorKey: "studentNames" },
    { header: "SEX", accessorKey: "sex" },
    { header: "CATEGORY/ LEVEL", accessorKey: "categoryLevel" },
    { 
      header: "ATTENDING", 
      accessorKey: "attending",
      render: (s) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${s.attending === "Yes" ? "bg-[#00A3A3]/20 text-[#00A3A3]" : "bg-rose-500/10 text-rose-500"}`}>
          {s.attending}
        </span>
      )
    }
  ];

  return (
    <SectionContainer
      title="Early Childhood Students Registry"
      description="Manage toddler census, category levels, ages, and demographic profiles."
      action={
        <AddButton 
          onClick={handleOpenAdd} 
          label="Enroll Toddler" 
        />
      }
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
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Students</span>
            <span className="text-2xl font-black text-[#002652] dark:text-slate-100">{stats.total}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#000A14] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-xl">
            <User className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Boys</span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{stats.boys}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#000A14] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-pink-500/10 text-pink-600 dark:text-pink-400 rounded-xl">
            <User className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Girls</span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{stats.girls}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#000A14] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-[#97620C]/10 text-[#97620C] rounded-xl">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Avg Age</span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{stats.avgAge}</span>
          </div>
        </div>
      </div>

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by ID, Surname or Names..."
        filters={[
          {
            key: "categoryLevel",
            label: "Category/Level",
            value: activeFilters.categoryLevel as string,
            options: CATEGORY_LEVEL_OPTIONS,
            allLabel: "All Categories/Levels",
            onChange: (val) => setFilterVal("categoryLevel", val)
          }
        ]}
        onClear={clearFilters}
      />

      {/* Data Table */}
      <DataTable
        data={filteredItems}
        columns={columns}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        emptyMessage="No students found matching your criteria."
      />

      {/* Add/Edit Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedStudent ? "Update Toddler Record" : "Enroll New Toddler"}
        onSubmit={handleSave}
        submitLabel={selectedStudent ? "Save Changes" : "Confirm Enrollment"}
      >
        <div className="space-y-6">
          
          {/* Section 1: Personal Information */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-[#002652] dark:text-[#00A3A3] border-b border-slate-200 dark:border-slate-800 pb-2">
              Section 1: Personal Information
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
                  onChange={(e) => handleFieldChange("sex", e.target.value as any)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  {SEX_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Date of Birth */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
                <h4 className="text-xs font-black uppercase text-[#002652] dark:text-[#00A3A3]">
                Section 2: Date of Birth
                </h4>
                <div className="bg-[#002652]/10 text-[#002652] dark:bg-[#00A3A3]/20 dark:text-[#00A3A3] px-3 py-1 rounded-full text-[10px] font-bold">
                    Computed Age: {getComputedAge(formData.dobYear || "")} yrs | DOB: {getFormattedDOB(formData.dobDay || "", formData.dobMonth || "", formData.dobYear || "")}
                </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">DAY *</label>
                <input
                  type="text"
                  required
                  placeholder="DD"
                  value={formData.dobDay}
                  onChange={(e) => handleNumberInput("dobDay", e.target.value, 2)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">MONTH *</label>
                <input
                  type="text"
                  required
                  placeholder="MM"
                  value={formData.dobMonth}
                  onChange={(e) => handleNumberInput("dobMonth", e.target.value, 2)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">YEAR *</label>
                <input
                  type="text"
                  required
                  placeholder="YYYY"
                  value={formData.dobYear}
                  onChange={(e) => handleNumberInput("dobYear", e.target.value, 4)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Academic Information */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-[#002652] dark:text-[#00A3A3] border-b border-slate-200 dark:border-slate-800 pb-2">
              Section 3: Academic Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">CATEGORY/ LEVEL</label>
                <select
                  value={formData.categoryLevel}
                  onChange={(e) => handleFieldChange("categoryLevel", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  {CATEGORY_LEVEL_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">ATTENDING</label>
                <select
                  value={formData.attending}
                  onChange={(e) => handleFieldChange("attending", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  {ATTENDING_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Social Welfare */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-[#002652] dark:text-[#00A3A3] border-b border-slate-200 dark:border-slate-800 pb-2">
              Section 4: Social Welfare
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">STUDENT SOCIAL STATUS</label>
                <select
                  value={formData.studentSocialStatus}
                  onChange={(e) => handleFieldChange("studentSocialStatus", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  {SOCIAL_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">SUPPORT FOR OVC</label>
                <select
                  value={formData.supportForOvc}
                  onChange={(e) => handleFieldChange("supportForOvc", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  {OVC_SUPPORT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Section 5: Special Education */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-[#002652] dark:text-[#00A3A3] border-b border-slate-200 dark:border-slate-800 pb-2">
              Section 5: Special Education
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                  SPECIAL EDUCATION NEED & DISABILITY
                </label>
                <select
                  value={formData.specialEducationNeedAndDisability}
                  onChange={(e) => handleFieldChange("specialEducationNeedAndDisability", e.target.value as any)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  {YES_NO_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              
              {formData.specialEducationNeedAndDisability === "Yes" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                      TYPE OF SPECIAL EDUCATION NEEDS & DISABILITY
                    </label>
                    <select
                      value={formData.typeOfSpecialEducationNeedsAndDisability}
                      onChange={(e) => handleFieldChange("typeOfSpecialEducationNeedsAndDisability", e.target.value)}
                      className="w-full text-xs p-2.5 bg-white dark:bg-[#000A14] border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                    >
                      {SEND_TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                      SUPPORT SERVICE TO SEND
                    </label>
                    <select
                      value={formData.supportServiceToSend}
                      onChange={(e) => handleFieldChange("supportServiceToSend", e.target.value)}
                      className="w-full text-xs p-2.5 bg-white dark:bg-[#000A14] border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                    >
                      {SEND_SERVICE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
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
            Are you sure you want to delete the record for <strong>{selectedStudent?.studentNames} {selectedStudent?.surname}</strong>? 
            This action cannot be undone.
          </p>
        </div>
      </FormModal>
    </SectionContainer>
  );
};
