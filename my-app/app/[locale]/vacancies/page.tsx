"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Vacancy } from "@/services/vacancy-service";

export default function VacanciesPage(): React.JSX.Element {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("");

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const response = await fetch("/api/vacancies");
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

  const filteredVacancies = vacancies.filter((vacancy) => {
    const matchesSearch =
      vacancy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vacancy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vacancy.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = !filterDept || vacancy.department === filterDept;

    return matchesSearch && matchesDept;
  });

  const departments = Array.from(
    new Set(vacancies.map((v) => v.department))
  );

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Loading vacancies...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Open Positions</h1>
        <p className="text-gray-600">
          {filteredVacancies.length} job{
            filteredVacancies.length !== 1 ? "s" : ""
          } available
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Search Jobs
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, location..."
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Filter by Department
            </label>
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredVacancies.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-4">No vacancies found matching your criteria.</p>
          {searchTerm || filterDept ? (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterDept("");
              }}
              className="text-blue-600 hover:underline"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredVacancies.map((vacancy) => (
            <div
              key={vacancy._id?.toString()}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
            >
              <div className="mb-3">
                <h2 className="text-2xl font-bold text-gray-900">
                  {vacancy.title}
                </h2>
                <p className="text-gray-600">
                  {vacancy.department} • {vacancy.location}
                </p>
              </div>

              <p className="text-gray-700 mb-4 line-clamp-3">
                {vacancy.description}
              </p>

              <div className="flex flex-wrap gap-3 mb-4">
                {vacancy.salary && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {vacancy.salary}
                  </span>
                )}
                {vacancy.experience && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {vacancy.experience}
                  </span>
                )}
                {vacancy.applicationDeadline && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                    Deadline:{" "}
                    {new Date(
                      vacancy.applicationDeadline
                    ).toLocaleDateString()}
                  </span>
                )}
              </div>

              <Link
                href={`/vacancies/${vacancy._id?.toString()}`}
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
              >
                View & Apply
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
