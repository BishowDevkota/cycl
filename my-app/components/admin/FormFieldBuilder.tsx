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
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Application Form Fields</h3>
        <button
          onClick={addField}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Field
        </button>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="border rounded-lg p-4 bg-gray-50"
          >
            {editingId === field.id ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Label
                  </label>
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) =>
                      updateField(field.id, { label: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Field Type
                  </label>
                  <select
                    value={field.type}
                    onChange={(e) =>
                      updateField(field.id, {
                        type: e.target.value as FormField["type"],
                      })
                    }
                    className="w-full px-3 py-2 border rounded"
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
                    <label className="block text-sm font-medium mb-1">
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
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                )}

                {field.type !== "pdf" && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Placeholder
                    </label>
                    <input
                      type="text"
                      value={field.placeholder || ""}
                      onChange={(e) =>
                        updateField(field.id, { placeholder: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded"
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
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium">{field.label}</p>
                  <p className="text-sm text-gray-600">
                    Type: {field.type}
                    {field.required && " • Required"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => moveField(field.id, "up")}
                    disabled={index === 0}
                    className="px-2 py-1 text-sm bg-gray-300 rounded disabled:opacity-50"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveField(field.id, "down")}
                    disabled={index === fields.length - 1}
                    className="px-2 py-1 text-sm bg-gray-300 rounded disabled:opacity-50"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => setEditingId(field.id)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeField(field.id)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
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
        <p className="text-center text-gray-500 py-4">
          No fields added. Click "Add Field" to create the application form.
        </p>
      )}
    </div>
  );
}
