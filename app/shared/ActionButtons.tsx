"use client";

import React from "react";
import { Plus, Check, X, Eye, Edit, Trash2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export const AddButton: React.FC<ButtonProps> = ({ label = "Add New", ...props }) => {
  return (
    <button
      type="button"
      id={`btn-add-${label.toLowerCase().replace(/\s+/g, "-")}`}
      className="inline-flex items-center gap-2 bg-prussian hover:bg-[#001c3d] text-white font-medium text-sm px-4 py-2 rounded shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-prussian focus:ring-offset-2 active:scale-98"
      {...props}
    >
      <Plus className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
};

export const SaveButton: React.FC<ButtonProps> = ({ label = "Save", ...props }) => {
  return (
    <button
      type="submit"
      id="btn-modal-save"
      className="inline-flex items-center gap-2 bg-sea hover:bg-[#008a8a] text-white font-medium text-sm px-5 py-2.5 rounded shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-sea focus:ring-offset-2 active:scale-98"
      {...props}
    >
      <Check className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
};

export const CancelButton: React.FC<ButtonProps> = ({ label = "Cancel", ...props }) => {
  return (
    <button
      type="button"
      id="btn-modal-cancel"
      className="inline-flex items-center gap-2 border border-slate-300 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-sm px-5 py-2.5 rounded transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-slate-400 active:scale-98"
      {...props}
    >
      <X className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
};

export const DeleteConfirmButton: React.FC<ButtonProps> = ({ label = "Yes, Delete", ...props }) => {
  return (
    <button
      type="button"
      id="btn-delete-confirm"
      className="inline-flex items-center gap-2 bg-golden hover:bg-[#7e5108] text-white font-medium text-sm px-5 py-2.5 rounded shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-golden focus:ring-offset-2 active:scale-98"
      {...props}
    >
      <Trash2 className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
};

interface TableActionProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  id?: string;
}

export const TableActionButtons: React.FC<TableActionProps> = ({
  onView,
  onEdit,
  onDelete,
  id = ""
}) => {
  return (
    <div className="flex items-center gap-1.5 focus:outline-none" id={`actions-${id}`}>
      {onView && (
        <button
          onClick={onView}
          type="button"
          title="View Details"
          id={`btn-view-${id}`}
          className="p-1.5 rounded text-sea hover:bg-sea/10 dark:text-teal-400 dark:hover:bg-teal-400/20 transition-colors focus:ring-2 focus:ring-sea/50"
        >
          <Eye className="w-4 h-4" />
        </button>
      )}
      {onEdit && (
        <button
          onClick={onEdit}
          type="button"
          title="Edit Record"
          id={`btn-edit-${id}`}
          className="p-1.5 rounded text-prussian hover:bg-prussian/10 dark:text-sky-400 dark:hover:bg-sky-400/20 transition-colors focus:ring-0.5 focus:ring-prussian/50"
        >
          <Edit className="w-4 h-4" />
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          type="button"
          title="Delete Record"
          id={`btn-delete-${id}`}
          className="p-1.5 rounded text-golden hover:bg-golden/10 dark:text-amber-500 dark:hover:bg-amber-500/20 transition-colors focus:ring-2 focus:ring-golden/50"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
