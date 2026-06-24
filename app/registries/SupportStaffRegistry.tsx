"use client";

import React, { useState } from "react";
import { AlertCircle, Eye, ShieldAlert, Award, FileText, Calendar } from "lucide-react";
import { SupportStaff } from "../types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useFilters } from "@/hooks/useFilters";
import { INITIAL_SUPPORT } from "../constants";
import { SectionContainer } from "../shared/SectionContainer";
import { FilterBar } from "../shared/FilterBar";
import { DataTable, ColumnConfig } from "../shared/DataTable";
import { FormModal } from "../shared/FormModal";
import { AddButton } from "../shared/ActionButtons";

const NAT_OPTIONS = [
  "Botswana",
  "South Africa",
  "Zimbabwe",
  "Zambia",
  "Namibia",
  "Lesotho",
  "Eswatini",
  "Other",
];

const CONTRACT_OPTIONS = [
  "Permanent & Pensionable Teacher",
  "Contract",
  "Temporary - Vacant Post",
  "Temporary - Study Leave",
  "Temporary - School Expansion",
  "Temporary - Relief",
  "Internship"
];

// 25 common Support Staff positions
const POS_OPTIONS = [
  "Administration Assistant",
  "Administrative Officer",
  "Bursar",
  "Catering Supervisor",
  "Cleaner",
  "Cook",
  "Driver",
  "Farm / Grounds Worker",
  "Farm Manager",
  "Finance Officer",
  "Gatekeeper",
  "Groundsman",
  "Handyman",
  "Health Care Assistant",
  "IT Assistant",
  "Kitchen Hand",
  "Laboratory Assistant",
  "Librarian",
  "Library Assistant",
  "Messenger",
  "Receptionist",
  "Security Guard",
  "Security Personnel",
  "Storekeeper",
  "Typist"
];

const QUAL_OPTIONS = [
  "Lower than PSLE",
  "PSLE",
  "JCE",
  "BGCSE/COSC",
  "Certificate",
  "Diploma",
  "Bachelors",
  "Masters",
  "Mphil",
  "PhD"
];

const ICT_SKILLS_OPTIONS = [
  "Basic Skills",
  "With Certificate"
];

const TRAINING_ICT_OPTIONS = [
  "Computer Awareness",
  "Guidance & Counselling",
  "Leadership & Management",
  "Subject Based"
];

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const YEARS = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
const RECENT_YEARS = Array.from({ length: 60 }, (_, i) => new Date().getFullYear() - i + 5); 

// Helper component for date selection matching TeachersRegistry styling where applicable
const DateSelector = ({
  day, setDay,
  month, setMonth,
  year, setYear,
  label
}: {
  day: number | "", setDay: (v: number | "") => void,
  month: number | "", setMonth: (v: number | "") => void,
  year: number | "", setYear: (v: number | "") => void,
  label: string
}) => (
  <div>
    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{label}</label>
    <div className="grid grid-cols-3 gap-2">
      <select
        value={day}
        onChange={(e) => setDay(e.target.value === "" ? "" : Number(e.target.value))}
        className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
      >
        <option value="">Day</option>
        {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
      </select>
      <select
        value={month}
        onChange={(e) => setMonth(e.target.value === "" ? "" : Number(e.target.value))}
        className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
      >
        <option value="">Month</option>
        {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
      </select>
      <select
        value={year}
        onChange={(e) => setYear(e.target.value === "" ? "" : Number(e.target.value))}
        className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
      >
        <option value="">Year</option>
        {RECENT_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
      </select>
    </div>
  </div>
);

export const SupportStaffRegistry: React.FC = () => {
  const { items, addItem, updateItem, deleteItem } = useLocalStorage<SupportStaff>(
    "support_staff",
    INITIAL_SUPPORT
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<SupportStaff | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [formData, setFormData] = useState<Partial<SupportStaff>>({});

  const {
    searchQuery,
    setSearchQuery,
    activeFilters,
    setFilterVal,
    clearFilters,
    filteredItems
  } = useFilters<SupportStaff>(
    items,
    ["id", "surname", "first", "pos"],
    { pos: "All", contract: "All" }
  );

  const triggerAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const filterConfigs = [
    {
      key: "pos",
      label: "Position",
      value: activeFilters.pos || "All",
      options: POS_OPTIONS,
      onChange: (val: string) => setFilterVal("pos", val)
    },
    {
      key: "contract",
      label: "Contract Type",
      value: activeFilters.contract || "All",
      options: CONTRACT_OPTIONS,
      onChange: (val: string) => setFilterVal("contract", val)
    }
  ];

  const columns: ColumnConfig<SupportStaff>[] = [
    {
      header: "National ID",
      accessorKey: "id",
      className: "font-mono font-bold text-sea"
    },
    {
      header: "Full Name",
      render: (s) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-slate-100 truncate uppercase block">{s.surname}</span>
          <span className="text-slate-500 dark:text-slate-400 text-xs block">{s.first}</span>
        </div>
      )
    },
    {
      header: "Details",
      render: (s) => (
        <div className="text-[11px] leading-tight flex flex-col gap-0.5">
          <span className="font-semibold text-slate-800 dark:text-slate-200">{s.pos}</span>
          <span className="text-slate-500 dark:text-slate-400">{s.qual}</span>
        </div>
      )
    },
    {
      header: "Demographics",
      render: (s) => (
        <div className="flex flex-col gap-0.5 text-xs">
          <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold inline-block self-start ${
            s.sex === "Female" 
              ? "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400" 
              : "bg-blue-500/10 text-blue-600 dark:bg-sky-500/20 dark:text-sky-400"
          }`}>{s.sex}</span>
          <span className="text-[10px] text-slate-400 font-mono">
            {s.dobDay && s.dobMonth && s.dobYear ? `${s.dobDay.toString().padStart(2, "0")}/${s.dobMonth.toString().padStart(2, "0")}/${s.dobYear}` : "N/A"}
          </span>
        </div>
      )
    },
    {
      header: "Appointment",
      render: (s) => (
        <div className="text-[11px] leading-tight font-mono">
          <div>Joined: {s.joinedDay && s.joinedMonth && s.joinedYear ? `${s.joinedDay.toString().padStart(2, "0")}/${s.joinedMonth.toString().padStart(2, "0")}/${s.joinedYear}` : "N/A"}</div>
          <div className="text-[10px] text-slate-400">First Appt: {s.firstApptDay && s.firstApptMonth && s.firstApptYear ? `${s.firstApptDay.toString().padStart(2, "0")}/${s.firstApptMonth.toString().padStart(2, "0")}/${s.firstApptYear}` : "N/A"}</div>
        </div>
      )
    },
    {
      header: "Contract Type",
      render: (s) => (
        <span className="text-slate-600 dark:text-slate-400 font-medium text-[11px]">{s.contract}</span>
      )
    },
    {
      header: "Previous Year Absences",
      render: (s) => {
        const total = (s.absNormalLeave || 0) +
                      (s.absLeaveAugmentation || 0) +
                      (s.absSpecialLeave || 0) +
                      (s.absUnpaidLeave || 0) +
                      (s.absUnauthorisedLeave || 0) +
                      (s.absMaternityLeave || 0) +
                      (s.absSickLeave || 0) +
                      (s.absAttendingTraining || 0) +
                      (s.absAttendingOtherDuties || 0);
        return (
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">{total} Days</span>
            {(s.absSickLeave || 0) > 5 && (
              <span className="text-[8.5px] bg-golden/10 text-golden dark:bg-amber-950/40 dark:text-amber-400 font-semibold block uppercase">Sick Leave Warn</span>
            )}
          </div>
        );
      }
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.surname || !formData.first || !formData.pos) {
      triggerAlert("National ID, Surname, First names, and Position are mandatory.", "error");
      return;
    }

    const compiled: SupportStaff = {
      id: formData.id,
      surname: String(formData.surname).toUpperCase(),
      first: formData.first || "",
      nat: formData.nat || "Botswana",
      sex: formData.sex || "Female",
      pos: formData.pos || "Cleaner",
      contract: formData.contract || "Permanent & Pensionable Teacher",
      qual: formData.qual || "PSLE",
      dobDay: formData.dobDay,
      dobMonth: formData.dobMonth,
      dobYear: formData.dobYear,
      firstApptDay: formData.firstApptDay,
      firstApptMonth: formData.firstApptMonth,
      firstApptYear: formData.firstApptYear,
      joinedDay: formData.joinedDay,
      joinedMonth: formData.joinedMonth,
      joinedYear: formData.joinedYear,
      ict: formData.ict || "Basic Skills",
      trainingIct: formData.trainingIct || "Computer Awareness",
      trainingLeadership: formData.trainingLeadership || "",
      trainingProfession: formData.trainingProfession || "",
      absNormalLeave: Number(formData.absNormalLeave) || 0,
      absLeaveAugmentation: Number(formData.absLeaveAugmentation) || 0,
      absSpecialLeave: Number(formData.absSpecialLeave) || 0,
      absUnpaidLeave: Number(formData.absUnpaidLeave) || 0,
      absUnauthorisedLeave: Number(formData.absUnauthorisedLeave) || 0,
      absMaternityLeave: Number(formData.absMaternityLeave) || 0,
      absSickLeave: Number(formData.absSickLeave) || 0,
      absAttendingTraining: Number(formData.absAttendingTraining) || 0,
      absAttendingOtherDuties: Number(formData.absAttendingOtherDuties) || 0,
    };

    if (selectedStaff) {
      updateItem(compiled);
      triggerAlert(`Support staff record for ${compiled.surname} updated.`, "success");
    } else {
      if (items.some(x => x.id === compiled.id)) {
        triggerAlert(`A staff member with ID ${compiled.id} is already in registry.`, "error");
        return;
      }
      addItem(compiled);
      triggerAlert(`Registered support staff profile for ${compiled.surname}.`, "success");
    }

    setModalOpen(false);
    setSelectedStaff(null);
    setFormData({});
  };

  const handleEditClick = (s: SupportStaff) => {
    setSelectedStaff(s);
    setFormData(s);
    setModalOpen(true);
  };

  const handleViewClick = (s: SupportStaff) => {
    setSelectedStaff(s);
    setViewOpen(true);
  };

  const handleDeleteClick = (s: SupportStaff) => {
    setSelectedStaff(s);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedStaff) {
      deleteItem(selectedStaff.id);
      triggerAlert(`Successfully removed ${selectedStaff.id} from support staff record.`, "success");
      setDeleteOpen(false);
      setSelectedStaff(null);
    }
  };

  // Calculated getters
  const getAge = () => {
    if (!formData.dobYear) return "N/A";
    const currentYear = new Date().getFullYear();
    return currentYear - formData.dobYear;
  };

  const getExperience = () => {
    if (!formData.firstApptYear) return "N/A";
    const currentYear = new Date().getFullYear();
    return currentYear - formData.firstApptYear;
  };

  const getLengthOfStay = () => {
    if (!formData.joinedYear) return "N/A";
    const currentYear = new Date().getFullYear();
    return currentYear - formData.joinedYear;
  };

  const formatDate = (d: number | "" | undefined, m: number | "" | undefined, y: number | "" | undefined) => {
    if (!d || !m || !y) return "N/A";
    return `${d.toString().padStart(2, "0")}/${m.toString().padStart(2, "0")}/${y}`;
  };

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

      <SectionContainer
        title="Support Staff Registry"
        description="Comprehensive inventory of support staff, compiling professional credentials, in-service professional training tracks, and previous scholastic year absence dashboards."
        action={
          <AddButton
            label="Add New Support Staff"
            onClick={() => {
              setSelectedStaff(null);
              setFormData({ 
                sex: "Female", 
                pos: POS_OPTIONS[0],
                qual: QUAL_OPTIONS[0],
                contract: CONTRACT_OPTIONS[0],
                nat: NAT_OPTIONS[0],
                ict: ICT_SKILLS_OPTIONS[0],
                trainingIct: TRAINING_ICT_OPTIONS[0],
                absNormalLeave: 0,
                absLeaveAugmentation: 0,
                absSpecialLeave: 0,
                absUnpaidLeave: 0,
                absUnauthorisedLeave: 0,
                absMaternityLeave: 0,
                absSickLeave: 0,
                absAttendingTraining: 0,
                absAttendingOtherDuties: 0
              });
              setModalOpen(true);
            }}
          />
        }
      >
        <FilterBar
          searchPlaceholder="Search ID, surname, first names, or position..."
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
          emptyMessage="No support staff registers match active filters."
        />
      </SectionContainer>

      {/* Form Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedStaff ? "Edit Support Staff Record" : "Register Support Staff"}
        onSubmit={handleSubmit}
        size="3xl"
        submitLabel="Save Support Staff Record"
        cancelLabel="Clear Form"
      >
        {/* Section 1: Personal Information */}
        <div className="mb-6">
          <h3 className="block text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100 mb-3 border-b border-slate-200 dark:border-slate-800 pb-2">Section 1: Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">National ID / Passport *</label>
              <input
                type="text"
                required
                disabled={!!selectedStaff}
                value={formData.id || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                placeholder="e.g. 504527511"
                className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Surname *</label>
              <input
                type="text"
                required
                value={formData.surname || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, surname: e.target.value }))}
                placeholder="Surname"
                className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">First Names *</label>
              <input
                type="text"
                required
                value={formData.first || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, first: e.target.value }))}
                placeholder="First names"
                className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Nationality</label>
              <select
                value={formData.nat || "Botswana"}
                onChange={(e) => setFormData(prev => ({ ...prev, nat: e.target.value }))}
                className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
              >
                {NAT_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Sex</label>
              <select
                value={formData.sex || "Female"}
                onChange={(e) => setFormData(prev => ({ ...prev, sex: e.target.value as any }))}
                className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <DateSelector
              label="Date of Birth"
              day={formData.dobDay ?? ""} setDay={(v) => setFormData(prev => ({ ...prev, dobDay: v as number }))}
              month={formData.dobMonth ?? ""} setMonth={(v) => setFormData(prev => ({ ...prev, dobMonth: v as number }))}
              year={formData.dobYear ?? ""} setYear={(v) => setFormData(prev => ({ ...prev, dobYear: v as number }))}
            />
          </div>
        </div>

        {/* Section 2: Employment Details */}
        <div className="mb-6">
          <h3 className="block text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100 mb-3 border-b border-slate-200 dark:border-slate-800 pb-2">Section 2: Employment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Contract Type</label>
              <select
                value={formData.contract || "Permanent & Pensionable Teacher"}
                onChange={(e) => setFormData(prev => ({ ...prev, contract: e.target.value }))}
                className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
              >
                {CONTRACT_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Position *</label>
              <select
                required
                value={formData.pos || POS_OPTIONS[0]}
                onChange={(e) => setFormData(prev => ({ ...prev, pos: e.target.value }))}
                className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
              >
                {POS_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <DateSelector
              label="Date of First Appointment"
              day={formData.firstApptDay ?? ""} setDay={(v) => setFormData(prev => ({ ...prev, firstApptDay: v as number }))}
              month={formData.firstApptMonth ?? ""} setMonth={(v) => setFormData(prev => ({ ...prev, firstApptMonth: v as number }))}
              year={formData.firstApptYear ?? ""} setYear={(v) => setFormData(prev => ({ ...prev, firstApptYear: v as number }))}
            />
            <DateSelector
              label="Date Joined the School"
              day={formData.joinedDay ?? ""} setDay={(v) => setFormData(prev => ({ ...prev, joinedDay: v as number }))}
              month={formData.joinedMonth ?? ""} setMonth={(v) => setFormData(prev => ({ ...prev, joinedMonth: v as number }))}
              year={formData.joinedYear ?? ""} setYear={(v) => setFormData(prev => ({ ...prev, joinedYear: v as number }))}
            />
          </div>
        </div>

        {/* Section 3: Qualifications & Skills */}
        <div className="mb-6">
          <h3 className="block text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100 mb-3 border-b border-slate-200 dark:border-slate-800 pb-2">Section 3: Qualifications & Skills</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Qualification</label>
              <select
                value={formData.qual || QUAL_OPTIONS[0]}
                onChange={(e) => setFormData(prev => ({ ...prev, qual: e.target.value }))}
                className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
              >
                {QUAL_OPTIONS.map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">ICT Skills</label>
              <select
                value={formData.ict || ICT_SKILLS_OPTIONS[0]}
                onChange={(e) => setFormData(prev => ({ ...prev, ict: e.target.value }))}
                className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
              >
                {ICT_SKILLS_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-5 border-t border-slate-100 dark:border-slate-800/60 pt-4">
              <span className="md:col-span-3 block text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">In-Service Training</span>
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">ICT Related</label>
                <select
                  value={formData.trainingIct || TRAINING_ICT_OPTIONS[0]}
                  onChange={(e) => setFormData(prev => ({ ...prev, trainingIct: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-xs"
                >
                  {TRAINING_ICT_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">Leadership & Management</label>
                <input
                  type="text"
                  value={formData.trainingLeadership || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, trainingLeadership: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">Profession Related Training</label>
                <input
                  type="text"
                  value={formData.trainingProfession || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, trainingProfession: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Staff Absence (Previous Year) */}
        <div className="mb-6">
          <h3 className="block text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100 mb-3 border-b border-slate-200 dark:border-slate-800 pb-2">Section 4: Staff Absence (Previous Year)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wide block mb-1">Normal Leave</label>
              <input
                type="number" min="0" required
                value={formData.absNormalLeave ?? 0}
                onChange={(e) => setFormData(prev => ({ ...prev, absNormalLeave: Number(e.target.value) }))}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-center text-sm font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wide block mb-1">Leave Augmentation</label>
              <input
                type="number" min="0" required
                value={formData.absLeaveAugmentation ?? 0}
                onChange={(e) => setFormData(prev => ({ ...prev, absLeaveAugmentation: Number(e.target.value) }))}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-center text-sm font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wide block mb-1">Special Leave</label>
              <input
                type="number" min="0" required
                value={formData.absSpecialLeave ?? 0}
                onChange={(e) => setFormData(prev => ({ ...prev, absSpecialLeave: Number(e.target.value) }))}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-center text-sm font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wide block mb-1">Unpaid Leave</label>
              <input
                type="number" min="0" required
                value={formData.absUnpaidLeave ?? 0}
                onChange={(e) => setFormData(prev => ({ ...prev, absUnpaidLeave: Number(e.target.value) }))}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-center text-sm font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wide block mb-1">Unauthorised</label>
              <input
                type="number" min="0" required
                value={formData.absUnauthorisedLeave ?? 0}
                onChange={(e) => setFormData(prev => ({ ...prev, absUnauthorisedLeave: Number(e.target.value) }))}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-center text-sm font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wide block mb-1">Maternity Leave</label>
              <input
                type="number" min="0" required
                value={formData.absMaternityLeave ?? 0}
                onChange={(e) => setFormData(prev => ({ ...prev, absMaternityLeave: Number(e.target.value) }))}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-center text-sm font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wide block mb-1">Sick Leave</label>
              <input
                type="number" min="0" required
                value={formData.absSickLeave ?? 0}
                onChange={(e) => setFormData(prev => ({ ...prev, absSickLeave: Number(e.target.value) }))}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-center text-sm font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wide block mb-1">Attending Training / Workshops</label>
              <input
                type="number" min="0" required
                value={formData.absAttendingTraining ?? 0}
                onChange={(e) => setFormData(prev => ({ ...prev, absAttendingTraining: Number(e.target.value) }))}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-center text-sm font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wide block mb-1">Attending Other Official Duties</label>
              <input
                type="number" min="0" required
                value={formData.absAttendingOtherDuties ?? 0}
                onChange={(e) => setFormData(prev => ({ ...prev, absAttendingOtherDuties: Number(e.target.value) }))}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-center text-sm font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Calculated Fields */}
        <div>
          <h3 className="block text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100 mb-3 border-b border-slate-200 dark:border-slate-800 pb-2">Section 5: Calculated Fields (Auto-Generated - Display Only)</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl">
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Age</span>
              <span className="font-mono text-lg font-black text-slate-700 dark:text-slate-300">{getAge()}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Experience</span>
              <span className="font-mono text-lg font-black text-slate-700 dark:text-slate-300">{getExperience()}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Length of Stay</span>
              <span className="font-mono text-lg font-black text-slate-700 dark:text-slate-300">{getLengthOfStay()}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase mb-1">DOB</span>
              <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">{formatDate(formData.dobDay, formData.dobMonth, formData.dobYear)}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase mb-1">DO1st APP</span>
              <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">{formatDate(formData.firstApptDay, formData.firstApptMonth, formData.firstApptYear)}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase mb-1">DJS</span>
              <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">{formatDate(formData.joinedDay, formData.joinedMonth, formData.joinedYear)}</span>
            </div>
          </div>
        </div>
      </FormModal>

      {/* View Modal */}
      <FormModal
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Support Staff Dossier"
        onSubmit={(e) => {
          e.preventDefault();
          setViewOpen(false);
        }}
        submitLabel="Dismiss"
      >
        {selectedStaff && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-slate-50/50 dark:bg-slate-900 p-4 rounded border border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 bg-prussian text-white flex items-center justify-center font-extrabold text-lg rounded shadow">
                {selectedStaff.surname.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase">{selectedStaff.surname}, {selectedStaff.first}</h4>
                <p className="text-xs font-mono text-slate-400">National ID: {selectedStaff.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
              <div>
                <span className="text-slate-400 font-mono text-[9px] uppercase block">Position:</span>
                <span className="font-bold text-prussian dark:text-slate-100">{selectedStaff.pos}</span>
              </div>
              <div>
                <span className="text-slate-400 font-mono text-[9px] uppercase block">Contract Term:</span>
                <span className="font-semibold">{selectedStaff.contract}</span>
              </div>
              <div>
                <span className="text-slate-400 font-mono text-[9px] uppercase block">Qualification:</span>
                <span className="font-bold">{selectedStaff.qual}</span>
              </div>
              <div>
                <span className="text-slate-400 font-mono text-[9px] uppercase block">Nationality:</span>
                <span className="font-semibold">{selectedStaff.nat}</span>
              </div>
              <div>
                <span className="text-slate-400 font-mono text-[9px] uppercase block">ICT Skills:</span>
                <span className="font-semibold text-sea">{selectedStaff.ict}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 font-mono text-[9px] uppercase block">In-Service Training:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  ICT Related: {selectedStaff.trainingIct || "None"} | Leadership: {selectedStaff.trainingLeadership || "None"} | Profession: {selectedStaff.trainingProfession || "None"}
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 border rounded">
              <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500 block mb-2 font-mono">Detailed absence summary</span>
              <ul className="text-xs grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-600 dark:text-slate-400">
                <li>Normal Leave: <strong className="text-slate-800 dark:text-slate-200">{selectedStaff.absNormalLeave || 0} days</strong></li>
                <li>Leave Augmentation: <strong className="text-slate-800 dark:text-slate-200">{selectedStaff.absLeaveAugmentation || 0} days</strong></li>
                <li>Special Leave: <strong className="text-slate-800 dark:text-slate-200">{selectedStaff.absSpecialLeave || 0} days</strong></li>
                <li>Unpaid Leave: <strong className="text-slate-800 dark:text-slate-200">{selectedStaff.absUnpaidLeave || 0} days</strong></li>
                <li>Unauthorised Leave: <strong className="text-slate-800 dark:text-slate-200">{selectedStaff.absUnauthorisedLeave || 0} days</strong></li>
                <li>Maternity Leave: <strong className="text-slate-800 dark:text-slate-200">{selectedStaff.absMaternityLeave || 0} days</strong></li>
                <li>Sick Leave: <strong className="text-slate-800 dark:text-slate-200">{selectedStaff.absSickLeave || 0} days</strong></li>
                <li>Attending Training/ Workshops: <strong className="text-slate-800 dark:text-slate-200">{selectedStaff.absAttendingTraining || 0} days</strong></li>
                <li>Other Official Duties: <strong className="text-slate-800 dark:text-slate-200">{selectedStaff.absAttendingOtherDuties || 0} days</strong></li>
              </ul>
            </div>
          </div>
        )}
      </FormModal>

      {/* Delete Confirmation Modal */}
      <FormModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Confirm Staff Dismissal"
        onSubmit={(e) => {
          e.preventDefault();
          confirmDelete();
        }}
        submitLabel="Dismiss Staff"
        cancelLabel="Keep"
      >
        <div className="text-center py-4">
          <AlertCircle className="w-12 h-12 text-golden mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Dismiss Support Staff from Registers?</h4>
          <p className="text-xs text-slate-500 mt-2">
            Are you sure you want to remove <strong>{selectedStaff?.surname}, {selectedStaff?.first}</strong> (ID: {selectedStaff?.id})?
            This will permanently erase their data from the local census index.
          </p>
          <div className="mt-4 p-3 bg-golden/10 border border-golden text-golden rounded font-semibold text-xs">
            Operational Warning: Overwrites national education nodes.
          </div>
        </div>
      </FormModal>
    </div>
  );
};

export default SupportStaffRegistry;
