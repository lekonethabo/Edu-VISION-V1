"use client";

import React, { useState, useMemo, useEffect } from "react";
import { AlertCircle, Users, ShieldAlert, User, Activity } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useFilters } from "@/hooks/useFilters";
import { SectionContainer } from "../shared/SectionContainer";
import { FilterBar } from "../shared/FilterBar";
import { DataTable, ColumnConfig } from "../shared/DataTable";
import { FormModal } from "../shared/FormModal";
import { AddButton } from "../shared/ActionButtons";

interface ECStudent {
  id: string;
  nationalIdPassport: string;
  surname?: string;
  firstNames?: string;
  nationality: string;
  sex: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
}

export interface ECAbusedStudent {
  id: string;
  nationalIdPassport: string;
  nationality: string;
  sex: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  
  categoryLevel: string;
  studentSocialStatus: string;
  
  bullying: string;
  corporalPunishment: string;
  sexualHarassment: string;
  sexualAbuse: string;
  violence: string;
  
  lastUpdated: string;
}

const SEX_OPTIONS = ["Male", "Female"];
const CATEGORY_OPTIONS = ["Baby/ Infant", "Pre-Nursery", "Nursery", "Pre-Primary", "Special Education", "Other"];
const SOCIAL_STATUS_OPTIONS = ["Orphans", "Vulnerable Children", "Destitute", "Remote Area Dwellers", "Children With Disability", "None"];
const YES_NO_OPTIONS = ["Yes", "No"];
const ABUSE_TYPES = ["Bullying", "Corporal Punishment", "Sexual Harassment", "Sexual Abuse", "Violence"];

const NATIONALITY_OPTIONS = [
  "Botswana", "Eswatini", "Lesotho", "Namibia", "South Africa", "Zambia", "Zimbabwe", "India", "United Kingdom", "United Republic of Tanzania", "United States of America", "People's Republic of China", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia (Plurinational State of)", "Bosnia and Herzegovina", "Brazil", "British Virgin Islands", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China, Hong Kong Special Administrative Region", "China, Macao Special Administrative Region", "Colombia", "Comoros", "Congo", "Cook Islands", "Costa Rica", "Côte d'Ivoire", "Croatia", "Cuba", "Curaçao", "Cyprus", "Czechia", "Democratic People's Republic of Korea", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", "Iceland", "Indonesia", "Iran (Islamic Republic of)", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Lao People's Democratic Republic", "Latin America and the Caribbean not specified", "Latvia", "Lebanon", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia (Federated States of)", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Republic of Korea", "Republic of Moldova", "Romania", "Russian Federation", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Sint Maarten (Dutch part)", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syrian Arab Republic", "Tajikistan", "Thailand", "Timor-Leste", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela (Bolivarian Republic of)", "Viet Nam", "Yemen"
];

export const EarlyChildhoodAbusedStudentsRegistry: React.FC = () => {
  const { items, addItem, updateItem, deleteItem } = useLocalStorage<ECAbusedStudent>(
    "edu_vision_ec_abused_students",
    []
  );

  const { items: students } = useLocalStorage<ECStudent>("edu_vision_ec_students", []);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<ECAbusedStudent | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const {
    searchQuery,
    setSearchQuery,
    activeFilters,
    setFilterVal,
    clearFilters,
    filteredItems
  } = useFilters<ECAbusedStudent>(items, ["nationalIdPassport"]);

  if (activeFilters.categoryLevel === undefined) {
    setFilterVal("categoryLevel", "");
  }
  
  // Custom filter handling for Abuse Types which are booleans/strings
  const [abuseFilter, setAbuseFilter] = useState("");

  const triggerAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const getAge = (year: string) => {
    if (!year) return "N/A";
    return (new Date().getFullYear() - parseInt(year)).toString();
  };

  const getAbuseTypesList = (item: ECAbusedStudent) => {
    const list = [];
    if (item.bullying === "Yes") list.push("Bullying");
    if (item.corporalPunishment === "Yes") list.push("Corporal Punishment");
    if (item.sexualHarassment === "Yes") list.push("Sexual Harassment");
    if (item.sexualAbuse === "Yes") list.push("Sexual Abuse");
    if (item.violence === "Yes") list.push("Violence");
    return list;
  };

  const displayFilteredItems = useMemo(() => {
    if (!abuseFilter) return filteredItems;
    return filteredItems.filter(item => {
      if (abuseFilter === "Bullying") return item.bullying === "Yes";
      if (abuseFilter === "Corporal Punishment") return item.corporalPunishment === "Yes";
      if (abuseFilter === "Sexual Harassment") return item.sexualHarassment === "Yes";
      if (abuseFilter === "Sexual Abuse") return item.sexualAbuse === "Yes";
      if (abuseFilter === "Violence") return item.violence === "Yes";
      return true;
    });
  }, [filteredItems, abuseFilter]);

  const stats = useMemo(() => {
    let males = 0;
    let females = 0;
    const categories: Record<string, number> = {};
    const abuseCounts: Record<string, number> = {
      "Bullying": 0,
      "Corporal Punishment": 0,
      "Sexual Harassment": 0,
      "Sexual Abuse": 0,
      "Violence": 0
    };

    items.forEach(s => {
      if (s.sex === "Male") males++;
      if (s.sex === "Female") females++;

      if (s.categoryLevel) {
        categories[s.categoryLevel] = (categories[s.categoryLevel] || 0) + 1;
      }

      const types = getAbuseTypesList(s);
      types.forEach(t => abuseCounts[t]++);
    });

    const topCategory = Object.keys(categories).length > 0
      ? Object.keys(categories).reduce((a, b) => categories[a] > categories[b] ? a : b)
      : "None";

    const topAbuse = Object.keys(abuseCounts).reduce((a, b) => abuseCounts[a] > abuseCounts[b] ? a : b);

    return {
      total: items.length,
      males,
      females,
      topCategory,
      topAbuse: abuseCounts[topAbuse] > 0 ? topAbuse : "None"
    };
  }, [items]);

  const defaultFormState: Partial<ECAbusedStudent> = {
    nationalIdPassport: "",
    nationality: "Botswana",
    sex: "",
    dobDay: "",
    dobMonth: "",
    dobYear: "",
    categoryLevel: "Pre-Primary",
    studentSocialStatus: "None",
    bullying: "No",
    corporalPunishment: "No",
    sexualHarassment: "No",
    sexualAbuse: "No",
    violence: "No"
  };

  const [formData, setFormData] = useState<Partial<ECAbusedStudent>>(defaultFormState);

  // Auto-populate logic based on National ID
  useEffect(() => {
    if (formData.nationalIdPassport && formData.nationalIdPassport.length > 4) {
      const existingStudent = students.find(s => s.nationalIdPassport === formData.nationalIdPassport);
      if (existingStudent && !selectedCase) {
        setFormData(prev => ({
          ...prev,
          nationality: existingStudent.nationality || prev.nationality,
          sex: existingStudent.sex || prev.sex,
          dobDay: existingStudent.dobDay || prev.dobDay,
          dobMonth: existingStudent.dobMonth || prev.dobMonth,
          dobYear: existingStudent.dobYear || prev.dobYear,
        }));
      }
    }
  }, [formData.nationalIdPassport, students, selectedCase]);

  const handleOpenAdd = () => {
    setSelectedCase(null);
    setFormData(defaultFormState);
    setModalOpen(true);
  };

  const handleOpenEdit = (studentCase: ECAbusedStudent) => {
    setSelectedCase(studentCase);
    setFormData({ ...studentCase });
    setModalOpen(true);
  };

  const handleOpenDelete = (studentCase: ECAbusedStudent) => {
    setSelectedCase(studentCase);
    setDeleteOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nationalIdPassport) {
      triggerAlert("Please fill in Student ID/Passport.", "error");
      return;
    }

    const hasAbuse = [
      formData.bullying, 
      formData.corporalPunishment, 
      formData.sexualHarassment, 
      formData.sexualAbuse, 
      formData.violence
    ].some(v => v === "Yes");

    if (!hasAbuse) {
      triggerAlert("Please select at least one type of abuse.", "error");
      return;
    }

    const dataToSave: ECAbusedStudent = {
      ...(formData as ECAbusedStudent),
      lastUpdated: new Date().toISOString()
    };

    if (selectedCase) {
      updateItem(dataToSave);
      triggerAlert("Case record updated.", "success");
    } else {
      addItem({ ...dataToSave, id: `abuse-${Date.now()}` });
      triggerAlert("Case record logged successfully.", "success");
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedCase) {
      deleteItem(selectedCase.id);
      triggerAlert("Case record deleted.", "success");
      setDeleteOpen(false);
    }
  };

  const handleFieldChange = (field: keyof ECAbusedStudent, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const columns: ColumnConfig<ECAbusedStudent>[] = [
    { header: "#", accessorKey: "id", render: (item) => (displayFilteredItems.findIndex(i => i.id === item.id) + 1).toString() },
    { header: "NATIONAL ID/ PASSPORT", accessorKey: "nationalIdPassport" },
    { header: "SEX", accessorKey: "sex" },
    { header: "AGE", accessorKey: "id", render: (item) => getAge(item.dobYear) },
    { header: "CATEGORY/ LEVEL", accessorKey: "categoryLevel" },
    { header: "TYPES OF ABUSE", accessorKey: "id", render: (item) => (
      <div className="flex flex-wrap gap-1">
        {getAbuseTypesList(item).map(type => (
          <span key={type} className="bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 text-[9px] px-1.5 py-0.5 rounded font-black tracking-wider uppercase">
            {type}
          </span>
        ))}
      </div>
    )}
  ];

  return (
    <SectionContainer
      title="Abused Students Registry (2025)"
      description="Confidential registry for reporting and managing cases of abuse in early childhood."
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
          <div className="p-3 bg-rose-500/10 text-rose-600 dark:text-rose-500 rounded-xl">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Cases</span>
            <span className="text-2xl font-black text-rose-600 dark:text-rose-500">{stats.total}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#000A14] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <User className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">By Gender</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-100">{stats.males}M / {stats.females}F</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#000A14] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-[#00A3A3]/10 text-[#00A3A3] rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Top Category</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-100 truncate w-32 md:w-full">{stats.topCategory}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#000A14] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-500 rounded-xl">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Top Abuse Type</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-100 truncate w-32 md:w-full">{stats.topAbuse}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#000A14] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full">
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search by ID..."
            filters={[
              {
                key: "categoryLevel",
                label: "Category/Level",
                value: activeFilters.categoryLevel as string,
                options: ["All Categories", ...CATEGORY_OPTIONS],
                onChange: (val) => setFilterVal("categoryLevel", val)
              }
            ]}
            onClear={() => { clearFilters(); setAbuseFilter(""); }}
          />

          {/* Custom Filter for Abuse Types */}
          <div className="flex bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden w-full sm:w-auto h-10">
            <select
              value={abuseFilter}
              onChange={(e) => setAbuseFilter(e.target.value)}
              className="px-3 py-2 bg-transparent text-xs font-bold text-[#002652] dark:text-slate-300 outline-none w-full sm:w-auto hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <option value="">All Abuse Types</option>
              {ABUSE_TYPES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>
        <AddButton 
          onClick={handleOpenAdd} 
          label="Log Case" 
          className="bg-rose-600 hover:bg-rose-700 text-white border-0 shadow-sm" 
        />
      </div>

      <DataTable
        data={displayFilteredItems}
        columns={columns}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        emptyMessage="No abused student records found."
      />

      {/* Add/Edit Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedCase ? "Update Case Record" : "Log Abuse Case"}
        onSubmit={handleSave}
        submitLabel={selectedCase ? "Save Changes" : "Log Case Now"}
      >
        <div className="space-y-6">
          {/* Section 1: Student Information */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-[#002652] dark:text-[#00A3A3] border-b border-slate-200 dark:border-slate-800 pb-2">
              Section 1: Student Information
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
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">NATIONALITY</label>
                <select
                  value={formData.nationality || ""}
                  onChange={(e) => handleFieldChange("nationality", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  <option value="">-- Select --</option>
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
            {formData.dobYear && (
               <div className="text-xs font-bold text-[#00A3A3] bg-[#00A3A3]/10 p-2 rounded-lg border border-[#00A3A3]/30">
                  Computed Age: {getAge(formData.dobYear)} years
               </div>
            )}
          </div>

          {/* Section 2: Case Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-[#002652] dark:text-[#00A3A3] border-b border-slate-200 dark:border-slate-800 pb-2">
              Section 2: Case Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">CATEGORY/ LEVEL</label>
                <select
                  value={formData.categoryLevel || ""}
                  onChange={(e) => handleFieldChange("categoryLevel", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  <option value="">-- Select --</option>
                  {CATEGORY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">STUDENT SOCIAL STATUS</label>
                <select
                  value={formData.studentSocialStatus || ""}
                  onChange={(e) => handleFieldChange("studentSocialStatus", e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-[#002652] dark:text-slate-200"
                >
                  <option value="">-- Select --</option>
                  {SOCIAL_STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Types of Abuse */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-rose-600 dark:text-rose-500 border-b border-rose-200 dark:border-rose-900/50 pb-2">
              Section 3: Types of Abuse
            </h4>
            <div className="bg-rose-50/50 dark:bg-rose-950/20 p-4 rounded-xl border border-rose-100 dark:border-rose-900/50">
               <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { key: "bullying", label: "BULLYING" },
                    { key: "corporalPunishment", label: "CORPORAL PUNISHMENT" },
                    { key: "sexualHarassment", label: "SEXUAL HARASSMENT" },
                    { key: "sexualAbuse", label: "SEXUAL ABUSE" },
                    { key: "violence", label: "VIOLENCE" }
                  ].map(field => (
                    <div key={field.key}>
                      <label className="block text-[10px] uppercase font-bold text-rose-700 dark:text-rose-400 tracking-wider mb-1">{field.label}</label>
                      <select
                        value={(formData as any)[field.key] || "No"}
                        onChange={(e) => handleFieldChange(field.key as keyof ECAbusedStudent, e.target.value)}
                        className={`w-full text-xs p-2.5 rounded-lg outline-none border focus:ring-1 focus:ring-rose-500 ${
                          (formData as any)[field.key] === "Yes" 
                           ? "bg-rose-100 border-rose-300 text-rose-800 dark:bg-rose-900 dark:border-rose-700 dark:text-rose-200 font-bold" 
                           : "bg-white border-slate-200 text-slate-700 dark:bg-[#000A14] dark:border-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {YES_NO_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  ))}
               </div>
            </div>
          </div>

        </div>
      </FormModal>

      {/* Delete Confirmation */}
      <FormModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Confirm Removal"
        onSubmit={(e) => { e.preventDefault(); handleDelete(); }}
        submitLabel="Confirm Remove"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Are you sure you want to permanently delete the abuse record for ID <strong>{selectedCase?.nationalIdPassport}</strong>? 
            This action cannot be undone.
          </p>
        </div>
      </FormModal>
    </SectionContainer>
  );
};
