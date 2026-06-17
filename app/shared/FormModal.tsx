"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { SaveButton, CancelButton } from "./ActionButtons";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  children: React.ReactNode;
  id?: string;
  size?: "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
}

export const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  title,
  onSubmit,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  isSubmitting = false,
  children,
  id = "form-modal",
  size = "2xl"
}) => {
  const sizeClasses = {
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl"
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/50 dark:bg-black/75 backdrop-blur-xs cursor-pointer"
            id={`${id}-backdrop`}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", duration: 0.3 }}
            className={`bg-white dark:bg-ink w-full ${sizeClasses[size] || "max-w-2xl"} rounded-lg shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800 z-50`}
            id={`${id}-content`}
          >
            {/* Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
              <h3 className="text-base font-bold text-prussian dark:text-slate-100 uppercase tracking-tight">
                {title}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 rounded-full transition-colors focus:outline-none"
                id={`btn-close-modal-${id}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="flex flex-col max-h-[80vh]">
              {/* Scrollable Body */}
              <div className="p-6 overflow-y-auto flex-1 text-sm text-slate-700 dark:text-slate-300">
                {children}
              </div>

              {/* Footer Actions */}
              <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/30 flex items-center justify-end gap-3">
                <CancelButton label={cancelLabel} onClick={onClose} disabled={isSubmitting} />
                <SaveButton label={isSubmitting ? "Saving..." : submitLabel} disabled={isSubmitting} />
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FormModal;
