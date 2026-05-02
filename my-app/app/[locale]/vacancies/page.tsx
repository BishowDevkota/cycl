"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Vacancy } from "@/services/vacancy-service";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";

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

  const departments = Array.from(new Set(vacancies.map((v) => v.department)));

  if (loading) {
    return (
      <PublicPageShell
        imageUrl="/banner/banner.jpg"
        eyebrow="Careers"
        title="Open Positions"
        description="Browse current openings and find the role that matches your skills and experience."
      >
        <section className="bg-white p-6 sm:p-8">
          <p className="text-lg text-slate-600">Loading vacancies...</p>
        </section>
      </PublicPageShell>
    );
  }

  return (
    <PublicPageShell
      imageUrl="/banner/banner.jpg"
      eyebrow="Careers"
      title="Open Positions"
      description="Browse current openings and find the role that matches your skills and experience."
    >
      <section className="bg-white p-6 sm:p-8">
        <SectionHeading
          eyebrow="Current Openings"
          title="Available Vacancies"
          description={`${filteredVacancies.length} job${filteredVacancies.length !== 1 ? "s" : ""} available`}
        />

        {error && (
          <div className="border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="mb-8 border border-[#d6e6ed] bg-[#f9fcfe] p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.18em] text-teal-deep">
                Search Jobs
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, location..."
                className="w-full border border-[#cfdfe6] px-3 py-2 outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.18em] text-teal-deep">
                Filter by Department
              </label>
              <select
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="w-full border border-[#cfdfe6] px-3 py-2 outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
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
          <div className="border border-[#d6e6ed] bg-[#f9fcfe] px-6 py-10 text-center text-slate-500">
            <p className="mb-4">No vacancies found matching your criteria.</p>
            {searchTerm || filterDept ? (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterDept("");
                }}
                className="font-semibold text-teal-deep underline decoration-[#f5ad4a] underline-offset-4"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVacancies.map((vacancy) => (
              <article
                key={vacancy._id?.toString()}
                className="border border-[#d6e6ed] bg-white p-6 transition hover:border-[#bcd7e2]"
              >
                <div className="mb-3 border-l-4 border-[#f5ad4a] pl-4">
                  <h2 className="text-2xl font-bold text-[#123451]">
                    {vacancy.title}
                  </h2>
                  <p className="text-slate-600">
                    {vacancy.department} • {vacancy.location}
                  </p>
                </div>

                <p className="mb-4 line-clamp-3 text-slate-700">
                  {vacancy.description}
                </p>

                <div className="mb-4 flex flex-wrap gap-3">
                  {vacancy.salary && (
                    <span className="border border-[#cbdfe5] bg-[#f4fafb] px-3 py-1 text-sm text-teal-deep">
                      {vacancy.salary}
                    </span>
                  )}
                  {vacancy.experience && (
                    <span className="border border-[#cbdfe5] bg-[#f4fafb] px-3 py-1 text-sm text-teal-deep">
                      {vacancy.experience}
                    </span>
                  )}
                  {vacancy.applicationDeadline && (
                    <span className="border border-[#cbdfe5] bg-[#f4fafb] px-3 py-1 text-sm text-teal-deep">
                      Deadline: {new Date(vacancy.applicationDeadline).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <Link
                  href={`/vacancies/${vacancy._id?.toString()}`}
                  className="inline-flex border border-[#0d837f] bg-[#0d837f] px-6 py-2 font-medium text-white transition hover:bg-[#08716e]"
                >
                  View & Apply
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </PublicPageShell>
  );
}
