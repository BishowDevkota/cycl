"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Vacancy } from "@/services/vacancy-service";

export default function AdminVacanciesPage(): React.JSX.Element {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const response = await fetch("/api/admin/vacancies");
        if (!response.ok) {
          setError("Failed to load vacancies");
          return;
        }
        const data = await response.json();
        setVacancies(data);
      } catch (err) {
        console.error(err);
        setError("An error occurred");
      } finally {
        setLoading(false);
      }
    };

    void fetchVacancies();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vacancy? All applications will be deleted.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/vacancies/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        alert("Failed to delete vacancy");
        return;
      }

      setVacancies(vacancies.filter((v) => v._id?.toString() !== id));
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading vacancies...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#d6e6ed] pb-4">
        <div>
          <h1 className="text-3xl font-bold text-[#123451]">Job Vacancies</h1>
          <p className="mt-1 text-sm text-slate-600">Manage open roles, application forms, and applicant records.</p>
        </div>
        <Link
          href="/admin/vacancies/create"
          className="border border-[#0d837f] bg-[#0d837f] px-6 py-2 text-white transition hover:bg-[#08716e]"
        >
          + Create Vacancy
        </Link>
      </div>

      {error && (
        <div className="border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {vacancies.length === 0 ? (
        <div className="border border-[#d6e6ed] bg-white py-12 text-center text-slate-500">
          <p className="mb-4">No vacancies found.</p>
          <Link
            href="/admin/vacancies/create"
            className="font-semibold text-teal-deep underline decoration-[#f5ad4a] underline-offset-4"
          >
            Create your first vacancy
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {vacancies.map((vacancy) => (
            <div
              key={vacancy._id?.toString()}
              className="border border-[#d6e6ed] bg-white p-6 transition hover:border-[#bcd7e2]"
            >
              <div className="mb-3 flex items-start justify-between border-l-4 border-[#f5ad4a] pl-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-[#123451]">{vacancy.title}</h3>
                  <p className="text-slate-600">
                    {vacancy.department} • {vacancy.location}
                  </p>
                </div>
                <span
                  className={`border px-3 py-1 text-sm font-medium ${
                    vacancy.isActive
                      ? "border-green-200 bg-green-50 text-green-800"
                      : "border-slate-200 bg-slate-50 text-slate-800"
                  }`}
                >
                  {vacancy.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <p className="mb-4 line-clamp-2 text-slate-700">
                {vacancy.description}
              </p>

              <div className="flex justify-end gap-2">
                <Link
                  href={`/admin/vacancies/${vacancy._id?.toString()}/applicants`}
                  className="border border-[#0d837f] bg-[#0d837f] px-4 py-2 text-sm text-white transition hover:bg-[#08716e]"
                >
                  View Applicants
                </Link>
                <Link
                  href={`/admin/vacancies/${vacancy._id?.toString()}/edit`}
                  className="border border-[#123451] bg-[#123451] px-4 py-2 text-sm text-white transition hover:bg-[#0e2b42]"
                >
                  Edit
                </Link>
                <button
                  onClick={() =>
                    void handleDelete(vacancy._id?.toString() || "")
                  }
                  className="border border-red-600 bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
