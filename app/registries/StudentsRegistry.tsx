"use client";

import React, { useState } from "react";
import { AlertCircle, FileText, Award, Layers, Sparkles } from "lucide-react";
import { Student } from "../types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useFilters } from "@/hooks/useFilters";
import { INITIAL_STUDENTS } from "../constants";
import { SectionContainer } from "../shared/SectionContainer";
import { FilterBar } from "../shared/FilterBar";
import { DataTable, ColumnConfig } from "../shared/DataTable";
import { FormModal } from "../shared/FormModal";
import { AddButton } from "../shared/ActionButtons";

// Options arrays representing standard ministry options
const STD_OPTIONS = ["Std 1", "Std 2", "Std 3", "Std 4", "Std 5", "Std 6", "Std 7"];
const ENROL_OPTIONS = [
  "N - First Entrant Citizen",
  "RP - Returning on Promotion",
  "R - Repeater",
  "T - Transfer",
  "NC - First Entrant Non-Citizen"
];
const SOCIAL_OPTIONS = ["Ordinary", "Needy", "Orphan", "OVC", "Vulnerability"];
const OVC_SUPPORT_OPTIONS = ["NONE", "Uniform", "Feeding", "Counseling", "Transport", "Stationery"];
const SEND_OPTIONS = [
  "NONE",
  "Physical Disability",
  "Visual Impairment",
  "Hearing Impairment",
  "Intellectual Disability",
  "Speech and Language Disorder",
  "Specific Learning Difficulty"
];
const SEND_SERVICES_OPTIONS = ["NONE", "Speech Therapy", "Occupational Therapy", "Sign Language", "Adaptive Tech"];

export const StudentsRegistry: React.FC = () => {
  // 1. Storage & Persistence
  const { items, addItem, updateItem, deleteItem } = useLocalStorage<Student>(
    "students",
    INITIAL_STUDENTS
  );

  // 2. UI States
  const [modalOpen, setModalOpen] = useState(false);
  const [dossierOpen, setDossierOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // 3. Form Field State
  const [formData, setFormData] = useState<Partial<Student>>({});

  // 4. Listing Filters via useFilters hook
  const {
    searchQuery,
    setSearchQuery,
    activeFilters,
    setFilterVal,
    clearFilters,
    filteredItems
  } = useFilters<Student>(
    items,
    ["id", "surname", "first"],
    { std: "All", sex: "All", board: "All" }
  );

  // Trigger alert notifications helper
  const triggerAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  // Prepare standard Filter bar selectors
  const filterConfigs = [
    {
      key: "std",
      label: "Standard",
      value: activeFilters.std || "All",
      options: STD_OPTIONS,
      onChange: (val: string) => setFilterVal("std", val)
    },
    {
      key: "sex",
      label: "Gender",
      value: activeFilters.sex || "All",
      options: ["Male", "Female"],
      onChange: (val: string) => setFilterVal("sex", val)
    },
    {
      key: "board",
      label: "Boarding",
      value: activeFilters.board || "All",
      options: ["Yes", "No"],
      onChange: (val: string) => setFilterVal("board", val)
    }
  ];

  // Table Columns Setup
  const columns: ColumnConfig<Student>[] = [
    {
      header: "National ID / Passport",
      accessorKey: "id",
      className: "font-mono font-bold text-sea"
    },
    {
      header: "Full Name",
      render: (st) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-slate-100 truncate uppercase block">
            {st.surname}
          </span>
          <span className="text-slate-500 dark:text-slate-400 text-xs block">{st.first}</span>
        </div>
      )
    },
    {
      header: "Demographics",
      render: (st) => (
        <div className="flex flex-col gap-0.5">
          <span
            className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold inline-block self-start ${
              st.sex === "Female"
                ? "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"
                : "bg-blue-500/10 text-blue-600 dark:bg-sky-500/20 dark:text-sky-400"
            }`}
          >
            {st.sex}
          </span>
          <span className="text-[10px] opacity-75">{st.nat || "Botswana"}</span>
        </div>
      )
    },
    {
      header: "Birth Date",
      accessorKey: "dob",
      className: "font-mono text-[11px]"
    },
    {
      header: "Standard",
      render: (st) => (
        <div>
          <span className="font-bold text-slate-800 dark:text-slate-100">{st.std}</span>
          <span className="text-[9px] text-sea font-mono block uppercase">
            {st.shifting || "Full Day"}
          </span>
        </div>
      )
    },
    {
      header: "Status Flags",
      render: (st) => (
        <div className="flex flex-col gap-1 items-start">
          <span className={`text-[8.5px] font-bold px-1 py-0.5 rounded ${
            st.board === "Yes" 
              ? "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300" 
              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          }`}>
            BOARD: {st.board || "No"}
          </span>
          <span className={`text-[8.5px] font-bold px-1 py-0.5 rounded ${
            st.prePrimary === "Yes" 
              ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300" 
              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          }`}>
            PRE-PRIM: {st.prePrimary || "No"}
          </span>
        </div>
      )
    },
    {
      header: "Welfare & OVC",
      render: (st) => {
        const socialList = Array.isArray(st.social) 
          ? st.social 
          : (st.social ? [st.social] : ["Ordinary"]);
        const ovcList = Array.isArray(st.supportOvc) 
          ? st.supportOvc 
          : (st.supportOvc ? [st.supportOvc] : ["NONE"]);
        
        return (
          <div className="space-y-1 text-[10px]">
            <div>
              <span className="text-slate-400 uppercase font-mono text-[8px] block">Social:</span>
              <div className="flex flex-wrap gap-0.5">
                {socialList.map(item => (
                  <span key={item} className="px-1 bg-amber-500/10 text-amber-700 rounded font-semibold">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            {ovcList[0] !== "NONE" && (
              <div>
                <span className="text-slate-400 uppercase font-mono text-[8px] block">OVC Benefits:</span>
                <span className="px-1 bg-indigo-50 text-indigo-700 rounded font-semibold">
                  {ovcList.join(", ")}
                </span>
              </div>
            )}
          </div>
        );
      }
    },
    {
      header: "Special Needs (SEN)",
      render: (st) => (
        <div>
          {st.specialNeeds === "Yes" ? (
            <div className="text-[10px] space-y-0.5">
              <span className="px-1.5 py-0.5 rounded text-[8.5px] font-bold bg-red-100 text-red-700 uppercase">
                Active
              </span>
              <div className="text-[9.5px] text-slate-600">
                <span className="font-semibold text-slate-500">SEND:</span>{" "}
                {Array.isArray(st.typeOfSend) ? st.typeOfSend.join(", ") : st.typeOfSend || "General"}
              </div>
            </div>
          ) : (
            <span className="text-[10px] text-slate-400">Ordinary</span>
          )}
        </div>
      )
    }
  ];

  // Add/Edit Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.surname || !formData.first) {
      triggerAlert("National ID/Passport, Surname, and First Names are required.", "error");
      return;
    }

    const compiled: Student = {
      id: formData.id,
      surname: String(formData.surname).toUpperCase(),
      first: formData.first || "",
      nat: formData.nat || "Botswana",
      sex: formData.sex || "Female",
      dob: formData.dob || "2015-01-01",
      std: formData.std || "Std 1",
      enrol: formData.enrol || "N - First Entrant Citizen",
      board: formData.board || "No",
      shifting: formData.shifting || "Full Day",
      prePrimary: formData.prePrimary || "Yes",
      specialNeeds: formData.specialNeeds || "No",
      social: formData.social || ["Ordinary"],
      supportOvc: formData.supportOvc || ["NONE"],
      typeOfSend: formData.typeOfSend || ["NONE"],
      supportServicesSend: formData.supportServicesSend || ["NONE"]
    };

    const exists = items.some((item) => item.id === compiled.id);
    if (selectedStudent) {
      // Edit Mode
      updateItem(compiled);
      triggerAlert(`Student record ${compiled.id} updated successfully.`, "success");
    } else {
      // Add Mode
      if (exists) {
        triggerAlert(`A student with ID ${compiled.id} already exists.`, "error");
        return;
      }
      addItem(compiled);
      triggerAlert(`New student profile ${compiled.id} registered.`, "success");
    }

    setModalOpen(false);
    setSelectedStudent(null);
    setFormData({});
  };

  const handleEditClick = (st: Student) => {
    setSelectedStudent(st);
    setFormData(st);
    setModalOpen(true);
  };

  const handleViewClick = (st: Student) => {
    setSelectedStudent(st);
    setDossierOpen(true);
  };

  const handleDeleteClick = (st: Student) => {
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

  // Helper to handle array selection on form fields (Social Status, Support Ovens, sendTypes)
  const toggleArrayField = (field: keyof Student, value: string) => {
    const current = Array.isArray(formData[field])
      ? (formData[field] as string[])
      : formData[field]
        ? [formData[field] as string]
        : [];
        
    let next: string[] = [];
    if (current.includes(value)) {
      next = current.filter((v) => v !== value);
    } else {
      next = [...current, value];
    }
    
    setFormData((prev) => ({
      ...prev,
      [field]: next
    }));
  };

  return (
    <div className="space-y-6" id="students-registry-section">
      {/* Alert Banner */}
      {alert && (
        <div
          id="alert-banner"
          className={`p-4 rounded border flex items-center gap-3 text-sm font-medium ${
            alert.type === "success"
              ? "bg-sea/10 border-sea text-sea"
              : "bg-golden/10 border-golden text-golden"
          }`}
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{alert.message}</span>
        </div>
      )}

      {/* Primary Container */}
      <SectionContainer
        title="Student Statistics Registry"
        description="Statutory primary school enrolment tracker detailing demographic metrics, social welfare profiles, boarding statuses, and Special Educational Needs (SEN/SEND)."
        action={
          <AddButton
            label="Add New Student"
            onClick={() => {
              setSelectedStudent(null);
              setFormData({ sex: "Female", board: "No", shifting: "Full Day", prePrimary: "Yes", specialNeeds: "No" });
              setModalOpen(true);
            }}
          />
        }
      >
        {/* Reusable Filters Bar */}
        <FilterBar
          searchPlaceholder="Search student ID, surname, or first name..."
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filterConfigs}
          onClear={clearFilters}
        />

        {/* Dynamic Data Table */}
        <DataTable
          columns={columns}
          data={filteredItems}
          onView={handleViewClick}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          emptyMessage="No enrolled student records found matching the active filters."
        />
      </SectionContainer>

      {/* Add / Edit Form Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedStudent ? "Edit Student Details" : "Register New Student Profile"}
        onSubmit={handleSubmit}
        size="3xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Identity Fields */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              National ID / Passport ID *
            </label>
            <input
              type="text"
              required
              disabled={!!selectedStudent}
              value={formData.id || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, id: e.target.value }))}
              placeholder="e.g. 985816825"
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded focus:ring-1 focus:ring-prussian"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Nationality *
            </label>
            <input
              type="text"
              required
              value={formData.nat || "Botswana"}
              onChange={(e) => setFormData((prev) => ({ ...prev, nat: e.target.value }))}
              placeholder="Botswana"
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded focus:ring-1 focus:ring-prussian"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Surname *
            </label>
            <input
              type="text"
              required
              value={formData.surname || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, surname: e.target.value }))}
              placeholder="e.g. SANE"
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded focus:ring-1 focus:ring-prussian uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              First Names *
            </label>
            <input
              type="text"
              required
              value={formData.first || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, first: e.target.value }))}
              placeholder="e.g. KEOOBAMETSE ROSE"
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded focus:ring-1 focus:ring-prussian"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Gender *
            </label>
            <select
              value={formData.sex || "Female"}
              onChange={(e) => setFormData((prev) => ({ ...prev, sex: e.target.value as any }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded focus:ring-1 focus:ring-prussian"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Date of Birth *
            </label>
            <input
              type="date"
              required
              value={formData.dob || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, dob: e.target.value }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded focus:ring-1 focus:ring-prussian"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Standard Grade *
            </label>
            <select
              value={formData.std || "Std 1"}
              onChange={(e) => setFormData((prev) => ({ ...prev, std: e.target.value }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded focus:ring-1 focus:ring-prussian"
            >
              {STD_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Shifting Division
            </label>
            <select
              value={formData.shifting || "Full Day"}
              onChange={(e) => setFormData((prev) => ({ ...prev, shifting: e.target.value as any }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
            >
              <option value="Full Day">Full Day</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Boarding Class Status
            </label>
            <select
              value={formData.board || "No"}
              onChange={(e) => setFormData((prev) => ({ ...prev, board: e.target.value as any }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
            >
              <option value="No">No (Day student)</option>
              <option value="Yes">Yes (Residing Boarder)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Attended Pre-Primary?
            </label>
            <select
              value={formData.prePrimary || "Yes"}
              onChange={(e) => setFormData((prev) => ({ ...prev, prePrimary: e.target.value as any }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Enrolment Classification Status *
            </label>
            <select
              value={formData.enrol || "N - First Entrant Citizen"}
              onChange={(e) => setFormData((prev) => ({ ...prev, enrol: e.target.value }))}
              className="w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
            >
              {ENROL_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Social Welfare Multi-check */}
          <div className="md:col-span-2 border-t border-slate-100 dark:border-slate-800 pt-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Social Status / Welfare Categories (Check all that apply)
            </label>
            <div className="flex flex-wrap gap-3">
              {SOCIAL_OPTIONS.map((social) => {
                const checked = Array.isArray(formData.social)
                  ? formData.social.includes(social)
                  : formData.social === social;
                return (
                  <label key={social} className="inline-flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleArrayField("social", social)}
                      className="rounded text-prussian focus:ring-prussian w-4 h-4"
                    />
                    <span>{social}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* OVC benefits Multi-check */}
          <div className="md:col-span-2 border-t border-slate-100 dark:border-slate-800 pt-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Provided Support benefits for OVCs
            </label>
            <div className="flex flex-wrap gap-3">
              {OVC_SUPPORT_OPTIONS.map((ovc) => {
                const checked = Array.isArray(formData.supportOvc)
                  ? formData.supportOvc.includes(ovc)
                  : formData.supportOvc === ovc;
                return (
                  <label key={ovc} className="inline-flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleArrayField("supportOvc", ovc)}
                      className="rounded text-prussian focus:ring-prussian w-4 h-4"
                    />
                    <span>{ovc}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Special Needs Section */}
          <div className="md:col-span-2 border-t border-slate-100 dark:border-slate-800 pt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Has Special Education Needs (SEN)?
              </label>
              <select
                value={formData.specialNeeds || "No"}
                onChange={(e) => setFormData((prev) => ({ ...prev, specialNeeds: e.target.value as any }))}
                className="text-xs p-1 px-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

            {formData.specialNeeds === "Yes" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="block text-[11px] font-bold uppercase text-slate-400 mb-2">
                    Primary Type of SEND
                  </span>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {SEND_OPTIONS.map((opt) => {
                      const checked = Array.isArray(formData.typeOfSend)
                        ? formData.typeOfSend.includes(opt)
                        : formData.typeOfSend === opt;
                      return (
                        <label key={opt} className="flex items-center gap-2 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleArrayField("typeOfSend", opt)}
                            className="rounded text-prussian focus:ring-prussian w-3.5 h-3.5"
                          />
                          <span>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <span className="block text-[11px] font-bold uppercase text-slate-400 mb-2">
                    Support Services Allocated
                  </span>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {SEND_SERVICES_OPTIONS.map((services) => {
                      const checked = Array.isArray(formData.supportServicesSend)
                        ? formData.supportServicesSend.includes(services)
                        : formData.supportServicesSend === services;
                      return (
                        <label key={services} className="flex items-center gap-2 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleArrayField("supportServicesSend", services)}
                            className="rounded text-prussian focus:ring-prussian w-3.5 h-3.5"
                          />
                          <span>{services}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </FormModal>

      {/* View Dossier FormModal */}
      <FormModal
        isOpen={dossierOpen}
        onClose={() => setDossierOpen(false)}
        title="Student Permanent Record Dossier"
        onSubmit={(e) => {
          e.preventDefault();
          setDossierOpen(false);
        }}
        submitLabel="Close Dossier"
        cancelLabel="Print"
      >
        {selectedStudent && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 p-4 border rounded">
              <div className="w-12 h-12 rounded bg-prussian flex items-center justify-center text-white font-black text-xl shadow-md">
                {selectedStudent.surname.charAt(0)}
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 uppercase">
                  {selectedStudent.surname}, {selectedStudent.first}
                </h4>
                <p className="text-xs font-mono text-sea mt-0.5">
                  ID: {selectedStudent.id}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5 text-xs text-slate-700 dark:text-slate-300">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono block uppercase">Gender:</span>
                <span className="font-bold text-xs">{selectedStudent.sex}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono block uppercase">Nationality:</span>
                <span className="font-bold text-xs">{selectedStudent.nat}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono block uppercase">Date of Birth:</span>
                <span className="font-bold text-xs font-mono">{selectedStudent.dob}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono block uppercase">Academic Placement:</span>
                <span className="font-bold text-xs">{selectedStudent.std} ({selectedStudent.shifting || "Full Day"})</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono block uppercase">Boarding status:</span>
                <span className="font-bold text-xs">{selectedStudent.board === "Yes" ? "Boarder (In-Campus)" : "Day Student (Out-Campus)"}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono block uppercase">Pre-Primary Class:</span>
                <span className="font-bold text-xs">{selectedStudent.prePrimary === "Yes" ? "Attended" : "No Attendance"}</span>
              </div>
              <div className="sm:col-span-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded border border-slate-100 dark:border-[#202B19]">
                <span className="text-[10px] text-slate-400 font-mono block uppercase">Enrolment Entry Basis:</span>
                <span className="font-semibold text-xs text-prussian dark:text-slate-200">{selectedStudent.enrol}</span>
              </div>
            </div>

            {/* Welfare Block */}
            <div className="p-4 bg-amber-50 dark:bg-amber-950/10 border border-amber-200 dark:border-amber-900/40 rounded text-xs">
              <h5 className="font-bold text-amber-800 dark:text-amber-500 uppercase tracking-wider text-[10px] mb-2 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                <span>Welfare & Social Development status</span>
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {(Array.isArray(selectedStudent.social) ? selectedStudent.social : [selectedStudent.social || "Ordinary"]).map((s) => (
                  <span key={String(s)} className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-400 font-bold rounded">
                    {String(s)}
                  </span>
                ))}
              </div>
              <div className="mt-3">
                <span className="text-slate-400 font-mono text-[9px] uppercase tracking-wider block">Assigned Assistance OVC benefits:</span>
                <div className="font-semibold text-xs mt-1 text-slate-700 dark:text-slate-300">
                  {Array.isArray(selectedStudent.supportOvc) ? selectedStudent.supportOvc.join(", ") : selectedStudent.supportOvc || "NONE"}
                </div>
              </div>
            </div>

            {/* SEND Details if affirmative */}
            <div className="p-4 bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/40 rounded text-xs">
              <h5 className="font-bold text-red-800 dark:text-red-500 uppercase tracking-wider text-[10px] mb-2 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 animate-pulse" />
                <span>Special educational Needs & Support (SEN)</span>
              </h5>
              {selectedStudent.specialNeeds === "Yes" ? (
                <div className="space-y-2 mt-1">
                  <div>
                    <span className="text-slate-400 font-mono text-[9px] uppercase block">Diagnosed SEND category:</span>
                    <span className="font-bold text-red-700 dark:text-red-400 text-xs">
                      {Array.isArray(selectedStudent.typeOfSend) ? selectedStudent.typeOfSend.join(", ") : selectedStudent.typeOfSend || "General"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-mono text-[9px] uppercase block">Assigned Therapist/Support services:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {Array.isArray(selectedStudent.supportServicesSend) ? selectedStudent.supportServicesSend.join(", ") : selectedStudent.supportServicesSend || "NONE"}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 italic text-xs">No active Special Needs profiles registered for this student.</p>
              )}
            </div>
          </div>
        )}
      </FormModal>

      {/* Delete Confirmation FormModal (styled using Golden Earth #97620C as confirmation color) */}
      <FormModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Confirm Record Deletion"
        onSubmit={(e) => {
          e.preventDefault();
          confirmDelete();
        }}
        submitLabel="Delete Student Profile"
        cancelLabel="Discard"
      >
        <div className="text-center py-4">
          <AlertCircle className="w-12 h-12 text-golden mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Are you absolutely sure you want to delete this student record?
          </h4>
          <p className="text-xs text-slate-500 mt-2">
            This action is irreversible. It will delete the permanent statistics entry for student{" "}
            <strong>
              {selectedStudent?.surname}, {selectedStudent?.first} (ID: {selectedStudent?.id})
            </strong>{" "}
            from the Ministry database.
          </p>
          <div className="mt-4 p-3 bg-golden/10 border border-golden rounded text-left flex items-center gap-2 text-golden">
            <span className="text-xs font-semibold">
              Warning: Delete actions will overwrite local database state permanently.
            </span>
          </div>
        </div>
      </FormModal>
    </div>
  );
};

export default StudentsRegistry;
