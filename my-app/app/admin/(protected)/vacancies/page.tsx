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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Job Vacancies</h1>
        <Link
          href="/admin/vacancies/create"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Create Vacancy
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {vacancies.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-4">No vacancies found.</p>
          <Link
            href="/admin/vacancies/create"
            className="text-blue-600 hover:underline"
          >
            Create your first vacancy
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {vacancies.map((vacancy) => (
            <div
              key={vacancy._id?.toString()}
              className="border rounded-lg p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{vacancy.title}</h3>
                  <p className="text-gray-600">
                    {vacancy.department} • {vacancy.location}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    vacancy.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {vacancy.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <p className="text-gray-700 mb-4 line-clamp-2">
                {vacancy.description}
              </p>

              <div className="flex gap-2 justify-end">
                <Link
                  href={`/admin/vacancies/${vacancy._id?.toString()}/applicants`}
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  View Applicants
                </Link>
                <Link
                  href={`/admin/vacancies/${vacancy._id?.toString()}/edit`}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Edit
                </Link>
                <button
                  onClick={() =>
                    void handleDelete(vacancy._id?.toString() || "")
                  }
                  className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
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
