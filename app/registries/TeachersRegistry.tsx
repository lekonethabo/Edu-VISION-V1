"use client";

import React, { useState } from "react";
import { AlertCircle, Eye, ShieldAlert, Award, FileText, Calendar } from "lucide-react";
import { Teacher } from "../types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useFilters } from "@/hooks/useFilters";
import { INITIAL_TEACHERS } from "../constants";
import { SectionContainer } from "../shared/SectionContainer";
import { FilterBar } from "../shared/FilterBar";
import { DataTable, ColumnConfig } from "../shared/DataTable";
import { FormModal } from "../shared/FormModal";
import { AddButton } from "../shared/ActionButtons";

const POS_OPTIONS = [
  "School Head",
  "Deputy School Head",
  "Head of Department",
  "HoD-Learning Difficulties",
  "Senior Teacher",
  "Senior Teacher w/o Portfolio",
  "Teacher",
  "Assistant Teacher"
];
const QUAL_OPTIONS = [
  "Primary Teaching Certificate",
  "Diploma-Primary Education",
  "Degree-Primary Education",
  "Degree-SPED",
  "Degree - Guidance & Counselling",
  "Degree- Education Management",
  "Masters-Primary Education",
  "Masters - Guidance & Counselling",
  "Masters in Education",
  "Mphil",
  "PhD",
  "Diploma-Secondary Education",
  "Degree-Secondary Education",
  "Degree + PGDE",
  "Other Teaching Qualification",
  "Unqualified"
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
const SPED_TRAINING_OPTIONS = [
  "None",
  "Hearing Impairment",
  "Intellectual Disabilities",
  "Hearing Disabilities",
  "Visual Impairment",
  "Multiple Disabilities"
];

export const TeachersRegistry: React.FC = () => {
  const { items, addItem, updateItem, deleteItem } = useLocalStorage<Teacher>(
    "teachers",
    INITIAL_TEACHERS
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [formData, setFormData] = useState<Partial<Teacher>>({});

  const {
    searchQuery,
    setSearchQuery,
    activeFilters,
    setFilterVal,
    clearFilters,
    filteredItems
  } = useFilters<Teacher>(
    items,
    ["id", "surname", "first"],
    { pos: "All", onStudyLeave: "All" }
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
      key: "onStudyLeave",
      label: "Study Leave",
      value: activeFilters.onStudyLeave || "All",
      options: ["Yes", "No"],
      onChange: (val: string) => setFilterVal("onStudyLeave", val)
    }
  ];

  const columns: ColumnConfig<Teacher>[] = [
    {
      header: "Employee ID",
      accessorKey: "id",
      className: "font-mono font-bold text-sea"
    },
    {
      header: "Full Name",
      render: (t) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-slate-100 truncate uppercase block">{t.surname}</span>
          <span className="text-slate-500 dark:text-slate-400 text-xs block">{t.first}</span>
        </div>
      )
    },
    {
      header: "Details",
      render: (t) => (
        <div className="text-[11px] leading-tight flex flex-col gap-0.5">
          <span className="font-semibold text-slate-800 dark:text-slate-200">{t.pos}</span>
          <span className="text-slate-500 dark:text-slate-400">{t.qual}</span>
        </div>
      )
    },
    {
      header: "Demographics",
      render: (t) => (
        <div className="flex flex-col gap-0.5 text-xs">
          <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold inline-block self-start ${
            t.sex === "Female" 
              ? "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400" 
              : "bg-blue-500/10 text-blue-600 dark:bg-sky-500/20 dark:text-sky-400"
          }`}>{t.sex}</span>
          <span className="text-[10px] text-slate-400 font-mono">{t.dob}</span>
        </div>
      )
    },
    {
      header: "Appointment",
      render: (t) => (
        <div className="text-[11px] leading-tight font-mono">
          <div>Joined: {t.joined}</div>
          <div className="text-[10px] text-slate-400">First Appt: {t.firstAppt}</div>
        </div>
      )
    },
    {
      header: "Leave Status",
      render: (t) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
          t.onStudyLeave === "Yes" 
            ? "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 font-black animate-pulse" 
            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
        }`}>
          On Study Leave: {t.onStudyLeave}
        </span>
      )
    },
    {
      header: "Sped Training",
      render: (t) => (
        <span className={`text-[10px] font-semibold ${t.sped !== "None" ? "text-amber-700 dark:text-amber-400" : "text-slate-400 dark:text-slate-500"}`}>
          {t.sped}
        </span>
      )
    },
    {
      header: "Previous Year Absences",
      render: (t) => {
        const total = (t.absNormalLeave || 0) +
                      (t.absLeaveAugmentation || 0) +
                      (t.absSpecialLeave || 0) +
                      (t.absUnpaidLeave || 0) +
                      (t.absUnauthorisedLeave || 0) +
                      (t.absMaternityLeave || 0) +
                      (t.absSickLeave || 0) +
                      (t.absAttendingTraining || 0) +
                      (t.absAttendingOtherDuties || 0);
        return (
          <div>
            <span className="font-bold text-slate-800 text-xs">{total} Days</span>
            {t.absSickLeave > 5 && (
              <span className="text-[8.5px] bg-golden/10 text-golden font-semibold block uppercase">Sick Leave Warn</span>
            )}
          </div>
        );
      }
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.surname || !formData.first) {
      triggerAlert("Employee ID, Surname, and First names are mandatory.", "error");
      return;
    }

    const compiled: Teacher = {
      id: formData.id,
      surname: String(formData.surname).toUpperCase(),
      first: formData.first || "",
      sex: formData.sex || "Female",
      contract: formData.contract || "Permanent & Pensionable Teacher",
      pos: formData.pos || "Teacher",
      qual: formData.qual || "Primary Teaching Certificate",
      joined: formData.joined || "2024-01-10",
      ict: formData.ict || "Basic Skills",
      nat: formData.nat || "Botswana",
      dob: formData.dob || "1990-01-01",
      sped: formData.sped || "None",
      firstAppt: formData.firstAppt || "2015-01-01",
      onStudyLeave: formData.onStudyLeave || "No",
      trainingIct: formData.trainingIct || "No",
      trainingGuidance: formData.trainingGuidance || "No",
      trainingLeadership: formData.trainingLeadership || "No",
      trainingSubject: formData.trainingSubject || "No",
      numSubjectTeaching: Number(formData.numSubjectTeaching) || 0,
      teachingGuidance: formData.teachingGuidance || "No",
      partTimeCourse: formData.partTimeCourse || "No",
      teachersWithImpairments: formData.teachersWithImpairments || "No",
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

    if (selectedTeacher) {
      updateItem(compiled);
      triggerAlert(`Teacher record for ${compiled.surname} updated.`, "success");
    } else {
      if (items.some(x => x.id === compiled.id)) {
        triggerAlert(`A teacher with ID ${compiled.id} is already in registry.`, "error");
        return;
      }
      addItem(compiled);
      triggerAlert(`Registered teacher profile for ${compiled.surname}.`, "success");
    }

    setModalOpen(false);
    setSelectedTeacher(null);
    setFormData({});
  };

  const handleEditClick = (t: Teacher) => {
    setSelectedTeacher(t);
    setFormData(t);
    setModalOpen(true);
  };

  const handleViewClick = (t: Teacher) => {
    setSelectedTeacher(t);
    setViewOpen(true);
  };

  const handleDeleteClick = (t: Teacher) => {
    setSelectedTeacher(t);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedTeacher) {
      deleteItem(selectedTeacher.id);
      triggerAlert(`Successfully removed ${selectedTeacher.id} from instructors record.`, "success");
      setDeleteOpen(false);
      setSelectedTeacher(null);
    }
  };

  // Calculated getters
  const getAge = () => {
    if (!formData.dob) return "N/A";
    const year = new Date(formData.dob).getFullYear();
    if (isNaN(year)) return "N/A";
    const currentYear = new Date().getFullYear();
    return currentYear - year;
  };

  const getExperience = () => {
    if (!formData.firstAppt) return "N/A";
    const year = new Date(formData.firstAppt).getFullYear();
    if (isNaN(year)) return "N/A";
    const currentYear = new Date().getFullYear();
    return currentYear - year;
  };

  const getLengthOfStay = () => {
    if (!formData.joined) return "N/A";
    const year = new Date(formData.joined).getFullYear();
    if (isNaN(year)) return "N/A";
    const currentYear = new Date().getFullYear();
    return currentYear - year;
  };

  const formatDateString = (dateStr: string | undefined) => {
    if (!dateStr) return "N/A";
    const [y, m, d] = dateStr.split('-');
    if (!y || !m || !d) return "N/A";
    return `${d}/${m}/${y}`;
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
        title="Teaching Staff Registry"
        description="Comprehensive inventory of teaching staff, compiling professional credentials, in-service professional training tracks, and previous scholastic year absence dashboards."
        action={
          <AddButton
            label="Add New Teacher"
            onClick={() => {
              setSelectedTeacher(null);
              setFormData({ sex: "Female", onStudyLeave: "No", sped: "None", numSubjectTeaching: 1 });
              setModalOpen(true);
            }}
          />
        }
      >
        <FilterBar
          searchPlaceholder="Search employee ID, surname, or firstnames..."
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
          emptyMessage="No teaching staff registers match active filters."
        />
      </SectionContainer>

      {/* Form Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedTeacher ? "Edit Teacher Qualifications & Metrics" : "Register Instructional Teacher"}
        onSubmit={handleSubmit}
        size="3xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Employee ID / National ID *</label>
            <input
              type="text"
              required
              disabled={!!selectedTeacher}
              value={formData.id || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
              placeholder="e.g. 504527511"
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Contract Classification</label>
            <select
              value={formData.contract || "Permanent & Pensionable Teacher"}
              onChange={(e) => setFormData(prev => ({ ...prev, contract: e.target.value }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
            >
              {CONTRACT_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
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
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Firstnames *</label>
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
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Gender</label>
            <select
              value={formData.sex || "Female"}
              onChange={(e) => setFormData(prev => ({ ...prev, sex: e.target.value as any }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Date of Birth</label>
            <input
              type="date"
              value={formData.dob || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, dob: e.target.value }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Professional Assignment</label>
            <select
              value={formData.pos || "Teacher"}
              onChange={(e) => setFormData(prev => ({ ...prev, pos: e.target.value }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
            >
              {POS_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Highest Qualification</label>
            <select
              value={formData.qual || "Primary Teaching Certificate"}
              onChange={(e) => setFormData(prev => ({ ...prev, qual: e.target.value }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
            >
              {QUAL_OPTIONS.map(q => <option key={q} value={q}>{q}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Date Joined School</label>
            <input
              type="date"
              value={formData.joined || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, joined: e.target.value }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">First Appointment Date</label>
            <input
              type="date"
              value={formData.firstAppt || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, firstAppt: e.target.value }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">SPED (Special Education Needs) training</label>
            <select
              value={formData.sped || "None"}
              onChange={(e) => setFormData(prev => ({ ...prev, sped: e.target.value as any }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
            >
              {SPED_TRAINING_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Currently on Active Study Leave?</label>
            <select
              value={formData.onStudyLeave || "No"}
              onChange={(e) => setFormData(prev => ({ ...prev, onStudyLeave: e.target.value as any }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">ICT SKILLS</label>
            <select
              value={formData.ict || "None"}
              onChange={(e) => setFormData(prev => ({ ...prev, ict: e.target.value }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
            >
              <option value="None">None</option>
              <option value="Basic Skills">Basic Skills</option>
              <option value="With Certificate">With Certificate</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Number of subject teaching</label>
            <input
              type="number"
              min="0"
              value={formData.numSubjectTeaching ?? 0}
              onChange={(e) => setFormData(prev => ({ ...prev, numSubjectTeaching: Number(e.target.value) }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Teaching Guidance & Counselling</label>
            <select
              value={formData.teachingGuidance || "No"}
              onChange={(e) => setFormData(prev => ({ ...prev, teachingGuidance: e.target.value as any }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          {/* In-Service Training Section */}
          <div className="md:col-span-2 border-t border-slate-100 dark:border-slate-800 pt-4">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 block-header font-mono">In-Service Training</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">ICT RELATED</label>
                <select
                  value={formData.trainingIct || "No"}
                  onChange={(e) => setFormData(prev => ({ ...prev, trainingIct: e.target.value as any }))}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-xs"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">GUIDANCE & COUNSELLING</label>
                <select
                  value={formData.trainingGuidance || "No"}
                  onChange={(e) => setFormData(prev => ({ ...prev, trainingGuidance: e.target.value as any }))}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-xs"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">LEADERSHIP & MANAGEMENT</label>
                <select
                  value={formData.trainingLeadership || "No"}
                  onChange={(e) => setFormData(prev => ({ ...prev, trainingLeadership: e.target.value as any }))}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-xs"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">SUBJECT RELATED</label>
                <select
                  value={formData.trainingSubject || "No"}
                  onChange={(e) => setFormData(prev => ({ ...prev, trainingSubject: e.target.value as any }))}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-xs"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Absence numbers inputs */}
          <div className="md:col-span-2 border-t border-slate-100 dark:border-slate-800 pt-4">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Historic leave & absences tracking (days)</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">NORMAL LEAVE</label>
                <input
                  type="number"
                  min="0"
                  value={formData.absNormalLeave ?? 0}
                  onChange={(e) => setFormData(prev => ({ ...prev, absNormalLeave: Number(e.target.value) }))}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-center text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">LEAVE AUGMENTATION</label>
                <input
                  type="number"
                  min="0"
                  value={formData.absLeaveAugmentation ?? 0}
                  onChange={(e) => setFormData(prev => ({ ...prev, absLeaveAugmentation: Number(e.target.value) }))}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-center text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">SPECIAL LEAVE</label>
                <input
                  type="number"
                  min="0"
                  value={formData.absSpecialLeave ?? 0}
                  onChange={(e) => setFormData(prev => ({ ...prev, absSpecialLeave: Number(e.target.value) }))}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-center text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">UNPAID LEAVE</label>
                <input
                  type="number"
                  min="0"
                  value={formData.absUnpaidLeave ?? 0}
                  onChange={(e) => setFormData(prev => ({ ...prev, absUnpaidLeave: Number(e.target.value) }))}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-center text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">UNAUTHORISED LEAVE</label>
                <input
                  type="number"
                  min="0"
                  value={formData.absUnauthorisedLeave ?? 0}
                  onChange={(e) => setFormData(prev => ({ ...prev, absUnauthorisedLeave: Number(e.target.value) }))}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-center text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">MATERNITY LEAVE</label>
                <input
                  type="number"
                  min="0"
                  value={formData.absMaternityLeave ?? 0}
                  onChange={(e) => setFormData(prev => ({ ...prev, absMaternityLeave: Number(e.target.value) }))}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-center text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">SICK LEAVE</label>
                <input
                  type="number"
                  min="0"
                  value={formData.absSickLeave ?? 0}
                  onChange={(e) => setFormData(prev => ({ ...prev, absSickLeave: Number(e.target.value) }))}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-center text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">ATTENDING TRAINING/ WORSHOPS</label>
                <input
                  type="number"
                  min="0"
                  value={formData.absAttendingTraining ?? 0}
                  onChange={(e) => setFormData(prev => ({ ...prev, absAttendingTraining: Number(e.target.value) }))}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-center text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">ATTENDING OTHER OFFICIAL DUTIES</label>
                <input
                  type="number"
                  min="0"
                  value={formData.absAttendingOtherDuties ?? 0}
                  onChange={(e) => setFormData(prev => ({ ...prev, absAttendingOtherDuties: Number(e.target.value) }))}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-center text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Calculated Fields */}
          <div className="md:col-span-2 border-t border-slate-100 dark:border-slate-800 pt-4">
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
                <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">{formatDateString(formData.dob)}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase mb-1">DO1st APP</span>
                <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">{formatDateString(formData.firstAppt)}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase mb-1">DJS</span>
                <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">{formatDateString(formData.joined)}</span>
              </div>
            </div>
          </div>
        </div>
      </FormModal>

      {/* View Modal */}
      <FormModal
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Instructional Teacher Dossier"
        onSubmit={(e) => {
          e.preventDefault();
          setViewOpen(false);
        }}
        submitLabel="Dismiss"
      >
        {selectedTeacher && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-slate-50/50 dark:bg-slate-900 p-4 rounded border border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 bg-prussian text-white flex items-center justify-center font-extrabold text-lg rounded shadow">
                {selectedTeacher.surname.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase">{selectedTeacher.surname}, {selectedTeacher.first}</h4>
                <p className="text-xs font-mono text-slate-400">Employee ID: {selectedTeacher.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
              <div>
                <span className="text-slate-400 font-mono text-[9px] uppercase block">Position:</span>
                <span className="font-bold text-prussian dark:text-slate-100">{selectedTeacher.pos}</span>
              </div>
              <div>
                <span className="text-slate-400 font-mono text-[9px] uppercase block">Level Credentials:</span>
                <span className="font-bold">{selectedTeacher.qual}</span>
              </div>
              <div>
                <span className="text-slate-400 font-mono text-[9px] uppercase block">Contract Term:</span>
                <span className="font-semibold">{selectedTeacher.contract}</span>
              </div>
              <div>
                <span className="text-slate-400 font-mono text-[9px] uppercase block">Study Leave Status:</span>
                <span className={`font-bold uppercase ${selectedTeacher.onStudyLeave === "Yes" ? "text-purple-600" : "text-green-600"}`}>{selectedTeacher.onStudyLeave}</span>
              </div>
              <div>
                <span className="text-slate-400 font-mono text-[9px] uppercase block">ICT Skills:</span>
                <span className="font-semibold text-sea">{selectedTeacher.ict || "None"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-mono text-[9px] uppercase block">Teaching Guidance & Counselling:</span>
                <span className="font-semibold">{selectedTeacher.teachingGuidance || "No"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-mono text-[9px] uppercase block">Subject Teaching Count:</span>
                <span className="font-semibold">{selectedTeacher.numSubjectTeaching || 0}</span>
              </div>
              <div>
                <span className="text-slate-400 font-mono text-[9px] uppercase block">In-Service Training Tracks:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  ICT: {selectedTeacher.trainingIct || "No"} | Guidance: {selectedTeacher.trainingGuidance || "No"} | Mgmt: {selectedTeacher.trainingLeadership || "No"} | Subject: {selectedTeacher.trainingSubject || "No"}
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 border rounded">
              <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500 block mb-2 font-mono">Detailed absence summary</span>
              <ul className="text-xs grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-600 dark:text-slate-400">
                <li>Normal Leave: <strong className="text-slate-800 dark:text-slate-200">{selectedTeacher.absNormalLeave || 0} days</strong></li>
                <li>Leave Augmentation: <strong className="text-slate-800 dark:text-slate-200">{selectedTeacher.absLeaveAugmentation || 0} days</strong></li>
                <li>Special Leave: <strong className="text-slate-800 dark:text-slate-200">{selectedTeacher.absSpecialLeave || 0} days</strong></li>
                <li>Unpaid Leave: <strong className="text-slate-800 dark:text-slate-200">{selectedTeacher.absUnpaidLeave || 0} days</strong></li>
                <li>Unauthorised Leave: <strong className="text-slate-800 dark:text-slate-200">{selectedTeacher.absUnauthorisedLeave || 0} days</strong></li>
                <li>Maternity Leave: <strong className="text-slate-800 dark:text-slate-200">{selectedTeacher.absMaternityLeave || 0} days</strong></li>
                <li>Sick Leave: <strong className="text-slate-800 dark:text-slate-200">{selectedTeacher.absSickLeave || 0} days</strong></li>
                <li>Attending Training/ Workshops: <strong className="text-slate-800 dark:text-slate-200">{selectedTeacher.absAttendingTraining || 0} days</strong></li>
                <li>Other Official Duties: <strong className="text-slate-800 dark:text-slate-200">{selectedTeacher.absAttendingOtherDuties || 0} days</strong></li>
              </ul>
            </div>
          </div>
        )}
      </FormModal>

      {/* Delete Confirmation Modal */}
      <FormModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Confirm Teacher Profile Dismissal"
        onSubmit={(e) => {
          e.preventDefault();
          confirmDelete();
        }}
        submitLabel="Dismiss Staff"
        cancelLabel="Keep"
      >
        <div className="text-center py-4">
          <AlertCircle className="w-12 h-12 text-golden mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Dismiss Instructor from School Registers?</h4>
          <p className="text-xs text-slate-500 mt-2">
            Are you sure you want to remove <strong>{selectedTeacher?.surname}, {selectedTeacher?.first}</strong> (ID: {selectedTeacher?.id})?
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

export default TeachersRegistry;
