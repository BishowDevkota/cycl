"use client";

import { useCallback, useEffect, useState } from "react";
import type { CompanyStats } from "@/lib/company-stats-service";

const FIELD_CONFIG: Array<{
  key: keyof Omit<CompanyStats, "_id" | "createdAt" | "updatedAt">;
  label: string;
  placeholder: string;
}> = [
  {
    key: "numberOfBranchOffice",
    label: "Number of Branch Office",
    placeholder: "124",
  },
  {
    key: "loanOutstandingNpr",
    label: "Loan Outstanding (NPR)",
    placeholder: "NaN",
  },
  {
    key: "numberOfCenters",
    label: "Number of Centers",
    placeholder: "NaN",
  },
  {
    key: "savingDepositNpr",
    label: "Saving & Deposit (NPR)",
    placeholder: "NaN",
  },
  {
    key: "totalStaffIncludingTrainee",
    label: "Total Staff (Including Trainee)",
    placeholder: "497",
  },
  {
    key: "activeClients",
    label: "Number of Active Clients",
    placeholder: "75358",
  },
];

function createEmptyForm(): Omit<CompanyStats, "_id" | "createdAt" | "updatedAt"> {
  return {
    numberOfBranchOffice: "",
    loanOutstandingNpr: "",
    numberOfCenters: "",
    savingDepositNpr: "",
    totalStaffIncludingTrainee: "",
    activeClients: "",
  };
}

export default function CompanyStatsManagement() {
  const [items, setItems] = useState<CompanyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(createEmptyForm());

  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/home/company-stats");
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load company stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void fetchItems();
    }, 0);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [fetchItems]);

  const handleChange = (
    key: keyof Omit<CompanyStats, "_id" | "createdAt" | "updatedAt">,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const hasMissingFields = FIELD_CONFIG.some(({ key }) => {
    const value = String(formData[key] ?? "");
    return !value.trim();
  });

  const handleSave = async () => {
    if (hasMissingFields) {
      setError("All company stats fields are required");
      return;
    }

    try {
      const url = editingId
        ? `/api/admin/home/company-stats?id=${editingId}`
        : "/api/admin/home/company-stats";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to save");
      }

      setError("");
      setFormData(createEmptyForm());
      setEditingId(null);
      await fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save company stats");
    }
  };

  const handleEdit = (item: CompanyStats) => {
    setEditingId(item._id?.toString() || null);
    setFormData({
      numberOfBranchOffice: item.numberOfBranchOffice ?? "",
      loanOutstandingNpr: item.loanOutstandingNpr ?? "",
      numberOfCenters: item.numberOfCenters ?? "",
      savingDepositNpr: item.savingDepositNpr ?? "",
      totalStaffIncludingTrainee: item.totalStaffIncludingTrainee ?? "",
      activeClients: item.activeClients ?? "",
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;

    try {
      const response = await fetch(`/api/admin/home/company-stats?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete");
      }

      setError("");
      await fetchItems();
    } catch {
      setError("Failed to delete company stats");
    }
  };

  const handleNew = () => {
    setEditingId(null);
    setFormData(createEmptyForm());
  };

  if (loading) {
    return <div className="p-6">Loading company stats...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="mb-2 text-3xl font-bold">Manage Company Stats</h1>
      <p className="mb-6 text-sm text-gray-600">
        Create and update the public company statistics section.
      </p>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">
            {editingId ? "Edit Company Stats" : "Create Company Stats"}
          </h2>

          <div className="space-y-4">
            {FIELD_CONFIG.map((field) => (
              <div key={field.key}>
                <label className="mb-1 block text-sm font-medium">
                  {field.label}
                </label>
                <input
                  type="text"
                  value={formData[field.key] ?? ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  placeholder={field.placeholder}
                />
              </div>
            ))}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-700"
              >
                {editingId ? "Update" : "Create"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleNew}
                  className="flex-1 rounded-lg bg-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-400"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Saved Records</h2>

          {items.length === 0 ? (
            <p className="text-gray-500">No company stats created yet.</p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item._id?.toString()} className="rounded-lg border border-gray-200 p-4">
                  <div className="grid grid-cols-1 gap-2 text-sm text-gray-700 sm:grid-cols-2">
                    <p><span className="font-medium">Number of Branch Office:</span> {item.numberOfBranchOffice}</p>
                    <p><span className="font-medium">Loan Outstanding (NPR):</span> {item.loanOutstandingNpr}</p>
                    <p><span className="font-medium">Number of Centers:</span> {item.numberOfCenters}</p>
                    <p><span className="font-medium">Saving & Deposit (NPR):</span> {item.savingDepositNpr}</p>
                    <p><span className="font-medium">Total Staff (Including Trainee):</span> {item.totalStaffIncludingTrainee}</p>
                    <p><span className="font-medium">Active Clients:</span> {item.activeClients}</p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="flex-1 rounded bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item._id?.toString() || "")}
                      className="flex-1 rounded bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}