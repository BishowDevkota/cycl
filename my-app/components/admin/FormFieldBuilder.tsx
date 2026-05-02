"use client";

import { useState, useCallback } from "react";
import { FormField } from "@/services/vacancy-service";

interface FormFieldBuilderProps {
  fields: FormField[];
  onChange: (fields: FormField[]) => void;
}

export default function FormFieldBuilder({
  fields,
  onChange,
}: FormFieldBuilderProps): React.JSX.Element {
  const [editingId, setEditingId] = useState<string | null>(null);

  const addField = () => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      label: "New Field",
      type: "text",
      required: false,
    };
    onChange([...fields, newField]);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    onChange(
      fields.map((field) =>
        field.id === id ? { ...field, ...updates } : field,
      ),
    );
  };

  const removeField = (id: string) => {
    onChange(fields.filter((field) => field.id !== id));
  };

  const moveField = (id: string, direction: "up" | "down") => {
    const index = fields.findIndex((f) => f.id === id);
    if (
      (direction === "up" && index > 0) ||
      (direction === "down" && index < fields.length - 1)
    ) {
      const newFields = [...fields];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      [newFields[index], newFields[targetIndex]] = [
        newFields[targetIndex],
        newFields[index],
      ];
      onChange(newFields);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-[#d6e6ed] pb-3">
        <h3 className="text-lg font-semibold">Application Form Fields</h3>
        <button
          onClick={addField}
          className="border border-[#0d837f] bg-[#0d837f] px-4 py-2 text-white transition hover:bg-[#08716e]"
        >
          + Add Field
        </button>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="border border-[#d6e6ed] bg-[#f9fcfe] p-4"
          >
            {editingId === field.id ? (
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-semibold uppercase tracking-[0.18em] text-teal-deep">
                    Label
                  </label>
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) =>
                      updateField(field.id, { label: e.target.value })
                    }
                    className="w-full border border-[#cfdfe6] px-3 py-2 outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold uppercase tracking-[0.18em] text-teal-deep">
                    Field Type
                  </label>
                  <select
                    value={field.type}
                    onChange={(e) =>
                      updateField(field.id, {
                        type: e.target.value as FormField["type"],
                      })
                    }
                    className="w-full border border-[#cfdfe6] px-3 py-2 outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
                  >
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="textarea">Textarea</option>
                    <option value="select">Select/Dropdown</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="pdf">PDF Upload</option>
                  </select>
                </div>

                {(field.type === "select" || field.type === "checkbox") && (
                  <div>
                    <label className="mb-1 block text-sm font-semibold uppercase tracking-[0.18em] text-teal-deep">
                      Options (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={field.options?.join(", ") || ""}
                      onChange={(e) =>
                        updateField(field.id, {
                          options: e.target.value
                            .split(",")
                            .map((o) => o.trim())
                            .filter((o) => o),
                        })
                      }
                      placeholder="Option 1, Option 2, Option 3"
                      className="w-full border border-[#cfdfe6] px-3 py-2 outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
                    />
                  </div>
                )}

                {field.type !== "pdf" && (
                  <div>
                    <label className="mb-1 block text-sm font-semibold uppercase tracking-[0.18em] text-teal-deep">
                      Placeholder
                    </label>
                    <input
                      type="text"
                      value={field.placeholder || ""}
                      onChange={(e) =>
                        updateField(field.id, { placeholder: e.target.value })
                      }
                      className="w-full border border-[#cfdfe6] px-3 py-2 outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
                    />
                  </div>
                )}

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) =>
                      updateField(field.id, { required: e.target.checked })
                    }
                  />
                  <span className="text-sm">Required</span>
                </label>

                <button
                  onClick={() => setEditingId(null)}
                  className="border border-green-600 bg-green-600 px-3 py-1 text-sm text-white transition hover:bg-green-700"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium">{field.label}</p>
                  <p className="text-sm text-slate-600">
                    Type: {field.type}
                    {field.required && " • Required"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => moveField(field.id, "up")}
                    disabled={index === 0}
                    className="border border-slate-300 bg-slate-100 px-2 py-1 text-sm text-slate-800 transition disabled:opacity-50"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveField(field.id, "down")}
                    disabled={index === fields.length - 1}
                    className="border border-slate-300 bg-slate-100 px-2 py-1 text-sm text-slate-800 transition disabled:opacity-50"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => setEditingId(field.id)}
                    className="border border-[#123451] bg-[#123451] px-3 py-1 text-sm text-white transition hover:bg-[#0e2b42]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeField(field.id)}
                    className="border border-red-600 bg-red-600 px-3 py-1 text-sm text-white transition hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {fields.length === 0 && (
        <p className="py-4 text-center text-slate-500">
          No fields added. Click "Add Field" to create the application form.
        </p>
      )}
    </div>
  );
}
