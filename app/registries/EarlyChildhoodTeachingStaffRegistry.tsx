"use client";

import React, { useState, useMemo } from "react";
import { AlertCircle, UserCheck, User, Users, Briefcase, Info } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useFilters } from "@/hooks/useFilters";
import { SectionContainer } from "../shared/SectionContainer";
import { FilterBar } from "../shared/FilterBar";
import { DataTable, ColumnConfig } from "../shared/DataTable";
import { FormModal } from "../shared/FormModal";
import { AddButton } from "../shared/ActionButtons";

export interface ECTeachingStaff {
  id: string;
  nationalIdPassport: string;
  surname: string;
  firstNames: string;
  nationality: string;
  sex: string;
  
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  
  contractType: string;
  staffPosition: string;
  qualification: string;
  qualifyInSpecialEducation: string;
  dateOfFirstAppointmentDay: string;
  dateOfFirstAppointmentMonth: string;
  dateOfFirstAppointmentYear: string;
  dateJoinedSchoolDay: string;
  dateJoinedSchoolMonth: string;
  dateJoinedSchoolYear: string;
  
  onStudyLeave: string;
  ictSkills: string;
  inServiceTrainingIct: string;
  inServiceTrainingGuidance: string;
  inServiceTrainingLeadership: string;
  inServiceTrainingSubject: string;
  
  noOfLearningAreasTaught: string;
  teachingGuidanceCounselling: string;
  takingPartTimeCourse: string;
  
  teachersWithImpairments: string;
  
  normalLeave: string;
  leaveAugmentation: string;
  specialLeave: string;
  unpaidLeave: string;
  unauthorised: string;
  maternityLeave: string;
  sickLeave: string;
  attendingTraining: string;
  attendingOtherOfficialDuties: string;
  
  lastUpdated: string;
}

const SEX_OPTIONS = ["Male", "Female"];
const NATIONALITY_OPTIONS = [
  "Botswana", "Eswatini", "Lesotho", "Namibia", "South Africa", "Zambia", "Zimbabwe", "India", "United Kingdom", "United Republic of Tanzania", "United States of America", "People's Republic of China", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia (Plurinational State of)", "Bosnia and Herzegovina", "Brazil", "British Virgin Islands", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China, Hong Kong Special Administrative Region", "China, Macao Special Administrative Region", "Colombia", "Comoros", "Congo", "Cook Islands", "Costa Rica", "Côte d'Ivoire", "Croatia", "Cuba", "Curaçao", "Cyprus", "Czechia", "Democratic People's Republic of Korea", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", "Iceland", "Indonesia", "Iran (Islamic Republic of)", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Lao People's Democratic Republic", "Latin America and the Caribbean not specified", "Latvia", "Lebanon", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia (Federated States of)", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Republic of Korea", "Republic of Moldova", "Romania", "Russian Federation", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Sint Maarten (Dutch part)", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syrian Arab Republic", "Tajikistan", "Thailand", "Timor-Leste", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela (Bolivarian Republic of)", "Viet Nam", "Yemen"
];
const CONTRACT_OPTIONS = ["Permanent & Pensionable Teacher", "Contract", "Temporary - Vacant Post", "Temporary - Study Leave", "Temporary - School Expansion", "Temporary - Relief", "Internship"];
const POSITION_OPTIONS = ["School Head", "Teacher"];
const QUALIFICATION_OPTIONS = ["Certificate ECCE", "Diploma ECCE", "Degree ECCE", "Masters ECCE", "Other Certificate", "Other Diploma", "Other Degree", "Other Masters", "Unqualified"];
const ICT_SKILLS_OPTIONS = ["Basic skills", "Certificate", "None"];
const IMPAIRMENTS_OPTIONS = ["None", "Hearing", "Physical", "Speech", "Visual", "Multiple", "Other"];
const YES_NO_OPTIONS = ["Yes", "No"];
const PART_TIME_COURSE_OPTIONS = ["Yes - Education", "Yes - Other (Not Education)", "No"];

export const EarlyChildhoodTeachingStaffRegistry: React.FC = () => {
  const { items, addItem, updateItem, deleteItem } = useLocalStorage<ECTeachingStaff>(
    "edu_vision_ec_teaching_staff",
    []
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<ECTeachingStaff | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const {
    searchQuery,
    setSearchQuery,
    activeFilters,
    setFilterVal,
    clearFilters,
    filteredItems
  } = useFilters<ECTeachingStaff>(items, ["nationalIdPassport", "surname", "firstNames"]);

  if (activeFilters.sex === undefined) {
    setFilterVal("sex", "");
  }
  if (activeFilters.staffPosition === undefined) {
    setFilterVal("staffPosition", "");
  }
  if (activeFilters.contractType === undefined) {
    setFilterVal("contractType", "");
  }

  const getComputedNumber = (yearStr: string) => {
    if (!yearStr) return 0;
    const currentYear = new Date().getFullYear();
    return Math.max(0, currentYear - parseInt(yearStr));
  };

  const getFormattedDate = (d: string, m: string, y: string) => {
    if (!d || !m || !y) return "N/A";
    return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
  };

  const triggerAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const stats = useMemo(() => {
    let males = 0;
    let females = 0;
    let onStudyLeave = 0;
    const contractCounts: Record<string, number> = {};

    items.forEach(t => {
      if (t.sex === "Male") males++;
      if (t.sex === "Female") females++;
      if (t.onStudyLeave === "Yes") onStudyLeave++;
      contractCounts[t.contractType] = (contractCounts[t.contractType] || 0) + 1;
    });

    const topContractType = Object.keys(contractCounts).length > 0 
      ? Object.keys(contractCounts).reduce((a, b) => contractCounts[a] > contractCounts[b] ? a : b)
      : "None";

    return {
      total: items.length,
      males,
      females,
      topContractType,
      onStudyLeave
    };
  }, [items]);

  const defaultFormState: Partial<ECTeachingStaff> = {
    nationalIdPassport: "",
    surname: "",
    firstNames: "",
    nationality: "Botswana",
    sex: "",
    dobDay: "",
    dobMonth: "",
    dobYear: "",
    contractType: "Permanent & Pensionable Teacher",
    staffPosition: "Teacher",
    qualification: "Degree ECCE",
    qualifyInSpecialEducation: "No",
    dateOfFirstAppointmentDay: "",
    dateOfFirstAppointmentMonth: "",
    dateOfFirstAppointmentYear: "",
    dateJoinedSchoolDay: "",
    dateJoinedSchoolMonth: "",
    dateJoinedSchoolYear: "",
    onStudyLeave: "No",
    ictSkills: "None",
    inServiceTrainingIct: "No",
    inServiceTrainingGuidance: "No",
    inServiceTrainingLeadership: "No",
    inServiceTrainingSubject: "No",
    noOfLearningAreasTaught: "0",
    teachingGuidanceCounselling: "No",
    takingPartTimeCourse: "No",
    teachersWithImpairments: "None",
    normalLeave: "0",
    leaveAugmentation: "0",
    specialLeave: "0",
    unpaidLeave: "0",
    unauthorised: "0",
    maternityLeave: "0",
    sickLeave: "0",
    attendingTraining: "0",
    attendingOtherOfficialDuties: "0"
  };

  const [formData, setFormData] = useState<Partial<ECTeachingStaff>>(defaultFormState);

  const handleOpenAdd = () => {
    setSelectedStaff(null);
    setFormData(defaultFormState);
    setModalOpen(true);
  };

  const handleOpenEdit = (staff: ECTeachingStaff) => {
    setSelectedStaff(staff);
    setFormData({ ...staff });
    setModalOpen(true);
  };

  const handleOpenDelete = (staff: ECTeachingStaff) => {
    setSelectedStaff(staff);
    setDeleteOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nationalIdPassport || !formData.surname || !formData.firstNames || !formData.staffPosition) {
      triggerAlert("Please fill in all required fields.", "error");
      return;
    }

    const dataToSave: ECTeachingStaff = {
      ...(formData as ECTeachingStaff),
      lastUpdated: new Date().toISOString()
    };

    if (selectedStaff) {
      updateItem(dataToSave);
      triggerAlert(`Staff record updated.`, "success");
    } else {
      addItem({ ...dataToSave, id: `staff-${Date.now()}` });
      triggerAlert(`Staff record added successfully.`, "success");
    }

    setModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedStaff) {
      deleteItem(selectedStaff.id);
      triggerAlert(`Staff record deleted.`, "success");
      setDeleteOpen(false);
    }
  };

  const handleFieldChange = (field: keyof ECTeachingStaff, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNumberInput = (field: keyof ECTeachingStaff, value: string, maxLen?: number) => {
    let numVal = value.replace(/\D/g, "");
    if (maxLen && numVal.length > maxLen) {
      numVal = numVal.slice(0, maxLen);
    }
    setFormData(prev => ({ ...prev, [field]: numVal }));
  }

  const columns: ColumnConfig<ECTeachingStaff>[] = [
    { header: "#", accessorKey: "id", render: (item) => (filteredItems.findIndex(i => i.id === item.id) + 1).toString() },
    { header: "NATIONAL ID/ PASSPORT", accessorKey: "nationalIdPassport" },
    { header: "SURNAME", accessorKey: "surname" },
    { header: "FIRST NAMES", accessorKey: "firstNames" },
    { header: "SEX", accessorKey: "sex" },
    { header: "STAFF POSITION", accessorKey: "staffPosition" },
    { header: "CONTRACT TYPE", accessorKey: "contractType" },
    { header: "QUALIFICATION", accessorKey: "qualification" }
  ];

  return (
    <SectionContainer
      title="Early Childhood Teaching Staff Registry"
      description="Manage records of pre-primary educators, roles, qualifications, and absences."
      action={
        <AddButton 
          onClick={handleOpenAdd} 
          label="Add Teacher" 
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
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Teachers</span>
            <span className="text-2xl font-black text-[#002652] dark:text-slate-100">{stats.total}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#000A14] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-pink-500/10 text-pink-600 dark:text-pink-400 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">By Gender</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-100">{stats.males}M / {stats.females}F</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#000A14] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Top Contract</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-100">{stats.topContractType}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#000A14] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-[#97620C]/10 text-[#97620C] rounded-xl">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">On Study Leave</span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{stats.onStudyLeave}</span>
          </div>
        </div>
      </div>

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by ID or Name..."
        filters={[
          {
            key: "sex",
            label: "Sex",
            value: activeFilters.sex as string,
            options: SEX_OPTIONS,
            allLabel: "All Genders",
            onChange: (val) => setFilterVal("sex", val)
          },
          {
            key: "contractType",
            label: "Contract Type",
            value: activeFilters.contractType as string,
            options: CONTRACT_OPTIONS,
            allLabel: "All Contract Types",
            onChange: (val) => setFilterVal("contractType", val)
          },
          {
            key: "staffPosition",
            label: "Position",
            value: activeFilters.staffPosition as string,
            options: POSITION_OPTIONS,
            allLabel: "All Positions",
            onChange: (val) => setFilterVal("staffPosition", val)
          }
        ]}
        onClear={clearFilters}
      />

      <DataTable
        data={filteredItems}
        columns={columns}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        emptyMessage="No teaching staff records found."
      />

      {/* Add/Edit Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedStaff ? "Update Teacher Record" : "Log Teaching Staff"}
        onSubmit={handleSave}
        submitLabel={selectedStaff ? "Save Changes" : "Confirm Staff"}
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
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">FIRST NAMES *</label>
                <input
                  type="text"
                  required
                  value={formData.firstNames}
                  onChange={(e) => handleFieldChange("firstNames", e.target.value)}
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
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">DOB DAY</label>
                <input
                  type="text"
                  placeholder="DD"
                  value={formData.dobDay}
                  onChange={(e) => handleNumberInput("dobDay", e.target.value, 2)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">DOB MONTH</label>
                <input
                  type="text"
                  placeholder="MM"
                  value={formData.dobMonth}
                  onChange={(e) => handleNumberInput("dobMonth", e.target.value, 2)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">DOB YEAR</label>
                <input
                  type="text"
                  placeholder="YYYY"
                  value={formData.dobYear}
                  onChange={(e) => handleNumberInput("dobYear", e.target.value, 4)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Employment Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-[#002652] dark:text-[#00A3A3] border-b border-slate-200 dark:border-slate-800 pb-2">
              Section 2: Employment Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">CONTRACT TYPE</label>
                <select
                  value={formData.contractType}
                  onChange={(e) => handleFieldChange("contractType", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  {CONTRACT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">STAFF POSITION</label>
                <select
                  value={formData.staffPosition}
                  onChange={(e) => handleFieldChange("staffPosition", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  {POSITION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">QUALIFICATION</label>
                <select
                  value={formData.qualification}
                  onChange={(e) => handleFieldChange("qualification", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  {QUALIFICATION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">QUALIFY IN SPECIAL EDUCATION</label>
                <select
                  value={formData.qualifyInSpecialEducation}
                  onChange={(e) => handleFieldChange("qualifyInSpecialEducation", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  {YES_NO_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-[#000A14] p-4 rounded-lg border border-slate-200 dark:border-slate-800">
               <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">1st APPT DAY</label>
                    <input
                      type="text"
                      placeholder="DD"
                      value={formData.dateOfFirstAppointmentDay}
                      onChange={(e) => handleNumberInput("dateOfFirstAppointmentDay", e.target.value, 2)}
                      className="w-full text-xs p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                    />
                </div>
                <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">1st APPT MONTH</label>
                    <input
                      type="text"
                      placeholder="MM"
                      value={formData.dateOfFirstAppointmentMonth}
                      onChange={(e) => handleNumberInput("dateOfFirstAppointmentMonth", e.target.value, 2)}
                      className="w-full text-xs p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                    />
                </div>
                <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">1st APPT YEAR</label>
                    <input
                      type="text"
                      placeholder="YYYY"
                      value={formData.dateOfFirstAppointmentYear}
                      onChange={(e) => handleNumberInput("dateOfFirstAppointmentYear", e.target.value, 4)}
                      className="w-full text-xs p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                    />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">JOINED DAY</label>
                    <input
                      type="text"
                      placeholder="DD"
                      value={formData.dateJoinedSchoolDay}
                      onChange={(e) => handleNumberInput("dateJoinedSchoolDay", e.target.value, 2)}
                      className="w-full text-xs p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                    />
                </div>
                <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">JOINED MONTH</label>
                    <input
                      type="text"
                      placeholder="MM"
                      value={formData.dateJoinedSchoolMonth}
                      onChange={(e) => handleNumberInput("dateJoinedSchoolMonth", e.target.value, 2)}
                      className="w-full text-xs p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                    />
                </div>
                <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">JOINED YEAR</label>
                    <input
                      type="text"
                      placeholder="YYYY"
                      value={formData.dateJoinedSchoolYear}
                      onChange={(e) => handleNumberInput("dateJoinedSchoolYear", e.target.value, 4)}
                      className="w-full text-xs p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                    />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Professional Development */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-[#002652] dark:text-[#00A3A3] border-b border-slate-200 dark:border-slate-800 pb-2">
              Section 3: Professional Development
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">ON STUDY LEAVE</label>
                <select
                  value={formData.onStudyLeave}
                  onChange={(e) => handleFieldChange("onStudyLeave", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  {YES_NO_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">ICT SKILLS</label>
                <select
                  value={formData.ictSkills}
                  onChange={(e) => handleFieldChange("ictSkills", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  {ICT_SKILLS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">IN-SERVICE TRAINING - ICT</label>
                <select
                  value={formData.inServiceTrainingIct}
                  onChange={(e) => handleFieldChange("inServiceTrainingIct", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  {YES_NO_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">IN-SERVICE TRAINING - GUIDANCE</label>
                <input
                  type="text"
                  value={formData.inServiceTrainingGuidance}
                  onChange={(e) => handleFieldChange("inServiceTrainingGuidance", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">IN-SERVICE TRAINING - LEADERSHIP</label>
                <input
                  type="text"
                  value={formData.inServiceTrainingLeadership}
                  onChange={(e) => handleFieldChange("inServiceTrainingLeadership", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">IN-SERVICE TRAINING - SUBJECT</label>
                <input
                  type="text"
                  value={formData.inServiceTrainingSubject}
                  onChange={(e) => handleFieldChange("inServiceTrainingSubject", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">TEACHING GUIDANCE & COUNSELLING</label>
                <select
                  value={formData.teachingGuidanceCounselling}
                  onChange={(e) => handleFieldChange("teachingGuidanceCounselling", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  {YES_NO_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">TAKING PART-TIME COURSE</label>
                <select
                  value={formData.takingPartTimeCourse}
                  onChange={(e) => handleFieldChange("takingPartTimeCourse", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  {PART_TIME_COURSE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">TEACHERS WITH IMPAIRMENTS</label>
                <select
                  value={formData.teachersWithImpairments}
                  onChange={(e) => handleFieldChange("teachersWithImpairments", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  {IMPAIRMENTS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">NO. OF LEARNING AREAS TAUGHT</label>
                <input
                  type="text"
                  value={formData.noOfLearningAreasTaught}
                  onChange={(e) => handleNumberInput("noOfLearningAreasTaught", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Staff Absence */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-[#002652] dark:text-[#00A3A3] border-b border-slate-200 dark:border-slate-800 pb-2">
              Section 4: Staff Absence (Days)
            </h4>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { key: "normalLeave", label: "NORMAL LEAVE" },
                  { key: "leaveAugmentation", label: "LEAVE AUGMENTATION" },
                  { key: "specialLeave", label: "SPECIAL LEAVE" },
                  { key: "unpaidLeave", label: "UNPAID LEAVE" },
                  { key: "unauthorised", label: "UNAUTHORISED" },
                  { key: "maternityLeave", label: "MATERNITY LEAVE" },
                  { key: "sickLeave", label: "SICK LEAVE" },
                  { key: "attendingTraining", label: "ATTENDING TRAINING" },
                  { key: "attendingOtherOfficialDuties", label: "OTHER DUTIES" }
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">{field.label}</label>
                    <input
                      type="text"
                      value={(formData as any)[field.key]}
                      onChange={(e) => handleNumberInput(field.key as keyof ECTeachingStaff, e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200 text-center font-bold"
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* Section 5: Computed Fields */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-[#002652] dark:text-[#00A3A3] border-b border-slate-200 dark:border-slate-800 pb-2">
              Section 5: Computed Fields
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               <div className="bg-slate-50 dark:bg-[#000A14] p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col justify-center items-center">
                  <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">AGE</span>
                  <span className="text-sm font-black text-[#002652] dark:text-slate-200">{getComputedNumber(formData.dobYear || "")} yrs</span>
                  <div className="text-[10px] text-slate-400 mt-1">From DOB: {getFormattedDate(formData.dobDay || "", formData.dobMonth || "", formData.dobYear || "")}</div>
               </div>
               <div className="bg-slate-50 dark:bg-[#000A14] p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col justify-center items-center">
                  <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">EXPERIENCE</span>
                  <span className="text-sm font-black text-[#00A3A3]">{getComputedNumber(formData.dateOfFirstAppointmentYear || "")} yrs</span>
                  <div className="text-[10px] text-slate-400 mt-1">From: {getFormattedDate(formData.dateOfFirstAppointmentDay||"", formData.dateOfFirstAppointmentMonth||"", formData.dateOfFirstAppointmentYear||"")}</div>
               </div>
               <div className="bg-slate-50 dark:bg-[#000A14] p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col justify-center items-center">
                  <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">LENGTH OF STAY</span>
                  <span className="text-sm font-black text-amber-500 dark:text-amber-400">{getComputedNumber(formData.dateJoinedSchoolYear || "")} yrs</span>
                  <div className="text-[10px] text-slate-400 mt-1">Since joined: {getFormattedDate(formData.dateJoinedSchoolDay||"", formData.dateJoinedSchoolMonth||"", formData.dateJoinedSchoolYear||"")}</div>
               </div>
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
            Are you sure you want to delete the teaching staff record for <strong>{selectedStaff?.firstNames} {selectedStaff?.surname}</strong>? 
            This action cannot be undone.
          </p>
        </div>
      </FormModal>
    </SectionContainer>
  );
};
