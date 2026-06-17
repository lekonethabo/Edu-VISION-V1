"use client";

import React from "react";
import { TableActionButtons } from "./ActionButtons";

export interface ColumnConfig<T> {
  header: string;
  accessorKey?: keyof T | string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T extends { id: string }> {
  columns: ColumnConfig<T>[];
  data: T[];
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  emptyMessage?: string;
  id?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  onView,
  onEdit,
  onDelete,
  emptyMessage = "No records found.",
  id = "data-table"
}: DataTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto border border-slate-100 dark:border-slate-800 rounded bg-white dark:bg-ink shadow-sm">
      <table id={id} className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-semibold uppercase text-xs tracking-wider">
            {columns.map((col, index) => (
              <th
                key={index}
                className={`py-3 px-4 font-semibold text-xs border-b border-slate-200 dark:border-slate-800 ${col.className || ""}`}
              >
                {col.header}
              </th>
            ))}
            {(onView || onEdit || onDelete) && (
              <th className="py-3 px-4 font-semibold text-xs text-right border-b border-slate-200 dark:border-slate-800 w-32">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + ((onView || onEdit || onDelete) ? 1 : 0)}
                className="py-12 px-4 text-center text-slate-400 dark:text-slate-500 italic bg-slate-50/50 dark:bg-slate-950/20"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr
                key={item.id || rowIndex}
                className="hover:bg-slate-50/70 dark:hover:bg-slate-900/30 transition-colors"
                id={`row-${item.id || rowIndex}`}
              >
                {columns.map((col, colIndex) => {
                  let cellContent: React.ReactNode = "";
                  if (col.render) {
                    cellContent = col.render(item);
                  } else if (col.accessorKey) {
                    const val = item[col.accessorKey as keyof T];
                    if (val !== undefined && val !== null) {
                      if (Array.isArray(val)) {
                        cellContent = val.join(", ");
                      } else {
                        cellContent = String(val);
                      }
                    }
                  }
                  return (
                    <td
                      key={colIndex}
                      className={`py-3.5 px-4 text-slate-700 dark:text-slate-300 ${col.className || ""}`}
                    >
                      {cellContent}
                    </td>
                  );
                })}
                {(onView || onEdit || onDelete) && (
                  <td className="py-3 px-4 text-right align-middle">
                    <div className="flex justify-end">
                      <TableActionButtons
                        id={item.id}
                        onView={onView ? () => onView(item) : undefined}
                        onEdit={onEdit ? () => onEdit(item) : undefined}
                        onDelete={onDelete ? () => onDelete(item) : undefined}
                      />
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
